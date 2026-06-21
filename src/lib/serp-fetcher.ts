// SERP page fetcher — pulls title, meta description, OG tags, canonical,
// favicon, and schema indicators from a live URL so the SERP previewer
// can autofill the form and accurately predict which rich results are eligible.
//
// SSRF protection: every fetch (and every redirect target) is resolved via DNS
// and its IPs checked against private/reserved ranges before we attempt a
// network connection. Redirects are followed manually so a public hostname
// can't 302 us into internal infra.

import { lookup } from 'node:dns/promises';

const FETCH_TIMEOUT_MS = 10_000;
const MAX_BODY_BYTES = 2 * 1024 * 1024;
const MAX_REDIRECTS = 5;
const MAX_SCHEMA_DEPTH = 200;

export interface SerpFetchResult {
  url: string;
  finalUrl: string;
  httpStatus: number;
  hostname: string;
  pathSegments: string[];
  title?: string;
  metaDescription?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  canonical?: string;
  faviconUrl: string;
  publishDate?: string;
  modifiedDate?: string;
  schemaTypes: string[];
  hasArticle: boolean;
  hasFaq: boolean;
  hasReview: boolean;
  hasProduct: boolean;
  hasBreadcrumb: boolean;
  hasLocalBusiness: boolean;
  ratingValue?: number;
  reviewCount?: number;
  faqQuestions: string[];
  h1?: string;
  durationMs: number;
}

// ============ HTML helpers ============
function decode(s: string): string {
  return s
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)));
}

function stripTags(html: string): string {
  return decode(
    html
      .replace(/<script[\s\S]*?<\/script>/gi, ' ')
      .replace(/<style[\s\S]*?<\/style>/gi, ' ')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
  );
}

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function extractTitle(html: string): string | undefined {
  const m = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  return m ? stripTags(m[1]) : undefined;
}

function extractMeta(html: string, name: string): string | undefined {
  const re = new RegExp(
    `<meta\\b[^>]*?(?:name|property)\\s*=\\s*["']${escapeRegex(name)}["'][^>]*?>`,
    'i'
  );
  const m = html.match(re);
  if (!m) return undefined;
  const c = m[0].match(/content\s*=\s*["']([^"']*)["']/i);
  return c ? decode(c[1].trim()) : undefined;
}

function extractCanonical(html: string, origin: string): string | undefined {
  const m = html.match(
    /<link[^>]+rel\s*=\s*["']canonical["'][^>]+href\s*=\s*["']([^"']+)["']/i
  );
  if (!m) return undefined;
  try {
    const u = new URL(decode(m[1]), origin);
    if (u.protocol !== 'http:' && u.protocol !== 'https:') return undefined;
    return u.toString();
  } catch {
    return undefined;
  }
}

function extractFavicon(html: string, origin: string): string {
  const candidates = [
    /<link[^>]+rel\s*=\s*["']apple-touch-icon["'][^>]+href\s*=\s*["']([^"']+)["']/i,
    /<link[^>]+rel\s*=\s*["'](?:shortcut\s+)?icon["'][^>]+href\s*=\s*["']([^"']+)["']/i,
  ];
  for (const re of candidates) {
    const m = html.match(re);
    if (m) {
      try {
        const u = new URL(decode(m[1]), origin);
        if (u.protocol === 'http:' || u.protocol === 'https:') return u.toString();
      } catch {
        // fall through
      }
    }
  }
  return `${origin}/favicon.ico`;
}

function extractH1(html: string): string | undefined {
  const m = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
  return m ? stripTags(m[1]) : undefined;
}

function extractJsonLd(html: string): unknown[] {
  const re = /<script[^>]+type\s*=\s*["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  const out: unknown[] = [];
  for (const m of Array.from(html.matchAll(re))) {
    try {
      const parsed = JSON.parse(m[1].trim());
      if (Array.isArray(parsed)) out.push(...parsed);
      else out.push(parsed);
    } catch {
      // skip invalid
    }
  }
  return out;
}

// Iterative depth-limited walk so a deeply-nested JSON-LD payload can't
// blow the stack (or stall the request thread).
function walkSchema(blocks: unknown[], visit: (node: Record<string, unknown>) => void): void {
  const seen = new WeakSet<object>();
  const stack: { node: unknown; depth: number }[] = blocks.map((b) => ({ node: b, depth: 0 }));
  while (stack.length) {
    const { node, depth } = stack.pop()!;
    if (depth > MAX_SCHEMA_DEPTH) continue;
    if (!node || typeof node !== 'object') continue;
    if (seen.has(node as object)) continue;
    seen.add(node as object);
    const obj = node as Record<string, unknown>;
    visit(obj);
    if (Array.isArray(obj['@graph'])) {
      for (const g of obj['@graph']) stack.push({ node: g, depth: depth + 1 });
    }
    for (const v of Object.values(obj)) {
      if (Array.isArray(v)) for (const x of v) stack.push({ node: x, depth: depth + 1 });
      else if (v && typeof v === 'object') stack.push({ node: v, depth: depth + 1 });
    }
  }
}

function flattenSchemaTypes(blocks: unknown[]): string[] {
  const types = new Set<string>();
  walkSchema(blocks, (obj) => {
    const t = obj['@type'];
    if (typeof t === 'string') types.add(t);
    else if (Array.isArray(t)) t.forEach((x) => typeof x === 'string' && types.add(x));
  });
  return Array.from(types);
}

function extractRating(blocks: unknown[]): { value?: number; count?: number } {
  let value: number | undefined;
  let count: number | undefined;
  walkSchema(blocks, (obj) => {
    if (obj['@type'] === 'AggregateRating' || obj['@type'] === 'Rating') {
      if (value === undefined && obj['ratingValue'] !== undefined) {
        const n = Number(obj['ratingValue']);
        if (!Number.isNaN(n)) value = n;
      }
      if (count === undefined) {
        const raw = obj['reviewCount'] ?? obj['ratingCount'];
        if (raw !== undefined) {
          const n = Number(raw);
          if (!Number.isNaN(n)) count = n;
        }
      }
    }
  });
  return { value, count };
}

function extractFaqQuestions(blocks: unknown[]): string[] {
  const qs: string[] = [];
  walkSchema(blocks, (obj) => {
    if (obj['@type'] === 'Question' && typeof obj['name'] === 'string') {
      qs.push(obj['name'] as string);
    }
  });
  return qs.slice(0, 8);
}

function findInSchema(blocks: unknown[], key: string): string | undefined {
  let found: string | undefined;
  walkSchema(blocks, (obj) => {
    if (found) return;
    if (typeof obj[key] === 'string') found = obj[key] as string;
  });
  return found;
}

// ============ SSRF guard ============
function isPrivateV4(bytes: number[]): boolean {
  if (bytes.length !== 4) return true; // refuse malformed
  const [a, b] = bytes;
  if (a === 0) return true; // 0.0.0.0/8
  if (a === 10) return true; // 10.0.0.0/8
  if (a === 127) return true; // 127.0.0.0/8 loopback
  if (a === 169 && b === 254) return true; // 169.254.0.0/16 link-local + AWS metadata
  if (a === 172 && b >= 16 && b <= 31) return true; // 172.16.0.0/12
  if (a === 192 && b === 168) return true; // 192.168.0.0/16
  if (a === 100 && (b & 0xc0) === 0x40) return true; // 100.64.0.0/10 CGNAT
  if (a === 198 && (b === 18 || b === 19)) return true; // 198.18.0.0/15 benchmark
  if ((a & 0xf0) === 0xe0) return true; // 224.0.0.0/4 multicast
  if ((a & 0xf0) === 0xf0) return true; // 240.0.0.0/4 reserved
  return false;
}

function isPrivateV6(addr: string): boolean {
  const lower = addr.toLowerCase().replace(/%[^]*$/, ''); // strip zone id
  if (lower === '::1' || lower === '::') return true;

  // IPv4-mapped dotted: ::ffff:127.0.0.1
  const dotted = lower.match(/^(?:0*:)*ffff:([0-9.]+)$/);
  if (dotted) {
    const bytes = dotted[1].split('.').map((p) => parseInt(p, 10));
    if (bytes.length === 4 && bytes.every((b) => Number.isFinite(b))) {
      return isPrivateV4(bytes);
    }
  }
  // IPv4-mapped hex: ::ffff:7f00:1
  const hex = lower.match(/^(?:0*:)*ffff:([0-9a-f]{1,4}):([0-9a-f]{1,4})$/);
  if (hex) {
    const high = parseInt(hex[1], 16);
    const low = parseInt(hex[2], 16);
    if (!Number.isNaN(high) && !Number.isNaN(low)) {
      return isPrivateV4([(high >> 8) & 0xff, high & 0xff, (low >> 8) & 0xff, low & 0xff]);
    }
  }
  if (/^f[cd][0-9a-f]{0,2}:/.test(lower)) return true; // fc00::/7 unique-local
  if (/^fe[89ab][0-9a-f]?:/.test(lower)) return true; // fe80::/10 link-local
  if (/^ff[0-9a-f]{2}:/.test(lower)) return true; // ff00::/8 multicast
  return false;
}

async function assertSafeHost(hostname: string): Promise<void> {
  // First defence: refuse obvious local strings even before DNS.
  const lower = hostname.toLowerCase();
  if (lower === 'localhost' || lower.endsWith('.localhost') || lower.endsWith('.local')) {
    throw new Error('Refusing to fetch local hostname');
  }

  let addrs: { address: string; family: number }[];
  try {
    addrs = await lookup(hostname, { all: true, verbatim: true });
  } catch {
    throw new Error('Could not resolve hostname');
  }
  if (!addrs.length) throw new Error('No DNS records for hostname');

  for (const a of addrs) {
    if (a.family === 4) {
      const bytes = a.address.split('.').map((p) => parseInt(p, 10));
      if (bytes.length !== 4 || bytes.some((b) => Number.isNaN(b) || b < 0 || b > 255)) {
        throw new Error('Malformed IPv4');
      }
      if (isPrivateV4(bytes)) throw new Error('Refusing to fetch private address');
    } else if (a.family === 6) {
      if (isPrivateV6(a.address)) throw new Error('Refusing to fetch private address');
    } else {
      throw new Error('Unknown address family');
    }
  }
}

// Manual redirect loop so we can re-check every hop against the SSRF guard.
async function safeFetch(initial: URL): Promise<{ response: Response; finalUrl: URL }> {
  let current = initial;
  for (let hop = 0; hop <= MAX_REDIRECTS; hop++) {
    if (current.protocol !== 'http:' && current.protocol !== 'https:') {
      throw new Error('Only http/https URLs are allowed');
    }
    await assertSafeHost(current.hostname);

    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), FETCH_TIMEOUT_MS);
    let res: Response;
    try {
      res = await fetch(current.toString(), {
        redirect: 'manual',
        headers: {
          'User-Agent':
            'Mozilla/5.0 (compatible; HristijanNajcheskiSnippet/1.0; +https://hristijannajcheski.com/tools/serp-snippet-previewer/)',
          Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        },
        signal: ctrl.signal,
      });
    } finally {
      clearTimeout(timer);
    }

    if (res.status >= 300 && res.status < 400) {
      const loc = res.headers.get('location');
      if (!loc) return { response: res, finalUrl: current };
      let next: URL;
      try {
        next = new URL(loc, current);
      } catch {
        throw new Error('Invalid redirect target');
      }
      current = next;
      continue;
    }
    return { response: res, finalUrl: current };
  }
  throw new Error('Too many redirects');
}

async function readBodyCapped(res: Response): Promise<string> {
  const cl = Number(res.headers.get('content-length') || '0');
  if (cl && cl > MAX_BODY_BYTES * 5) {
    throw new Error('Response body too large');
  }
  const reader = res.body?.getReader();
  if (!reader) return res.text();

  const chunks: Uint8Array[] = [];
  let total = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    if (total + value.length > MAX_BODY_BYTES) {
      const remaining = MAX_BODY_BYTES - total;
      if (remaining > 0) chunks.push(value.subarray(0, remaining));
      total = MAX_BODY_BYTES;
      break;
    }
    chunks.push(value);
    total += value.length;
  }
  const merged = new Uint8Array(total);
  let off = 0;
  for (const c of chunks) {
    merged.set(c, off);
    off += c.length;
  }
  return new TextDecoder('utf-8', { fatal: false }).decode(merged);
}

export async function fetchPage(rawUrl: string): Promise<SerpFetchResult> {
  const start = Date.now();
  let url: URL;
  try {
    url = new URL(rawUrl.startsWith('http') ? rawUrl : `https://${rawUrl}`);
  } catch {
    throw new Error('Invalid URL');
  }
  if (url.protocol !== 'http:' && url.protocol !== 'https:') {
    throw new Error('Only http/https URLs are allowed');
  }

  let response: Response;
  let finalUrlObj: URL;
  try {
    const out = await safeFetch(url);
    response = out.response;
    finalUrlObj = out.finalUrl;
  } catch (e: unknown) {
    throw new Error(`Could not fetch URL: ${e instanceof Error ? e.message : 'unknown'}`);
  }

  let html: string;
  try {
    html = await readBodyCapped(response);
  } catch (e: unknown) {
    throw new Error(`Could not read body: ${e instanceof Error ? e.message : 'unknown'}`);
  }

  const finalUrl = finalUrlObj.toString();
  const httpStatus = response.status;

  const title = extractTitle(html);
  const metaDescription = extractMeta(html, 'description');
  const ogTitle = extractMeta(html, 'og:title');
  const ogDescription = extractMeta(html, 'og:description');
  const ogImageRaw = extractMeta(html, 'og:image');
  const ogImage = (() => {
    if (!ogImageRaw) return undefined;
    try {
      const u = new URL(ogImageRaw, finalUrlObj.origin);
      if (u.protocol !== 'http:' && u.protocol !== 'https:') return undefined;
      return u.toString();
    } catch {
      return undefined;
    }
  })();
  const canonical = extractCanonical(html, finalUrlObj.origin);
  const faviconUrl = extractFavicon(html, finalUrlObj.origin);
  const publishDate =
    extractMeta(html, 'article:published_time') || extractMeta(html, 'og:article:published_time');
  const modifiedDate =
    extractMeta(html, 'article:modified_time') || extractMeta(html, 'og:article:modified_time');
  const h1 = extractH1(html);

  const jsonld = extractJsonLd(html);
  const schemaTypes = flattenSchemaTypes(jsonld);
  const hasArticle = schemaTypes.some((t) => /Article|BlogPosting|NewsArticle/.test(t));
  const hasFaq = schemaTypes.includes('FAQPage') || schemaTypes.includes('Question');
  const hasReview = schemaTypes.some((t) => /Review|AggregateRating/.test(t));
  const hasProduct = schemaTypes.includes('Product');
  const hasBreadcrumb = schemaTypes.includes('BreadcrumbList');
  const hasLocalBusiness = schemaTypes.some((t) => /LocalBusiness|Organization/.test(t));

  const rating = extractRating(jsonld);
  const faqQuestions = extractFaqQuestions(jsonld);

  const schemaPub = findInSchema(jsonld, 'datePublished');
  const schemaMod = findInSchema(jsonld, 'dateModified');

  return {
    url: rawUrl,
    finalUrl,
    httpStatus,
    hostname: finalUrlObj.hostname.replace(/^www\./, ''),
    pathSegments: finalUrlObj.pathname.split('/').filter(Boolean),
    title,
    metaDescription,
    ogTitle,
    ogDescription,
    ogImage,
    canonical,
    faviconUrl,
    publishDate: publishDate || schemaPub,
    modifiedDate: modifiedDate || schemaMod,
    schemaTypes,
    hasArticle,
    hasFaq,
    hasReview,
    hasProduct,
    hasBreadcrumb,
    hasLocalBusiness,
    ratingValue: rating.value,
    reviewCount: rating.count,
    faqQuestions,
    h1,
    durationMs: Date.now() - start,
  };
}

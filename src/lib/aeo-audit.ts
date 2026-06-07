// AEO Readiness Audit — fetches a URL, parses the HTML, scores it
// against criteria that matter for AI Overviews, ChatGPT/Perplexity citation,
// and traditional SEO. Pure server-side, no Claude needed.

export interface CheckResult {
  id: string;
  category: 'structure' | 'schema' | 'authority' | 'content' | 'technical';
  label: string;
  status: 'pass' | 'warn' | 'fail';
  weight: number;
  detail: string;
  fix?: string;
}

export interface AuditReport {
  url: string;
  finalUrl: string;
  fetchedAt: string;
  durationMs: number;
  httpStatus: number;
  grade: 'A' | 'B' | 'C' | 'D' | 'F';
  score: number;
  maxScore: number;
  passes: number;
  warns: number;
  fails: number;
  topIssues: CheckResult[];
  checks: CheckResult[];
  meta: {
    title?: string;
    description?: string;
    h1?: string;
    h2Count: number;
    h3Count: number;
    wordCount: number;
    schemaTypes: string[];
    canonical?: string;
    publishDate?: string;
    modifiedDate?: string;
    author?: string;
    internalLinks: number;
    externalLinks: number;
    imageCount: number;
    imagesMissingAlt: number;
    faqQuestions: number;
  };
}

const QUESTION_STARTERS = /^\s*(what|who|why|when|where|how|which|is|are|can|do|does|should|could|will)\b/i;

function stripHtml(html: string): string {
  return html.replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, ' ')
    .trim();
}

function matchAll(html: string, re: RegExp): RegExpMatchArray[] {
  return Array.from(html.matchAll(re));
}

function extractTitle(html: string): string | undefined {
  const m = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  return m ? stripHtml(m[1]) : undefined;
}

function extractMeta(html: string, name: string): string | undefined {
  const re = new RegExp(`<meta[^>]+(?:name|property)\\s*=\\s*["']${name}["'][^>]*>`, 'i');
  const m = html.match(re);
  if (!m) return undefined;
  const c = m[0].match(/content\s*=\s*["']([^"']*)["']/i);
  return c ? c[1].trim() : undefined;
}

function extractH(html: string, level: 1 | 2 | 3): string[] {
  const re = new RegExp(`<h${level}[^>]*>([\\s\\S]*?)<\\/h${level}>`, 'gi');
  return matchAll(html, re).map((m) => stripHtml(m[1])).filter(Boolean);
}

function extractLinks(html: string, origin: string): { internal: number; external: number } {
  const re = /<a[^>]+href\s*=\s*["']([^"']+)["'][^>]*>/gi;
  let internal = 0;
  let external = 0;
  for (const m of matchAll(html, re)) {
    const href = m[1];
    if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) continue;
    try {
      const u = new URL(href, origin);
      if (u.origin === origin) internal++;
      else external++;
    } catch {
      // skip malformed
    }
  }
  return { internal, external };
}

function extractImages(html: string): { total: number; missingAlt: number } {
  const re = /<img\b[^>]*>/gi;
  let total = 0;
  let missingAlt = 0;
  for (const m of matchAll(html, re)) {
    total++;
    const alt = m[0].match(/\balt\s*=\s*["']([^"']*)["']/i);
    if (!alt || !alt[1].trim()) missingAlt++;
  }
  return { total, missingAlt };
}

function extractJsonLd(html: string): unknown[] {
  const re = /<script[^>]+type\s*=\s*["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  const out: unknown[] = [];
  for (const m of matchAll(html, re)) {
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

function flattenSchemaTypes(blocks: unknown[]): string[] {
  const types = new Set<string>();
  const walk = (node: unknown) => {
    if (!node || typeof node !== 'object') return;
    const obj = node as Record<string, unknown>;
    const t = obj['@type'];
    if (typeof t === 'string') types.add(t);
    else if (Array.isArray(t)) t.forEach((x) => typeof x === 'string' && types.add(x));
    if (Array.isArray(obj['@graph'])) obj['@graph'].forEach(walk);
    for (const v of Object.values(obj)) {
      if (v && typeof v === 'object') walk(v);
    }
  };
  blocks.forEach(walk);
  return Array.from(types);
}

function findInSchema(blocks: unknown[], key: string): string | undefined {
  let found: string | undefined;
  const walk = (node: unknown) => {
    if (found || !node || typeof node !== 'object') return;
    const obj = node as Record<string, unknown>;
    if (typeof obj[key] === 'string') {
      found = obj[key] as string;
      return;
    }
    if (key === 'author' && obj.author) {
      const a = obj.author as Record<string, unknown> | Record<string, unknown>[];
      if (Array.isArray(a) && a[0]?.name) found = String(a[0].name);
      else if ((a as Record<string, unknown>).name) found = String((a as Record<string, unknown>).name);
    }
    if (Array.isArray(obj['@graph'])) obj['@graph'].forEach(walk);
    for (const v of Object.values(obj)) if (v && typeof v === 'object') walk(v);
  };
  blocks.forEach(walk);
  return found;
}

function countFaqQuestions(blocks: unknown[]): number {
  let n = 0;
  const walk = (node: unknown) => {
    if (!node || typeof node !== 'object') return;
    const obj = node as Record<string, unknown>;
    if (obj['@type'] === 'Question') n++;
    if (Array.isArray(obj['mainEntity'])) n += (obj['mainEntity'] as unknown[]).filter((x) => {
      const r = x as Record<string, unknown>;
      return r['@type'] === 'Question';
    }).length;
    if (Array.isArray(obj['@graph'])) obj['@graph'].forEach(walk);
    for (const v of Object.values(obj)) if (v && typeof v === 'object') walk(v);
  };
  blocks.forEach(walk);
  return n;
}

function gradeFromPct(pct: number): 'A' | 'B' | 'C' | 'D' | 'F' {
  if (pct >= 90) return 'A';
  if (pct >= 75) return 'B';
  if (pct >= 60) return 'C';
  if (pct >= 45) return 'D';
  return 'F';
}

export async function runAudit(rawUrl: string): Promise<AuditReport> {
  const start = Date.now();
  let url: URL;
  try {
    url = new URL(rawUrl.startsWith('http') ? rawUrl : `https://${rawUrl}`);
  } catch {
    throw new Error('Invalid URL');
  }

  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 12_000);
  let html = '';
  let finalUrl = url.toString();
  let httpStatus = 0;
  try {
    const res = await fetch(url.toString(), {
      redirect: 'follow',
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; HristijanNajcheskiAudit/1.0; +https://hristijannajcheski.com/tools/aeo-readiness-audit/)',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      },
      signal: ctrl.signal,
    });
    httpStatus = res.status;
    finalUrl = res.url || finalUrl;
    html = await res.text();
  } catch (e: unknown) {
    clearTimeout(timer);
    throw new Error(`Could not fetch URL: ${e instanceof Error ? e.message : 'unknown'}`);
  }
  clearTimeout(timer);

  const title = extractTitle(html);
  const description = extractMeta(html, 'description');
  const canonical = (html.match(/<link[^>]+rel\s*=\s*["']canonical["'][^>]+href\s*=\s*["']([^"']+)["']/i) || [])[1];
  const viewport = extractMeta(html, 'viewport');
  const robotsMeta = extractMeta(html, 'robots');
  const ogTitle = extractMeta(html, 'og:title');
  const h1s = extractH(html, 1);
  const h2s = extractH(html, 2);
  const h3s = extractH(html, 3);
  const links = extractLinks(html, url.origin);
  const imgs = extractImages(html);
  const jsonld = extractJsonLd(html);
  const schemaTypes = flattenSchemaTypes(jsonld);
  const publishDate = findInSchema(jsonld, 'datePublished') || extractMeta(html, 'article:published_time');
  const modifiedDate = findInSchema(jsonld, 'dateModified') || extractMeta(html, 'article:modified_time');
  const author = findInSchema(jsonld, 'author');
  const faqQuestions = countFaqQuestions(jsonld);

  // word count from body text
  const bodyText = stripHtml(html.replace(/<head[\s\S]*?<\/head>/i, ' '));
  const wordCount = bodyText ? bodyText.split(/\s+/).filter(Boolean).length : 0;

  const questionHeadings = [...h2s, ...h3s].filter((t) => QUESTION_STARTERS.test(t)).length;
  const totalHeadings = h2s.length + h3s.length;

  const checks: CheckResult[] = [];

  // === STRUCTURE ===
  checks.push({
    id: 'title',
    category: 'structure',
    label: '<title> tag present and well-sized',
    weight: 4,
    status: !title ? 'fail' : title.length < 20 || title.length > 65 ? 'warn' : 'pass',
    detail: title ? `"${title}" (${title.length} chars)` : 'Missing <title>',
    fix: !title
      ? 'Add a unique <title> tag — first thing Google and AI engines read.'
      : title.length > 65
      ? 'Trim to under 60 chars so it does not truncate in SERP and AI Overview.'
      : title.length < 20
      ? 'Expand the title — too short titles look thin to both Google and LLMs.'
      : undefined,
  });

  checks.push({
    id: 'meta-description',
    category: 'structure',
    label: 'Meta description present',
    weight: 3,
    status: !description ? 'fail' : description.length < 80 || description.length > 160 ? 'warn' : 'pass',
    detail: description ? `${description.length} chars` : 'Missing',
    fix: !description
      ? 'Add a meta description — it is the snippet AI engines often summarize.'
      : description.length > 160
      ? 'Trim to ~155 chars to avoid truncation.'
      : description.length < 80
      ? 'Expand — too short reads as low-effort to engines.'
      : undefined,
  });

  checks.push({
    id: 'h1',
    category: 'structure',
    label: 'Exactly one H1, matches intent',
    weight: 3,
    status: h1s.length === 1 ? 'pass' : h1s.length === 0 ? 'fail' : 'warn',
    detail: h1s.length === 1 ? `"${h1s[0]}"` : h1s.length === 0 ? 'No H1' : `${h1s.length} H1s found`,
    fix:
      h1s.length === 0
        ? 'Add a single, descriptive H1 — AI engines lean on it heavily for topical summary.'
        : h1s.length > 1
        ? 'Reduce to a single H1; the rest should be H2/H3.'
        : undefined,
  });

  checks.push({
    id: 'q-headings',
    category: 'structure',
    label: 'Headings phrased as questions',
    weight: 4,
    status: totalHeadings === 0 ? 'fail' : questionHeadings >= 3 ? 'pass' : questionHeadings >= 1 ? 'warn' : 'fail',
    detail: `${questionHeadings} of ${totalHeadings} H2/H3 start with a question word`,
    fix:
      questionHeadings < 3
        ? 'Rephrase 3+ subheadings as direct questions ("How does…", "What is…"). LLMs extract those as Q&A pairs.'
        : undefined,
  });

  // === SCHEMA ===
  const hasArticle = schemaTypes.some((t) => /Article|BlogPosting|NewsArticle/.test(t));
  const hasFaq = schemaTypes.includes('FAQPage') || faqQuestions > 0;
  const hasOrg = schemaTypes.some((t) => /Organization|LocalBusiness/.test(t));
  const hasPerson = schemaTypes.includes('Person') || !!author;
  const hasBreadcrumb = schemaTypes.includes('BreadcrumbList');

  checks.push({
    id: 'schema-article',
    category: 'schema',
    label: 'Article / BlogPosting schema',
    weight: 4,
    status: hasArticle ? 'pass' : 'fail',
    detail: hasArticle ? `Found: ${schemaTypes.filter((t) => /Article|BlogPosting|NewsArticle/.test(t)).join(', ')}` : 'Missing',
    fix: !hasArticle ? 'Add Article or BlogPosting JSON-LD — biggest single lift for AI citation eligibility.' : undefined,
  });

  checks.push({
    id: 'schema-faq',
    category: 'schema',
    label: 'FAQPage schema with Question entities',
    weight: 4,
    status: hasFaq ? 'pass' : 'fail',
    detail: hasFaq ? `${faqQuestions} Question entit${faqQuestions === 1 ? 'y' : 'ies'}` : 'No FAQ schema',
    fix: !hasFaq
      ? 'Add FAQPage schema — direct ticket into Google AI Overview and "People Also Ask".'
      : undefined,
  });

  checks.push({
    id: 'schema-author',
    category: 'schema',
    label: 'Author identified (E-E-A-T)',
    weight: 3,
    status: hasPerson ? 'pass' : 'fail',
    detail: hasPerson ? (author ? `Author: ${author}` : 'Person schema present') : 'No author signal',
    fix: !hasPerson
      ? 'Add Person/author schema with name + sameAs links. AI engines prefer cited, identifiable authors.'
      : undefined,
  });

  checks.push({
    id: 'schema-org',
    category: 'schema',
    label: 'Organization / LocalBusiness schema',
    weight: 2,
    status: hasOrg ? 'pass' : 'warn',
    detail: hasOrg ? schemaTypes.filter((t) => /Organization|LocalBusiness/.test(t)).join(', ') : 'Missing on this page',
    fix: !hasOrg ? 'Add Organization schema sitewide so AI engines know who publishes the content.' : undefined,
  });

  checks.push({
    id: 'schema-breadcrumb',
    category: 'schema',
    label: 'BreadcrumbList schema',
    weight: 1,
    status: hasBreadcrumb ? 'pass' : 'warn',
    detail: hasBreadcrumb ? 'Present' : 'Missing',
    fix: !hasBreadcrumb ? 'Add BreadcrumbList schema — improves SERP layout and AI context.' : undefined,
  });

  // === AUTHORITY / FRESHNESS ===
  checks.push({
    id: 'dates',
    category: 'authority',
    label: 'Publish + modified dates exposed',
    weight: 2,
    status: publishDate && modifiedDate ? 'pass' : publishDate || modifiedDate ? 'warn' : 'fail',
    detail: [publishDate ? `published ${publishDate}` : '', modifiedDate ? `modified ${modifiedDate}` : ''].filter(Boolean).join(' · ') || 'None found',
    fix:
      !publishDate || !modifiedDate
        ? 'Expose datePublished and dateModified in JSON-LD. Freshness is a strong AI ranking signal in 2026.'
        : undefined,
  });

  checks.push({
    id: 'external-citations',
    category: 'authority',
    label: 'External citations / outbound links',
    weight: 2,
    status: links.external >= 3 ? 'pass' : links.external >= 1 ? 'warn' : 'fail',
    detail: `${links.external} outbound link${links.external === 1 ? '' : 's'}`,
    fix:
      links.external < 3
        ? 'Link to 3+ authoritative sources — both Google E-E-A-T and LLM verification logic reward citation behavior.'
        : undefined,
  });

  // === CONTENT ===
  checks.push({
    id: 'word-count',
    category: 'content',
    label: 'Sufficient depth (word count)',
    weight: 3,
    status: wordCount >= 800 ? 'pass' : wordCount >= 400 ? 'warn' : 'fail',
    detail: `${wordCount} words`,
    fix:
      wordCount < 800
        ? 'Aim for 800+ words of original analysis. Thin pages rarely get cited by AI Overviews.'
        : undefined,
  });

  checks.push({
    id: 'internal-linking',
    category: 'content',
    label: 'Internal linking',
    weight: 2,
    status: links.internal >= 5 ? 'pass' : links.internal >= 2 ? 'warn' : 'fail',
    detail: `${links.internal} internal link${links.internal === 1 ? '' : 's'}`,
    fix:
      links.internal < 5
        ? 'Add 5+ internal links to related pages — improves crawl + topical context for LLMs.'
        : undefined,
  });

  checks.push({
    id: 'images-alt',
    category: 'content',
    label: 'Images have alt text',
    weight: 1,
    status: imgs.total === 0 ? 'warn' : imgs.missingAlt === 0 ? 'pass' : imgs.missingAlt / imgs.total < 0.2 ? 'warn' : 'fail',
    detail: imgs.total === 0 ? 'No images on page' : `${imgs.missingAlt} of ${imgs.total} images missing alt`,
    fix: imgs.missingAlt > 0 ? 'Add descriptive alt text to all images — read by both screen readers and image-aware LLMs.' : undefined,
  });

  // === TECHNICAL ===
  checks.push({
    id: 'http-status',
    category: 'technical',
    label: 'Page returns HTTP 200',
    weight: 3,
    status: httpStatus === 200 ? 'pass' : httpStatus >= 300 && httpStatus < 400 ? 'warn' : 'fail',
    detail: `HTTP ${httpStatus}`,
    fix: httpStatus !== 200 ? 'Resolve the redirect chain or status error — anything non-200 weakens trust.' : undefined,
  });

  checks.push({
    id: 'canonical',
    category: 'technical',
    label: 'Canonical URL set',
    weight: 2,
    status: canonical ? 'pass' : 'fail',
    detail: canonical || 'No canonical tag',
    fix: !canonical ? 'Add <link rel="canonical">. Prevents duplicate-content ambiguity for both Google and LLMs.' : undefined,
  });

  checks.push({
    id: 'viewport',
    category: 'technical',
    label: 'Mobile viewport set',
    weight: 1,
    status: viewport ? 'pass' : 'fail',
    detail: viewport || 'Missing',
    fix: !viewport ? 'Add <meta name="viewport" content="width=device-width, initial-scale=1">.' : undefined,
  });

  checks.push({
    id: 'https',
    category: 'technical',
    label: 'Served over HTTPS',
    weight: 2,
    status: url.protocol === 'https:' ? 'pass' : 'fail',
    detail: url.protocol === 'https:' ? 'HTTPS' : 'HTTP',
    fix: url.protocol !== 'https:' ? 'Migrate to HTTPS. Non-HTTPS pages are deprioritized everywhere.' : undefined,
  });

  checks.push({
    id: 'robots-indexable',
    category: 'technical',
    label: 'Indexable (no noindex)',
    weight: 3,
    status: robotsMeta && /noindex/i.test(robotsMeta) ? 'fail' : 'pass',
    detail: robotsMeta || 'no robots meta (defaults to indexable)',
    fix: robotsMeta && /noindex/i.test(robotsMeta) ? 'Remove noindex if you want the page in Google + AI engines.' : undefined,
  });

  checks.push({
    id: 'og',
    category: 'technical',
    label: 'Open Graph metadata',
    weight: 1,
    status: ogTitle ? 'pass' : 'warn',
    detail: ogTitle ? `og:title = "${ogTitle}"` : 'Missing og:title',
    fix: !ogTitle ? 'Add og:title, og:description, og:image — improves how the page renders when shared and how AI engines preview it.' : undefined,
  });

  // Tally
  let score = 0;
  let maxScore = 0;
  let passes = 0;
  let warns = 0;
  let fails = 0;
  for (const c of checks) {
    maxScore += c.weight;
    if (c.status === 'pass') {
      score += c.weight;
      passes++;
    } else if (c.status === 'warn') {
      score += c.weight * 0.5;
      warns++;
    } else {
      fails++;
    }
  }

  const pct = maxScore ? (score / maxScore) * 100 : 0;
  const grade = gradeFromPct(pct);

  const topIssues = checks
    .filter((c) => c.status !== 'pass' && c.fix)
    .sort((a, b) => b.weight - a.weight)
    .slice(0, 5);

  return {
    url: rawUrl,
    finalUrl,
    fetchedAt: new Date().toISOString(),
    durationMs: Date.now() - start,
    httpStatus,
    grade,
    score: Math.round(score),
    maxScore,
    passes,
    warns,
    fails,
    topIssues,
    checks,
    meta: {
      title,
      description,
      h1: h1s[0],
      h2Count: h2s.length,
      h3Count: h3s.length,
      wordCount,
      schemaTypes,
      canonical,
      publishDate,
      modifiedDate,
      author,
      internalLinks: links.internal,
      externalLinks: links.external,
      imageCount: imgs.total,
      imagesMissingAlt: imgs.missingAlt,
      faqQuestions,
    },
  };
}

export function renderReportHtml(report: AuditReport): string {
  const catLabels: Record<CheckResult['category'], string> = {
    structure: 'Content structure',
    schema: 'Structured data (schema)',
    authority: 'Authority & freshness',
    content: 'Content depth',
    technical: 'Technical foundation',
  };
  const cats: CheckResult['category'][] = ['structure', 'schema', 'authority', 'content', 'technical'];
  const dot = (s: CheckResult['status']) =>
    s === 'pass'
      ? '<span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:#10b981;margin-right:8px;"></span>'
      : s === 'warn'
      ? '<span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:#f59e0b;margin-right:8px;"></span>'
      : '<span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:#ef4444;margin-right:8px;"></span>';
  const gradeColor: Record<string, string> = { A: '#10b981', B: '#10b981', C: '#f59e0b', D: '#f97316', F: '#ef4444' };
  let html = `
    <div style="display:flex;align-items:center;gap:16px;margin-bottom:8px;">
      <div style="font-size:48px;font-weight:900;line-height:1;color:${gradeColor[report.grade]};">${report.grade}</div>
      <div>
        <div style="font-weight:700;font-size:18px;">${report.score}/${report.maxScore} points</div>
        <div style="color:#6b7280;font-size:14px;">${report.passes} pass · ${report.warns} warn · ${report.fails} fail</div>
      </div>
    </div>
    <div style="margin-bottom:16px;color:#374151;font-size:14px;">Audited: <a href="${report.finalUrl}" style="color:#3b82f6;">${report.finalUrl}</a></div>
    <h2 style="margin:24px 0 8px;font-size:18px;">Top issues to fix first</h2>
    <ol style="padding-left:20px;color:#1f2937;line-height:1.7;font-size:14px;">
      ${report.topIssues.map((c) => `<li><strong>${c.label}</strong> — ${c.fix || c.detail}</li>`).join('')}
    </ol>
  `;
  for (const cat of cats) {
    const items = report.checks.filter((c) => c.category === cat);
    if (!items.length) continue;
    html += `<h2 style="margin:24px 0 8px;font-size:16px;color:#0b1220;">${catLabels[cat]}</h2><ul style="list-style:none;padding:0;margin:0;">`;
    for (const c of items) {
      html += `<li style="padding:8px 0;border-bottom:1px solid #eef0f4;font-size:14px;">${dot(c.status)}<strong>${c.label}</strong><br /><span style="color:#6b7280;margin-left:18px;">${c.detail}</span>${c.fix ? `<br /><span style="color:#374151;margin-left:18px;">→ ${c.fix}</span>` : ''}</li>`;
    }
    html += `</ul>`;
  }
  return html;
}

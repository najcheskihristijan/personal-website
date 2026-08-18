/**
 * Site-level AI visibility checks.
 *
 * Deliberately separate from lib/aeo-audit.ts. That module grades a single PAGE
 * against 21 on-page signals and already backs the AEO Readiness Audit tool;
 * changing it would move the scores that tool has been reporting. This one asks
 * a different question: across the whole SITE, are answer engines allowed in,
 * and is there anything here shaped for them to cite?
 *
 * Nothing here needs an API key, so it runs even when the engine-citation half
 * of the checker is unconfigured.
 */

/** User agents that matter for answer engines, and what a block costs you. */
const AI_CRAWLERS = [
  { ua: 'GPTBot', engine: 'ChatGPT', note: 'OpenAI training and browsing' },
  { ua: 'OAI-SearchBot', engine: 'ChatGPT Search', note: 'OpenAI search index' },
  { ua: 'ClaudeBot', engine: 'Claude', note: 'Anthropic crawler' },
  { ua: 'PerplexityBot', engine: 'Perplexity', note: 'Perplexity index' },
  { ua: 'Google-Extended', engine: 'Gemini / AI Overviews', note: 'Google AI training' },
  { ua: 'CCBot', engine: 'Common Crawl', note: 'feeds many open models' },
  { ua: 'Bingbot', engine: 'Bing Copilot', note: 'Copilot answers ride the Bing index' },
] as const;

export type CheckStatus = 'pass' | 'warn' | 'fail';

export interface VisibilityCheck {
  id: string;
  label: string;
  status: CheckStatus;
  detail: string;
  /** What to do about it, in the site owner's terms. */
  fix?: string;
}

export interface CrawlerVerdict {
  ua: string;
  engine: string;
  allowed: boolean;
  reason: string;
}

export interface ReadinessReport {
  domain: string;
  origin: string;
  crawlers: CrawlerVerdict[];
  checks: VisibilityCheck[];
  /** 0-40, the readiness portion of the headline score. */
  score: number;
  maxScore: number;
}

const UA = 'Mozilla/5.0 (compatible; AIVisibilityChecker/1.0; +https://hristijannajcheski.com/tools/)';

async function get(url: string, timeoutMs = 8000): Promise<{ ok: boolean; status: number; body: string }> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { signal: controller.signal, headers: { 'User-Agent': UA }, redirect: 'follow' });
    const body = res.ok ? await res.text() : '';
    return { ok: res.ok, status: res.status, body };
  } catch {
    return { ok: false, status: 0, body: '' };
  } finally {
    clearTimeout(timer);
  }
}

export function normalizeOrigin(input: string): string {
  const withScheme = /^https?:\/\//i.test(input) ? input : `https://${input}`;
  const url = new URL(withScheme);
  return `${url.protocol}//${url.host}`;
}

/**
 * Minimal robots.txt evaluation for the site root.
 *
 * Real robots.txt parsing has more corners than this (wildcards, Allow
 * precedence, crawl-delay). We only answer one question: is this agent shut out
 * of the site root? A group matching the agent wins over the wildcard group,
 * which is the rule that actually decides it in practice.
 */
export function evaluateRobots(robotsTxt: string, ua: string): { allowed: boolean; reason: string } {
  if (!robotsTxt.trim()) return { allowed: true, reason: 'no robots.txt, so nothing is blocked' };

  const groups: { agents: string[]; disallows: string[]; allows: string[] }[] = [];
  let current: { agents: string[]; disallows: string[]; allows: string[] } | null = null;
  let lastLineWasAgent = false;

  for (const raw of robotsTxt.split('\n')) {
    const line = raw.split('#')[0].trim();
    if (!line) continue;
    const [rawKey, ...rest] = line.split(':');
    const key = rawKey.trim().toLowerCase();
    const value = rest.join(':').trim();

    if (key === 'user-agent') {
      if (!current || !lastLineWasAgent) {
        current = { agents: [], disallows: [], allows: [] };
        groups.push(current);
      }
      current.agents.push(value.toLowerCase());
      lastLineWasAgent = true;
      continue;
    }
    lastLineWasAgent = false;
    if (!current) continue;
    if (key === 'disallow') current.disallows.push(value);
    if (key === 'allow') current.allows.push(value);
  }

  const named = groups.find((g) => g.agents.includes(ua.toLowerCase()));
  const wildcard = groups.find((g) => g.agents.includes('*'));
  const group = named ?? wildcard;
  if (!group) return { allowed: true, reason: 'no matching rules' };

  const source = named ? `its own ${ua} rule` : 'the wildcard rule';
  const blocksRoot = group.disallows.some((d) => d === '/' || d === '/*');
  if (blocksRoot && !group.allows.some((a) => a === '/')) {
    return { allowed: false, reason: `blocked at the root by ${source}` };
  }
  if (group.disallows.length) {
    return { allowed: true, reason: `allowed, though ${source} blocks ${group.disallows.length} path(s)` };
  }
  return { allowed: true, reason: `allowed by ${source}` };
}

/**
 * Find the sitemap the way a crawler does: believe robots.txt first, and only
 * then guess at conventional paths. Checking /sitemap.xml alone reports "no
 * sitemap" for every site that uses an index file, which is most of them.
 *
 * An index file lists other sitemaps rather than URLs, so when we land on one we
 * follow the first child to reach real <lastmod> data.
 */
async function fetchSitemap(origin: string, robotsTxt: string): Promise<{ ok: boolean; status: number; body: string }> {
  const declared = [...robotsTxt.matchAll(/^\s*sitemap:\s*(\S+)/gim)].map((m) => m[1]);
  const candidates = [...declared, `${origin}/sitemap.xml`, `${origin}/sitemap-index.xml`, `${origin}/sitemap_index.xml`];

  for (const url of candidates) {
    const res = await get(url);
    if (!res.ok || !res.body.trim()) continue;

    const isIndex = /<sitemapindex/i.test(res.body);
    if (!isIndex) return res;

    const child = res.body.match(/<sitemap>[\s\S]*?<loc>([^<]+)<\/loc>/i)?.[1];
    if (!child) return res;
    const childRes = await get(child.trim());
    // Keep the index if the child is unreachable: the sitemap still exists.
    return childRes.ok && childRes.body.trim() ? childRes : res;
  }
  return { ok: false, status: 404, body: '' };
}

export async function runReadiness(input: string): Promise<ReadinessReport> {
  const origin = normalizeOrigin(input);
  const domain = new URL(origin).host;

  const [robots, llms, home] = await Promise.all([
    get(`${origin}/robots.txt`),
    get(`${origin}/llms.txt`),
    get(origin),
  ]);

  const sitemap = await fetchSitemap(origin, robots.body);

  const crawlers: CrawlerVerdict[] = AI_CRAWLERS.map((c) => {
    const verdict = evaluateRobots(robots.body, c.ua);
    return { ua: c.ua, engine: c.engine, allowed: verdict.allowed, reason: verdict.reason };
  });

  const checks: VisibilityCheck[] = [];
  const blocked = crawlers.filter((c) => !c.allowed);

  checks.push(
    blocked.length === 0
      ? {
          id: 'crawler-access',
          label: 'Answer engines can reach the site',
          status: 'pass',
          detail: `All ${crawlers.length} AI crawlers are allowed.`,
        }
      : {
          id: 'crawler-access',
          label: 'Answer engines can reach the site',
          status: 'fail',
          detail: `${blocked.length} of ${crawlers.length} blocked: ${blocked.map((b) => b.ua).join(', ')}.`,
          fix: `Remove the Disallow rules for ${blocked.map((b) => b.ua).join(', ')} in robots.txt. Until this is fixed, nothing else on this list can help — those engines never see the pages.`,
        }
  );

  checks.push(
    llms.ok && llms.body.trim()
      ? {
          id: 'llms-txt',
          label: 'llms.txt published',
          status: llms.body.includes('#') ? 'pass' : 'warn',
          detail: llms.body.includes('#')
            ? 'Present and structured with headings.'
            : 'Present but has no headings, so it reads as a flat blob.',
          fix: llms.body.includes('#') ? undefined : 'Give it H1/H2 sections naming the pages you want quoted.',
        }
      : {
          id: 'llms-txt',
          label: 'llms.txt published',
          status: 'warn',
          detail: 'Not found at /llms.txt.',
          fix: 'Publish an llms.txt pointing at the pages you most want cited. Adoption is still uneven, so this is an edge rather than a requirement.',
        }
  );

  const lastmods = [...sitemap.body.matchAll(/<lastmod>([^<]+)<\/lastmod>/g)].map((m) => Date.parse(m[1])).filter(Boolean);
  if (!sitemap.ok) {
    checks.push({
      id: 'sitemap',
      label: 'Sitemap reachable',
      status: 'fail',
      detail: 'No sitemap.xml at the root.',
      fix: 'Publish one and submit it. Engines use it to find what is new.',
    });
  } else if (!lastmods.length) {
    checks.push({
      id: 'freshness',
      label: 'Content freshness is visible',
      status: 'warn',
      detail: 'Sitemap has no lastmod dates.',
      fix: 'Emit lastmod per URL so engines can tell what changed.',
    });
  } else {
    const newest = Math.max(...lastmods);
    const days = Math.round((Date.now() - newest) / 86_400_000);
    checks.push({
      id: 'freshness',
      label: 'Content freshness is visible',
      status: days <= 45 ? 'pass' : days <= 120 ? 'warn' : 'fail',
      detail: `Most recent update was ${days} day(s) ago, across ${lastmods.length} URLs.`,
      fix: days <= 45 ? undefined : 'Answer engines lean on recency. Refresh the pages you want cited.',
    });
  }

  const schemaTypes = [...home.body.matchAll(/"@type"\s*:\s*"([^"]+)"/g)].map((m) => m[1]);
  const wanted = ['Organization', 'LocalBusiness', 'Person', 'WebSite'];
  const found = wanted.filter((t) => schemaTypes.includes(t));
  checks.push({
    id: 'entity-schema',
    label: 'The site declares who it is',
    status: found.length ? 'pass' : 'fail',
    detail: found.length
      ? `Homepage declares ${found.join(', ')}.`
      : 'Homepage has no Organization, LocalBusiness, or Person schema.',
    fix: found.length ? undefined : 'Add Organization or Person schema to the homepage. An engine that cannot resolve who you are will not name you.',
  });

  const weights: Record<string, number> = { 'crawler-access': 16, 'llms-txt': 4, freshness: 8, sitemap: 8, 'entity-schema': 12 };
  const maxScore = 40;
  const earned = checks.reduce((sum, c) => {
    const w = weights[c.id] ?? 0;
    return sum + (c.status === 'pass' ? w : c.status === 'warn' ? w / 2 : 0);
  }, 0);

  return { domain, origin, crawlers, checks, score: Math.round(earned), maxScore };
}

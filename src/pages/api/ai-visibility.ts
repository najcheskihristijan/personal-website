import type { APIRoute } from 'astro';
import { runReadiness, normalizeOrigin } from '../../lib/ai-visibility';
import { rateLimit } from '../../lib/leads';

export const prerender = false;

/**
 * Engine citation checks need keys that are not provisioned yet. Rather than
 * inventing numbers, the endpoint reports each engine's configuration state and
 * the UI says so plainly. A visibility tool that guesses is worse than one that
 * admits what it cannot see.
 */
function engineAvailability() {
  return [
    { engine: 'Google AI Overview', configured: Boolean(process.env.SERPER_API_KEY) },
    { engine: 'Perplexity', configured: Boolean(process.env.PERPLEXITY_API_KEY) },
    { engine: 'Bing Copilot', configured: Boolean(process.env.BING_COPILOT_ENDPOINT) },
  ];
}

export const POST: APIRoute = async ({ request, clientAddress }) => {
  const ip = clientAddress || 'unknown';
  // Readiness is four HTTP fetches against someone else's server, so the limit
  // protects them as much as us.
  if (!rateLimit(ip, 6, 60_000)) {
    return new Response(JSON.stringify({ error: 'Slow down — try again in a minute.' }), {
      status: 429,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const { domain } = await request.json();
    if (!domain || typeof domain !== 'string') {
      return new Response(JSON.stringify({ error: 'Enter a domain to check.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    let origin: string;
    try {
      origin = normalizeOrigin(domain.trim());
    } catch {
      return new Response(JSON.stringify({ error: `"${domain}" is not a valid domain.` }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const readiness = await runReadiness(origin);
    const engines = engineAvailability();
    const citationsLive = engines.some((e) => e.configured);

    return new Response(
      JSON.stringify({
        domain: readiness.domain,
        readiness: {
          score: readiness.score,
          maxScore: readiness.maxScore,
          crawlers: readiness.crawlers,
          checks: readiness.checks,
        },
        engines,
        // Until at least one engine is wired, the headline is readiness only and
        // is labelled as such, so nobody reads it as a citation share.
        headline: citationsLive ? null : { score: readiness.score, outOf: readiness.maxScore, basis: 'readiness only' },
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Check failed';
    return new Response(JSON.stringify({ error: msg }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

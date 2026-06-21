import type { APIRoute } from 'astro';
import { fetchPage } from '../../lib/serp-fetcher';
import { saveLead, rateLimit } from '../../lib/leads';

export const prerender = false;

export const POST: APIRoute = async ({ request, clientAddress }) => {
  const ip = clientAddress || 'unknown';
  if (!rateLimit(ip, 12, 60_000)) {
    return new Response(
      JSON.stringify({ error: 'Slow down — try again in a minute.' }),
      { status: 429, headers: { 'Content-Type': 'application/json' } }
    );
  }

  try {
    const body = (await request.json()) as { url?: string };
    const rawUrl = (body.url || '').trim();
    if (!rawUrl) {
      return new Response(JSON.stringify({ error: 'URL required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const data = await fetchPage(rawUrl);

    // Capture URL as anonymous "ping" lead. Lets us follow up on traffic
    // even when no email is provided. Tagged tool: 'serp-fetch' so the user
    // can filter / dedupe later.
    try {
      saveLead({
        tool: 'serp-fetch',
        email: '(no-email)',
        url: data.finalUrl,
        payload: {
          hostname: data.hostname,
          title: data.title,
          description: data.metaDescription,
          schemaTypes: data.schemaTypes,
          hasArticle: data.hasArticle,
          hasFaq: data.hasFaq,
          hasReview: data.hasReview,
          hasProduct: data.hasProduct,
          hasBreadcrumb: data.hasBreadcrumb,
          httpStatus: data.httpStatus,
          durationMs: data.durationMs,
        },
        ip,
      });
    } catch {
      // never fail the user request on lead-save failure
    }

    return new Response(JSON.stringify({ ok: true, data }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Internal error';
    return new Response(JSON.stringify({ error: msg }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

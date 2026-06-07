import type { APIRoute } from 'astro';
import { runAudit } from '../../lib/aeo-audit';
import { rateLimit } from '../../lib/leads';

export const prerender = false;

export const POST: APIRoute = async ({ request, clientAddress }) => {
  const ip = clientAddress || 'unknown';
  if (!rateLimit(ip, 6, 60_000)) {
    return new Response(JSON.stringify({ error: 'Slow down — try again in a minute.' }), {
      status: 429,
      headers: { 'Content-Type': 'application/json' },
    });
  }
  try {
    const { url } = await request.json();
    if (!url || typeof url !== 'string') {
      return new Response(JSON.stringify({ error: 'URL is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    const report = await runAudit(url);
    // Return summary only (preview) — full report is email-gated via /api/lead-capture
    return new Response(
      JSON.stringify({
        url: report.url,
        finalUrl: report.finalUrl,
        grade: report.grade,
        score: report.score,
        maxScore: report.maxScore,
        passes: report.passes,
        warns: report.warns,
        fails: report.fails,
        topIssues: report.topIssues.slice(0, 3).map((c) => ({
          label: c.label,
          status: c.status,
          detail: c.detail,
        })),
        meta: {
          title: report.meta.title,
          h1: report.meta.h1,
          schemaTypes: report.meta.schemaTypes,
          wordCount: report.meta.wordCount,
        },
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Audit failed';
    return new Response(JSON.stringify({ error: msg }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

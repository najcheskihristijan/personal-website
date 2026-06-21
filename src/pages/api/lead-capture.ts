import type { APIRoute } from 'astro';
import { saveLead, markEmailSent, rateLimit, isValidEmail } from '../../lib/leads';
import { sendEmail, brandedEmail } from '../../lib/email';
import { runAudit, renderReportHtml, type AuditReport } from '../../lib/aeo-audit';
import { buildReport as buildRoi, renderRoiHtml, type Industry } from '../../lib/roi-model';

export const prerender = false;

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function safeHref(raw: string): string {
  try {
    const u = new URL(raw);
    if (u.protocol === 'http:' || u.protocol === 'https:') return u.toString();
  } catch {
    // fall through
  }
  return '#';
}

interface CaptureBody {
  tool: string;
  email: string;
  url?: string;
  payload?: Record<string, unknown>;
  honeypot?: string;
}

async function buildReport(
  body: CaptureBody
): Promise<{ subject: string; bodyHtml: string; preheader: string }> {
  const { tool, url } = body;

  if (tool === 'aeo-audit' && url) {
    const report = await runAudit(url);
    const finalHref = escapeHtml(safeHref(report.finalUrl));
    const finalText = escapeHtml(report.finalUrl);
    return {
      subject: `Your AEO audit for ${new URL(report.finalUrl).hostname} — Grade ${report.grade}`,
      preheader: `${report.score}/${report.maxScore} points · ${report.fails} issue${report.fails === 1 ? '' : 's'} to fix first`,
      bodyHtml: `
        <p>Thanks — here is the full AEO readiness audit for <a href="${finalHref}" style="color:#3b82f6;">${finalText}</a>.</p>
        ${renderReportHtml(report)}
        <p style="margin-top:24px;">Want me to actually <strong>fix the top issues</strong> for you? The free 60-minute consultation is the same starting point for everyone.</p>
      `,
    };
  }

  if (tool === 'llms-txt' && body.payload) {
    const p = body.payload as { llmsTxt?: string; domain?: string };
    const domain = p.domain || 'your site';
    return {
      subject: `Your llms.txt for ${domain}`,
      preheader: 'Copy-paste ready · drop it at /llms.txt',
      bodyHtml: `
        <p>Here is the llms.txt file generated for <strong>${escapeHtml(domain)}</strong>.</p>
        <p>Drop it at <code>/llms.txt</code> on your domain so AI engines (ChatGPT, Perplexity, Claude, Gemini) know which content to read first.</p>
        <pre style="background:#0b1220;color:#e5e7eb;padding:16px;border-radius:8px;font-family:ui-monospace,Menlo,Consolas,monospace;font-size:13px;overflow-x:auto;white-space:pre-wrap;">${escapeHtml(p.llmsTxt || '')}</pre>
        <p style="margin-top:16px;">Want me to actually audit your AI visibility and tell you what to prioritize? Reply to this email or book a free 60-minute call.</p>
      `,
    };
  }

  if (tool === 'roi-calculator' && body.payload) {
    const p = body.payload as {
      monthlyOrganicTraffic: number;
      conversionRatePct: number;
      avgOrderValue: number;
      monthlyInvestment: number;
      industry: Industry;
    };
    const roi = buildRoi({
      monthlyOrganicTraffic: Number(p.monthlyOrganicTraffic) || 0,
      conversionRatePct: Number(p.conversionRatePct) || 0,
      avgOrderValue: Number(p.avgOrderValue) || 0,
      monthlyInvestment: Number(p.monthlyInvestment) || 0,
      industry: (p.industry || 'other') as Industry,
    });
    const e = roi.scenarios.expected;
    return {
      subject: `Your fractional SEO ROI projection — ${e.roiMultiple}× expected ROI`,
      preheader: `Year-1 net gain ~$${e.netGain.toLocaleString('en-US')} · payback ${e.paybackMonth ? `month ${e.paybackMonth}` : '>12 mo'}`,
      bodyHtml: renderRoiHtml(roi),
    };
  }

  if (tool === 'schema-generator' && body.payload) {
    const p = body.payload as { schemaType?: string; schemaHtml?: string };
    const schemaType = p.schemaType || 'schema';
    return {
      subject: `Your ${schemaType} JSON-LD — Hristijan Najcheski`,
      preheader: 'Copy-paste ready · plus next-step recommendations',
      bodyHtml: `
        <p>Here is the <strong>${escapeHtml(schemaType)}</strong> JSON-LD you generated. Drop the full <code>&lt;script&gt;</code> block inside the <code>&lt;head&gt;</code> of the matching page.</p>
        <pre style="background:#0b1220;color:#e5e7eb;padding:16px;border-radius:8px;font-family:ui-monospace,Menlo,Consolas,monospace;font-size:12px;overflow-x:auto;white-space:pre-wrap;">${escapeHtml(p.schemaHtml || '')}</pre>
        <p style="margin-top:16px;"><strong>What to do next:</strong></p>
        <ol style="line-height:1.7;">
          <li>Paste into your page's <code>&lt;head&gt;</code>.</li>
          <li>Validate with Google's Rich Results Test (<a href="https://search.google.com/test/rich-results" style="color:#3b82f6;">search.google.com/test/rich-results</a>).</li>
          <li>Request a re-crawl in Google Search Console so it picks up the new schema.</li>
        </ol>
        <p style="margin-top:16px;">Reply to this email with your live URL and I'll personally check your live schema implementation and flag anything missing.</p>
      `,
    };
  }

  if (tool === 'hreflang-generator' && body.payload) {
    const p = body.payload as { rows?: { lang: string; url: string }[]; tags?: string };
    const rows = Array.isArray(p.rows) ? p.rows : [];
    return {
      subject: `Your hreflang tags — ${rows.length} language version${rows.length === 1 ? '' : 's'}`,
      preheader: 'Drop in every page <head> · reciprocal across all versions',
      bodyHtml: `
        <p>Here are the hreflang tags you generated for <strong>${rows.length} language/region version${rows.length === 1 ? '' : 's'}</strong>.</p>
        <pre style="background:#0b1220;color:#e5e7eb;padding:16px;border-radius:8px;font-family:ui-monospace,Menlo,Consolas,monospace;font-size:12px;overflow-x:auto;white-space:pre-wrap;">${escapeHtml(p.tags || '')}</pre>
        <p style="margin-top:16px;"><strong>Implementation checklist:</strong></p>
        <ol style="line-height:1.7;">
          <li>Add these tags to the <code>&lt;head&gt;</code> of <strong>every</strong> language version — not just the default.</li>
          <li>Verify every page lists every other page (reciprocal hreflang).</li>
          <li>Make sure each URL returns 200 and the page content is actually in that language.</li>
          <li>Re-submit your sitemaps in Google Search Console.</li>
        </ol>
        <p style="margin-top:16px;">Reply with your domain and I'll personally audit your reciprocal tags + geo-targeting setup. Free.</p>
      `,
    };
  }

  if (tool === 'serp-optimizer' && body.payload) {
    const p = body.payload as {
      title?: string;
      description?: string;
      keyword?: string;
      titleChars?: number;
      titlePx?: number;
      descChars?: number;
      descPx?: number;
      ctr?: { score?: number; tips?: string[]; matchedPowerWords?: string[] };
      rewriteRisk?: { level?: string; score?: number; reasons?: string[] };
      eligibleRichResults?: string[];
      detectedRichResults?: string[];
    };

    let auditReport: AuditReport | undefined;
    if (url) {
      try {
        auditReport = await runAudit(url);
      } catch (e: unknown) {
        // Audit is a bonus — proceed without it on failure.
        console.warn('[serp-optimizer] audit failed for', url, e instanceof Error ? e.message : e);
      }
    }

    const titleEsc = escapeHtml(p.title || '');
    const descEsc = escapeHtml(p.description || '');
    const kwEsc = escapeHtml(p.keyword || '(none)');
    const hostname = (() => {
      try {
        return url ? new URL(url).hostname : '';
      } catch {
        return '';
      }
    })();
    const subject = `Your SERP snippet + AEO plan${hostname ? ' for ' + hostname : ''}`;
    const ctrScore = Number(p.ctr?.score ?? 0);
    const rwLevel = (p.rewriteRisk?.level || 'unknown').toString();

    return {
      subject,
      preheader: `CTR score ${ctrScore}/100 · rewrite risk ${escapeHtml(rwLevel)}${auditReport ? ' · AEO grade ' + escapeHtml(auditReport.grade) : ''}`,
      bodyHtml: `
        <p>Here is the full SERP snippet + AEO optimization plan for the page you previewed.</p>

        <h2 style="margin:24px 0 8px;font-size:16px;">Your snippet</h2>
        <div style="background:#f8fafc;border:1px solid #e5e7eb;border-radius:8px;padding:16px;margin:8px 0;font-family:arial,sans-serif;">
          <div style="color:#1a0dab;font-size:18px;font-weight:400;line-height:1.3;margin-bottom:4px;">${titleEsc || '(no title)'}</div>
          <div style="color:#0d7c30;font-size:12px;margin-bottom:8px;">${url ? escapeHtml(url) : ''}</div>
          <div style="color:#4d5156;font-size:14px;line-height:1.55;">${descEsc || '(no description)'}</div>
        </div>

        <table style="width:100%;font-size:14px;border-collapse:collapse;margin:16px 0;">
          <tr><td style="padding:6px 0;color:#6b7280;width:50%;">Title length</td><td style="padding:6px 0;font-weight:600;">${p.titleChars || 0} chars · ${p.titlePx || 0}px</td></tr>
          <tr><td style="padding:6px 0;color:#6b7280;">Description length</td><td style="padding:6px 0;font-weight:600;">${p.descChars || 0} chars · ${p.descPx || 0}px</td></tr>
          <tr><td style="padding:6px 0;color:#6b7280;">Target keyword</td><td style="padding:6px 0;font-weight:600;">${kwEsc}</td></tr>
          <tr><td style="padding:6px 0;color:#6b7280;">CTR signal score</td><td style="padding:6px 0;font-weight:600;">${ctrScore} / 100</td></tr>
          <tr><td style="padding:6px 0;color:#6b7280;">Rewrite risk</td><td style="padding:6px 0;font-weight:600;text-transform:capitalize;">${escapeHtml(rwLevel)}</td></tr>
          ${p.detectedRichResults && p.detectedRichResults.length ? `<tr><td style="padding:6px 0;color:#6b7280;">Rich results eligible</td><td style="padding:6px 0;font-weight:600;">${p.detectedRichResults.map((r) => escapeHtml(r)).join(', ')}</td></tr>` : ''}
        </table>

        ${p.ctr?.tips && p.ctr.tips.length ? `
          <h2 style="margin:24px 0 8px;font-size:16px;">CTR improvement checklist</h2>
          <ol style="line-height:1.7;padding-left:20px;color:#1f2937;font-size:14px;">
            ${p.ctr.tips.map((t) => `<li>${escapeHtml(t)}</li>`).join('')}
          </ol>
        ` : ''}

        ${p.rewriteRisk?.reasons && p.rewriteRisk.reasons.length ? `
          <h2 style="margin:24px 0 8px;font-size:16px;">Why Google may rewrite this snippet</h2>
          <ul style="line-height:1.7;padding-left:20px;color:#1f2937;font-size:14px;">
            ${p.rewriteRisk.reasons.map((r) => `<li>${escapeHtml(r)}</li>`).join('')}
          </ul>
        ` : ''}

        ${auditReport ? `
          <h2 style="margin:32px 0 8px;font-size:18px;border-top:2px solid #eef0f4;padding-top:24px;">Full AEO readiness audit</h2>
          ${renderReportHtml(auditReport)}
        ` : url ? `
          <p style="margin-top:24px;color:#6b7280;font-size:13px;">The AEO audit could not be run on this URL (timeout or fetch error). Reply to this email and I'll run it manually.</p>
        ` : ''}

        <p style="margin-top:24px;">If you want me to actually <strong>implement these fixes</strong> on your site — the free 60-minute consultation is the same starting point for everyone.</p>
      `,
    };
  }

  // Robots tester / fallback
  return {
    subject: `Your free ${tool} report — Hristijan Najcheski`,
    preheader: 'Thanks for using the tool — here are the next steps.',
    bodyHtml: `
      <p>Thanks for using the <strong>${escapeHtml(tool)}</strong> tool on hristijannajcheski.com.</p>
      ${url ? `<p>URL captured: <a href="${escapeHtml(safeHref(url))}" style="color:#3b82f6;">${escapeHtml(url)}</a></p>` : ''}
      <p>I'll personally take a look and send a follow-up if I spot quick wins. In the meantime, the free 60-minute consultation is the fastest way to talk through your SEO priorities.</p>
    `,
  };
}

export const POST: APIRoute = async ({ request, clientAddress }) => {
  const ip = clientAddress || 'unknown';
  if (!rateLimit(ip, 5, 60_000)) {
    return new Response(JSON.stringify({ error: 'Slow down — try again in a minute.' }), {
      status: 429,
      headers: { 'Content-Type': 'application/json' },
    });
  }
  try {
    const body = (await request.json()) as CaptureBody;
    const { tool, email, url, payload, honeypot } = body;

    // Honeypot: bots fill hidden fields
    if (honeypot && honeypot.length > 0) {
      return new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (!tool || typeof tool !== 'string') {
      return new Response(JSON.stringify({ error: 'Tool is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    if (!isValidEmail(email)) {
      return new Response(JSON.stringify({ error: 'Please enter a valid email' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const lead = saveLead({
      tool,
      email: email.toLowerCase().trim(),
      url,
      payload,
      ip,
    });

    let subject = '';
    let bodyHtml = '';
    let preheader = '';
    try {
      const r = await buildReport(body);
      subject = r.subject;
      bodyHtml = r.bodyHtml;
      preheader = r.preheader;
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Could not build report';
      markEmailSent(lead.id, msg);
      console.warn('[lead-capture] buildReport failed for', body.tool, msg);
      return new Response(
        JSON.stringify({
          ok: false,
          message:
            'Saved your email, but the report could not be generated for that URL. I will follow up personally.',
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const html = brandedEmail({
      title: subject,
      preheader,
      bodyHtml,
      ctaText: 'Book Free 60-Min Consultation →',
      ctaUrl: 'https://hristijannajcheski.com/contact/',
    });

    const result = await sendEmail({ to: email, subject, html });
    markEmailSent(lead.id, result.ok ? undefined : result.error);

    return new Response(
      JSON.stringify({
        ok: true,
        message:
          result.provider === 'stub'
            ? 'Saved — email delivery will activate once Resend is wired up.'
            : 'Sent! Check your inbox.',
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Internal error';
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

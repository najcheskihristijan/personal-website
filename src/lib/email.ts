// Transactional email — stubbed until RESEND_API_KEY is added.
// Drops outgoing emails into data/outbox.json so we can verify the pipeline locally.

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';

const OUTBOX_PATH = join(process.cwd(), 'data', 'outbox.json');

export interface OutboundEmail {
  to: string;
  subject: string;
  html: string;
  date: string;
  sent: boolean;
  provider?: string;
  error?: string;
}

function appendOutbox(entry: OutboundEmail) {
  try {
    const dir = dirname(OUTBOX_PATH);
    if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
    const arr: OutboundEmail[] = existsSync(OUTBOX_PATH)
      ? JSON.parse(readFileSync(OUTBOX_PATH, 'utf-8'))
      : [];
    arr.push(entry);
    writeFileSync(OUTBOX_PATH, JSON.stringify(arr, null, 2));
  } catch {
    // swallow
  }
}

export async function sendEmail(opts: {
  to: string;
  subject: string;
  html: string;
}): Promise<{ ok: boolean; provider: string; error?: string }> {
  const key = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM || 'Hristijan Najcheski <hello@hristijannajcheski.com>';

  // No key set → stub mode (write to outbox file, return ok)
  if (!key) {
    appendOutbox({
      to: opts.to,
      subject: opts.subject,
      html: opts.html,
      date: new Date().toISOString(),
      sent: false,
      provider: 'stub',
    });
    return { ok: true, provider: 'stub' };
  }

  // Resend mode
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${key}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to: [opts.to],
        subject: opts.subject,
        html: opts.html,
        reply_to: 'najcheski.hristijan@gmail.com',
      }),
    });
    if (!res.ok) {
      const text = await res.text();
      appendOutbox({
        to: opts.to,
        subject: opts.subject,
        html: opts.html,
        date: new Date().toISOString(),
        sent: false,
        provider: 'resend',
        error: text,
      });
      return { ok: false, provider: 'resend', error: text };
    }
    return { ok: true, provider: 'resend' };
  } catch (e: unknown) {
    const error = e instanceof Error ? e.message : String(e);
    appendOutbox({
      to: opts.to,
      subject: opts.subject,
      html: opts.html,
      date: new Date().toISOString(),
      sent: false,
      provider: 'resend',
      error,
    });
    return { ok: false, provider: 'resend', error };
  }
}

export function brandedEmail(opts: {
  title: string;
  preheader?: string;
  bodyHtml: string;
  ctaText?: string;
  ctaUrl?: string;
}): string {
  const { title, preheader = '', bodyHtml, ctaText, ctaUrl } = opts;
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<title>${title}</title>
</head>
<body style="margin:0;padding:0;background:#f6f7fb;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:#0b1220;">
<span style="display:none;max-height:0;overflow:hidden;opacity:0;">${preheader}</span>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
  <tr><td align="center" style="padding:32px 16px;">
    <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;background:#ffffff;border-radius:14px;overflow:hidden;border:1px solid #e5e7eb;">
      <tr><td style="padding:24px 28px;border-bottom:1px solid #eef0f4;">
        <div style="font-weight:800;font-size:18px;color:#0b1220;">
          <span style="display:inline-block;background:#3b82f6;color:#fff;width:26px;height:26px;border-radius:6px;text-align:center;line-height:26px;font-size:13px;margin-right:8px;">H</span>
          Hristijan Najcheski
        </div>
      </td></tr>
      <tr><td style="padding:28px;">
        <h1 style="margin:0 0 12px;font-size:24px;line-height:1.3;color:#0b1220;">${title}</h1>
        <div style="font-size:15px;line-height:1.7;color:#1f2937;">${bodyHtml}</div>
        ${
          ctaText && ctaUrl
            ? `<div style="margin-top:24px;"><a href="${ctaUrl}" style="display:inline-block;background:#f97316;color:#fff;text-decoration:none;padding:12px 22px;border-radius:8px;font-weight:700;">${ctaText}</a></div>`
            : ''
        }
      </td></tr>
      <tr><td style="padding:20px 28px;border-top:1px solid #eef0f4;font-size:12px;color:#6b7280;">
        Sent by Hristijan Najcheski · Fractional SEO Consultant · <a href="https://hristijannajcheski.com" style="color:#3b82f6;">hristijannajcheski.com</a><br />
        You received this because you requested a report from one of the free tools on the site.
      </td></tr>
    </table>
  </td></tr>
</table>
</body>
</html>`;
}

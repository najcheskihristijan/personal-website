export const prerender = false;

import type { APIRoute } from 'astro';
import { getDecisions, saveDecision, type Verdict } from '../../lib/reviews';
import { secret } from '../../lib/env';

/**
 * POST — record one decision. Requires the same cookie the page itself requires, so a decision
 * cannot be written by someone who never passed the gate.
 * GET  — return every decision as JSON for Christian. Gated by INCOGNITO_ADMIN_TOKEN, NOT by the
 *        client cookie: the client should not be able to enumerate the file, and Christian should
 *        not have to SSH into the box to read the answers.
 */

const REVIEW_KEY = 'incognito';
const COOKIE_NAME = 'incognito_auth';
const VERDICTS = new Set(['approved', 'rejected', 'unsure', '']);

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  });
}

export const POST: APIRoute = async ({ request, cookies }) => {
  if (cookies.get(COOKIE_NAME)?.value !== 'granted') {
    return json({ ok: false, error: 'not authorised' }, 401);
  }

  let payload: { itemId?: unknown; verdict?: unknown; comment?: unknown };
  try {
    payload = await request.json();
  } catch {
    return json({ ok: false, error: 'invalid json' }, 400);
  }

  const itemId = typeof payload.itemId === 'string' ? payload.itemId : '';
  const verdict = typeof payload.verdict === 'string' ? payload.verdict : '';
  const comment = typeof payload.comment === 'string' ? payload.comment : '';

  if (!itemId) return json({ ok: false, error: 'missing itemId' }, 400);
  if (!VERDICTS.has(verdict)) return json({ ok: false, error: 'invalid verdict' }, 400);

  const saved = saveDecision(REVIEW_KEY, itemId, verdict as Verdict, comment);
  if (!saved) return json({ ok: false, error: 'could not save' }, 400);

  return json({ ok: true, decision: saved });
};

export const GET: APIRoute = async ({ request }) => {
  const expected = secret('INCOGNITO_ADMIN_TOKEN');
  if (!expected) return json({ ok: false, error: 'export not configured' }, 503);

  const auth = request.headers.get('authorization') || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : new URL(request.url).searchParams.get('token') || '';
  if (token !== expected) return json({ ok: false, error: 'not authorised' }, 401);

  return json({ ok: true, decisions: getDecisions(REVIEW_KEY) });
};

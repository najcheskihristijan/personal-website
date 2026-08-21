export const prerender = false;

import type { APIRoute } from 'astro';
import { timingSafeEqual } from 'node:crypto';
import { secret } from '../../lib/env';

/**
 * Password gate for /client/incognito-plan.
 *
 * The password lives in INCOGNITO_REVIEW_PASSWORD, NOT in source — this repository is public, so a
 * hardcoded constant here would be a published credential. Unset means deny everything; a
 * guessable default on a public repo is the same leak by another route.
 *
 * WHY JSON RATHER THAN A FORM POST: Astro's built-in CSRF middleware rejects form-encoded POSTs
 * unless the Origin header equals `url.origin`, and behind this site's reverse proxy `url.origin`
 * resolves to "http://localhost" — so a real browser sending its real Origin can never match and
 * every form login 403s. (This is exactly why /api/cowork-auth currently fails in production.)
 * A JSON content-type is not form-like, so it bypasses that broken comparison. It is not a
 * security downgrade: a cross-origin JSON POST triggers a CORS preflight that this server never
 * answers, and the cookie is SameSite=strict, so it cannot ride along on a cross-site request.
 */

const COOKIE_NAME = 'incognito_auth';
// Path '/' NOT the page path: the page posts to /api/incognito-review, and a cookie scoped to
// /client/incognito-plan is never sent there, so every save would 401. httpOnly + SameSite=strict
// still keep it out of scripts and off cross-site requests.
const COOKIE_PATH = '/';

function matches(submitted: string, expected: string): boolean {
  const a = Buffer.from(submitted);
  const b = Buffer.from(expected);
  // timingSafeEqual throws on length mismatch. Length is not the secret; the value is.
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json' } });
}

export const POST: APIRoute = async ({ request, cookies }) => {
  const expected = secret('INCOGNITO_REVIEW_PASSWORD');

  if (!expected) {
    console.error('[incognito-auth] INCOGNITO_REVIEW_PASSWORD is not set — denying all access.');
    return json({ ok: false, error: 'config' }, 503);
  }

  let submitted = '';
  try {
    const body = await request.json();
    submitted = typeof body?.password === 'string' ? body.password : '';
  } catch {
    return json({ ok: false, error: 'bad request' }, 400);
  }

  if (!matches(submitted, expected)) {
    return json({ ok: false, error: 'wrong password' }, 401);
  }

  cookies.set(COOKIE_NAME, 'granted', {
    httpOnly: true,
    secure: import.meta.env.PROD,
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 * 30,
    path: COOKIE_PATH,
  });
  return json({ ok: true });
};

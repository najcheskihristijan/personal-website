export const prerender = false;

import type { APIRoute } from 'astro';

const PASSWORD = 'CoWork2026';
const COOKIE_NAME = 'cowork_auth';

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  const form = await request.formData();
  const submitted = form.get('password');

  if (submitted === PASSWORD) {
    cookies.set(COOKIE_NAME, 'granted', {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7,
      path: '/client/coworking-plan',
    });
    return redirect('/client/coworking-plan/', 302);
  }

  return redirect('/client/coworking-plan/?error=1', 302);
};

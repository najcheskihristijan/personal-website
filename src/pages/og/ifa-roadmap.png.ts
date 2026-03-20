export const prerender = false;

import type { APIRoute } from 'astro';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import { readFileSync } from 'fs';
import { join } from 'path';

export const GET: APIRoute = async () => {
  const fontData = readFileSync(
    join(process.cwd(), 'node_modules/@fontsource/inter/files/inter-latin-700-normal.woff')
  );

  const svg = await satori(
    {
      type: 'div',
      props: {
        style: {
          width: '1200px',
          height: '630px',
          background: '#0a0f1e',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '60px 72px',
          fontFamily: 'Inter',
        },
        children: [

          // ── Top bar ──────────────────────────────────────────────
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              },
              children: [
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      fontSize: '20px',
                      fontWeight: '700',
                      color: '#ffffff',
                    },
                    children: [
                      {
                        type: 'span',
                        props: { style: { color: '#3b82f6' }, children: 'H' },
                      },
                      {
                        type: 'span',
                        props: { style: { color: '#ffffff' }, children: 'N · SEO Consulting' },
                      },
                    ],
                  },
                },
                {
                  type: 'div',
                  props: {
                    style: {
                      fontSize: '12px',
                      fontWeight: '700',
                      color: '#94a3b8',
                      background: 'rgba(255,255,255,0.06)',
                      border: '1px solid rgba(255,255,255,0.12)',
                      borderRadius: '999px',
                      padding: '6px 18px',
                      letterSpacing: '0.1em',
                    },
                    children: 'CONFIDENTIAL',
                  },
                },
              ],
            },
          },

          // ── Main title block ─────────────────────────────────────
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
              },
              children: [
                {
                  type: 'div',
                  props: {
                    style: {
                      fontSize: '13px',
                      fontWeight: '700',
                      color: '#3b82f6',
                      letterSpacing: '0.12em',
                    },
                    children: '6-MONTH CROSS-BRAND SEO ROADMAP',
                  },
                },
                {
                  type: 'div',
                  props: {
                    style: {
                      fontSize: '54px',
                      fontWeight: '700',
                      color: '#ffffff',
                      lineHeight: '1.1',
                      letterSpacing: '-1.5px',
                      display: 'flex',
                      flexDirection: 'column',
                    },
                    children: [
                      {
                        type: 'span',
                        props: { style: { color: '#ffffff' }, children: 'IFA Tactical &' },
                      },
                      {
                        type: 'span',
                        props: { style: { color: '#ffffff' }, children: 'Incognito Concealment' },
                      },
                    ],
                  },
                },
                {
                  type: 'div',
                  props: {
                    style: {
                      fontSize: '20px',
                      color: '#94a3b8',
                      fontWeight: '700',
                    },
                    children: 'February 2026 – September 2026',
                  },
                },
              ],
            },
          },

          // ── Brand pills ──────────────────────────────────────────
          {
            type: 'div',
            props: {
              style: { display: 'flex', gap: '16px' },
              children: [
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      background: 'rgba(37,99,235,0.15)',
                      border: '1px solid rgba(37,99,235,0.4)',
                      borderRadius: '12px',
                      padding: '12px 22px',
                    },
                    children: [
                      {
                        type: 'div',
                        props: {
                          style: {
                            width: '8px',
                            height: '8px',
                            borderRadius: '50%',
                            background: '#3b82f6',
                          },
                          children: '',
                        },
                      },
                      {
                        type: 'span',
                        props: {
                          style: { color: '#93c5fd', fontSize: '16px', fontWeight: '700' },
                          children: 'IFATactical.com',
                        },
                      },
                    ],
                  },
                },
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      background: 'rgba(234,88,12,0.15)',
                      border: '1px solid rgba(234,88,12,0.4)',
                      borderRadius: '12px',
                      padding: '12px 22px',
                    },
                    children: [
                      {
                        type: 'div',
                        props: {
                          style: {
                            width: '8px',
                            height: '8px',
                            borderRadius: '50%',
                            background: '#f97316',
                          },
                          children: '',
                        },
                      },
                      {
                        type: 'span',
                        props: {
                          style: { color: '#fdba74', fontSize: '16px', fontWeight: '700' },
                          children: 'IncognitoConcealment.com',
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },

        ],
      },
    },
    {
      width: 1200,
      height: 630,
      fonts: [{ name: 'Inter', data: fontData, weight: 700, style: 'normal' }],
    }
  );

  const resvg = new Resvg(svg, { fitTo: { mode: 'width', value: 1200 } });
  const png = resvg.render().asPng();

  return new Response(png, {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=86400',
    },
  });
};

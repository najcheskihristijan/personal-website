export const prerender = false;

import type { APIRoute } from 'astro';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import { readFileSync } from 'fs';
import { join } from 'path';

export const GET: APIRoute = async () => {
  // Load a font for rendering
  const fontPath = join(process.cwd(), 'node_modules/@fontsource/inter/files/inter-latin-700-normal.woff');
  let fontData: Buffer;
  try {
    fontData = readFileSync(fontPath);
  } catch {
    // Fallback: use system font path on Linux (server)
    const fallbackPath = join(process.cwd(), 'public/fonts/inter-700.woff');
    fontData = readFileSync(fallbackPath);
  }

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
          position: 'relative',
        },
        children: [
          // Top: logo + confidential badge
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
                      fontSize: '22px',
                      fontWeight: '700',
                      color: '#ffffff',
                      letterSpacing: '-0.5px',
                    },
                    children: [
                      { type: 'span', props: { style: { color: '#3b82f6' }, children: 'H' } },
                      'N · SEO Consulting',
                    ],
                  },
                },
                {
                  type: 'div',
                  props: {
                    style: {
                      fontSize: '13px',
                      fontWeight: '600',
                      color: '#94a3b8',
                      background: 'rgba(255,255,255,0.06)',
                      border: '1px solid rgba(255,255,255,0.12)',
                      borderRadius: '999px',
                      padding: '6px 16px',
                      letterSpacing: '0.05em',
                      textTransform: 'uppercase',
                    },
                    children: 'Confidential',
                  },
                },
              ],
            },
          },

          // Center: title block
          {
            type: 'div',
            props: {
              style: { display: 'flex', flexDirection: 'column', gap: '20px' },
              children: [
                {
                  type: 'div',
                  props: {
                    style: {
                      fontSize: '13px',
                      fontWeight: '600',
                      color: '#3b82f6',
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                    },
                    children: '6-Month Cross-Brand SEO Roadmap',
                  },
                },
                {
                  type: 'div',
                  props: {
                    style: {
                      fontSize: '52px',
                      fontWeight: '700',
                      color: '#ffffff',
                      lineHeight: '1.1',
                      letterSpacing: '-1.5px',
                    },
                    children: 'IFA Tactical & Incognito\nConcealment',
                  },
                },
                {
                  type: 'div',
                  props: {
                    style: {
                      fontSize: '20px',
                      color: '#94a3b8',
                      fontWeight: '400',
                    },
                    children: 'February 2026 – September 2026',
                  },
                },
              ],
            },
          },

          // Bottom: two brand pills
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
                        },
                      },
                      {
                        type: 'span',
                        props: {
                          style: { color: '#93c5fd', fontSize: '16px', fontWeight: '600' },
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
                        },
                      },
                      {
                        type: 'span',
                        props: {
                          style: { color: '#fdba74', fontSize: '16px', fontWeight: '600' },
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
      fonts: [
        {
          name: 'Inter',
          data: fontData,
          weight: 700,
          style: 'normal',
        },
      ],
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

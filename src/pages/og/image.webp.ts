export const prerender = false;

import type { APIRoute } from 'astro';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import sharp from 'sharp';
import { readFileSync } from 'fs';
import { join } from 'path';

export const GET: APIRoute = async ({ url }) => {
  const title = url.searchParams.get('title') ?? 'Hristijan Najcheski';
  const label = url.searchParams.get('label') ?? 'Fractional SEO Consultant';

  const fontBold = readFileSync(
    join(process.cwd(), 'node_modules/@fontsource/inter/files/inter-latin-700-normal.woff')
  );
  const fontRegular = readFileSync(
    join(process.cwd(), 'node_modules/@fontsource/inter/files/inter-latin-400-normal.woff')
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
                // Logo: HN (H in blue, N in white, no gap)
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      alignItems: 'center',
                      fontSize: '20px',
                      fontWeight: '700',
                    },
                    children: [
                      {
                        type: 'span',
                        props: { style: { color: '#3b82f6' }, children: 'H' },
                      },
                      {
                        type: 'span',
                        props: { style: { color: '#ffffff' }, children: 'N' },
                      },
                      {
                        type: 'span',
                        props: { style: { color: '#64748b', marginLeft: '10px' }, children: '·' },
                      },
                      {
                        type: 'span',
                        props: { style: { color: '#94a3b8', marginLeft: '10px', fontWeight: '400', fontSize: '16px' }, children: 'hristijannajcheski.com' },
                      },
                    ],
                  },
                },
                // SEO badge
                {
                  type: 'div',
                  props: {
                    style: {
                      fontSize: '12px',
                      fontWeight: '700',
                      color: '#3b82f6',
                      background: 'rgba(37,99,235,0.12)',
                      border: '1px solid rgba(37,99,235,0.3)',
                      borderRadius: '999px',
                      padding: '6px 18px',
                      letterSpacing: '0.08em',
                    },
                    children: 'SEO CONSULTING',
                  },
                },
              ],
            },
          },

          // ── Main content ─────────────────────────────────────────
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                flexDirection: 'column',
                gap: '20px',
              },
              children: [
                // Label
                {
                  type: 'div',
                  props: {
                    style: {
                      fontSize: '14px',
                      fontWeight: '700',
                      color: '#3b82f6',
                      letterSpacing: '0.1em',
                    },
                    children: label.toUpperCase(),
                  },
                },
                // Title
                {
                  type: 'div',
                  props: {
                    style: {
                      fontSize: title.length > 40 ? '42px' : '52px',
                      fontWeight: '700',
                      color: '#ffffff',
                      lineHeight: '1.15',
                      letterSpacing: '-1px',
                      maxWidth: '900px',
                    },
                    children: title,
                  },
                },
              ],
            },
          },

          // ── Bottom divider + tagline ──────────────────────────────
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
              },
              children: [
                {
                  type: 'div',
                  props: {
                    style: {
                      width: '40px',
                      height: '3px',
                      background: '#3b82f6',
                      borderRadius: '2px',
                    },
                    children: '',
                  },
                },
                {
                  type: 'span',
                  props: {
                    style: {
                      fontSize: '17px',
                      color: '#64748b',
                      fontWeight: '400',
                    },
                    children: 'Data-driven SEO · Sustainable organic growth',
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
        { name: 'Inter', data: fontBold, weight: 700, style: 'normal' },
        { name: 'Inter', data: fontRegular, weight: 400, style: 'normal' },
      ],
    }
  );

  const resvg = new Resvg(svg, { fitTo: { mode: 'width', value: 1200 } });
  const png = resvg.render().asPng();
  const webp = await sharp(png).webp({ quality: 90 }).toBuffer();

  return new Response(webp, {
    headers: {
      'Content-Type': 'image/webp',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};

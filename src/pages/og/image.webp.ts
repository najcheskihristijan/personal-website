export const prerender = false;

import type { APIRoute } from 'astro';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import sharp from 'sharp';
import { readFileSync } from 'fs';
import { join } from 'path';

/**
 * Social card for every page that does not supply its own image.
 *
 * Built with satori rather than an image model on purpose: a social card is
 * mostly type, and generated images still garble text. Deterministic rendering
 * also means the card cannot drift off-brand or invent a statistic.
 */

let avatarDataUri: string | null = null;
async function getAvatar(): Promise<string> {
  // Read once per process. satori needs a raster it can inline, and resvg does
  // not decode WebP, so the stored avatar is converted to PNG here.
  if (avatarDataUri) return avatarDataUri;
  const raw = readFileSync(join(process.cwd(), 'public/images/author-avatar.webp'));
  const png = await sharp(raw).resize(260, 260).png().toBuffer();
  avatarDataUri = `data:image/png;base64,${png.toString('base64')}`;
  return avatarDataUri;
}

/** Long headlines shrink rather than overflow or push the layout around. */
function titleSize(title: string): number {
  if (title.length > 92) return 50;
  if (title.length > 66) return 58;
  if (title.length > 44) return 66;
  return 74;
}

export const GET: APIRoute = async ({ url }) => {
  const title = url.searchParams.get('title') ?? 'Hristijan Najcheski';
  const label = url.searchParams.get('label') ?? 'Fractional SEO Consultant';
  const avatar = await getAvatar();

  const fontBold = readFileSync(
    join(process.cwd(), 'node_modules/@fontsource/inter/files/inter-latin-700-normal.woff')
  );
  const fontRegular = readFileSync(
    join(process.cwd(), 'node_modules/@fontsource/inter/files/inter-latin-400-normal.woff')
  );

  const el = (type: string, style: Record<string, unknown>, children: unknown = '') => ({
    type,
    props: { style, children },
  });

  const svg = await satori(
    el(
      'div',
      {
        width: '1200px',
        height: '630px',
        background: '#0a0f1e',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: 'Inter',
        position: 'relative',
      },
      [
        // A single soft brand glow gives the flat navy some depth without
        // competing with the type.
        el('div', {
          position: 'absolute',
          top: '-180px',
          right: '-120px',
          width: '620px',
          height: '620px',
          borderRadius: '50%',
          background: '#1d4ed8',
          opacity: 0.22,
        }),
        el('div', {
          position: 'absolute',
          left: '0px',
          top: '0px',
          width: '10px',
          height: '630px',
          background: 'linear-gradient(180deg, #3b82f6 0%, #ea580c 100%)',
        }),

        // Top row: identity
        el(
          'div',
          {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '46px 64px 0 74px',
          },
          [
            el('div', { display: 'flex', alignItems: 'center' }, [
              el('span', { fontSize: '26px', fontWeight: 700, color: '#3b82f6', letterSpacing: '-0.02em' }, 'H'),
              el('span', { fontSize: '26px', fontWeight: 700, color: '#ffffff', letterSpacing: '-0.02em' }, 'N'),
              el('span', { fontSize: '19px', color: '#64748b', marginLeft: '16px' }, 'hristijannajcheski.com'),
            ]),
            el(
              'div',
              {
                display: 'flex',
                padding: '9px 20px',
                borderRadius: '999px',
                border: '1px solid #1e3a8a',
                background: '#0f1a33',
                fontSize: '15px',
                fontWeight: 700,
                letterSpacing: '0.09em',
                color: '#93c5fd',
              },
              label.toUpperCase()
            ),
          ]
        ),

        // Middle: headline beside the portrait
        el(
          'div',
          {
            display: 'flex',
            alignItems: 'center',
            gap: '52px',
            padding: '0 64px 0 74px',
            flexGrow: 1,
          },
          [
            el(
              'div',
              { display: 'flex', flexDirection: 'column', flexGrow: 1, maxWidth: '760px' },
              [
                el(
                  'div',
                  {
                    display: 'flex',
                    fontSize: `${titleSize(title)}px`,
                    fontWeight: 700,
                    color: '#ffffff',
                    lineHeight: 1.12,
                    letterSpacing: '-0.022em',
                  },
                  title
                ),
              ]
            ),
            el(
              'div',
              {
                display: 'flex',
                width: '250px',
                height: '250px',
                borderRadius: '50%',
                border: '4px solid #3b82f6',
                overflow: 'hidden',
                flexShrink: 0,
              },
              [
                {
                  type: 'img',
                  props: { src: avatar, width: 242, height: 242, style: { borderRadius: '50%' } },
                },
              ]
            ),
          ]
        ),

        // Bottom: who is saying it
        el(
          'div',
          {
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            padding: '0 64px 48px 74px',
          },
          [
            el('div', { width: '46px', height: '3px', background: '#ea580c', borderRadius: '2px' }),
            el('span', { fontSize: '21px', fontWeight: 700, color: '#e2e8f0' }, 'Hristijan Najcheski'),
            el('span', { fontSize: '19px', color: '#64748b' }, '· Fractional SEO & AEO consultant'),
          ]
        ),
      ]
    ) as never,
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

  return new Response(webp as unknown as BodyInit, {
    headers: { 'Content-Type': 'image/webp', 'Cache-Control': 'public, max-age=3600' },
  });
};

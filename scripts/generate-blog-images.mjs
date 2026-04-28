/**
 * Generate branded blog hero images using satori + sharp.
 * Run: node scripts/generate-blog-images.mjs
 *
 * Style: Light/clean background, data-viz / playful accent graphics,
 * branded with site blue (#3b82f6) and consistent typography.
 */

import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import sharp from 'sharp';
import { readFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

const fontBold = readFileSync(join(root, 'node_modules/@fontsource/inter/files/inter-latin-700-normal.woff'));
const fontRegular = readFileSync(join(root, 'node_modules/@fontsource/inter/files/inter-latin-400-normal.woff'));

const outDir = join(root, 'public/images/blog');
mkdirSync(outDir, { recursive: true });

// Blog posts with their visual configs
const blogs = [
  {
    slug: 'why-fractional-seo',
    title: 'Why Fractional SEO\nIs the Future',
    tag: 'STRATEGY',
    accent: '#3b82f6',
    icon: '📈',
    vizElements: [
      { type: 'bar', x: 680, heights: [60, 90, 130, 180, 240], color: '#3b82f6' },
      { type: 'badge', text: '+220%', x: 860, y: 160, color: '#10b981' },
    ],
  },
  {
    slug: 'technical-seo-checklist-2026',
    title: 'Technical SEO\nChecklist 2026',
    tag: 'TECHNICAL SEO',
    accent: '#8b5cf6',
    icon: '⚙️',
    vizElements: [
      { type: 'checklist', x: 680, items: ['Crawlability', 'Core Web Vitals', 'Schema', 'Site Architecture', 'Mobile-First'], color: '#8b5cf6' },
    ],
  },
  {
    slug: 'content-strategy-eeat',
    title: 'Build E-E-A-T Into\nYour Content',
    tag: 'CONTENT',
    accent: '#f59e0b',
    icon: '✍️',
    vizElements: [
      { type: 'pillars', x: 680, labels: ['Experience', 'Expertise', 'Authority', 'Trust'], color: '#f59e0b' },
    ],
  },
  {
    slug: 'what-is-fractional-seo',
    title: 'What Is a Fractional\nSEO Consultant?',
    tag: 'GUIDE',
    accent: '#06b6d4',
    icon: '🧩',
    vizElements: [
      { type: 'comparison', x: 680, items: ['Agency', 'In-House', 'Fractional'], highlight: 2, color: '#06b6d4' },
    ],
  },
  {
    slug: 'fractional-seo-vs-agency',
    title: 'Fractional vs Agency\nvs In-House',
    tag: 'COMPARISON',
    accent: '#ec4899',
    icon: '⚖️',
    vizElements: [
      { type: 'versus', x: 680, color: '#ec4899' },
    ],
  },
  {
    slug: 'roi-of-fractional-seo',
    title: 'The Real ROI of\nFractional SEO',
    tag: 'ROI',
    accent: '#10b981',
    icon: '💰',
    vizElements: [
      { type: 'bar', x: 680, heights: [40, 60, 100, 160, 250], color: '#10b981' },
      { type: 'badge', text: '316% ROI', x: 860, y: 160, color: '#10b981' },
    ],
  },
  {
    slug: 'seo-audit-checklist-what-to-expect',
    title: 'What an SEO Audit\nActually Covers',
    tag: 'SEO AUDITS',
    accent: '#0ea5e9',
    icon: '🔍',
    vizElements: [
      { type: 'checklist', x: 680, items: ['Technical', 'On-Page', 'Off-Page', 'Competitive', 'Analytics'], color: '#0ea5e9' },
    ],
  },
  {
    slug: 'fractional-cmo-vs-fractional-seo',
    title: 'Fractional CMO vs\nFractional SEO',
    tag: 'COMPARISON',
    accent: '#a855f7',
    icon: '⚖️',
    vizElements: [
      { type: 'comparison', x: 680, items: ['CMO', 'SEO', 'Both'], highlight: 2, color: '#a855f7' },
    ],
  },
];

function buildBarChart(config) {
  const bars = config.heights.map((h, i) => ({
    type: 'div',
    props: {
      style: {
        width: '36px',
        height: `${h}px`,
        background: i === config.heights.length - 1 ? config.color : `${config.color}44`,
        borderRadius: '6px 6px 0 0',
        display: 'flex',
      },
      children: '',
    },
  }));

  return {
    type: 'div',
    props: {
      style: {
        display: 'flex',
        alignItems: 'flex-end',
        gap: '10px',
        position: 'absolute',
        left: `${config.x}px`,
        bottom: '120px',
      },
      children: bars,
    },
  };
}

function buildBadge(config) {
  return {
    type: 'div',
    props: {
      style: {
        position: 'absolute',
        left: `${config.x}px`,
        top: `${config.y}px`,
        background: `${config.color}18`,
        border: `2px solid ${config.color}`,
        borderRadius: '12px',
        padding: '8px 20px',
        fontSize: '22px',
        fontWeight: '700',
        color: config.color,
        display: 'flex',
      },
      children: config.text,
    },
  };
}

function buildChecklist(config) {
  const items = config.items.map((text, i) => ({
    type: 'div',
    props: {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        fontSize: '16px',
        color: '#334155',
      },
      children: [
        {
          type: 'div',
          props: {
            style: {
              width: '24px',
              height: '24px',
              borderRadius: '6px',
              background: i < 3 ? config.color : `${config.color}33`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              fontSize: '14px',
              fontWeight: '700',
              flexShrink: '0',
            },
            children: i < 3 ? '✓' : '',
          },
        },
        {
          type: 'span',
          props: {
            style: { color: i < 3 ? '#1e293b' : '#94a3b8' },
            children: text,
          },
        },
      ],
    },
  }));

  return {
    type: 'div',
    props: {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: '14px',
        position: 'absolute',
        left: `${config.x}px`,
        top: '140px',
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '16px',
        padding: '24px 28px',
        boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
      },
      children: items,
    },
  };
}

function buildPillars(config) {
  const pillars = config.labels.map((label, i) => ({
    type: 'div',
    props: {
      style: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '8px',
      },
      children: [
        {
          type: 'div',
          props: {
            style: {
              width: '56px',
              height: `${80 + i * 30}px`,
              background: i === 3 ? config.color : `${config.color}${['22', '44', '77', 'ff'][i]}`,
              borderRadius: '8px 8px 0 0',
              display: 'flex',
            },
            children: '',
          },
        },
        {
          type: 'span',
          props: {
            style: { fontSize: '11px', color: '#64748b', fontWeight: '600' },
            children: label.charAt(0),
          },
        },
      ],
    },
  }));

  return {
    type: 'div',
    props: {
      style: {
        display: 'flex',
        alignItems: 'flex-end',
        gap: '12px',
        position: 'absolute',
        left: `${config.x}px`,
        bottom: '120px',
      },
      children: pillars,
    },
  };
}

function buildComparison(config) {
  const items = config.items.map((label, i) => ({
    type: 'div',
    props: {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '14px 20px',
        background: i === config.highlight ? `${config.color}15` : '#f8fafc',
        border: `2px solid ${i === config.highlight ? config.color : '#e2e8f0'}`,
        borderRadius: '12px',
        fontSize: '16px',
        fontWeight: i === config.highlight ? '700' : '400',
        color: i === config.highlight ? config.color : '#64748b',
      },
      children: [
        {
          type: 'span',
          props: {
            style: { display: 'flex' },
            children: i === config.highlight ? '★' : '○',
          },
        },
        {
          type: 'span',
          props: {
            style: { display: 'flex' },
            children: label,
          },
        },
      ],
    },
  }));

  return {
    type: 'div',
    props: {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        position: 'absolute',
        left: `${config.x}px`,
        top: '160px',
      },
      children: items,
    },
  };
}

function buildVersus(config) {
  return {
    type: 'div',
    props: {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        position: 'absolute',
        left: `${config.x}px`,
        top: '140px',
      },
      children: [
        {
          type: 'div',
          props: {
            style: {
              display: 'flex',
              gap: '16px',
              alignItems: 'center',
            },
            children: [
              { type: 'div', props: { style: { width: '100px', height: '100px', borderRadius: '16px', background: '#fee2e2', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px' }, children: '🏢' } },
              { type: 'span', props: { style: { fontSize: '28px', fontWeight: '700', color: '#cbd5e1', display: 'flex' }, children: 'vs' } },
              { type: 'div', props: { style: { width: '100px', height: '100px', borderRadius: '16px', background: `${config.color}18`, border: `2px solid ${config.color}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px' }, children: '🧠' } },
            ],
          },
        },
        {
          type: 'div',
          props: {
            style: {
              display: 'flex',
              gap: '16px',
              alignItems: 'center',
            },
            children: [
              { type: 'span', props: { style: { fontSize: '13px', color: '#94a3b8', width: '100px', textAlign: 'center', display: 'flex', justifyContent: 'center' }, children: 'Agency' } },
              { type: 'span', props: { style: { fontSize: '13px', color: '#94a3b8', width: '28px', display: 'flex' }, children: '' } },
              { type: 'span', props: { style: { fontSize: '13px', color: config.color, fontWeight: '700', width: '100px', textAlign: 'center', display: 'flex', justifyContent: 'center' }, children: 'Fractional' } },
            ],
          },
        },
      ],
    },
  };
}

function buildVizElement(viz) {
  switch (viz.type) {
    case 'bar': return buildBarChart(viz);
    case 'badge': return buildBadge(viz);
    case 'checklist': return buildChecklist(viz);
    case 'pillars': return buildPillars(viz);
    case 'comparison': return buildComparison(viz);
    case 'versus': return buildVersus(viz);
    default: return null;
  }
}

async function generateImage(blog) {
  const titleLines = blog.title.split('\n');

  const vizChildren = blog.vizElements.map(buildVizElement).filter(Boolean);

  const markup = {
    type: 'div',
    props: {
      style: {
        width: '1200px',
        height: '630px',
        background: 'linear-gradient(135deg, #fafbff 0%, #f0f4ff 50%, #faf5ff 100%)',
        display: 'flex',
        flexDirection: 'column',
        padding: '0',
        fontFamily: 'Inter',
        position: 'relative',
        overflow: 'hidden',
      },
      children: [
        // Decorative circles
        {
          type: 'div',
          props: {
            style: {
              position: 'absolute',
              top: '-100px',
              right: '-100px',
              width: '400px',
              height: '400px',
              borderRadius: '50%',
              background: `${blog.accent}08`,
              display: 'flex',
            },
            children: '',
          },
        },
        {
          type: 'div',
          props: {
            style: {
              position: 'absolute',
              bottom: '-60px',
              left: '300px',
              width: '250px',
              height: '250px',
              borderRadius: '50%',
              background: `${blog.accent}06`,
              display: 'flex',
            },
            children: '',
          },
        },

        // Top bar
        {
          type: 'div',
          props: {
            style: {
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '32px 56px',
            },
            children: [
              {
                type: 'div',
                props: {
                  style: { display: 'flex', alignItems: 'center', fontSize: '18px', fontWeight: '700' },
                  children: [
                    { type: 'span', props: { style: { color: '#3b82f6' }, children: 'H' } },
                    { type: 'span', props: { style: { color: '#1e293b' }, children: 'N' } },
                    { type: 'span', props: { style: { color: '#cbd5e1', marginLeft: '10px' }, children: '·' } },
                    { type: 'span', props: { style: { color: '#94a3b8', marginLeft: '10px', fontWeight: '400', fontSize: '14px' }, children: 'hristijannajcheski.com' } },
                  ],
                },
              },
              {
                type: 'div',
                props: {
                  style: {
                    fontSize: '11px',
                    fontWeight: '700',
                    color: blog.accent,
                    background: `${blog.accent}12`,
                    border: `1px solid ${blog.accent}33`,
                    borderRadius: '999px',
                    padding: '6px 16px',
                    letterSpacing: '0.1em',
                  },
                  children: blog.tag,
                },
              },
            ],
          },
        },

        // Main content area
        {
          type: 'div',
          props: {
            style: {
              display: 'flex',
              flexDirection: 'column',
              padding: '20px 56px 0',
              flex: '1',
              position: 'relative',
            },
            children: [
              // Icon
              {
                type: 'div',
                props: {
                  style: {
                    fontSize: '48px',
                    marginBottom: '16px',
                    display: 'flex',
                  },
                  children: blog.icon,
                },
              },
              // Title lines
              ...titleLines.map((line, i) => ({
                type: 'div',
                props: {
                  style: {
                    fontSize: '48px',
                    fontWeight: '700',
                    color: '#0f172a',
                    lineHeight: '1.15',
                    letterSpacing: '-1.5px',
                    display: 'flex',
                  },
                  children: line,
                },
              })),
              // Viz elements (positioned absolute)
              ...vizChildren,
            ],
          },
        },

        // Bottom bar
        {
          type: 'div',
          props: {
            style: {
              display: 'flex',
              alignItems: 'center',
              padding: '24px 56px',
              gap: '12px',
              borderTop: '1px solid #e2e8f0',
            },
            children: [
              {
                type: 'div',
                props: {
                  style: { width: '32px', height: '3px', background: blog.accent, borderRadius: '2px', display: 'flex' },
                  children: '',
                },
              },
              {
                type: 'span',
                props: {
                  style: { fontSize: '14px', color: '#94a3b8' },
                  children: 'Fractional SEO Consultant',
                },
              },
            ],
          },
        },
      ],
    },
  };

  const svg = await satori(markup, {
    width: 1200,
    height: 630,
    fonts: [
      { name: 'Inter', data: fontBold, weight: 700, style: 'normal' },
      { name: 'Inter', data: fontRegular, weight: 400, style: 'normal' },
    ],
  });

  const resvg = new Resvg(svg, { fitTo: { mode: 'width', value: 1200 } });
  const png = resvg.render().asPng();
  const webp = await sharp(png).webp({ quality: 90 }).toBuffer();

  const outPath = join(outDir, `${blog.slug}.webp`);
  await sharp(webp).toFile(outPath);
  console.log(`✓ ${outPath}`);
}

console.log('Generating blog images...\n');
for (const blog of blogs) {
  await generateImage(blog);
}
console.log('\nDone! All images saved to public/images/blog/');

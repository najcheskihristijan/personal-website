/**
 * Generate blog hero art with gpt-image-2 through OpenRouter.
 *
 *   node scripts/generate-hero-art.mjs [--only slug,slug] [--force]
 *
 * House style is fixed in one constant so twelve images read as one set. Each
 * post contributes only a subject cue. The prompt bans text, numbers, and
 * people: generated type comes out garbled, and an invented statistic in the
 * artwork of an SEO consultant's blog is a credibility leak.
 *
 * Needs OPENROUTER_API_KEY in the environment. Never commit it — this repo is
 * public.
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const outDir = join(root, 'public/images/blog');

const HOUSE_STYLE = [
  'Abstract editorial illustration, flat vector aesthetic with subtle depth.',
  'Deep navy background (#0a0f1e), electric blue (#3b82f6) as the primary shape colour,',
  'one warm orange (#ea580c) accent used sparingly as the focal point.',
  'Generous negative space, calm composition, wide banner framing.',
  'Absolutely no text, no letters, no numbers, no charts with labels, no people, no logos, no UI screenshots.',
].join(' ');

/** One cue per post: the idea the image should evoke, not the title restated. */
const SUBJECTS = {
  'why-fractional-seo': 'a small precise structure outperforming a large sprawling one; nodes converging into a clean ascending form',
  'technical-seo-checklist-2026': 'a layered architectural lattice being inspected, clean grid scaffolding with one highlighted joint',
  'content-strategy-eeat': 'concentric rings of trust building outward from a solid core, layered translucent planes',
  'what-is-fractional-seo': 'one segment of a circle separated and glowing, the fraction that carries the weight',
  'fractional-seo-vs-agency': 'three distinct geometric masses side by side, one compact and luminous, two heavier and dimmer',
  'roi-of-fractional-seo': 'a small input shape opening into a wide compounding fan of light',
  'seo-audit-checklist-what-to-expect': 'a cross-section view of stacked strata with a focused beam examining one layer',
  'fractional-cmo-vs-fractional-seo': 'two orbits of different scale sharing one centre, one broad and one tightly focused',
  'link-building-strategies-2026': 'a sparse network where a few thick connections carry the structure and many thin ones fade',
  'how-to-build-backlinks-from-scratch': 'a single node sending first connections into empty space, early lattice forming',
  'how-to-evaluate-backlink-quality': 'many similar nodes with only a few showing genuine internal density, quality separating from volume',
  'how-answer-engines-choose-sources': 'many documents narrowing through a funnel into one selected and illuminated passage',
};

const args = process.argv.slice(2);
const only = args.includes('--only') ? args[args.indexOf('--only') + 1].split(',') : null;
const force = args.includes('--force');

const key = process.env.OPENROUTER_API_KEY;
if (!key) {
  console.error('OPENROUTER_API_KEY is not set.');
  process.exit(1);
}

mkdirSync(outDir, { recursive: true });

async function generate(slug, subject) {
  const res = await fetch('https://openrouter.ai/api/v1/images', {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: process.env.IMAGE_MODEL || 'openai/gpt-image-2',
      prompt: `${HOUSE_STYLE} Subject: ${subject}.`,
      aspect_ratio: '16:9',
    }),
  });
  if (!res.ok) throw new Error(`${res.status} ${(await res.text()).slice(0, 200)}`);

  const json = await res.json();
  const b64 = json?.data?.[0]?.b64_json;
  if (!b64) throw new Error(`unexpected response shape: ${JSON.stringify(json).slice(0, 200)}`);

  const png = Buffer.from(b64, 'base64');
  const out = join(outDir, `${slug}.webp`);
  await sharp(png).resize(1200, 675, { fit: 'cover' }).webp({ quality: 82 }).toFile(out);
  return { out, bytes: png.length, usage: json.usage };
}

const targets = Object.entries(SUBJECTS).filter(([slug]) => !only || only.includes(slug));
console.log(`Generating ${targets.length} hero image(s).`);

for (const [slug, subject] of targets) {
  const dest = join(outDir, `${slug}.webp`);
  if (existsSync(dest) && !force) {
    console.log(`  skip ${slug} (exists — pass --force to replace)`);
    continue;
  }
  try {
    const { usage } = await generate(slug, subject);
    console.log(`  ok   ${slug}${usage ? ` (${JSON.stringify(usage)})` : ''}`);
  } catch (e) {
    console.log(`  FAIL ${slug}: ${e.message}`);
  }
}

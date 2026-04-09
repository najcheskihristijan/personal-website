#!/usr/bin/env node

/**
 * Blog Post Scheduling Script
 *
 * Usage:
 *   node scripts/schedule-post.mjs list              — List all posts with status
 *   node scripts/schedule-post.mjs upcoming          — Show scheduled (future) posts
 *   node scripts/schedule-post.mjs add <slug>        — Interactive: create a new post entry
 *   node scripts/schedule-post.mjs set-date <slug> <YYYY-MM-DD>  — Change publish date
 *
 * The Astro site already filters posts by date (future posts are hidden in production).
 * This script helps manage dates and see the publishing pipeline at a glance.
 */

import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const blogFile = join(root, 'src/data/blog-posts.ts');

// Quick and dirty parser: read the TS file and extract post data
function parsePosts() {
  const content = readFileSync(blogFile, 'utf-8');
  const posts = [];
  // Match each post key and its title/date/tag/readTime
  const postRegex = /'([^']+)':\s*\{[^}]*?title:\s*'([^']*)'[^}]*?date:\s*'([^']*)'[^}]*?readTime:\s*'([^']*)'[^}]*?tag:\s*'([^']*)'/gs;
  let match;
  while ((match = postRegex.exec(content)) !== null) {
    posts.push({
      slug: match[1],
      title: match[2],
      date: match[3],
      readTime: match[4],
      tag: match[5],
    });
  }
  return posts;
}

function getStatus(dateStr) {
  const pubDate = new Date(dateStr);
  const now = new Date();
  if (pubDate > now) return '⏳ Scheduled';
  return '✅ Published';
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
  });
}

const [,, command, ...args] = process.argv;

if (!command || command === 'list') {
  const posts = parsePosts().sort((a, b) => new Date(b.date) - new Date(a.date));
  console.log('\n📋 All Blog Posts\n');
  console.log('Status       │ Date          │ Tag            │ Slug');
  console.log('─────────────┼───────────────┼────────────────┼─────────────────────────────');
  for (const p of posts) {
    const status = getStatus(p.date).padEnd(12);
    const date = formatDate(p.date).padEnd(14);
    const tag = p.tag.padEnd(15);
    console.log(`${status} │ ${date} │ ${tag} │ ${p.slug}`);
  }
  console.log(`\nTotal: ${posts.length} posts (${posts.filter(p => new Date(p.date) <= new Date()).length} published, ${posts.filter(p => new Date(p.date) > new Date()).length} scheduled)\n`);
}

else if (command === 'upcoming') {
  const posts = parsePosts()
    .filter(p => new Date(p.date) > new Date())
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  if (posts.length === 0) {
    console.log('\n✅ No scheduled posts — everything is published.\n');
  } else {
    console.log('\n⏳ Upcoming Scheduled Posts\n');
    for (const p of posts) {
      const daysUntil = Math.ceil((new Date(p.date) - new Date()) / (1000 * 60 * 60 * 24));
      console.log(`  ${formatDate(p.date)} (in ${daysUntil} days)`);
      console.log(`  └─ [${p.tag}] ${p.title}`);
      console.log(`     slug: ${p.slug}\n`);
    }
  }
}

else if (command === 'set-date') {
  const [slug, newDate] = args;
  if (!slug || !newDate) {
    console.error('Usage: schedule-post.mjs set-date <slug> <YYYY-MM-DD>');
    process.exit(1);
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(newDate)) {
    console.error('Date must be in YYYY-MM-DD format');
    process.exit(1);
  }

  let content = readFileSync(blogFile, 'utf-8');
  // Find the post and update its date
  const dateRegex = new RegExp(`('${slug}':\\s*\\{[^}]*?date:\\s*')([^']*)(')`);
  if (!dateRegex.test(content)) {
    console.error(`Post "${slug}" not found in blog-posts.ts`);
    process.exit(1);
  }
  content = content.replace(dateRegex, `$1${newDate}$3`);

  const { writeFileSync } = await import('fs');
  writeFileSync(blogFile, content, 'utf-8');
  console.log(`\n✅ Updated "${slug}" publish date to ${formatDate(newDate)}`);
  console.log(`   Status: ${getStatus(newDate)}\n`);
}

else if (command === 'calendar') {
  // Show the content calendar from content-calendar.ts
  try {
    const calendarModule = await import(join(root, 'src/data/content-calendar.ts'));
    // If direct import fails (TS), read and parse manually
  } catch {
    console.log('\n📅 Content Calendar\n');
    console.log('See src/data/content-calendar.ts for the full editorial calendar.');
    console.log('Use "list" or "upcoming" to manage existing blog posts.\n');
  }
}

else {
  console.log(`
Blog Post Scheduling Script

Commands:
  list                          List all posts with publish status
  upcoming                      Show scheduled (future) posts only
  set-date <slug> <YYYY-MM-DD>  Change a post's publish date
  calendar                      Show content calendar info

Examples:
  node scripts/schedule-post.mjs list
  node scripts/schedule-post.mjs set-date my-new-post 2026-05-15
  node scripts/schedule-post.mjs upcoming
`);
}

export const prerender = false;

import { posts } from '../data/blog-posts';

export async function GET() {
  const base = 'https://hristijannajcheski.com';
  const now = new Date();

  const publishedPosts = Object.entries(posts).filter(
    ([, post]) => new Date(post.date) <= now
  );

  const urls = publishedPosts
    .sort(([, a], [, b]) => new Date(b.date).valueOf() - new Date(a.date).valueOf())
    .map(
      ([slug, post]) => `  <url>
    <loc>${base}/blog/${slug}/</loc>
    <lastmod>${new Date(post.date).toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`
    )
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}

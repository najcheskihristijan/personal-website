export const prerender = false;

import { services } from '../data/services';

export async function GET() {
  const base = 'https://hristijannajcheski.com';

  const staticPages = [
    { url: `${base}/`, priority: '1.0', changefreq: 'weekly' },
    { url: `${base}/about/`, priority: '0.8', changefreq: 'monthly' },
    { url: `${base}/services/`, priority: '0.9', changefreq: 'monthly' },
    { url: `${base}/blog/`, priority: '0.8', changefreq: 'weekly' },
    { url: `${base}/contact/`, priority: '0.7', changefreq: 'monthly' },
    { url: `${base}/pricing/`, priority: '0.8', changefreq: 'monthly' },
    { url: `${base}/tools/`, priority: '0.8', changefreq: 'monthly' },
    { url: `${base}/tools/serp-snippet-previewer/`, priority: '0.7', changefreq: 'monthly' },
    { url: `${base}/tools/robots-txt-tester/`, priority: '0.7', changefreq: 'monthly' },
    { url: `${base}/fractional-seo-saas/`, priority: '0.9', changefreq: 'monthly' },
    { url: `${base}/fractional-seo-ecommerce/`, priority: '0.9', changefreq: 'monthly' },
    { url: `${base}/fractional-seo-publishing/`, priority: '0.9', changefreq: 'monthly' },
    { url: `${base}/fractional-seo-enterprise/`, priority: '0.9', changefreq: 'monthly' },
    { url: `${base}/author/hristijan-najcheski/`, priority: '0.6', changefreq: 'monthly' },
  ];

  const servicePages = services.map((s) => ({
    url: `${base}/services/${s.slug}/`,
    priority: '0.8',
    changefreq: 'monthly',
  }));

  const allPages = [...staticPages, ...servicePages];

  const urls = allPages
    .map(
      (p) => `  <url>
    <loc>${p.url}</loc>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
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

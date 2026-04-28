/**
 * Content Map & Editorial Calendar
 * 3-month rolling plan for blog content production.
 *
 * Funnel stages:
 *   ToFu = Top of Funnel (awareness, education)
 *   MoFu = Middle of Funnel (consideration, comparison)
 *   BoFu = Bottom of Funnel (decision, conversion)
 *
 * Status: planned | writing | review | scheduled | published
 */

export interface ContentPiece {
  slug: string;
  title: string;
  targetKeyword: string;
  secondaryKeywords: string[];
  funnel: 'ToFu' | 'MoFu' | 'BoFu';
  contentType: 'guide' | 'how-to' | 'comparison' | 'case-study' | 'listicle' | 'thought-leadership';
  wordCountTarget: number;
  cluster: string; // topic cluster this belongs to
  internalLinksTo: string[]; // slugs of pages to link TO from this article
  publishDate: string; // YYYY-MM-DD
  status: 'planned' | 'writing' | 'review' | 'scheduled' | 'published';
  notes?: string;
}

export const contentCalendar: ContentPiece[] = [
  // ═══════════════════════════════════════════════
  //  MONTH 1 — April 2026
  // ═══════════════════════════════════════════════
  {
    slug: 'seo-audit-checklist-what-to-expect',
    title: 'What Does an SEO Audit Actually Cover? (And What to Expect)',
    targetKeyword: 'what does an seo audit cover',
    secondaryKeywords: ['seo audit checklist', 'seo audit process', 'what to expect from seo audit'],
    funnel: 'ToFu',
    contentType: 'guide',
    wordCountTarget: 2000,
    cluster: 'seo-audits',
    internalLinksTo: ['services/seo-audits', 'blog/technical-seo-checklist-2026', 'pricing'],
    publishDate: '2026-04-15',
    status: 'published',
    notes: 'Pairs with the SEO Audits service page. Educates potential clients on the audit process.',
  },
  {
    slug: 'fractional-cmo-vs-fractional-seo',
    title: 'Fractional CMO vs Fractional SEO: Which Does Your Business Need?',
    targetKeyword: 'fractional cmo vs fractional seo',
    secondaryKeywords: ['do i need a fractional seo', 'fractional marketing roles', 'fractional seo consultant vs cmo'],
    funnel: 'MoFu',
    contentType: 'comparison',
    wordCountTarget: 2000,
    cluster: 'fractional-seo',
    internalLinksTo: ['blog/what-is-fractional-seo', 'blog/fractional-seo-vs-agency', 'pricing'],
    publishDate: '2026-04-22',
    status: 'published',
    notes: 'Targets people aware of fractional model but unsure which fractional role they need.',
  },
  {
    slug: 'how-to-choose-seo-consultant',
    title: 'How to Choose an SEO Consultant (9 Questions to Ask Before Hiring)',
    targetKeyword: 'how to choose seo consultant',
    secondaryKeywords: ['questions to ask seo consultant', 'hiring seo consultant', 'what to look for in seo consultant'],
    funnel: 'BoFu',
    contentType: 'how-to',
    wordCountTarget: 2500,
    cluster: 'fractional-seo',
    internalLinksTo: ['blog/fractional-seo-vs-agency', 'blog/roi-of-fractional-seo', 'contact', 'pricing'],
    publishDate: '2026-04-28',
    status: 'planned',
    notes: 'High-intent keyword. People searching this are actively looking to hire. Direct path to /contact/.',
  },

  // ═══════════════════════════════════════════════
  //  MONTH 2 — May 2026
  // ═══════════════════════════════════════════════
  {
    slug: 'content-cannibalization-how-to-fix',
    title: 'Content Cannibalization: How to Find It, Fix It, and Prevent It',
    targetKeyword: 'content cannibalization',
    secondaryKeywords: ['keyword cannibalization', 'how to fix content cannibalization', 'cannibalization seo'],
    funnel: 'ToFu',
    contentType: 'how-to',
    wordCountTarget: 2500,
    cluster: 'content-strategy',
    internalLinksTo: ['services/content-strategy', 'blog/content-strategy-eeat', 'services/seo-audits'],
    publishDate: '2026-05-05',
    status: 'planned',
    notes: 'Common problem many businesses face. Establishes expertise and connects to content strategy service.',
  },
  {
    slug: 'saas-seo-strategy-guide',
    title: 'The Complete SaaS SEO Strategy Guide for 2026',
    targetKeyword: 'saas seo strategy',
    secondaryKeywords: ['seo for saas', 'saas seo guide', 'b2b saas seo'],
    funnel: 'ToFu',
    contentType: 'guide',
    wordCountTarget: 3000,
    cluster: 'niche-verticals',
    internalLinksTo: ['fractional-seo-saas', 'services/technical-seo', 'services/content-strategy', 'blog/roi-of-fractional-seo'],
    publishDate: '2026-05-12',
    status: 'planned',
    notes: 'Pillar content for the SaaS vertical. Links to niche page and multiple services.',
  },
  {
    slug: 'site-migration-seo-guide',
    title: 'The Complete Guide to SEO Site Migrations (Without Losing Traffic)',
    targetKeyword: 'seo site migration',
    secondaryKeywords: ['website migration seo', 'site migration checklist', 'how to migrate website without losing seo'],
    funnel: 'MoFu',
    contentType: 'guide',
    wordCountTarget: 2500,
    cluster: 'technical-seo',
    internalLinksTo: ['services/seo-migration', 'services/technical-seo', 'blog/technical-seo-checklist-2026'],
    publishDate: '2026-05-19',
    status: 'planned',
    notes: 'Supports the migration service page. People researching migrations are often about to need help.',
  },
  {
    slug: 'ecommerce-category-page-seo',
    title: 'E-Commerce Category Page SEO: The Complete Optimization Guide',
    targetKeyword: 'ecommerce category page seo',
    secondaryKeywords: ['category page optimization', 'ecommerce seo category pages', 'how to optimize category pages'],
    funnel: 'ToFu',
    contentType: 'how-to',
    wordCountTarget: 2500,
    cluster: 'niche-verticals',
    internalLinksTo: ['fractional-seo-ecommerce', 'services/ecommerce-seo', 'services/technical-seo'],
    publishDate: '2026-05-26',
    status: 'planned',
    notes: 'Supports e-commerce niche page. Category pages are the #1 revenue driver in e-commerce SEO.',
  },

  // ═══════════════════════════════════════════════
  //  MONTH 3 — June 2026
  // ═══════════════════════════════════════════════
  {
    slug: 'google-ai-overviews-seo',
    title: 'Google AI Overviews: How to Get Your Content Cited by AI Search',
    targetKeyword: 'google ai overviews seo',
    secondaryKeywords: ['sge seo', 'ai search optimization', 'how to rank in ai overviews', 'generative engine optimization'],
    funnel: 'ToFu',
    contentType: 'thought-leadership',
    wordCountTarget: 2000,
    cluster: 'content-strategy',
    internalLinksTo: ['blog/content-strategy-eeat', 'services/content-strategy', 'services/technical-seo'],
    publishDate: '2026-06-02',
    status: 'planned',
    notes: 'Timely topic. Positions expertise in emerging area. Connects to GEO content on niche pages.',
  },
  {
    slug: 'link-building-strategies-2026',
    title: '7 Link Building Strategies That Actually Work in 2026',
    targetKeyword: 'link building strategies',
    secondaryKeywords: ['how to build backlinks', 'link building techniques', 'white hat link building'],
    funnel: 'ToFu',
    contentType: 'listicle',
    wordCountTarget: 2500,
    cluster: 'link-building',
    internalLinksTo: ['services/link-building', 'blog/content-strategy-eeat', 'services/seo-audits'],
    publishDate: '2026-04-24',
    status: 'published',
    notes: 'High-volume keyword. Supports the link building service page directly. Pulled forward from June.',
  },
  {
    slug: 'seo-reporting-guide-stakeholders',
    title: 'SEO Reporting for Stakeholders: What to Track and How to Present It',
    targetKeyword: 'seo reporting',
    secondaryKeywords: ['seo report template', 'seo metrics to track', 'seo reporting for executives'],
    funnel: 'MoFu',
    contentType: 'how-to',
    wordCountTarget: 2000,
    cluster: 'analytics',
    internalLinksTo: ['services/analytics-reporting', 'blog/roi-of-fractional-seo', 'pricing'],
    publishDate: '2026-06-16',
    status: 'planned',
    notes: 'Targets marketing managers who need to justify SEO spend. Natural lead into analytics service.',
  },
  {
    slug: 'local-seo-guide-small-business',
    title: 'Local SEO for Small Businesses: The Complete 2026 Guide',
    targetKeyword: 'local seo for small business',
    secondaryKeywords: ['local seo guide', 'google business profile optimization', 'local seo checklist'],
    funnel: 'ToFu',
    contentType: 'guide',
    wordCountTarget: 2500,
    cluster: 'local-seo',
    internalLinksTo: ['services/local-international-seo', 'blog/technical-seo-checklist-2026', 'services/seo-audits'],
    publishDate: '2026-06-23',
    status: 'planned',
    notes: 'Local SEO is highly searched. Supports the local/international SEO service page.',
  },
  {
    slug: 'how-long-does-seo-take',
    title: 'How Long Does SEO Take to Work? (Honest Timeline + What Affects Speed)',
    targetKeyword: 'how long does seo take',
    secondaryKeywords: ['seo timeline', 'when does seo start working', 'seo results timeline'],
    funnel: 'BoFu',
    contentType: 'guide',
    wordCountTarget: 2000,
    cluster: 'fractional-seo',
    internalLinksTo: ['blog/roi-of-fractional-seo', 'blog/why-fractional-seo', 'pricing', 'contact'],
    publishDate: '2026-06-30',
    status: 'planned',
    notes: 'Extremely common question from prospects. Setting expectations builds trust and qualifies leads.',
  },
];

/**
 * Topic Clusters Overview
 * Each cluster has a pillar page and supporting content.
 */
export const topicClusters = {
  'fractional-seo': {
    pillar: '/blog/what-is-fractional-seo/',
    description: 'Everything about the fractional SEO model — what it is, comparisons, ROI, hiring guide',
    existingContent: [
      '/blog/what-is-fractional-seo/',
      '/blog/why-fractional-seo/',
      '/blog/fractional-seo-vs-agency/',
      '/blog/roi-of-fractional-seo/',
    ],
    planned: [
      'fractional-cmo-vs-fractional-seo',
      'how-to-choose-seo-consultant',
      'how-long-does-seo-take',
    ],
  },
  'technical-seo': {
    pillar: '/blog/technical-seo-checklist-2026/',
    description: 'Technical SEO fundamentals — audits, migrations, Core Web Vitals, architecture',
    existingContent: [
      '/blog/technical-seo-checklist-2026/',
    ],
    planned: [
      'site-migration-seo-guide',
    ],
  },
  'content-strategy': {
    pillar: '/blog/content-strategy-eeat/',
    description: 'Content strategy, E-E-A-T, cannibalisation, AI search, editorial planning',
    existingContent: [
      '/blog/content-strategy-eeat/',
    ],
    planned: [
      'content-cannibalization-how-to-fix',
      'google-ai-overviews-seo',
    ],
  },
  'niche-verticals': {
    pillar: null,
    description: 'Industry-specific SEO strategies for SaaS, e-commerce, publishing, enterprise',
    existingContent: [
      '/fractional-seo-saas/',
      '/fractional-seo-ecommerce/',
      '/fractional-seo-publishing/',
      '/fractional-seo-enterprise/',
    ],
    planned: [
      'saas-seo-strategy-guide',
      'ecommerce-category-page-seo',
    ],
  },
  'seo-audits': {
    pillar: '/services/seo-audits/',
    description: 'SEO audit process, what to expect, how to interpret results',
    existingContent: [],
    planned: [
      'seo-audit-checklist-what-to-expect',
    ],
  },
  'link-building': {
    pillar: '/services/link-building/',
    description: 'Link building strategies, techniques, and best practices',
    existingContent: [],
    planned: [
      'link-building-strategies-2026',
    ],
  },
  'analytics': {
    pillar: '/services/analytics-reporting/',
    description: 'SEO measurement, reporting, ROI tracking',
    existingContent: [],
    planned: [
      'seo-reporting-guide-stakeholders',
    ],
  },
  'local-seo': {
    pillar: '/services/local-international-seo/',
    description: 'Local and international SEO strategies',
    existingContent: [],
    planned: [
      'local-seo-guide-small-business',
    ],
  },
};

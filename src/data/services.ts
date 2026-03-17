export interface Service {
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  icon: string;
  tagline: string;
  description: string;
  features: string[];
  includes: { heading: string; body: string }[];
  faq: { question: string; answer: string }[];
}

export const services: Service[] = [
  {
    slug: 'technical-seo',
    title: 'Technical SEO',
    metaTitle: 'Technical SEO Services — Hristijan Najcheski',
    metaDescription:
      'Fix crawlability, Core Web Vitals, structured data, and site architecture issues that hold your rankings back. Technical SEO consulting by Hristijan Najcheski.',
    icon: '⚙️',
    tagline: 'Build a technical foundation search engines love',
    description:
      'Without a solid technical foundation, even the best content fails to rank. I audit, fix, and maintain the technical health of your site so search engines can efficiently crawl, render, and index every page.',
    features: [
      'Site architecture optimization',
      'Core Web Vitals improvement',
      'Crawl budget optimization',
      'Structured data implementation',
      'JavaScript SEO & rendering',
      'Mobile-first optimization',
    ],
    includes: [
      {
        heading: 'Full Technical Audit',
        body: 'A comprehensive crawl and analysis of your site covering indexation, crawlability, page speed, structured data, and more — with a prioritized fix list.',
      },
      {
        heading: 'Core Web Vitals Optimization',
        body: 'Identify and resolve LCP, INP, and CLS issues that impact both rankings and user experience, working alongside your dev team.',
      },
      {
        heading: 'Crawl Budget & Indexation',
        body: 'Ensure Google spends its crawl budget on your most valuable pages and that every important URL is properly indexed.',
      },
      {
        heading: 'Structured Data & Schema',
        body: 'Implement and validate the right schema types (Article, Product, FAQ, Service, etc.) to unlock rich results and improve click-through rates.',
      },
    ],
    faq: [
      {
        question: 'How long does a technical SEO audit take?',
        answer:
          'A thorough technical audit typically takes 1–2 weeks depending on site size. You receive a detailed report with prioritized recommendations and a clear implementation roadmap.',
      },
      {
        question: 'Do you implement the fixes or just recommend them?',
        answer:
          'Both options are available. I can work directly with your development team to implement fixes, or provide detailed specs they can act on independently.',
      },
      {
        question: 'How often should a technical audit be done?',
        answer:
          'A full audit once or twice a year is a good baseline. Ongoing monitoring and quarterly mini-audits catch new issues before they compound.',
      },
    ],
  },
  {
    slug: 'content-strategy',
    title: 'Content Strategy',
    metaTitle: 'SEO Content Strategy Services — Hristijan Najcheski',
    metaDescription:
      'Strategic content planning that targets the right keywords, answers user intent, and drives qualified organic traffic. SEO content strategy by Hristijan Najcheski.',
    icon: '📝',
    tagline: 'Content that ranks, converts, and compounds',
    description:
      'Content is the engine of organic growth — but only when it's built around the right strategy. I develop content plans grounded in keyword research, competitive analysis, and a deep understanding of your audience's intent.',
    features: [
      'Keyword research & mapping',
      'Topic cluster strategy',
      'Content gap analysis',
      'Editorial calendar planning',
      'Content optimization & refresh',
      'E-E-A-T optimization',
    ],
    includes: [
      {
        heading: 'Keyword Research & Mapping',
        body: 'Identify high-value, winnable keywords aligned to each stage of the funnel, and map them to your existing and planned content.',
      },
      {
        heading: 'Topic Cluster Strategy',
        body: 'Build authoritative content hubs that signal deep topical expertise to Google and create clear pathways for users through your site.',
      },
      {
        heading: 'Content Gap Analysis',
        body: 'Uncover the topics your competitors rank for that you don\'t — and build a roadmap to close those gaps.',
      },
      {
        heading: 'Content Refresh & Optimization',
        body: 'Existing content is often your quickest win. I audit, update, and optimize underperforming pages to recover and improve rankings.',
      },
    ],
    faq: [
      {
        question: 'Do you write the content or just strategize?',
        answer:
          'My core service is strategy, briefs, and optimization. I can recommend trusted writers or work with your in-house team. Full content production can be arranged as part of an expanded engagement.',
      },
      {
        question: 'How do you decide which keywords to target?',
        answer:
          'I balance search volume, keyword difficulty, business relevance, and user intent. The goal is keywords where you can realistically rank and that drive qualified traffic — not just traffic.',
      },
      {
        question: 'How quickly can content start ranking?',
        answer:
          'New content typically takes 3–6 months to gain traction. Refreshed existing content can see improvements within weeks. A strong technical foundation accelerates this timeline.',
      },
    ],
  },
  {
    slug: 'seo-audits',
    title: 'SEO Audits',
    metaTitle: 'SEO Audit Services — Hristijan Najcheski',
    metaDescription:
      'Comprehensive SEO audits covering technical, content, and off-page factors — with a clear, prioritized action plan. Book an SEO audit with Hristijan Najcheski.',
    icon: '🔍',
    tagline: 'Know exactly what\'s holding your rankings back',
    description:
      'A good SEO audit doesn\'t just list problems — it tells you what to fix first and why. My audits cover every layer of SEO, from technical infrastructure to content quality and backlink health, delivered with an actionable roadmap.',
    features: [
      'Full technical site audit',
      'Content quality assessment',
      'Backlink profile analysis',
      'Competitor benchmarking',
      'Prioritized recommendations',
      'Executive summary & roadmap',
    ],
    includes: [
      {
        heading: 'Technical Health Check',
        body: 'Full crawl analysis covering indexation, crawlability, page speed, mobile usability, structured data, and security.',
      },
      {
        heading: 'Content & On-Page Audit',
        body: 'Assessment of content quality, keyword targeting, title tags, meta descriptions, heading structure, and internal linking.',
      },
      {
        heading: 'Backlink Profile Analysis',
        body: 'Evaluation of your link profile — identifying link opportunities, toxic links to disavow, and how you stack up against competitors.',
      },
      {
        heading: 'Prioritized Action Plan',
        body: 'Every recommendation is tagged by impact and effort. You know exactly what to tackle first for the biggest SEO return.',
      },
    ],
    faq: [
      {
        question: 'What\'s included in the deliverable?',
        answer:
          'You receive a detailed audit report, an executive summary, and a prioritized task list. I also walk you through the findings in a video call.',
      },
      {
        question: 'How is this different from a free tool audit?',
        answer:
          'Free tools surface data. I interpret it, filter out the noise, apply strategic thinking, and tell you what actually matters for your business — not just a list of 300 errors to panic about.',
      },
      {
        question: 'Can you help implement the recommendations after the audit?',
        answer:
          'Yes. Many clients start with an audit and transition into an ongoing fractional engagement to implement the roadmap systematically.',
      },
    ],
  },
  {
    slug: 'link-building',
    title: 'Link Building',
    metaTitle: 'Link Building Services — Hristijan Najcheski',
    metaDescription:
      'White-hat link acquisition strategies that build genuine domain authority through high-quality, relevant backlinks. Link building by Hristijan Najcheski.',
    icon: '🔗',
    tagline: 'Build authority with links that actually matter',
    description:
      'Backlinks remain one of the strongest ranking signals. But not all links are equal — or safe. I focus exclusively on white-hat acquisition strategies that build real authority and withstand algorithm updates.',
    features: [
      'Digital PR & outreach',
      'Content-led link building',
      'Broken link building',
      'Resource page link building',
      'Competitor link analysis',
      'Toxic link disavow',
    ],
    includes: [
      {
        heading: 'Link Opportunity Research',
        body: 'Identify the best link prospects for your site — including competitor backlink gaps, resource pages, broken link opportunities, and PR angles.',
      },
      {
        heading: 'Outreach & Relationship Building',
        body: 'Personalised, human-led outreach that earns links through genuine value — not mass email blasts or paid schemes.',
      },
      {
        heading: 'Content-Led Link Assets',
        body: 'Create linkable assets (data studies, guides, tools) that attract inbound links naturally and support your broader content strategy.',
      },
      {
        heading: 'Link Profile Monitoring',
        body: 'Ongoing monitoring of your link profile to identify and disavow toxic links before they impact your rankings.',
      },
    ],
    faq: [
      {
        question: 'Do you use PBNs or paid links?',
        answer:
          'No. All link building is white-hat and Google-compliant. Shortcuts that violate Google\'s guidelines put your entire domain at risk — it\'s not worth it.',
      },
      {
        question: 'How many links can I expect per month?',
        answer:
          'Quality over quantity. I target fewer, higher-authority links rather than high volumes of low-quality ones. Typical engagements aim for 3–8 high-quality placements per month.',
      },
      {
        question: 'How long before I see ranking improvements from links?',
        answer:
          'New links typically take 4–12 weeks to be discovered, processed, and reflected in rankings. Compound growth becomes visible over a 3–6 month period.',
      },
    ],
  },
  {
    slug: 'analytics-reporting',
    title: 'Analytics & Reporting',
    metaTitle: 'SEO Analytics & Reporting Services — Hristijan Najcheski',
    metaDescription:
      'Custom GA4 dashboards and SEO reporting that connects organic performance to business revenue. Analytics & reporting by Hristijan Najcheski.',
    icon: '📊',
    tagline: 'Turn data into decisions',
    description:
      'Most SEO reports track vanity metrics. I build reporting that connects search performance directly to business outcomes — so you always know what\'s working, what isn\'t, and where to invest next.',
    features: [
      'GA4 & GSC setup & config',
      'Custom dashboard creation',
      'KPI tracking & analysis',
      'Conversion attribution',
      'Monthly performance reports',
      'Data-driven recommendations',
    ],
    includes: [
      {
        heading: 'GA4 & GSC Configuration',
        body: 'Proper setup and configuration of Google Analytics 4 and Google Search Console, including event tracking, goal setup, and Search Console linking.',
      },
      {
        heading: 'Custom Dashboards',
        body: 'Looker Studio dashboards tailored to your business KPIs — tracking organic traffic, rankings, conversions, and revenue attribution in one place.',
      },
      {
        heading: 'Monthly SEO Reports',
        body: 'Clear, concise monthly reports that highlight what changed, why it changed, and what actions to take next.',
      },
      {
        heading: 'Conversion Attribution',
        body: 'Understand which SEO activities are driving leads and revenue — not just clicks.',
      },
    ],
    faq: [
      {
        question: 'What tools do you use for reporting?',
        answer:
          'Primarily GA4, Google Search Console, and Looker Studio for dashboards. I also work with Ahrefs, Semrush, and Screaming Frog depending on the engagement scope.',
      },
      {
        question: 'Can you fix our existing GA4 setup?',
        answer:
          'Yes. Misconfigured analytics is extremely common. I audit existing setups, identify tracking gaps and inaccuracies, and implement a clean, reliable configuration.',
      },
      {
        question: 'How do you measure SEO ROI?',
        answer:
          'By connecting organic traffic data to conversion events and revenue in GA4, and calculating the equivalent paid traffic cost. You get a clear picture of what your SEO investment is actually worth.',
      },
    ],
  },
  {
    slug: 'local-international-seo',
    title: 'Local & International SEO',
    metaTitle: 'Local & International SEO Services — Hristijan Najcheski',
    metaDescription:
      'SEO strategies for local businesses and global brands. Google Business Profile, multi-location, hreflang, and international keyword research. By Hristijan Najcheski.',
    icon: '🌍',
    tagline: 'Reach your audience wherever they search',
    description:
      'Whether you serve a single city or operate across multiple countries, visibility in the right markets is everything. I build geo-targeted SEO strategies that match your audience\'s language, location, and intent.',
    features: [
      'Google Business Profile optimization',
      'Local citation building',
      'Multi-location SEO',
      'Hreflang implementation',
      'International keyword research',
      'Market-specific strategies',
    ],
    includes: [
      {
        heading: 'Google Business Profile Optimization',
        body: 'Complete setup and optimization of your GBP listing to maximize visibility in local packs and Google Maps.',
      },
      {
        heading: 'Local Citation Building',
        body: 'Build and clean up your NAP (Name, Address, Phone) citations across key local directories to strengthen local ranking signals.',
      },
      {
        heading: 'Hreflang & International Setup',
        body: 'Correct implementation of hreflang tags for multi-language and multi-regional sites, preventing duplicate content issues and ensuring the right page reaches the right audience.',
      },
      {
        heading: 'Market-Specific Strategy',
        body: 'Keyword research and competitive analysis tailored to each target market — accounting for local language nuance, search behavior, and competition.',
      },
    ],
    faq: [
      {
        question: 'I serve multiple countries — where do I start?',
        answer:
          'Start with an international SEO audit to assess your current setup, then prioritize markets by opportunity size and competitive difficulty. We build a phased strategy from there.',
      },
      {
        question: 'Do you handle non-English markets?',
        answer:
          'Yes. I work with native-speaking translators and local market specialists to ensure keyword research and content reflect how people actually search in each language.',
      },
      {
        question: 'What\'s the difference between local and international SEO?',
        answer:
          'Local SEO targets users in a specific geographic area (typically a city or region) and heavily involves Google Business Profile. International SEO targets users across multiple countries or languages, requiring hreflang and market-specific strategy.',
      },
    ],
  },
  {
    slug: 'ecommerce-seo',
    title: 'E-Commerce SEO',
    metaTitle: 'E-Commerce SEO Services — Hristijan Najcheski',
    metaDescription:
      'SEO strategies for online stores — product page optimization, category architecture, schema markup, and faceted navigation. E-commerce SEO by Hristijan Najcheski.',
    icon: '🛒',
    tagline: 'Turn organic traffic into e-commerce revenue',
    description:
      'E-commerce SEO has unique challenges — massive page counts, faceted navigation, duplicate product descriptions, and seasonal demand shifts. I specialize in SEO strategies built for online stores that drive purchases, not just visits.',
    features: [
      'Product page optimization',
      'Category structure strategy',
      'Product schema markup',
      'Faceted navigation handling',
      'Internal linking strategy',
      'Review & UGC optimization',
    ],
    includes: [
      {
        heading: 'Category & Product Page Optimization',
        body: 'Optimize category pages as landing pages for high-intent keywords, and ensure product pages have unique, compelling content that ranks and converts.',
      },
      {
        heading: 'Faceted Navigation & Crawl Management',
        body: 'Control how search engines handle filter URLs to prevent crawl waste and duplicate content — one of the biggest technical SEO issues in e-commerce.',
      },
      {
        heading: 'Product Schema Markup',
        body: 'Implement Product, Offer, and Review schema to unlock rich results — star ratings, pricing, and availability — directly in search results.',
      },
      {
        heading: 'Internal Linking Strategy',
        body: 'Build internal linking structures that pass authority to your most important category and product pages and guide users through the purchase journey.',
      },
    ],
    faq: [
      {
        question: 'What e-commerce platforms do you work with?',
        answer:
          'Shopify, WooCommerce, Magento, BigCommerce, and custom-built stores. SEO principles are universal; implementation details vary by platform.',
      },
      {
        question: 'How do you handle out-of-stock or discontinued products?',
        answer:
          'It depends on the situation. Temporary out-of-stock pages are usually kept live with updated messaging. Permanently discontinued products should typically 301 redirect to the most relevant replacement or category page.',
      },
      {
        question: 'Can SEO compete with Google Shopping / paid ads?',
        answer:
          'Absolutely. Organic search traffic has zero marginal cost and compounds over time. Many e-commerce businesses achieve their best CAC through organic — especially for informational and mid-funnel queries.',
      },
    ],
  },
  {
    slug: 'seo-migration',
    title: 'SEO Migration & Relaunch',
    metaTitle: 'SEO Migration & Website Relaunch Services — Hristijan Najcheski',
    metaDescription:
      'Redesigning your site or migrating platforms? Protect and grow your organic traffic through the transition with expert SEO migration planning by Hristijan Najcheski.',
    icon: '🚀',
    tagline: 'Redesign without losing your rankings',
    description:
      'A site migration or relaunch is one of the highest-risk moments in SEO. Done wrong, it can wipe out years of organic equity overnight. I plan and oversee every phase of the migration to protect your traffic and use the transition as an opportunity to improve.',
    features: [
      'Pre-migration audit',
      'URL mapping & redirect strategy',
      'Content preservation plan',
      'Post-migration monitoring',
      'Traffic recovery strategy',
      'Platform-specific optimization',
    ],
    includes: [
      {
        heading: 'Pre-Migration Audit',
        body: 'Baseline your current organic performance, crawl the existing site, and identify every URL that needs to be mapped and preserved.',
      },
      {
        heading: 'URL Mapping & Redirect Strategy',
        body: 'Create a complete redirect map ensuring every changed URL passes equity to its new destination — with zero orphaned redirects.',
      },
      {
        heading: 'Staging Site Review',
        body: 'Review the new site in staging before launch to catch technical issues, missing redirects, and blocked pages before they go live.',
      },
      {
        heading: 'Post-Launch Monitoring',
        body: 'Active monitoring of rankings, crawl errors, and traffic for 4–8 weeks post-launch to catch and resolve any issues quickly.',
      },
    ],
    faq: [
      {
        question: 'When should I bring you in for a migration?',
        answer:
          'As early as possible — ideally at the planning stage, before the new site is built. The earlier SEO is involved, the lower the risk and the less expensive fixes are.',
      },
      {
        question: 'What\'s the most common migration mistake?',
        answer:
          'Launching without a complete redirect map. Missing redirects on high-traffic or high-authority pages can cause significant, lasting ranking losses.',
      },
      {
        question: 'Can you recover traffic after a botched migration?',
        answer:
          'Often yes, though recovery time depends on how long the issues were live. I\'ve helped businesses recover from failed migrations through systematic redirect fixes, recrawl requests, and targeted content recovery.',
      },
    ],
  },
];

export const servicesBySlug: Record<string, Service> = Object.fromEntries(
  services.map((s) => [s.slug, s])
);

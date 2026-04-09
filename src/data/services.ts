export interface Service {
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  icon: string;
  tagline: string;
  description: string;
  longDescription: string;
  whoItsFor: string[];
  process: { step: string; detail: string }[];
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
    longDescription:
      'Technical SEO is the invisible infrastructure that makes everything else work. Think of it like the foundation of a building — you never see it, but without it, nothing stands. I work directly with your development team to identify and resolve the technical barriers that prevent your content from ranking. From crawl budget optimisation to Core Web Vitals engineering, every fix is prioritised by business impact — not just technical severity. Most technical audits I run uncover issues costing businesses 20–40% of their potential organic traffic.',
    whoItsFor: [
      'SaaS companies with complex JavaScript-rendered sites',
      'E-commerce stores with thousands of product pages and faceted navigation',
      'Publishers experiencing crawl budget waste on large content libraries',
      'Any business that has seen unexplained ranking or traffic drops',
      'Companies planning a site migration or platform change',
    ],
    process: [
      { step: 'Crawl & Audit', detail: 'Full site crawl using Screaming Frog + manual analysis. I check indexation, crawlability, rendering, page speed, structured data, and security — 200+ checkpoints.' },
      { step: 'Prioritise', detail: 'Every issue is tagged by impact (high/medium/low) and effort. You get a clear roadmap: fix these 5 things first for the biggest wins.' },
      { step: 'Implement', detail: 'I work alongside your dev team — creating tickets, reviewing PRs, and ensuring fixes are implemented correctly. No "report and run."' },
      { step: 'Monitor', detail: 'Ongoing monitoring via GSC, log file analysis, and scheduled crawls to catch regressions before they impact traffic.' },
    ],
    features: [
      'Site architecture optimization',
      'Core Web Vitals improvement',
      'Crawl budget optimization',
      'Structured data implementation',
      'JavaScript SEO & rendering',
      'Mobile-first optimization',
      'Log file analysis',
      'Redirect & migration planning',
    ],
    includes: [
      {
        heading: 'Full Technical Audit',
        body: 'A comprehensive crawl and analysis of your site covering indexation, crawlability, page speed, structured data, and more — with a prioritised fix list. Typical audits cover 200+ technical checkpoints and are delivered as a detailed report with executive summary.',
      },
      {
        heading: 'Core Web Vitals Optimization',
        body: 'Identify and resolve LCP, INP, and CLS issues that impact both rankings and user experience. I work directly with your dev team to implement fixes, test with real user data (CrUX), and verify improvements in the field — not just lab tools.',
      },
      {
        heading: 'Crawl Budget & Indexation',
        body: 'Ensure Google spends its crawl budget on your most valuable pages and that every important URL is properly indexed. This includes eliminating crawl traps, fixing redirect chains, managing parameter handling, and configuring proper canonical signals.',
      },
      {
        heading: 'Structured Data & Schema',
        body: 'Implement and validate the right schema types (Article, Product, FAQ, Service, BreadcrumbList, etc.) to unlock rich results and improve click-through rates. I use JSON-LD format and validate against Google\'s Rich Results Test and Schema.org specifications.',
      },
    ],
    faq: [
      {
        question: 'How long does a technical SEO audit take?',
        answer:
          'A thorough technical audit typically takes 1–2 weeks depending on site size and complexity. Sites with 50,000+ pages may take longer. You receive a detailed report with prioritised recommendations and a clear implementation roadmap, plus a walkthrough call.',
      },
      {
        question: 'Do you implement the fixes or just recommend them?',
        answer:
          'Both. I can work directly with your development team to implement fixes — creating detailed tickets, reviewing pull requests, and verifying implementations. Or I can provide detailed technical specifications they can act on independently. Most clients prefer the collaborative approach.',
      },
      {
        question: 'How often should a technical audit be done?',
        answer:
          'A full audit once or twice a year is a good baseline. Between audits, I recommend ongoing monitoring: weekly GSC checks, monthly crawl reports, and quarterly mini-audits. This catches new issues before they compound into major traffic losses.',
      },
      {
        question: 'We just redesigned our site and lost traffic. Can you help?',
        answer:
          'Yes — this is one of the most common reasons businesses seek technical SEO help. Failed migrations are often recoverable. I\'ll audit the migration, identify missing redirects, lost pages, and technical regressions, then build a recovery plan. The sooner we start, the faster the recovery.',
      },
      {
        question: 'What tools do you use for technical SEO?',
        answer:
          'Screaming Frog for crawling, Google Search Console for indexation and performance data, Chrome DevTools and Lighthouse for performance analysis, and custom log file analysis scripts. I also use Ahrefs and Semrush for competitive technical benchmarking.',
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
      'Content is the engine of organic growth — but only when it\'s built around the right strategy. I develop content plans grounded in keyword research, competitive analysis, and a deep understanding of your audience\'s intent.',
    longDescription:
      'Most businesses create content reactively — chasing trending topics, copying competitors, or publishing whatever the CEO thought of in the shower. The result is a blog full of disconnected posts that don\'t rank, don\'t convert, and don\'t compound. I build content strategies that are systematic and data-driven: every piece of content exists for a reason, targets a specific keyword with clear intent, and connects to a broader topic cluster. The goal isn\'t just traffic — it\'s the right traffic at the right stage of the buying journey.',
    whoItsFor: [
      'Businesses with a blog that gets minimal organic traffic despite regular publishing',
      'Companies that have never had a formal keyword research or content planning process',
      'Marketing teams that need to align content production with SEO goals',
      'Brands dealing with content cannibalisation (multiple pages competing for the same keywords)',
      'Any business where "we should publish more content" is the default strategy',
    ],
    process: [
      { step: 'Keyword Research', detail: 'Deep-dive keyword research using Ahrefs, GSC data, and competitor analysis. I identify high-value, winnable keywords and map them to funnel stages (ToFu, MoFu, BoFu).' },
      { step: 'Content Mapping', detail: 'Build a topic cluster strategy — pillar pages supported by targeted sub-topics — that creates clear topical authority signals for Google.' },
      { step: 'Editorial Calendar', detail: 'Deliver a 3–6 month editorial calendar with specific topics, target keywords, content type, word count targets, and internal linking instructions.' },
      { step: 'Brief & Optimize', detail: 'Create detailed content briefs for each piece, and optimise existing content for quick wins. I review every draft for SEO alignment before publication.' },
    ],
    features: [
      'Keyword research & mapping',
      'Topic cluster strategy',
      'Content gap analysis',
      'Editorial calendar planning',
      'Content optimization & refresh',
      'E-E-A-T optimization',
      'Content brief creation',
      'Competitor content analysis',
    ],
    includes: [
      {
        heading: 'Keyword Research & Mapping',
        body: 'Identify high-value, winnable keywords aligned to each stage of the funnel, and map them to your existing and planned content. Every keyword is evaluated for search volume, difficulty, business relevance, and intent — not just volume.',
      },
      {
        heading: 'Topic Cluster Strategy',
        body: 'Build authoritative content hubs that signal deep topical expertise to Google and create clear pathways for users through your site. Each cluster has a pillar page and 8–15 supporting articles, all strategically interlinked.',
      },
      {
        heading: 'Content Gap Analysis',
        body: 'Uncover the topics your competitors rank for that you don\'t — and build a roadmap to close those gaps. This includes both keyword gaps and content type gaps (guides, comparisons, tools, etc.).',
      },
      {
        heading: 'Content Refresh & Optimization',
        body: 'Existing content is often your quickest win. I audit, update, and optimise underperforming pages to recover and improve rankings. A well-optimised refresh can deliver results in weeks rather than the months a new piece takes.',
      },
    ],
    faq: [
      {
        question: 'Do you write the content or just strategize?',
        answer:
          'My core service is strategy, briefs, and optimisation. I create detailed content briefs that any competent writer can execute, and I review every draft for SEO alignment before publication. I can recommend trusted writers or work with your in-house team. Full content production can be arranged as part of an expanded engagement.',
      },
      {
        question: 'How do you decide which keywords to target?',
        answer:
          'I balance four factors: search volume (is there demand?), keyword difficulty (can we realistically rank?), business relevance (does this keyword attract buyers, not just browsers?), and user intent (what does someone searching this actually want?). The sweet spot is keywords where all four align.',
      },
      {
        question: 'How quickly can content start ranking?',
        answer:
          'New content typically takes 3–6 months to gain traction in competitive niches. Refreshed existing content can see improvements within 2–4 weeks. A strong technical foundation and existing domain authority accelerate both timelines significantly.',
      },
      {
        question: 'We publish lots of content but it doesn\'t rank. What\'s wrong?',
        answer:
          'The most common causes: no keyword targeting (writing topics, not targeting searches), content cannibalisation (multiple pages competing for the same keyword), thin content that doesn\'t satisfy intent, poor internal linking, or technical issues preventing proper indexation. A content audit will identify the specific issues on your site.',
      },
      {
        question: 'What\'s a topic cluster and why does it matter?',
        answer:
          'A topic cluster is a group of related content pieces centred around a pillar page. For example, a pillar page on "Technical SEO" linked to sub-articles on crawlability, Core Web Vitals, structured data, etc. This signals deep topical expertise to Google and creates strong internal linking — both of which improve rankings across the entire cluster.',
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
    longDescription:
      'Most SEO audits are overwhelming: 200 pages of data, 500 "issues," and zero strategic context. You\'re left with a mountain of information and no idea where to start. My audits are different. Yes, they\'re thorough — I check everything from server response codes to content quality to backlink toxicity. But every finding is contextualised: What\'s the business impact? How hard is the fix? What should you do first? You walk away with a clear, prioritised plan — not a panic-inducing spreadsheet.',
    whoItsFor: [
      'Businesses that have never had a professional SEO audit',
      'Companies experiencing unexplained traffic declines',
      'Brands preparing for a site migration or rebrand',
      'Marketing teams evaluating their current agency\'s work',
      'Any business about to invest significantly in SEO and wants a clear starting point',
    ],
    process: [
      { step: 'Discovery', detail: 'I learn your business, goals, target keywords, and competitive landscape. This context ensures the audit findings are relevant to your specific situation.' },
      { step: 'Deep Analysis', detail: 'Full technical crawl, content assessment, backlink profile review, and competitive benchmarking. Every finding is documented with evidence and context.' },
      { step: 'Prioritisation', detail: 'Issues are scored by impact (how much it affects rankings/traffic) and effort (how hard/expensive to fix). This creates a clear "do this first" order.' },
      { step: 'Delivery & Walkthrough', detail: 'Detailed report, executive summary, and a 60-minute walkthrough call where I explain findings and answer questions. No jargon, no fluff.' },
    ],
    features: [
      'Full technical site audit',
      'Content quality assessment',
      'Backlink profile analysis',
      'Competitor benchmarking',
      'Prioritized recommendations',
      'Executive summary & roadmap',
      'Keyword opportunity analysis',
      'Walkthrough presentation',
    ],
    includes: [
      {
        heading: 'Technical Health Check',
        body: 'Full crawl analysis covering indexation, crawlability, page speed, mobile usability, structured data, and security. I use Screaming Frog, GSC data, and manual testing to ensure nothing is missed — automated tools alone aren\'t enough.',
      },
      {
        heading: 'Content & On-Page Audit',
        body: 'Assessment of content quality, keyword targeting, title tags, meta descriptions, heading structure, internal linking, and content cannibalisation. I identify your strongest content assets and your weakest links.',
      },
      {
        heading: 'Backlink Profile Analysis',
        body: 'Evaluation of your link profile — identifying link opportunities, toxic links to disavow, anchor text distribution, and how you stack up against competitors in terms of domain authority and link velocity.',
      },
      {
        heading: 'Prioritized Action Plan',
        body: 'Every recommendation is tagged by impact and effort. You know exactly what to tackle first for the biggest SEO return. I typically identify 3–5 "quick wins" that can be implemented within the first week.',
      },
    ],
    faq: [
      {
        question: 'What\'s included in the deliverable?',
        answer:
          'You receive a detailed audit report (typically 30–60 pages), an executive summary (1–2 pages for stakeholders), a prioritised task list in spreadsheet format, and a 60-minute video walkthrough call. Everything is designed to be actionable, not just informative.',
      },
      {
        question: 'How is this different from a free tool audit?',
        answer:
          'Free tools surface data. I interpret it, filter out the noise, apply strategic thinking, and tell you what actually matters for your business. A free audit might list 300 "errors" — most of which are irrelevant. My audit tells you the 15 things that are actually costing you traffic and revenue, ranked by priority.',
      },
      {
        question: 'Can you help implement the recommendations after the audit?',
        answer:
          'Yes. Many clients start with an audit and transition into an ongoing fractional engagement to implement the roadmap systematically. This is often the most effective approach — the audit creates the plan, and the retainer ensures it gets executed properly.',
      },
      {
        question: 'How long does the audit process take?',
        answer:
          'From kickoff to delivery, typically 2–3 weeks. This includes the discovery phase, technical analysis, content review, backlink analysis, competitor benchmarking, report writing, and preparing the walkthrough presentation.',
      },
      {
        question: 'We had an audit done by our agency. Why would we need another one?',
        answer:
          'Agency audits are often surface-level — run through a tool, export the report, add a logo. An independent audit provides objectivity and depth that an agency (who has an incentive to upsell services) can\'t match. Think of it as getting a second medical opinion.',
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
    longDescription:
      'Link building in 2026 is about quality, relevance, and earning — not buying, blasting, or begging. Google\'s algorithms are sophisticated enough to devalue manipulative links and reward genuine authority signals. My approach combines digital PR, content-led link acquisition, and strategic outreach to earn links from publications and websites that actually matter in your industry. Every link is a vote of confidence from a real website — and I make sure those votes come from the right places.',
    whoItsFor: [
      'Businesses in competitive niches where content quality alone isn\'t enough to rank',
      'Companies with strong content that deserves more visibility and authority',
      'Brands looking to build domain authority methodically over time',
      'Any business that has been burned by shady link building in the past',
      'Sites recovering from link-related penalties or algorithmic devaluations',
    ],
    process: [
      { step: 'Profile Analysis', detail: 'Audit your current backlink profile and your competitors\'. Identify gaps, toxic links, and the link types that correlate with top rankings in your niche.' },
      { step: 'Strategy', detail: 'Develop a custom link acquisition plan: which link types (editorial, resource, PR, broken link), which targets, what linkable assets to create.' },
      { step: 'Outreach', detail: 'Personalised, human-led outreach to relevant publications, resource pages, and industry contacts. No mass email blasts — every pitch is tailored.' },
      { step: 'Report & Iterate', detail: 'Monthly reporting on links acquired, domain authority trends, and ranking impact. Strategy is adjusted based on what\'s working.' },
    ],
    features: [
      'Digital PR & outreach',
      'Content-led link building',
      'Broken link building',
      'Resource page link building',
      'Competitor link analysis',
      'Toxic link disavow',
      'Guest posting strategy',
      'Linkable asset creation',
    ],
    includes: [
      {
        heading: 'Link Opportunity Research',
        body: 'Identify the best link prospects for your site — including competitor backlink gaps, resource pages, broken link opportunities, PR angles, and industry directories. Every prospect is vetted for relevance, authority, and traffic.',
      },
      {
        heading: 'Outreach & Relationship Building',
        body: 'Personalised, human-led outreach that earns links through genuine value — not mass email blasts or paid schemes. I build real relationships with editors, bloggers, and journalists in your industry.',
      },
      {
        heading: 'Content-Led Link Assets',
        body: 'Create linkable assets (original research, data studies, comprehensive guides, free tools) that attract inbound links naturally and support your broader content strategy. The best link building starts with content worth linking to.',
      },
      {
        heading: 'Link Profile Monitoring',
        body: 'Ongoing monitoring of your link profile to identify and disavow toxic links before they impact your rankings, and to track the authority impact of newly acquired links.',
      },
    ],
    faq: [
      {
        question: 'Do you use PBNs or paid links?',
        answer:
          'No. All link building is white-hat and Google-compliant. Shortcuts that violate Google\'s guidelines put your entire domain at risk — and the consequences of a link penalty can take years to recover from. It\'s simply not worth it.',
      },
      {
        question: 'How many links can I expect per month?',
        answer:
          'Quality over quantity, always. I target fewer, higher-authority links rather than high volumes of low-quality ones. Typical engagements aim for 3–8 high-quality placements per month. One link from a DR70+ industry publication is worth more than 50 links from generic directories.',
      },
      {
        question: 'How long before I see ranking improvements from links?',
        answer:
          'New links typically take 4–12 weeks to be discovered, processed, and reflected in rankings. The compound growth effect becomes visible over a 3–6 month period. Link building is a long-term investment in domain authority — not a quick fix.',
      },
      {
        question: 'We were hit by a link penalty. Can you help?',
        answer:
          'Yes. I\'ll conduct a full backlink audit, identify toxic and manipulative links, prepare and submit a disavow file, and build a recovery strategy. If the penalty was manual, I can help with the reconsideration request. Recovery timelines vary but typically take 3–6 months.',
      },
      {
        question: 'What makes a "good" backlink?',
        answer:
          'Relevance (from a site in your industry or related topic), authority (high domain rating/authority), real traffic (actual humans visit the linking site), editorial context (the link is within genuine content, not a sidebar or footer), and a natural anchor text profile.',
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
    longDescription:
      'If your SEO reporting consists of a monthly PDF showing traffic went up or down, you\'re flying blind. Real SEO reporting connects every metric to business impact: which keywords are driving revenue, which pages are converting, what\'s the ROI of each content investment. I set up the infrastructure — GA4 configuration, GSC integration, custom dashboards — and deliver monthly reports that tell you not just what happened, but what to do about it.',
    whoItsFor: [
      'Businesses whose current SEO reporting is a monthly PDF they never read',
      'Companies that can\'t connect organic traffic to actual revenue',
      'Marketing teams that need to justify SEO investment to leadership',
      'Any business with a misconfigured or underutilised GA4 setup',
      'Companies transitioning from Universal Analytics to GA4',
    ],
    process: [
      { step: 'Audit Current Setup', detail: 'Review your existing GA4, GSC, and any other analytics tools. Identify tracking gaps, misconfigurations, and missing conversion events.' },
      { step: 'Configure & Fix', detail: 'Implement proper event tracking, goal setup, attribution modelling, and Search Console linking. Ensure every conversion is tracked and attributed correctly.' },
      { step: 'Build Dashboards', detail: 'Create custom Looker Studio dashboards tailored to your KPIs — organic traffic, rankings, conversions, revenue, and ROI in one view.' },
      { step: 'Report & Advise', detail: 'Monthly reports that go beyond numbers: what changed, why it changed, and what actions to take next. Clear, jargon-free, and actionable.' },
    ],
    features: [
      'GA4 & GSC setup & config',
      'Custom dashboard creation',
      'KPI tracking & analysis',
      'Conversion attribution',
      'Monthly performance reports',
      'Data-driven recommendations',
      'ROI tracking & reporting',
      'Competitive benchmarking',
    ],
    includes: [
      {
        heading: 'GA4 & GSC Configuration',
        body: 'Proper setup and configuration of Google Analytics 4 and Google Search Console, including event tracking, goal setup, enhanced ecommerce tracking, Search Console linking, and cross-domain tracking where needed.',
      },
      {
        heading: 'Custom Dashboards',
        body: 'Looker Studio dashboards tailored to your business KPIs — tracking organic traffic, keyword rankings, conversions, revenue attribution, and competitive performance in one place. Updated in real-time, accessible to your entire team.',
      },
      {
        heading: 'Monthly SEO Reports',
        body: 'Clear, concise monthly reports that highlight what changed, why it changed, and what actions to take next. Each report includes performance against targets, notable wins and losses, and prioritised recommendations for the month ahead.',
      },
      {
        heading: 'Conversion Attribution',
        body: 'Understand which SEO activities are driving leads and revenue — not just clicks. I set up proper attribution modelling so you can trace revenue back to specific pages, keywords, and content investments.',
      },
    ],
    faq: [
      {
        question: 'What tools do you use for reporting?',
        answer:
          'Primarily GA4, Google Search Console, and Looker Studio for dashboards. I also work with Ahrefs for ranking and backlink tracking, Semrush for competitive analysis, and Screaming Frog for technical monitoring. All data feeds into a unified reporting framework.',
      },
      {
        question: 'Can you fix our existing GA4 setup?',
        answer:
          'Yes. Misconfigured analytics is extremely common — I\'d estimate 60–70% of GA4 setups I audit have significant issues. I audit existing setups, identify tracking gaps and inaccuracies, and implement a clean, reliable configuration. This often reveals that your "real" traffic numbers are quite different from what you\'ve been reporting.',
      },
      {
        question: 'How do you measure SEO ROI?',
        answer:
          'By connecting organic traffic data to conversion events and revenue in GA4, calculating the equivalent paid traffic cost (what it would cost in Google Ads to get the same traffic), and tracking improvement trends over time. You get a clear, defensible picture of what your SEO investment is actually worth.',
      },
      {
        question: 'Our leadership wants a simple dashboard. Can you do that?',
        answer:
          'Absolutely. I build dashboards at two levels: an executive view (3–5 key metrics, traffic-light status, one-sentence insights) and a detailed operational view (for the marketing team to dig into). Different stakeholders need different levels of detail.',
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
    longDescription:
      'Local and international SEO are two sides of the same coin: getting your business in front of the right people in the right place. For local businesses, that means dominating the map pack and local organic results. For international brands, it means navigating hreflang complexity, market-specific keyword research, and multi-language content strategies. Both require specialised knowledge that general SEO agencies often lack — because getting the technical implementation wrong can mean invisible in the markets that matter most.',
    whoItsFor: [
      'Local businesses that want to dominate their city or region in search results',
      'Multi-location businesses needing consistent local presence across locations',
      'Companies expanding into new international markets',
      'E-commerce brands selling to multiple countries or language groups',
      'Any business whose Google Business Profile is underperforming or unclaimed',
    ],
    process: [
      { step: 'Market Analysis', detail: 'Research target markets, local search behaviour, competitive landscape, and keyword demand in each geography. Understanding how people search locally is key.' },
      { step: 'Technical Setup', detail: 'Implement GBP optimisation, local schema, hreflang tags, geo-targeting signals, and proper URL structures for each market.' },
      { step: 'Content Localisation', detail: 'Develop market-specific content strategies — not just translation, but true localisation that reflects how people search and buy in each market.' },
      { step: 'Citation & Authority', detail: 'Build local citations, manage reviews, and earn locally-relevant backlinks to strengthen geographic authority signals.' },
    ],
    features: [
      'Google Business Profile optimization',
      'Local citation building',
      'Multi-location SEO',
      'Hreflang implementation',
      'International keyword research',
      'Market-specific strategies',
      'Review management strategy',
      'Local schema markup',
    ],
    includes: [
      {
        heading: 'Google Business Profile Optimization',
        body: 'Complete setup and optimisation of your GBP listing to maximise visibility in local packs and Google Maps. This includes category selection, attribute optimisation, photo strategy, Q&A management, and post scheduling.',
      },
      {
        heading: 'Local Citation Building',
        body: 'Build and clean up your NAP (Name, Address, Phone) citations across key local directories to strengthen local ranking signals. Inconsistent citations are one of the top reasons businesses underperform in local search.',
      },
      {
        heading: 'Hreflang & International Setup',
        body: 'Correct implementation of hreflang tags for multi-language and multi-regional sites, preventing duplicate content issues and ensuring the right page reaches the right audience. This is one of the most technically complex areas of SEO — and one where mistakes are extremely common.',
      },
      {
        heading: 'Market-Specific Strategy',
        body: 'Keyword research and competitive analysis tailored to each target market — accounting for local language nuance, search behaviour, and competition. "Best software for businesses" translates very differently across markets.',
      },
    ],
    faq: [
      {
        question: 'I serve multiple countries — where do I start?',
        answer:
          'Start with an international SEO audit to assess your current setup, then prioritise markets by opportunity size (search demand) and competitive difficulty. I build a phased strategy — usually tackling 1–2 new markets at a time to ensure quality implementation.',
      },
      {
        question: 'Do you handle non-English markets?',
        answer:
          'Yes. I work with native-speaking translators and local market specialists to ensure keyword research and content reflect how people actually search in each language. Machine translation alone doesn\'t cut it — search intent varies significantly between languages.',
      },
      {
        question: 'What\'s the difference between local and international SEO?',
        answer:
          'Local SEO targets users in a specific geographic area (typically a city or region) and heavily involves Google Business Profile, local citations, and reviews. International SEO targets users across multiple countries or languages, requiring hreflang tags, market-specific content, and geo-targeting strategy.',
      },
      {
        question: 'How important is Google Business Profile for local rankings?',
        answer:
          'Extremely. GBP is the single most important factor for map pack rankings. A well-optimised profile with regular posts, photos, and reviews can outperform competitors with much stronger websites. If you serve local customers, GBP optimisation should be priority number one.',
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
      'E-commerce SEO has unique challenges — massive page counts, faceted navigation, duplicate product descriptions, and seasonal demand shifts. I specialise in SEO strategies built for online stores that drive purchases, not just visits.',
    longDescription:
      'E-commerce SEO is a different beast from content-based SEO. You\'re dealing with thousands (sometimes millions) of product pages, complex faceted navigation that can create crawl nightmares, manufacturer-supplied product descriptions that are duplicated across hundreds of retailers, and seasonal demand that shifts dramatically throughout the year. Generic SEO advice doesn\'t cut it here. I build strategies specifically for online stores — from category page architecture to product schema to internal linking systems that guide users (and crawlers) toward your highest-margin products.',
    whoItsFor: [
      'Online stores with 500+ products struggling to get organic category-level traffic',
      'E-commerce brands over-reliant on paid advertising for sales',
      'Stores with faceted navigation creating indexation and crawl issues',
      'Retailers using manufacturer-provided product descriptions (duplicate content)',
      'Any e-commerce business whose organic revenue is below 30% of total',
    ],
    process: [
      { step: 'E-Commerce Audit', detail: 'Full audit focused on e-commerce-specific issues: faceted navigation, product/category indexation, duplicate content, schema implementation, and internal linking efficiency.' },
      { step: 'Architecture Strategy', detail: 'Design the optimal category structure, URL hierarchy, and internal linking system. Category pages are your most important landing pages — they need to be treated as such.' },
      { step: 'Optimise & Scale', detail: 'Implement product and category optimisations, product schema, and content enhancements. Create templates and processes that scale across thousands of pages.' },
      { step: 'Measure Revenue', detail: 'Track organic revenue by category, product, and keyword. Connect SEO efforts directly to the bottom line with enhanced e-commerce tracking.' },
    ],
    features: [
      'Product page optimization',
      'Category structure strategy',
      'Product schema markup',
      'Faceted navigation handling',
      'Internal linking strategy',
      'Review & UGC optimization',
      'Seasonal SEO planning',
      'Duplicate content resolution',
    ],
    includes: [
      {
        heading: 'Category & Product Page Optimization',
        body: 'Optimise category pages as landing pages for high-intent keywords, and ensure product pages have unique, compelling content that ranks and converts. Category pages are where the revenue is in e-commerce SEO — I treat them as your most important assets.',
      },
      {
        heading: 'Faceted Navigation & Crawl Management',
        body: 'Control how search engines handle filter URLs to prevent crawl waste and duplicate content — one of the biggest technical SEO challenges in e-commerce. I implement proper canonicalisation, parameter handling, and crawl directives so Google indexes what matters.',
      },
      {
        heading: 'Product Schema Markup',
        body: 'Implement Product, Offer, AggregateRating, and Review schema to unlock rich results — star ratings, pricing, availability, and shipping info — directly in search results. Rich snippets can increase click-through rates by 20–30%.',
      },
      {
        heading: 'Internal Linking Strategy',
        body: 'Build internal linking structures that pass authority to your most important category and product pages and guide users through the purchase journey. Smart internal linking is the most underutilised lever in e-commerce SEO.',
      },
    ],
    faq: [
      {
        question: 'What e-commerce platforms do you work with?',
        answer:
          'Shopify, WooCommerce, Magento, BigCommerce, and custom-built stores. SEO principles are universal; implementation details vary by platform. I have particular depth with Shopify and WooCommerce, which cover the majority of mid-market stores.',
      },
      {
        question: 'How do you handle out-of-stock or discontinued products?',
        answer:
          'It depends on the situation. Temporary out-of-stock pages are usually kept live with "notify me" messaging. Permanently discontinued products should typically 301 redirect to the most relevant replacement or category page — preserving any link equity and avoiding 404 dead ends.',
      },
      {
        question: 'Can SEO compete with Google Shopping / paid ads?',
        answer:
          'Absolutely. Organic search traffic has zero marginal cost per click and compounds over time. Many e-commerce businesses achieve their best CAC through organic — especially for informational and mid-funnel queries. The ideal approach is organic and paid working together, with organic carrying the long-term load.',
      },
      {
        question: 'Our product descriptions come from the manufacturer. Is that a problem?',
        answer:
          'Yes — it\'s one of the biggest e-commerce SEO issues. If 100 retailers use the same product description, Google has no reason to rank yours. I develop strategies for creating unique product content at scale: enriched descriptions, unique buying guides, comparison content, and user-generated content integration.',
      },
      {
        question: 'How do you handle seasonal products?',
        answer:
          'Keep seasonal category and product pages live year-round to preserve authority and rankings. Update the content and messaging seasonally (e.g., "Christmas decorations" page stays live but messaging shifts to "Shop early for Christmas 2026"). Starting SEO efforts 3–4 months before peak season ensures you capture the demand when it arrives.',
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
    longDescription:
      'I\'ve seen it too many times: a company spends months on a beautiful redesign, launches with excitement, and watches organic traffic crater by 40–60% within weeks. The CEO is furious, the marketing team is scrambling, and the recovery takes 6–12 months. It doesn\'t have to be this way. A properly planned migration protects your organic equity and can even <em>improve</em> your rankings by cleaning up years of accumulated technical debt. But it requires meticulous planning, comprehensive redirect mapping, and careful post-launch monitoring. This is not a place to cut corners.',
    whoItsFor: [
      'Companies redesigning their website (new design, same platform)',
      'Businesses migrating to a new platform (e.g., WordPress to Shopify, custom to Webflow)',
      'Brands changing domain names or URL structures',
      'Companies consolidating multiple websites into one',
      'Any business whose last migration caused traffic losses they want to avoid repeating',
    ],
    process: [
      { step: 'Pre-Migration Audit', detail: 'Baseline your current organic performance, crawl the existing site, and identify every URL, backlink, and ranking that needs to be preserved. This is the "measure twice" phase.' },
      { step: 'Redirect Mapping', detail: 'Create a complete 1:1 redirect map ensuring every changed URL passes equity to its new destination. For large sites, this can involve thousands of redirect rules — every one matters.' },
      { step: 'Staging Review', detail: 'Crawl and review the new site in staging before launch. Check for SEO issues, missing redirects, blocked pages, broken functionality, and content parity.' },
      { step: 'Launch & Monitor', detail: 'Oversee the launch day, verify redirects are firing correctly, and actively monitor rankings, crawl activity, and traffic for 4–8 weeks post-launch.' },
    ],
    features: [
      'Pre-migration audit',
      'URL mapping & redirect strategy',
      'Content preservation plan',
      'Post-migration monitoring',
      'Traffic recovery strategy',
      'Platform-specific optimization',
      'Staging site review',
      'Risk assessment & contingency plan',
    ],
    includes: [
      {
        heading: 'Pre-Migration Audit',
        body: 'Baseline your current organic performance, crawl the existing site, and identify every URL that needs to be mapped and preserved. This includes cataloguing all rankings, backlinks, and high-traffic pages — the assets you cannot afford to lose.',
      },
      {
        heading: 'URL Mapping & Redirect Strategy',
        body: 'Create a complete redirect map ensuring every changed URL passes equity to its new destination — with zero orphaned redirects. For large migrations, I use automated mapping tools combined with manual review to ensure accuracy.',
      },
      {
        heading: 'Staging Site Review',
        body: 'Review the new site in staging before launch to catch technical issues, missing redirects, blocked pages, content gaps, and SEO regressions before they go live. This is the last line of defence before the real thing.',
      },
      {
        heading: 'Post-Launch Monitoring',
        body: 'Active monitoring of rankings, crawl errors, indexation, and traffic for 4–8 weeks post-launch to catch and resolve any issues quickly. Includes daily GSC checks, crawl comparisons, and ranking tracking to ensure a smooth transition.',
      },
    ],
    faq: [
      {
        question: 'When should I bring you in for a migration?',
        answer:
          'As early as possible — ideally at the planning stage, before the new site is built. The earlier SEO is involved, the lower the risk and the less expensive fixes are. Bringing in SEO after the new site is already in staging limits what can be changed.',
      },
      {
        question: 'What\'s the most common migration mistake?',
        answer:
          'Launching without a complete redirect map. Missing redirects on high-traffic or high-authority pages can cause significant, lasting ranking losses. Other common mistakes: changing URL structures unnecessarily, removing content that was ranking, blocking the new site from crawlers after launch, and not monitoring closely enough post-launch.',
      },
      {
        question: 'Can you recover traffic after a botched migration?',
        answer:
          'Often yes, though recovery time depends on how long the issues were live and how severe they are. I\'ve helped businesses recover from failed migrations through systematic redirect fixes, recrawl requests, content recovery, and targeted authority rebuilding. The sooner you act, the faster the recovery.',
      },
      {
        question: 'How long should I expect traffic to dip after a migration?',
        answer:
          'A well-planned migration typically sees a 10–20% traffic dip for 2–4 weeks as Google recrawls and reprocesses your URLs. This is normal. What\'s not normal is a 40%+ drop that persists beyond 4 weeks — that indicates problems that need immediate attention.',
      },
      {
        question: 'We\'re moving from WordPress to Shopify. Is that risky?',
        answer:
          'Platform migrations are higher risk than simple redesigns because URL structures, site architecture, and technical capabilities often change significantly. WordPress to Shopify specifically requires careful handling of blog URLs, category structures, and metadata. It\'s absolutely doable safely — but it requires thorough planning.',
      },
    ],
  },
];

export const servicesBySlug: Record<string, Service> = Object.fromEntries(
  services.map((s) => [s.slug, s])
);

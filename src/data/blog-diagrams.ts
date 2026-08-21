import type { Diagram } from '../lib/diagram';

/**
 * One diagram per post, keyed by slug. Each states something structural the
 * post argues. Nothing here carries a number that is not already argued in the
 * post itself, because an invented figure in a diagram is the easiest thing in
 * the world for a reader to screenshot and disprove.
 */
export const blogDiagrams: Record<string, Diagram> = {
  'why-fractional-seo': {
    kind: 'quadrant',
    title: 'Where each engagement model sits on cost and seniority',
    caption: 'The gap fractional fills: senior judgement without a senior salary.',
    xAxis: ['Lower cost', 'Higher cost'],
    yAxis: ['Junior execution', 'Senior strategy'],
    items: [
      { label: 'Freelancer', x: 0.18, y: 0.3 },
      { label: 'Agency retainer', x: 0.72, y: 0.42 },
      { label: 'Full-time senior hire', x: 0.86, y: 0.94 },
      { label: 'Fractional consultant', x: 0.34, y: 0.78, accent: true },
    ],
  },

  'technical-seo-checklist-2026': {
    kind: 'stack',
    title: 'The technical stack, bottom-up',
    caption: 'Each layer only pays off once the one beneath it works. Fixing schema on a page nobody can crawl changes nothing.',
    layers: [
      { label: 'Crawl access', sub: 'robots.txt, server responses, crawl budget', accent: true },
      { label: 'Indexation', sub: 'canonicals, noindex, duplicate handling' },
      { label: 'Rendering', sub: 'JavaScript execution, what the bot actually sees' },
      { label: 'Core Web Vitals', sub: 'LCP, INP, CLS on real devices' },
      { label: 'Structured data', sub: 'schema that matches what is on the page' },
    ],
  },

  'content-strategy-eeat': {
    kind: 'stack',
    title: 'The four parts of E-E-A-T',
    caption: 'Experience and expertise are things you show on the page. Authority and trust are things other people confer.',
    layers: [
      { label: 'Experience', sub: 'first-hand proof you have actually done it' },
      { label: 'Expertise', sub: 'depth in a defined subject, not breadth' },
      { label: 'Authoritativeness', sub: 'others citing and referencing you' },
      { label: 'Trust', sub: 'the one the other three exist to build', accent: true },
    ],
  },

  'what-is-fractional-seo': {
    kind: 'flow',
    title: 'Engagement models by commitment',
    caption: 'Read left to right as increasing commitment, not increasing quality.',
    steps: [
      { label: 'Freelancer', sub: 'task by task' },
      { label: 'Fractional', sub: 'part-time, senior, embedded', accent: true },
      { label: 'In-house', sub: 'full-time salary' },
      { label: 'Agency', sub: 'team on retainer' },
    ],
  },

  'fractional-seo-vs-agency': {
    kind: 'columns',
    title: 'Three models compared',
    caption: 'The honest summary: each wins somewhere. Pick for your constraint.',
    rows: ['Who sets strategy', 'Time to start', 'Breadth of execution', 'Fits when'],
    cols: [
      {
        label: 'SEO agency',
        values: ['Senior sold it, junior runs it', 'Weeks', 'Widest, many hands', 'You need volume delivered'],
      },
      {
        label: 'In-house manager',
        values: ['Your own hire', 'Months to recruit', 'One person, one pace', 'SEO is a permanent core function'],
      },
      {
        label: 'Fractional consultant',
        accent: true,
        values: ['The senior, directly', 'Days', 'Narrow, prioritised', 'You need judgement, not headcount'],
      },
    ],
  },

  'roi-of-fractional-seo': {
    kind: 'flow',
    title: 'How organic investment compounds',
    caption: 'Paid traffic stops the day the budget stops. This chain keeps returning after the work ends.',
    steps: [
      { label: 'Investment', sub: 'senior hours, focused' },
      { label: 'Owned asset', sub: 'pages, links, authority' },
      { label: 'Compounding traffic', sub: 'rankings hold and build' },
      { label: 'Pipeline', sub: 'demand you stop renting', accent: true },
    ],
  },

  'seo-audit-checklist-what-to-expect': {
    kind: 'stack',
    title: 'The five layers a complete audit covers',
    caption: 'An audit that skips a layer will find symptoms and miss the cause.',
    layers: [
      { label: 'Crawl and indexation', sub: 'can search engines reach and keep your pages' },
      { label: 'Technical health', sub: 'speed, rendering, errors, redirects' },
      { label: 'On-page', sub: 'titles, headings, internal links, intent match' },
      { label: 'Content', sub: 'coverage, cannibalisation, thin and stale pages' },
      { label: 'Authority', sub: 'link profile and what competitors have that you do not' },
    ],
  },

  'fractional-cmo-vs-fractional-seo': {
    kind: 'columns',
    title: 'Two fractional roles, different jobs',
    caption: 'One sets the direction across channels. The other goes deep in one.',
    rows: ['Owns', 'Horizon', 'Works with', 'Hire when'],
    cols: [
      {
        label: 'Fractional CMO',
        values: ['The whole marketing function', 'Quarters and years', 'Founders, the whole team', 'No one owns marketing strategy'],
      },
      {
        label: 'Fractional SEO consultant',
        accent: true,
        values: ['Organic search and AI visibility', 'Months, compounding', 'Devs, writers, the CMO', 'Organic is the channel that must work'],
      },
    ],
  },

  'link-building-strategies-2026': {
    kind: 'quadrant',
    title: 'Link tactics by effort and payoff',
    caption: 'Bottom-left is where most budgets go and where least value is. Start top-left.',
    xAxis: ['Less effort', 'More effort'],
    yAxis: ['Weaker links', 'Stronger links'],
    items: [
      { label: 'Unlinked mentions', x: 0.2, y: 0.66, accent: true },
      { label: 'Digital PR', x: 0.84, y: 0.9 },
      { label: 'Linkable assets', x: 0.7, y: 0.82 },
      { label: 'Expert quotes', x: 0.34, y: 0.56 },
      { label: 'Partnerships', x: 0.44, y: 0.48 },
      { label: 'Guest posts', x: 0.6, y: 0.36 },
      { label: 'Paid directories', x: 0.16, y: 0.14 },
    ],
  },

  'how-to-build-backlinks-from-scratch': {
    kind: 'flow',
    title: 'The 90-day sequence',
    caption: 'Order matters: outreach before you have something worth linking to is what makes it feel like begging.',
    steps: [
      { label: 'Days 1-14', sub: 'foundation and profile links' },
      { label: 'Days 15-30', sub: 'unlinked mentions, easy wins' },
      { label: 'Days 31-60', sub: 'build the first real asset' },
      { label: 'Days 61-90', sub: 'outreach with something to offer', accent: true },
    ],
  },

  'how-to-evaluate-backlink-quality': {
    kind: 'flow',
    title: 'The gates a link has to pass',
    caption: 'DR is the last thing to look at, not the first. A link failing any earlier gate is not saved by a high score.',
    steps: [
      { label: 'Real traffic?', sub: 'does anyone actually read it' },
      { label: 'Topically close?', sub: 'relevance to your subject' },
      { label: 'Editorially given?', sub: 'or bought and templated' },
      { label: 'In the content?', sub: 'not a footer or sidebar' },
      { label: 'Worth it', sub: 'now check the metrics', accent: true },
    ],
  },

  'how-answer-engines-choose-sources': {
    kind: 'flow',
    title: 'From crawl to citation',
    caption: 'Ranking gets you into the candidate pool. Extractability decides whether you are the passage that gets quoted.',
    steps: [
      { label: 'Crawl', sub: 'bot is allowed in' },
      { label: 'Index', sub: 'page is stored' },
      { label: 'Retrieve', sub: 'passage matches the question' },
      { label: 'Cite', sub: 'answer names your source', accent: true },
    ],
  },
};

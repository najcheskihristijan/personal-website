// Wholesale / B2B keyword strategy + content plan for Incognito Concealment.
// Source: "Incognito - Wholesale & Duty Keyword Strategy.md" (Ahrefs US + 90-day GSC, Aug 2026).
// Keyword tables are read-only context. Only PLAN_ACTIONS and BLOG_IDEAS are reviewable.

export interface Keyword {
  term: string;
  volume: string;
  kd: string;
  cpc: string;
  note?: string;
}

export interface PlanAction {
  id: string;
  phase: string;
  n: number;
  title: string;
  detail: string;
  target?: string;
}

export interface BlogIdea {
  id: string;
  n: number;
  title: string;
  target: string;
  buyer: string;
}

/** The terms everyone assumes we should chase. We pulled the numbers; they are not there. */
export const DEAD_KEYWORDS: Keyword[] = [
  { term: "wholesale holsters", volume: "20", kd: "52", cpc: "—" },
  { term: "holster manufacturers usa", volume: "20", kd: "82", cpc: "—" },
  { term: "holster manufacturer", volume: "20", kd: "85", cpc: "—" },
  { term: "wholesale gun accessories", volume: "10", kd: "—", cpc: "—" },
  { term: "wholesale kydex", volume: "0", kd: "—", cpc: "—" },
  { term: "kydex holster manufacturer", volume: "0", kd: "—", cpc: "—" },
  { term: "wholesale gun holster", volume: "0", kd: "—", cpc: "—" },
  { term: "holster wholesale distributor", volume: "0", kd: "—", cpc: "—" },
];

/** Where the agency and dealer buyer actually searches. KD 0-3 on 800/mo terms. */
export const DUTY_KEYWORDS: Keyword[] = [
  { term: "level 2 retention holster", volume: "800", kd: "0", cpc: "$40", note: "Incognito already makes these" },
  { term: "level 3 retention holster", volume: "800", kd: "0", cpc: "$25" },
  { term: "retention holster", volume: "800", kd: "2", cpc: "$40" },
  { term: "duty holster", volume: "800", kd: "3", cpc: "$40" },
  { term: "us duty gear holsters", volume: "350", kd: "0", cpc: "$70" },
  { term: "police holster", volume: "300", kd: "0", cpc: "$20" },
  { term: "police duty gear", volume: "250", kd: "10", cpc: "$35" },
  { term: "level 3 duty holster", volume: "200", kd: "1", cpc: "$40" },
  { term: "police gun holster", volume: "200", kd: "1", cpc: "$20" },
  { term: "level 2 duty holster", volume: "150", kd: "0", cpc: "$50" },
  { term: "duty belt holster", volume: "150", kd: "1", cpc: "$30" },
  { term: "correction officer duty gear", volume: "100", kd: "1", cpc: "$80", note: "Underserved buyer segment" },
  { term: "law enforcement duty gear", volume: "90", kd: "31", cpc: "$60" },
];

/** The "we fit what nobody else fits" cluster — small individually, hundreds of permutations. */
export const CONFIG_KEYWORDS: Keyword[] = [
  { term: "holster for glock 17 with light", volume: "90", kd: "0", cpc: "—" },
  { term: "red dot holster", volume: "50", kd: "0", cpc: "$45" },
  { term: "optic cut holster", volume: "30", kd: "0", cpc: "$60" },
  { term: "weapon light holster", volume: "30", kd: "0", cpc: "$40" },
];

export const PER_MODEL_KEYWORDS = "glock 17 duty holster (150) · glock 19 duty holster (150) · walther pdp duty holster (150) · springfield echelon duty holster (150) · 1911 duty holster (200) · glock 48 duty holster (90) · glock 43x duty holster (100) · glock 20 duty holster (90) · glock 19 duty holster with light (100) — all KD 0-2";

export const PLAN_ACTIONS: PlanAction[] = [
  { id: "plan-1", phase: "Phase 1 — Fix what exists (0–30 days)", n: 1, title: "Rewrite /dealers-products/", detail: "It currently has the placeholder title \"Dealers Products - Page 1\" and no meta description at all, yet still pulls 92 impressions at position 11. New title: \"Dealer & Wholesale Holsters | Incognito Concealment\", with a meta description covering pricing tiers, lead times, made-in-USA and custom fitment." },
  { id: "plan-2", phase: "Phase 1 — Fix what exists (0–30 days)", n: 2, title: "Rebuild /become-a-dealer/ as the conversion page", detail: "Requirements, minimum order, margin and tier structure, lead times, a real application form, and a named contact. The page exists and has a real meta description — it just does not convert." },
  { id: "plan-3", phase: "Phase 1 — Fix what exists (0–30 days)", n: 3, title: "Interlink the two dealer pages", detail: "Neither is currently linked from anywhere that matters, so neither can rank." },
  { id: "plan-4", phase: "Phase 1 — Fix what exists (0–30 days)", n: 4, title: "Add \"Dealers & Agencies\" to the main navigation and footer", detail: "A B2B buyer should not have to hunt for the wholesale route." },
  { id: "plan-5", phase: "Phase 1 — Fix what exists (0–30 days)", n: 5, title: "Add Organization + Offer schema", detail: "Flags wholesale and B2B availability to search engines." },
  { id: "plan-6", phase: "Phase 2 — Win the duty cluster (30–90 days)", n: 6, title: "Build a /duty-holsters/ hub", detail: "Targets \"duty holster\" — 800 searches a month at difficulty 3.", target: "duty holster" },
  { id: "plan-7", phase: "Phase 2 — Win the duty cluster (30–90 days)", n: 7, title: "Build /level-2-retention-holsters/", detail: "800 a month at difficulty ZERO, and you already make the product. This is the single best opportunity on the site.", target: "level 2 retention holster" },
  { id: "plan-8", phase: "Phase 2 — Win the duty cluster (30–90 days)", n: 8, title: "Build /level-3-retention-holsters/", detail: "Also 800 a month at difficulty zero.", target: "level 3 retention holster" },
  { id: "plan-9", phase: "Phase 2 — Win the duty cluster (30–90 days)", n: 9, title: "Build a /law-enforcement/ agency hub", detail: "Nothing on the site currently addresses the agency buyer — this is the biggest gap. Needs agency pricing, quote request, bulk and PO process, department fitting, and trial units.", target: "police duty gear, law enforcement duty gear" },
  { id: "plan-10", phase: "Phase 2 — Win the duty cluster (30–90 days)", n: 10, title: "Pillar guide: \"The Complete Guide to Duty Holster Retention Levels (1, 2, 3)\"", detail: "Targets the whole retention cluster and is the piece agencies actually read before purchasing." },
  { id: "plan-11", phase: "Phase 2 — Win the duty cluster (30–90 days)", n: 11, title: "Quick Ship duty landing page", detail: "Your highest-margin products paired with the lead-time argument. A department outfitting 40 officers cannot wait 8 weeks, which makes stock availability a sales weapon, not just a margin one." },
  { id: "plan-12", phase: "Phase 3 — Scale per-model (90–180 days)", n: 12, title: "Per-model duty pages", detail: "\"[Model] Duty Holster\" for the models with confirmed volume at difficulty 0–2: Glock 17, 19, 43x, 48, 20; Walther PDP; Springfield Echelon; 1911. Each covering retention options, light and optic compatibility, duty-belt mounting and Quick Ship availability." },
  { id: "plan-13", phase: "Phase 3 — Scale per-model (90–180 days)", n: 13, title: "Gun × light × optic configuration pages", detail: "The \"unsupported configuration\" play — \"holster for [gun] with [light]\", \"[gun] optic cut holster\", \"red dot holster for [gun]\". Each converts hard because the searcher has a specific problem nobody else solves." },
  { id: "plan-14", phase: "Phase 3 — Scale per-model (90–180 days)", n: 14, title: "Corrections officer duty gear page", detail: "100 a month, difficulty 1, and an $80 cost-per-click — meaning advertisers pay real money for this buyer. Almost nobody serves the segment properly.", target: "correction officer duty gear" },
  { id: "plan-15", phase: "Phase 3 — Scale per-model (90–180 days)", n: 15, title: "Agency case studies and social proof", detail: "B2B buyers need proof other agencies trust you. Worth checking what can be published — many agencies will not allow naming, but anonymised deployments still work." },
];

export const BLOG_IDEAS: BlogIdea[] = [
  { id: "blog-1", n: 1, title: "Duty Holster Retention Levels Explained: Level 1 vs 2 vs 3", target: "level 2/3 retention holster", buyer: "Agency" },
  { id: "blog-2", n: 2, title: "How to Outfit a Department: A Purchasing Guide to Duty Holsters", target: "police duty gear", buyer: "Agency" },
  { id: "blog-3", n: 3, title: "What Lead Time Should You Expect on a Bulk Holster Order?", target: "conversion piece", buyer: "Dealer / Agency" },
  { id: "blog-4", n: 4, title: "Level 2 vs Level 3 Retention: Which Does Your Agency Need?", target: "level 3 duty holster", buyer: "Agency" },
  { id: "blog-5", n: 5, title: "Why Duty Holster Fitment Matters When Your Officers Run Lights and Optics", target: "weapon light holster", buyer: "Agency" },
  { id: "blog-6", n: 6, title: "Selling Holsters in Your Gun Store: What Actually Moves", target: "dealer intent", buyer: "Dealer" },
  { id: "blog-7", n: 7, title: "Made-in-USA Holsters: What Agencies Should Ask a Manufacturer", target: "holster manufacturers usa", buyer: "Agency" },
  { id: "blog-8", n: 8, title: "Corrections Officer Duty Gear: Retention Considerations", target: "correction officer duty gear", buyer: "Agency" },
];

export const CAVEATS: string[] = [
  "Volumes are Ahrefs estimates, not Search Console truth. Directionally reliable; exact numbers will vary.",
  "Difficulty 0 does not mean instant number one. It means weak competing pages. We still need genuinely good pages and some authority — the domain is DR 8, which is low.",
  "B2B SEO is slow and low-volume by nature. Even executed perfectly this cluster brings tens to low-hundreds of visits a month — but they are buyers worth thousands each. Judge it on enquiries and orders, not traffic.",
  "SEO alone will not fill a wholesale pipeline. The fastest wins are direct outreach to dealers and agencies, trade shows, and the podcast and creator work above. This plan makes inbound work alongside that — it does not replace it.",
  "Per-model pages must be genuinely differentiated, not spun templates, or search engines treat them as doorway pages. The site already has a thin-page problem: 118 of 154 audited URLs get zero impressions.",
];

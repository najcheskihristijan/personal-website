import { readFileSync, writeFileSync, existsSync, mkdirSync, renameSync } from 'node:fs';
import { join, dirname } from 'node:path';

/**
 * Persistence for client review decisions (approve / reject / unsure + comment).
 *
 * This is deliberately the ONLY module that knows where decisions are stored. The page and the
 * API route talk to `getDecisions` / `saveDecision` and nothing else, so moving this to Postgres
 * later is a rewrite of this file rather than of the feature. Same JSON-store convention as
 * `leads.ts`, with one addition: writes go through a temp file + rename so a crash mid-write
 * cannot leave a truncated file that loses every prior decision.
 *
 * NOTE: `data/` must be excluded from deploy.sh's rsync --delete, or every deploy wipes this.
 */

export type Verdict = 'approved' | 'rejected' | 'unsure' | '';

export interface Decision {
  itemId: string;
  verdict: Verdict;
  comment: string;
  updatedAt: string;
}

/** Keyed by itemId so a re-decision overwrites rather than appending a second opinion. */
export type DecisionMap = Record<string, Decision>;

const VALID_VERDICTS: Verdict[] = ['approved', 'rejected', 'unsure', ''];

function dbPath(reviewKey: string): string {
  return join(process.cwd(), 'data', `review-${reviewKey}.json`);
}

/** Reject anything that could escape the data directory via a crafted review key. */
export function isSafeKey(key: string): boolean {
  return /^[a-z0-9-]{1,40}$/.test(key);
}

export function getDecisions(reviewKey: string): DecisionMap {
  if (!isSafeKey(reviewKey)) return {};
  const path = dbPath(reviewKey);
  try {
    if (!existsSync(path)) return {};
    const parsed = JSON.parse(readFileSync(path, 'utf-8'));
    // A hand-edited or half-written file should degrade to "no decisions yet", never crash the
    // client-facing page.
    return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : {};
  } catch {
    return {};
  }
}

export function saveDecision(
  reviewKey: string,
  itemId: string,
  verdict: Verdict,
  comment: string,
): Decision | null {
  if (!isSafeKey(reviewKey)) return null;
  if (!itemId || itemId.length > 120) return null;
  if (!VALID_VERDICTS.includes(verdict)) return null;

  const decisions = getDecisions(reviewKey);
  const decision: Decision = {
    itemId,
    verdict,
    comment: (comment || '').slice(0, 4000),
    updatedAt: new Date().toISOString(),
  };
  decisions[itemId] = decision;

  const path = dbPath(reviewKey);
  const dir = dirname(path);
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
  const tmp = `${path}.tmp`;
  writeFileSync(tmp, JSON.stringify(decisions, null, 2));
  renameSync(tmp, path);

  return decision;
}

export interface ReviewSummary {
  approved: number;
  rejected: number;
  unsure: number;
  undecided: number;
  total: number;
}

export function summarise(decisions: DecisionMap, itemIds: string[]): ReviewSummary {
  const s: ReviewSummary = { approved: 0, rejected: 0, unsure: 0, undecided: 0, total: itemIds.length };
  for (const id of itemIds) {
    const v = decisions[id]?.verdict;
    if (v === 'approved') s.approved++;
    else if (v === 'rejected') s.rejected++;
    else if (v === 'unsure') s.unsure++;
    else s.undecided++;
  }
  return s;
}

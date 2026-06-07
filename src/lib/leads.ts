import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';

const DB_PATH = join(process.cwd(), 'data', 'leads.json');

export interface Lead {
  id: string;
  tool: string;
  email: string;
  url?: string;
  payload?: Record<string, unknown>;
  date: string;
  ip?: string;
  emailSent: boolean;
  emailError?: string;
}

function read(): Lead[] {
  try {
    if (!existsSync(DB_PATH)) {
      const dir = dirname(DB_PATH);
      if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
      writeFileSync(DB_PATH, '[]');
      return [];
    }
    return JSON.parse(readFileSync(DB_PATH, 'utf-8'));
  } catch {
    return [];
  }
}

function write(leads: Lead[]) {
  const dir = dirname(DB_PATH);
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
  writeFileSync(DB_PATH, JSON.stringify(leads, null, 2));
}

export function saveLead(lead: Omit<Lead, 'id' | 'date' | 'emailSent'>): Lead {
  const leads = read();
  const newLead: Lead = {
    ...lead,
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    date: new Date().toISOString(),
    emailSent: false,
  };
  leads.push(newLead);
  write(leads);
  return newLead;
}

export function markEmailSent(id: string, error?: string) {
  const leads = read();
  const lead = leads.find((l) => l.id === id);
  if (!lead) return;
  lead.emailSent = !error;
  if (error) lead.emailError = error;
  write(leads);
}

export function listLeads(): Lead[] {
  return read();
}

// Simple in-memory rate limit: 5 requests / minute / IP
const hits = new Map<string, number[]>();
export function rateLimit(ip: string, max = 5, windowMs = 60_000): boolean {
  const now = Date.now();
  const arr = (hits.get(ip) || []).filter((t) => now - t < windowMs);
  if (arr.length >= max) return false;
  arr.push(now);
  hits.set(ip, arr);
  return true;
}

export function isValidEmail(email: string): boolean {
  if (!email || typeof email !== 'string' || email.length > 254) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim());
}

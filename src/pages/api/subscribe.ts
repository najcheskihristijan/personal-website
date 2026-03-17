import type { APIRoute } from 'astro';
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';

export const prerender = false;

const DB_PATH = join(process.cwd(), 'data', 'subscribers.json');

interface Subscriber {
    email: string;
    name?: string;
    date: string;
}

function getSubscribers(): Subscriber[] {
    try {
        if (!existsSync(DB_PATH)) {
            const dir = dirname(DB_PATH);
            if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
            writeFileSync(DB_PATH, '[]');
            return [];
        }
        const data = readFileSync(DB_PATH, 'utf-8');
        return JSON.parse(data);
    } catch {
        return [];
    }
}

function saveSubscribers(subscribers: Subscriber[]) {
    const dir = dirname(DB_PATH);
    if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
    writeFileSync(DB_PATH, JSON.stringify(subscribers, null, 2));
}

export const POST: APIRoute = async ({ request }) => {
    try {
        const body = await request.json();
        const { email, name } = body;

        if (!email || typeof email !== 'string' || !email.includes('@')) {
            return new Response(
                JSON.stringify({ error: 'Valid email is required' }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        const subscribers = getSubscribers();

        // Check if already subscribed
        if (subscribers.some((s) => s.email.toLowerCase() === email.toLowerCase())) {
            return new Response(
                JSON.stringify({ message: 'Already subscribed' }),
                { status: 200, headers: { 'Content-Type': 'application/json' } }
            );
        }

        subscribers.push({
            email: email.toLowerCase().trim(),
            name: name || undefined,
            date: new Date().toISOString(),
        });

        saveSubscribers(subscribers);

        return new Response(
            JSON.stringify({ message: 'Subscribed successfully' }),
            { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
    } catch {
        return new Response(
            JSON.stringify({ error: 'Internal server error' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
};

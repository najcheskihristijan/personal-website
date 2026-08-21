import { existsSync } from 'node:fs';
import { join } from 'node:path';

/**
 * Load .env into process.env at runtime, once.
 *
 * WHY THIS EXISTS: the site runs under `pm2 restart astro-personal`, and pm2 restart REUSES the
 * environment the process was originally started with. So a .env placed on the server is invisible
 * to the app unless something reads it. The alternative — `pm2 delete` + `pm2 start` with
 * --node-args, or an ecosystem file — means restructuring how a live site boots, which is a much
 * bigger risk than reading a file.
 *
 * Values already present in the real environment WIN: process.loadEnvFile does not overwrite
 * existing keys, so a var exported by pm2 or the shell still takes precedence over the file.
 */

let loaded = false;

export function loadEnv(): void {
  if (loaded) return;
  loaded = true;
  const path = join(process.cwd(), '.env');
  if (!existsSync(path)) return;
  try {
    // Node 20.12+/22+. Wrapped because a malformed .env must not take the whole site down.
    process.loadEnvFile(path);
  } catch (err) {
    console.error('[env] could not load .env:', err instanceof Error ? err.message : err);
  }
}

/** Read a secret from the real environment, falling back to .env on disk. */
export function secret(name: string): string | undefined {
  loadEnv();
  return process.env[name] || undefined;
}

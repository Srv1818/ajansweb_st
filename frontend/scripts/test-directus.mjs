/**
 * Directus bağlantı test scripti.
 * Çalıştır: node scripts/test-directus.mjs
 */

import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dir = dirname(fileURLToPath(import.meta.url));

// .env.local'ı manuel parse et
const envPath = join(__dir, '..', '.env.local');
let envVars = {};
try {
  const raw = readFileSync(envPath, 'utf8');
  for (const line of raw.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx === -1) continue;
    const key = trimmed.slice(0, eqIdx).trim();
    const value = trimmed.slice(eqIdx + 1).trim();
    envVars[key] = value;
  }
} catch {
  console.error('.env.local okunamadı');
}

const BASE_URL = envVars.DIRECTUS_INTERNAL_URL ?? envVars.NEXT_PUBLIC_DIRECTUS_URL;
const TOKEN = envVars.DIRECTUS_TOKEN;

if (!BASE_URL || !TOKEN) {
  console.error('DIRECTUS_URL veya DIRECTUS_TOKEN eksik!');
  process.exit(1);
}

console.log('URL :', BASE_URL);
console.log('Token: [REDACTED]');
console.log();

async function req(path) {
  const url = `${BASE_URL}${path}`;
  console.log(`GET ${url}`);
  try {
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${TOKEN}` },
      signal: AbortSignal.timeout(8000),
    });
    const json = await res.json();
    console.log(`  Status: ${res.status}`);
    console.log(`  Body:`, JSON.stringify(json, null, 2).slice(0, 800));
  } catch (err) {
    console.error(`  HATA: ${err.message}`);
  }
  console.log();
}

await req('/server/ping');
await req('/items/Page?filter[slug][_eq]=home&filter[status][_eq]=published&limit=1');
await req('/items/services?filter[status][_eq]=published&sort=sort,id&limit=6');
await req('/items/team_members_?filter[status][_eq]=published&sort=sort,id&limit=5');
await req('/items/posts?filter[status][_eq]=published&sort=-date_created&limit=3');
await req('/items/site_settings');

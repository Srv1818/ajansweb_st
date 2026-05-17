import {
  createDirectus,
  rest,
  readItems,
  readSingleton,
  staticToken,
} from '@directus/sdk';

// Server-side only — DIRECTUS_TOKEN asla NEXT_PUBLIC_ olmamalı
const DIRECTUS_URL = process.env.DIRECTUS_URL ?? 'http://localhost:8055';
const DIRECTUS_TOKEN = process.env.DIRECTUS_TOKEN ?? '';

const client = createDirectus(DIRECTUS_URL)
  .with(staticToken(DIRECTUS_TOKEN))
  .with(rest());

// Directus dosya/medya URL'i üretir
export function getAssetUrl(fileId: string | null | undefined): string {
  if (!fileId) return '';
  return `${DIRECTUS_URL}/assets/${fileId}`;
}

// Pages
export async function getPages() {
  return client.request(
    readItems('pages', {
      filter: { status: { _eq: 'published' } },
      sort: ['-date_created'],
    })
  );
}

export async function getPage(slug: string) {
  const items = await client.request(
    readItems('pages', {
      filter: { slug: { _eq: slug }, status: { _eq: 'published' } },
      limit: 1,
    })
  );
  return items[0] ?? null;
}

// Blog
export async function getPosts(page = 1, pageSize = 10) {
  return client.request(
    readItems('posts', {
      filter: { status: { _eq: 'published' } },
      sort: ['-date_created'],
      limit: pageSize,
      offset: (page - 1) * pageSize,
    })
  );
}

export async function getPost(slug: string) {
  const items = await client.request(
    readItems('posts', {
      filter: { slug: { _eq: slug }, status: { _eq: 'published' } },
      limit: 1,
    })
  );
  return items[0] ?? null;
}

// Hizmetler
export async function getServices() {
  return client.request(
    readItems('services', {
      filter: { status: { _eq: 'published' } },
      sort: ['order'],
    })
  );
}

export async function getService(slug: string) {
  const items = await client.request(
    readItems('services', {
      filter: { slug: { _eq: slug }, status: { _eq: 'published' } },
      limit: 1,
    })
  );
  return items[0] ?? null;
}

// Ekip
export async function getTeamMembers() {
  return client.request(
    readItems('team_members', {
      filter: { is_active: { _eq: true } },
      sort: ['order'],
    })
  );
}

// Site ayarları (singleton)
export async function getSiteSettings() {
  return client.request(readSingleton('site_settings'));
}

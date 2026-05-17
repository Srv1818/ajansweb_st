import {
  createDirectus,
  rest,
  staticToken,
  readItems,
  readItem,
  readSingleton,
} from '@directus/sdk';

// Sunucu tarafı Coolify iç ağını kullanır → hızlı, dış internete çıkmaz
// İstemci/browser NEXT_PUBLIC_ URL'i kullanır
const DIRECTUS_URL =
  process.env.DIRECTUS_INTERNAL_URL ?? process.env.NEXT_PUBLIC_DIRECTUS_URL!;
const DIRECTUS_TOKEN = process.env.DIRECTUS_TOKEN!;

export const directus = createDirectus(DIRECTUS_URL)
  .with(staticToken(DIRECTUS_TOKEN))
  .with(rest());

// Directus dosya/medya URL'i — file ID'den tam URL üretir
export function getAssetUrl(fileId: string | null | undefined): string {
  if (!fileId) return '';
  const publicUrl = process.env.NEXT_PUBLIC_DIRECTUS_URL ?? DIRECTUS_URL;
  return `${publicUrl}/assets/${fileId}`;
}

// Koleksiyon okuma — published filtresi + özel query desteği
export async function getItems<T>(
  collection: string,
  query?: object
): Promise<T[]> {
  return directus.request(
    readItems(collection as any, {
      filter: { status: { _eq: 'published' } },
      ...query,
    })
  ) as Promise<T[]>;
}

// Tek öğe ID ile
export async function getItemById<T>(
  collection: string,
  id: string | number,
  query?: object
): Promise<T> {
  return directus.request(
    readItem(collection as any, id, query as any)
  ) as Promise<T>;
}

// Singleton koleksiyon (site_settings gibi)
export async function getSingleton<T>(collection: string): Promise<T> {
  return directus.request(readSingleton(collection as any)) as Promise<T>;
}

// --- Hazır helper'lar ---

export const getPages = (query?: object) =>
  getItems('pages', { sort: ['-date_created'], ...query });

export const getPage = (slug: string) =>
  getItems('pages', {
    filter: { slug: { _eq: slug }, status: { _eq: 'published' } },
    limit: 1,
  }).then((items) => (items as any[])[0] ?? null);

export const getPosts = (page = 1, pageSize = 10) =>
  getItems('posts', {
    sort: ['-date_created'],
    limit: pageSize,
    offset: (page - 1) * pageSize,
  });

export const getPost = (slug: string) =>
  getItems('posts', {
    filter: { slug: { _eq: slug }, status: { _eq: 'published' } },
    limit: 1,
  }).then((items) => (items as any[])[0] ?? null);

export const getServices = () =>
  getItems('services', { sort: ['sort', 'id'] });

export const getService = (slug: string) =>
  getItems('services', {
    filter: { slug: { _eq: slug }, status: { _eq: 'published' } },
    limit: 1,
  }).then((items) => (items as any[])[0] ?? null);

export const getTeamMembers = () =>
  getItems('team_members', {
    filter: { is_active: { _eq: true }, status: { _eq: 'published' } },
    sort: ['sort', 'id'],
  });

export const getSiteSettings = () => getSingleton('site_settings');

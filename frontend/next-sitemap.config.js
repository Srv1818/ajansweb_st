/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com',
  generateRobotsTxt: false, // app/robots.ts zaten üretiyor
  exclude: ['/api/*'],
  additionalPaths: async () => {
    const base = process.env.NEXT_PUBLIC_DIRECTUS_URL;
    const token = process.env.DIRECTUS_TOKEN;
    if (!base || !token) return [];

    try {
      const [postsRes, servicesRes] = await Promise.all([
        fetch(
          `${base}/items/posts?fields=slug&filter[status][_eq]=published&limit=-1`,
          { headers: { Authorization: `Bearer ${token}` } }
        ),
        fetch(
          `${base}/items/services?fields=slug&filter[status][_eq]=published`,
          { headers: { Authorization: `Bearer ${token}` } }
        ),
      ]);
      const posts = await postsRes.json();
      const services = await servicesRes.json();

      return [
        ...(posts.data ?? []).map((p) => ({ loc: `/blog/${p.slug}` })),
        ...(services.data ?? []).map((s) => ({ loc: `/hizmetler/${s.slug}` })),
      ];
    } catch {
      return [];
    }
  },
};

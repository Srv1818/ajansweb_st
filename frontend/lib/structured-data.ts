import type { SiteSettings, Post, Service } from '@/types/directus';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? '';

export function organizationSchema(settings: SiteSettings) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: settings.site_name,
    description: settings.site_description,
    url: siteUrl,
    email: settings.contact_email,
    telephone: settings.phone,
    address: settings.address
      ? { '@type': 'PostalAddress', streetAddress: settings.address }
      : undefined,
  };
}

export function articleSchema(post: Post) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date_created,
    url: `${siteUrl}/blog/${post.slug}`,
  };
}

export function serviceSchema(service: Service) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.title,
    description: service.short_description,
    url: `${siteUrl}/hizmetler/${service.slug}`,
  };
}

export function safeJsonLd(schema: object): string {
  return JSON.stringify(schema)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026');
}

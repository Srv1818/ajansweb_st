import { notFound } from 'next/navigation';
import { getServices, getService } from '@/lib/directus';
import type { Service } from '@/types/directus';

export const revalidate = 300;

export async function generateStaticParams() {
  try {
    const services = (await getServices()) as Service[];
    return services.map((s) => ({ slug: s.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = (await getService(slug).catch(() => null)) as Service | null;
  return {
    title: service?.seo_title ?? service?.title ?? 'Hizmet',
    description: service?.seo_description ?? service?.short_description,
  };
}

export default async function HizmetDetayPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = (await getService(slug).catch(() => null)) as Service | null;

  if (!service) notFound();

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-4xl font-bold text-gray-900 mb-6">{service.title}</h1>
      {service.short_description && (
        <p className="text-xl text-gray-600 mb-8">{service.short_description}</p>
      )}
      {service.content && (
        <div
          className="prose prose-gray max-w-none"
          dangerouslySetInnerHTML={{ __html: service.content }}
        />
      )}
    </main>
  );
}

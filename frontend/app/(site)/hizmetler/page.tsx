import Link from 'next/link';
import { icons, Zap } from 'lucide-react';
import { getServices } from '@/lib/directus';
import type { Service } from '@/types/directus';

function ServiceIcon({ name }: { name: string }) {
  const key = name
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join('') as keyof typeof icons;
  const Icon = icons[key] ?? Zap;
  return <Icon size={20} strokeWidth={1.75} />;
}

export const revalidate = 60;

export const metadata = {
  title: 'Hizmetler',
};

export default async function HizmetlerPage() {
  const services = (await getServices().catch(() => [])) as Service[];

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-4xl font-bold text-gray-900 mb-12">Hizmetler</h1>
      {services.length === 0 ? (
        <p className="text-gray-500">Henüz hizmet eklenmemiş.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((s) => (
            <Link
              key={s.id}
              href={`/hizmetler/${s.slug}`}
              className="block p-6 border rounded-xl hover:shadow-md transition-shadow bg-white"
            >
              {s.icon && (
                <span className="mb-3 block text-indigo-500">
                  <ServiceIcon name={s.icon} />
                </span>
              )}
              <h2 className="font-semibold text-gray-900">{s.title}</h2>
              {s.short_description && (
                <p className="mt-2 text-sm text-gray-500 line-clamp-3">{s.short_description}</p>
              )}
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}

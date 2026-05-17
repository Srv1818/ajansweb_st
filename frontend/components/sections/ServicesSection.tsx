import Link from 'next/link';
import type { Service } from '@/types/directus';

function ServiceCard({ service }: { service: Service }) {
  return (
    <Link
      href={`/hizmetler/${service.slug}`}
      className="block p-6 border rounded-xl hover:shadow-md transition-shadow bg-white"
    >
      {service.icon && (
        <span className="text-3xl mb-3 block">{service.icon}</span>
      )}
      <h3 className="font-semibold text-gray-900">{service.title}</h3>
      {service.short_description && (
        <p className="mt-2 text-sm text-gray-500 line-clamp-3">
          {service.short_description}
        </p>
      )}
    </Link>
  );
}

export default function ServicesSection({ services }: { services: Service[] }) {
  if (!services.length) return null;

  return (
    <section className="py-20 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Hizmetlerimiz
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.slice(0, 6).map((s) => (
            <ServiceCard key={s.id} service={s} />
          ))}
        </div>
      </div>
    </section>
  );
}

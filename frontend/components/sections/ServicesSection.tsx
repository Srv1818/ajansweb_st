import Link from 'next/link';
import type { Service } from '@/types/directus';
import ServiceCard from '@/components/common/ServiceCard';
import SectionHeader from '@/components/common/SectionHeader';

export default function ServicesSection({ services }: { services: Service[] }) {
  if (!services.length) return null;

  return (
    <section className="py-24 px-4 bg-slate-950">
      <div className="max-w-7xl mx-auto">
        <SectionHeader title="Hizmetlerimiz" light />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.slice(0, 6).map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
        {services.length > 6 && (
          <div className="mt-12 text-center">
            <Link
              href="/hizmetler"
              className="inline-flex items-center gap-2 border border-slate-700 text-slate-300 hover:border-indigo-500 hover:text-indigo-300 px-6 py-3 rounded-xl text-sm font-medium transition-all duration-200"
            >
              Tüm Hizmetler →
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}

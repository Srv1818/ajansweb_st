import Link from 'next/link';
import { icons, Zap } from 'lucide-react';
import type { Service } from '@/types/directus';

function ServiceIcon({ name }: { name: string }) {
  const key = name
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join('') as keyof typeof icons;

  const Icon = icons[key] ?? Zap;
  return <Icon size={22} strokeWidth={1.75} />;
}

export default function ServiceCard({ service }: { service: Service }) {
  return (
    <Link
      href={`/hizmetler/${service.slug}`}
      className="group relative flex flex-col p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-indigo-500/50 hover:-translate-y-2 transition-all duration-300"
    >
      <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center mb-5 text-indigo-400 group-hover:bg-indigo-500/20 group-hover:text-indigo-300 transition-colors">
        <ServiceIcon name={service.icon ?? ''} />
      </div>

      <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-indigo-300 transition-colors">
        {service.title}
      </h3>

      {service.short_description && (
        <p className="text-slate-400 text-sm leading-relaxed line-clamp-3">
          {service.short_description}
        </p>
      )}

      <div className="mt-5 text-xs font-medium text-indigo-400 group-hover:text-indigo-300 flex items-center gap-1 transition-colors">
        Detayları İncele →
      </div>

      <div className="absolute inset-0 rounded-2xl bg-indigo-500/0 group-hover:bg-indigo-500/5 transition-colors pointer-events-none" />
    </Link>
  );
}

import type { SiteSettings } from '@/types/directus';

export default function AboutSection({ settings }: { settings: SiteSettings | null }) {
  if (!settings?.site_description) return null;

  return (
    <section className="py-24 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="max-w-3xl">
          <span className="inline-block text-xs font-semibold uppercase tracking-widest text-indigo-600 mb-4">
            Hakkımızda
          </span>
          {settings.site_name && (
            <h2 className="text-4xl md:text-5xl font-black tracking-tight leading-tight text-slate-900 mb-6">
              {settings.site_name}
            </h2>
          )}
          <p className="text-lg text-slate-500 leading-relaxed mb-8">
            {settings.site_description}
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href="/hakkimizda"
              className="inline-flex items-center justify-center bg-slate-900 hover:bg-slate-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors text-sm"
            >
              Daha Fazla Bilgi
            </a>
            <a
              href="/iletisim"
              className="inline-flex items-center justify-center border border-slate-200 hover:border-slate-300 text-slate-700 font-semibold px-6 py-3 rounded-xl transition-colors text-sm"
            >
              İletişime Geçin
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

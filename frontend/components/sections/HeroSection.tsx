import Link from 'next/link';
import type { Page, SiteSettings } from '@/types/directus';
import HeroSlider from './HeroSlider';

export default function HeroSection({
  page,
  settings,
}: {
  page: Page | null;
  settings: SiteSettings | null;
}) {
  if (!page?.hero_heading) return null;

  const [firstLine, secondLine] = page.hero_heading.includes('\n')
    ? page.hero_heading.split('\n')
    : [page.hero_heading, null];

  const stats = [
    { value: settings?.stat_1_value ?? '150+', label: settings?.stat_1_label ?? 'Proje' },
    { value: settings?.stat_2_value ?? '%98', label: settings?.stat_2_label ?? 'Memnuniyet' },
    { value: settings?.stat_3_value ?? '7+', label: settings?.stat_3_label ?? 'Yıl' },
    { value: settings?.stat_4_value ?? '50+', label: settings?.stat_4_label ?? 'Müşteri' },
  ];

  return (
    <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden bg-slate-950">
      <HeroSlider />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center py-24">
        <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-[1.05] text-white mb-6">
          <span className="block">{firstLine}</span>
          {secondLine && (
            <span className="block bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              {secondLine}
            </span>
          )}
        </h1>

        {page.hero_subheading && (
          <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed mb-10">
            {page.hero_subheading}
          </p>
        )}

        {page.hero_cta_text && page.hero_cta_link && (
          <div className="flex justify-center mb-16">
            <Link
              href={page.hero_cta_link}
              className="inline-flex items-center justify-center bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-8 py-4 rounded-xl transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-indigo-500/30"
            >
              {page.hero_cta_text}
            </Link>
          </div>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
          {stats.map(({ value, label }) => (
            <div key={label} className="flex flex-col items-center gap-1">
              <span className="text-3xl md:text-4xl font-black text-white">{value}</span>
              <span className="text-sm text-slate-400 uppercase tracking-wider font-medium">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

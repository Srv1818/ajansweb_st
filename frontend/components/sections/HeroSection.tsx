import Link from 'next/link';
import type { Page } from '@/types/directus';
import HeroSlider from './HeroSlider';

export default function HeroSection({ page }: { page: Page | null }) {
  if (!page?.hero_heading) return null;

  const [firstLine, secondLine] = page.hero_heading.includes('\n')
    ? page.hero_heading.split('\n')
    : [page.hero_heading, null];

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
          <div className="flex justify-center">
            <Link
              href={page.hero_cta_link}
              className="inline-flex items-center justify-center bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-8 py-4 rounded-xl transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-indigo-500/30"
            >
              {page.hero_cta_text}
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}

import Link from 'next/link';
import Image from 'next/image';
import type { Page } from '@/types/directus';
import { getAssetUrl } from '@/lib/directus';

export default function HeroSection({ page }: { page: Page | null }) {
  if (!page?.hero_heading) return null;

  const [firstLine, secondLine] = page.hero_heading.includes('\n')
    ? page.hero_heading.split('\n')
    : [page.hero_heading, null];

  return (
    <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden bg-slate-950">
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-950/80 via-slate-950 to-purple-950/50" />
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-indigo-500/15 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-3xl" />

      {page.hero_background_image && (
        <Image
          src={getAssetUrl(page.hero_background_image)}
          alt=""
          fill
          className="object-cover opacity-10"
          priority
        />
      )}

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

      <div className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-t from-slate-950 to-transparent pointer-events-none" />
    </section>
  );
}

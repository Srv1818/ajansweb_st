import Link from 'next/link';
import Image from 'next/image';
import type { Page } from '@/types/directus';
import { getAssetUrl } from '@/lib/directus';

export default function HeroSection({ page }: { page: Page | null }) {
  const heading = page?.hero_heading ?? 'Dijital Dünyada\nFarkınızı Yaratın';
  const subheading =
    page?.hero_subheading ??
    'Markanızı büyütmek için stratejik dijital pazarlama çözümleri sunuyoruz.';
  const ctaText = page?.hero_cta_text ?? 'Hizmetlerimizi Keşfedin';
  const ctaLink = page?.hero_cta_link ?? '/hizmetler';

  const [firstLine, secondLine] = heading.includes('\n')
    ? heading.split('\n')
    : [heading, null];

  return (
    <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden bg-slate-950">
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-950/80 via-slate-950 to-purple-950/50" />
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-indigo-500/15 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-3xl" />

      {page?.hero_background_image && (
        <Image
          src={getAssetUrl(page.hero_background_image)}
          alt=""
          fill
          className="object-cover opacity-10"
          priority
        />
      )}

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center py-24">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-sm font-medium mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
          Dijital Pazarlama Ajansı
        </div>

        <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-[1.05] text-white mb-6">
          <span className="block">{firstLine}</span>
          {secondLine && (
            <span className="block bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              {secondLine}
            </span>
          )}
        </h1>

        <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed mb-10">
          {subheading}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href={ctaLink}
            className="inline-flex items-center justify-center bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-8 py-4 rounded-xl transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-indigo-500/30"
          >
            {ctaText}
          </Link>
          <Link
            href="/iletisim"
            className="inline-flex items-center justify-center bg-white/10 hover:bg-white/15 border border-white/20 text-white font-semibold px-8 py-4 rounded-xl backdrop-blur-sm transition-all duration-200"
          >
            İletişime Geçin
          </Link>
        </div>

        <div className="mt-16 grid grid-cols-3 gap-8 max-w-sm mx-auto border-t border-white/10 pt-10">
          {[['150+', 'Proje'], ['98%', 'Memnuniyet'], ['7+', 'Yıl']].map(([num, label]) => (
            <div key={label} className="text-center">
              <div className="text-2xl font-black text-white">{num}</div>
              <div className="text-xs text-slate-400 mt-0.5">{label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-t from-slate-950 to-transparent pointer-events-none" />
    </section>
  );
}

import Link from 'next/link';
import Image from 'next/image';
import type { Page } from '@/types/directus';
import { getAssetUrl } from '@/lib/directus';

export default function HeroSection({ page }: { page: Page | null }) {
  if (!page) {
    return (
      <section className="bg-gray-900 text-white py-24 px-4 text-center">
        <h1 className="text-4xl font-bold">Hoş Geldiniz</h1>
      </section>
    );
  }

  return (
    <section className="relative bg-gray-900 text-white py-24 px-4 text-center overflow-hidden">
      {page.hero_background_image && (
        <Image
          src={getAssetUrl(page.hero_background_image)}
          alt=""
          fill
          className="object-cover opacity-30"
          priority
        />
      )}
      <div className="relative z-10 max-w-3xl mx-auto">
        {page.hero_heading && (
          <h1 className="text-4xl md:text-5xl font-bold leading-tight">
            {page.hero_heading}
          </h1>
        )}
        {page.hero_subheading && (
          <p className="mt-4 text-lg text-gray-300">{page.hero_subheading}</p>
        )}
        {page.hero_cta_text && page.hero_cta_link && (
          <Link
            href={page.hero_cta_link}
            className="mt-8 inline-block bg-white text-gray-900 font-semibold px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {page.hero_cta_text}
          </Link>
        )}
      </div>
    </section>
  );
}

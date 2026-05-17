import type { SiteSettings } from '@/types/directus';

export default function AboutSection({ settings }: { settings: SiteSettings | null }) {
  if (!settings?.site_description) return null;

  return (
    <section className="py-20 px-4">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Hakkımızda</h2>
        <p className="text-lg text-gray-600 leading-relaxed">
          {settings.site_description}
        </p>
      </div>
    </section>
  );
}

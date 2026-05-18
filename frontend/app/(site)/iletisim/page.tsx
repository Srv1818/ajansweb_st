import { getSiteSettings } from '@/lib/directus';
import type { SiteSettings } from '@/types/directus';
import ContactForm from '@/components/sections/ContactForm';

export const revalidate = 3600;

export const metadata = {
  title: 'İletişim',
};

export default async function IletisimPage() {
  const settings = (await getSiteSettings().catch(() => null)) as SiteSettings | null;

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-4xl font-bold text-slate-900 mb-12">İletişim</h1>
      <ContactForm settings={settings} />
    </main>
  );
}

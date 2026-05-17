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
      <h1 className="text-4xl font-bold text-gray-900 mb-12">İletişim</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div>
          <ContactForm />
        </div>
        {settings && (
          <div className="space-y-4 text-gray-600">
            {settings.address && (
              <div>
                <p className="font-semibold text-gray-900">Adres</p>
                <p className="mt-1">{settings.address}</p>
              </div>
            )}
            {settings.phone && (
              <div>
                <p className="font-semibold text-gray-900">Telefon</p>
                <a href={`tel:${settings.phone}`} className="mt-1 hover:text-gray-900">
                  {settings.phone}
                </a>
              </div>
            )}
            {settings.contact_email && (
              <div>
                <p className="font-semibold text-gray-900">E-posta</p>
                <a href={`mailto:${settings.contact_email}`} className="mt-1 hover:text-gray-900">
                  {settings.contact_email}
                </a>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}

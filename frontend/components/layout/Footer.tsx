import Link from 'next/link';
import type { SiteSettings } from '@/types/directus';

export default function Footer({ settings }: { settings: SiteSettings | null }) {
  return (
    <footer className="border-t bg-gray-50 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row justify-between gap-6">
          <div>
            <p className="font-semibold text-gray-900">{settings?.site_name}</p>
            {settings?.address && (
              <p className="text-sm text-gray-500 mt-1">{settings.address}</p>
            )}
            {settings?.phone && (
              <p className="text-sm text-gray-500">{settings.phone}</p>
            )}
            {settings?.contact_email && (
              <a
                href={`mailto:${settings.contact_email}`}
                className="text-sm text-gray-500 hover:text-gray-900"
              >
                {settings.contact_email}
              </a>
            )}
          </div>
          {settings?.social_links && settings.social_links.length > 0 && (
            <div className="flex gap-4 items-start">
              {settings.social_links.map((link) => (
                <a
                  key={link.platform}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-gray-500 hover:text-gray-900 capitalize"
                >
                  {link.platform}
                </a>
              ))}
            </div>
          )}
        </div>
        {settings?.footer_text && (
          <p className="text-xs text-gray-400 mt-6">{settings.footer_text}</p>
        )}
      </div>
    </footer>
  );
}

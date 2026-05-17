import Link from 'next/link';
import Image from 'next/image';
import type { SiteSettings } from '@/types/directus';
import { getAssetUrl } from '@/lib/directus';

const navLinks = [
  { href: '/', label: 'Ana Sayfa' },
  { href: '/hizmetler', label: 'Hizmetler' },
  { href: '/hakkimizda', label: 'Hakkımızda' },
  { href: '/blog', label: 'Blog' },
  { href: '/iletisim', label: 'İletişim' },
];

export default function Header({ settings }: { settings: SiteSettings | null }) {
  return (
    <header className="border-b bg-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl">
          {settings?.logo ? (
            <Image
              src={getAssetUrl(settings.logo)}
              alt={settings.site_name ?? 'Logo'}
              width={120}
              height={40}
              className="h-10 w-auto object-contain"
            />
          ) : (
            <span>{settings?.site_name ?? 'Site'}</span>
          )}
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}

import Link from 'next/link';
import { Globe, Mail, Phone, MapPin } from 'lucide-react';
import { FaInstagram, FaFacebook, FaLinkedin, FaYoutube } from 'react-icons/fa';
import { FaXTwitter, FaTiktok } from 'react-icons/fa6';
import type { ComponentType } from 'react';
import type { SiteSettings } from '@/types/directus';

const platformIcons: Record<string, ComponentType<{ className?: string }>> = {
  instagram: FaInstagram,
  instgram: FaInstagram, // typo normalization
  facebook: FaFacebook,
  x: FaXTwitter,
  twitter: FaXTwitter,
  linkedin: FaLinkedin,
  youtube: FaYoutube,
  tiktok: FaTiktok,
};

const navLinks = [
  { href: '/hizmetler', label: 'Hizmetler' },
  { href: '/hakkimizda', label: 'Hakkımızda' },
  { href: '/blog', label: 'Blog' },
  { href: '/iletisim', label: 'İletişim' },
];

export default function Footer({ settings }: { settings: SiteSettings | null }) {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-slate-950 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Brand column */}
          <div className="md:col-span-1">
            <p className="font-black text-xl text-white mb-3">
              {settings?.site_name ?? 'Ajans'}
            </p>
            <p className="text-sm text-slate-400 leading-relaxed mb-6">
              {settings?.site_description
                ? settings.site_description.slice(0, 120) + (settings.site_description.length > 120 ? '…' : '')
                : 'Markanızın dijital dünyada güçlü bir varlık oluşturması için stratejik çözümler.'}
            </p>
            {settings?.social_links && settings.social_links.length > 0 && (
              <div className="flex gap-3">
                {settings.social_links.map((link) => {
                  const key = link.platform?.toLowerCase() ?? '';
                  const Icon = platformIcons[key];
                  return (
                    <a
                      key={link.platform}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={link.platform}
                      className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-indigo-600 border border-slate-700 hover:border-indigo-500 flex items-center justify-center text-slate-400 hover:text-white transition-all duration-200"
                    >
                      {Icon
                        ? <Icon className="w-4 h-4" />
                        : <Globe className="w-4 h-4" />}
                    </a>
                  );
                })}
              </div>
            )}
          </div>

          {/* Nav column */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-4">
              Sayfalar
            </p>
            <ul className="space-y-2.5">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact column */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-4">
              İletişim
            </p>
            <ul className="space-y-3">
              {settings?.contact_email && (
                <li className="flex items-center gap-2.5">
                  <Mail className="w-4 h-4 text-slate-500 shrink-0" />
                  <a
                    href={`mailto:${settings.contact_email}`}
                    className="text-sm text-slate-400 hover:text-white transition-colors"
                  >
                    {settings.contact_email}
                  </a>
                </li>
              )}
              {settings?.phone && (
                <li className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-slate-500 shrink-0" />
                  <a
                    href={`tel:${settings.phone}`}
                    className="text-sm text-slate-400 hover:text-white transition-colors"
                  >
                    {settings.phone}
                  </a>
                </li>
              )}
              {settings?.address && (
                <li className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                  <span className="text-sm text-slate-400">{settings.address}</span>
                </li>
              )}
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-xs text-slate-500">
            {settings?.footer_text ?? `© ${year} ${settings?.site_name ?? 'Ajans'}. Tüm hakları saklıdır.`}
          </p>
          <div className="flex gap-4">
            <Link href="/gizlilik-politikasi" className="text-xs text-slate-500 hover:text-slate-300 transition-colors">
              Gizlilik Politikası
            </Link>
            <Link href="/kullanim-kosullari" className="text-xs text-slate-500 hover:text-slate-300 transition-colors">
              Kullanım Koşulları
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

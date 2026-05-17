'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import type { SiteSettings } from '@/types/directus';
import { getAssetUrl } from '@/lib/directus';
import { cn } from '@/lib/utils';

const navLinks = [
  { href: '/', label: 'Ana Sayfa' },
  { href: '/hizmetler', label: 'Hizmetler' },
  { href: '/hakkimizda', label: 'Hakkımızda' },
  { href: '/blog', label: 'Blog' },
  { href: '/iletisim', label: 'İletişim' },
];

export default function Header({ settings }: { settings: SiteSettings | null }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 16);
    handler();
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const Logo = () =>
    settings?.logo ? (
      <Image
        src={getAssetUrl(settings.logo)}
        alt={settings.site_name ?? 'Logo'}
        width={120}
        height={40}
        className="h-9 w-auto object-contain"
      />
    ) : (
      <span className="font-black text-xl tracking-tight text-slate-900">
        {settings?.site_name ?? 'Ajans'}
      </span>
    );

  return (
    <header
      className={cn(
        'sticky top-0 z-50 transition-all duration-300',
        scrolled
          ? 'bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-sm'
          : 'bg-white border-b border-slate-100'
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="shrink-0">
          <Logo />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'px-3.5 py-2 rounded-lg text-sm font-medium transition-colors',
                pathname === link.href
                  ? 'text-indigo-600 bg-indigo-50'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/iletisim"
            className="bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold px-5 py-2 rounded-lg transition-colors"
          >
            Teklif Al
          </Link>
        </div>

        {/* Mobile hamburger */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger
            className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
            aria-label="Menüyü aç"
          >
            <Menu className="w-5 h-5" />
          </SheetTrigger>
          <SheetContent side="right" className="w-72 p-0">
            <SheetHeader className="px-6 py-5 border-b border-slate-100">
              <SheetTitle className="text-left">
                <Link href="/" onClick={() => setOpen(false)} className="inline-block">
                  <Logo />
                </Link>
              </SheetTitle>
            </SheetHeader>
            <nav className="flex flex-col px-4 py-4 gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    'px-4 py-2.5 rounded-xl text-sm font-medium transition-colors',
                    pathname === link.href
                      ? 'text-indigo-600 bg-indigo-50'
                      : 'text-slate-700 hover:bg-slate-50'
                  )}
                >
                  {link.label}
                </Link>
              ))}
              <div className="mt-4 pt-4 border-t border-slate-100">
                <Link
                  href="/iletisim"
                  onClick={() => setOpen(false)}
                  className="flex justify-center bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors"
                >
                  Teklif Al
                </Link>
              </div>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}

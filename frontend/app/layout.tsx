import type { Metadata } from 'next';
import { Geist } from 'next/font/google';
import './globals.css';
import { getSingleton } from '@/lib/directus';
import type { SiteSettings } from '@/types/directus';

const geist = Geist({ subsets: ['latin'], variable: '--font-geist' });

export async function generateMetadata(): Promise<Metadata> {
  const settings = (await getSingleton<SiteSettings>('site_settings').catch(() => null)) as SiteSettings | null;
  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'),
    title: {
      default: settings?.site_name ?? 'Kurumsal Site',
      template: `%s | ${settings?.site_name ?? 'Kurumsal Site'}`,
    },
    description: settings?.site_description ?? '',
  };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const settings = (await getSingleton<SiteSettings>('site_settings').catch(() => null)) as SiteSettings | null;

  const primaryColor = settings?.primary_color ?? '#6366f1';

  return (
    <html lang="tr" className={`${geist.variable} h-full antialiased`}>
      <body
        className="min-h-full flex flex-col"
        style={{ '--site-primary': primaryColor } as React.CSSProperties}
      >
        {children}
      </body>
    </html>
  );
}

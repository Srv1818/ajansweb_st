import type { Metadata } from 'next';
import { Geist } from 'next/font/google';
import './globals.css';
import { getSiteSettings } from '@/lib/directus';
import type { SiteSettings } from '@/types/directus';

const geist = Geist({ subsets: ['latin'], variable: '--font-geist' });

export const metadata: Metadata = {
  title: { default: 'Kurumsal Site', template: '%s | Kurumsal Site' },
  description: 'Kurumsal site şablonu',
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const settings = (await getSiteSettings().catch(() => null)) as SiteSettings | null;

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

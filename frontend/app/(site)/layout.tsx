import { notFound } from 'next/navigation'
import { headers } from 'next/headers'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { getSiteSettings } from '@/lib/directus'
import type { SiteSettings } from '@/types/directus'

const cardOnly = process.env.CARD_ONLY === 'true'

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  if (cardOnly) {
    const headersList = await headers()
    const pathname =
      headersList.get('x-invoke-path') ??
      headersList.get('x-pathname') ??
      ''

    const isAllowed =
      pathname === '' ||
      pathname.startsWith('/kartvizit') ||
      pathname.startsWith('/gizlilik-politikasi') ||
      pathname.startsWith('/kullanim-kosullari')

    if (!isAllowed) {
      notFound()
    }
  }

  const settings = (await getSiteSettings().catch(() => null)) as SiteSettings | null

  return (
    <>
      {!cardOnly && <Header settings={settings} />}
      <div className="flex-1">{children}</div>
      {!cardOnly && <Footer settings={settings} />}
    </>
  )
}

import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { getSiteSettings } from '@/lib/directus'
import type { SiteSettings } from '@/types/directus'

const cardOnly = process.env.CARD_ONLY === 'true'

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const settings = (await getSiteSettings().catch(() => null)) as SiteSettings | null

  return (
    <>
      {!cardOnly && <Header settings={settings} />}
      <div className="flex-1">{children}</div>
      {!cardOnly && <Footer settings={settings} />}
    </>
  )
}

import { headers } from 'next/headers'
import { notFound } from 'next/navigation'

const CARD_ONLY = process.env.CARD_ONLY === 'true'

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  if (CARD_ONLY) {
    const headersList = await headers()
    const pathname = headersList.get('x-pathname') ?? headersList.get('x-forwarded-uri') ?? ''

    const isAllowed =
      pathname.startsWith('/kartvizit') ||
      pathname === '' ||
      pathname === '/'

    if (!isAllowed && pathname !== '') {
      notFound()
    }
  }

  return <>{children}</>
}

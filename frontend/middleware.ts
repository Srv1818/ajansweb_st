import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const cardOnly = process.env.CARD_ONLY === 'true'
  const { pathname } = request.nextUrl

  // Tüm pass-through isteklerine x-pathname header'ı ekle
  // (site)/layout.tsx bunu okuyarak redirect kararı verebilir
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-pathname', pathname)

  if (!cardOnly) {
    return NextResponse.next({ request: { headers: requestHeaders } })
  }

  const allowed =
    pathname.startsWith('/kartvizit') ||
    pathname.startsWith('/gizlilik-politikasi') ||
    pathname.startsWith('/kullanim-kosullari') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon') ||
    pathname === '/robots.txt' ||
    pathname === '/sitemap.xml'

  if (allowed) {
    return NextResponse.next({ request: { headers: requestHeaders } })
  }

  return NextResponse.redirect(new URL('/kartvizit', request.url))
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)'],
}

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const cardOnly = process.env.CARD_ONLY === 'true'
  const { pathname } = request.nextUrl

  if (!cardOnly) return NextResponse.next()

  const allowed =
    pathname.startsWith('/kartvizit') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon') ||
    pathname === '/robots.txt' ||
    pathname === '/sitemap.xml'

  if (allowed) return NextResponse.next()

  return NextResponse.redirect(new URL('/kartvizit', request.url))
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\..*).*) '],
}

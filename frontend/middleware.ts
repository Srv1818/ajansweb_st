import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // --- Maintenance Mode ---
  if (process.env.MAINTENANCE_MODE === 'true') {
    const isMaintenanceExempt =
      pathname.startsWith('/maintenance') ||
      pathname.startsWith('/_next') ||
      pathname.startsWith('/favicon') ||
      pathname === '/api/health'

    if (!isMaintenanceExempt) {
      const clientIP =
        request.headers.get('cf-connecting-ip') ??
        request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
        '127.0.0.1'

      const bypassIPs = (process.env.MAINTENANCE_BYPASS_IPS ?? '')
        .split(',')
        .map((ip) => ip.trim())
        .filter(Boolean)

      if (!bypassIPs.includes(clientIP)) {
        const url = request.nextUrl.clone()
        url.pathname = '/maintenance'
        return NextResponse.rewrite(url)
      }
    }
  }

  // --- Card Only Mode ---
  if (process.env.CARD_ONLY === 'true') {
    const allowed =
      pathname.startsWith('/kartvizit') ||
      pathname.startsWith('/gizlilik-politikasi') ||
      pathname.startsWith('/kullanim-kosullari') ||
      pathname.startsWith('/api') ||
      pathname.startsWith('/_next') ||
      pathname.startsWith('/favicon') ||
      pathname === '/robots.txt' ||
      pathname === '/sitemap.xml'

    if (!allowed) {
      return NextResponse.redirect(new URL('/kartvizit', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)'],
}

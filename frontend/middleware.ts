import { NextRequest, NextResponse } from 'next/server';

const BOT_AGENTS = ['curl/', 'python-requests', 'scrapy', 'wget/', 'java/', 'go-http-client'];

export function middleware(req: NextRequest) {
  const ua = req.headers.get('user-agent')?.toLowerCase() ?? '';

  if (BOT_AGENTS.some((bot) => ua.includes(bot))) {
    return new NextResponse('Forbidden', { status: 403 });
  }

  if (req.nextUrl.pathname === '/api/contact' && req.method === 'POST') {
    const ct = req.headers.get('content-type') ?? '';
    if (!ct.includes('application/json')) {
      return new NextResponse('Unsupported Media Type', { status: 415 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/api/:path*'],
};

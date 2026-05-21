import type { NextConfig } from 'next';

const DIRECTUS_URL = process.env.NEXT_PUBLIC_DIRECTUS_URL ?? '';
const CDN_URL = process.env.NEXT_PUBLIC_CDN_URL ?? DIRECTUS_URL;

const nextConfig: NextConfig = {
  output: 'standalone',
  allowedDevOrigins: ['192.168.1.5'],

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: DIRECTUS_URL ? new URL(DIRECTUS_URL).hostname : 'localhost',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8055',
      },
    ],
    formats: ['image/avif', 'image/webp'],
  },

  async redirects() {
    if (process.env.CARD_ONLY !== 'true') return []
    return [
      {
        source: '/',
        destination: '/kartvizit',
        permanent: false,
      },
    ]
  },

  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
              "style-src 'self' 'unsafe-inline'",
              `img-src 'self' data: blob: ${DIRECTUS_URL} ${CDN_URL}`,
              "font-src 'self' https://fonts.gstatic.com",
              "connect-src 'self' https://api.resend.com",
            ].join('; '),
          },
        ],
      },
    ];
  },
};

export default nextConfig;

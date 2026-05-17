import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'directus-qbe5j85rsml2s833p4c8cm71.178.105.106.91.sslip.io',
        port: '8055',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8055',
      },
    ],
    formats: ['image/avif', 'image/webp'],
  },
};

export default nextConfig;

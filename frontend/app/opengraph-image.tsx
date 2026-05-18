import { ImageResponse } from 'next/og';
import { getSiteSettings } from '@/lib/directus';
import type { SiteSettings } from '@/types/directus';

export const runtime = 'edge';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function OgImage() {
  const settings = (await getSiteSettings().catch(() => null)) as SiteSettings | null;
  const siteName = settings?.site_name ?? 'Kurumsal Site';
  const description = settings?.site_description ?? '';
  const color = settings?.primary_color ?? '#6366f1';

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#0f172a',
          padding: '60px',
        }}
      >
        <div
          style={{
            width: 80,
            height: 6,
            background: color,
            borderRadius: 3,
            marginBottom: 32,
          }}
        />
        <div
          style={{
            fontSize: 72,
            fontWeight: 900,
            color: '#ffffff',
            textAlign: 'center',
            lineHeight: 1.1,
            marginBottom: 24,
          }}
        >
          {siteName}
        </div>
        {description && (
          <div
            style={{
              fontSize: 28,
              color: '#94a3b8',
              textAlign: 'center',
              maxWidth: 800,
              lineHeight: 1.5,
            }}
          >
            {description}
          </div>
        )}
      </div>
    ),
    { ...size }
  );
}

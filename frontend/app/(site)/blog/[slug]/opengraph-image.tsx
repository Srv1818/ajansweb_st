import { ImageResponse } from 'next/og';
import { getPost } from '@/lib/directus';
import type { Post } from '@/types/directus';

export const runtime = 'edge';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function OgImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = (await getPost(slug).catch(() => null)) as Post | null;

  const title = post?.title ?? 'Blog';
  const excerpt = post?.excerpt ?? '';
  const date = post?.date_created
    ? new Date(post.date_created).toLocaleDateString('tr-TR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : '';

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)',
          padding: '60px',
        }}
      >
        {date && (
          <div style={{ fontSize: 22, color: '#818cf8', marginBottom: 16 }}>{date}</div>
        )}
        <div
          style={{
            fontSize: 56,
            fontWeight: 900,
            color: '#ffffff',
            lineHeight: 1.15,
            marginBottom: 20,
            maxWidth: 900,
          }}
        >
          {title}
        </div>
        {excerpt && (
          <div
            style={{
              fontSize: 26,
              color: '#94a3b8',
              lineHeight: 1.5,
              maxWidth: 800,
            }}
          >
            {excerpt.slice(0, 120)}{excerpt.length > 120 ? '…' : ''}
          </div>
        )}
      </div>
    ),
    { ...size }
  );
}

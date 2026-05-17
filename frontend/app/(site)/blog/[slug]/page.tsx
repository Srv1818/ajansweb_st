import { notFound } from 'next/navigation';
import Image from 'next/image';
import { getPosts, getPost, getAssetUrl } from '@/lib/directus';
import type { Post } from '@/types/directus';

export const revalidate = 300;

export async function generateStaticParams() {
  try {
    const posts = (await getPosts(1, 100)) as Post[];
    return posts.map((p) => ({ slug: p.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = (await getPost(slug).catch(() => null)) as Post | null;
  return {
    title: post?.title ?? 'Blog Yazısı',
    description: post?.excerpt,
    openGraph: post?.featured_image
      ? { images: [getAssetUrl(post.featured_image)] }
      : undefined,
  };
}

export default async function BlogDetayPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = (await getPost(slug).catch(() => null)) as Post | null;

  if (!post) notFound();

  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {post.featured_image && (
        <div className="aspect-video rounded-xl overflow-hidden mb-8">
          <Image
            src={getAssetUrl(post.featured_image)}
            alt={post.title}
            width={800}
            height={450}
            className="w-full h-full object-cover"
            priority
          />
        </div>
      )}
      <p className="text-sm text-gray-400 mb-3">
        {new Date(post.date_created).toLocaleDateString('tr-TR')}
      </p>
      <h1 className="text-4xl font-bold text-gray-900 mb-4">{post.title}</h1>
      {post.excerpt && (
        <p className="text-xl text-gray-600 mb-8 leading-relaxed">{post.excerpt}</p>
      )}
      {post.content && (
        <div
          className="prose prose-gray max-w-none"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      )}
    </main>
  );
}

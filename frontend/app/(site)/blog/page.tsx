import Link from 'next/link';
import Image from 'next/image';
import { getPosts } from '@/lib/directus';
import { getAssetUrl } from '@/lib/directus';
import type { Post } from '@/types/directus';

export const metadata = {
  title: 'Blog',
};

export default async function BlogPage() {
  const page = 1;
  const pageSize = 9;

  const posts = (await getPosts(page, pageSize).catch(() => [])) as Post[];

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-4xl font-bold text-gray-900 mb-12">Blog</h1>
      {posts.length === 0 ? (
        <p className="text-gray-500">Henüz yazı yok.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <Link key={post.id} href={`/blog/${post.slug}`} className="block group">
              <div className="aspect-video rounded-xl overflow-hidden bg-gray-100 mb-4">
                {post.featured_image ? (
                  <Image
                    src={getAssetUrl(post.featured_image)}
                    alt={post.title}
                    width={600}
                    height={338}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200" />
                )}
              </div>
              <p className="text-xs text-gray-400 mb-1">
                {new Date(post.date_created).toLocaleDateString('tr-TR')}
              </p>
              <h2 className="font-semibold text-gray-900 group-hover:text-gray-600 transition-colors line-clamp-2">
                {post.title}
              </h2>
              {post.excerpt && (
                <p className="mt-1 text-sm text-gray-500 line-clamp-2">{post.excerpt}</p>
              )}
            </Link>
          ))}
        </div>
      )}
      <div className="flex gap-4 justify-center mt-12">
        {page > 1 && (
          <Link
            href={`/blog?page=${page - 1}`}
            className="px-4 py-2 border rounded-lg text-sm hover:bg-gray-50"
          >
            ← Önceki
          </Link>
        )}
        {posts.length === pageSize && (
          <Link
            href={`/blog?page=${page + 1}`}
            className="px-4 py-2 border rounded-lg text-sm hover:bg-gray-50"
          >
            Sonraki →
          </Link>
        )}
      </div>
    </main>
  );
}

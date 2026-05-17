import Link from 'next/link';
import Image from 'next/image';
import type { Post } from '@/types/directus';
import { getAssetUrl } from '@/lib/directus';

function BlogCard({ post }: { post: Post }) {
  return (
    <Link href={`/blog/${post.slug}`} className="block group">
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
      <h3 className="font-semibold text-gray-900 group-hover:text-gray-600 transition-colors line-clamp-2">
        {post.title}
      </h3>
      {post.excerpt && (
        <p className="mt-1 text-sm text-gray-500 line-clamp-2">{post.excerpt}</p>
      )}
    </Link>
  );
}

export default function BlogSection({ posts }: { posts: Post[] }) {
  if (!posts.length) return null;

  return (
    <section className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">Blog</h2>
          <Link href="/blog" className="text-sm font-medium text-gray-500 hover:text-gray-900">
            Tümünü Gör →
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {posts.map((p) => (
            <BlogCard key={p.id} post={p} />
          ))}
        </div>
      </div>
    </section>
  );
}

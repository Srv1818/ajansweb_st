import Link from 'next/link';
import type { Post } from '@/types/directus';
import BlogCard from '@/components/common/BlogCard';
import SectionHeader from '@/components/common/SectionHeader';

export default function BlogSection({ posts }: { posts: Post[] }) {
  if (!posts.length) return null;

  return (
    <section className="py-24 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-end justify-between mb-12 md:mb-16">
          <SectionHeader
            title="Blog"
            subtitle="Dijital pazarlama dünyasından son gelişmeler ve ipuçları."
            center={false}
          />
          <Link
            href="/blog"
            className="hidden sm:inline-flex items-center gap-1 text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors shrink-0 mb-12 md:mb-16"
          >
            Tümünü Gör →
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {posts.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>
        <div className="mt-8 text-center sm:hidden">
          <Link
            href="/blog"
            className="inline-flex items-center gap-1 text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors"
          >
            Tüm Yazıları Gör →
          </Link>
        </div>
      </div>
    </section>
  );
}

import Link from 'next/link';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import type { Post } from '@/types/directus';
import { getAssetUrl } from '@/lib/directus';

function readingTime(content: string) {
  const words = content?.replace(/<[^>]+>/g, '').split(/\s+/).length ?? 0;
  return Math.max(1, Math.ceil(words / 200));
}

export default function BlogCard({ post }: { post: Post }) {
  return (
    <Link href={`/blog/${post.slug}`} className="group flex flex-col rounded-2xl overflow-hidden bg-white border border-slate-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      <div className="aspect-[16/9] bg-slate-100 overflow-hidden">
        {post.featured_image ? (
          <Image
            src={getAssetUrl(post.featured_image)}
            alt={post.title}
            width={640}
            height={360}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-slate-200 to-slate-300" />
        )}
      </div>
      <div className="flex flex-col flex-1 p-6">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-xs text-slate-400">
            {new Date(post.date_created).toLocaleDateString('tr-TR', {
              day: 'numeric', month: 'long', year: 'numeric',
            })}
          </span>
          {post.content && (
            <Badge variant="secondary" className="text-xs">
              {readingTime(post.content)} dk okuma
            </Badge>
          )}
        </div>
        <h3 className="font-bold text-slate-900 text-lg leading-snug mb-2 line-clamp-2 group-hover:text-indigo-600 transition-colors">
          {post.title}
        </h3>
        {post.excerpt && (
          <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed">{post.excerpt}</p>
        )}
      </div>
    </Link>
  );
}

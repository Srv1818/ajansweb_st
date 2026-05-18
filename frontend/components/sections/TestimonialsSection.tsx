import { Star } from 'lucide-react';
import type { Testimonial } from '@/types/directus';

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`w-4 h-4 ${i < rating ? 'text-amber-400 fill-amber-400' : 'text-slate-300'}`}
        />
      ))}
    </div>
  );
}

export default function TestimonialsSection({ testimonials }: { testimonials: Testimonial[] }) {
  if (!testimonials.length) return null;

  return (
    <section className="py-24 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Müşterilerimiz Ne Diyor?</h2>
          <p className="text-slate-500 max-w-xl mx-auto">
            Birlikte çalıştığımız markalardan aldığımız geri bildirimler.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div
              key={t.id}
              className="flex flex-col gap-4 p-6 rounded-2xl border border-slate-100 bg-slate-50 hover:shadow-md transition-shadow"
            >
              <StarRating rating={t.rating} />
              <p className="text-slate-700 leading-relaxed flex-1">&ldquo;{t.comment}&rdquo;</p>
              <div>
                <p className="font-semibold text-slate-900">{t.name}</p>
                {t.title && <p className="text-sm text-slate-500">{t.title}</p>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

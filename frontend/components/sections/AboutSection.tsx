import type { SiteSettings } from '@/types/directus';

const stats = [
  { value: '150+', label: 'Tamamlanan Proje' },
  { value: '50+', label: 'Mutlu Müşteri' },
  { value: '7+', label: 'Yıllık Deneyim' },
  { value: '%98', label: 'Memnuniyet Oranı' },
];

export default function AboutSection({ settings }: { settings: SiteSettings | null }) {
  return (
    <section className="py-24 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <span className="inline-block text-xs font-semibold uppercase tracking-widest text-indigo-600 mb-4">
              Hakkımızda
            </span>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight leading-tight text-slate-900 mb-6">
              Dijital Başarının
              <span className="block text-indigo-600">Arkasındaki Ekip</span>
            </h2>
            <p className="text-lg text-slate-500 leading-relaxed mb-8">
              {settings?.site_description ??
                'Markanızın dijital dünyada güçlü bir varlık oluşturması için stratejik çözümler geliştiriyoruz. Yaratıcılık, veri analizi ve teknolojiyi bir araya getirerek ölçülebilir sonuçlar sağlıyoruz.'}
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href="/hakkimizda"
                className="inline-flex items-center justify-center bg-slate-900 hover:bg-slate-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors text-sm"
              >
                Daha Fazla Bilgi
              </a>
              <a
                href="/iletisim"
                className="inline-flex items-center justify-center border border-slate-200 hover:border-slate-300 text-slate-700 font-semibold px-6 py-3 rounded-xl transition-colors text-sm"
              >
                İletişime Geçin
              </a>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {stats.map(({ value, label }) => (
              <div
                key={label}
                className="p-6 rounded-2xl bg-slate-50 border border-slate-100 hover:border-indigo-100 hover:bg-indigo-50/50 transition-colors"
              >
                <div className="text-3xl font-black text-slate-900 mb-1">{value}</div>
                <div className="text-sm text-slate-500">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

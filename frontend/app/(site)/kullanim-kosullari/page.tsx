import DOMPurify from 'isomorphic-dompurify';
import { getPage } from '@/lib/directus';
import type { Page } from '@/types/directus';
import type { Metadata } from 'next';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Kullanım Koşulları',
  description: 'Web sitemizin kullanım koşulları ve hizmet şartları.',
};

const FALLBACK_CONTENT = `
<h2>Kullanım Koşulları</h2>
<p>Bu web sitesini kullanarak aşağıdaki kullanım koşullarını kabul etmiş sayılırsınız.</p>

<h3>Hizmet Kullanımı</h3>
<p>Sitemizi yalnızca yasal amaçlar doğrultusunda ve bu koşullara uygun şekilde kullanmayı kabul edersiniz.</p>

<h3>Fikri Mülkiyet</h3>
<p>Sitemizdeki tüm içerikler (metinler, görseller, logolar) telif hakkı ile korunmaktadır. İzin alınmadan kopyalanamaz veya dağıtılamaz.</p>

<h3>Sorumluluk Sınırlaması</h3>
<p>Sitemizdeki bilgilerin doğruluğu ve güncelliği konusunda azami özen gösterilmekle birlikte, herhangi bir hata veya eksiklikten doğabilecek zararlardan sorumlu tutulamayız.</p>

<h3>Değişiklikler</h3>
<p>Kullanım koşullarını önceden haber vermeksizin güncelleme hakkımızı saklı tutarız. Güncel koşulları takip etmek kullanıcının sorumluluğundadır.</p>

<h3>İletişim</h3>
<p>Kullanım koşullarımız hakkında sorularınız için iletişim sayfamızdan bize ulaşabilirsiniz.</p>
`;

export default async function KullanimKosullariPage() {
  const page = (await getPage('kullanim-kosullari').catch(() => null)) as Page | null;
  const content = page?.content ?? FALLBACK_CONTENT;

  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-4xl font-bold text-slate-900 mb-10">
        {page?.title ?? 'Kullanım Koşulları'}
      </h1>
      <div
        className="prose prose-slate max-w-none"
        dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(content ?? '') }}
      />
    </main>
  );
}

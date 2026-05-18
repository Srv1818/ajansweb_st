import { getPage } from '@/lib/directus';
import type { Page } from '@/types/directus';
import type { Metadata } from 'next';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Gizlilik Politikası',
  description: 'Gizlilik politikamız ve kişisel verilerin korunması hakkında bilgi.',
};

const FALLBACK_CONTENT = `
<h2>Gizlilik Politikası</h2>
<p>Bu gizlilik politikası, web sitemizi ziyaret ettiğinizde toplanan bilgilerin nasıl kullanıldığını açıklamaktadır.</p>

<h3>Toplanan Bilgiler</h3>
<p>İletişim formunu doldurduğunuzda ad, e-posta adresi ve mesaj gibi kişisel bilgilerinizi toplarız. Bu bilgiler yalnızca talebinize yanıt vermek amacıyla kullanılır.</p>

<h3>Çerezler</h3>
<p>Sitemiz, kullanıcı deneyimini iyileştirmek amacıyla çerezler kullanabilir. Tarayıcınızın ayarlarından çerezleri devre dışı bırakabilirsiniz.</p>

<h3>Üçüncü Taraflar</h3>
<p>Kişisel bilgilerinizi açık rızanız olmaksızın üçüncü taraflarla paylaşmayız.</p>

<h3>İletişim</h3>
<p>Gizlilik politikamız hakkında sorularınız için iletişim sayfamızdan bize ulaşabilirsiniz.</p>
`;

export default async function GizlilikPolitikasiPage() {
  const page = (await getPage('gizlilik-politikasi').catch(() => null)) as Page | null;
  const content = page?.content ?? FALLBACK_CONTENT;

  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-4xl font-bold text-slate-900 mb-10">
        {page?.title ?? 'Gizlilik Politikası'}
      </h1>
      <div
        className="prose prose-slate max-w-none"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </main>
  );
}

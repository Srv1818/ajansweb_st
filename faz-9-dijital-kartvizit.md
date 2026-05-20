# FAZ 9 — Dijital Kartvizit Modülü

> Bu faz mevcut şablona eklenir. Siteli müşterilerde otomatik aktif olur.
> Sadece kartvizit müşterilerinde Coolify'da `CARD_ONLY=true` env girilir.

---

## ✋ FAZ 9 BAŞLAMADAN ÖNCE — SEN YAPACAKSIN (Directus Admin)

`team_members` koleksiyonuna şu alanları ekle:

| Alan | Tip | Açıklama |
|------|-----|----------|
| `slug` | String, unique | URL'de kullanılır: /kartvizit/ali |
| `phone` | String | +90 ile başlayan format |
| `whatsapp` | String | +90 ile başlayan, boşluksuz |
| `address` | Text | Tam adres metni |
| `maps_url` | String | Google Maps "Yol Tarifi Al" linki |
| `services_list` | JSON (Repeater) | `{ title: string, description?: string }[]` |
| `social_links` | JSON (Repeater) | `{ platform: string, url: string }[]` — site_settings ile aynı yapı |
| `company_description` | Text | "Hakkımızda" kısa blok (2-3 cümle) |
| `card_theme` | Dropdown | `default` / `dark` / `minimal` (default: default) |
| `cover_image` | Image | Açılış + arka plan görseli (dikey, 9:16 önerilir) |

Mevcut alanlar: `name, job_title, bio, photo, email, sort, status` — bunlara dokunma.

Public role'de `team_members` read izni zaten var, yeni alanlar otomatik dahil olur.

Test verisi gir (en az 2 kişi, slug dolu olsun):
- slug: `ali-kaya`, phone: `+90 532 000 00 01`, whatsapp: `+905320000001`
- slug: `ayse-demir`, phone: `+90 532 000 00 02`, whatsapp: `+905320000002`

cover_image için boyut önerisi: dikey fotoğraf, minimum 1080x1920 (9:16).
Arka plan görseli olacağı için net, dikkat dağıtmayan bir fotoğraf seç.
Directus otomatik crop/resize yapar, orijinal yüksek çözünürlükte yükle.

---

## FAZ 9 — CURSOR PROMPTU

```
Mevcut Next.js 15 şablonuna dijital kartvizit modülü ekle.
lib/directus.ts, types/directus.ts ve tüm mevcut yapı hazır.

YAPILACAKLAR:

---

### 1. types/directus.ts — TeamMemberItem güncelle

Mevcut TeamMemberItem interface'ine şu alanları ekle:

  slug?: string
  phone?: string
  whatsapp?: string
  address?: string
  maps_url?: string
  services_list?: Array<{ title: string; description?: string }>
  social_links?: Array<{ platform: string; url: string }>
  company_description?: string
  card_theme?: 'default' | 'dark' | 'minimal'
  cover_image?: string | DirectusFile

---

### 2. app/(site)/kartvizit/[slug]/page.tsx

generateStaticParams:
  getItems<TeamMemberItem>('team_members', {
    filter: { status: { _eq: 'active' } },
    fields: ['slug'],
  })

generateMetadata:
  title: `${member.name} | ${member.job_title}`
  description: member.company_description veya member.bio
  openGraph:
    title: isim + unvan
    description: company_description veya bio
    images: cover_image varsa cover_image, yoksa photo — getDirectusImageUrl ile
    url: `${NEXT_PUBLIC_SITE_URL}/kartvizit/${slug}`
    type: 'profile'
  twitter: card: 'summary_large_image', cover_image veya photo
  alternates: canonical: `${NEXT_PUBLIC_SITE_URL}/kartvizit/${slug}`
  robots: 'index, follow' — SEO için önemli

  NOT: cover_image sosyal paylaşımda büyük önizleme görseli olarak çıkar.
  Dikey (9:16) resim yüklenirse OG için 1200x630 crop yapılır — Directus
  /assets/{id}?width=1200&height=630&fit=cover ile otomatik halleder.

COVER IMAGE DAVRANIŞ (client component olacak):

  Bu bileşen 'use client' direktifi ile ayrı bir dosyada yazılır:
  components/kartvizit/CardCover.tsx

  Davranış:
  1. Sayfa yüklenince cover_image tam ekran gösterilir (fixed, z-0)
     - object-fit: cover, tüm ekranı kaplar
     - priority: true (LCP için)
  2. Üzerinde koyu gradient overlay: from-black/60 via-black/20 to-transparent
  3. 1.5 saniye sonra:
     - Cover image blur'a geçer: filter blur-sm + brightness-50 (CSS transition)
     - Kartvizit içerik kartı aşağıdan fade+slide-up ile gelir
       (opacity-0 → opacity-100, translateY(20px) → translateY(0), 400ms ease-out)
  4. Sonraki state: cover_image blurlu + karartılmış arka planda sabit kalır,
     kartvizit içeriği üstünde scroll edilebilir
  5. cover_image yoksa: card_theme'e göre primary color gradient arka plan,
     aynı animasyon davranışı

  useState ile splashDone: boolean kontrol edilir.
  useEffect + setTimeout(1500) ile splashDone = true set edilir.

  Sayfa layout'u:
  <div className="relative min-h-screen">
    <CardCover coverImageId={member.cover_image} splashDone={splashDone} />
    <div className={`relative z-10 transition-all duration-400 ${splashDone ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
      {/* kartvizit içeriği */}
    </div>
  </div>

  Server component olan page.tsx, CardCover'ı ve içeriği import eder.
  Animasyon state'i CardCover'da değil, içeriği saran wrapper client
  component'te tutulur (CardWrapper.tsx).

Sayfa içeriği (tek sayfa, scroll yok, mobile-first):

  A) HEADER BLOĞU
  - Fotoğraf: yuvarlak, 96x96, DirectusImage ile
  - İsim: text-2xl font-bold
  - Unvan: text-sm text-muted-foreground
  - Firma adı: site_settings'den site_name (getSingleton ile)

  B) HIZLI EYLEM BUTONLARI (ikonlu, grid 2 kolon)
  - Telefon: href="tel:{phone}" — Telefon ikonu
  - WhatsApp: href="https://wa.me/{whatsapp}" target="_blank" — MessageCircle ikonu
  - Email: href="mailto:{email}" — Mail ikonu
  - Yol Tarifi: href="{maps_url}" target="_blank" — MapPin ikonu
  Her buton: border rounded-xl p-3, ikon + kısa etiket, hover efekti

  C) HAKKIMIZDA BLOĞU (varsa company_description)
  - Küçük başlık + paragraf

  D) HİZMETLER LİSTESİ (varsa services_list)
  - Her hizmet: ikon (CheckCircle2) + başlık + opsiyonel açıklama
  - Card içinde, border-l-2 border-primary aksanı

  E) SOSYAL MEDYA (varsa social_links)
  - Yatay ikon sırası, ortalı
  - Platform adına göre ikon: instagram→Instagram, linkedin→Linkedin,
    twitter→Twitter, facebook→Facebook, youtube→Youtube, tiktok→Music2
    (hepsi lucide-react'tan)
  - href target="_blank"

  F) FOOTER
  - "Bu dijital kartvizit {site_name} tarafından oluşturulmuştur"
  - Küçük, muted, ortalı

revalidate: 300

TASARIM NOTLARI:
- Maksimum genişlik: max-w-sm mx-auto (telefon ekranı gibi)
- Cover image varken içerik kartı: bg-white/90 backdrop-blur-sm (cam efekti)
- Cover image yokken arka plan: card_theme'e göre:
    default → beyaz kart, açık gri sayfa bg
    dark → slate-900 kart, slate-950 sayfa bg, beyaz metin
    minimal → border yok, sadece beyaz, temiz
- Butonlar primary color kullanır (CSS variable)
- Fotoğraf yoksa baş harflerinden Avatar (shadcn Avatar + AvatarFallback)
- Tüm dış linkler target="_blank" rel="noopener noreferrer"
- cover_image için next/image unoptimized={false}, sizes="100vw"

---

### 3. middleware.ts — CARD_ONLY modu

Mevcut middleware.ts varsa içine ekle, yoksa oluştur.

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const cardOnly = process.env.CARD_ONLY === 'true'
  const { pathname } = request.nextUrl

  if (cardOnly) {
    // /kartvizit/* ve /api/* geçsin
    if (
      pathname.startsWith('/kartvizit') ||
      pathname.startsWith('/api') ||
      pathname.startsWith('/_next') ||
      pathname.startsWith('/favicon') ||
      pathname === '/robots.txt' ||
      pathname === '/sitemap.xml'
    ) {
      return NextResponse.next()
    }
    // / (ana sayfa) → /kartvizit'e yönlendir
    // (ilk kartviziti göstermek yerine liste sayfasına gönder)
    if (pathname === '/') {
      return NextResponse.redirect(new URL('/kartvizit', request.url))
    }
    // Diğer tüm sayfalar → 404
    return NextResponse.rewrite(new URL('/not-found', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}

---

### 4. app/(site)/kartvizit/page.tsx — Liste sayfası

CARD_ONLY modunda / redirect buraya gelir.
Normal modda da /kartvizit direkt liste gösterir.

  - getItems<TeamMemberItem>('team_members', {
      filter: { status: { _eq: 'active' } },
      sort: ['sort'],
    })
  - Her kişi için kart: fotoğraf + isim + unvan + "Kartviziti Gör" butonu
  - Grid: mobile 1 kolon, sm 2 kolon
  - max-w-2xl mx-auto
  - revalidate: 60

generateMetadata:
  CARD_ONLY modunda: getSingleton ile site_name kullan
  title: `Ekibimiz | {site_name}`

---

### 5. .env.example'a ekle

# Dijital Kartvizit Modu
# Sadece kartvizit müşterileri için Coolify'da true yap
# Siteli müşterilerde bu satır olmaz veya false kalır
CARD_ONLY=false

---

### 6. next-sitemap.config.js güncelle

CARD_ONLY=true ise /hizmetler, /blog vb. sitemap'e girmesin.
Kartvizit URL'leri eklensin:

  const cardOnlyMode = process.env.CARD_ONLY === 'true'

  // additionalPaths içinde:
  const members = await fetch(
    `${process.env.NEXT_PUBLIC_DIRECTUS_URL}/items/team_members?fields=slug&filter[status][_eq]=active`,
    { headers: { Authorization: `Bearer ${process.env.DIRECTUS_TOKEN}` } }
  ).then(r => r.json())

  const cardPaths = members.data
    .filter(m => m.slug)
    .map(m => ({ loc: `/kartvizit/${m.slug}` }))

  // Mevcut posts ve services path'lerine ekle (CARD_ONLY değilse)
  return [
    ...cardPaths,
    ...(cardOnlyMode ? [] : existingPaths),
  ]

---

ÇIKTI:
- /kartvizit/[slug] sayfası çalışıyor, Directus'tan besleniyor
- Cover image açılışta tam ekran, 1.5sn sonra blurlu arka plana çekilir
- İçerik kartı fade+slide animasyonla gelir
- og:image cover_image kullanıyor, sosyal paylaşımda büyük önizleme çıkıyor
- canonical URL set edilmiş
- /kartvizit liste sayfası var
- CARD_ONLY=true → sadece kartvizit sayfaları erişilebilir
- CARD_ONLY yok/false → normal site + /kartvizit/* de çalışır
- Sitemap kartvizit URL'lerini içeriyor
- npm run build hatasız
- Mobile'da temiz görünüm (max-w-sm)
```

---

## ✋ FAZ 9 BİTİNCE — SEN YAPACAKSIN

### Siteli müşteri için
- Directus'ta mevcut team_members'a slug ekle (her kişi için)
- Fiziksel kart için QR: `firma.com/kartvizit/ali-kaya`
- NFC tag'e aynı URL yaz

### Sadece kartvizit müşterisi için
Coolify'da yeni deploy:
1. Aynı şablonu "Use this template" ile fork et
2. MariaDB + Directus + Frontend kur (normal akış)
3. Frontend env'e `CARD_ONLY=true` ekle
4. Directus'ta sadece `team_members` ve `site_settings` doldur
5. Diğer koleksiyonları oluşturmak zorunda değilsin (kartvizit sadece bu ikisini kullanır)
6. Domain: `ali.com` veya `ekip.firma.com`

### QR Kart Baskı Notu
- QR kod üreteci: `qr.new` veya `qrcode-generator` ile URL'den üret
- NFC tag: NTAG213, URL mode, `https://firma.com/kartvizit/ali-kaya` yaz
- Kartın arka yüzü: QR + NFC logosu + domain yazısı

---

## CARD_ONLY Özet

| Durum | Env | Erişilebilir Sayfalar |
|-------|-----|----------------------|
| Siteli müşteri | `CARD_ONLY` yok | Tüm site + `/kartvizit/*` |
| Sadece kartvizit | `CARD_ONLY=true` | Sadece `/kartvizit/*` |

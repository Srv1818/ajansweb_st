# Kurumsal Site Şablonu — Cursor Promptları (Directus + MariaDB)

> Her faz sırayla uygulanır. Bir faz bitmeden sonrakine geçme.
> "Sen yaparsın" adımları Cursor'dan önce tamamlanmalı.

**STACK:**
- Next.js 15 (App Router, TypeScript)
- Directus (Coolify'da Docker servis olarak, headless CMS)
- MariaDB 11 (Directus'un veritabanı, Coolify'da ayrı servis)
- Tailwind CSS + shadcn/ui
- Resend (email)
- next-sitemap

---

## ✅ FAZ 1 — TAMAMLANDI

Yapılanlar:
- Next.js 15 + Tailwind + TypeScript kurulumu (`frontend/`)
- shadcn/ui init
- Resend + next-sitemap kurulumu
- `frontend/.env.example` ve `frontend/.env.local.example`
- `app/(site)/page.tsx` placeholder
- Dockerfile (frontend)
- GitHub repo push (`master` branch)
- Coolify'da MariaDB servisi başlatıldı
- Coolify'da Directus servisi başlatıldı (Docker, MariaDB'ye bağlı)
- `localhost:3000` → frontend çalışıyor ✅
- Directus admin paneli → çalışıyor ✅

---

## FAZ 2 — Directus Koleksiyonları (Content Types)

```
Mevcut Next.js projesinde Directus SDK entegrasyonunu tamamla.
Directus admin panelinde koleksiyonlar SEN tarafından oluşturulacak
(Cursor bunu yapamaz), Cursor sadece frontend kodunu yazar.

DIRECTUS SDK KURULUMU:
1. frontend/ klasöründe:
   npm install @directus/sdk

2. frontend/lib/directus.ts oluştur:

   import { createDirectus, rest, staticToken } from '@directus/sdk'

   const DIRECTUS_URL = process.env.DIRECTUS_INTERNAL_URL ?? process.env.NEXT_PUBLIC_DIRECTUS_URL!
   const DIRECTUS_TOKEN = process.env.DIRECTUS_TOKEN!

   export const directus = createDirectus(DIRECTUS_URL)
     .with(staticToken(DIRECTUS_TOKEN))
     .with(rest())

   // Helper fonksiyonlar
   export async function getItems<T>(collection: string, query?: object): Promise<T[]> {
     const { readItems } = await import('@directus/sdk')
     return directus.request(readItems(collection as any, {
       filter: { status: { _eq: 'published' } },
       ...query,
     })) as Promise<T[]>
   }

   export async function getItem<T>(collection: string, id: string | number, query?: object): Promise<T> {
     const { readItem } = await import('@directus/sdk')
     return directus.request(readItem(collection as any, id, query)) as Promise<T>
   }

   export async function getSingleton<T>(collection: string, query?: object): Promise<T> {
     const { readSingleton } = await import('@directus/sdk')
     return directus.request(readSingleton(collection as any, query)) as Promise<T>
   }

   export function getDirectusImageUrl(fileId: string | null | undefined, params?: {
     width?: number, height?: number, quality?: number, format?: string
   }): string {
     if (!fileId) return ''
     const base = `${process.env.NEXT_PUBLIC_DIRECTUS_URL}/assets/${fileId}`
     if (!params) return base
     const p = new URLSearchParams()
     if (params.width) p.set('width', String(params.width))
     if (params.height) p.set('height', String(params.height))
     if (params.quality) p.set('quality', String(params.quality))
     if (params.format) p.set('format', params.format)
     return `${base}?${p.toString()}`
   }

3. frontend/.env.example güncelle:
   # Public Directus URL (browser'a expose edilir)
   NEXT_PUBLIC_DIRECTUS_URL=https://directus.musteri-adi.com
   # Server-side Directus URL (Coolify iç ağı, 10x hızlı)
   # Local dev'de boş bırak
   DIRECTUS_INTERNAL_URL=
   # Static token — Directus admin → Settings → Access Tokens
   DIRECTUS_TOKEN=your-token-here
   NEXT_PUBLIC_SITE_URL=https://musteri-adi.com
   RESEND_API_KEY=re_xxx
   NEXT_PUBLIC_CDN_URL=https://directus.musteri-adi.com/assets

4. frontend/types/directus.ts oluştur:
   export interface DirectusFile {
     id: string
     filename_download: string
     width?: number
     height?: number
     type: string
   }

   export interface PageItem {
     id: number
     status: 'draft' | 'published'
     title: string
     slug: string
     hero_heading?: string
     hero_subheading?: string
     hero_cta_text?: string
     hero_cta_link?: string
     hero_background_image?: string | DirectusFile
     seo_title?: string
     seo_description?: string
   }

   export interface PostItem {
     id: number
     status: 'draft' | 'published'
     title: string
     slug: string
     excerpt?: string
     content?: string
     featured_image?: string | DirectusFile
     author?: number
     tags?: string[]
     date_published?: string
   }

   export interface ServiceItem {
     id: number
     status: 'draft' | 'published'
     title: string
     slug: string
     short_description?: string
     content?: string
     icon?: string
     featured_image?: string | DirectusFile
     sort?: number
   }

   export interface TeamMemberItem {
     id: number
     status: 'active' | 'inactive'
     name: string
     job_title?: string
     bio?: string
     photo?: string | DirectusFile
     email?: string
     sort?: number
   }

   export interface SiteSettingsItem {
     site_name: string
     site_description?: string
     logo?: string | DirectusFile
     favicon?: string | DirectusFile
     primary_color?: string
     contact_email?: string
     phone?: string
     address?: string
     footer_text?: string
     social_links?: Array<{ platform: string; url: string }>
   }

ÇIKTI:
- `npm install @directus/sdk` tamamlandı
- `frontend/lib/directus.ts` oluşturuldu
- `frontend/types/directus.ts` oluşturuldu
- `.env.example` güncellendi
```

---

## ✋ FAZ 2 BİTİNCE — SEN YAPACAKSIN (Directus Admin Paneli)

Directus admin panelinde şu koleksiyonları oluştur:

### 1. Pages koleksiyonu
Settings → Data Model → Create Collection → "pages"
Alanlar:
- `title` (String, required)
- `slug` (String, unique)
- `status` (Dropdown: draft/published, default: draft)
- `hero_heading` (String)
- `hero_subheading` (Text)
- `hero_cta_text` (String)
- `hero_cta_link` (String)
- `hero_background_image` (Image)
- `seo_title` (String)
- `seo_description` (Text)

### 2. Posts koleksiyonu (Blog)
- `title` (String, required)
- `slug` (String, unique)
- `status` (Dropdown: draft/published)
- `excerpt` (Text)
- `content` (Rich Text - WYSIWYG)
- `featured_image` (Image)
- `tags` (Tags)
- `date_published` (Datetime)

### 3. Services koleksiyonu
- `title` (String, required)
- `slug` (String, unique)
- `status` (Dropdown: draft/published)
- `short_description` (Text)
- `content` (Rich Text)
- `icon` (String - lucide icon adı)
- `featured_image` (Image)
- `sort` (Integer)

### 4. Team Members koleksiyonu
- `name` (String, required)
- `job_title` (String)
- `status` (Dropdown: active/inactive, default: active)
- `bio` (Text)
- `photo` (Image)
- `email` (String)
- `sort` (Integer)

### 5. Site Settings (Singleton)
Settings → Data Model → Create Collection → "site_settings"
Collection type: **Singleton** seç
Alanlar:
- `site_name` (String)
- `site_description` (Text)
- `logo` (Image)
- `favicon` (Image)
- `primary_color` (String)
- `contact_email` (String)
- `phone` (String)
- `address` (Text)
- `footer_text` (Text)
- `social_links` (Repeater: platform + url)

### API Token oluştur
Settings → Access Tokens → Create Token → "frontend-token" → Full Access → Kaydet → `.env`'e yaz

### Public erişim aç
Settings → Roles → Public → şu koleksiyonlara read izni ver:
- pages, posts, services, team_members, site_settings

### Kısıtlı Müşteri Rolü oluştur
Müşteriye tam admin erişimi verme. Sadece içerik düzenleyebilen bir rol:

1. Settings → Roles → Create Role → "İçerik Editörü"
2. Bu role şu izinleri ver:
   - **pages**: create, read, update (delete yok)
   - **posts**: create, read, update, delete
   - **services**: create, read, update (delete yok)
   - **team_members**: create, read, update (delete yok)
   - **site_settings**: read, update (create/delete yok)
   - **directus_files**: create, read, update, delete (resim yükleyebilsin)
3. Settings → **Admin Access: KAPALI** (sistem ayarlarına giremesin)
4. Settings → Users → Create User → müşteri emaili → Role: İçerik Editörü
5. Müşteriye Directus URL + email + şifre ilet

### Test İçeriği Gir (Site boş görünmesin)
Koleksiyonları doldur:

**Site Settings (singleton):**
- site_name: Ajans Adı
- contact_email: info@ajans.com
- phone: +90 212 000 00 00
- address: İstanbul, Türkiye
- footer_text: © 2026 Ajans. Tüm hakları saklıdır.

**Pages — slug: "home":**
- title: Ana Sayfa
- status: published
- hero_heading: Dijital Dünyada Farkınızı Yaratın
- hero_subheading: Markanızı büyütmek için stratejik dijital pazarlama çözümleri.
- hero_cta_text: Hizmetlerimizi Keşfedin
- hero_cta_link: /hizmetler

**Services (en az 3 tane, status: published):**
- SEO & İçerik Pazarlaması / slug: seo / icon: search / short_description: Google'da üst sıralara taşıyoruz.
- Sosyal Medya Yönetimi / slug: sosyal-medya / icon: share-2 / short_description: Markanızı sosyal medyada büyütüyoruz.
- Web Tasarım & Geliştirme / slug: web-tasarim / icon: monitor / short_description: Dönüşüm odaklı web siteleri.

**Posts (en az 2 tane, status: published):**
- Başlık, excerpt, date_published doldur

**Team Members (en az 2 kişi, status: active):**
- name, job_title, bio doldur

---

## FAZ 3 — Next.js Sayfaları (SSG + ISR)

```
Directus'tan içerik çeken Next.js sayfaları oluştur.
lib/directus.ts hazır, types/directus.ts hazır.

YAPILACAKLAR:

1. app/(site)/page.tsx — Ana sayfa
   Bölümler (ayrı component dosyaları):
   - HeroSection: pages koleksiyonundan slug='home' olan sayfa hero alanları
   - ServicesSection: services koleksiyonundan ilk 6, sort'a göre
   - AboutSection: site_settings'den kısa tanıtım
   - TeamSection: team_members status=active, sort'a göre
   - BlogSection: posts'tan son 3 yayınlanmış
   - ContactSection: iletişim formu
   revalidate: 60

2. app/(site)/hizmetler/page.tsx
   - getItems<ServiceItem>('services', { sort: ['sort'] })
   - Grid layout
   - revalidate: 60

3. app/(site)/hizmetler/[slug]/page.tsx
   - generateStaticParams: tüm service slug'ları
   - generateMetadata: seo_title, seo_description
   - content alanı HTML olarak render edilir (dangerouslySetInnerHTML)
   - revalidate: 300

4. app/(site)/blog/page.tsx
   - Sayfalama: page query param, her sayfada 9 yazı
   - revalidate: 60

5. app/(site)/blog/[slug]/page.tsx
   - generateStaticParams
   - generateMetadata (OG image dahil)
   - revalidate: 300

6. app/(site)/hakkimizda/page.tsx
   - getSingleton<SiteSettingsItem>('site_settings')
   - getItems<TeamMemberItem>('team_members', { filter: { status: { _eq: 'active' } }, sort: ['sort'] })
   - revalidate: 600

7. app/(site)/iletisim/page.tsx
   - İletişim formu (client component)
   - getSingleton ile adres/tel/email
   - revalidate: 3600

8. app/api/contact/route.ts
   - POST: name, email, phone, message
   - Zod ile validate
   - Resend ile admin emailine yönlendir
   - Rate limiting: IP başına 3 istek/saat (in-memory Map)

9. components/common/DirectusImage.tsx:
   import Image from 'next/image'
   import { getDirectusImageUrl } from '@/lib/directus'

   interface Props {
     fileId: string | null | undefined
     alt: string
     width: number
     height: number
     className?: string
     priority?: boolean
   }

   export function DirectusImage({ fileId, alt, width, height, className, priority }: Props) {
     if (!fileId) return null
     const url = getDirectusImageUrl(fileId, { width, height, format: 'webp', quality: 85 })
     return <Image src={url} alt={alt} width={width} height={height} className={className} priority={priority} />
   }

10. components/layout/Header.tsx ve Footer.tsx
    - getSingleton ile logo, nav linkleri, sosyal linkler
    - app/layout.tsx'e ekle

11. next.config.ts'e Directus domain'ini ekle:
    images: {
      remotePatterns: [
        { protocol: 'https', hostname: 'directus.musteri-adi.com' },
        { protocol: 'http', hostname: 'localhost', port: '8055' },
      ],
      formats: ['image/avif', 'image/webp'],
    }

ÇIKTI:
- Tüm sayfalar Directus'tan içerik çekiyor
- Admin'den içerik değişince 60 saniyede güncelleniyor
- /api/contact çalışıyor, email geliyor
- `npm run build` hatasız
```

---

## FAZ 4 — Medya (Directus Built-in)

```
Directus medya yönetimini yapılandır.
Directus'ta medya built-in gelir, S3/R2 entegrasyonu için config yeterli.

YAPILACAKLAR:

1. Coolify'da Directus servisine şu env değişkenlerini ekle:
   STORAGE_LOCATIONS=s3
   STORAGE_S3_DRIVER=s3
   STORAGE_S3_KEY=your-r2-access-key
   STORAGE_S3_SECRET=your-r2-secret-key
   STORAGE_S3_BUCKET=musteri-adi-media
   STORAGE_S3_REGION=auto
   STORAGE_S3_ENDPOINT=https://ACCOUNT_ID.r2.cloudflarestorage.com
   STORAGE_S3_FORCE_PATH_STYLE=true

   NOT: Bu değişkenler Cursor tarafından değil, Coolify arayüzünden girilir.
   Cursor'un yapacağı sadece frontend tarafındaki image URL helper'ını güncellemek.

2. frontend/lib/directus.ts'deki getDirectusImageUrl fonksiyonu zaten
   doğru çalışıyor — Directus /assets/{fileId} endpoint'i üzerinden
   dosyaları serve eder, R2 entegrasyonu şeffaf çalışır.

3. next.config.ts'e R2 domain'ini de ekle:
   { protocol: 'https', hostname: 'media.musteri-adi.com' }

ÇIKTI:
- Admin panelinden yüklenen dosyalar R2'ye gidiyor
- Frontend Directus /assets/ endpoint'i üzerinden çekiyor
- next/image optimizasyonu çalışıyor
```

---

## ✋ FAZ 4 BAŞLAMADAN ÖNCE — SEN YAPACAKSIN

1. Cloudflare R2'de bucket aç: `musteri-adi-media`
2. R2 → Public access aç veya custom domain bağla
3. R2 API token oluştur (Object Read & Write)
4. Coolify'da Directus servisine STORAGE_* değişkenlerini gir, restart et

---

## FAZ 5 — SEO + Sitemap + OG Image

```
Projeye SEO altyapısı ekle. (frontend/ klasöründe)

YAPILACAKLAR:

1. frontend/next-sitemap.config.js oluştur:
   module.exports = {
     siteUrl: process.env.NEXT_PUBLIC_SITE_URL,
     generateRobotsTxt: true,
     exclude: ['/api/*'],
     additionalPaths: async (config) => {
       const [posts, services] = await Promise.all([
         fetch(`${process.env.NEXT_PUBLIC_DIRECTUS_URL}/items/posts?fields=slug&filter[status][_eq]=published&limit=-1`,
           { headers: { Authorization: `Bearer ${process.env.DIRECTUS_TOKEN}` } }
         ).then(r => r.json()),
         fetch(`${process.env.NEXT_PUBLIC_DIRECTUS_URL}/items/services?fields=slug&filter[status][_eq]=published`,
           { headers: { Authorization: `Bearer ${process.env.DIRECTUS_TOKEN}` } }
         ).then(r => r.json()),
       ])
       return [
         ...posts.data.map(p => ({ loc: `/blog/${p.slug}` })),
         ...services.data.map(s => ({ loc: `/hizmetler/${s.slug}` })),
       ]
     },
   }
   package.json postbuild script'e `next-sitemap` ekle

2. Her sayfa için generateMetadata fonksiyonu tamamla:
   - title: `${pageTitle} | ${siteName}`
   - description: seo_description
   - openGraph: title, description, image, url
   - twitter: card, title, description, image
   - canonical URL

3. app/opengraph-image.tsx — Dinamik OG image:
   - next/og ile ImageResponse (1200x630)
   - getSingleton ile site adı ve primary color

4. app/(site)/blog/[slug]/opengraph-image.tsx:
   - Blog yazısına özel OG image
   - Yazı başlığı, tarih

5. app/robots.ts:
   - /api'yi disallow et
   - Sitemap URL'ini belirt

6. Structured data (JSON-LD):
   - Ana sayfa: Organization schema
   - Blog yazıları: Article schema
   - Hizmetler: Service schema
   - frontend/lib/structured-data.ts helper fonksiyonları

ÇIKTI:
- `npm run build` sonrası sitemap.xml oluşuyor
- robots.txt doğru
- Her sayfanın meta tagleri dolu
- OG görseller dinamik üretiliyor
```

---

## FAZ 6 — Tasarım Sistemi (Tema + Komponentler)

```
Müşteriden müşteriye değişebilen tasarım sistemi. (frontend/ klasöründe)

FELSEFE:
- Tüm renkler CSS variables üzerinden
- site_settings'deki primary_color runtime'da enjekte edilir
- Komponent kütüphanesi shadcn/ui üzerine kurulu

YAPILACAKLAR:

1. frontend/app/globals.css düzenle:
   :root {
     --color-primary: var(--site-primary, #0f172a);
     --color-primary-foreground: #ffffff;
     --font-heading: var(--site-font-heading, 'Inter');
     --font-body: var(--site-font-body, 'Inter');
     --border-radius: var(--site-radius, 0.5rem);
   }

2. frontend/app/layout.tsx'e dinamik CSS variable enjeksiyonu:
   const settings = await getSingleton<SiteSettingsItem>('site_settings')
   <html style={{ '--site-primary': settings.primary_color } as React.CSSProperties}>

3. shadcn/ui komponentlerini özelleştir:
   - Button (primary/secondary/outline)
   - Card (hizmet, blog, ekip kartları)
   - Badge (blog tag'leri)
   - Input, Textarea, Label (iletişim formu)
   - NavigationMenu (header nav)

4. Frontend komponentleri:
   components/sections/
   - HeroSection.tsx
   - ServicesGrid.tsx
   - BlogGrid.tsx
   - TeamGrid.tsx
   - ContactForm.tsx (client component, react-hook-form + zod)
   - TestimonialsSection.tsx (statik placeholder)

   components/common/
   - SectionHeader.tsx
   - ServiceCard.tsx
   - BlogCard.tsx
   - TeamCard.tsx
   - DirectusImage.tsx (next/image wrapper)

5. next/font ile Google Fonts:
   const inter = Inter({ subsets: ['latin'], variable: '--site-font-body' })

6. Responsive:
   - Mobile-first
   - Header hamburger menu (shadcn Sheet)
   - Grid: mobile 1 kolon, tablet 2, desktop 3

7. Tasarımı canlı ve çarpıcı hale getir — sönük görünmesin:
   - Hero section: koyu arka plan (#0f172a veya deep indigo), üzerinde beyaz/açık metin,
     büyük bold başlık (text-5xl md:text-7xl), gradient text efekti (bg-clip-text)
   - Renk aksanları: primary color ile glow/shadow efektleri (box-shadow, drop-shadow)
   - Butonlar: gradient background, hover'da scale-105 + brightness artışı
   - Section geçişleri: hafif gradient veya diagonal clip-path ile bölümler birbirinden ayrılsın
   - Kartlar: border + subtle shadow, hover'da translateY(-4px) + shadow büyümesi (transition)
   - Sayaçlar (150+ Proje, 98% Memnuniyet): büyük bold rakamlar, primary color ile
   - Footer: koyu (#0f172a), logo + nav linkleri + sosyal ikonlar + copyright
   - Animasyonlar: Tailwind animate-fade-in, scroll görünürlüğünde opacity geçişi
   - Font: Geist veya Inter, başlıklar 700-800 weight, body 400-500

ÇIKTI:
- primary_color değişince tüm site rengi değişiyor
- Tüm sayfalar mobile'da düzgün
- Komponentler Directus verisiyle çalışıyor
- Site canlı, modern ve profesyonel görünüyor
```

---

## FAZ 7 — Yeni Müşteri Deployment Checklist

```
Cursor'a yaptırılacak tek iş docs/yeni-musteri.md dosyasını oluşturmak.
Script yok, otomasyon yok — repo kopyalanıyor, env giriliyor, deploy ediliyor.

YAPILACAKLAR:

1. docs/yeni-musteri.md oluştur. İçeriği:

---

# Yeni Müşteri Ekleme (Tahmini Süre: 20-30 dk)

## Adım 1 — Repo'yu kopyala
GitHub'da `kurumsal-sablon` reposunu "Use this template" ile
yeni repo oluştur. Adı: `musteri-adi-site`

## Adım 2 — Coolify'da yeni proje aç
Coolify → Projects → Add Project → İsim: "musteri-adi"
Bu proje altına 3 servis eklenecek: MariaDB + Directus + Frontend

## Adım 3 — MariaDB servisi kur
Coolify → Yeni Proje → Add Service → MariaDB
- Initial Database: `directus_musteriadi`
- Username ve password not al

## Adım 4 — Directus servisi kur
Coolify → Yeni Proje → Add Service → Directus
Environment Variables:
```
DB_CLIENT=mysql
DB_HOST=     # MariaDB internal host
DB_PORT=3306
DB_DATABASE=directus_musteriadi
DB_USER=     # MariaDB username
DB_PASSWORD= # MariaDB password
SECRET=      # openssl rand -base64 32
ADMIN_EMAIL=admin@musteri-adi.com
ADMIN_PASSWORD=  # güçlü şifre belirle
PUBLIC_URL=https://directus.musteri-adi.com
```
Deploy et. İlk deploy'da tablolar otomatik oluşur.

## Adım 5 — Directus'ta koleksiyonları oluştur
Directus admin → Data Model'de şu koleksiyonları oluştur:
pages, posts, services, team_members, site_settings (singleton)
(FAZ 2 BİTİNCE bölümündeki alan listesine bak)

## Adım 6 — API Token al
Directus → Settings → Access Tokens → Create → "frontend" → Full Access
Token'ı not al.

## Adım 7 — Public izinleri aç
Settings → Roles → Public → pages, posts, services, team_members, site_settings
koleksiyonlarına read izni ver.

## Adım 8 — Frontend servisini kur
Coolify → Yeni Proje → Add Service → GitHub repo (frontend/ klasörü)

Environment Variables (runtime):
```
NEXT_PUBLIC_DIRECTUS_URL=https://directus.musteri-adi.com
DIRECTUS_INTERNAL_URL=http://[coolify-directus-container]:8055
DIRECTUS_TOKEN=   # Adım 6'daki token
NEXT_PUBLIC_SITE_URL=https://musteri-adi.com
RESEND_API_KEY=re_xxx
NEXT_PUBLIC_CDN_URL=https://directus.musteri-adi.com/assets
```

Build Arguments (build sırasında koda gömülür):
```
NEXT_PUBLIC_DIRECTUS_URL=https://directus.musteri-adi.com
NEXT_PUBLIC_SITE_URL=https://musteri-adi.com
```
Deploy et.

## Adım 9 — DNS
Cloudflare'de:
- `musteri-adi.com` → A kaydı → Hetzner IP
- `directus.musteri-adi.com` → A kaydı → Hetzner IP
- `media.musteri-adi.com` → R2 bucket custom domain (opsiyonel)

## Adım 10 — Kontrol
- [ ] `musteri-adi.com` açılıyor
- [ ] `directus.musteri-adi.com` admin paneli açılıyor
- [ ] Directus'tan içerik girince frontend'de görünüyor (max 60 sn)
- [ ] İletişim formu mail atıyor
- [ ] Resim yükleme çalışıyor

## Müşteriye iletilecekler
- Directus admin URL: `directus.musteri-adi.com`
- Email: (belirlediğin email)
- Şifre: (belirlediğin şifre)

---

ÇIKTI:
- docs/yeni-musteri.md oluşturuldu
- Checklist eksiksiz
```

---

## FAZ 8 — Production Hazırlık + Güvenlik

```
Projeyi production'a taşımadan önce güvenlik ve performans kontrolü.

YAPILACAKLAR:

1. frontend/next.config.ts — HTTP Security Headers:
   async headers() {
     return [{
       source: '/(.*)',
       headers: [
         { key: 'X-Frame-Options', value: 'DENY' },
         { key: 'X-Content-Type-Options', value: 'nosniff' },
         { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
         { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
         {
           key: 'Content-Security-Policy',
           value: [
             "default-src 'self'",
             "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
             "style-src 'self' 'unsafe-inline'",
             `img-src 'self' data: blob: ${process.env.NEXT_PUBLIC_DIRECTUS_URL} ${process.env.NEXT_PUBLIC_CDN_URL}`,
             "font-src 'self'",
             "connect-src 'self' https://api.resend.com",
           ].join('; ')
         },
       ],
     }]
   }

2. frontend/middleware.ts:
   - /api rotalarına rate limiting (header tabanlı)
   - Bot trafiği basic filtreleme

3. app/api/contact/route.ts iyileştirmeleri:
   - Honeypot field kontrolü
   - Input sanitization

4. Error handling:
   - app/error.tsx
   - app/not-found.tsx (404, site_settings'den içerik)
   - app/loading.tsx
   - Directus çağrılarını try/catch ile sar, fallback içerikler ekle

5. Performance:
   - Hero resimleri: priority: true
   - next/font ile Google Fonts (swap display)
   - Bundle analyzer: `npm install @next/bundle-analyzer`

6. Environment validation:
   frontend/lib/env.ts:
   import { z } from 'zod'
   const envSchema = z.object({
     NEXT_PUBLIC_DIRECTUS_URL: z.string().url(),
     DIRECTUS_INTERNAL_URL: z.string().url().optional(),
     DIRECTUS_TOKEN: z.string().min(10),
     NEXT_PUBLIC_SITE_URL: z.string().url(),
     RESEND_API_KEY: z.string().startsWith('re_'),
   })
   export const env = envSchema.parse(process.env)

7. .github/workflows/deploy.yml:
   - Push to main → Coolify webhook tetikle
   - Build check: type-check + lint

ÇIKTI:
- Lighthouse: Performance 90+, SEO 100, Accessibility 90+
- Güvenlik header'ları doğru
- Hata sayfaları var
- CI/CD çalışıyor
- Environment validation başlangıçta hata veriyor
```

---

## ÖZET — FAZ SIRASI VE SORUMLULUKLAR

| Faz | Cursor | Sen |
|-----|--------|-----|
| 1 — İskelet ✅ | Next.js scaffold, Dockerfile | GitHub repo, Hetzner, Coolify, MariaDB, Directus |
| 2 — SDK + Types | Directus SDK kurulum, helper fonksiyonlar, TypeScript types | Directus admin'de koleksiyonları oluştur, API token al, müşteri rolü oluştur, test içeriği gir |
| 3 — Sayfalar | Next.js SSG/ISR sayfaları, API route | İletişim formunu test et |
| 4 — Medya | next.config.ts güncelle | R2 bucket, API token, Coolify env |
| 5 — SEO | Sitemap, OG, JSON-LD | — |
| 6 — Tasarım | Component kütüphanesi, tema sistemi | Renk ve font tercihlerini belirt |
| 7 — Deployment | docs/yeni-musteri.md | İlk gerçek müşteriyle test et |
| 8 — Production | Güvenlik headers, error handling, CI/CD | Lighthouse testi, Coolify prod deploy |

---

## ÖNEMLİ NOTLAR

**Directus avantajları (Strapi'ye göre):**
- Docker image olarak gelir, build adımı yok → Coolify'da 1 dakikada ayağa kalkar
- MariaDB ile native çalışır, driver sorunu yok
- Admin paneli ve API built-in, kod yazmana gerek yok
- Medya yönetimi built-in, R2 entegrasyonu env değişkenleriyle yapılır
- Her müşteri için ayrı Directus instance → tamamen izole

**Directus API:**
- REST: `GET /items/{collection}?filter[status][_eq]=published`
- Singleton: `GET /items/{collection}` (singleton koleksiyonlar için)
- Medya: `GET /assets/{file-id}?width=800&height=600&format=webp`
- Auth: `Authorization: Bearer {token}` header ile

**MariaDB bağlantı notu:**
- Directus MariaDB'yi MySQL olarak tanır (`DB_CLIENT=mysql`)
- Charset utf8mb4 otomatik ayarlanır
- Coolify internal network'te container adıyla erişilir

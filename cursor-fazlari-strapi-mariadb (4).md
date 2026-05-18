# Kurumsal Site Şablonu — Cursor Promptları (Strapi + MariaDB)

> Her faz sırayla uygulanır. Bir faz bitmeden sonrakine geçme.
> "Sen yaparsın" adımları Cursor'dan önce tamamlanmalı.

**STACK:**

* Next.js 15 (App Router, TypeScript)
* Strapi 5 (ayrı servis, headless CMS)
* MariaDB 11 (Strapi'nin veritabanı)
* Tailwind CSS + shadcn/ui
* Resend (email)
* next-sitemap

\---

## ✋ FAZ 1 BAŞLAMADAN ÖNCE — SEN YAPACAKSIN

1. GitHub'da `kurumsal-sablon` adında private repo aç (2 ayrı klasör olacak: `frontend/` ve `strapi/`)
2. Hetzner'den CX31 sunucu al (Ubuntu 22.04, Frankfurt)
3. Sunucuya Coolify kur: `curl -fsSL https://cdn.coollabs.io/coolify/install.sh | bash`
4. Coolify'da bir MariaDB servisi başlat (kullanıcı adı, şifre, port not al)
5. Cloudflare'de test domaini için DNS kaydı oluştur (A kaydı → Hetzner IP)
6. GitHub repo adresini ve MariaDB bağlantı bilgilerini hazır tut

\---

## FAZ 1 — Repo + Proje İskeleti

```
Aşağıdaki stack ile bir Next.js 15 + Strapi 5 monorepo projesi oluştur.

STACK:
- Next.js 15 (App Router, TypeScript) → frontend/
- Strapi 5 (ayrı Node servisi) → strapi/
- MariaDB 11 (Strapi'nin DB'si)
- Tailwind CSS
- shadcn/ui
- Resend
- next-sitemap

KLASÖR YAPISI:
kurumsal-sablon/
├── frontend/
│   ├── app/
│   │   ├── (site)/
│   │   │   ├── page.tsx           → ana sayfa
│   │   │   ├── hakkimizda/
│   │   │   ├── hizmetler/
│   │   │   ├── blog/
│   │   │   └── iletisim/
│   │   └── api/
│   │       └── contact/
│   │           └── route.ts
│   ├── components/
│   ├── lib/
│   │   └── strapi.ts              → Strapi API helper
│   ├── public/
│   ├── .env.example
│   ├── next.config.ts
│   └── Dockerfile
├── strapi/
│   ├── src/
│   │   ├── api/                   → content types buraya gelecek
│   │   └── admin/
│   ├── config/
│   │   ├── database.ts            → MariaDB bağlantısı
│   │   └── server.ts
│   ├── .env.example
│   └── Dockerfile
└── docker-compose.yml             → local dev için

YAPILACAKLAR:

1. frontend/ klasörü:
   - `npx create-next-app@latest frontend --typescript --tailwind --app`
   - `cd frontend \\\&\\\& npx shadcn@latest init` (default style, CSS variables açık)
   - `npm install resend @react-email/components next-sitemap`
   - frontend/.env.example oluştur:
     # Public Strapi URL — browser'a expose edilir (sadece client-side için)
     NEXT\\\_PUBLIC\\\_STRAPI\\\_URL=http://localhost:1337
     # Server-side Strapi URL — Coolify iç ağında container adını kullan (10x hızlı)
     # Ör: http://strapi-musteri-a:1337 (Coolify servis adına göre değişir)
     # Local dev'de boş bırak → NEXT\\\_PUBLIC\\\_STRAPI\\\_URL fallback olarak kullanılır
     STRAPI\\\_INTERNAL\\\_URL=
     # Server-side only — NEXT\\\_PUBLIC\\\_ YAPMA, browser'a sızmaz
     STRAPI\\\_API\\\_TOKEN=your-api-token-here
     NEXT\\\_PUBLIC\\\_SITE\\\_URL=https://musteri-a.com
     RESEND\\\_API\\\_KEY=re\\\_xxx
     NEXT\\\_PUBLIC\\\_CDN\\\_URL=https://media.musteri-a.com

   - frontend/.env.local.example oluştur (docker-compose ile çalışırken):
     NEXT\\\_PUBLIC\\\_STRAPI\\\_URL=http://strapi:1337
     STRAPI\\\_API\\\_TOKEN=your-api-token-here
     NEXT\\\_PUBLIC\\\_SITE\\\_URL=http://localhost:3000
     RESEND\\\_API\\\_KEY=re\\\_xxx
     NEXT\\\_PUBLIC\\\_CDN\\\_URL=http://localhost:1337

   NOT: STRAPI\\\_API\\\_TOKEN asla NEXT\\\_PUBLIC\\\_ prefix'i almamalı.
   lib/strapi.ts'deki tüm fetch çağrıları server component veya server action
   üzerinden yapılmalı; token client bundle'a dahil olmaz.

2. strapi/ klasörü:
   - `npx create-strapi-app@latest strapi --no-run`
   - `npm install @strapi/plugin-i18n @strapi/plugin-seo`
   - `npm install mysql2` (MariaDB için MySQL2 driver kullanılır)
   - strapi/config/database.ts oluştur:
     export default ({ env }) => ({
       connection: {
         client: 'mysql2',
         connection: {
           host: env('DATABASE\\\_HOST', 'localhost'),
           port: env.int('DATABASE\\\_PORT', 3306),
           database: env('DATABASE\\\_NAME', 'strapi'),
           user: env('DATABASE\\\_USERNAME', 'strapi'),
           password: env('DATABASE\\\_PASSWORD', ''),
           ssl: env.bool('DATABASE\\\_SSL', false),
         },
         pool: { min: 2, max: 10 },
         acquireConnectionTimeout: 60000,
       },
     });
   - strapi/.env.example oluştur:
     HOST=0.0.0.0
     PORT=1337
     # APP\\\_KEYS: 4 adet rastgele key, virgülle ayrılmış
     # Üretmek için: openssl rand -base64 32 (4 kez çalıştır)
     APP\\\_KEYS=CHANGE\\\_ME\\\_1,CHANGE\\\_ME\\\_2,CHANGE\\\_ME\\\_3,CHANGE\\\_ME\\\_4
     # Aşağıdakileri de openssl rand -base64 32 ile üret
     API\\\_TOKEN\\\_SALT=CHANGE\\\_ME
     ADMIN\\\_JWT\\\_SECRET=CHANGE\\\_ME
     TRANSFER\\\_TOKEN\\\_SALT=CHANGE\\\_ME
     JWT\\\_SECRET=CHANGE\\\_ME
     # DATABASE\\\_CLIENT env'e gerek yok — config/database.ts'de hardcode "mysql2"
     DATABASE\\\_HOST=localhost
     DATABASE\\\_PORT=3306
     DATABASE\\\_NAME=strapi\\\_musteri\\\_a
     DATABASE\\\_USERNAME=strapi
     DATABASE\\\_PASSWORD=yourpassword
     # Coolify internal network: false. External/public DB: true
     DATABASE\\\_SSL=false

3. docker-compose.yml oluştur (sadece local dev için):
   services:
     mariadb:
       image: mariadb:11
       environment:
         MARIADB\\\_ROOT\\\_PASSWORD: rootpassword
         MARIADB\\\_DATABASE: strapi\\\_musteri\\\_a
         MARIADB\\\_USER: strapi
         MARIADB\\\_PASSWORD: strapipassword
       ports:
         - "3306:3306"
       volumes:
         - mariadb\\\_data:/var/lib/mysql
     strapi:
       build: ./strapi
       environment:
         DATABASE\\\_HOST: mariadb
         DATABASE\\\_PORT: 3306
         DATABASE\\\_NAME: strapi\\\_musteri\\\_a
         DATABASE\\\_USERNAME: strapi
         DATABASE\\\_PASSWORD: strapipassword
       ports:
         - "1337:1337"
       depends\\\_on:
         - mariadb
     frontend:
       build: ./frontend
       environment:
         # docker-compose içinde Strapi'ye container adıyla erişilir, localhost değil!
         NEXT\\\_PUBLIC\\\_STRAPI\\\_URL: http://strapi:1337
         STRAPI\\\_API\\\_TOKEN: your-api-token-here
         NEXT\\\_PUBLIC\\\_SITE\\\_URL: http://localhost:3000
         RESEND\\\_API\\\_KEY: re\\\_xxx
       ports:
         - "3000:3000"
       depends\\\_on:
         - strapi
   volumes:
     mariadb\\\_data:

4. Her iki klasöre ayrı Dockerfile oluştur (multi-stage, Node 20 Alpine)

5. frontend/app/(site)/page.tsx içine basit "Şablon çalışıyor" placeholder koy

ÇIKTI:
- `docker-compose up` → MariaDB + Strapi ayağa kalkar
- `localhost:1337/admin` → Strapi admin, ilk kullanıcı oluşturma ekranı
- `cd frontend \\\&\\\& npm run dev` → localhost:3000 frontend placeholder
- `npm run build` (frontend) hatasız tamamlanmalı
```

\---

## ✋ FAZ 1 BİTİNCE — SEN YAPACAKSIN

1. Coolify'da "strapi-musteri-a" ve "frontend-musteri-a" adında iki servis oluştur
2. GitHub repo'yu her ikisine ayrı ayrı bağla
3. MariaDB'de `strapi\\\_musteri\\\_a` adında database oluştur
4. Strapi servisine environment variables'ları gir — **şu 3 değişkeni mutlaka ekle:**

```
   NIXPACKS\\\_NODE\\\_VERSION=22
   NODE\\\_OPTIONS=--max-old-space-size=1536
   STRAPI\\\_TELEMETRY\\\_DISABLED=true
   ```

> ⚠️ \\\*\\\*Nixpacks + RAM Uyarısı:\\\*\\\* Strapi'nin `npm run build` adımı (admin paneli
   > derleme) anlık 1.5–2 GB RAM tüketir. `NODE\\\_OPTIONS` olmadan Nixpacks build'i
   > `exit code 255` ile çöker. `STRAPI\\\_TELEMETRY\\\_DISABLED` gereksiz arka plan
   > isteklerini kapatarak build'i hafifletir.

5. Strapi deploy et → `musteri-a.com:1337/admin` açılıyor mu kontrol et
6. Strapi admin'de ilk kullanıcıyı oluştur
7. Strapi admin → Settings → API Tokens → Full Access token oluştur → not al
8. Frontend servisine `STRAPI\\\_API\\\_TOKEN` dahil tüm env değişkenlerini gir, deploy et

\---

## FAZ 2 — Strapi İçerik Modelleri (Content Types)

```
Mevcut Strapi 5 projesine içerik modellerini ekle.

OLUŞTURULACAK CONTENT TYPES:

1. strapi/src/api/page/content-types/page/schema.json
   Alanlar:
   - title: string (zorunlu)
   - slug: uid (title'dan türetilen, unique)
   - hero: component (hero.hero-section)
     - heading: string
     - subheading: text
     - ctaText: string
     - ctaLink: string
     - backgroundImage: media (single)
   - seoTitle: string
   - seoDescription: text
   - publishedAt: datetime (Strapi draft/publish bunu otomatik yönetir)
   - status: enumeration (draft, published) — zaten Strapi'nin Draft \\\& Publish sistemi bunu karşılar

2. strapi/src/api/post/content-types/post/schema.json (Blog)
   Alanlar:
   - title: string (zorunlu)
   - slug: uid (unique)
   - excerpt: text
   - content: richtext (blocks)
   - featuredImage: media (single)
   - author: relation (many-to-one → plugin::users-permissions.user)
   - tags: json (string array)
   - publishedAt: datetime

3. strapi/src/api/service/content-types/service/schema.json (Hizmetler)
   Alanlar:
   - title: string
   - slug: uid (unique)
   - shortDescription: text
   - content: richtext
   - icon: string (lucide icon adı)
   - featuredImage: media (single)
   - order: integer
   - publishedAt: datetime

4. strapi/src/api/team-member/content-types/team-member/schema.json
   Alanlar:
   - name: string
   - jobTitle: string
   - bio: text
   - photo: media (single)
   - email: email
   - order: integer
   - isActive: boolean (default: true)

5. strapi/src/api/site-setting/content-types/site-setting/schema.json (Single Type)
   kind: singleType
   Alanlar:
   - siteName: string
   - siteDescription: text
   - logo: media (single)
   - favicon: media (single)
   - primaryColor: string (#hex)
   - contactEmail: email
   - phone: string
   - address: text
   - socialLinks: component (repeatable, shared.social-link)
     - platform: enumeration (instagram, linkedin, twitter, facebook, youtube)
     - url: string
   - footerText: text

6. strapi/src/components/hero/hero-section.json (Component)
   Alanlar: heading, subheading, ctaText, ctaLink, backgroundImage

7. strapi/src/components/shared/social-link.json (Component)
   Alanlar: platform, url

YAPILACAKLAR:
1. Content Type Builder ile her schema.json'ı oluştur
   (Cursor bunu kod olarak yazacak, Strapi restart'ta otomatik migrate eder)
2. strapi/src/api/ altında her content type için controllers, routes, services
   dosyalarını oluştur (Strapi 5 default CRUD yeterli, override gerekmez)
3. Her content type için API izinlerini ayarla:
   - Public role: find, findOne (sadece published)
   - Authenticated: tüm CRUD
   Bu ayar Strapi admin → Settings → Roles \\\& Permissions'dan yapılır,
   Cursor bunu dokümante etsin ama kod ile yapamaz.
4. Türkçe field display names için her schema'ya "displayName" ekle

ÇIKTI:
- `localhost:1337/admin` panelinde tüm content type'lar görünüyor
- Admin içerik girebiliyor
- `localhost:1337/api/services` → JSON dönüyor
- `localhost:1337/api/site-setting` → site ayarları dönüyor
```

\---

## FAZ 3 — Next.js Sayfaları (SSG + ISR)

```
Strapi 5 API'sinden içerik çeken Next.js sayfaları oluştur.

YAPILACAKLAR:

1. frontend/lib/strapi.ts oluştur
   Strapi REST API'yi çağıran type-safe helper:

   // Sunucu taraflı istekler Coolify iç ağını kullanır → ultra hızlı, dış internete çıkmaz
   // İstemci taraflı (browser) istekler public URL'i kullanır
   const STRAPI\\\_INTERNAL\\\_URL = process.env.STRAPI\\\_INTERNAL\\\_URL   // server-only, ör: http://strapi:1337
   const STRAPI\\\_PUBLIC\\\_URL = process.env.NEXT\\\_PUBLIC\\\_STRAPI\\\_URL   // browser'a expose edilir
   const API\\\_TOKEN = process.env.STRAPI\\\_API\\\_TOKEN

   // Server component'ten çağrılır → iç ağ URL'i kullan
   async function fetchStrapi<T>(
     endpoint: string,
     params?: Record<string, string>,
     revalidate = 60
   ): Promise<T> {
     const baseUrl = STRAPI\\\_INTERNAL\\\_URL ?? STRAPI\\\_PUBLIC\\\_URL   // iç ağ varsa onu kullan
     const url = new URL(`${baseUrl}/api/${endpoint}`)
     if (params) Object.entries(params).forEach((\\\[k,v]) => url.searchParams.set(k, v))
     const res = await fetch(url.toString(), {
       headers: { Authorization: `Bearer ${API\\\_TOKEN}` },
       next: { revalidate },
     })
     if (!res.ok) throw new Error(`Strapi fetch failed: ${endpoint}`)
     return res.json()
   }

   // Media URL'lerini normalize eden yardımcı (FAZ 4'e kadar local dev'de de çalışır)
   export function getStrapiMediaUrl(url: string | null | undefined): string {
     if (!url) return ''
     if (url.startsWith('http')) return url   // R2/CDN URL'i, direkt kullan
     return `${STRAPI\\\_PUBLIC\\\_URL}${url}`      // relative /uploads/... → tam URL
   }

   Export edilecek fonksiyonlar:
   - getPages() → revalidate: 60
   - getPage(slug) → revalidate: 300
   - getPosts(page?, pageSize?) → revalidate: 60
   - getPost(slug) → revalidate: 300
   - getServices() → revalidate: 60
   - getService(slug) → revalidate: 300
   - getTeamMembers() → revalidate: 600
   - getSiteSettings() → revalidate: 3600

   Strapi 5 populate syntax:
   - populate=\\\* (tüm ilişkiler)
   - populate\\\[hero]\\\[populate]=backgroundImage (nested)
   - filters\\\[publishedAt]\\\[$notNull]=true (sadece published)
   - sort=order:asc (sıralama)

2. frontend/types/strapi.ts oluştur
   Strapi response wrapper'ları için TypeScript interface'leri:
   - StrapiResponse<T>, StrapiData<T>, StrapiAttributes
   - PageAttributes, PostAttributes, ServiceAttributes, TeamMemberAttributes, SiteSettingAttributes
   - HeroComponent, SocialLinkComponent
   - MediaAttributes (url, width, height, formats)

3. app/(site)/page.tsx — Ana sayfa
   Bölümler (ayrı component dosyaları):
   - HeroSection: hero alanlarından dinamik
   - ServicesSection: ilk 6 hizmeti grid
   - AboutSection: SiteSettings kısa tanıtım
   - TeamSection: isActive=true ekip üyeleri, order'a göre sıralı
   - BlogSection: son 3 blog yazısı
   - ContactSection: iletişim formu
   revalidate: 60

4. app/(site)/hizmetler/page.tsx
   - getServices() ile tüm hizmetleri getir
   - Grid layout, order'a göre sıralı
   - revalidate: 60

5. app/(site)/hizmetler/\\\[slug]/page.tsx
   - generateStaticParams: getServices() slug'larını döndür
   - generateMetadata: seoTitle, seoDescription
   - Strapi richtext renderer (blocks format)
   - revalidate: 300

6. app/(site)/blog/page.tsx
   - Sayfalama: ?page=1\\\&pageSize=9
   - revalidate: 60

7. app/(site)/blog/\\\[slug]/page.tsx
   - generateStaticParams
   - Strapi blocks richtext renderer
   - generateMetadata (OG image dahil)
   - revalidate: 300

8. app/(site)/hakkimizda/page.tsx
   - getSiteSettings() ve getTeamMembers()
   - revalidate: 600

9. app/(site)/iletisim/page.tsx
   - İletişim formu (client component)
   - getSiteSettings() ile adres/tel/email
   - revalidate: 3600

10. app/api/contact/route.ts
    - POST: name, email, phone, message
    - Zod ile validate
    - Resend ile admin emailine yönlendir
    - Rate limiting: IP başına 3 istek/saat (basit in-memory Map)

11. Strapi Blocks Richtext Renderer:
    components/RichText.tsx oluştur
    - Strapi 5 blocks format'ı parse eder
    - paragraph, heading (h1-h6), list (ordered/unordered), image, code, quote tiplerini destekler
    - next/image ile resim render eder

12. components/layout/ klasörü:
    - Header.tsx: nav linkleri, logo (getSiteSettings'den)
    - Footer.tsx: sosyal linkler, footerText
    - app/layout.tsx'e ekle (getSiteSettings server component'ten çağır)

ÇIKTI:
- Tüm sayfalar Strapi'den içerik çekiyor
- Admin'den içerik değişince 60 saniye içinde sitede güncelleniyor
- /api/contact çalışıyor, email geliyor
- `npm run build` hatasız, sayfalar statik olarak generate ediliyor
```

\---

## FAZ 4 — Medya + Cloudflare R2

```
Strapi medya yüklemelerini Cloudflare R2'ye yönlendir.

GEREKLİ PAKETLER (strapi/ klasöründe):
npm install @strapi/provider-upload-aws-s3

YAPILACAKLAR:

1. strapi/config/plugins.ts oluştur veya güncelle:
   export default ({ env }) => ({
     upload: {
       config: {
         provider: 'aws-s3',
         providerOptions: {
           credentials: {
             accessKeyId: env('S3\\\_ACCESS\\\_KEY'),
             secretAccessKey: env('S3\\\_SECRET\\\_KEY'),
           },
           region: 'auto',
           endpoint: env('S3\\\_ENDPOINT'),   // Cloudflare R2 endpoint
           forcePathStyle: true,           // R2 için zorunlu
         },
         actionOptions: {
           upload: {},
           uploadStream: {},
           delete: {},
         },
       },
     },
   });

2. strapi/config/middlewares.ts içine R2 domain'ini CSP'ye ekle:
   {
     name: 'strapi::security',
     config: {
       contentSecurityPolicy: {
         directives: {
           'img-src': \\\["'self'", 'data:', 'blob:', env('NEXT\\\_PUBLIC\\\_CDN\\\_URL')],
         },
       },
     },
   }

3. strapi/.env.example'a ekle:
   S3\\\_BUCKET=musteri-a-media
   S3\\\_ENDPOINT=https://ACCOUNT\\\_ID.r2.cloudflarestorage.com
   S3\\\_ACCESS\\\_KEY=xxx
   S3\\\_SECRET\\\_KEY=xxx
   NEXT\\\_PUBLIC\\\_CDN\\\_URL=https://media.musteri-a.com

4. frontend/next.config.ts'e R2 domain'ini images config'e ekle:
   images: {
     remotePatterns: \\\[
       { protocol: 'https', hostname: '\\\*.r2.cloudflarestorage.com' },
       { protocol: 'https', hostname: 'media.musteri-a.com' },
       { protocol: 'http', hostname: 'localhost', port: '1337' },  // local dev
     ],
     formats: \\\['image/avif', 'image/webp'],
   }

5. frontend/components/common/StrapiImage.tsx oluştur:
   - Strapi MediaAttributes objesini alır
   - URL normalizasyonu için lib/strapi.ts'deki `getStrapiMediaUrl()` kullanılır:
     \\\* URL `http/https` ile başlıyorsa → R2/CDN URL'i, direkt kullan
     \\\* URL `/uploads` ile başlıyorsa → başına `NEXT\\\_PUBLIC\\\_STRAPI\\\_URL` ekle (local dev)
     Bu sayede FAZ 4 (R2) kurulana kadar local dev'de resimler kırık görünmez.
   - next/image wrapper olarak çalışır
   - formats.thumbnail, formats.medium, formats.large'ı srcSet için kullanır

ÇIKTI:
- Admin panelinden yüklenen dosyalar R2'ye gidiyor
- Frontend'de resimler CDN üzerinden geliyor
- next/image optimizasyonu çalışıyor
```

\---

## ✋ FAZ 4 BAŞLAMADAN ÖNCE — SEN YAPACAKSIN

1. Cloudflare hesabında R2 bucket aç: `musteri-a-media`
2. R2 → Settings → Public access aç veya custom domain bağla
3. R2 API token oluştur (Object Read \& Write izni)
4. Coolify'da Strapi servisine S3\_\* environment variables'larını ekle

\---

## FAZ 5 — SEO + Sitemap + OG Image

```
Projeye SEO altyapısı ekle. (frontend/ klasöründe çalış)

YAPILACAKLAR:

1. frontend/next-sitemap.config.js oluştur:
   module.exports = {
     siteUrl: process.env.NEXT\\\_PUBLIC\\\_SITE\\\_URL,
     generateRobotsTxt: true,
     exclude: \\\['/api/\\\*'],
     additionalPaths: async (config) => {
       // Strapi'den tüm blog ve hizmet slug'larını çek
       const \\\[posts, services] = await Promise.all(\\\[
         fetch(`${process.env.NEXT\\\_PUBLIC\\\_STRAPI\\\_URL}/api/posts?fields=slug\\\&filters\\\[publishedAt]\\\[$notNull]=true\\\&pagination\\\[pageSize]=1000`).then(r => r.json()),
         fetch(`${process.env.NEXT\\\_PUBLIC\\\_STRAPI\\\_URL}/api/services?fields=slug\\\&filters\\\[publishedAt]\\\[$notNull]=true`).then(r => r.json()),
       ])
       return \\\[
         ...posts.data.map(p => ({ loc: `/blog/${p.attributes.slug}` })),
         ...services.data.map(s => ({ loc: `/hizmetler/${s.attributes.slug}` })),
       ]
     },
   }
   package.json postbuild script'e `next-sitemap` ekle

2. Her sayfa için generateMetadata fonksiyonu tamamla:
   - title: `${pageTitle} | ${siteName}`
   - description: seoDescription
   - openGraph: title, description, image, url
   - twitter: card, title, description, image
   - canonical URL

3. app/opengraph-image.tsx — Dinamik OG image:
   - next/og ile ImageResponse
   - Site adı ve sayfa başlığı içeren 1200x630 görsel
   - getSiteSettings'den renk ve site adı al

4. app/(site)/blog/\\\[slug]/opengraph-image.tsx:
   - Blog yazısına özel OG image
   - Yazı başlığı, tarih

5. app/robots.ts:
   - /api'yi disallow et
   - Sitemap URL'ini belirt

6. Structured data (JSON-LD) ekle:
   - Ana sayfa: Organization schema
   - Blog yazıları: Article schema
   - Hizmetler: Service schema
   - frontend/lib/structured-data.ts helper fonksiyonları yaz

ÇIKTI:
- `npm run build` sonrası sitemap.xml oluşuyor
- robots.txt doğru
- Her sayfanın meta tagleri dolu
- OG görseller dinamik üretiliyor
```

\---

## FAZ 6 — Tasarım Sistemi (Tema + Komponentler)

```
Müşteriden müşteriye değişebilen bir tasarım sistemi kur. (frontend/ klasöründe)

FELSEFE:
- Tüm renkler, fontlar CSS variables üzerinden
- Her müşteri için SiteSettings'deki primaryColor runtime'da override edilebilir
- Komponent kütüphanesi shadcn/ui üzerine kurulu

YAPILACAKLAR:

1. frontend/app/globals.css'i düzenle:
   :root {
     --color-primary: var(--site-primary, #0f172a);
     --color-primary-foreground: #ffffff;
     --font-heading: var(--site-font-heading, 'Inter');
     --font-body: var(--site-font-body, 'Inter');
     --border-radius: var(--site-radius, 0.5rem);
   }

2. frontend/app/layout.tsx'e dinamik CSS variable enjeksiyonu:
   const settings = await getSiteSettings()
   <html style={{ '--site-primary': settings.data.attributes.primaryColor } as React.CSSProperties}>

3. Şu shadcn/ui komponentlerini özelleştir (components/ui/ altında):
   - Button (primary/secondary/outline varyantları)
   - Card (hizmet kartı, blog kartı, ekip üyesi kartı)
   - Badge (blog tag'leri için)
   - Input, Textarea, Label (iletişim formu)
   - NavigationMenu (header nav)

4. Frontend komponentleri oluştur:
   components/sections/
   - HeroSection.tsx
   - ServicesGrid.tsx
   - BlogGrid.tsx
   - TeamGrid.tsx
   - ContactForm.tsx (client component, react-hook-form + zod)
   - TestimonialsSection.tsx (statik placeholder, ileride kullanım için)

   components/common/
   - SectionHeader.tsx (başlık + alt başlık pattern)
   - ServiceCard.tsx
   - BlogCard.tsx
   - TeamCard.tsx
   - StrapiImage.tsx (next/image wrapper, Strapi media objesini alır)

5. next/font ile Google Fonts yükle, CSS variable olarak kaydet:
   const inter = Inter({ subsets: \\\['latin'], variable: '--site-font-body' })

6. Responsive tasarım:
   - Mobile-first
   - Header'da hamburger menu (shadcn Sheet component)
   - Grid'ler: mobile 1 kolon, tablet 2, desktop 3

ÇIKTI:
- Yeni müşteri için sadece primaryColor değiştirince site rengi değişiyor
- Tüm sayfalar mobile'da düzgün görünüyor
- Komponentler yeniden kullanılabilir ve Strapi verisiyle çalışıyor
```

\---

## FAZ 7 — Yeni Müşteri Deployment Checklist

```
Cursor'a yaptırılacak tek iş docs/yeni-musteri.md dosyasını oluşturmak.
Script yok, otomasyon yok — repo kopyalanıyor, env giriliyor, deploy ediliyor.

YAPILACAKLAR:

1. docs/yeni-musteri.md oluştur. İçeriği:

---

# Yeni Müşteri Ekleme (Tahmini Süre: 20-30 dk)

## Adım 1 — Repo'yu kopyala
GitHub'da `kurumsal-sablon` reposunu fork'la veya "Use this template" ile
yeni repo oluştur. Adı: `musteri-adi-site`

## Adım 2 — Coolify'da yeni proje aç
Coolify → Projects → Add Project → İsim: "musteri-adi"
Bu proje altına 2 servis eklenecek: Strapi + Frontend

## Adım 3 — MariaDB'de yeni database oluştur
Coolify'daki MariaDB servisine bağlan (TablePlus veya terminal):
```sql
CREATE DATABASE strapi\\\_musteriadi
  CHARACTER SET utf8mb4
  COLLATE utf8mb4\\\_unicode\\\_ci;
```

## Adım 4 — Strapi servisini kur

Coolify → Yeni Proje → Add Service → Docker Image veya GitHub repo (strapi/ klasörü)

Environment Variables:

```
HOST=0.0.0.0
PORT=1337
APP\\\_KEYS=          # openssl rand -base64 32 → 4 kez çalıştır, virgülle birleştir
API\\\_TOKEN\\\_SALT=    # openssl rand -base64 32
ADMIN\\\_JWT\\\_SECRET=  # openssl rand -base64 32
TRANSFER\\\_TOKEN\\\_SALT= # openssl rand -base64 32
JWT\\\_SECRET=        # openssl rand -base64 32
DATABASE\\\_HOST=     # Coolify MariaDB internal host
DATABASE\\\_PORT=3306
DATABASE\\\_NAME=strapi\\\_musteriadi
DATABASE\\\_USERNAME=strapi
DATABASE\\\_PASSWORD=  # MariaDB şifresi
DATABASE\\\_SSL=false
NIXPACKS\\\_NODE\\\_VERSION=22
NODE\\\_OPTIONS=--max-old-space-size=1536
STRAPI\\\_TELEMETRY\\\_DISABLED=true
S3\\\_BUCKET=musteri-adi-media
S3\\\_ENDPOINT=https://ACCOUNT\\\_ID.r2.cloudflarestorage.com
S3\\\_ACCESS\\\_KEY=
S3\\\_SECRET\\\_KEY=
NEXT\\\_PUBLIC\\\_CDN\\\_URL=https://media.musteri-adi.com
```

Deploy et. İlk deploy'da Strapi tablolar otomatik oluşturulur.

## Adım 5 — Strapi'de ilk kurulum

* `musteri-adi.com:1337/admin` → Admin hesabı oluştur
* Settings → API Tokens → Add Token → Name: "frontend" → Full Access → Kaydet → token'ı not al
* Settings → Roles → Public → şu izinleri aç:

  * Post: find, findOne
  * Service: find, findOne
  * Page: find, findOne
  * Team-member: find
  * Site-setting: find
Kaydet.
* Settings → Admin Panel → (strapi/config/admin.ts içinde) admin URL'ini
`/admin` yerine `/cms-panel` gibi custom bir path yap. Müşteriye bu URL'i ver.
(strapi/config/admin.ts → `url: '/cms-panel'`)

## Adım 6 — Frontend servisini kur

Coolify → Aynı Proje → Add Service → GitHub repo (frontend/ klasörü)

> ⚠️ \\\*\\\*Build Arg Uyarısı:\\\*\\\* `NEXT\\\_PUBLIC\\\_` değişkenleri Next.js tarafından
> build sırasında koda gömülür. Sadece environment variable olarak girmek yetmez,
> aynı zamanda \\\*\\\*Build Arguments\\\*\\\* olarak da eklenmesi gerekir.
> Coolify → Servis → Configuration → Build Arguments bölümüne de gir.

Environment Variables (runtime için):

```
NEXT\\\_PUBLIC\\\_STRAPI\\\_URL=https://strapi.musteri-adi.com
STRAPI\\\_INTERNAL\\\_URL=http://\\\[coolify-strapi-container-adi]:1337
STRAPI\\\_API\\\_TOKEN=   # Adım 5'te aldığın token
NEXT\\\_PUBLIC\\\_SITE\\\_URL=https://musteri-adi.com
RESEND\\\_API\\\_KEY=re\\\_xxx
NEXT\\\_PUBLIC\\\_CDN\\\_URL=https://media.musteri-adi.com
```

Build Arguments (build sırasında koda gömülür):

```
NEXT\\\_PUBLIC\\\_STRAPI\\\_URL=https://strapi.musteri-adi.com
NEXT\\\_PUBLIC\\\_SITE\\\_URL=https://musteri-adi.com
NEXT\\\_PUBLIC\\\_CDN\\\_URL=https://media.musteri-adi.com
```

Deploy et.

## Adım 7 — DNS

Cloudflare'de:

* `musteri-adi.com` → A kaydı → Hetzner IP
* `strapi.musteri-adi.com` → A kaydı → Hetzner IP (Strapi için subdomain)
* `media.musteri-adi.com` → R2 bucket custom domain

## Adım 8 — Kontrol

* \[ ] `musteri-adi.com` açılıyor
* \[ ] `strapi.musteri-adi.com/admin` açılıyor
* \[ ] Strapi'den içerik girince frontend'de görünüyor (max 60 sn)
* \[ ] İletişim formu mail atıyor
* \[ ] Resim yükleme R2'ye gidiyor

## Müşteriye iletilecekler

* Strapi admin URL: `strapi.musteri-adi.com/admin`
* Kullanıcı adı: (oluşturduğun email)
* Şifre: (belirlediğin şifre)

\---

ÇIKTI:

* docs/yeni-musteri.md oluşturuldu
* Checklist eksiksiz, sıfır geliştirici bilgisi gerektirmiyor

```

---

## FAZ 8 — Production Hazırlık + Güvenlik

```

Projeyi production'a taşımadan önce güvenlik ve performans kontrolü yap.

YAPILACAKLAR:

1. frontend/next.config.ts — HTTP Security Headers:
async headers() {
return \[{
source: '/(.\*)',
headers: \[
{ key: 'X-Frame-Options', value: 'DENY' },
{ key: 'X-Content-Type-Options', value: 'nosniff' },
{ key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
{ key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
{
key: 'Content-Security-Policy',
value: \[
"default-src 'self'",
"script-src 'self' 'unsafe-inline' 'unsafe-eval'",
"style-src 'self' 'unsafe-inline'",
`img-src 'self' data: blob: ${process.env.NEXT\\\_PUBLIC\\\_CDN\\\_URL} ${process.env.NEXT\\\_PUBLIC\\\_STRAPI\\\_URL}`,
"font-src 'self'",
"connect-src 'self' https://api.resend.com",
].join('; ')
},
],
}]
}
2. frontend/middleware.ts oluştur:

   * /api rotalarına rate limiting (header tabanlı)
   * Bot trafiği için basic filtreleme
3. Strapi tarafında güvenlik:

   * strapi/config/middlewares.ts: rate limiting middleware ekle
   * API token rotasyonu için döküman yaz
4. app/api/contact/route.ts iyileştirmeleri:

   * Honeypot field kontrolü
   * Daha güçlü rate limiting (in-memory Map ile)
   * Input sanitization (DOMPurify veya manuel)
5. Error handling (frontend/):

   * app/error.tsx (genel hata sayfası)
   * app/not-found.tsx (404, SiteSettings'den içerik)
   * app/loading.tsx
   * Strapi API çağrılarını try/catch ile sar, fallback içerikler ekle
6. Performance (frontend/):

   * Hero resimleri: priority: true
   * next/font ile Google Fonts (swap display)
   * Bundle analyzer: `npm install @next/bundle-analyzer`
7. Environment validation:
frontend/lib/env.ts:
import { z } from 'zod'
const envSchema = z.object({
NEXT\_PUBLIC\_STRAPI\_URL: z.string().url(),
STRAPI\_INTERNAL\_URL: z.string().url().optional(), // local dev'de boş olabilir
STRAPI\_API\_TOKEN: z.string().min(10),
NEXT\_PUBLIC\_SITE\_URL: z.string().url(),
RESEND\_API\_KEY: z.string().startsWith('re\_'),
})
export const env = envSchema.parse(process.env)
8. .github/workflows/deploy.yml oluştur:

   * Push to main → Coolify webhook tetikle (hem strapi hem frontend için)
   * Build check: type-check + lint
   * Strapi ve Frontend için ayrı workflow job'ları

ÇIKTI:

* Lighthouse skoru: Performance 90+, SEO 100, Accessibility 90+
* Güvenlik header'ları doğru
* Hata sayfaları var
* CI/CD çalışıyor
* Environment validation başlangıçta hata veriyor

```

---

## ÖZET — FAZ SIRASI VE SORUMLULUKLAR

| Faz | Cursor | Sen |
|-----|--------|-----|
| 1 — İskelet | Next.js + Strapi scaffold, docker-compose, Dockerfile | GitHub repo, Hetzner, Coolify, MariaDB |
| 2 — Content Types | Strapi schema'ları, API izin dokümantasyonu | Admin'den test içeriği gir, API izinlerini ayarla |
| 3 — Sayfalar | Next.js SSG/ISR sayfaları, Strapi helper, API route | İletişim formunu test et |
| 4 — R2 | Strapi S3 provider config, StrapiImage component | R2 bucket, API token |
| 5 — SEO | Sitemap, OG, JSON-LD | — |
| 6 — Tasarım | Component kütüphanesi, tema sistemi | Renk ve font tercihlerini belirt |
| 7 — Deployment | docs/yeni-musteri.md checklist | — |
| 8 — Production | Güvenlik headers, error handling, CI/CD | Lighthouse testi, Coolify prod deploy |

---

## ÖNEMLİ NOTLAR

\\\*\\\*Strapi vs Payload farkları:\\\*\\\*
- Strapi ayrı bir port'ta çalışır (1337), Next.js ile aynı process değil
- Strapi admin için ayrı Coolify servisi gerekir
- Strapi API'si REST tabanlı, `/api/` prefix ile erişilir
- Strapi 5'te media URL'leri relative gelir, tam URL için `STRAPI\\\_URL + media.url` kullan
- Draft \\\& Publish sistemi Strapi'de built-in, `filters\\\[publishedAt]\\\[$notNull]=true` ile published içerik çekilir
- MariaDB için MySQL2 driver kullanılır (`npm install mysql2`), konfigürasyon aynı

\\\*\\\*MariaDB bağlantı notu:\\\*\\\*
- MariaDB 10.6+ MySQL2 driver ile tam uyumludur
- Charset: `utf8mb4`, Collation: `utf8mb4\\\_unicode\\\_ci` kullan (Türkçe karakter desteği için)
- Coolify'da MariaDB servisi başlatırken bu charset'leri default olarak ayarla



# Yeni Müşteri Ekleme (Tahmini Süre: 20-30 dk)

## Adım 1 — Repo'yu kopyala
GitHub'da `kurumsal-sablon` reposunu **"Use this template"** ile yeni repo oluştur.
Adı: `musteri-adi-site`

## Adım 2 — Coolify'da yeni proje aç
Coolify → Projects → Add Project → İsim: "musteri-adi"
Bu proje altına 3 servis eklenecek: MariaDB + Directus + Frontend.

## Adım 3 — MariaDB servisi kur
Coolify → Yeni Proje → Add Service → MariaDB
- Initial Database: `directus_musteriadi`
- Username ve password not al

## Adım 4 — Directus servisi kur
Coolify → Yeni Proje → Add Service → Directus

Environment Variables:
```
DB_CLIENT=mysql
DB_HOST=          # MariaDB internal host (Coolify container adı)
DB_PORT=3306
DB_DATABASE=directus_musteriadi
DB_USER=          # MariaDB username
DB_PASSWORD=      # MariaDB password
SECRET=           # openssl rand -base64 32
ADMIN_EMAIL=admin@musteri-adi.com
ADMIN_PASSWORD=   # güçlü şifre
PUBLIC_URL=https://directus.musteri-adi.com
```
Deploy et. İlk deploy'da tablolar otomatik oluşur.

## Adım 5 — Directus'ta koleksiyonları oluştur
Directus admin → Data Model → şu koleksiyonları oluştur:

| Koleksiyon | Tip | Alanlar |
|---|---|---|
| `Page` | Standart | title, slug, status, hero_heading, hero_subheading, hero_cta_text, hero_cta_link, hero_background_image, seo_title, seo_description |
| `posts` | Standart | title, slug, status, excerpt, content (Rich Text), featured_image, tags, date_created |
| `services` | Standart | title, slug, status, short_description, content (Rich Text), icon (String), featured_image, sort |
| `team_members_` | Standart | name_Required, job_title, bio, photo, email, status, sort |
| `site_settings` | **Singleton** | site_name, site_description, logo, favicon, primary_color, contact_email, phone, address, footer_text, social_links |

**Ana sayfa içeriği ekle:**
`Page` koleksiyonu → Yeni kayıt → slug: `home` → status: `published`

## Adım 6 — API Token al
Directus → Settings → Access Tokens → Create → "frontend-token" → Full Access
Token'ı not al.

## Adım 7 — Public izinleri aç
Settings → Roles → Public → şu koleksiyonlara **read** izni ver:
`Page`, `posts`, `services`, `team_members_`, `site_settings`

## Adım 8 — Frontend servisini kur
Coolify → Yeni Proje → Add Service → GitHub repo (frontend/ klasörü)

**Runtime Environment Variables:**
```
NEXT_PUBLIC_DIRECTUS_URL=https://directus.musteri-adi.com
DIRECTUS_INTERNAL_URL=http://[coolify-directus-container]:8055
DIRECTUS_TOKEN=       # Adım 6'daki token
NEXT_PUBLIC_SITE_URL=https://musteri-adi.com
RESEND_API_KEY=re_xxx
NEXT_PUBLIC_CDN_URL=https://directus.musteri-adi.com/assets
CONTACT_EMAIL=admin@musteri-adi.com
```

**Build Arguments** (build sırasında koda gömülür):
```
NEXT_PUBLIC_DIRECTUS_URL=https://directus.musteri-adi.com
NEXT_PUBLIC_SITE_URL=https://musteri-adi.com
```

Deploy et.

**`next.config.ts`'e hostname ekle:**
```ts
{ protocol: 'https', hostname: 'directus.musteri-adi.com' }
```

## Adım 9 — DNS (Cloudflare)
| Kayıt | Değer |
|---|---|
| `musteri-adi.com` A | Hetzner sunucu IP |
| `directus.musteri-adi.com` A | Hetzner sunucu IP |
| `media.musteri-adi.com` CNAME | R2 bucket custom domain (opsiyonel) |

## Adım 10 — Kontrol Listesi
- [ ] `musteri-adi.com` açılıyor, HeroSection görünüyor
- [ ] `directus.musteri-adi.com` admin paneli açılıyor
- [ ] Directus'tan içerik girince frontend'de görünüyor (max 60 sn)
- [ ] İletişim formu mail gönderiyor
- [ ] Resim yükleme çalışıyor
- [ ] `sitemap.xml` ve `robots.txt` erişilebilir

## Müşteriye Teslim Edilecek Bilgiler
- Directus URL: `https://directus.musteri-adi.com`
- Admin e-posta: (belirlenen)
- Admin şifre: (belirlenen)
- Site URL: `https://musteri-adi.com`

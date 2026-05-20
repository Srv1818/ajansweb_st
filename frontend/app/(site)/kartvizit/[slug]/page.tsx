import { getItems, getDirectusImageUrl, getSiteSettings } from '@/lib/directus'
import type { TeamMemberItem, SiteSettings, DirectusFile } from '@/types/directus'
import { notFound } from 'next/navigation'
import {
  Phone,
  MessageCircle,
  Mail,
  MapPin,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react'
import Image from 'next/image'
import DirectusImage from '@/components/common/DirectusImage'

export const revalidate = 300

function getFileId(field: string | DirectusFile | null | undefined): string | null {
  if (!field) return null
  if (typeof field === 'string') return field
  return field.id
}

export async function generateStaticParams() {
  const members = await getItems<TeamMemberItem>('team_members_', {
    fields: ['slug'],
  }).catch(() => [] as TeamMemberItem[])
  return members
    .filter((m) => m.slug)
    .map((m) => ({ slug: m.slug! }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const members = await getItems<TeamMemberItem>('team_members_', {
    filter: { slug: { _eq: slug } },
  }).catch(() => [] as TeamMemberItem[])
  const member = members[0]
  if (!member) return {}

  const settings = (await getSiteSettings().catch(() => null)) as SiteSettings | null
  const ogImageId = getFileId(member.cover_image) ?? getFileId(member.photo)
  const ogImageUrl = ogImageId
    ? getDirectusImageUrl(ogImageId, { width: 1200, height: 630, format: 'webp' })
    : undefined

  return {
    title: `${member.name_Required} | ${member.job_title ?? settings?.site_name ?? ''}`,
    description: member.company_description ?? member.bio,
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/kartvizit/${slug}`,
    },
    robots: 'index, follow',
    openGraph: {
      title: `${member.name_Required} — ${member.job_title ?? ''}`,
      description: member.company_description ?? member.bio ?? '',
      url: `${process.env.NEXT_PUBLIC_SITE_URL}/kartvizit/${slug}`,
      type: 'profile',
      images: ogImageUrl ? [{ url: ogImageUrl, width: 1200, height: 630 }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${member.name_Required} — ${member.job_title ?? ''}`,
      description: member.company_description ?? member.bio ?? '',
      images: ogImageUrl ? [ogImageUrl] : [],
    },
  }
}

export default async function KartvizitPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  const [members, settings] = await Promise.all([
    getItems<TeamMemberItem>('team_members_', {
      filter: { slug: { _eq: slug } },
    }).catch(() => [] as TeamMemberItem[]),
    getSiteSettings().catch(() => null),
  ])

  const member = members[0]
  if (!member) notFound()

  const s = settings as SiteSettings | null
  const photoId = getFileId(member.photo)
  const coverImageId = getFileId(member.cover_image)
  const theme = member.card_theme ?? 'default'

  // Renk paleti — tasarım (spacing, layout, typography) hiç değişmez
  const p = coverImageId
    ? {
        pageBg: '',
        cardBg: 'bg-white/10 backdrop-blur-md',
        cardBorder: 'border-white/20',
        textPrimary: 'text-white',
        textSecondary: 'text-white/70',
        textMuted: 'text-white/50',
        photoRing: 'ring-2 ring-white/40',
        photoFallbackBg: 'bg-white/20',
        photoFallbackText: 'text-white',
        divider: 'divide-white/10',
        btnBg: 'bg-white/10 hover:bg-white/20 active:bg-white/5',
        btnBorder: 'border-white/20',
        btnText: 'text-white',
        checkIcon: 'text-white/60',
        serviceDesc: 'text-white/60',
        socialBg: 'bg-white/10 hover:bg-white/20',
        socialBorder: 'border-white/20',
        footerText: 'text-white/40',
        footerLink: 'hover:text-white/70',
      }
    : theme === 'dark'
    ? {
        pageBg: 'bg-slate-950',
        cardBg: 'bg-slate-800',
        cardBorder: 'border-slate-700',
        textPrimary: 'text-white',
        textSecondary: 'text-white/70',
        textMuted: 'text-white/50',
        photoRing: 'ring-2 ring-white/20',
        photoFallbackBg: 'bg-slate-700',
        photoFallbackText: 'text-white',
        divider: 'divide-slate-700',
        btnBg: 'bg-slate-700 hover:bg-slate-600 active:bg-slate-800',
        btnBorder: 'border-slate-600',
        btnText: 'text-white',
        checkIcon: 'text-white/50',
        serviceDesc: 'text-white/60',
        socialBg: 'bg-slate-700 hover:bg-slate-600',
        socialBorder: 'border-slate-600',
        footerText: 'text-white/50',
        footerLink: 'hover:text-white/70',
      }
    : {
        pageBg: 'bg-gray-100',
        cardBg: 'bg-white',
        cardBorder: 'border-gray-200',
        textPrimary: 'text-gray-800',
        textSecondary: 'text-gray-500',
        textMuted: 'text-gray-400',
        photoRing: 'ring-2 ring-gray-200',
        photoFallbackBg: 'bg-gray-200',
        photoFallbackText: 'text-gray-600',
        divider: 'divide-gray-100',
        btnBg: 'bg-gray-50 hover:bg-gray-100 active:bg-gray-200',
        btnBorder: 'border-gray-200',
        btnText: 'text-gray-700',
        checkIcon: 'text-gray-400',
        serviceDesc: 'text-gray-500',
        socialBg: 'bg-gray-50 hover:bg-gray-100',
        socialBorder: 'border-gray-200',
        footerText: 'text-gray-400',
        footerLink: 'hover:text-gray-700',
      }

  return (
    <div className={`relative min-h-screen ${p.pageBg}`}>
      {coverImageId && (
        <div className="fixed inset-0 z-0">
          <Image
            src={getDirectusImageUrl(coverImageId, { width: 1080, height: 1920 })}
            alt="cover"
            fill
            priority
            className="object-cover brightness-50 blur-sm"
            sizes="100vw"
          />
        </div>
      )}

      <div className="relative z-10 py-8 px-4">
        <div className="max-w-sm mx-auto space-y-3">

          {/* HEADER */}
          <div className={`${p.cardBg} ${p.cardBorder} rounded-2xl shadow-md border p-5 text-center space-y-3`}>
            {photoId ? (
              <div className="flex justify-center">
                <DirectusImage
                  fileId={photoId}
                  alt={member.name_Required ?? ''}
                  width={96}
                  height={96}
                  className={`rounded-full object-cover w-24 h-24 ${p.photoRing} shadow-md`}
                  priority
                />
              </div>
            ) : (
              <div className="flex justify-center">
                <div className={`w-24 h-24 rounded-full ${p.photoFallbackBg} ${p.photoRing} flex items-center justify-center ${p.photoFallbackText} font-semibold text-2xl`}>
                  {member.name_Required?.slice(0, 2).toUpperCase() ?? '??'}
                </div>
              </div>
            )}
            <div>
              <h1 className={`text-2xl font-bold ${p.textPrimary}`}>{member.name_Required}</h1>
              {member.job_title && (
                <p className={`text-sm ${p.textSecondary}`}>{member.job_title}</p>
              )}
              {s?.site_name && (
                <p className={`text-sm font-medium ${p.textMuted} mt-1`}>{s.site_name}</p>
              )}
            </div>
          </div>

          {/* HIZLI EYLEM BUTONLARI */}
          {(member.phone || member.whatsapp || member.email || member.maps_url) && (
            <div className={`${p.cardBg} ${p.cardBorder} rounded-2xl shadow-md border p-4 grid grid-cols-2 gap-3`}>
              {member.phone && (
                <a
                  href={`tel:${member.phone}`}
                  className={`flex flex-col items-center gap-2 p-3 rounded-xl ${p.btnBg} ${p.btnBorder} border transition-colors`}
                >
                  <Phone className={`w-5 h-5 ${p.btnText}`} />
                  <span className={`text-xs font-semibold ${p.btnText}`}>Ara</span>
                </a>
              )}
              {member.whatsapp && (
                <a
                  href={`https://wa.me/${member.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex flex-col items-center gap-2 p-3 rounded-xl ${p.btnBg} ${p.btnBorder} border transition-colors`}
                >
                  <MessageCircle className={`w-5 h-5 ${p.btnText}`} />
                  <span className={`text-xs font-semibold ${p.btnText}`}>WhatsApp</span>
                </a>
              )}
              {member.email && (
                <a
                  href={`mailto:${member.email}`}
                  className={`flex flex-col items-center gap-2 p-3 rounded-xl ${p.btnBg} ${p.btnBorder} border transition-colors`}
                >
                  <Mail className={`w-5 h-5 ${p.btnText}`} />
                  <span className={`text-xs font-semibold ${p.btnText}`}>E-posta</span>
                </a>
              )}
              {member.maps_url && (
                <a
                  href={member.maps_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex flex-col items-center gap-2 p-3 rounded-xl ${p.btnBg} ${p.btnBorder} border transition-colors`}
                >
                  <MapPin className={`w-5 h-5 ${p.btnText}`} />
                  <span className={`text-xs font-semibold ${p.btnText}`}>Yol Tarifi</span>
                </a>
              )}
            </div>
          )}

          {/* HAKKIMIZDA */}
          {member.company_description && (
            <div className={`${p.cardBg} ${p.cardBorder} rounded-2xl shadow-md border p-5`}>
              <h2 className={`text-xs font-bold ${p.textMuted} uppercase tracking-widest mb-3`}>
                Hakkımızda
              </h2>
              <p className={`text-sm leading-relaxed ${p.textPrimary}`}>{member.company_description}</p>
            </div>
          )}

          {/* HİZMETLER */}
          {member.services_list && member.services_list.length > 0 && (
            <div className={`${p.cardBg} ${p.cardBorder} rounded-2xl shadow-md border p-5`}>
              <h2 className={`text-xs font-bold ${p.textMuted} uppercase tracking-widest mb-3`}>
                Hizmetler
              </h2>
              <div className={`divide-y ${p.divider}`}>
                {member.services_list.map((service, i) => (
                  <div key={i} className="flex gap-3 py-2.5 first:pt-0 last:pb-0">
                    <CheckCircle2 className={`w-4 h-4 ${p.checkIcon} mt-0.5 flex-shrink-0`} />
                    <div>
                      <p className={`text-sm font-medium ${p.textPrimary}`}>{service.title}</p>
                      {service.description && (
                        <p className={`text-xs ${p.serviceDesc} mt-0.5`}>{service.description}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SOSYAL MEDYA */}
          {member.social_links && member.social_links.length > 0 && (
            <div className={`${p.cardBg} ${p.cardBorder} rounded-2xl shadow-md border p-5`}>
              <h2 className={`text-xs font-bold ${p.textMuted} uppercase tracking-widest mb-3`}>
                Sosyal Medya
              </h2>
              <div className="flex gap-3 justify-center flex-wrap">
                {member.social_links.map((link, i) => (
                  <a
                    key={i}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center gap-2 px-4 py-2 ${p.socialBg} rounded-full ${p.socialBorder} border transition-colors text-sm font-semibold ${p.btnText}`}
                    aria-label={link.platform}
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span className="capitalize">{link.platform}</span>
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* FOOTER */}
          <div className={`text-center text-xs ${p.footerText} pb-6 space-y-2`}>
            {s?.site_name && (
              <p>
                Bu dijital kartvizit{' '}
                <span className="font-medium">{s.site_name}</span>{' '}
                tarafından oluşturulmuştur.
              </p>
            )}
            <div className="flex gap-4 justify-center">
              <a href="/gizlilik-politikasi" className={`underline ${p.footerLink}`}>
                Gizlilik Politikası
              </a>
              <a href="/kullanim-kosullari" className={`underline ${p.footerLink}`}>
                Kullanım Koşulları
              </a>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

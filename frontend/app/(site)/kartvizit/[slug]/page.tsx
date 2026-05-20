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

  return (
    <div className="relative min-h-screen bg-slate-100">
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
        <div className="max-w-sm mx-auto space-y-4">

          {/* HEADER */}
          <div className="bg-white rounded-2xl p-5 shadow-sm text-center space-y-3">
            {photoId ? (
              <div className="flex justify-center">
                <DirectusImage
                  fileId={photoId}
                  alt={member.name_Required ?? ''}
                  width={96}
                  height={96}
                  className="rounded-full object-cover w-24 h-24"
                  priority
                />
              </div>
            ) : (
              <div className="flex justify-center">
                <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-semibold text-2xl">
                  {member.name_Required?.slice(0, 2).toUpperCase() ?? '??'}
                </div>
              </div>
            )}
            <div>
              <h1 className="text-2xl font-bold">{member.name_Required}</h1>
              {member.job_title && (
                <p className="text-sm text-muted-foreground">{member.job_title}</p>
              )}
              {s?.site_name && (
                <p className="text-sm font-medium text-primary mt-1">{s.site_name}</p>
              )}
            </div>
          </div>

          {/* HIZLI EYLEM BUTONLARI */}
          {(member.phone || member.whatsapp || member.email || member.maps_url) && (
            <div className="bg-white rounded-2xl p-5 shadow-sm grid grid-cols-2 gap-3">
              {member.phone && (
                <a
                  href={`tel:${member.phone}`}
                  className="flex flex-col items-center gap-2 p-3 rounded-xl border hover:bg-primary/5 transition-colors"
                >
                  <Phone className="w-5 h-5 text-primary" />
                  <span className="text-xs font-medium">Ara</span>
                </a>
              )}
              {member.whatsapp && (
                <a
                  href={`https://wa.me/${member.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center gap-2 p-3 rounded-xl border hover:bg-primary/5 transition-colors"
                >
                  <MessageCircle className="w-5 h-5 text-primary" />
                  <span className="text-xs font-medium">WhatsApp</span>
                </a>
              )}
              {member.email && (
                <a
                  href={`mailto:${member.email}`}
                  className="flex flex-col items-center gap-2 p-3 rounded-xl border hover:bg-primary/5 transition-colors"
                >
                  <Mail className="w-5 h-5 text-primary" />
                  <span className="text-xs font-medium">E-posta</span>
                </a>
              )}
              {member.maps_url && (
                <a
                  href={member.maps_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center gap-2 p-3 rounded-xl border hover:bg-primary/5 transition-colors"
                >
                  <MapPin className="w-5 h-5 text-primary" />
                  <span className="text-xs font-medium">Yol Tarifi</span>
                </a>
              )}
            </div>
          )}

          {/* HAKKIMIZDA */}
          {member.company_description && (
            <div className="bg-white rounded-2xl p-5 shadow-sm">
              <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                Hakkımızda
              </h2>
              <p className="text-sm leading-relaxed">{member.company_description}</p>
            </div>
          )}

          {/* HİZMETLER */}
          {member.services_list && member.services_list.length > 0 && (
            <div className="bg-white rounded-2xl p-5 shadow-sm space-y-3">
              <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Hizmetler
              </h2>
              {member.services_list.map((service, i) => (
                <div key={i} className="flex gap-3 border-l-2 border-primary pl-3">
                  <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium">{service.title}</p>
                    {service.description && (
                      <p className="text-xs text-muted-foreground">{service.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* SOSYAL MEDYA */}
          {member.social_links && member.social_links.length > 0 && (
            <div className="bg-white rounded-2xl p-5 shadow-sm">
              <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                Sosyal Medya
              </h2>
              <div className="flex gap-3 justify-center flex-wrap">
                {member.social_links.map((link, i) => (
                  <a
                    key={i}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3 py-2 rounded-full border hover:bg-primary/5 transition-colors text-sm font-medium"
                    aria-label={link.platform}
                  >
                    <ExternalLink className="w-4 h-4 text-primary" />
                    <span className="capitalize">{link.platform}</span>
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* FOOTER */}
          <div className="text-center text-xs text-muted-foreground pb-6 space-y-2">
            {s?.site_name && (
              <p>
                Bu dijital kartvizit{' '}
                <span className="font-medium">{s.site_name}</span>{' '}
                tarafından oluşturulmuştur.
              </p>
            )}
            <div className="flex gap-4 justify-center">
              <a href="/gizlilik-politikasi" className="underline hover:text-foreground">
                Gizlilik Politikası
              </a>
              <a href="/kullanim-kosullari" className="underline hover:text-foreground">
                Kullanım Koşulları
              </a>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

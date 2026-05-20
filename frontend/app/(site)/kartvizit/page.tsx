import { getItems, getSiteSettings } from '@/lib/directus'
import type { SiteSettings, TeamMemberItem } from '@/types/directus'
import Link from 'next/link'
import DirectusImage from '@/components/common/DirectusImage'

export const revalidate = 60

export async function generateMetadata() {
  const settings = (await getSiteSettings().catch(() => null)) as SiteSettings | null
  return {
    title: `Ekibimiz | ${settings?.site_name ?? ''}`,
    description: settings?.site_description ?? '',
  }
}

export default async function KartvizitListePage() {
  const [members, settings] = await Promise.all([
    getItems<TeamMemberItem>('team_members_', {
      filter: { status: { _eq: 'active' } },
      sort: ['sort'],
    }).catch(() => [] as TeamMemberItem[]),
    getSiteSettings().catch(() => null),
  ])

  const s = settings as SiteSettings | null
  const filteredMembers = members.filter((m) => m.slug)

  return (
    <main className="min-h-screen bg-gray-50 py-16 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold mb-2">{s?.site_name}</h1>
          <p className="text-muted-foreground">Ekibimiz</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filteredMembers.map((member) => (
            <Link
              key={member.id}
              href={`/kartvizit/${member.slug}`}
              className="bg-white rounded-2xl p-6 border hover:shadow-md transition-all hover:-translate-y-1 flex items-center gap-4"
            >
              {member.photo ? (
                <DirectusImage
                  fileId={typeof member.photo === 'string' ? member.photo : null}
                  alt={member.name_Required ?? ''}
                  width={56}
                  height={56}
                  className="rounded-full object-cover w-14 h-14 flex-shrink-0"
                />
              ) : (
                <div className="w-14 h-14 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-semibold text-lg flex-shrink-0">
                  {member.name_Required?.slice(0, 2).toUpperCase() ?? '??'}
                </div>
              )}
              <div className="min-w-0">
                <p className="font-semibold truncate">{member.name_Required}</p>
                <p className="text-sm text-muted-foreground truncate">{member.job_title}</p>
                <p className="text-xs text-primary mt-1">Kartviziti Gör →</p>
              </div>
            </Link>
          ))}
        </div>

        {filteredMembers.length === 0 && (
          <p className="text-center text-muted-foreground mt-8">Henüz kartvizit eklenmemiş.</p>
        )}
      </div>
    </main>
  )
}

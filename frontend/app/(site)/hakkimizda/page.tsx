import Image from 'next/image';
import { getSiteSettings, getTeamMembers, getAssetUrl } from '@/lib/directus';
import type { SiteSettings, TeamMember } from '@/types/directus';

export const revalidate = 600;

export const metadata = {
  title: 'Hakkımızda',
};

export default async function HakkimizdaPage() {
  const [settings, members] = await Promise.all([
    getSiteSettings().catch(() => null),
    getTeamMembers().catch(() => []),
  ]);

  const s = settings as SiteSettings | null;
  const team = members as TeamMember[];

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-4xl font-bold text-gray-900 mb-6">Hakkımızda</h1>
      {s?.site_description && (
        <p className="text-xl text-gray-600 max-w-3xl leading-relaxed mb-16">
          {s.site_description}
        </p>
      )}
      {team.length > 0 && (
        <>
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Ekibimiz</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {team.map((m) => (
              <div key={m.id} className="text-center">
                <div className="w-24 h-24 rounded-full overflow-hidden mx-auto mb-4 bg-gray-200">
                  {m.photo ? (
                    <Image
                      src={getAssetUrl(m.photo)}
                      alt={m.name}
                      width={96}
                      height={96}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-2xl">👤</div>
                  )}
                </div>
                <p className="font-semibold text-gray-900">{m.name}</p>
                {m.job_title && <p className="text-sm text-gray-500">{m.job_title}</p>}
              </div>
            ))}
          </div>
        </>
      )}
    </main>
  );
}

import Image from 'next/image';
import type { TeamMember } from '@/types/directus';
import { getAssetUrl } from '@/lib/directus';

function TeamCard({ member }: { member: TeamMember }) {
  return (
    <div className="text-center">
      <div className="w-24 h-24 rounded-full overflow-hidden mx-auto mb-4 bg-gray-200">
        {member.photo ? (
          <Image
            src={getAssetUrl(member.photo)}
            alt={member.name}
            width={96}
            height={96}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-2xl text-gray-400">
            👤
          </div>
        )}
      </div>
      <h3 className="font-semibold text-gray-900">{member.name}</h3>
      {member.job_title && (
        <p className="text-sm text-gray-500">{member.job_title}</p>
      )}
    </div>
  );
}

export default function TeamSection({ members }: { members: TeamMember[] }) {
  if (!members.length) return null;

  return (
    <section className="py-20 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Ekibimiz
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {members.map((m) => (
            <TeamCard key={m.id} member={m} />
          ))}
        </div>
      </div>
    </section>
  );
}

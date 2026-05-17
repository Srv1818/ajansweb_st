import Image from 'next/image';
import type { TeamMember } from '@/types/directus';
import { getAssetUrl } from '@/lib/directus';

export default function TeamCard({ member }: { member: TeamMember }) {
  return (
    <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-white border border-slate-200 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
      <div className="w-20 h-20 rounded-full overflow-hidden mb-4 ring-4 ring-slate-100">
        {member.photo ? (
          <Image
            src={getAssetUrl(member.photo)}
            alt={member.name}
            width={80}
            height={80}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white font-bold text-xl">
            {member.name.charAt(0)}
          </div>
        )}
      </div>
      <h3 className="font-semibold text-slate-900">{member.name}</h3>
      {member.job_title && (
        <p className="text-sm text-slate-500 mt-0.5">{member.job_title}</p>
      )}
    </div>
  );
}

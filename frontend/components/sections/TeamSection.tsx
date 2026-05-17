import type { TeamMember } from '@/types/directus';
import TeamCard from '@/components/common/TeamCard';
import SectionHeader from '@/components/common/SectionHeader';

export default function TeamSection({ members }: { members: TeamMember[] }) {
  if (!members.length) return null;

  return (
    <section className="py-24 px-4 bg-slate-50">
      <div className="max-w-7xl mx-auto">
        <SectionHeader
          title="Ekibimiz"
          subtitle="Deneyimli ve tutkulu ekibimizle işletmeniz için en iyi sonuçları elde ediyoruz."
        />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {members.map((member) => (
            <TeamCard key={member.id} member={member} />
          ))}
        </div>
      </div>
    </section>
  );
}

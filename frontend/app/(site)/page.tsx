import { getPage, getServices, getTeamMembers, getPosts, getSiteSettings } from '@/lib/directus';
import type { Page, Service, TeamMember, Post, SiteSettings } from '@/types/directus';
import HeroSection from '@/components/sections/HeroSection';
import ServicesSection from '@/components/sections/ServicesSection';
import AboutSection from '@/components/sections/AboutSection';
import TeamSection from '@/components/sections/TeamSection';
import BlogSection from '@/components/sections/BlogSection';
import ContactForm from '@/components/sections/ContactForm';

export const revalidate = 60;

export default async function HomePage() {
  const [homePage, services, teamMembers, posts, settings] = await Promise.all([
    getPage('home').catch(() => null),
    getServices().catch(() => []),
    getTeamMembers().catch(() => []),
    getPosts(1, 3).catch(() => []),
    getSiteSettings().catch(() => null),
  ]);

  return (
    <main>
      <HeroSection page={homePage as Page | null} />
      <ServicesSection services={services as Service[]} />
      <AboutSection settings={settings as SiteSettings | null} />
      <TeamSection members={teamMembers as TeamMember[]} />
      <BlogSection posts={posts as Post[]} />
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-10">İletişim</h2>
          <ContactForm />
        </div>
      </section>
    </main>
  );
}

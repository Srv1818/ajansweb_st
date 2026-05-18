import { getPage, getServices, getTeamMembers, getPosts, getSiteSettings } from '@/lib/directus';
import type { Page, Service, TeamMember, Post, SiteSettings } from '@/types/directus';
import HeroSection from '@/components/sections/HeroSection';
import ServicesSection from '@/components/sections/ServicesSection';
import AboutSection from '@/components/sections/AboutSection';
import TeamSection from '@/components/sections/TeamSection';
import BlogSection from '@/components/sections/BlogSection';
import ContactForm from '@/components/sections/ContactForm';
import SectionHeader from '@/components/common/SectionHeader';

export const revalidate = 60;

export default async function HomePage() {
  const results = await Promise.allSettled([
    getPage('home'),
    getServices(),
    getTeamMembers(),
    getPosts(1, 3),
    getSiteSettings(),
  ]);

  const [pageResult, servicesResult, teamResult, postsResult, settingsResult] = results;

  // DEBUG — Directus bağlantı durumu terminale yazdır
  console.log('\n=== Directus Debug ===');
  console.log('DIRECTUS_URL:', process.env.DIRECTUS_INTERNAL_URL ?? process.env.NEXT_PUBLIC_DIRECTUS_URL);
  console.log('TOKEN set:', !!process.env.DIRECTUS_TOKEN);
  if (pageResult.status === 'fulfilled') {
    console.log('pages[home]:', JSON.stringify(pageResult.value, null, 2));
  } else {
    console.error('pages[home] ERROR:', pageResult.reason?.message ?? pageResult.reason);
  }
  if (servicesResult.status === 'fulfilled') {
    console.log('services count:', (servicesResult.value as any[]).length);
  } else {
    console.error('services ERROR:', servicesResult.reason?.message ?? servicesResult.reason);
  }
  if (settingsResult.status === 'fulfilled') {
    console.log('site_settings:', JSON.stringify(settingsResult.value, null, 2));
  } else {
    console.error('site_settings ERROR:', settingsResult.reason?.message ?? settingsResult.reason);
  }
  console.log('=== /Directus Debug ===\n');

  const homePage = pageResult.status === 'fulfilled' ? pageResult.value : null;
  const services = servicesResult.status === 'fulfilled' ? servicesResult.value : [];
  const teamMembers = teamResult.status === 'fulfilled' ? teamResult.value : [];
  const posts = postsResult.status === 'fulfilled' ? postsResult.value : [];
  const settings = settingsResult.status === 'fulfilled' ? settingsResult.value : null;

  return (
    <main>
      <HeroSection page={homePage as Page | null} />
      <ServicesSection services={services as Service[]} />
      <AboutSection settings={settings as SiteSettings | null} />
      <TeamSection members={teamMembers as TeamMember[]} />
      <BlogSection posts={posts as Post[]} />

      <section className="py-24 px-4 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <SectionHeader
            title="İletişim"
            subtitle="Projeniz için ücretsiz danışmanlık alın."
          />
          <ContactForm />
        </div>
      </section>
    </main>
  );
}

import { getPage, getServices, getTeamMembers, getPosts, getSiteSettings, getTestimonials } from '@/lib/directus';
import type { Page, Service, TeamMember, Post, SiteSettings, Testimonial } from '@/types/directus';
import { organizationSchema } from '@/lib/structured-data';
import HeroSection from '@/components/sections/HeroSection';
import ServicesSection from '@/components/sections/ServicesSection';
import AboutSection from '@/components/sections/AboutSection';
import TeamSection from '@/components/sections/TeamSection';
import BlogSection from '@/components/sections/BlogSection';
import TestimonialsSection from '@/components/sections/TestimonialsSection';
import ContactForm from '@/components/sections/ContactForm';
import SectionHeader from '@/components/common/SectionHeader';

export const revalidate = 60;

export default async function HomePage() {
  const [homePage, services, teamMembers, posts, settings, testimonials] = await Promise.all([
    getPage('home').catch(() => null),
    getServices().catch(() => []),
    getTeamMembers().catch(() => []),
    getPosts(1, 3).catch(() => []),
    getSiteSettings().catch(() => null),
    getTestimonials().catch(() => []),
  ]);

  const typedSettings = settings as SiteSettings | null;
  const safeJson = typedSettings
    ? JSON.stringify(organizationSchema(typedSettings))
        .replace(/</g, '\\u003c')
        .replace(/>/g, '\\u003e')
        .replace(/&/g, '\\u0026')
    : null

  return (
    <main>
      {safeJson && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: safeJson }}
        />
      )}
      <HeroSection page={homePage as Page | null} settings={typedSettings} />
      <ServicesSection services={services as Service[]} />
      <AboutSection settings={typedSettings} />
      <TeamSection members={teamMembers as TeamMember[]} />
      <TestimonialsSection testimonials={testimonials as Testimonial[]} />
      <BlogSection posts={posts as Post[]} />

      <section className="py-24 px-4 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <SectionHeader
            title="İletişim"
            subtitle="Projeniz için ücretsiz danışmanlık alın."
          />
          <ContactForm settings={typedSettings} />
        </div>
      </section>
    </main>
  );
}

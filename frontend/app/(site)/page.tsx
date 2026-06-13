import type { Page, Service, SiteSettings, Testimonial } from '@/types/directus';
import HeroSection from '@/components/sections/HeroSection';
import ServicesSection from '@/components/sections/ServicesSection';
import AboutSection from '@/components/sections/AboutSection';
import TeamSection from '@/components/sections/TeamSection';
import BlogSection from '@/components/sections/BlogSection';
import TestimonialsSection from '@/components/sections/TestimonialsSection';
import ContactForm from '@/components/sections/ContactForm';
import SectionHeader from '@/components/common/SectionHeader';

const homePage: Page = {
  id: '1',
  slug: 'home',
  status: 'published',
  title: 'Ana Sayfa',
  hero_heading: 'Dijital\nDönüşümün Adresi',
  hero_subheading:
    'Web tasarım, SEO, sosyal medya yönetimi ve dijital pazarlama çözümleriyle markanızı büyütüyoruz.',
  hero_cta_text: 'Ücretsiz Danışmanlık Al',
  hero_cta_link: '#iletisim',
  hero_background_image: null,
  seo_title: 'Dijital Ajans | Web Tasarım & Dijital Pazarlama',
  seo_description: 'Web tasarım, SEO ve dijital pazarlama hizmetleri.',
};

const settings: SiteSettings = {
  id: '1',
  site_name: 'Dijital Ajans',
  site_description:
    "2016'dan bu yana 150'den fazla projeye imza attık. Web tasarım, SEO, sosyal medya ve dijital pazarlama alanlarında kapsamlı çözümler sunuyoruz.",
  logo: null,
  favicon: null,
  contact_email: 'info@dijitalajans.com',
  phone: '+90 212 000 00 00',
  address: 'İstanbul, Türkiye',
  footer_text: '© 2024 Dijital Ajans. Tüm hakları saklıdır.',
  social_links: [],
  primary_color: '#6366f1',
  stat_1_value: '150+',
  stat_1_label: 'Proje',
  stat_2_value: '%98',
  stat_2_label: 'Memnuniyet',
  stat_3_value: '7+',
  stat_3_label: 'Yıl',
  stat_4_value: '50+',
  stat_4_label: 'Müşteri',
};

const services: Service[] = [
  { id: '1', slug: 'web-tasarim', status: 'published', title: 'Web Tasarım', icon: 'monitor', short_description: 'Markanızı yansıtan, kullanıcı dostu ve mobil uyumlu web siteleri tasarlıyoruz.', content: '', featured_image: null, sort: 1, seo_title: '', seo_description: '' },
  { id: '2', slug: 'seo', status: 'published', title: 'SEO', icon: 'search', short_description: 'Arama motorlarında üst sıralara çıkarak organik trafiğinizi artırıyoruz.', content: '', featured_image: null, sort: 2, seo_title: '', seo_description: '' },
  { id: '3', slug: 'sosyal-medya', status: 'published', title: 'Sosyal Medya Yönetimi', icon: 'share-2', short_description: 'Sosyal medya hesaplarınızı profesyonelce yönetiyor, etkileşimi artırıyoruz.', content: '', featured_image: null, sort: 3, seo_title: '', seo_description: '' },
  { id: '4', slug: 'dijital-pazarlama', status: 'published', title: 'Dijital Pazarlama', icon: 'trending-up', short_description: 'Hedef kitlenize ulaşmak için etkili kampanyalar oluşturuyoruz.', content: '', featured_image: null, sort: 4, seo_title: '', seo_description: '' },
  { id: '5', slug: 'e-ticaret', status: 'published', title: 'E-Ticaret', icon: 'shopping-cart', short_description: 'Online satış kanallarınızı güçlendiriyor, gelirlerinizi artırıyoruz.', content: '', featured_image: null, sort: 5, seo_title: '', seo_description: '' },
  { id: '6', slug: 'grafik-tasarim', status: 'published', title: 'Grafik Tasarım', icon: 'pen-tool', short_description: 'Markanız için görsel kimlik ve tasarım çözümleri üretiyoruz.', content: '', featured_image: null, sort: 6, seo_title: '', seo_description: '' },
];

const testimonials: Testimonial[] = [
  { id: '1', name: 'Ahmet Yılmaz', title: 'CEO, TechStart', comment: 'Web sitemiz yenilendikten sonra dönüşüm oranlarımız %40 arttı. Harika bir ekip!', rating: 5, sort: 1, status: 'published' },
  { id: '2', name: 'Ayşe Kaya', title: 'Kurucu, ModaShop', comment: "SEO çalışmaları sayesinde 3 ay içinde Google'da ilk sayfaya çıktık. Teşekkürler!", rating: 5, sort: 2, status: 'published' },
  { id: '3', name: 'Mehmet Demir', title: 'Pazarlama Müdürü', comment: 'Sosyal medya yönetimi gerçekten mükemmel. Takipçi sayımız 3 katına çıktı.', rating: 5, sort: 3, status: 'published' },
];

export default function HomePage() {
  return (
    <main>
      <HeroSection page={homePage} settings={settings} />
      <ServicesSection services={services} />
      <AboutSection settings={settings} />
      <TeamSection members={[]} />
      <TestimonialsSection testimonials={testimonials} />
      <BlogSection posts={[]} />

      <section id="iletisim" className="py-24 px-4 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <SectionHeader
            title="İletişim"
            subtitle="Projeniz için ücretsiz danışmanlık alın."
          />
          <ContactForm settings={settings} />
        </div>
      </section>
    </main>
  );
}

export interface SocialLink {
  platform: 'instagram' | 'linkedin' | 'twitter' | 'facebook' | 'youtube';
  url: string;
}

export interface SiteSettings {
  id: string;
  site_name: string;
  site_description: string;
  logo: string | null;
  favicon: string | null;
  contact_email: string;
  phone: string;
  address: string;
  footer_text: string;
  social_links: SocialLink[];
  primary_color: string;
}

export interface Page {
  id: string;
  slug: string;
  title: string;
  hero_heading: string;
  hero_subheading: string;
  hero_cta_text: string;
  hero_cta_link: string;
  hero_background_image: string | null;
  seo_title: string;
  seo_description: string;
  status: 'published' | 'draft';
}

export interface Post {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  featured_image: string | null;
  tags: string[];
  date_created: string;
  author: string;
  status: 'published' | 'draft';
}

export interface Service {
  id: string;
  slug: string;
  title: string;
  short_description: string;
  content: string;
  icon: string;
  featured_image: string | null;
  sort: number;
  seo_title: string;
  seo_description: string;
  status: 'published' | 'draft';
}

export interface TeamMember {
  id: string;
  name: string;
  job_title: string;
  bio: string;
  photo: string | null;
  email: string;
  sort: number;
  is_active: boolean;
  status: 'published' | 'draft';
}

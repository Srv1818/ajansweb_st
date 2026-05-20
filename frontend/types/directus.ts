export interface DirectusFile {
  id: string;
  filename_download: string;
  width?: number;
  height?: number;
  type: string;
}

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
  stat_1_value?: string;
  stat_1_label?: string;
  stat_2_value?: string;
  stat_2_label?: string;
  stat_3_value?: string;
  stat_3_label?: string;
  stat_4_value?: string;
  stat_4_label?: string;
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
  content?: string;
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

export interface TeamMemberItem extends TeamMember {
  name_Required?: string;
  slug?: string;
  phone?: string;
  whatsapp?: string;
  address?: string;
  maps_url?: string;
  services_list?: Array<{ title: string; description?: string }>;
  social_links?: Array<{ platform: string; url: string }>;
  company_description?: string;
  card_theme?: 'default' | 'dark' | 'minimal';
  cover_image?: string | DirectusFile;
}

export interface Testimonial {
  id: string;
  name: string;
  title: string;
  comment: string;
  rating: number;
  sort: number;
  status: 'published' | 'draft';
}

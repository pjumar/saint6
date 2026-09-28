export type StylingLocale = "en" | "vi";
export interface StylingImage {
  url: string;
  width: number;
  height: number;
  alternativeText: string;
}
export interface StylingBlock {
  title: string;
  text: string;
}
export interface StylingHeroPanel {
  image: StylingImage;
  alt: string;
}
export interface StylingClient {
  name: string;
  logo: StylingImage;
  source_url: string;
}
export interface StylingPage {
  hero_heading: string;
  hero_image: StylingImage;
  hero_alt?: string;
  hero_panels?: StylingHeroPanel[];
  hero_mobile_image?: StylingImage | null;
  clients_title?: string;
  clients?: StylingClient[];
  intro_label: string;
  intro_title: string;
  intro_text: string;
  services_title: string;
  services: StylingBlock[];
  portfolio_label: string;
  portfolio_title: string;
  portfolio_note: string;
  founder_label: string;
  founder_title: string;
  founder_text: string;
  process_title: string;
  process: StylingBlock[];
  faq_title: string;
  faqs: StylingBlock[];
  contact_title: string;
  contact_text: string;
  seo_title: string;
  seo_description: string;
}
export interface StylingProject {
  slug: string;
  title: string;
  category: string;
  category_key?: string;
  featured?: boolean;
  summary: string;
  body: string;
  cover: StylingImage;
  cover_alt?: string;
  gallery: { image: StylingImage; alt: string }[];
  credits: { role: string; name: string }[];
  source_url: string;
  video_url?: string | null;
  sort_order: number;
  seo_title: string;
  seo_description: string;
  updatedAt?: string;
}
export interface StylingContent {
  page: StylingPage;
  projects: StylingProject[];
}

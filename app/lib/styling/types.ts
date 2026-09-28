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
  logo_view_box?: string;
  display_width?: number;
}
export interface StylingPage {
  social_image?: StylingImage | null;
  social_image_alt?: string;
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
  founder_image?: StylingImage | null;
  process_title: string;
  process: StylingBlock[];
  faq_title: string;
  faqs: StylingBlock[];
  seo_title: string;
  seo_description: string;
}
export interface StylingProject {
  social_image?: StylingImage | null;
  social_image_alt?: string;
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
  source_url?: string;
  video_url?: string | null;
  sort_order: number;
  seo_title: string;
  seo_description: string;
  updatedAt?: string;
}
export interface SharedContactContent {
  heading: string;
  text: string;
  image: StylingImage;
  image_alt: string;
  form_title: string;
  form_subtitle: string;
}
export interface StylingContent {
  page: StylingPage;
  projects: StylingProject[];
}

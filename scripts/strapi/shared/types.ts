/**
 * Strapi TypeScript Types
 *
 * Shared type definitions for all Strapi scripts.
 */

// ============================================================================
// Collection Types
// ============================================================================

export interface BrandLogo {
  name: string;
  logo: string;
  order: number;
}

export interface StudioRoom {
  title: string;
  title_vi: string;
  slug: string;
  type: "blank" | "concept";
  price_per_hour: string;
  counter: string;
  space: string;
  width: string;
  ceiling_height: string;
  description: string;
  description_vi: string;
  image: string;
  gallery: string[];
  order: number;
}

export interface EquipmentItem {
  name: string;
  name_vi: string;
  spec: string;
  image: string;
  order: number;
}

export interface FaqItem {
  question: string;
  question_vi: string;
  answer: string;
  answer_vi: string;
  category: string;
  order: number;
}

export interface PortfolioItem {
  title: string;
  category: string;
  category_vi: string;
  image: string;
  size: "large" | "short" | "tall";
  page: "creative" | "set-design" | "decor";
  order: number;
}

export interface TestimonialItem {
  brand_name: string;
  brand_logo: string;
  quote_en: string;
  quote_vi: string;
  author_name: string;
  author_title_en: string;
  author_title_vi: string;
  order: number;
}

export interface ServiceItem {
  title: string;
  title_vi: string;
  description: string;
  description_vi: string;
  image?: string;
  page: string;
  section: "services" | "workflow";
  order: number;
}

export interface TeamMember {
  role: string;
  name: string;
}

export interface ProjectTestimonial {
  quote: string;
  author: string;
  role: string;
}

export interface GalleryImage {
  image: string;
  alt: string;
}

export interface KeyProject {
  title: string;
  title_vi: string;
  slug: string;
  client: string;
  info_text: string;
  info_text_vi: string;
  expertise: string[];
  expertise_vi: string[];
  team: TeamMember[];
  team_vi: TeamMember[];
  testimonial: ProjectTestimonial;
  testimonial_vi: ProjectTestimonial;
  main_image: string;
  gallery_images: GalleryImage[];
  is_featured: boolean;
}

// ============================================================================
// Page Component Types
// ============================================================================

export interface HeroSection {
  heading: string;
  background_image: number | null;
  background_alt: string;
}

export interface IntroSection {
  label: string;
  description: string;
  cta_text?: string;
  cta_link?: string;
}

export interface StatItem {
  label: string;
  value: string;
}

export interface SpaceSection {
  caption: string;
  description: string;
  cta_text: string;
  cta_link: string;
  stats: StatItem[];
  gallery_images: (number | null)[];
}

export interface CrewArea {
  caption: string;
  heading: string;
  info_label: string;
  info_text: string;
  main_image: number | null;
  secondary_image_1: number | null;
  secondary_image_2: number | null;
}

export interface ValueItem {
  letter: string;
  title: string;
  description: string;
}

export interface TimelineItem {
  year: string;
  image: number | null;
  description: string;
}

// ============================================================================
// API Response Types
// ============================================================================

export interface StrapiEntry {
  id: number;
  documentId: string;
}

export interface StrapiResponse<T> {
  data: T;
  meta?: unknown;
}

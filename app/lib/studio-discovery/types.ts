import type { StrapiImage } from "@/app/lib/strapi";

export interface DiscoveryPage {
  path: string;
  seo_title: string;
  seo_description: string;
  heading?: string;
  introduction?: string;
}

export interface StudioDiscovery {
  pages: DiscoveryPage[];
  navigation_links: { label: string; target: string }[];
  navigation_label: string;
  floorplan: {
    label: string;
    heading: string;
    description: string;
    image: StrapiImage;
    image_alt: string;
    enlarge_label: string;
  };
  room_summaries: {
    area_sqm: number;
    room_type: string;
    description: string;
  }[];
  room_inclusions: string;
  currency: string;
  stats_labels: {
    total_rooms: string;
    ceiling_height: string;
    total_space: string;
    blank_rooms: string;
    concept_rooms: string;
  };
  spec_labels: {
    area: string;
    width: string;
    ceiling_height: string;
    dimensions: string;
    inclusions: string;
  };
  workshops: {
    label: string;
    heading: string;
    description: string;
    facilities: string;
    brief: string;
    cta_label: string;
  };
  full_rental_title: string;
  full_rental_description: string;
}

// ============================================================================
// Strapi CMS Configuration
// ============================================================================
// This module fetches data from Strapi CMS using Incremental Static Regeneration (ISR).
// - Data is fetched at BUILD TIME and baked into static HTML
// - Pages are revalidated every 60 seconds (configurable per endpoint)
// - No runtime CMS dependency for serving pages
// - Set revalidate: false for pure static generation (no automatic updates)

const STRAPI_URL =
  process.env.NEXT_PUBLIC_STRAPI_URL ||
  "https://attractive-confidence-baa5492cbd.strapiapp.com";
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN;

interface StrapiResponse<T> {
  data: T;
  meta?: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

// ============================================================================
// Base Types
// ============================================================================

export interface StrapiImage {
  id: number;
  url: string;
  alternativeText?: string;
  width?: number;
  height?: number;
  formats?: {
    thumbnail?: { url: string };
    small?: { url: string };
    medium?: { url: string };
    large?: { url: string };
  };
}

// ============================================================================
// Shared Components
// ============================================================================

export interface StrapiHero {
  heading: string;
  background_image: StrapiImage;
  background_alt?: string;
}

export interface StrapiIntro {
  label?: string;
  description: string;
  cta_text?: string;
  cta_link?: string;
}

export interface StrapiService {
  image: StrapiImage;
  counter?: string;
  title: string;
  description: string;
}

export interface StrapiClientsSection {
  label?: string;
  description?: string;
}

export interface StrapiStat {
  label: string;
  value: string;
}

export interface StrapiGalleryImage {
  image: StrapiImage;
  alt?: string;
}

// ============================================================================
// Collections
// ============================================================================

export interface StrapiBrandLogo {
  id: number;
  name: string;
  logo: StrapiImage;
  order: number;
}

export interface StrapiKeyProject {
  id: number;
  title: string;
  slug: string;
  project_number: string;
  client: string;
  info_text?: string;
  expertise?: string[];
  team?: { role: string; name: string }[];
  main_image: StrapiImage;
  gallery_images?: { image: StrapiImage; alt?: string }[];
  testimonial?: {
    quote: string;
    author: string;
    role: string;
  };
  is_featured: boolean;
}

export interface StrapiStudioRoom {
  id: number;
  title: string;
  slug: string;
  type: "blank" | "concept";
  price_per_hour: string;
  counter?: string;
  space?: string;
  width?: string;
  ceiling_height?: string;
  description?: string;
  image: StrapiImage;
  order: number;
}

export interface StrapiEquipmentItem {
  id: number;
  name: string;
  spec?: string;
  image: StrapiImage;
  order: number;
}

export interface StrapiFaqItem {
  id: number;
  question: string;
  answer: string;
  category?: string;
  order: number;
}

export interface StrapiPortfolioItem {
  id: number;
  title: string;
  category?: string;
  image: StrapiImage;
  size: "large" | "tall" | "short";
  page?: "creative" | "set-design" | "decor";
  order: number;
}

export interface StrapiTestimonialItem {
  id: number;
  brand_name: string;
  brand_logo: StrapiImage;
  quote: string;
  author_name: string;
  author_title: string;
  order: number;
}

export interface StrapiServiceItem {
  id: number;
  title: string;
  description?: string;
  counter?: string;
  image?: StrapiImage;
  page?: "creative" | "production" | "set-design" | "event-planning" | "decor";
  section?: "services" | "workflow";
  order: number;
}

// ============================================================================
// Page Components
// ============================================================================

export interface StrapiSpaceSection {
  caption?: string;
  description: string;
  cta_text?: string;
  cta_link?: string;
  stats?: StrapiStat[];
  gallery_images?: StrapiImage[];
}

export interface StrapiCrewArea {
  caption?: string;
  heading: string;
  info_label?: string;
  info_text?: string;
  main_image: StrapiImage;
  secondary_image_1?: StrapiImage;
  secondary_image_2?: StrapiImage;
}

export interface StrapiStudioStats {
  total_rooms: number;
  ceiling_height: string;
  total_space: string;
  blank_rooms: number;
  concept_rooms: number;
}

export interface StrapiFullRental {
  price: string;
  background_image: StrapiImage;
}

export interface StrapiFacilities {
  makeup_image: StrapiImage;
  lounge_image: StrapiImage;
}

export interface StrapiPortfolioSettings {
  label?: string;
  statement?: string;
}

export interface StrapiAboutIntro {
  label?: string;
  headline: string;
  body_paragraph_1?: string;
  body_paragraph_2?: string;
  image: StrapiImage;
}

export interface StrapiHighlightBand {
  label: string;
  statement: string;
}

export interface StrapiValue {
  letter: string;
  title: string;
  description: string;
}

export interface StrapiStory {
  label?: string;
  paragraph_1?: string;
  paragraph_2?: string;
}

export interface StrapiTimelineItem {
  year: string;
  image: StrapiImage;
  description: string;
}

export interface StrapiFounder {
  image: StrapiImage;
  quote: string;
  name: string;
  title: string;
}

export interface StrapiContactInfo {
  title?: string;
  subheading?: string;
  address_line_1?: string;
  address_line_2?: string;
  email?: string;
  phone?: string;
}

// ============================================================================
// Page Types
// ============================================================================

export interface StrapiHomepage {
  id: number;
  hero?: StrapiHero;
  brand_logos?: StrapiBrandLogo[];
  gallery_images?: StrapiGalleryImage[];
  key_projects?: StrapiKeyProject[];
  space_section?: StrapiSpaceSection;
  crew_area?: StrapiCrewArea;
}

export interface StrapiStudioRentalPage {
  id: number;
  hero?: StrapiHero;
  intro?: StrapiIntro;
  stats?: StrapiStudioStats;
  rooms?: StrapiStudioRoom[];
  concept_rooms?: StrapiStudioRoom[];
  full_rental?: StrapiFullRental;
  facilities?: StrapiFacilities;
  equipment?: StrapiEquipmentItem[];
  faqs?: StrapiFaqItem[];
}

export interface StrapiSetDesignPage {
  id: number;
  hero?: StrapiHero;
  intro?: StrapiIntro;
  workflow?: StrapiServiceItem[];
  portfolio_settings?: StrapiPortfolioSettings;
  portfolio_items?: StrapiPortfolioItem[];
  testimonials?: StrapiTestimonialItem[];
}

export interface StrapiProductionPage {
  id: number;
  hero?: StrapiHero;
  intro?: StrapiIntro;
  services?: StrapiServiceItem[];
  intro_2?: StrapiIntro;
  workflow?: StrapiServiceItem[];
  key_projects?: StrapiKeyProject[];
}

export interface StrapiEventPlanningPage {
  id: number;
  hero?: StrapiHero;
  intro?: StrapiIntro;
  services?: StrapiServiceItem[];
  intro_2?: StrapiIntro;
  workflow?: StrapiServiceItem[];
  event_projects?: StrapiKeyProject[];
}

export interface StrapiDecorPage {
  id: number;
  hero?: StrapiHero;
  intro?: StrapiIntro;
  workflow?: StrapiServiceItem[];
  intro_2?: StrapiIntro;
  portfolio_settings?: StrapiPortfolioSettings;
  portfolio_items?: StrapiPortfolioItem[];
}

export interface StrapiCreativePage {
  id: number;
  hero?: StrapiHero;
  clients?: StrapiClientsSection;
  client_logos?: StrapiBrandLogo[];
  services?: StrapiServiceItem[];
  intro?: StrapiIntro;
  workflow?: StrapiServiceItem[];
  portfolio_settings?: StrapiPortfolioSettings;
  portfolio_items?: StrapiPortfolioItem[];
  testimonials?: StrapiTestimonialItem[];
}

export interface StrapiAboutPage {
  id: number;
  hero?: StrapiHero;
  intro?: StrapiAboutIntro;
  vision?: StrapiHighlightBand;
  full_width_image?: StrapiImage;
  mission?: StrapiHighlightBand;
  values?: StrapiValue[];
  our_story?: StrapiStory;
  timeline?: StrapiTimelineItem[];
  founder?: StrapiFounder;
}

export interface StrapiContactPage {
  id: number;
  hero?: StrapiHero;
  info?: StrapiContactInfo;
  map_image?: StrapiImage;
}

// ============================================================================
// Fetch Utility
// ============================================================================

/**
 * Fetches data from Strapi CMS with Next.js ISR caching.
 *
 * Caching Strategy:
 * - revalidate: 60 (default) - Pages revalidated every 60 seconds (ISR)
 * - revalidate: false - Pure static, never revalidated automatically
 * - revalidate: 0 - No caching, always fetch fresh (not recommended for production)
 *
 * @returns Data from Strapi or null if fetch fails
 */
/**
 * Recursively builds Strapi 5 populate query string parameters.
 * Converts nested populate objects into bracket notation with URL encoding:
 * { hero: { populate: "*" } } → populate%5Bhero%5D%5Bpopulate%5D=*
 * { brand_logos: { populate: ["logo"] } } → populate%5Bbrand_logos%5D%5Bpopulate%5D%5B0%5D=logo
 */
function buildPopulateParams(
  obj: Record<string, unknown>,
  prefix = "populate",
): string[] {
  const params: string[] = [];

  for (const [key, value] of Object.entries(obj)) {
    // URL encode the brackets
    const encodedKey = encodeURIComponent(`[${key}]`);
    const newPrefix = `${prefix}${encodedKey}`;

    if (value && typeof value === "object" && !Array.isArray(value)) {
      // Nested object - recurse
      params.push(
        ...buildPopulateParams(value as Record<string, unknown>, newPrefix),
      );
    } else if (Array.isArray(value)) {
      // Array of values
      value.forEach((item, index) => {
        const encodedIndex = encodeURIComponent(`[${index}]`);
        params.push(`${newPrefix}${encodedIndex}=${encodeURIComponent(String(item))}`);
      });
    } else {
      // Simple value
      params.push(`${newPrefix}=${encodeURIComponent(String(value))}`);
    }
  }

  return params;
}

async function fetchStrapi<T>(
  endpoint: string,
  options: {
    populate?: string | string[] | Record<string, unknown>;
    locale?: string;
    revalidate?: number | false;
  } = {},
): Promise<T | null> {
  const { populate = "*", locale = "en", revalidate = 60 } = options;

  const params = new URLSearchParams();

  if (typeof populate === "string") {
    params.append("populate", populate);
  } else if (Array.isArray(populate)) {
    populate.forEach((field) => params.append("populate", field));
  }

  params.append("locale", locale);

  // Build URL with standard params
  let url = `${STRAPI_URL}/api/${endpoint}?${params.toString()}`;

  // For nested populate objects, append the bracket-notation params
  if (populate && typeof populate === "object" && !Array.isArray(populate)) {
    const populateParams = buildPopulateParams(populate);
    if (populateParams.length > 0) {
      url += `&${populateParams.join("&")}`;
    }
  }

  try {
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        ...(STRAPI_API_TOKEN && {
          Authorization: `Bearer ${STRAPI_API_TOKEN}`,
        }),
      },
      next: { revalidate },
    });

    if (!response.ok) {
      console.error(
        `Strapi fetch error: ${response.status} ${response.statusText}`,
      );
      return null;
    }

    const json: StrapiResponse<T> = await response.json();
    return json.data;
  } catch (error) {
    console.error("Strapi fetch error:", error);
    return null;
  }
}

export function getStrapiImageUrl(image: StrapiImage | undefined): string | null {
  if (!image?.url) return null;

  if (image.url.startsWith("http")) {
    return image.url;
  }

  return `${STRAPI_URL}${image.url}`;
}

// ============================================================================
// Page Fetch Functions
// ============================================================================

// Use "*" for standard Strapi 4 populate (one level deep)
// "deep" requires strapi-plugin-populate-deep which may not be installed
const DEEP_POPULATE = "*";

export async function getHomepage(locale: string = "en") {
  // Strapi 5 deep populate - use "*" to get all nested fields
  // populate: "*" alone only goes one level deep, so we need explicit nested populate
  const populateQuery = {
    hero: { populate: "*" },
    brand_logos: { populate: "*" },
    gallery_images: { populate: "*" },
    key_projects: { populate: "*" },
    space_section: { populate: "*" },
    crew_area: { populate: "*" },
  };

  return fetchStrapi<StrapiHomepage>("homepage", {
    locale,
    populate: populateQuery,
    revalidate: 60,
  });
}

export async function getStudioRentalPage(locale: string = "en") {
  return fetchStrapi<StrapiStudioRentalPage>("studio-rental-page", {
    locale,
    populate: DEEP_POPULATE,
    revalidate: 60,
  });
}

export async function getCreativePage(locale: string = "en") {
  return fetchStrapi<StrapiCreativePage>("creative-page", {
    locale,
    populate: DEEP_POPULATE,
    revalidate: 60,
  });
}

export async function getProductionPage(locale: string = "en") {
  return fetchStrapi<StrapiProductionPage>("production-page", {
    locale,
    populate: DEEP_POPULATE,
    revalidate: 60,
  });
}

export async function getSetDesignPage(locale: string = "en") {
  return fetchStrapi<StrapiSetDesignPage>("set-design-page", {
    locale,
    populate: DEEP_POPULATE,
    revalidate: 60,
  });
}

export async function getEventPlanningPage(locale: string = "en") {
  return fetchStrapi<StrapiEventPlanningPage>("event-planning-page", {
    locale,
    populate: DEEP_POPULATE,
    revalidate: 60,
  });
}

export async function getDecorPage(locale: string = "en") {
  return fetchStrapi<StrapiDecorPage>("decor-page", {
    locale,
    populate: DEEP_POPULATE,
    revalidate: 60,
  });
}

export async function getAboutPage(locale: string = "en") {
  return fetchStrapi<StrapiAboutPage>("about-page", {
    locale,
    populate: DEEP_POPULATE,
    revalidate: 60,
  });
}

export async function getContactPage(locale: string = "en") {
  return fetchStrapi<StrapiContactPage>("contact-page", {
    locale,
    populate: DEEP_POPULATE,
    revalidate: 60,
  });
}

// ============================================================================
// Collection Fetch Functions
// ============================================================================

export async function getBrandLogos() {
  return fetchStrapi<StrapiBrandLogo[]>("brand-logos", {
    populate: ["logo"],
    revalidate: 300,
  });
}

export async function getKeyProjects(locale: string = "en") {
  return fetchStrapi<StrapiKeyProject[]>("key-projects", {
    locale,
    populate: ["main_image", "gallery_images.image", "team", "testimonial"],
    revalidate: 60,
  });
}

export async function getFeaturedProject(locale: string = "en") {
  const projects = await getKeyProjects(locale);
  return projects?.find((p) => p.is_featured) || projects?.[0] || null;
}

export async function getStudioRooms(type?: "blank" | "concept") {
  const rooms = await fetchStrapi<StrapiStudioRoom[]>("studio-rooms", {
    populate: ["image"],
    revalidate: 300,
  });

  if (type && rooms) {
    return rooms.filter((r) => r.type === type);
  }
  return rooms;
}

export async function getEquipmentItems() {
  return fetchStrapi<StrapiEquipmentItem[]>("equipment-items", {
    populate: ["image"],
    revalidate: 300,
  });
}

export async function getFaqItems(category?: string) {
  const items = await fetchStrapi<StrapiFaqItem[]>("faq-items", {
    revalidate: 300,
  });

  if (category && items) {
    return items.filter((i) => i.category === category);
  }
  return items;
}

export async function getPortfolioItems(
  page?: "creative" | "set-design" | "decor",
) {
  const items = await fetchStrapi<StrapiPortfolioItem[]>("portfolio-items", {
    populate: ["image"],
    revalidate: 300,
  });

  if (page && items) {
    return items.filter((i) => i.page === page);
  }
  return items;
}

export async function getTestimonialItems() {
  return fetchStrapi<StrapiTestimonialItem[]>("testimonial-items", {
    populate: ["brand_logo"],
    revalidate: 300,
  });
}

export async function getServiceItems(
  page?: "creative" | "production" | "set-design" | "event-planning" | "decor",
  section?: "services" | "workflow",
) {
  const items = await fetchStrapi<StrapiServiceItem[]>("service-items", {
    populate: ["image"],
    revalidate: 300,
  });

  if (items) {
    let filtered = items;
    if (page) filtered = filtered.filter((i) => i.page === page);
    if (section) filtered = filtered.filter((i) => i.section === section);
    return filtered.sort((a, b) => a.order - b.order);
  }
  return items;
}

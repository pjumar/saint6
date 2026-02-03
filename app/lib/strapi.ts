const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'https://fantastic-attraction-7b2626fe03.strapiapp.com';
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

interface StrapiImage {
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

export interface StrapiHomepage {
  id: number;
  hero_heading: string;
  hero_background_image: StrapiImage;
  hero_background_alt?: string;
  trusted_by_caption?: string;
  trusted_by_heading?: string;
  brand_logos?: StrapiBrandLogo[];
  gallery_images?: StrapiGalleryImage[];
  featured_project?: StrapiKeyProject;
}

export interface StrapiBrandLogo {
  id: number;
  name: string;
  logo: StrapiImage;
  order: number;
}

export interface StrapiGalleryImage {
  id: number;
  image: StrapiImage;
  alt?: string;
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

export interface StrapiSpaceSection {
  id: number;
  caption?: string;
  description: string;
  cta_text?: string;
  cta_link?: string;
  stats?: { label: string; value: string }[];
  gallery_images?: { image: StrapiImage; alt?: string }[];
}

export interface StrapiCrewAreaSection {
  id: number;
  caption?: string;
  heading: string;
  info_label?: string;
  info_text?: string;
  main_image: StrapiImage;
  secondary_image_1?: StrapiImage;
  secondary_image_2?: StrapiImage;
}

async function fetchStrapi<T>(
  endpoint: string,
  options: {
    populate?: string | Record<string, unknown>;
    locale?: string;
    revalidate?: number;
  } = {}
): Promise<T | null> {
  const { populate = '*', locale = 'en', revalidate = 60 } = options;

  const params = new URLSearchParams();

  if (typeof populate === 'string') {
    params.append('populate', populate);
  } else {
    params.append('populate', JSON.stringify(populate));
  }

  params.append('locale', locale);

  const url = `${STRAPI_URL}/api/${endpoint}?${params.toString()}`;

  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...(STRAPI_API_TOKEN && { Authorization: `Bearer ${STRAPI_API_TOKEN}` }),
      },
      next: { revalidate },
    });

    if (!response.ok) {
      console.error(`Strapi fetch error: ${response.status} ${response.statusText}`);
      return null;
    }

    const json: StrapiResponse<T> = await response.json();
    return json.data;
  } catch (error) {
    console.error('Strapi fetch error:', error);
    return null;
  }
}

export function getStrapiImageUrl(image: StrapiImage | undefined): string {
  if (!image?.url) return '';

  // If URL is already absolute, return as-is
  if (image.url.startsWith('http')) {
    return image.url;
  }

  // Otherwise, prepend Strapi URL
  return `${STRAPI_URL}${image.url}`;
}

// Fetch functions with ISR revalidation

export async function getHomepage(locale: string = 'en') {
  return fetchStrapi<StrapiHomepage>('homepage', {
    locale,
    populate: {
      hero_background_image: true,
      brand_logos: { populate: ['logo'] },
      gallery_images: { populate: ['image'] },
      featured_project: {
        populate: ['main_image', 'gallery_images.image', 'team', 'testimonial'],
      },
    },
    revalidate: 60, // Revalidate every 60 seconds
  });
}

export async function getBrandLogos() {
  return fetchStrapi<StrapiBrandLogo[]>('brand-logos', {
    populate: ['logo'],
    revalidate: 300, // Revalidate every 5 minutes
  });
}

export async function getGalleryImages() {
  return fetchStrapi<StrapiGalleryImage[]>('gallery-images', {
    populate: ['image'],
    revalidate: 300,
  });
}

export async function getKeyProjects(locale: string = 'en') {
  return fetchStrapi<StrapiKeyProject[]>('key-projects', {
    locale,
    populate: ['main_image', 'gallery_images.image', 'team', 'testimonial'],
    revalidate: 60,
  });
}

export async function getFeaturedProject(locale: string = 'en') {
  const projects = await fetchStrapi<StrapiKeyProject[]>('key-projects', {
    locale,
    populate: ['main_image', 'gallery_images.image', 'team', 'testimonial'],
    revalidate: 60,
  });

  return projects?.find(p => p.is_featured) || projects?.[0] || null;
}

export async function getSpaceSection(locale: string = 'en') {
  return fetchStrapi<StrapiSpaceSection>('space-section', {
    locale,
    populate: ['stats', 'gallery_images.image'],
    revalidate: 300,
  });
}

export async function getCrewAreaSection(locale: string = 'en') {
  return fetchStrapi<StrapiCrewAreaSection>('crew-area-section', {
    locale,
    populate: ['main_image', 'secondary_image_1', 'secondary_image_2'],
    revalidate: 300,
  });
}

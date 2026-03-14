import {
  CrewAreaSection,
  type CrewAreaSectionProps,
} from "@/app/components/crew-area-section/CrewAreaSection";
import {
  type GalleryImage,
  GallerySection,
} from "@/app/components/gallery-section/GallerySection";
import { HeroSection } from "@/app/components/hero-section/HeroSection";
import { KeyProjectSection } from "@/app/components/key-project-section/KeyProjectSection";
import {
  SpaceSection,
  type SpaceSectionProps,
} from "@/app/components/space-section/SpaceSection";
import {
  type BrandLogo,
  TrustedBySection,
} from "@/app/components/trusted-by-section/TrustedBySection";
import {
  FALLBACK_BRAND_LOGOS,
  FALLBACK_CREW_AREA_DATA,
  FALLBACK_GALLERY_IMAGES,
  FALLBACK_HERO,
  FALLBACK_PROJECT_DATA,
  FALLBACK_SPACE_DATA,
} from "@/app/lib/fallback";
import { buildPageMetadata } from "@/app/lib/seo";
import {
  getHomepage,
  getStrapiImageUrl,
  getStrapiThumbnailUrl,
  type StrapiBrandLogo,
  type StrapiCrewArea,
  type StrapiGalleryImage,
  type StrapiSpaceSection,
} from "@/app/lib/strapi";
import { transformKeyProjects } from "@/app/lib/transformers";
import { getTranslations } from "@/app/lib/translations";
import styles from "@/app/page.module.css";
import type { Locale } from "@/app/types";

// ============================================================================
// SEO Metadata
// ============================================================================

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const data = await getHomepage(locale);
  return buildPageMetadata({
    hero: data?.hero,
    locale: locale as Locale,
    path: "",
  });
}

// ============================================================================
// Transformer Functions - Convert Strapi data to component props
// ============================================================================

function transformBrandLogos(
  logos: StrapiBrandLogo[] | undefined,
): BrandLogo[] {
  if (!logos || logos.length === 0) return [];

  return logos
    .sort((a, b) => a.order - b.order)
    .map((logo) => {
      const src = getStrapiImageUrl(logo.logo);
      if (!src) return null;

      return {
        id: String(logo.id),
        src,
        alt: logo.name,
        width: logo.logo?.width || 150,
        height: logo.logo?.height || 40,
      };
    })
    .filter((logo): logo is BrandLogo => logo !== null);
}

function transformGalleryImages(
  images: StrapiGalleryImage[] | undefined,
): GalleryImage[] {
  if (!images || images.length === 0) return [];

  return images
    .map((img, index) => {
      const src = getStrapiImageUrl(img.image);
      if (!src) return null;
      return {
        id: String(img.image?.id || index),
        src,
        alt: img.alt || `Gallery image ${index + 1}`,
      };
    })
    .filter((img): img is GalleryImage => img !== null);
}

function transformSpaceSection(
  space: StrapiSpaceSection | undefined,
): Omit<SpaceSectionProps, "ctaLink"> | null {
  if (!space) return null;

  return {
    caption: space.caption || "WIDE RANGE OF SPACE",
    description: space.description,
    ctaText: space.cta_text || "VIEW STUDIO RENTAL",
    stats:
      space.stats?.map((stat) => ({
        label: stat.label,
        value: stat.value,
      })) || [],
    galleryImages:
      space.gallery_images
        ?.map((img, index) => {
          const src = getStrapiImageUrl(img);
          if (!src) return null;
          return {
            src,
            alt: img.alternativeText || `Space image ${index + 1}`,
          };
        })
        .filter((img): img is { src: string; alt: string } => img !== null) ||
      [],
  };
}

function transformCrewArea(
  crew: StrapiCrewArea | undefined,
): CrewAreaSectionProps | null {
  if (!crew) return null;

  const mainImageSrc = getStrapiImageUrl(crew.main_image);
  if (!mainImageSrc) return null; // Main image is required

  const secondaryImage1Src = getStrapiImageUrl(crew.secondary_image_1);
  const secondaryImage2Src = getStrapiImageUrl(crew.secondary_image_2);

  return {
    caption: crew.caption || "CREW AREA",
    heading: crew.heading,
    infoLabel: crew.info_label || "INFO",
    infoText: crew.info_text || "",
    mainImage: {
      src: mainImageSrc,
      alt: crew.main_image?.alternativeText || "Crew area main image",
    },
    secondaryImage1: secondaryImage1Src
      ? {
          src: secondaryImage1Src,
          alt: crew.secondary_image_1?.alternativeText || "Crew area image 1",
        }
      : undefined,
    secondaryImage2: secondaryImage2Src
      ? {
          src: secondaryImage2Src,
          alt: crew.secondary_image_2?.alternativeText || "Crew area image 2",
        }
      : undefined,
  };
}

// ============================================================================
// Page Component - Server Component with static generation
// ============================================================================

interface PageProps {
  params: Promise<{ locale: string }>;
}

export function generateStaticParams() {
  return [{ locale: "en" }, { locale: "vi" }];
}

export default async function Home({ params }: PageProps) {
  const { locale } = await params;
  const t = getTranslations(locale);
  const isDev = process.env.NODE_ENV === "development";

  // Fetch CMS data at build time
  const strapiData = await getHomepage(locale);

  // Dev fallback - use hardcoded data when Strapi is unavailable during development
  const useFallback = !strapiData && isDev;
  if (useFallback) {
    console.warn(
      "[Homepage] Using fallback data - Strapi CMS not available in development",
    );
  }

  // Transform Strapi data to component props (or use fallbacks)
  const brandLogos = strapiData?.brand_logos
    ? transformBrandLogos(strapiData.brand_logos)
    : useFallback
      ? FALLBACK_BRAND_LOGOS
      : [];
  const galleryImages = strapiData?.gallery_images
    ? transformGalleryImages(strapiData.gallery_images)
    : useFallback
      ? FALLBACK_GALLERY_IMAGES
      : [];
  const spaceData = strapiData?.space_section
    ? transformSpaceSection(strapiData.space_section)
    : useFallback
      ? FALLBACK_SPACE_DATA
      : null;
  const crewAreaData = strapiData?.crew_area
    ? transformCrewArea(strapiData.crew_area)
    : useFallback
      ? FALLBACK_CREW_AREA_DATA
      : null;
  const keyProjectsData = strapiData?.key_projects
    ? transformKeyProjects(strapiData.key_projects)
    : useFallback
      ? [FALLBACK_PROJECT_DATA]
      : [];

  // Get hero data from CMS or use translations/fallback
  const heroHeading =
    strapiData?.hero?.heading ||
    (useFallback ? FALLBACK_HERO.heading : t.HERO.HEADING);
  const heroBackgroundFromCms = strapiData?.hero?.background_image
    ? getStrapiImageUrl(strapiData.hero.background_image)
    : null;
  const heroBackground = heroBackgroundFromCms || FALLBACK_HERO.backgroundImage;
  const heroBackgroundAlt =
    strapiData?.hero?.background_alt || FALLBACK_HERO.backgroundAlt;
  const heroPlaceholder = getStrapiThumbnailUrl(
    strapiData?.hero?.background_image,
  );

  return (
    <div className={styles.homepage}>
      <HeroSection
        heading={heroHeading}
        backgroundImage={heroBackground}
        backgroundAlt={heroBackgroundAlt}
        placeholderImage={heroPlaceholder}
        showScrollIndicator={true}
        showDecorativeLine={true}
      />
      <div className={styles.contentContainer}>
        <TrustedBySection
          logos={brandLogos.length > 0 ? brandLogos : undefined}
          tagline={strapiData?.trusted_tagline || undefined}
          heading={strapiData?.trusted_heading || undefined}
        />
        <GallerySection
          images={galleryImages.length > 0 ? galleryImages : undefined}
        />
      </div>
      {keyProjectsData.length > 0 && (
        <KeyProjectSection projects={keyProjectsData} />
      )}
      {spaceData && <SpaceSection {...spaceData} ctaLink="/studio-rental" />}
      <div className={styles.contentContainer}>
        {crewAreaData && <CrewAreaSection {...crewAreaData} />}
      </div>
    </div>
  );
}

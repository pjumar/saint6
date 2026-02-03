import {
  CrewAreaSection,
  type CrewAreaSectionProps,
} from "@/app/components/crew-area-section/CrewAreaSection";
import {
  GallerySection,
  type GalleryImage,
} from "@/app/components/gallery-section/GallerySection";
import { HeroSection } from "@/app/components/hero-section/HeroSection";
import {
  type KeyProjectData,
  KeyProjectSection,
} from "@/app/components/key-project-section/KeyProjectSection";
import {
  SpaceSection,
  type SpaceSectionProps,
} from "@/app/components/space-section/SpaceSection";
import {
  TrustedBySection,
  type BrandLogo,
} from "@/app/components/trusted-by-section/TrustedBySection";
import {
  getHomepage,
  getStrapiImageUrl,
  type StrapiHomepage,
  type StrapiSpaceSection,
  type StrapiCrewArea,
  type StrapiKeyProject,
  type StrapiBrandLogo,
  type StrapiGalleryImage,
} from "@/app/lib/strapi";
import { getTranslations } from "@/app/lib/translations";
import styles from "@/app/page.module.css";

// ============================================================================
// Transformer Functions - Convert Strapi data to component props
// ============================================================================

function transformBrandLogos(logos: StrapiBrandLogo[] | undefined): BrandLogo[] {
  if (!logos || logos.length === 0) return [];

  return logos
    .sort((a, b) => a.order - b.order)
    .map((logo) => ({
      id: String(logo.id),
      src: getStrapiImageUrl(logo.logo),
      alt: logo.name,
      width: logo.logo?.width || 150,
      height: logo.logo?.height || 40,
    }));
}

function transformGalleryImages(
  images: StrapiGalleryImage[] | undefined
): GalleryImage[] {
  if (!images || images.length === 0) return [];

  return images.map((img, index) => ({
    id: String(img.image?.id || index),
    src: getStrapiImageUrl(img.image),
    alt: img.alt || `Gallery image ${index + 1}`,
  }));
}

function transformSpaceSection(
  space: StrapiSpaceSection | undefined
): Omit<SpaceSectionProps, "ctaLink"> | null {
  if (!space) return null;

  return {
    caption: space.caption || "WIDE RANGE OF SPACE",
    description: space.description,
    ctaText: space.cta_text || "VIEW STUDIO RENTAL",
    stats: space.stats?.map((stat) => ({
      label: stat.label,
      value: stat.value,
    })) || [],
    galleryImages: space.gallery_images?.map((img, index) => ({
      src: getStrapiImageUrl(img),
      alt: img.alternativeText || `Space image ${index + 1}`,
    })) || [],
  };
}

function transformCrewArea(
  crew: StrapiCrewArea | undefined
): CrewAreaSectionProps | null {
  if (!crew) return null;

  return {
    caption: crew.caption || "CREW AREA",
    heading: crew.heading,
    infoLabel: crew.info_label || "INFO",
    infoText: crew.info_text || "",
    mainImage: {
      src: getStrapiImageUrl(crew.main_image),
      alt: crew.main_image?.alternativeText || "Crew area main image",
    },
    secondaryImage1: crew.secondary_image_1
      ? {
          src: getStrapiImageUrl(crew.secondary_image_1),
          alt: crew.secondary_image_1.alternativeText || "Crew area image 1",
        }
      : undefined,
    secondaryImage2: crew.secondary_image_2
      ? {
          src: getStrapiImageUrl(crew.secondary_image_2),
          alt: crew.secondary_image_2.alternativeText || "Crew area image 2",
        }
      : undefined,
  };
}

function transformKeyProject(
  projects: StrapiKeyProject[] | undefined
): KeyProjectData | null {
  if (!projects || projects.length === 0) return null;

  // Get the featured project or first project
  const project = projects.find((p) => p.is_featured) || projects[0];
  if (!project) return null;

  return {
    projectNumber: project.project_number || "01/01",
    title: project.title,
    infoText: project.info_text || "",
    team: project.team || [],
    expertise: project.expertise || [],
    client: project.client,
    mainImage: {
      src: getStrapiImageUrl(project.main_image),
      alt: project.main_image?.alternativeText || project.title,
      width: project.main_image?.width || 440,
      height: project.main_image?.height || 297,
    },
    testimonial: project.testimonial
      ? {
          quote: project.testimonial.quote,
          author: project.testimonial.author,
          role: project.testimonial.role,
        }
      : undefined,
    galleryImages:
      project.gallery_images?.map((img, index) => ({
        src: getStrapiImageUrl(img.image),
        alt: img.alt || "",
        width: img.image?.width || 200,
        height: img.image?.height || 200,
      })) || [],
  };
}

// ============================================================================
// Page Component - Server Component with static generation
// ============================================================================

interface PageProps {
  params: Promise<{ locale: string }>;
}

export default async function Home({ params }: PageProps) {
  const { locale } = await params;
  const t = getTranslations(locale);

  // Fetch CMS data at build time
  const strapiData = await getHomepage(locale);

  // Transform Strapi data to component props
  const brandLogos = transformBrandLogos(strapiData?.brand_logos);
  const galleryImages = transformGalleryImages(strapiData?.gallery_images);
  const spaceData = transformSpaceSection(strapiData?.space_section);
  const crewAreaData = transformCrewArea(strapiData?.crew_area);
  const keyProjectData = transformKeyProject(strapiData?.key_projects);

  // Get hero data from CMS or use translations fallback
  const heroHeading = strapiData?.hero?.heading || t.HERO.HEADING;
  const heroBackground = strapiData?.hero?.background_image
    ? getStrapiImageUrl(strapiData.hero.background_image)
    : "/images/hero/hero-background.jpg";
  const heroBackgroundAlt =
    strapiData?.hero?.background_alt || "Hero background";

  return (
    <div className={styles.homepage}>
      <HeroSection
        heading={heroHeading}
        backgroundImage={heroBackground}
        backgroundAlt={heroBackgroundAlt}
        showScrollIndicator={true}
        showDecorativeLine={true}
      />
      <div className={styles.contentContainer}>
        <TrustedBySection logos={brandLogos.length > 0 ? brandLogos : undefined} />
        <GallerySection images={galleryImages.length > 0 ? galleryImages : undefined} />
        {keyProjectData && <KeyProjectSection project={keyProjectData} />}
        {spaceData && (
          <SpaceSection {...spaceData} ctaLink="/studio-rental" />
        )}
        {crewAreaData && <CrewAreaSection {...crewAreaData} />}
      </div>
    </div>
  );
}

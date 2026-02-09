import { ContactSection } from "@/app/components/contact-section/ContactSection";
import { HeroSection } from "@/app/components/hero-section/HeroSection";
import { KeyProjectSection } from "@/app/components/key-project-section/KeyProjectSection";
import {
  ProductionServiceGrid,
  type ProductionServiceItem,
} from "@/app/components/production-service-grid/ProductionServiceGrid";
import { QuoteIntro } from "@/app/components/quote-intro/QuoteIntro";
import { ServiceCardsCarousel } from "@/app/components/service-cards-carousel/ServiceCardsCarousel";
import { StudioIntro } from "@/app/components/studio-intro/StudioIntro";
import {
  FALLBACK_PRODUCTION_HERO,
  FALLBACK_PRODUCTION_KEY_PROJECT,
  FALLBACK_PRODUCTION_SERVICES,
  FALLBACK_PRODUCTION_WORKFLOW,
} from "@/app/lib/fallback-data";
import { buildPageMetadata } from "@/app/lib/seo";
import {
  getProductionPage,
  getStrapiImageUrl,
  type StrapiServiceItem,
} from "@/app/lib/strapi";
import {
  transformKeyProjects,
  transformWorkflow,
} from "@/app/lib/transformers";
import { getTranslations } from "@/app/lib/translations";
import type { Locale } from "@/app/types";
import styles from "./Production.module.css";

// ============================================================================
// SEO Metadata
// ============================================================================

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const data = await getProductionPage(locale);
  return buildPageMetadata({ hero: data?.hero, locale: locale as Locale });
}

// ============================================================================
// Transformer Functions - Page-specific transformers
// ============================================================================

function transformProductionServices(
  services: StrapiServiceItem[] | undefined,
): ProductionServiceItem[] {
  if (!services || services.length === 0) return [];

  return services
    .sort((a, b) => a.order - b.order)
    .map((service) => {
      const imageUrl = getStrapiImageUrl(service.image);
      if (!imageUrl) return null;
      return {
        id: String(service.id),
        imageUrl,
        title: service.title,
        description: service.description || "",
      };
    })
    .filter((item): item is ProductionServiceItem => item !== null);
}

// ============================================================================
// Page Component - Server Component with static generation
// ============================================================================

interface PageProps {
  params: Promise<{ locale: string }>;
}

export default async function ProductionPage({ params }: PageProps) {
  const { locale } = await params;
  const t = getTranslations(locale);
  const isDev = process.env.NODE_ENV === "development";

  // Fetch CMS data at build time
  const strapiData = await getProductionPage(locale);

  // Dev fallback - use hardcoded data when Strapi is unavailable during development
  const useFallback = !strapiData && isDev;
  if (useFallback) {
    console.warn(
      "[ProductionPage] Using fallback data - Strapi CMS not available in development",
    );
  }

  // Transform Strapi data to component props (or use fallbacks)

  // Hero
  const heroHeading =
    strapiData?.hero?.heading ||
    (useFallback
      ? FALLBACK_PRODUCTION_HERO.heading
      : t.PRODUCTION?.HERO?.TAGLINE ||
        "Full-Scale Production, Seamless Execution.");
  const heroBackgroundFromCms = strapiData?.hero?.background_image
    ? getStrapiImageUrl(strapiData.hero.background_image)
    : null;
  const heroBackground =
    heroBackgroundFromCms || FALLBACK_PRODUCTION_HERO.backgroundImage;
  const heroBackgroundAlt =
    strapiData?.hero?.background_alt || FALLBACK_PRODUCTION_HERO.backgroundAlt;

  // Intro
  const introLabel =
    strapiData?.intro?.label || t.PRODUCTION?.INTRO?.LABEL || "Our Service";
  const introDescription =
    strapiData?.intro?.description ||
    t.PRODUCTION?.INTRO?.DESCRIPTION ||
    "From concept to final delivery, we bring your campaign to life through precision planning, creative direction, and technical mastery.";
  const introCta =
    strapiData?.intro?.cta_text ||
    t.PRODUCTION?.INTRO?.CTA ||
    "Plan Your Production";

  // Services
  const productionServices = strapiData?.services
    ? transformProductionServices(strapiData.services)
    : useFallback
      ? FALLBACK_PRODUCTION_SERVICES
      : [];

  // Apply translations to services
  const translatedServices = productionServices.map((service, index) => {
    const serviceKey =
      `CARD_${index + 1}` as keyof typeof t.PRODUCTION.SERVICES;
    const translation = t.PRODUCTION?.SERVICES?.[serviceKey];
    return {
      ...service,
      title: translation?.TITLE ?? service.title,
      description: translation?.DESCRIPTION ?? service.description,
    };
  });

  // Quote intro (intro_2)
  const quoteLabel =
    strapiData?.intro_2?.label ||
    t.PRODUCTION?.KEY_PROJECT?.WAY_TITLE ||
    "The Saint 6 Way of Creation";
  const quoteDescription =
    strapiData?.intro_2?.description ||
    t.PRODUCTION?.KEY_PROJECT?.WAY_DESCRIPTION ||
    "We bring structure to creativity — blending strategic direction, artistic vision, and refined execution to produce visuals that speak luxury, authenticity, and emotion.";

  // Workflow
  const workflowSteps = strapiData?.workflow
    ? transformWorkflow(strapiData.workflow)
    : useFallback
      ? FALLBACK_PRODUCTION_WORKFLOW
      : [];

  // Apply translations to workflow
  const translatedWorkflow = workflowSteps.map((step, index) => {
    const stepKey = `STEP_${index + 1}` as keyof typeof t.PRODUCTION.WORKFLOW;
    const translation = t.PRODUCTION?.WORKFLOW?.[stepKey];
    return {
      ...step,
      title: translation?.TITLE ?? step.title,
      description: translation?.DESCRIPTION ?? step.description,
    };
  });

  // Key Projects
  const keyProjects = strapiData?.key_projects
    ? transformKeyProjects(strapiData.key_projects)
    : useFallback
      ? [FALLBACK_PRODUCTION_KEY_PROJECT]
      : [];

  return (
    <div className={styles.productionPage}>
      {/* Hero Section */}
      <HeroSection
        heading={heroHeading}
        backgroundImage={heroBackground}
        backgroundAlt={heroBackgroundAlt}
        showScrollIndicator={true}
        showDecorativeLine={true}
      />

      <div className={styles.contentContainer}>
        {/* Services Section - Intro, Service Grid, and Workflow */}
        <section className={styles.section} id="our-service">
          <div className={styles.sectionInner}>
            <StudioIntro
              title={introLabel}
              description={introDescription}
              ctaText={introCta}
            />
            {translatedServices.length > 0 && (
              <div id="services">
                <ProductionServiceGrid items={translatedServices} />
              </div>
            )}
            {translatedWorkflow.length > 0 && (
              <div id="workflow">
                <QuoteIntro label={quoteLabel} quote={quoteDescription} />
                <ServiceCardsCarousel
                  cards={translatedWorkflow}
                  showAllOnDesktop
                />
              </div>
            )}
          </div>
        </section>

        {/* Key Project Section */}
        {keyProjects.length > 0 && (
          <div className={styles.keyProjectWrapper} id="key-project">
            <KeyProjectSection projects={keyProjects} />
          </div>
        )}

        {/* Contact Section */}
        <div className={styles.contactSectionWrapper} id="contact-form">
          <ContactSection backgroundImageUrl="/images/get-in-touch-bg.jpg" />
        </div>
      </div>
    </div>
  );
}

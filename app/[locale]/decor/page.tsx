import { ContactSection } from "@/app/components/contact-section/ContactSection";
import { HeroSection } from "@/app/components/hero-section/HeroSection";
import { PortfolioSection } from "@/app/components/portfolio-section/PortfolioSection";
import { ServiceCardsCarousel } from "@/app/components/service-cards-carousel/ServiceCardsCarousel";
import { StudioIntro } from "@/app/components/studio-intro/StudioIntro";
import {
  FALLBACK_DECOR_HERO,
  FALLBACK_DECOR_PORTFOLIO,
  FALLBACK_DECOR_WORKFLOW,
} from "@/app/lib/fallback";
import { buildPageMetadata } from "@/app/lib/seo";
import { getDecorPage, getStrapiImageUrl, getStrapiThumbnailUrl } from "@/app/lib/strapi";
import { transformPortfolio, transformWorkflow } from "@/app/lib/transformers";
import { getTranslations } from "@/app/lib/translations";
import type { Locale } from "@/app/types";
import styles from "./Decoration.module.css";

// ============================================================================
// SEO Metadata
// ============================================================================

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const data = await getDecorPage(locale);
  return buildPageMetadata({
    hero: data?.hero,
    locale: locale as Locale,
    path: "decor",
  });
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

export default async function DecorationPage({ params }: PageProps) {
  const { locale } = await params;
  const t = getTranslations(locale);
  const isDev = process.env.NODE_ENV === "development";

  // Fetch CMS data at build time
  const strapiData = await getDecorPage(locale);

  // Dev fallback - use hardcoded data when Strapi is unavailable during development
  const useFallback = !strapiData && isDev;
  if (useFallback) {
    console.warn(
      "[DecorationPage] Using fallback data - Strapi CMS not available in development",
    );
  }

  // Transform Strapi data to component props (or use fallbacks)

  // Hero
  const heroHeading =
    strapiData?.hero?.heading ||
    (useFallback
      ? FALLBACK_DECOR_HERO.heading
      : t.DECORATION?.HERO?.TAGLINE ||
        "From flagship stores to private villas — we design and decorate spaces that tell a story.");
  const heroBackgroundFromCms = strapiData?.hero?.background_image
    ? getStrapiImageUrl(strapiData.hero.background_image)
    : null;
  const heroBackground =
    heroBackgroundFromCms || FALLBACK_DECOR_HERO.backgroundImage;
  const heroBackgroundAlt =
    strapiData?.hero?.background_alt || FALLBACK_DECOR_HERO.backgroundAlt;
  const heroPlaceholder = getStrapiThumbnailUrl(
    strapiData?.hero?.background_image,
  );

  // Intro
  const introLabel =
    strapiData?.intro?.label || t.DECORATION?.INTRO?.LABEL || "How We Work";
  const introDescription =
    strapiData?.intro?.description ||
    t.DECORATION?.INTRO?.DESCRIPTION ||
    'The name "Decor" feels refined and adaptable, representing Saint 6\'s creative work across fashion stores, restaurants, and personal villas.';
  const introCta =
    strapiData?.intro?.cta_text ||
    t.DECORATION?.INTRO?.CTA ||
    "Plan Your Decoration";

  // Workflow
  const workflowSteps = strapiData?.workflow
    ? transformWorkflow(strapiData.workflow)
    : useFallback
      ? FALLBACK_DECOR_WORKFLOW
      : [];

  // Apply translations to workflow
  const translatedWorkflow = workflowSteps.map((step, index) => {
    const cardKey = `CARD_${index + 1}` as keyof typeof t.DECORATION.SERVICES;
    const translation = t.DECORATION?.SERVICES?.[cardKey];
    return {
      ...step,
      title: translation?.TITLE ?? step.title,
      description: translation?.DESCRIPTION ?? step.description,
    };
  });

  // Portfolio
  const portfolioLabel =
    strapiData?.portfolio_settings?.label ||
    t.DECORATION?.PORTFOLIO?.LABEL ||
    "every moment, an emotion";
  const portfolioStatement =
    strapiData?.portfolio_settings?.statement ||
    t.DECORATION?.PORTFOLIO?.QUOTE ||
    "Every project begins with a vision. We bring it to life — detail by detail.";
  const portfolioItems = strapiData?.portfolio_items
    ? transformPortfolio(strapiData.portfolio_items)
    : useFallback
      ? FALLBACK_DECOR_PORTFOLIO
      : [];

  return (
    <div className={styles.decorationPage}>
      {/* Hero Section */}
      <HeroSection
        heading={heroHeading}
        backgroundImage={heroBackground}
        backgroundAlt={heroBackgroundAlt}
        placeholderImage={heroPlaceholder}
        showScrollIndicator={true}
        showDecorativeLine={true}
      />

      <div className={styles.contentContainer}>
        {/* Intro Section - How We Work */}
        <section className={styles.section} id="how-we-work">
          <div className={styles.sectionInner}>
            <StudioIntro
              title={introLabel}
              description={introDescription}
              ctaText={introCta}
            />
          </div>
        </section>

        {/* Workflow Section - Service Cards */}
        {translatedWorkflow.length > 0 && (
          <section className={styles.workflowSection} id="services">
            <div className={styles.workflowSectionInner}>
              <ServiceCardsCarousel cards={translatedWorkflow} />
            </div>
          </section>
        )}

        {/* Portfolio Section */}
        {portfolioItems.length > 0 && (
          <div className={styles.portfolioWrapper} id="portfolio">
            <PortfolioSection
              label={portfolioLabel}
              statement={portfolioStatement}
              items={portfolioItems}
              gridClassName={styles.portfolioGrid}
            />
          </div>
        )}

        {/* Contact Section */}
        <div className={styles.contactSectionWrapper} id="contact-form">
          <ContactSection backgroundImageUrl="/images/contact-section-bg.webp" />
        </div>
      </div>
    </div>
  );
}

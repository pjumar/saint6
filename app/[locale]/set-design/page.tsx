import { ContactSection } from "@/app/components/contact-section/ContactSection";
import { HeroSection } from "@/app/components/hero-section/HeroSection";
import { PortfolioSection } from "@/app/components/portfolio-section/PortfolioSection";
import { ServiceCardsCarousel } from "@/app/components/service-cards-carousel/ServiceCardsCarousel";
import { StudioIntro } from "@/app/components/studio-intro/StudioIntro";
import { TestimonialsSection } from "@/app/components/testimonials-section/TestimonialsSection";
import {
  FALLBACK_SET_DESIGN_HERO,
  FALLBACK_SET_DESIGN_PORTFOLIO,
  FALLBACK_SET_DESIGN_TESTIMONIALS,
  FALLBACK_SET_DESIGN_WORKFLOW,
} from "@/app/lib/fallback";
import { buildPageMetadata } from "@/app/lib/seo";
import { getSetDesignPage, getStrapiImageUrl } from "@/app/lib/strapi";
import {
  transformPortfolio,
  transformTestimonials,
  transformWorkflow,
} from "@/app/lib/transformers";
import { getTranslations } from "@/app/lib/translations";
import type { Locale } from "@/app/types";
import styles from "./SetDesign.module.css";

// ============================================================================
// SEO Metadata
// ============================================================================

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const data = await getSetDesignPage(locale);
  return buildPageMetadata({ hero: data?.hero, locale: locale as Locale });
}

// ============================================================================
// Page Component - Server Component with static generation
// ============================================================================

interface PageProps {
  params: Promise<{ locale: string }>;
}

export default async function SetDesignPage({ params }: PageProps) {
  const { locale } = await params;
  const t = getTranslations(locale);
  const isDev = process.env.NODE_ENV === "development";

  // Fetch CMS data at build time
  const strapiData = await getSetDesignPage(locale);

  // Dev fallback - use hardcoded data when Strapi is unavailable during development
  const useFallback = !strapiData && isDev;
  if (useFallback) {
    console.warn(
      "[SetDesignPage] Using fallback data - Strapi CMS not available in development",
    );
  }

  // Transform Strapi data to component props (or use fallbacks)

  // Hero
  const heroHeading =
    strapiData?.hero?.heading ||
    (useFallback
      ? FALLBACK_SET_DESIGN_HERO.heading
      : t.SET_DESIGN?.HERO?.TAGLINE ||
        "From Moodboard to Build — Complete Set Design for Visual Storytelling");
  const heroBackgroundFromCms = strapiData?.hero?.background_image
    ? getStrapiImageUrl(strapiData.hero.background_image)
    : null;
  const heroBackground =
    heroBackgroundFromCms || FALLBACK_SET_DESIGN_HERO.backgroundImage;
  const heroBackgroundAlt =
    strapiData?.hero?.background_alt || FALLBACK_SET_DESIGN_HERO.backgroundAlt;

  // Intro
  const introTitle =
    strapiData?.intro?.label || t.SET_DESIGN?.INTRO?.TITLE || "How We Work";
  const introDescription =
    strapiData?.intro?.description ||
    t.SET_DESIGN?.INTRO?.DESCRIPTION ||
    "We design, construct, and manage physical sets that transform creative direction into production-ready environments.";
  const introCta =
    strapiData?.intro?.cta_text || t.SET_DESIGN?.INTRO?.CTA || "Get in touch";

  // Workflow
  const workflowSteps = strapiData?.workflow
    ? transformWorkflow(strapiData.workflow)
    : useFallback
      ? FALLBACK_SET_DESIGN_WORKFLOW
      : [];

  // Apply translations to workflow
  const translatedWorkflow = workflowSteps.map((step, index) => {
    const cardKey = `CARD_${index + 1}` as keyof typeof t.SET_DESIGN.SERVICES;
    const translation = t.SET_DESIGN?.SERVICES?.[cardKey];
    return {
      ...step,
      title: translation?.TITLE ?? step.title,
      description: translation?.DESCRIPTION ?? step.description,
    };
  });

  // Portfolio
  const portfolioLabel =
    strapiData?.portfolio_settings?.label ||
    t.SET_DESIGN?.PORTFOLIO?.LABEL ||
    "PORTFOLIO";
  const portfolioStatement =
    strapiData?.portfolio_settings?.statement ||
    t.SET_DESIGN?.PORTFOLIO?.STATEMENT ||
    "We shape physical spaces that reflect your creative intent — environments that become part of your story";
  const portfolioItems = strapiData?.portfolio_items
    ? transformPortfolio(strapiData.portfolio_items)
    : useFallback
      ? FALLBACK_SET_DESIGN_PORTFOLIO
      : [];

  // Testimonials
  const testimonialsLabel =
    t.SET_DESIGN?.TESTIMONIALS?.LABEL || "VOICES BEHIND THE LENS";
  const testimonialsTitle =
    t.SET_DESIGN?.TESTIMONIALS?.TITLE ||
    "Stories from Brands Who Trusted Us to Build Their Vision";
  const testimonialItems = strapiData?.testimonials
    ? transformTestimonials(strapiData.testimonials)
    : useFallback
      ? FALLBACK_SET_DESIGN_TESTIMONIALS
      : [];

  return (
    <div className={styles.setDesignPage}>
      {/* Hero Section */}
      <HeroSection
        heading={heroHeading}
        backgroundImage={heroBackground}
        backgroundAlt={heroBackgroundAlt}
        showScrollIndicator={true}
        showDecorativeLine={true}
      />

      <div className={styles.contentContainer}>
        {/* How It Works Section with Service Cards */}
        <section className={styles.section} id="how-it-works">
          <div className={styles.sectionInner}>
            <StudioIntro
              title={introTitle}
              description={introDescription}
              ctaText={introCta}
            />
            {translatedWorkflow.length > 0 && (
              <div id="services">
                <ServiceCardsCarousel cards={translatedWorkflow} />
              </div>
            )}
          </div>
        </section>

        {/* Portfolio Section */}
        {portfolioItems.length > 0 && (
          <div className={styles.portfolioWrapper} id="portfolio">
            <PortfolioSection
              label={portfolioLabel}
              statement={portfolioStatement}
              items={portfolioItems}
            />
          </div>
        )}

        {/* Testimonials Section */}
        {testimonialItems.length > 0 && (
          <div id="testimonials">
            <TestimonialsSection
              label={testimonialsLabel}
              title={testimonialsTitle}
              items={testimonialItems}
            />
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

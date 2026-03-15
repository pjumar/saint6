import { ContactSection } from "@/app/components/contact-section/ContactSection";
import {
  type CreativeServiceItem,
  CreativeServicesGrid,
} from "@/app/components/creative-services-grid/CreativeServicesGrid";
import { HeroSection } from "@/app/components/hero-section/HeroSection";
import { PortfolioSection } from "@/app/components/portfolio-section/PortfolioSection";
import {
  type ClientLogo,
  SelectedClientsSection,
} from "@/app/components/selected-clients-section/SelectedClientsSection";
import { ServiceCardsCarousel } from "@/app/components/service-cards-carousel/ServiceCardsCarousel";
import { StudioIntro } from "@/app/components/studio-intro/StudioIntro";
import { TestimonialsSection } from "@/app/components/testimonials-section/TestimonialsSection";
import {
  FALLBACK_CREATIVE_HERO,
  FALLBACK_CREATIVE_PORTFOLIO,
  FALLBACK_CREATIVE_SERVICES,
  FALLBACK_CREATIVE_TESTIMONIALS,
  FALLBACK_CREATIVE_WORKFLOW,
} from "@/app/lib/fallback";
import { buildPageMetadata } from "@/app/lib/seo";
import {
  getCreativePage,
  getStrapiImageUrl,
  getStrapiThumbnailUrl,
  type StrapiBrandLogo,
  type StrapiServiceItem,
} from "@/app/lib/strapi";
import {
  transformPortfolio,
  transformTestimonials,
  transformWorkflow,
} from "@/app/lib/transformers";
import { getTranslations } from "@/app/lib/translations";
import type { Locale } from "@/app/types";
import styles from "./Creative.module.css";

// ============================================================================
// SEO Metadata
// ============================================================================

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const data = await getCreativePage(locale);
  return buildPageMetadata({
    hero: data?.hero,
    locale: locale as Locale,
    path: "creative",
  });
}

// ============================================================================
// Transformer Functions - Page-specific transformers
// ============================================================================

function transformCreativeServices(
  services: StrapiServiceItem[] | undefined,
): CreativeServiceItem[] {
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
    .filter((item): item is CreativeServiceItem => item !== null);
}

function transformClientLogos(
  logos: StrapiBrandLogo[] | undefined,
): ClientLogo[] {
  if (!logos || logos.length === 0) return [];

  return logos
    .sort((a, b) => a.order - b.order)
    .map((logo) => {
      const src = getStrapiImageUrl(logo.logo);
      if (!src) return null;
      return { src, alt: logo.name };
    })
    .filter((logo): logo is ClientLogo => logo !== null);
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

export default async function CreativePage({ params }: PageProps) {
  const { locale } = await params;
  const t = getTranslations(locale);
  const isDev = process.env.NODE_ENV === "development";

  // Fetch CMS data at build time
  const strapiData = await getCreativePage(locale);

  // Dev fallback - use hardcoded data when Strapi is unavailable during development
  const useFallback = !strapiData && isDev;
  if (useFallback) {
    console.warn(
      "[CreativePage] Using fallback data - Strapi CMS not available in development",
    );
  }

  // Transform Strapi data to component props (or use fallbacks)

  // Hero
  const heroHeading =
    strapiData?.hero?.heading ||
    (useFallback
      ? FALLBACK_CREATIVE_HERO.heading
      : (t.CREATIVE?.HERO?.TAGLINE ??
        "Creative production for brands, campaigns & products"));
  const heroBackgroundFromCms = strapiData?.hero?.background_image
    ? getStrapiImageUrl(strapiData.hero.background_image)
    : null;
  const heroBackground =
    heroBackgroundFromCms || FALLBACK_CREATIVE_HERO.backgroundImage;
  const heroBackgroundAlt =
    strapiData?.hero?.background_alt || FALLBACK_CREATIVE_HERO.backgroundAlt;
  const heroPlaceholder = getStrapiThumbnailUrl(
    strapiData?.hero?.background_image,
  );

  // Clients section
  const clientsLabel =
    strapiData?.clients?.label ||
    t.CREATIVE?.CLIENTS?.LABEL ||
    "Selected Clients";
  const clientsDescription =
    strapiData?.clients?.description ||
    t.CREATIVE?.CLIENTS?.DESCRIPTION ||
    "We're proud to collaborate with leading brands, agencies, and startups worldwide.";
  const clientLogos = transformClientLogos(strapiData?.client_logos);

  // Services
  const creativeServices = strapiData?.services
    ? transformCreativeServices(strapiData.services)
    : useFallback
      ? FALLBACK_CREATIVE_SERVICES
      : [];

  // Apply translations as fallback for services (CMS data takes priority)
  const translatedServices = strapiData?.services
    ? creativeServices
    : creativeServices.map((service, index) => {
        const cardKey = `CARD_${index + 1}` as keyof typeof t.CREATIVE.SERVICES;
        const translation = t.CREATIVE?.SERVICES?.[cardKey];
        return {
          ...service,
          title: translation?.TITLE ?? service.title,
          description: translation?.DESCRIPTION ?? service.description,
        };
      });

  // Intro (How We Work)
  const introLabel =
    strapiData?.intro?.label || t.CREATIVE?.INTRO?.LABEL || "How We Work";
  const introDescription =
    strapiData?.intro?.description ||
    t.CREATIVE?.INTRO?.DESCRIPTION ||
    "We can take on full-service production or jump in at any stage — from moodboard and concept development to post-production and final delivery.";
  const introCta =
    strapiData?.intro?.cta_text || t.CREATIVE?.INTRO?.CTA || "Get in touch";

  // Workflow
  const workflowSteps = strapiData?.workflow
    ? transformWorkflow(strapiData.workflow)
    : useFallback
      ? FALLBACK_CREATIVE_WORKFLOW
      : [];

  // Apply translations as fallback for workflow (CMS data takes priority)
  const translatedWorkflow = strapiData?.workflow
    ? workflowSteps
    : workflowSteps.map((step, index) => {
        const stepKey = `STEP_${index + 1}` as keyof typeof t.CREATIVE.WORKFLOW;
        const translation = t.CREATIVE?.WORKFLOW?.[stepKey];
        return {
          ...step,
          title: translation?.TITLE ?? step.title,
          description: translation?.DESCRIPTION ?? step.description,
        };
      });

  // Portfolio
  const portfolioLabel =
    strapiData?.portfolio_settings?.label ||
    t.CREATIVE?.PORTFOLIO?.LABEL ||
    "Featured Work";
  const portfolioStatement =
    strapiData?.portfolio_settings?.statement ||
    t.CREATIVE?.PORTFOLIO?.STATEMENT ||
    "Elevated visuals that reflect your brand's ambition — a showcase of artistry and attention to detail.";
  const portfolioItems = strapiData?.portfolio_items
    ? transformPortfolio(strapiData.portfolio_items)
    : useFallback
      ? FALLBACK_CREATIVE_PORTFOLIO
      : [];

  // Testimonials
  const testimonialsLabel =
    t.CREATIVE?.TESTIMONIALS?.LABEL || "Voices Behind the Lens";
  const testimonialsTitle =
    t.CREATIVE?.TESTIMONIALS?.TITLE ||
    "Real experiences from creative professionals who've brought their vision to life at Saint 6 Studio.";
  const testimonialItems = strapiData?.testimonials
    ? transformTestimonials(strapiData.testimonials)
    : useFallback
      ? FALLBACK_CREATIVE_TESTIMONIALS
      : [];

  return (
    <div className={styles.creativePage}>
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
        {/* Selected Clients Section */}
        <SelectedClientsSection
          label={clientsLabel}
          description={clientsDescription}
          logos={clientLogos.length > 0 ? clientLogos : undefined}
        />

        {/* Services Section */}
        {translatedServices.length > 0 && (
          <CreativeServicesGrid items={translatedServices} />
        )}

        {/* How We Work Section */}
        <section className={styles.section} id="how-we-work">
          <div className={styles.sectionInner}>
            <StudioIntro
              title={introLabel}
              description={introDescription}
              ctaText={introCta}
            />
          </div>
        </section>

        {/* Workflow Section */}
        {translatedWorkflow.length > 0 && (
          <section className={styles.workflowSection} id="workflow">
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
            />
          </div>
        )}

        {/* Testimonials Section */}
        {testimonialItems.length > 0 && (
          <section className={styles.testimonialsSection} id="testimonials">
            <TestimonialsSection
              label={testimonialsLabel}
              title={testimonialsTitle}
              items={testimonialItems}
            />
          </section>
        )}

        {/* Contact Section */}
        <div className={styles.contactSectionWrapper} id="contact-form">
          <ContactSection backgroundImageUrl="/images/contact-section-bg.webp" />
        </div>
      </div>
    </div>
  );
}

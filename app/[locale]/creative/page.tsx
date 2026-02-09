import { ContactSection } from "@/app/components/contact-section/ContactSection";
import {
  type CreativeServiceItem,
  CreativeServicesGrid,
} from "@/app/components/creative-services-grid/CreativeServicesGrid";
import { DebugPanel } from "@/app/components/debug-panel/DebugPanel";
import { HeroSection } from "@/app/components/hero-section/HeroSection";
import {
  type PortfolioItem,
  PortfolioSection,
} from "@/app/components/portfolio-section/PortfolioSection";
import {
  type ClientLogo,
  SelectedClientsSection,
} from "@/app/components/selected-clients-section/SelectedClientsSection";
import {
  type ServiceCard,
  ServiceCardsCarousel,
} from "@/app/components/service-cards-carousel/ServiceCardsCarousel";
import { StudioIntro } from "@/app/components/studio-intro/StudioIntro";
import {
  type TestimonialItem,
  TestimonialsSection,
} from "@/app/components/testimonials-section/TestimonialsSection";
import {
  FALLBACK_CREATIVE_HERO,
  FALLBACK_CREATIVE_PORTFOLIO,
  FALLBACK_CREATIVE_SERVICES,
  FALLBACK_CREATIVE_TESTIMONIALS,
  FALLBACK_CREATIVE_WORKFLOW,
} from "@/app/lib/fallback-data";
import { buildPageMetadata } from "@/app/lib/seo";
import {
  getCreativePage,
  getStrapiImageUrl,
  type StrapiBrandLogo,
  type StrapiServiceItem,
  type StrapiPortfolioItem,
  type StrapiTestimonialItem,
} from "@/app/lib/strapi";
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
  return buildPageMetadata({ hero: data?.hero, locale: locale as Locale });
}

// ============================================================================
// Transformer Functions - Convert Strapi data to component props
// ============================================================================

function transformCreativeServices(
  services: StrapiServiceItem[] | undefined
): CreativeServiceItem[] {
  if (!services || services.length === 0) return [];

  return services
    .sort((a, b) => a.order - b.order)
    .map((service) => {
      const imageUrl = getStrapiImageUrl(service.image);
      return {
        id: String(service.id),
        imageUrl: imageUrl || "/images/creative/service-placeholder.jpg",
        title: service.title,
        description: service.description || "",
      };
    });
}

function transformWorkflow(
  workflow: StrapiServiceItem[] | undefined
): ServiceCard[] {
  if (!workflow || workflow.length === 0) return [];

  return workflow
    .sort((a, b) => a.order - b.order)
    .map((step) => {
      const imageUrl = getStrapiImageUrl(step.image);
      return {
        id: String(step.id),
        imageUrl: imageUrl || "/images/creative/workflow-placeholder.jpg",
        counter: `${String(step.order).padStart(2, "0")}.`,
        title: step.title,
        description: step.description || "",
      };
    });
}

function transformPortfolio(
  items: StrapiPortfolioItem[] | undefined
): PortfolioItem[] {
  if (!items || items.length === 0) return [];

  const result: PortfolioItem[] = [];

  items
    .sort((a, b) => a.order - b.order)
    .forEach((item) => {
      const imageUrl = getStrapiImageUrl(item.image);
      if (!imageUrl) return;
      result.push({
        id: String(item.id),
        imageUrl,
        category: item.category || "Campaign",
        title: item.title,
        size: item.size,
      });
    });

  return result;
}

function transformTestimonials(
  testimonials: StrapiTestimonialItem[] | undefined
): TestimonialItem[] {
  if (!testimonials || testimonials.length === 0) return [];

  return testimonials
    .sort((a, b) => a.order - b.order)
    .map((testimonial) => {
      const logoUrl = getStrapiImageUrl(testimonial.brand_logo);
      return {
        id: String(testimonial.id),
        logoUrl: logoUrl || "/images/brands/placeholder.png",
        logoAlt: testimonial.brand_name,
        quote: testimonial.quote,
        authorName: testimonial.author_name,
        authorTitle: testimonial.author_title,
      };
    });
}

function transformClientLogos(
  logos: StrapiBrandLogo[] | undefined
): ClientLogo[] {
  if (!logos || logos.length === 0) return [];

  return logos
    .sort((a, b) => a.order - b.order)
    .map((logo) => {
      const imageUrl = getStrapiImageUrl(logo.logo);
      return {
        src: imageUrl || "/images/brands/placeholder.png",
        alt: logo.name,
      };
    })
    .filter((logo) => logo.src !== "/images/brands/placeholder.png");
}

// ============================================================================
// Page Component - Server Component with static generation
// ============================================================================

interface PageProps {
  params: Promise<{ locale: string }>;
}

export default async function CreativePage({ params }: PageProps) {
  const { locale } = await params;
  const t = getTranslations(locale);
  const isDev = process.env.NODE_ENV === "development";

  // Fetch CMS data at build time
  const strapiData = await getCreativePage(locale);

  // DEBUG: Detailed logging for production debugging
  console.log("[CreativePage] ===== START DEBUG =====");
  console.log("[CreativePage] locale:", locale);
  console.log("[CreativePage] NODE_ENV:", process.env.NODE_ENV);
  console.log("[CreativePage] strapiData exists:", !!strapiData);
  if (strapiData) {
    console.log("[CreativePage] strapiData keys:", Object.keys(strapiData));
    console.log("[CreativePage] hero:", strapiData.hero ? "yes" : "no");
    console.log("[CreativePage] clients:", strapiData.clients ? "yes" : "no");
    console.log("[CreativePage] client_logos:", strapiData.client_logos?.length ?? 0);
    console.log("[CreativePage] services:", strapiData.services?.length ?? 0);
    console.log("[CreativePage] intro:", strapiData.intro ? "yes" : "no");
    console.log("[CreativePage] workflow:", strapiData.workflow?.length ?? 0);
    console.log("[CreativePage] portfolio_settings:", strapiData.portfolio_settings ? "yes" : "no");
    console.log("[CreativePage] portfolio_items:", strapiData.portfolio_items?.length ?? 0);
    console.log("[CreativePage] testimonials:", strapiData.testimonials?.length ?? 0);
  }
  console.log("[CreativePage] ===== END DEBUG =====");

  // Dev fallback - use hardcoded data when Strapi is unavailable during development
  const useFallback = !strapiData && isDev;
  if (useFallback) {
    console.warn(
      "[CreativePage] Using fallback data - Strapi CMS not available in development"
    );
  }

  // Transform Strapi data to component props (or use fallbacks)

  // Hero
  const heroHeading =
    strapiData?.hero?.heading ||
    (useFallback
      ? FALLBACK_CREATIVE_HERO.heading
      : t.CREATIVE?.HERO?.TAGLINE ??
        "Creative production for brands, campaigns & products");
  const heroBackgroundFromCms = strapiData?.hero?.background_image
    ? getStrapiImageUrl(strapiData.hero.background_image)
    : null;
  const heroBackground =
    heroBackgroundFromCms || FALLBACK_CREATIVE_HERO.backgroundImage;
  const heroBackgroundAlt =
    strapiData?.hero?.background_alt || FALLBACK_CREATIVE_HERO.backgroundAlt;

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

  // Apply translations to services
  const translatedServices = creativeServices.map((service, index) => {
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

  // Apply translations to workflow
  const translatedWorkflow = workflowSteps.map((step, index) => {
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

  // Debug info for client-side debug panel
  const debugInfo = {
    page: "creative",
    locale,
    env: process.env.NODE_ENV || "unknown",
    timestamp: new Date().toISOString(),
    sections: [
      { name: "strapiData", hasData: !!strapiData },
      { name: "hero", hasData: !!strapiData?.hero },
      { name: "clients", hasData: !!strapiData?.clients },
      { name: "client_logos", hasData: (strapiData?.client_logos?.length ?? 0) > 0, count: strapiData?.client_logos?.length ?? 0 },
      { name: "services", hasData: translatedServices.length > 0, count: translatedServices.length },
      { name: "intro", hasData: !!strapiData?.intro },
      { name: "workflow", hasData: translatedWorkflow.length > 0, count: translatedWorkflow.length },
      { name: "portfolio_settings", hasData: !!strapiData?.portfolio_settings },
      { name: "portfolio_items", hasData: portfolioItems.length > 0, count: portfolioItems.length },
      { name: "testimonials", hasData: testimonialItems.length > 0, count: testimonialItems.length },
    ],
  };

  return (
    <div className={styles.creativePage}>
      {/* Hero Section */}
      <HeroSection
        heading={heroHeading}
        backgroundImage={heroBackground}
        backgroundAlt={heroBackgroundAlt}
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
          <ContactSection backgroundImageUrl="/images/get-in-touch-bg.jpg" />
        </div>
      </div>

      {/* Debug Panel - visible with ?debug=true query param */}
      <DebugPanel info={debugInfo} />
    </div>
  );
}

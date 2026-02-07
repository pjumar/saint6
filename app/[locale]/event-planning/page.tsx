import { ContactSection } from "@/app/components/contact-section/ContactSection";
import {
  type EventProject,
  EventProjectGallery,
} from "@/app/components/event-project-gallery/EventProjectGallery";
import { HeroSection } from "@/app/components/hero-section/HeroSection";
import {
  ProductionServiceGrid,
  type ProductionServiceItem,
} from "@/app/components/production-service-grid/ProductionServiceGrid";
import { QuoteIntro } from "@/app/components/quote-intro/QuoteIntro";
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
  FALLBACK_EVENT_HERO,
  FALLBACK_EVENT_PROJECTS,
  FALLBACK_EVENT_SERVICES,
  FALLBACK_EVENT_WORKFLOW,
} from "@/app/lib/fallback-data";
import {
  getEventPlanningPage,
  getStrapiImageUrl,
  type StrapiServiceItem,
  type StrapiEventProject,
  type StrapiTestimonialItem,
} from "@/app/lib/strapi";
import { getTranslations } from "@/app/lib/translations";
import styles from "./EventPlanning.module.css";

// ============================================================================
// Transformer Functions - Convert Strapi data to component props
// ============================================================================

function transformServices(
  services: StrapiServiceItem[] | undefined
): ProductionServiceItem[] {
  if (!services || services.length === 0) return [];

  return services
    .sort((a, b) => a.order - b.order)
    .map((service) => {
      const imageUrl = getStrapiImageUrl(service.image);
      return {
        id: String(service.id),
        imageUrl: imageUrl || "/images/event-planning/service-placeholder.jpg",
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
        imageUrl: imageUrl || "/images/event-planning/workflow-placeholder.jpg",
        counter: `${String(step.order).padStart(2, "0")}.`,
        title: step.title,
        description: step.description || "",
      };
    });
}

function transformEventProjects(
  projects: StrapiEventProject[] | undefined
): EventProject[] {
  if (!projects || projects.length === 0) return [];

  return projects
    .sort((a, b) => a.order - b.order)
    .map((project) => {
      // Transform Strapi images array to component format
      const images = (project.images || [])
        .map((img) => {
          const imageUrl = getStrapiImageUrl(img);
          return imageUrl
            ? {
                url: imageUrl,
                alt: img?.alternativeText || project.title,
              }
            : null;
        })
        .filter((img): img is { url: string; alt: string } => img !== null);

      return {
        id: String(project.id),
        images,
        title: project.title,
        category: project.category,
      };
    })
    .filter((project) => project.images.length > 0);
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
        logoAlt: testimonial.brand_logo?.alternativeText || testimonial.brand_name || "Brand",
        quote: testimonial.quote,
        authorName: testimonial.author_name,
        authorTitle: testimonial.author_title,
      };
    });
}

// ============================================================================
// Page Component - Server Component with static generation
// ============================================================================

interface PageProps {
  params: Promise<{ locale: string }>;
}

export default async function EventPlanningPage({ params }: PageProps) {
  const { locale } = await params;
  const t = getTranslations(locale);
  const isDev = process.env.NODE_ENV === "development";

  // Fetch CMS data at build time
  const strapiData = await getEventPlanningPage(locale);

  // Dev fallback - use hardcoded data when Strapi is unavailable during development
  const useFallback = !strapiData && isDev;
  if (useFallback) {
    console.warn(
      "[EventPlanningPage] Using fallback data - Strapi CMS not available in development"
    );
  }

  // Transform Strapi data to component props (or use fallbacks)

  // Hero
  const heroHeading =
    strapiData?.hero?.heading ||
    (useFallback
      ? FALLBACK_EVENT_HERO.heading
      : t.EVENT_PLANNING?.HERO?.TAGLINE ||
        "Curated events that captivate and inspire");
  const heroBackgroundFromCms = strapiData?.hero?.background_image
    ? getStrapiImageUrl(strapiData.hero.background_image)
    : null;
  const heroBackground =
    heroBackgroundFromCms || FALLBACK_EVENT_HERO.backgroundImage;
  const heroBackgroundAlt =
    strapiData?.hero?.background_alt || FALLBACK_EVENT_HERO.backgroundAlt;

  // Intro
  const introLabel =
    strapiData?.intro?.label || t.EVENT_PLANNING?.INTRO?.LABEL || "Our Service";
  const introDescription =
    strapiData?.intro?.description ||
    t.EVENT_PLANNING?.INTRO?.DESCRIPTION ||
    "From intimate dinners to grand launches, we design and execute events that leave lasting impressions.";
  const introCta =
    strapiData?.intro?.cta_text ||
    t.EVENT_PLANNING?.INTRO?.CTA ||
    "Plan Your Event";

  // Services
  const eventServices = strapiData?.services
    ? transformServices(strapiData.services)
    : useFallback
      ? FALLBACK_EVENT_SERVICES
      : [];

  // Apply translations to services
  const translatedServices = eventServices.map((service, index) => {
    const serviceKey =
      `CARD_${index + 1}` as keyof typeof t.EVENT_PLANNING.SERVICES;
    const translation = t.EVENT_PLANNING?.SERVICES?.[serviceKey];
    return {
      ...service,
      title: translation?.TITLE ?? service.title,
      description: translation?.DESCRIPTION ?? service.description,
    };
  });

  // Quote intro (intro_2)
  const quoteLabel =
    strapiData?.intro_2?.label ||
    t.EVENT_PLANNING?.PROCESS?.TITLE ||
    "Our Process";
  const quoteDescription =
    strapiData?.intro_2?.description ||
    t.EVENT_PLANNING?.PROCESS?.DESCRIPTION ||
    "Every event begins with a vision. We bring it to life through meticulous planning and flawless execution.";

  // Workflow
  const workflowSteps = strapiData?.workflow
    ? transformWorkflow(strapiData.workflow)
    : useFallback
      ? FALLBACK_EVENT_WORKFLOW
      : [];

  // Apply translations to workflow
  const translatedWorkflow = workflowSteps.map((step, index) => {
    const stepKey = `STEP_${index + 1}` as keyof typeof t.EVENT_PLANNING.WORKFLOW;
    const translation = t.EVENT_PLANNING?.WORKFLOW?.[stepKey];
    return {
      ...step,
      title: translation?.TITLE ?? step.title,
      description: translation?.DESCRIPTION ?? step.description,
    };
  });

  // Event Projects
  const eventProjects = strapiData?.event_projects
    ? transformEventProjects(strapiData.event_projects)
    : useFallback
      ? FALLBACK_EVENT_PROJECTS
      : [];

  // Testimonials
  const testimonialsLabel =
    t.EVENT_PLANNING?.TESTIMONIALS?.LABEL || "CLIENT VOICES";
  const testimonialsTitle =
    t.EVENT_PLANNING?.TESTIMONIALS?.TITLE ||
    "Stories from Brands Who Trusted Us with Their Events";
  const testimonialItems = strapiData?.testimonials
    ? transformTestimonials(strapiData.testimonials)
    : [];

  return (
    <div className={styles.eventPlanningPage}>
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
              <div id="process">
                <QuoteIntro label={quoteLabel} quote={quoteDescription} />
                <ServiceCardsCarousel cards={translatedWorkflow} />
              </div>
            )}
          </div>
        </section>

        {/* Project Gallery Section */}
        {eventProjects.length > 0 && (
          <section className={styles.gallerySection} id="gallery">
            <div className={styles.gallerySectionInner}>
              <EventProjectGallery projects={eventProjects} />
            </div>
          </section>
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

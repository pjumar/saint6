"use client";

import { HeroSection } from "@/app/components/hero-section/HeroSection";
import { StudioIntro } from "@/app/components/studio-intro/StudioIntro";
import { QuoteIntro } from "@/app/components/quote-intro/QuoteIntro";
import { ContactSection } from "@/app/components/contact-section/ContactSection";
import { ProductionServiceGrid, ProductionServiceItem } from "@/app/components/production-service-grid/ProductionServiceGrid";
import { ServiceCardsCarousel, ServiceCard } from "@/app/components/service-cards-carousel/ServiceCardsCarousel";
import { EventProjectGallery, EventProject } from "@/app/components/event-project-gallery/EventProjectGallery";
import { TestimonialsSection, TestimonialItem } from "@/app/components/testimonials-section/TestimonialsSection";
import { useTranslation } from "@/app/contexts/TranslationContext";
import styles from "./EventPlanning.module.css";

// Event Planning services data (CMS integration in Phase 8)
const eventServices: ProductionServiceItem[] = [
  {
    id: "product-launches",
    imageUrl: "/images/event-planning/service-product-launches.jpg",
    title: "Product & Brand Launches",
    description: "We craft launch experiences that captivate audiences and elevate your brand story with precision and flair.",
  },
  {
    id: "fashion-shows",
    imageUrl: "/images/event-planning/service-fashion-shows.jpg",
    title: "Fashion Shows",
    description: "From runway to backstage, we design and execute fashion events that celebrate artistry and style.",
  },
  {
    id: "private-dinners",
    imageUrl: "/images/event-planning/service-private-dinners.jpg",
    title: "Private Dinners",
    description: "Intimate gatherings curated with exquisite detail, creating memorable moments for your guests.",
  },
  {
    id: "art-popups",
    imageUrl: "/images/event-planning/service-art-popups.jpg",
    title: "Art & Lifestyle Pop-Ups",
    description: "Immersive pop-up experiences that blend art, culture, and lifestyle into unforgettable activations.",
  },
  {
    id: "press-events",
    imageUrl: "/images/event-planning/service-press-events.jpg",
    title: "Press & Influencer Events",
    description: "Strategic media events designed to generate buzz and build lasting connections with key voices.",
  },
  {
    id: "corporate-celebrations",
    imageUrl: "/images/event-planning/service-corporate.jpg",
    title: "Corporate Celebrations",
    description: "Professional yet refined corporate events that reflect your company's values and vision.",
  },
];

// Workflow steps base data (CMS integration in Phase 8)
const workflowStepsBase = [
  { id: "creative-direction", imageUrl: "/images/event-planning/workflow-discovery.jpg", counter: "01." },
  { id: "guest-experience", imageUrl: "/images/event-planning/workflow-concept.jpg", counter: "02." },
  { id: "onsite-management", imageUrl: "/images/event-planning/workflow-planning.jpg", counter: "03." },
  { id: "venue-styling", imageUrl: "/images/event-planning/workflow-execution.jpg", counter: "04." },
  { id: "catering-entertainment", imageUrl: "/images/event-planning/workflow-followup.jpg", counter: "05." },
];

// Project gallery items (CMS integration in Phase 8)
const eventProjects: EventProject[] = [
  {
    id: "project-1",
    imageUrl: "/images/project-1.jpg",
    imageAlt: "Fashion Show Event",
    title: "Spring Collection Reveal",
    category: "Fashion Shows",
  },
  {
    id: "project-2",
    imageUrl: "/images/project-1.jpg",
    imageAlt: "Private Dinner Event",
    title: "VIP Gala Evening",
    category: "Private Dinners",
  },
  {
    id: "project-3",
    imageUrl: "/images/project-1.jpg",
    imageAlt: "Art Pop-Up Event",
    title: "Contemporary Art Opening",
    category: "Art & Lifestyle Pop-Ups",
  },
  {
    id: "project-4",
    imageUrl: "/images/project-1.jpg",
    imageAlt: "Corporate Celebration",
    title: "Annual Awards Ceremony",
    category: "Corporate Celebrations",
  },
];

// Testimonials data (CMS integration in Phase 8)
const testimonialItems: TestimonialItem[] = [
  {
    id: "testimonial-1",
    logoUrl: "/images/event-planning/logo-1.png",
    logoAlt: "Client Logo 1",
    quote: "Saint 6 transformed our product launch into an unforgettable experience. Their attention to detail was impeccable.",
    authorName: "Nguyen Thi A",
    authorTitle: "Marketing Director, Fashion Brand",
  },
  {
    id: "testimonial-2",
    logoUrl: "/images/event-planning/logo-2.png",
    logoAlt: "Client Logo 2",
    quote: "From concept to execution, they delivered a flawless fashion show that exceeded all our expectations.",
    authorName: "Tran Van B",
    authorTitle: "Creative Director, Luxury House",
  },
  {
    id: "testimonial-3",
    logoUrl: "/images/event-planning/logo-3.png",
    logoAlt: "Client Logo 3",
    quote: "The private dinner they curated for our VIP clients was absolutely stunning. Every detail was perfect.",
    authorName: "Le Thi C",
    authorTitle: "CEO, Corporate Client",
  },
  {
    id: "testimonial-4",
    logoUrl: "/images/event-planning/logo-4.png",
    logoAlt: "Client Logo 4",
    quote: "Their pop-up activation brought our brand story to life in ways we hadn't imagined possible.",
    authorName: "Pham Van D",
    authorTitle: "Brand Manager, Lifestyle Brand",
  },
  {
    id: "testimonial-5",
    logoUrl: "/images/event-planning/logo-5.png",
    logoAlt: "Client Logo 5",
    quote: "Professional, creative, and incredibly responsive. Saint 6 is now our go-to events partner.",
    authorName: "Hoang Thi E",
    authorTitle: "PR Director, Media Agency",
  },
  {
    id: "testimonial-6",
    logoUrl: "/images/event-planning/logo-6.png",
    logoAlt: "Client Logo 6",
    quote: "They understood our vision from day one and delivered an event that perfectly reflected our brand values.",
    authorName: "Nguyen Van F",
    authorTitle: "Events Manager, Hospitality Group",
  },
];

export default function EventPlanningPage() {
  const { t } = useTranslation();

  // Get service translations
  const getServiceTranslation = (index: number) => {
    const serviceKey = `CARD_${index + 1}` as keyof typeof t.EVENT_PLANNING.SERVICES;
    const translation = t.EVENT_PLANNING?.SERVICES?.[serviceKey];
    return {
      title: translation?.TITLE ?? `[SERVICES.CARD_${index + 1}.TITLE]`,
      description: translation?.DESCRIPTION ?? `[SERVICES.CARD_${index + 1}.DESCRIPTION]`,
    };
  };

  const translatedServices = eventServices.map((service, index) => ({
    ...service,
    ...getServiceTranslation(index),
  }));

  // Build workflow steps with translations
  const workflowSteps: ServiceCard[] = workflowStepsBase.map((step, index) => {
    const stepKey = `STEP_${index + 1}` as keyof typeof t.EVENT_PLANNING.WORKFLOW;
    const translation = t.EVENT_PLANNING?.WORKFLOW?.[stepKey];
    return {
      ...step,
      title: translation?.TITLE ?? `[WORKFLOW.STEP_${index + 1}.TITLE]`,
      description: translation?.DESCRIPTION ?? `[WORKFLOW.STEP_${index + 1}.DESCRIPTION]`,
    };
  });

  return (
    <div className={styles.eventPlanningPage}>
      {/* Hero Section */}
      <HeroSection
        heading={t.EVENT_PLANNING?.HERO?.TAGLINE ?? "[HERO.TAGLINE]"}
        backgroundImage="/images/event-planning/hero-background.jpg"
        backgroundAlt="Event Planning"
        showScrollIndicator={true}
        showDecorativeLine={true}
      />

      <div className={styles.contentContainer}>
        {/* Services Section - Intro, Service Grid, and Workflow */}
        <section className={styles.section} id="our-service">
          <div className={styles.sectionInner}>
            <StudioIntro
              title={t.EVENT_PLANNING?.INTRO?.LABEL ?? "[INTRO.LABEL]"}
              description={t.EVENT_PLANNING?.INTRO?.DESCRIPTION ?? "[INTRO.DESCRIPTION]"}
              ctaText={t.EVENT_PLANNING?.INTRO?.CTA ?? "[INTRO.CTA]"}
            />
            <div id="services">
              <ProductionServiceGrid items={translatedServices} />
            </div>
            <div id="process">
              <QuoteIntro
                label={t.EVENT_PLANNING?.PROCESS?.TITLE ?? "[PROCESS.TITLE]"}
                quote={t.EVENT_PLANNING?.PROCESS?.DESCRIPTION ?? "[PROCESS.DESCRIPTION]"}
              />
              <ServiceCardsCarousel cards={workflowSteps} />
            </div>
          </div>
        </section>

        {/* Project Gallery Section */}
        <section className={styles.gallerySection} id="gallery">
          <div className={styles.gallerySectionInner}>
            <EventProjectGallery projects={eventProjects} />
          </div>
        </section>

        {/* Testimonials Section */}
        <section className={styles.testimonialsSection} id="testimonials">
          <TestimonialsSection
            label={t.EVENT_PLANNING?.TESTIMONIALS?.LABEL ?? "[TESTIMONIALS.LABEL]"}
            title={t.EVENT_PLANNING?.TESTIMONIALS?.TITLE ?? "[TESTIMONIALS.TITLE]"}
            items={testimonialItems}
          />
        </section>

        {/* Contact Section */}
        <div className={styles.contactSectionWrapper} id="contact-form">
          <ContactSection backgroundImageUrl="/images/get-in-touch-bg.jpg" />
        </div>
      </div>
    </div>
  );
}

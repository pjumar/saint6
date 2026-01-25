"use client";

import { HeroSection } from "@/app/components/hero-section/HeroSection";
import { StudioIntro } from "@/app/components/studio-intro/StudioIntro";
import { QuoteIntro } from "@/app/components/quote-intro/QuoteIntro";
import { ContactSection } from "@/app/components/contact-section/ContactSection";
import { ProductionServiceGrid, ProductionServiceItem } from "@/app/components/production-service-grid/ProductionServiceGrid";
import { KeyProjectSection, KeyProjectData } from "@/app/components/key-project-section/KeyProjectSection";
import { ServiceCardsCarousel, ServiceCard } from "@/app/components/service-cards-carousel/ServiceCardsCarousel";
import { useTranslation } from "@/app/contexts/TranslationContext";
import styles from "./Production.module.css";

// Production services data (CMS integration in Phase 8)
const productionServices: ProductionServiceItem[] = [
  {
    id: "campaign-editorial",
    imageUrl: "/images/production/service-campaign.jpg",
    title: "Campaign & Editorial Production",
    description: "We curate bespoke campaigns and editorials that blend artistry, narrative, and timeless sophistication — bringing each brand story to life with cinematic allure.",
  },
  {
    id: "photography-film",
    imageUrl: "/images/production/service-photography.jpg",
    title: "Photography & Film Production",
    description: "From concept to final cut, we deliver high-impact visuals through expert direction, seamless coordination, and creative storytelling.",
  },
  {
    id: "lighting-equipment",
    imageUrl: "/images/production/service-lighting.jpg",
    title: "Lighting & Equipment Rental",
    description: "Premium lighting and state-of-the-art equipment designed to elevate every production with precision, balance, and creative control.",
  },
  {
    id: "makeup-hair",
    imageUrl: "/images/production/service-makeup.jpg",
    title: "Make-up & Hair Stylist",
    description: "Professional beauty services that transform talent and enhance visual storytelling with meticulous attention to detail.",
  },
  {
    id: "location-permits",
    imageUrl: "/images/production/service-location.jpg",
    title: "Location Scouting & Permits",
    description: "We source the perfect locations and handle all permit logistics, ensuring smooth operations from pre-production to wrap.",
  },
  {
    id: "post-production",
    imageUrl: "/images/production/service-postproduction.jpg",
    title: "Post-production Coordination",
    description: "End-to-end post-production management, from editing and color grading to final delivery across all formats.",
  },
];

// Workflow steps base data (translations applied in component)
const workflowStepsBase = [
  { id: "pre-production", imageUrl: "/images/production/workflow-pre-production.jpg", counter: "01." },
  { id: "set-up", imageUrl: "/images/production/workflow-setup.jpg", counter: "02." },
  { id: "shoot-day", imageUrl: "/images/production/workflow-shoot.jpg", counter: "03." },
  { id: "wrap-delivery", imageUrl: "/images/production/workflow-delivery.jpg", counter: "04." },
];

// Key project data (CMS integration in Phase 8)
const keyProjectData: KeyProjectData = {
  projectNumber: "01",
  title: "Giai Nhan Show",
  infoText: "A high-profile production capturing the elegance and artistry of Vietnamese fashion. Our team managed end-to-end production for this campaign, from location scouting to final delivery.",
  team: [
    { role: "Creative Director", name: "Nguyen Van A" },
    { role: "Producer", name: "Tran Thi B" },
    { role: "Director of Photography", name: "Le Van C" },
  ],
  expertise: ["Campaign Production", "Photography", "Post-production"],
  client: "Giai Nhan Studio",
  mainImage: {
    src: "/images/production/key-project-main.jpg",
    alt: "Giai Nhan Show - Main Image",
    width: 1200,
    height: 800,
  },
  testimonial: {
    quote: "Saint Six Studio delivered beyond our expectations. Their attention to detail and creative vision brought our campaign to life in ways we hadn't imagined.",
    author: "Nguyen Van D",
    role: "Creative Director, Giai Nhan",
  },
  galleryImages: [
    {
      src: "/images/production/key-project-gallery-1.jpg",
      alt: "Giai Nhan Show - Gallery 1",
      width: 400,
      height: 600,
    },
    {
      src: "/images/production/key-project-gallery-2.jpg",
      alt: "Giai Nhan Show - Gallery 2",
      width: 600,
      height: 400,
    },
    {
      src: "/images/production/key-project-gallery-3.jpg",
      alt: "Giai Nhan Show - Gallery 3",
      width: 600,
      height: 400,
    },
  ],
};

export default function ProductionPage() {
  const { t } = useTranslation();

  // Get service translations (fallback to hardcoded data)
  const getServiceTranslation = (index: number) => {
    const serviceKey = `CARD_${index + 1}` as keyof typeof t.PRODUCTION.SERVICES;
    const translation = t.PRODUCTION?.SERVICES?.[serviceKey];
    return {
      title: translation?.TITLE || productionServices[index].title,
      description: translation?.DESCRIPTION || productionServices[index].description,
    };
  };

  const translatedServices = productionServices.map((service, index) => ({
    ...service,
    ...getServiceTranslation(index),
  }));

  // Build workflow steps with translations
  const translatedWorkflowSteps: ServiceCard[] = workflowStepsBase.map((step, index) => {
    const stepKey = `STEP_${index + 1}` as keyof typeof t.PRODUCTION.WORKFLOW;
    const translation = t.PRODUCTION?.WORKFLOW?.[stepKey];
    return {
      ...step,
      title: translation?.TITLE ?? `[WORKFLOW.STEP_${index + 1}.TITLE]`,
      description: translation?.DESCRIPTION ?? `[WORKFLOW.STEP_${index + 1}.DESCRIPTION]`,
    };
  });

  return (
    <div className={styles.productionPage}>
      {/* Hero Section */}
      <HeroSection
        heading={t.PRODUCTION?.HERO?.TAGLINE || "Full-Scale Production, Seamless Execution."}
        backgroundImage="/images/production/hero-background.jpg"
        backgroundAlt="Production"
        showScrollIndicator={true}
        showDecorativeLine={true}
      />

      <div className={styles.contentContainer}>
        {/* Services Section - Intro, Service Grid, and Workflow */}
        <section className={styles.section} id="our-service">
          <div className={styles.sectionInner}>
            <StudioIntro
              title={t.PRODUCTION?.INTRO?.LABEL || "Our Service"}
              description={t.PRODUCTION?.INTRO?.DESCRIPTION || "From concept to final delivery, we bring your campaign to life through precision planning, creative direction, and technical mastery."}
              ctaText={t.PRODUCTION?.INTRO?.CTA || "Plan Your Production"}
            />
            <div id="services">
              <ProductionServiceGrid items={translatedServices} />
            </div>
            <div id="workflow">
              <QuoteIntro
                label={t.PRODUCTION?.KEY_PROJECT?.WAY_TITLE || "The Saint 6 Way of Creation"}
                quote={t.PRODUCTION?.KEY_PROJECT?.WAY_DESCRIPTION || "We bring structure to creativity — blending strategic direction, artistic vision, and refined execution to produce visuals that speak luxury, authenticity, and emotion."}
              />
              <ServiceCardsCarousel cards={translatedWorkflowSteps} showAllOnDesktop />
            </div>
          </div>
        </section>

        {/* Key Project Section */}
        <div className={styles.keyProjectWrapper} id="key-project">
          <KeyProjectSection project={keyProjectData} />
        </div>

        {/* Contact Section */}
        <div className={styles.contactSectionWrapper} id="contact-form">
          <ContactSection backgroundImageUrl="/images/get-in-touch-bg.jpg" />
        </div>
      </div>
    </div>
  );
}

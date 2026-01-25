"use client";

import { HeroSection } from "@/app/components/hero-section/HeroSection";
import { StudioIntro } from "@/app/components/studio-intro/StudioIntro";
import { ContactSection } from "@/app/components/contact-section/ContactSection";
import { ProductionServiceGrid, ProductionServiceItem } from "@/app/components/production-service-grid/ProductionServiceGrid";
import { ProductionWorkflow, WorkflowStep } from "@/app/components/production-workflow/ProductionWorkflow";
import { QuoteIntro } from "@/app/components/quote-intro/QuoteIntro";
import { PortfolioSection, PortfolioItem } from "@/app/components/portfolio-section/PortfolioSection";
import { TestimonialsSection, TestimonialItem } from "@/app/components/testimonials-section/TestimonialsSection";
import { SelectedClientsSection } from "@/app/components/selected-clients-section/SelectedClientsSection";
import { useTranslation } from "@/app/contexts/TranslationContext";
import styles from "./Creative.module.css";

// Creative services data (CMS integration in Phase 8)
const creativeServices: ProductionServiceItem[] = [
  {
    id: "brand-advertising",
    imageUrl: "/images/creative/service-advertising.jpg",
    title: "Brand & Advertising Campaigns",
    description: "We produce fashion, lifestyle, editorial, social media, and influencer campaigns that bring brands to life with fresh creative energy.",
  },
  {
    id: "product-packaging",
    imageUrl: "/images/creative/service-packaging.jpg",
    title: "Product & Packaging Shoots",
    description: "From product labels and e-commerce images to packshots and still life, we create polished visuals that elevate packaging, catalogs, and online stores.",
  },
];

// Workflow steps data (CMS integration in Phase 8)
const workflowSteps: WorkflowStep[] = [
  {
    id: "creative-direction",
    imageUrl: "/images/creative/workflow-direction.jpg",
    counter: "01.",
    title: "Creative Direction",
    description: "We study your brief and develop creative directions based on your brand, audience, and goals.",
  },
  {
    id: "storyboard",
    imageUrl: "/images/creative/workflow-storyboard.jpg",
    counter: "02.",
    title: "Storyboard Development",
    description: "Our team creates detailed storyboards and shot lists to visualize the final output.",
  },
  {
    id: "pre-production",
    imageUrl: "/images/creative/workflow-preproduction.jpg",
    counter: "03.",
    title: "Pre-production & Sourcing",
    description: "We coordinate talent, locations, props, and equipment to ensure smooth execution.",
  },
  {
    id: "shoot-production",
    imageUrl: "/images/creative/workflow-shoot.jpg",
    counter: "04.",
    title: "Shoot / Production",
    description: "Our experienced crew captures your vision with precision and creative flair.",
  },
  {
    id: "post-production",
    imageUrl: "/images/creative/workflow-post.jpg",
    counter: "05.",
    title: "Post-production",
    description: "Professional editing, color grading, and retouching bring the final deliverables to life.",
  },
  {
    id: "delivery",
    imageUrl: "/images/creative/workflow-delivery.jpg",
    counter: "06.",
    title: "Final Delivery",
    description: "We deliver polished assets ready for print, digital, and social media deployment.",
  },
];

// Portfolio items data (CMS integration in Phase 8)
const portfolioItems: PortfolioItem[] = [
  {
    id: "fressi-kv",
    imageUrl: "/images/creative/portfolio-fressi.jpg",
    category: "Campaign",
    title: "FRESSI KV",
    size: "large",
  },
  {
    id: "mirinda",
    imageUrl: "/images/creative/portfolio-mirinda.jpg",
    category: "Campaign",
    title: "MIRINDA",
    size: "large",
  },
  {
    id: "den-vau-1",
    imageUrl: "/images/creative/portfolio-denvau-1.jpg",
    category: "Campaign",
    title: "MV DIỄN VIÊN TỒI - ĐEN VÂU",
    size: "short",
  },
  {
    id: "den-vau-2",
    imageUrl: "/images/creative/portfolio-denvau-2.jpg",
    category: "Campaign",
    title: "MV DIỄN VIÊN TỒI - ĐEN VÂU",
    size: "tall",
  },
  {
    id: "den-vau-3",
    imageUrl: "/images/creative/portfolio-denvau-3.jpg",
    category: "Campaign",
    title: "MV DIỄN VIÊN TỒI - ĐEN VÂU",
    size: "tall",
  },
  {
    id: "den-vau-4",
    imageUrl: "/images/creative/portfolio-denvau-4.jpg",
    category: "Campaign",
    title: "MV DIỄN VIÊN TỒI - ĐEN VÂU",
    size: "tall",
  },
  {
    id: "den-vau-5",
    imageUrl: "/images/creative/portfolio-denvau-5.jpg",
    category: "Campaign",
    title: "MV DIỄN VIÊN TỒI - ĐEN VÂU",
    size: "short",
  },
  {
    id: "yamaha",
    imageUrl: "/images/creative/portfolio-yamaha.jpg",
    category: "Campaign",
    title: "YAMAHA SOCIAL LAYOUT",
    size: "short",
  },
];

// Testimonials data (CMS integration in Phase 8)
const testimonialItems: TestimonialItem[] = [
  {
    id: "testimonial-1",
    logoUrl: "/images/brands/brand-01.png",
    logoAlt: "L'OFFICIEL",
    quote: "It's rare to find a studio where creative direction, production, and hospitality all come together. Saint 6 delivered on every front. Our client was blown away.",
    authorName: "Aaron Tan",
    authorTitle: "Creative Director, Elle Vietnam",
  },
  {
    id: "testimonial-2",
    logoUrl: "/images/brands/brand-02.png",
    logoAlt: "Fressi",
    quote: "Saint 6's attention to detail and creative vision transformed our campaign into something truly memorable. The team understood our brand from day one.",
    authorName: "Nguyen Thi Mai",
    authorTitle: "Marketing Director, Fressi Vietnam",
  },
  {
    id: "testimonial-3",
    logoUrl: "/images/brands/brand-03.png",
    logoAlt: "Vinamilk",
    quote: "Working with Saint 6 was seamless. Their production quality and creative approach exceeded our expectations for the product launch.",
    authorName: "Tran Van Duc",
    authorTitle: "Brand Manager, Vinamilk",
  },
  {
    id: "testimonial-4",
    logoUrl: "/images/brands/brand-04.png",
    logoAlt: "Sony",
    quote: "The team's expertise in both creative direction and technical execution made our collaboration incredibly smooth and successful.",
    authorName: "Le Hoang Nam",
    authorTitle: "Creative Lead, Sony Vietnam",
  },
];

export default function CreativePage() {
  const { t } = useTranslation();

  // Get service translations
  const getServiceTranslation = (index: number) => {
    const cardKey = `CARD_${index + 1}` as keyof typeof t.CREATIVE.SERVICES;
    const translation = t.CREATIVE?.SERVICES?.[cardKey];
    return {
      title: translation?.TITLE ?? creativeServices[index].title,
      description: translation?.DESCRIPTION ?? creativeServices[index].description,
    };
  };

  const translatedServices = creativeServices.map((service, index) => ({
    ...service,
    ...getServiceTranslation(index),
  }));

  // Get workflow translations
  const getWorkflowTranslation = (index: number) => {
    const cardKey = `STEP_${index + 1}` as keyof typeof t.CREATIVE.WORKFLOW;
    const translation = t.CREATIVE?.WORKFLOW?.[cardKey];
    return {
      title: translation?.TITLE ?? workflowSteps[index].title,
      description: translation?.DESCRIPTION ?? workflowSteps[index].description,
    };
  };

  const translatedWorkflowSteps = workflowSteps.map((step, index) => ({
    ...step,
    ...getWorkflowTranslation(index),
  }));

  return (
    <div className={styles.creativePage}>
      {/* Hero Section */}
      <HeroSection
        heading={t.CREATIVE?.HERO?.TAGLINE ?? "Creative production for brands, campaigns & products"}
        backgroundImage="/images/creative/hero-background.jpg"
        backgroundAlt="Creative"
        showScrollIndicator={true}
        showDecorativeLine={true}
      />

      <div className={styles.contentContainer}>
        {/* Selected Clients Section */}
        <SelectedClientsSection
          label={t.CREATIVE?.CLIENTS?.LABEL ?? "Selected Clients"}
          description={t.CREATIVE?.CLIENTS?.DESCRIPTION ?? "We're proud to collaborate with leading brands, agencies, and startups worldwide."}
        />

        {/* Services Section */}
        <section className={styles.section} id="services">
          <div className={styles.sectionInner}>
            <ProductionServiceGrid items={translatedServices} />
          </div>
        </section>

        {/* How We Work Section */}
        <section className={styles.section} id="how-we-work">
          <div className={styles.sectionInner}>
            <StudioIntro
              title={t.CREATIVE?.INTRO?.LABEL ?? "How We Work"}
              description={t.CREATIVE?.INTRO?.DESCRIPTION ?? "We can take on full-service production or jump in at any stage — from moodboard and concept development to post-production and final delivery."}
              ctaText={t.CREATIVE?.INTRO?.CTA ?? "Get in touch"}
            />
          </div>
        </section>

        {/* Workflow Section */}
        <section className={styles.workflowSection} id="workflow">
          <div className={styles.workflowSectionInner}>
            <ProductionWorkflow steps={translatedWorkflowSteps} />
          </div>
        </section>

        {/* Portfolio Section */}
        <div className={styles.portfolioWrapper} id="portfolio">
          <PortfolioSection
            label={t.CREATIVE?.PORTFOLIO?.LABEL ?? "Featured Work"}
            statement={t.CREATIVE?.PORTFOLIO?.STATEMENT ?? "Elevated visuals that reflect your brand's ambition — a showcase of artistry and attention to detail."}
            items={portfolioItems}
          />
        </div>

        {/* Testimonials Section */}
        <section className={styles.testimonialsSection} id="testimonials">
          <TestimonialsSection
            label={t.CREATIVE?.TESTIMONIALS?.LABEL ?? "Voices Behind the Lens"}
            title={t.CREATIVE?.TESTIMONIALS?.TITLE ?? "Real experiences from creative professionals who've brought their vision to life at Saint 6 Studio."}
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

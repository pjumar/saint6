"use client";

import { HeroSection } from "@/app/components/hero-section/HeroSection";
import { StudioIntro } from "@/app/components/studio-intro/StudioIntro";
import { ContactSection } from "@/app/components/contact-section/ContactSection";
import { ProductionWorkflow, WorkflowStep } from "@/app/components/production-workflow/ProductionWorkflow";
import { PortfolioSection, PortfolioItem } from "@/app/components/portfolio-section/PortfolioSection";
import { useTranslation } from "@/app/contexts/TranslationContext";
import styles from "./Decoration.module.css";

// Portfolio items data - same structure as Set Design (CMS integration in Phase 8)
const portfolioItems: PortfolioItem[] = [
  {
    id: "fressi-kv",
    imageUrl: "/images/decoration/portfolio-fressi.jpg",
    category: "Fashion Stores",
    title: "FRESSI KV",
    size: "large",
  },
  {
    id: "mirinda",
    imageUrl: "/images/decoration/portfolio-mirinda.jpg",
    category: "Campaign",
    title: "MIRINDA",
    size: "large",
  },
  {
    id: "den-vau-1",
    imageUrl: "/images/decoration/portfolio-denvau-1.jpg",
    category: "Campaign",
    title: "MV DIỄN VIÊN TỒI - ĐEN VÂU",
    size: "short",
  },
  {
    id: "den-vau-2",
    imageUrl: "/images/decoration/portfolio-denvau-2.jpg",
    category: "Campaign",
    title: "MV DIỄN VIÊN TỒI - ĐEN VÂU",
    size: "tall",
  },
  {
    id: "den-vau-3",
    imageUrl: "/images/decoration/portfolio-denvau-3.jpg",
    category: "Campaign",
    title: "MV DIỄN VIÊN TỒI - ĐEN VÂU",
    size: "tall",
  },
  {
    id: "den-vau-4",
    imageUrl: "/images/decoration/portfolio-denvau-4.jpg",
    category: "Campaign",
    title: "MV DIỄN VIÊN TỒI - ĐEN VÂU",
    size: "tall",
  },
  {
    id: "den-vau-5",
    imageUrl: "/images/decoration/portfolio-denvau-5.jpg",
    category: "Campaign",
    title: "MV DIỄN VIÊN TỒI - ĐEN VÂU",
    size: "short",
  },
  {
    id: "yamaha",
    imageUrl: "/images/decoration/portfolio-yamaha.jpg",
    category: "Campaign",
    title: "YAMAHA SOCIAL LAYOUT",
    size: "short",
  },
];

// Decoration workflow steps data (CMS integration in Phase 8)
const decorWorkflowSteps: WorkflowStep[] = [
  {
    id: "brief-overview",
    imageUrl: "/images/decoration/workflow-brief.jpg",
    counter: "01.",
    title: "Brief Overview",
    description: "We study the brief and develop multiple creative directions based on your brand, audience, and goals.",
  },
  {
    id: "2d-ideation",
    imageUrl: "/images/decoration/workflow-2d.jpg",
    counter: "02.",
    title: "2D Ideation",
    description: "Our design team creates detailed mood boards and conceptual layouts to visualize the space transformation.",
  },
  {
    id: "3d-render",
    imageUrl: "/images/decoration/workflow-3d.jpg",
    counter: "03.",
    title: "3D Render",
    description: "We produce photorealistic 3D renders so you can experience the space before construction begins.",
  },
  {
    id: "pre-production",
    imageUrl: "/images/decoration/workflow-preproduction.jpg",
    counter: "04.",
    title: "Pre-Production",
    description: "We coordinate materials, vendors, and timelines to ensure smooth execution of your project.",
  },
  {
    id: "final-installation",
    imageUrl: "/images/decoration/workflow-installation.jpg",
    counter: "05.",
    title: "Final Installation",
    description: "Our team manages the complete installation, bringing every detail to life with precision.",
  },
];

export default function DecorationPage() {
  const { t } = useTranslation();

  // Get workflow translations
  const getWorkflowTranslation = (index: number) => {
    const cardKey = `CARD_${index + 1}` as keyof typeof t.DECORATION.SERVICES;
    const translation = t.DECORATION?.SERVICES?.[cardKey];
    return {
      title: translation?.TITLE ?? decorWorkflowSteps[index].title,
      description: translation?.DESCRIPTION ?? decorWorkflowSteps[index].description,
    };
  };

  const translatedWorkflowSteps = decorWorkflowSteps.map((step, index) => ({
    ...step,
    ...getWorkflowTranslation(index),
  }));

  return (
    <div className={styles.decorationPage}>
      {/* Hero Section */}
      <HeroSection
        heading={t.DECORATION?.HERO?.TAGLINE ?? "From flagship stores to private villas — we design and decorate spaces that tell a story."}
        backgroundImage="/images/decoration/hero-background.jpg"
        backgroundAlt="Decoration"
        showScrollIndicator={true}
        showDecorativeLine={true}
      />

      <div className={styles.contentContainer}>
        {/* Intro Section - How We Work */}
        <section className={styles.section} id="how-we-work">
          <div className={styles.sectionInner}>
            <StudioIntro
              title={t.DECORATION?.INTRO?.LABEL ?? "How We Work"}
              description={t.DECORATION?.INTRO?.DESCRIPTION ?? "The name \"Decor\" feels refined and adaptable, representing Saint 6's creative work across fashion stores, restaurants, and personal villas."}
              ctaText={t.DECORATION?.INTRO?.CTA ?? "Plan Your Decoration"}
            />
          </div>
        </section>

        {/* Workflow Section - Service Cards */}
        <section className={styles.workflowSection} id="services">
          <div className={styles.workflowSectionInner}>
            <ProductionWorkflow steps={translatedWorkflowSteps} />
          </div>
        </section>

        {/* Portfolio Section - Reuses PortfolioSection component from Set Design */}
        <div className={styles.portfolioWrapper} id="portfolio">
          <PortfolioSection
            label={t.DECORATION?.PORTFOLIO?.LABEL ?? "every moment, an emotion"}
            statement={t.DECORATION?.PORTFOLIO?.QUOTE ?? "Every project begins with a vision. We bring it to life — detail by detail."}
            items={portfolioItems}
          />
        </div>

        {/* Contact Section */}
        <div className={styles.contactSectionWrapper} id="contact-form">
          <ContactSection backgroundImageUrl="/images/get-in-touch-bg.jpg" />
        </div>
      </div>
    </div>
  );
}

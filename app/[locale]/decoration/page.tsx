"use client";

import { HeroSection } from "@/app/components/hero-section/HeroSection";
import { StudioIntro } from "@/app/components/studio-intro/StudioIntro";
import { ContactSection } from "@/app/components/contact-section/ContactSection";
import { ProductionWorkflow, WorkflowStep } from "@/app/components/production-workflow/ProductionWorkflow";
import { useTranslation } from "@/app/contexts/TranslationContext";
import styles from "./Decoration.module.css";

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

        {/* Contact Section */}
        <div className={styles.contactSectionWrapper} id="contact-form">
          <ContactSection backgroundImageUrl="/images/get-in-touch-bg.jpg" />
        </div>
      </div>
    </div>
  );
}

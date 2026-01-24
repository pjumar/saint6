"use client";

import { HeroSection } from "@/app/components/hero-section/HeroSection";
import { StudioIntro } from "@/app/components/studio-intro/StudioIntro";
import { ContactSection } from "@/app/components/contact-section/ContactSection";
import { useTranslation } from "@/app/contexts/TranslationContext";
import styles from "./Decoration.module.css";

export default function DecorationPage() {
  const { t } = useTranslation();

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

        {/* Contact Section */}
        <div className={styles.contactSectionWrapper} id="contact-form">
          <ContactSection backgroundImageUrl="/images/get-in-touch-bg.jpg" />
        </div>
      </div>
    </div>
  );
}

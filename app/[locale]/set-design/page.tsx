"use client";

import { HeroSection } from "@/app/components/hero-section/HeroSection";
import { StudioIntro } from "@/app/components/studio-intro/StudioIntro";
import { ContactSection } from "@/app/components/contact-section/ContactSection";
import { useTranslation } from "@/app/contexts/TranslationContext";
import styles from "./SetDesign.module.css";

export default function SetDesignPage() {
  const { t } = useTranslation();

  return (
    <div className={styles.setDesignPage}>
      {/* Hero Section */}
      <HeroSection
        heading={t.SET_DESIGN?.HERO?.TAGLINE || "From Moodboard to Build — Complete Set Design for Visual Storytelling"}
        backgroundImage="/images/set-design/hero-background.jpg"
        backgroundAlt="Set Design"
        showScrollIndicator={true}
        showDecorativeLine={true}
      />

      <div className={styles.contentContainer}>
        {/* How It Works Intro Section */}
        <section className={styles.section} id="how-it-works">
          <div className={styles.sectionInner}>
            <StudioIntro
              title={t.SET_DESIGN?.INTRO?.TITLE || "How We Work"}
              description={t.SET_DESIGN?.INTRO?.DESCRIPTION || "We design, construct, and manage physical sets that transform creative direction into production-ready environments."}
              ctaText={t.SET_DESIGN?.INTRO?.CTA || "Get in touch"}
            />
          </div>
        </section>

        {/* Service Capability Cards - Placeholder */}
        <section className={styles.section} id="services">
          <div className={styles.sectionInner}>
            <div className={styles.serviceCardsPlaceholder}>
              <p>Service capability cards will be added in Task 2</p>
            </div>
          </div>
        </section>

        {/* Portfolio Section - Placeholder */}
        <section className={styles.section} id="portfolio">
          <div className={styles.sectionInner}>
            <div className={styles.portfolioPlaceholder}>
              <p>Portfolio section will be added in Task 3</p>
            </div>
          </div>
        </section>

        {/* Testimonials Section - Placeholder */}
        <section className={styles.section} id="testimonials">
          <div className={styles.sectionInner}>
            <div className={styles.testimonialsPlaceholder}>
              <p>Testimonials section will be added in Task 4</p>
            </div>
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

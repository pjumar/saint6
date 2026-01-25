"use client";

import Image from "next/image";
import { HeroSection } from "@/app/components/hero-section/HeroSection";
import { AboutIntro } from "@/app/components/about-intro/AboutIntro";
import { HighlightBand } from "@/app/components/highlight-band/HighlightBand";
import { ValuesGrid, ValueItem } from "@/app/components/values-grid/ValuesGrid";
import { OurStory } from "@/app/components/our-story/OurStory";
import { ServiceCardsCarousel, ServiceCard } from "@/app/components/service-cards-carousel/ServiceCardsCarousel";
import { FounderQuote } from "@/app/components/founder-quote/FounderQuote";
import { ContactSection } from "@/app/components/contact-section/ContactSection";
import { useTranslation } from "@/app/contexts/TranslationContext";
import styles from "./About.module.css";

// Values data (CMS integration in Phase 8)
const valuesData: ValueItem[] = [
  {
    id: "simplicity",
    imageUrl: "/images/about/value-simplicity.jpg",
    title: "Simplicity",
    description: "Clarity reveals emotion.",
  },
  {
    id: "authenticity",
    imageUrl: "/images/about/value-authenticity.jpg",
    title: "Authenticity",
    description: "Emotion must be real, not manufactured.",
  },
  {
    id: "intention",
    imageUrl: "/images/about/value-intention.jpg",
    title: "Intention",
    description: "Every choice serves the feeling.",
  },
  {
    id: "narrative",
    imageUrl: "/images/about/value-narrative.jpg",
    title: "Narrative",
    description: "Everything is part of the story.",
  },
  {
    id: "trust",
    imageUrl: "/images/about/value-trust.jpg",
    title: "Trust",
    description: "Art needs reliability to thrive.",
  },
  {
    id: "sixth-sense",
    imageUrl: "/images/about/value-sixth-sense.jpg",
    title: "Sixth Sense",
    description: "We design for the feeling beneath the brief.",
  },
];

// Services/capabilities data for carousel (CMS integration in Phase 8)
const servicesData: ServiceCard[] = [
  {
    id: "studio-rental",
    imageUrl: "/images/about/service-studio.jpg",
    counter: "01.",
    title: "Studio Rental",
    description: "Professional spaces designed for creative excellence, from intimate shoots to large-scale productions.",
  },
  {
    id: "set-design",
    imageUrl: "/images/about/service-set-design.jpg",
    counter: "02.",
    title: "Set Design",
    description: "Custom environments built to tell your story, from concept through construction.",
  },
  {
    id: "production",
    imageUrl: "/images/about/service-production.jpg",
    counter: "03.",
    title: "Production",
    description: "Full-service production from pre to post, ensuring every detail serves your vision.",
  },
  {
    id: "event-planning",
    imageUrl: "/images/about/service-events.jpg",
    counter: "04.",
    title: "Event Planning",
    description: "Curated experiences designed to create lasting emotional connections.",
  },
  {
    id: "decor",
    imageUrl: "/images/about/service-decor.jpg",
    counter: "05.",
    title: "Decor",
    description: "Interior styling for spaces that need to feel as good as they look.",
  },
  {
    id: "creative",
    imageUrl: "/images/about/service-creative.jpg",
    counter: "06.",
    title: "Creative",
    description: "Brand campaigns and visual content that resonate with your audience.",
  },
];

export default function AboutPage() {
  const { t } = useTranslation();

  // Get translated values (using fallback to default data)
  const getValueTranslation = (index: number) => {
    const itemKey = `ITEM_${index + 1}` as keyof typeof t.ABOUT_US.VALUES;
    const translation = (t as { ABOUT_US?: { VALUES?: Record<string, { TITLE?: string; DESCRIPTION?: string }> } }).ABOUT_US?.VALUES?.[itemKey];
    return {
      title: translation?.TITLE ?? valuesData[index].title,
      description: translation?.DESCRIPTION ?? valuesData[index].description,
    };
  };

  const translatedValues = valuesData.map((value, index) => ({
    ...value,
    ...getValueTranslation(index),
  }));

  // Get translated services (using fallback to default data)
  const getServiceTranslation = (index: number) => {
    const itemKey = `ITEM_${index + 1}` as keyof typeof t.ABOUT_US.SERVICES;
    const translation = (t as { ABOUT_US?: { SERVICES?: Record<string, { TITLE?: string; DESCRIPTION?: string }> } }).ABOUT_US?.SERVICES?.[itemKey];
    return {
      title: translation?.TITLE ?? servicesData[index].title,
      description: translation?.DESCRIPTION ?? servicesData[index].description,
    };
  };

  const translatedServices = servicesData.map((service, index) => ({
    ...service,
    ...getServiceTranslation(index),
  }));

  // Access translations with fallbacks
  const aboutTranslations = (t as { ABOUT_US?: Record<string, unknown> }).ABOUT_US || {};

  return (
    <div className={styles.aboutPage}>
      {/* 1. Hero Section */}
      <HeroSection
        heading={(aboutTranslations.HERO as { TAGLINE?: string })?.TAGLINE ?? "We Imagine. We Design. We Create."}
        backgroundImage="/images/about/hero-background.jpg"
        backgroundAlt="About Saint 6 Studio"
        showScrollIndicator={true}
        showDecorativeLine={true}
      />

      <div className={styles.contentContainer}>
        {/* 2. About Intro Section */}
        <AboutIntro
          label={(aboutTranslations.INTRO as { LABEL?: string })?.LABEL ?? "ABOUT US"}
          headline={(aboutTranslations.INTRO as { HEADLINE?: string })?.HEADLINE ?? "We are a studio of artists, builders, stylists, dreamers, problem solvers, and storytellers.\nWe turn ideas into places, feelings, and memories."}
          bodyText={[
            (aboutTranslations.INTRO as { BODY_1?: string })?.BODY_1 ?? "Saint 6 Studios, founded by Trang Nhe Nhang, is a multi-disciplinary creative studio crafting sets, spaces, environments, and experiences.",
            (aboutTranslations.INTRO as { BODY_2?: string })?.BODY_2 ?? "We create work that feels alive, work that holds emotion, atmosphere, and story. For us, it's never \"just decor.\" It's the feeling someone carries home.",
          ]}
          imageUrl="/images/about/intro-portrait.jpg"
          imageAlt="Saint 6 Studio portrait"
        />

        {/* 3. Vision Band */}
        <HighlightBand
          label={(aboutTranslations.VISION as { LABEL?: string })?.LABEL ?? "VISION"}
          statement={(aboutTranslations.VISION as { STATEMENT?: string })?.STATEMENT ?? "To create work that is remembered through the feelings it evokes."}
        />

        {/* 4. Full-width image */}
        <div className={styles.fullWidthImage}>
          <Image
            src="/images/about/full-width-image.jpg"
            alt="Saint 6 Studio work"
            fill
            className={styles.fullWidthImageImg}
            sizes="100vw"
          />
        </div>

        {/* 5. Mission Band */}
        <HighlightBand
          label={(aboutTranslations.MISSION as { LABEL?: string })?.LABEL ?? "MISSION"}
          statement={(aboutTranslations.MISSION as { STATEMENT?: string })?.STATEMENT ?? "We transform ideas, identities, and stories into visual experiences that move people."}
        />

        {/* 6. Values Grid */}
        <ValuesGrid values={translatedValues} />

        {/* 7. Our Story */}
        <OurStory
          label={(aboutTranslations.OUR_STORY as { LABEL?: string })?.LABEL ?? "Our Story"}
          paragraphs={[
            (aboutTranslations.OUR_STORY as { PARAGRAPH_1?: string })?.PARAGRAPH_1 ?? "Before Saint 6, there was Haus of Trang - where Trang learned that styling is not only about how things look, but how they make people feel.",
            (aboutTranslations.OUR_STORY as { PARAGRAPH_2?: string })?.PARAGRAPH_2 ?? "That realization became the foundation of Saint 6",
          ]}
        />

        {/* 8. Services Carousel */}
        <section className={styles.servicesSection}>
          <ServiceCardsCarousel cards={translatedServices} />
        </section>

        {/* 9. Founder Quote */}
        <FounderQuote
          imageUrl="/images/about/founder-portrait.jpg"
          quote={(aboutTranslations.FOUNDER as { QUOTE?: string })?.QUOTE ?? "Creation is emotional work. We build spaces for people to feel something real."}
          name={(aboutTranslations.FOUNDER as { NAME?: string })?.NAME ?? "Trang"}
          title={(aboutTranslations.FOUNDER as { TITLE?: string })?.TITLE ?? "Founder & Creative Director"}
        />

        {/* 10. Contact Section */}
        <div className={styles.contactSectionWrapper}>
          <ContactSection backgroundImageUrl="/images/get-in-touch-bg.jpg" />
        </div>
      </div>
    </div>
  );
}

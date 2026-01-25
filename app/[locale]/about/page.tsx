"use client";

import Image from "next/image";
import { HeroSection } from "@/app/components/hero-section/HeroSection";
import { AboutIntro } from "@/app/components/about-intro/AboutIntro";
import { HighlightBand } from "@/app/components/highlight-band/HighlightBand";
import { ValuesGrid, ValueItem, StoryContent } from "@/app/components/values-grid/ValuesGrid";
import { ServiceCardsCarousel, ServiceCard } from "@/app/components/service-cards-carousel/ServiceCardsCarousel";
import { FounderQuote } from "@/app/components/founder-quote/FounderQuote";
import { ContactSection } from "@/app/components/contact-section/ContactSection";
import { useTranslation } from "@/app/contexts/TranslationContext";
import styles from "./About.module.css";

// Values data (CMS integration in Phase 8)
const valuesData: ValueItem[] = [
  {
    id: "simplicity",
    letter: "S",
    title: "Simplicity",
    description: "Clarity reveals emotion.",
  },
  {
    id: "authenticity",
    letter: "A",
    title: "Authenticity",
    description: "Emotion must be real, not manufactured.",
  },
  {
    id: "intention",
    letter: "I",
    title: "Intention",
    description: "Every choice serves the feeling.",
  },
  {
    id: "narrative",
    letter: "N",
    title: "Narrative",
    description: "Everything is part of the story.",
  },
  {
    id: "trust",
    letter: "T",
    title: "Trust",
    description: "Art needs reliability to thrive.",
  },
  {
    id: "sixth-sense",
    letter: "6",
    title: "Sixth Sense",
    description: "We design for the feeling beneath the brief.",
  },
];

// Timeline data for carousel (CMS integration in Phase 8)
const timelineData: ServiceCard[] = [
  {
    id: "2021",
    imageUrl: "/images/about-us/timeline-2021.jpg",
    counter: "2021",
    title: "",
    description: "Saint 6 was founded with the belief that beauty is emotional, not ornamental.",
  },
  {
    id: "2022",
    imageUrl: "/images/about-us/timeline-2022.jpg",
    counter: "2022",
    title: "",
    description: "The first Saint 6 studio space was built — a home for creation, experimentation, and community.",
  },
  {
    id: "2023",
    imageUrl: "/images/about-us/timeline-2023.jpg",
    counter: "2023",
    title: "",
    description: "We expanded into store décor and spatial brand environments, shaping how customers feel inside a space.",
  },
  {
    id: "2024",
    imageUrl: "/images/about-us/timeline-2024.jpg",
    counter: "2024",
    title: "",
    description: "We began designing events and weddings, translating personal stories into atmospheres.",
  },
  {
    id: "2025",
    imageUrl: "/images/about-us/timeline-2025.jpg",
    counter: "2025",
    title: "",
    description: "We surpassed 1,000 set designs created since our founding — from intimate shoots to major brand activations.",
  },
  {
    id: "2026",
    imageUrl: "/images/about-us/timeline-2026.jpg",
    counter: "2026 (Next)",
    title: "",
    description: "We are opening a second Saint 6 location, expanding our creative capacity and community.",
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

  // Get translated timeline (using fallback to default data)
  const getTimelineTranslation = (index: number) => {
    const itemKey = `ITEM_${index + 1}` as keyof typeof t.ABOUT_US.TIMELINE;
    const translation = (t as { ABOUT_US?: { TIMELINE?: Record<string, { DESCRIPTION?: string }> } }).ABOUT_US?.TIMELINE?.[itemKey];
    return {
      description: translation?.DESCRIPTION ?? timelineData[index].description,
    };
  };

  const translatedTimeline = timelineData.map((item, index) => ({
    ...item,
    ...getTimelineTranslation(index),
  }));

  // Access translations with fallbacks
  const aboutTranslations = (t as { ABOUT_US?: Record<string, unknown> }).ABOUT_US || {};

  return (
    <div className={styles.aboutPage}>
      {/* 1. Hero Section */}
      <HeroSection
        heading={(aboutTranslations.HERO as { TAGLINE?: string })?.TAGLINE ?? "We Imagine. We Design. We Create."}
        backgroundImage="/images/about-us/hero-background.jpg"
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
          imageUrl="/images/about-us/intro-portrait.jpg"
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
            src="/images/about-us/full-width-image.jpg"
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

        {/* 6. Values Grid with Our Story */}
        <ValuesGrid
          values={translatedValues}
          story={{
            label: (aboutTranslations.OUR_STORY as { LABEL?: string })?.LABEL ?? "Our Story",
            paragraphs: [
              (aboutTranslations.OUR_STORY as { PARAGRAPH_1?: string })?.PARAGRAPH_1 ?? "Before Saint 6, there was Haus of Trang - where Trang learned that styling is not only about how things look, but how they make people feel.",
              (aboutTranslations.OUR_STORY as { PARAGRAPH_2?: string })?.PARAGRAPH_2 ?? "That realization became the foundation of Saint 6",
            ],
          }}
        />

        {/* 7. Timeline Carousel */}
        <section className={styles.servicesSection}>
          <div className={styles.servicesSectionInner}>
            <ServiceCardsCarousel cards={translatedTimeline} />
          </div>
        </section>

        {/* 9. Founder Quote */}
        <FounderQuote
          imageUrl="/images/about-us/founder-portrait.jpg"
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

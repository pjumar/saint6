"use client";

import {
  CrewAreaSection,
  type CrewAreaSectionProps,
} from "@/app/components/crew-area-section/CrewAreaSection";
import { GallerySection } from "@/app/components/gallery-section/GallerySection";
import { HeroSection } from "@/app/components/hero-section/HeroSection";
import {
  type KeyProjectData,
  KeyProjectSection,
} from "@/app/components/key-project-section/KeyProjectSection";
import {
  SpaceSection,
  type SpaceSectionProps,
} from "@/app/components/space-section/SpaceSection";
import { TrustedBySection } from "@/app/components/trusted-by-section/TrustedBySection";
import { useTranslation } from "@/app/contexts/TranslationContext";
import styles from "@/app/page.module.css";

// TODO: Replace with actual CMS data fetching
// Example data structures - replace these with your CMS data

const exampleSpaceData: Omit<SpaceSectionProps, "ctaLink"> = {
  caption: "WIDE RANGE OF SPACE",
  description:
    "900m² of modular creative space, designed to support everything from fashion editorials to livestreams and events. With a range of customizable sets and zones, SAINT 6 adapts to your imagination.",
  ctaText: "VIEW STUDIO RENTAL",
  stats: [
    { label: "Total Rooms", value: "6" },
    { label: "Blank Rooms", value: "3" },
    { label: "Concept Room", value: "3" },
    { label: "Ceiling Height", value: "4.5m" },
    { label: "Total Space", value: "900m²" },
  ],
  galleryImages: [
    { src: "/images/space/space-01.png", alt: "Studio space 1" },
    { src: "/images/space/space-02.png", alt: "Studio space 2" },
    { src: "/images/space/space-03.png", alt: "Studio space 3" },
    { src: "/images/space/space-04.png", alt: "Studio space 4" },
  ],
};

const exampleCrewAreaData: CrewAreaSectionProps = {
  caption: "CREW AREA",
  heading:
    "And a separate dining area and makeup room for the crew and customers",
  infoLabel: "INFO",
  infoText:
    "Indulge in a dedicated dining space and a professional makeup room—curated for comfort, privacy, and effortless preparation throughout your production.",
  mainImage: {
    src: "/images/crew/crew-main.png",
    alt: "Dining area with outdoor seating",
  },
  secondaryImage1: {
    src: "/images/crew/crew-01.png",
    alt: "Professional makeup room",
  },
  secondaryImage2: {
    src: "/images/crew/crew-02.png",
    alt: "Makeup station",
  },
};

const exampleProjectData: KeyProjectData = {
  projectNumber: "01/03",
  title: "LSoul Casting call for Shaghai Fashion Week 2025",
  infoText:
    "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
  team: [
    { role: "Photo", name: "Linh Phạm" },
    { role: "Fashion Director", name: "Trần Đạt" },
    { role: "Set design production", name: "SAINT6 Production" },
  ],
  expertise: ["Set Design", "Production", "Location"],
  client: "LSoul",
  mainImage: {
    src: "/images/project/project-main.jpg",
    alt: "LSoul Casting call for Shaghai Fashion Week 2025",
    width: 440,
    height: 297,
  },
  testimonial: {
    quote:
      "Spacious, modular, with the energy and tools that serious creatives need.",
    author: "Crish Phan",
    role: "Creative Director at LSoul",
  },
  galleryImages: [
    {
      src: "/images/project/project-01.jpg",
      alt: "",
      width: 161,
      height: 287,
    },
    {
      src: "/images/project/project-02.jpg",
      alt: "",
      width: 219,
      height: 138,
    },
    {
      src: "/images/project/project-03.jpg",
      alt: "",
      width: 219,
      height: 137,
    },
  ],
};

export default function Home() {
  const { t } = useTranslation();

  return (
    <div className={styles.homepage}>
      <HeroSection
        heading={t.HERO.HEADING}
        backgroundImage="/images/hero/hero-background.jpg"
        backgroundAlt="Hero background"
        showScrollIndicator={true}
        showDecorativeLine={true}
      />
      <div className={styles.contentContainer}>
        <TrustedBySection />
        <GallerySection />
        <KeyProjectSection project={exampleProjectData} />
        <SpaceSection {...exampleSpaceData} ctaLink="/studio-rental" />
        <CrewAreaSection {...exampleCrewAreaData} />
      </div>
    </div>
  );
}

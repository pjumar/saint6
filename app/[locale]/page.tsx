"use client";

import { HeroSection } from "@/app/components/hero-section/HeroSection";
import { TrustedBySection } from "@/app/components/trusted-by-section/TrustedBySection";
import { GallerySection } from "@/app/components/gallery-section/GallerySection";
import {
  KeyProjectSection,
  type KeyProjectData,
} from "@/app/components/key-project-section/KeyProjectSection";
import { useTranslation } from "@/app/contexts/TranslationContext";
import styles from "@/app/page.module.css";

// TODO: Replace with actual CMS data fetching
// Example project data structure - replace this with your CMS data
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
      </div>
    </div>
  );
}


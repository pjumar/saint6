/**
 * Fallback data for development when Strapi CMS is unavailable.
 * This data is used ONLY in development mode for local testing.
 * In production builds, Strapi must be available.
 */

import type { SpaceSectionProps } from "@/app/components/space-section/SpaceSection";
import type { CrewAreaSectionProps } from "@/app/components/crew-area-section/CrewAreaSection";
import type { KeyProjectData } from "@/app/components/key-project-section/KeyProjectSection";
import type { BrandLogo } from "@/app/components/trusted-by-section/TrustedBySection";
import type { GalleryImage } from "@/app/components/gallery-section/GallerySection";

// ============================================================================
// Hero Fallback Data
// ============================================================================

export const FALLBACK_HERO = {
  heading: "The place where all your concepts and artistic ideas can come true",
  backgroundImage: "/images/hero/hero-background.jpg",
  backgroundAlt: "Hero background",
};

// ============================================================================
// Brand Logos Fallback Data
// ============================================================================

export const FALLBACK_BRAND_LOGOS: BrandLogo[] = [
  { id: "1", src: "/images/brands/brand-01.png", alt: "L'OFFICIEL", width: 170, height: 35 },
  { id: "2", src: "/images/brands/brand-02.png", alt: "Lenskart", width: 138, height: 40 },
  { id: "3", src: "/images/brands/brand-03.png", alt: "Vinamilk", width: 98, height: 32 },
  { id: "4", src: "/images/brands/brand-04.png", alt: "SONY", width: 114, height: 20 },
  { id: "5", src: "/images/brands/brand-05.png", alt: "VinFast", width: 128, height: 32 },
];

// ============================================================================
// Gallery Fallback Data
// ============================================================================

export const FALLBACK_GALLERY_IMAGES: GalleryImage[] = [
  { id: "1", src: "/images/gallery/gallery-01.jpg", alt: "Gallery image 1" },
  { id: "2", src: "/images/gallery/gallery-02.jpg", alt: "Gallery image 2" },
  { id: "3", src: "/images/gallery/gallery-03.jpg", alt: "Gallery image 3" },
  { id: "4", src: "/images/gallery/gallery-04.jpg", alt: "Gallery image 4" },
  { id: "5", src: "/images/gallery/gallery-05.jpg", alt: "Gallery image 5" },
  { id: "6", src: "/images/gallery/gallery-06.jpg", alt: "Gallery image 6" },
  { id: "7", src: "/images/gallery/gallery-07.jpg", alt: "Gallery image 7" },
  { id: "8", src: "/images/gallery/gallery-08.jpg", alt: "Gallery image 8" },
  { id: "9", src: "/images/gallery/gallery-09.jpg", alt: "Gallery image 9" },
  { id: "10", src: "/images/gallery/gallery-10.jpg", alt: "Gallery image 10" },
  { id: "11", src: "/images/gallery/gallery-11.jpg", alt: "Gallery image 11" },
  { id: "12", src: "/images/gallery/gallery-12.jpg", alt: "Gallery image 12" },
  { id: "13", src: "/images/gallery/gallery-13.jpg", alt: "Gallery image 13" },
  { id: "14", src: "/images/gallery/gallery-14.jpg", alt: "Gallery image 14" },
  { id: "15", src: "/images/gallery/gallery-15.jpg", alt: "Gallery image 15" },
];

// ============================================================================
// Space Section Fallback Data
// ============================================================================

export const FALLBACK_SPACE_DATA: Omit<SpaceSectionProps, "ctaLink"> = {
  caption: "WIDE RANGE OF SPACE",
  description:
    "900m\u00B2 of modular creative space, designed to support everything from fashion editorials to livestreams and events. With a range of customizable sets and zones, SAINT 6 adapts to your imagination.",
  ctaText: "VIEW STUDIO RENTAL",
  stats: [
    { label: "Total Rooms", value: "6" },
    { label: "Blank Rooms", value: "3" },
    { label: "Concept Room", value: "3" },
    { label: "Ceiling Height", value: "4.5m" },
    { label: "Total Space", value: "900m\u00B2" },
  ],
  galleryImages: [
    { src: "/images/space/space-01.png", alt: "Studio space 1" },
    { src: "/images/space/space-02.png", alt: "Studio space 2" },
    { src: "/images/space/space-03.png", alt: "Studio space 3" },
    { src: "/images/space/space-04.png", alt: "Studio space 4" },
  ],
};

// ============================================================================
// Crew Area Fallback Data
// ============================================================================

export const FALLBACK_CREW_AREA_DATA: CrewAreaSectionProps = {
  caption: "CREW AREA",
  heading:
    "And a separate dining area and makeup room for the crew and customers",
  infoLabel: "INFO",
  infoText:
    "Indulge in a dedicated dining space and a professional makeup room\u2014curated for comfort, privacy, and effortless preparation throughout your production.",
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

// ============================================================================
// Key Project Fallback Data
// ============================================================================

export const FALLBACK_PROJECT_DATA: KeyProjectData = {
  projectNumber: "01/03",
  title: "LSoul Casting call for Shanghai Fashion Week 2025",
  infoText:
    "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
  team: [
    { role: "Photo", name: "Linh Pham" },
    { role: "Fashion Director", name: "Tran Dat" },
    { role: "Set design production", name: "SAINT6 Production" },
  ],
  expertise: ["Set Design", "Production", "Location"],
  client: "LSoul",
  mainImage: {
    src: "/images/project/project-main.jpg",
    alt: "LSoul Casting call for Shanghai Fashion Week 2025",
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

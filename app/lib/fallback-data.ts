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
  { id: "1", src: "/images/brands/lenskart.png", alt: "Lenskart", width: 138, height: 40 },
  { id: "2", src: "/images/brands/lofficiel.png", alt: "L'Officiel", width: 170, height: 35 },
  { id: "3", src: "/images/brands/vinamilk.png", alt: "Vinamilk", width: 98, height: 32 },
  { id: "4", src: "/images/brands/sony.png", alt: "Sony", width: 114, height: 20 },
  { id: "5", src: "/images/brands/vinfast.png", alt: "VinFast", width: 128, height: 32 },
  { id: "6", src: "/images/brands/miss-cosmo.png", alt: "Miss Cosmo", width: 120, height: 35 },
  { id: "7", src: "/images/brands/harpers-bazaar.png", alt: "Harper's Bazaar", width: 140, height: 30 },
  { id: "8", src: "/images/brands/highlands-coffee.png", alt: "Highlands Coffee", width: 100, height: 40 },
  { id: "9", src: "/images/brands/maybelline.png", alt: "Maybelline New York", width: 130, height: 35 },
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
// Studio Rental Fallback Data
// ============================================================================

export const FALLBACK_STUDIO_HERO = {
  heading: "Your creative playground",
  backgroundImage: "/images/studio-rental/hero-background.jpg",
  backgroundAlt: "Studio Rental",
};

export const FALLBACK_STUDIO_INTRO = {
  title: "How It Works",
  description:
    "Because your vision deserves more than a space— It needs a stage, a story, and a studio that moves with you.",
  ctaText: "Get in touch",
  ctaLink: "#contact-form",
};

export const FALLBACK_STUDIO_STATS = {
  totalRooms: 6,
  ceilingHeight: "4.5m",
  totalSpace: "900m²",
  blankRooms: 3,
  conceptRooms: 3,
};

export const FALLBACK_STUDIO_ROOMS = [
  {
    id: "loft",
    title: "The Loft",
    pricePerHour: "450,000",
    counter: "01/06",
    space: "125m²",
    width: "6m",
    ceilingHeight: "4.5m",
    description:
      "Perfect for editorial shoots, interviews, and minimalist campaigns.",
    imageUrl: "/images/rooms/loft.jpg",
  },
  {
    id: "studio",
    title: "The Studio",
    pricePerHour: "800,000",
    counter: "02/06",
    space: "125m²",
    width: "6m",
    ceilingHeight: "4.5m",
    description:
      "Perfect for editorial shoots, interviews, and minimalist campaigns.",
    imageUrl: "/images/rooms/studio.jpg",
  },
  {
    id: "arena",
    title: "The Arena",
    pricePerHour: "850,000",
    counter: "03/06",
    space: "125m²",
    width: "6m",
    ceilingHeight: "4.5m",
    description:
      "Perfect for editorial shoots, interviews, and minimalist campaigns.",
    imageUrl: "/images/rooms/arena.jpg",
  },
];

export const FALLBACK_CONCEPT_ROOMS = [
  {
    id: "concept1",
    title: "Concept room 1",
    pricePerHour: "450,000",
    counter: "04/06",
    space: "125m²",
    width: "6m",
    ceilingHeight: "4.5m",
    description: "Seasonal themed room for unique creative concepts.",
    imageUrl: "/images/rooms/concept1.jpg",
  },
  {
    id: "concept2",
    title: "Concept room 2",
    pricePerHour: "450,000",
    counter: "05/06",
    space: "125m²",
    width: "6m",
    ceilingHeight: "4.5m",
    description: "Seasonal themed room for unique creative concepts.",
    imageUrl: "/images/rooms/concept2.jpg",
  },
  {
    id: "concept3",
    title: "Concept room 3",
    pricePerHour: "450,000",
    counter: "06/06",
    space: "125m²",
    width: "6m",
    ceilingHeight: "4.5m",
    description: "Seasonal themed room for unique creative concepts.",
    imageUrl: "/images/rooms/concept3.jpg",
  },
];

export const FALLBACK_FULL_RENTAL = {
  price: "2,500,000",
  backgroundImageUrl: "/images/full-studio-bg.jpg",
};

export const FALLBACK_FACILITIES = {
  makeupImageUrl: "/images/facilities/makeup-room.jpg",
  loungeImageUrl: "/images/facilities/dining-lounge.jpg",
};

export const FALLBACK_EQUIPMENT = [
  {
    id: "godox",
    name: "Godox Light",
    spec: "QS 800 | QS 1200",
    imageUrl: "/images/equipment/godox-light.jpg",
  },
  {
    id: "softbox-80x120",
    name: "2x Softbox",
    spec: "80X120CM",
    imageUrl: "/images/equipment/softbox-1.jpg",
  },
  {
    id: "softbox-30x160",
    name: "2x Softbox",
    spec: "30X160CM",
    imageUrl: "/images/equipment/softbox-2.jpg",
  },
  {
    id: "parabolic",
    name: "1x Parabolic",
    spec: "120CM",
    imageUrl: "/images/equipment/parabolic.jpg",
  },
  {
    id: "softbox-octa",
    name: "1x Softbox OCTA",
    spec: "110CM",
    imageUrl: "/images/equipment/softbox-octa.jpg",
  },
  {
    id: "softbox-110",
    name: "1x Softbox",
    spec: "110CM",
    imageUrl: "/images/equipment/softbox-3.jpg",
  },
  {
    id: "beauty-dish",
    name: "1x Beauty Dish",
    spec: "60CM",
    imageUrl: "/images/equipment/beauty-dish.jpg",
  },
  {
    id: "gobo",
    name: "1x Gobo",
    spec: "EF-ZF3",
    imageUrl: "/images/equipment/gobo.jpg",
  },
];

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

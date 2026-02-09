/**
 * Studio Rental page fallback data for development when Strapi CMS is unavailable.
 */

export const FALLBACK_STUDIO_HERO = {
  heading: "Your creative playground",
  backgroundImage: "/images/studio-rental/hero-background.jpg",
  backgroundAlt: "Studio Rental",
};

export const FALLBACK_STUDIO_INTRO = {
  title: "How It Works",
  description:
    "Because your vision deserves more than a space\u2014 It needs a stage, a story, and a studio that moves with you.",
  ctaText: "Get in touch",
  ctaLink: "#contact-form",
};

export const FALLBACK_STUDIO_STATS = {
  totalRooms: 6,
  ceilingHeight: "4.5m",
  totalSpace: "900m\u00B2",
  blankRooms: 3,
  conceptRooms: 3,
};

export const FALLBACK_STUDIO_ROOMS = [
  {
    id: "loft",
    title: "The Loft",
    pricePerHour: "450,000",
    counter: "01/06",
    space: "125m\u00B2",
    width: "6m",
    ceilingHeight: "4.5m",
    description:
      "Perfect for editorial shoots, interviews, and minimalist campaigns.",
    imageUrl: "/images/rooms/loft.jpg",
    gallery: [
      { url: "/images/gallery/gallery-01.jpg", alt: "The Loft gallery 1" },
      { url: "/images/gallery/gallery-02.jpg", alt: "The Loft gallery 2" },
      { url: "/images/gallery/gallery-03.jpg", alt: "The Loft gallery 3" },
    ],
  },
  {
    id: "studio",
    title: "The Studio",
    pricePerHour: "800,000",
    counter: "02/06",
    space: "125m\u00B2",
    width: "6m",
    ceilingHeight: "4.5m",
    description:
      "Perfect for editorial shoots, interviews, and minimalist campaigns.",
    imageUrl: "/images/rooms/studio.jpg",
    gallery: [
      { url: "/images/gallery/gallery-04.jpg", alt: "The Studio gallery 1" },
      { url: "/images/gallery/gallery-05.jpg", alt: "The Studio gallery 2" },
      { url: "/images/gallery/gallery-06.jpg", alt: "The Studio gallery 3" },
    ],
  },
  {
    id: "arena",
    title: "The Arena",
    pricePerHour: "850,000",
    counter: "03/06",
    space: "125m\u00B2",
    width: "6m",
    ceilingHeight: "4.5m",
    description:
      "Perfect for editorial shoots, interviews, and minimalist campaigns.",
    imageUrl: "/images/rooms/arena.jpg",
    gallery: [
      { url: "/images/gallery/gallery-07.jpg", alt: "The Arena gallery 1" },
      { url: "/images/gallery/gallery-08.jpg", alt: "The Arena gallery 2" },
      { url: "/images/gallery/gallery-09.jpg", alt: "The Arena gallery 3" },
    ],
  },
];

export const FALLBACK_CONCEPT_ROOMS = [
  {
    id: "concept1",
    title: "Concept room 1",
    pricePerHour: "450,000",
    counter: "04/06",
    space: "125m\u00B2",
    width: "6m",
    ceilingHeight: "4.5m",
    description: "Seasonal themed room for unique creative concepts.",
    imageUrl: "/images/rooms/concept1.jpg",
    gallery: [
      { url: "/images/gallery/gallery-10.jpg", alt: "Concept room 1 gallery 1" },
      { url: "/images/gallery/gallery-11.jpg", alt: "Concept room 1 gallery 2" },
      { url: "/images/gallery/gallery-12.jpg", alt: "Concept room 1 gallery 3" },
    ],
  },
  {
    id: "concept2",
    title: "Concept room 2",
    pricePerHour: "450,000",
    counter: "05/06",
    space: "125m\u00B2",
    width: "6m",
    ceilingHeight: "4.5m",
    description: "Seasonal themed room for unique creative concepts.",
    imageUrl: "/images/rooms/concept2.jpg",
    gallery: [
      { url: "/images/gallery/gallery-13.jpg", alt: "Concept room 2 gallery 1" },
      { url: "/images/gallery/gallery-14.jpg", alt: "Concept room 2 gallery 2" },
      { url: "/images/gallery/gallery-15.jpg", alt: "Concept room 2 gallery 3" },
    ],
  },
  {
    id: "concept3",
    title: "Concept room 3",
    pricePerHour: "450,000",
    counter: "06/06",
    space: "125m\u00B2",
    width: "6m",
    ceilingHeight: "4.5m",
    description: "Seasonal themed room for unique creative concepts.",
    imageUrl: "/images/rooms/concept3.jpg",
    gallery: [
      { url: "/images/gallery/gallery-01.jpg", alt: "Concept room 3 gallery 1" },
      { url: "/images/gallery/gallery-04.jpg", alt: "Concept room 3 gallery 2" },
      { url: "/images/gallery/gallery-07.jpg", alt: "Concept room 3 gallery 3" },
    ],
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

/**
 * About page fallback data for development when Strapi CMS is unavailable.
 */

export const FALLBACK_ABOUT_HERO = {
  heading: "We Imagine. We Design. We Create.",
  backgroundImage: "/images/about-us/hero-background.jpg",
  backgroundAlt: "About Saint 6 Studio",
};

export const FALLBACK_ABOUT_INTRO = {
  label: "ABOUT US",
  headline:
    "We are a studio of artists, builders, stylists, dreamers, problem solvers, and storytellers.\nWe turn ideas into places, feelings, and memories.",
  bodyParagraph1:
    "Saint 6 Studios, founded by Trang Nhe Nhang, is a multi-disciplinary creative studio crafting sets, spaces, environments, and experiences.",
  bodyParagraph2:
    "We create work that feels alive, work that holds emotion, atmosphere, and story. For us, it's never \"just decor.\" It's the feeling someone carries home.",
  imageUrl: "/images/about-us/intro-portrait.jpg",
  imageAlt: "Saint 6 Studio portrait",
};

export const FALLBACK_ABOUT_VISION = {
  label: "VISION",
  statement: "To create work that is remembered through the feelings it evokes.",
};

export const FALLBACK_ABOUT_FULL_WIDTH_IMAGE = "/images/about-us/full-width-image.jpg";

export const FALLBACK_ABOUT_MISSION = {
  label: "MISSION",
  statement:
    "We transform ideas, identities, and stories into visual experiences that move people.",
};

export interface ValueItemFallback {
  id: string;
  letter: string;
  title: string;
  description: string;
}

export const FALLBACK_ABOUT_VALUES: ValueItemFallback[] = [
  { id: "simplicity", letter: "S", title: "Simplicity", description: "Clarity reveals emotion." },
  { id: "authenticity", letter: "A", title: "Authenticity", description: "Emotion must be real, not manufactured." },
  { id: "intention", letter: "I", title: "Intention", description: "Every choice serves the feeling." },
  { id: "narrative", letter: "N", title: "Narrative", description: "Everything is part of the story." },
  { id: "trust", letter: "T", title: "Trust", description: "Art needs reliability to thrive." },
  { id: "sixth-sense", letter: "6", title: "Sixth Sense", description: "We design for the feeling beneath the brief." },
];

export const FALLBACK_ABOUT_STORY = {
  label: "Our Story",
  paragraph1:
    "Before Saint 6, there was Haus of Trang - where Trang learned that styling is not only about how things look, but how they make people feel.",
  paragraph2: "That realization became the foundation of Saint 6",
};

export interface TimelineItemFallback {
  id: string;
  imageUrl: string;
  counter: string;
  title: string;
  description: string;
}

export const FALLBACK_ABOUT_TIMELINE: TimelineItemFallback[] = [
  { id: "2021", imageUrl: "/images/about-us/timeline-2021.jpg", counter: "2021", title: "", description: "Saint 6 was founded with the belief that beauty is emotional, not ornamental." },
  { id: "2022", imageUrl: "/images/about-us/timeline-2022.jpg", counter: "2022", title: "", description: "The first Saint 6 studio space was built \u2014 a home for creation, experimentation, and community." },
  { id: "2023", imageUrl: "/images/about-us/timeline-2023.jpg", counter: "2023", title: "", description: "We expanded into store d\u00E9cor and spatial brand environments, shaping how customers feel inside a space." },
  { id: "2024", imageUrl: "/images/about-us/timeline-2024.jpg", counter: "2024", title: "", description: "We began designing events and weddings, translating personal stories into atmospheres." },
  { id: "2025", imageUrl: "/images/about-us/timeline-2025.jpg", counter: "2025", title: "", description: "We surpassed 1,000 set designs created since our founding \u2014 from intimate shoots to major brand activations." },
  { id: "2026", imageUrl: "/images/about-us/timeline-2026.jpg", counter: "2026 (Next)", title: "", description: "We are opening a second Saint 6 location, expanding our creative capacity and community." },
];

export const FALLBACK_ABOUT_FOUNDER = {
  imageUrl: "/images/about-us/founder-portrait.jpg",
  quote:
    "Creation is emotional work. We build spaces for people to feel something real.",
  name: "Trang",
  title: "Founder & Creative Director",
};

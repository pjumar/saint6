/**
 * Fallback data for development when Strapi CMS is unavailable.
 * Re-exports all per-page fallback modules for convenient access.
 */

// Homepage
export {
  FALLBACK_HERO,
  FALLBACK_BRAND_LOGOS,
  FALLBACK_GALLERY_IMAGES,
  FALLBACK_SPACE_DATA,
  FALLBACK_CREW_AREA_DATA,
  FALLBACK_PROJECT_DATA,
} from "./homepage";

// Studio Rental
export {
  FALLBACK_STUDIO_HERO,
  FALLBACK_STUDIO_INTRO,
  FALLBACK_STUDIO_STATS,
  FALLBACK_STUDIO_ROOMS,
  FALLBACK_CONCEPT_ROOMS,
  FALLBACK_FULL_RENTAL,
  FALLBACK_FACILITIES,
  FALLBACK_EQUIPMENT,
} from "./studio-rental";

// Creative
export {
  FALLBACK_CREATIVE_HERO,
  FALLBACK_CREATIVE_SERVICES,
  FALLBACK_CREATIVE_WORKFLOW,
  FALLBACK_CREATIVE_PORTFOLIO,
  FALLBACK_CREATIVE_TESTIMONIALS,
} from "./creative";

// Production
export {
  FALLBACK_PRODUCTION_HERO,
  FALLBACK_PRODUCTION_SERVICES,
  FALLBACK_PRODUCTION_WORKFLOW,
  FALLBACK_PRODUCTION_KEY_PROJECT,
} from "./production";

// Set Design
export {
  FALLBACK_SET_DESIGN_HERO,
  FALLBACK_SET_DESIGN_WORKFLOW,
  FALLBACK_SET_DESIGN_PORTFOLIO,
  FALLBACK_SET_DESIGN_TESTIMONIALS,
} from "./set-design";

// Event Planning
export {
  FALLBACK_EVENT_HERO,
  FALLBACK_EVENT_SERVICES,
  FALLBACK_EVENT_WORKFLOW,
  FALLBACK_EVENT_PROJECTS,
} from "./event-planning";
export type {
  EventProjectImageFallback,
  EventProjectFallback,
} from "./event-planning";

// Decor
export {
  FALLBACK_DECOR_HERO,
  FALLBACK_DECOR_WORKFLOW,
  FALLBACK_DECOR_PORTFOLIO,
} from "./decor";

// About
export {
  FALLBACK_ABOUT_HERO,
  FALLBACK_ABOUT_INTRO,
  FALLBACK_ABOUT_VISION,
  FALLBACK_ABOUT_FULL_WIDTH_IMAGE,
  FALLBACK_ABOUT_MISSION,
  FALLBACK_ABOUT_VALUES,
  FALLBACK_ABOUT_STORY,
  FALLBACK_ABOUT_TIMELINE,
  FALLBACK_ABOUT_FOUNDER,
} from "./about";
export type { ValueItemFallback, TimelineItemFallback } from "./about";

// Contact
export {
  FALLBACK_CONTACT_HERO,
  FALLBACK_CONTACT_INFO,
  FALLBACK_CONTACT_MAP_IMAGE,
} from "./contact";

// SEO — shared across layout and seo utility
export const FALLBACK_SEO = {
  site_name: "Saint 6 Studio",
  title: {
    en: "Saint 6 Studio | Exclusive Production & Event Destination",
    vi: "Saint 6 Studio | \u0110i\u1EC3m \u0110\u1EBFn S\u1EA3n Xu\u1EA5t & S\u1EF1 Ki\u1EC7n \u0110\u1ED9c Quy\u1EC1n",
  },
  title_template: "%s | Saint 6 Studio",
  description: {
    en: "An exclusive destination for elevated productions, private events, and visionary experiences. Studio rental, set design, production services, and creative solutions tailored to your needs.",
    vi: "M\u1ED9t \u0111i\u1EC3m \u0111\u1EBFn \u0111\u1ED9c quy\u1EC1n cho c\u00E1c s\u1EA3n xu\u1EA5t cao c\u1EA5p, s\u1EF1 ki\u1EC7n ri\u00EAng t\u01B0 v\u00E0 tr\u1EA3i nghi\u1EC7m t\u1EA7m nh\u00ECn. Thu\u00EA studio, thi\u1EBFt k\u1EBF set, d\u1ECBch v\u1EE5 s\u1EA3n xu\u1EA5t v\u00E0 gi\u1EA3i ph\u00E1p s\u00E1ng t\u1EA1o \u0111\u01B0\u1EE3c \u0111i\u1EC1u ch\u1EC9nh theo nhu c\u1EA7u c\u1EE7a b\u1EA1n.",
  },
  keywords: {
    en: ["studio rental", "set design", "production services", "event planning", "creative studio", "film production", "photography studio", "event venue"],
    vi: ["thu\u00EA studio", "thi\u1EBFt k\u1EBF set", "d\u1ECBch v\u1EE5 s\u1EA3n xu\u1EA5t", "t\u1ED5 ch\u1EE9c s\u1EF1 ki\u1EC7n", "studio s\u00E1ng t\u1EA1o", "s\u1EA3n xu\u1EA5t phim", "studio ch\u1EE5p \u1EA3nh", "\u0111\u1ECBa \u0111i\u1EC3m s\u1EF1 ki\u1EC7n"],
  },
  og_image: "/og-image.jpg",
  twitter_image: "/twitter-image.jpg",
};

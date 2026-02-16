/**
 * Fallback data for development when Strapi CMS is unavailable.
 * Re-exports all per-page fallback modules for convenient access.
 */

export type { TimelineItemFallback, ValueItemFallback } from "./about";
// About
export {
  FALLBACK_ABOUT_FOUNDER,
  FALLBACK_ABOUT_FULL_WIDTH_IMAGE,
  FALLBACK_ABOUT_HERO,
  FALLBACK_ABOUT_INTRO,
  FALLBACK_ABOUT_MISSION,
  FALLBACK_ABOUT_STORY,
  FALLBACK_ABOUT_TIMELINE,
  FALLBACK_ABOUT_VALUES,
  FALLBACK_ABOUT_VISION,
} from "./about";
// Contact
export {
  FALLBACK_CONTACT_HERO,
  FALLBACK_CONTACT_INFO,
  FALLBACK_CONTACT_MAP_IMAGE,
} from "./contact";
// Creative
export {
  FALLBACK_CREATIVE_HERO,
  FALLBACK_CREATIVE_PORTFOLIO,
  FALLBACK_CREATIVE_SERVICES,
  FALLBACK_CREATIVE_TESTIMONIALS,
  FALLBACK_CREATIVE_WORKFLOW,
} from "./creative";
// Decor
export {
  FALLBACK_DECOR_HERO,
  FALLBACK_DECOR_PORTFOLIO,
  FALLBACK_DECOR_WORKFLOW,
} from "./decor";
export type {
  EventProjectFallback,
  EventProjectImageFallback,
} from "./event-planning";
// Event Planning
export {
  FALLBACK_EVENT_HERO,
  FALLBACK_EVENT_PROJECTS,
  FALLBACK_EVENT_SERVICES,
  FALLBACK_EVENT_WORKFLOW,
} from "./event-planning";
// Homepage
export {
  FALLBACK_BRAND_LOGOS,
  FALLBACK_CREW_AREA_DATA,
  FALLBACK_GALLERY_IMAGES,
  FALLBACK_HERO,
  FALLBACK_PROJECT_DATA,
  FALLBACK_SPACE_DATA,
} from "./homepage";
// Production
export {
  FALLBACK_PRODUCTION_HERO,
  FALLBACK_PRODUCTION_KEY_PROJECT,
  FALLBACK_PRODUCTION_SERVICES,
  FALLBACK_PRODUCTION_WORKFLOW,
} from "./production";
// Set Design
export {
  FALLBACK_SET_DESIGN_HERO,
  FALLBACK_SET_DESIGN_PORTFOLIO,
  FALLBACK_SET_DESIGN_TESTIMONIALS,
  FALLBACK_SET_DESIGN_WORKFLOW,
} from "./set-design";
// Studio Rental
export {
  FALLBACK_CONCEPT_ROOMS,
  FALLBACK_EQUIPMENT,
  FALLBACK_FACILITIES,
  FALLBACK_FULL_RENTAL,
  FALLBACK_STUDIO_HERO,
  FALLBACK_STUDIO_INTRO,
  FALLBACK_STUDIO_ROOMS,
  FALLBACK_STUDIO_STATS,
} from "./studio-rental";

// SEO — shared across layout and seo utility
export const FALLBACK_SEO = {
  site_name: "Saint 6 Studios",
  title: {
    en: "Saint 6 Studios | Exclusive Production & Event Destination",
    vi: "Saint 6 Studios | \u0110i\u1EC3m \u0110\u1EBFn S\u1EA3n Xu\u1EA5t & S\u1EF1 Ki\u1EC7n \u0110\u1ED9c Quy\u1EC1n",
  },
  title_template: "Saint 6 Studios | %s",
  description: {
    en: "An exclusive destination for elevated productions, private events, and visionary experiences. Studio rental, set design, production services, and creative solutions tailored to your needs.",
    vi: "M\u1ED9t \u0111i\u1EC3m \u0111\u1EBFn \u0111\u1ED9c quy\u1EC1n cho c\u00E1c s\u1EA3n xu\u1EA5t cao c\u1EA5p, s\u1EF1 ki\u1EC7n ri\u00EAng t\u01B0 v\u00E0 tr\u1EA3i nghi\u1EC7m t\u1EA7m nh\u00ECn. Thu\u00EA studio, thi\u1EBFt k\u1EBF set, d\u1ECBch v\u1EE5 s\u1EA3n xu\u1EA5t v\u00E0 gi\u1EA3i ph\u00E1p s\u00E1ng t\u1EA1o \u0111\u01B0\u1EE3c \u0111i\u1EC1u ch\u1EC9nh theo nhu c\u1EA7u c\u1EE7a b\u1EA1n.",
  },
  keywords: {
    en: [
      "studio rental",
      "set design",
      "production services",
      "event planning",
      "creative studio",
      "film production",
      "photography studio",
      "event venue",
    ],
    vi: [
      "thu\u00EA studio",
      "thi\u1EBFt k\u1EBF set",
      "d\u1ECBch v\u1EE5 s\u1EA3n xu\u1EA5t",
      "t\u1ED5 ch\u1EE9c s\u1EF1 ki\u1EC7n",
      "studio s\u00E1ng t\u1EA1o",
      "s\u1EA3n xu\u1EA5t phim",
      "studio ch\u1EE5p \u1EA3nh",
      "\u0111\u1ECBa \u0111i\u1EC3m s\u1EF1 ki\u1EC7n",
    ],
  },
  og_image: "/og-image.jpg",
  twitter_image: "/twitter-image.jpg",
};

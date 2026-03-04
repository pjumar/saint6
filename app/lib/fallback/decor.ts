/**
 * Decor page fallback data for development when Strapi CMS is unavailable.
 */

import type { PortfolioItem } from "@/app/components/portfolio-section/PortfolioSection";
import type { ServiceCard } from "@/app/components/service-cards-carousel/ServiceCardsCarousel";

export const FALLBACK_DECOR_HERO = {
  heading:
    "From flagship stores to private villas \u2014 we design and decorate spaces that tell a story.",
  backgroundImage: "/images/decoration/hero-background.jpg",
  backgroundAlt: "Decoration",
};

export const FALLBACK_DECOR_WORKFLOW: ServiceCard[] = [
  {
    id: "brief-overview",
    imageUrl: "/images/decoration/workflow-brief.jpg",
    counter: "01.",
    title: "Brief Overview",
    description:
      "We study the brief and develop multiple creative directions based on your brand, audience, and goals.",
  },
  {
    id: "2d-ideation",
    imageUrl: "/images/decoration/workflow-2d.jpg",
    counter: "02.",
    title: "2D Ideation",
    description:
      "Our design team creates detailed mood boards and conceptual layouts to visualize the space transformation.",
  },
  {
    id: "3d-render",
    imageUrl: "/images/decoration/workflow-3d.jpg",
    counter: "03.",
    title: "3D Render",
    description:
      "We produce photorealistic 3D renders so you can experience the space before construction begins.",
  },
  {
    id: "pre-production",
    imageUrl: "/images/decoration/workflow-preproduction.jpg",
    counter: "04.",
    title: "Pre-Production",
    description:
      "We coordinate materials, vendors, and timelines to ensure smooth execution of your project.",
  },
  {
    id: "final-installation",
    imageUrl: "/images/decoration/workflow-installation.jpg",
    counter: "05.",
    title: "Final Installation",
    description:
      "Our team manages the complete installation, bringing every detail to life with precision.",
  },
];

export const FALLBACK_DECOR_PORTFOLIO: PortfolioItem[] = [
  {
    id: "fressi-kv",
    imageUrl: "/images/decoration/portfolio-fressi.jpg",
    category: "Fashion Stores",
    title: "FRESSI KV",
    aspectRatio: "3/2",
  },
  {
    id: "mirinda",
    imageUrl: "/images/decoration/portfolio-mirinda.jpg",
    category: "Campaign",
    title: "MIRINDA",
    aspectRatio: "3/2",
  },
  {
    id: "den-vau-1",
    imageUrl: "/images/decoration/portfolio-denvau-1.jpg",
    category: "Campaign",
    title: "MV DI\u1EC4N VI\u00CAN T\u1ED2I - \u0110\u00CAN V\u00C2U",
    aspectRatio: "3/2",
  },
  {
    id: "den-vau-2",
    imageUrl: "/images/decoration/portfolio-denvau-2.jpg",
    category: "Campaign",
    title: "MV DI\u1EC4N VI\u00CAN T\u1ED2I - \u0110\u00CAN V\u00C2U",
    aspectRatio: "3/4",
  },
  {
    id: "den-vau-3",
    imageUrl: "/images/decoration/portfolio-denvau-3.jpg",
    category: "Campaign",
    title: "MV DI\u1EC4N VI\u00CAN T\u1ED2I - \u0110\u00CAN V\u00C2U",
    aspectRatio: "3/4",
  },
  {
    id: "den-vau-4",
    imageUrl: "/images/decoration/portfolio-denvau-4.jpg",
    category: "Campaign",
    title: "MV DI\u1EC4N VI\u00CAN T\u1ED2I - \u0110\u00CAN V\u00C2U",
    aspectRatio: "3/2",
  },
  {
    id: "den-vau-5",
    imageUrl: "/images/decoration/portfolio-denvau-5.jpg",
    category: "Campaign",
    title: "MV DI\u1EC4N VI\u00CAN T\u1ED2I - \u0110\u00CAN V\u00C2U",
    aspectRatio: "3/4",
  },
  {
    id: "yamaha",
    imageUrl: "/images/decoration/portfolio-yamaha.jpg",
    category: "Campaign",
    title: "YAMAHA SOCIAL LAYOUT",
    aspectRatio: "3/2",
  },
];

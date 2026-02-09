/**
 * Production page fallback data for development when Strapi CMS is unavailable.
 */

import type { KeyProjectData } from "@/app/components/key-project-section/KeyProjectSection";
import type { ProductionServiceItem } from "@/app/components/production-service-grid/ProductionServiceGrid";
import type { ServiceCard } from "@/app/components/service-cards-carousel/ServiceCardsCarousel";

export const FALLBACK_PRODUCTION_HERO = {
  heading: "Full-Scale Production, Seamless Execution.",
  backgroundImage: "/images/production/hero-background.jpg",
  backgroundAlt: "Production",
};

export const FALLBACK_PRODUCTION_SERVICES: ProductionServiceItem[] = [
  {
    id: "campaign-editorial",
    imageUrl: "/images/production/service-campaign.jpg",
    title: "Campaign & Editorial Production",
    description:
      "We curate bespoke campaigns and editorials that blend artistry, narrative, and timeless sophistication \u2014 bringing each brand story to life with cinematic allure.",
  },
  {
    id: "photography-film",
    imageUrl: "/images/production/service-photography.jpg",
    title: "Photography & Film Production",
    description:
      "From concept to final cut, we deliver high-impact visuals through expert direction, seamless coordination, and creative storytelling.",
  },
  {
    id: "lighting-equipment",
    imageUrl: "/images/production/service-lighting.jpg",
    title: "Lighting & Equipment Rental",
    description:
      "Premium lighting and state-of-the-art equipment designed to elevate every production with precision, balance, and creative control.",
  },
  {
    id: "makeup-hair",
    imageUrl: "/images/production/service-makeup.jpg",
    title: "Make-up & Hair Stylist",
    description:
      "Professional beauty services that transform talent and enhance visual storytelling with meticulous attention to detail.",
  },
  {
    id: "location-permits",
    imageUrl: "/images/production/service-location.jpg",
    title: "Location Scouting & Permits",
    description:
      "We source the perfect locations and handle all permit logistics, ensuring smooth operations from pre-production to wrap.",
  },
  {
    id: "post-production",
    imageUrl: "/images/production/service-postproduction.jpg",
    title: "Post-production Coordination",
    description:
      "End-to-end post-production management, from editing and color grading to final delivery across all formats.",
  },
];

export const FALLBACK_PRODUCTION_WORKFLOW: ServiceCard[] = [
  {
    id: "pre-production",
    imageUrl: "/images/production/workflow-pre-production.jpg",
    counter: "01.",
    title: "Pre-production",
    description:
      "We plan every detail from concept development to logistics and scheduling.",
  },
  {
    id: "set-up",
    imageUrl: "/images/production/workflow-setup.jpg",
    counter: "02.",
    title: "Set-up",
    description:
      "Our team prepares the location, lighting, and equipment for optimal shooting conditions.",
  },
  {
    id: "shoot-day",
    imageUrl: "/images/production/workflow-shoot.jpg",
    counter: "03.",
    title: "Shoot Day",
    description:
      "Expert direction and coordination ensure smooth capture of your creative vision.",
  },
  {
    id: "wrap-delivery",
    imageUrl: "/images/production/workflow-delivery.jpg",
    counter: "04.",
    title: "Wrap & Delivery",
    description:
      "Post-production, editing, and final delivery across all required formats.",
  },
];

export const FALLBACK_PRODUCTION_KEY_PROJECT: KeyProjectData = {
  projectNumber: "01",
  title: "Giai Nhan Show",
  infoText:
    "A high-profile production capturing the elegance and artistry of Vietnamese fashion. Our team managed end-to-end production for this campaign, from location scouting to final delivery.",
  team: [
    { role: "Creative Director", name: "Nguyen Van A" },
    { role: "Producer", name: "Tran Thi B" },
    { role: "Director of Photography", name: "Le Van C" },
  ],
  expertise: ["Campaign Production", "Photography", "Post-production"],
  client: "Giai Nhan Studio",
  mainImage: {
    src: "/images/production/key-project-main.jpg",
    alt: "Giai Nhan Show - Main Image",
    width: 1200,
    height: 800,
  },
  testimonial: {
    quote:
      "Saint Six Studio delivered beyond our expectations. Their attention to detail and creative vision brought our campaign to life in ways we hadn't imagined.",
    author: "Nguyen Van D",
    role: "Creative Director, Giai Nhan",
  },
  galleryImages: [
    {
      src: "/images/production/key-project-gallery-1.jpg",
      alt: "Giai Nhan Show - Gallery 1",
      width: 400,
      height: 600,
    },
    {
      src: "/images/production/key-project-gallery-2.jpg",
      alt: "Giai Nhan Show - Gallery 2",
      width: 600,
      height: 400,
    },
    {
      src: "/images/production/key-project-gallery-3.jpg",
      alt: "Giai Nhan Show - Gallery 3",
      width: 600,
      height: 400,
    },
  ],
};

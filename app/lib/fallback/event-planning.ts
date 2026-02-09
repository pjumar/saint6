/**
 * Event Planning page fallback data for development when Strapi CMS is unavailable.
 */

import type { ProductionServiceItem } from "@/app/components/production-service-grid/ProductionServiceGrid";
import type { ServiceCard } from "@/app/components/service-cards-carousel/ServiceCardsCarousel";

export const FALLBACK_EVENT_HERO = {
  heading: "Curated events that captivate and inspire",
  backgroundImage: "/images/event-planning/hero-background.jpg",
  backgroundAlt: "Event Planning",
};

export const FALLBACK_EVENT_SERVICES: ProductionServiceItem[] = [
  {
    id: "product-launches",
    imageUrl: "/images/event-planning/service-product-launches.jpg",
    title: "Product & Brand Launches",
    description:
      "We craft launch experiences that captivate audiences and elevate your brand story with precision and flair.",
  },
  {
    id: "fashion-shows",
    imageUrl: "/images/event-planning/service-fashion-shows.jpg",
    title: "Fashion Shows",
    description:
      "From runway to backstage, we design and execute fashion events that celebrate artistry and style.",
  },
  {
    id: "private-dinners",
    imageUrl: "/images/event-planning/service-private-dinners.jpg",
    title: "Private Dinners",
    description:
      "Intimate gatherings curated with exquisite detail, creating memorable moments for your guests.",
  },
  {
    id: "art-popups",
    imageUrl: "/images/event-planning/service-art-popups.jpg",
    title: "Art & Lifestyle Pop-Ups",
    description:
      "Immersive pop-up experiences that blend art, culture, and lifestyle into unforgettable activations.",
  },
  {
    id: "press-events",
    imageUrl: "/images/event-planning/service-press-events.jpg",
    title: "Press & Influencer Events",
    description:
      "Strategic media events designed to generate buzz and build lasting connections with key voices.",
  },
  {
    id: "corporate-celebrations",
    imageUrl: "/images/event-planning/service-corporate.jpg",
    title: "Corporate Celebrations",
    description:
      "Professional yet refined corporate events that reflect your company's values and vision.",
  },
];

export const FALLBACK_EVENT_WORKFLOW: ServiceCard[] = [
  {
    id: "creative-direction",
    imageUrl: "/images/event-planning/workflow-discovery.jpg",
    counter: "01.",
    title: "Discovery & Vision",
    description:
      "We understand your goals and create a vision that aligns with your brand identity.",
  },
  {
    id: "guest-experience",
    imageUrl: "/images/event-planning/workflow-concept.jpg",
    counter: "02.",
    title: "Concept Development",
    description:
      "Creative concepts and mood boards bring your event vision to life.",
  },
  {
    id: "onsite-management",
    imageUrl: "/images/event-planning/workflow-planning.jpg",
    counter: "03.",
    title: "Planning & Logistics",
    description: "Meticulous planning ensures every detail is accounted for.",
  },
  {
    id: "venue-styling",
    imageUrl: "/images/event-planning/workflow-execution.jpg",
    counter: "04.",
    title: "Execution",
    description: "Flawless execution brings your event to life with precision.",
  },
  {
    id: "catering-entertainment",
    imageUrl: "/images/event-planning/workflow-followup.jpg",
    counter: "05.",
    title: "Follow-up",
    description: "Post-event support and documentation capture your success.",
  },
];

export interface EventProjectImageFallback {
  url: string;
  alt: string;
}

export interface EventProjectFallback {
  id: string;
  images: EventProjectImageFallback[];
  title: string;
  category: string;
}

export const FALLBACK_EVENT_PROJECTS: EventProjectFallback[] = [
  {
    id: "project-1",
    images: [
      {
        url: "/images/event-planning/gallery-1.jpg",
        alt: "Spring Collection Reveal - Photo 1",
      },
      {
        url: "/images/event-planning/gallery-2.jpg",
        alt: "Spring Collection Reveal - Photo 2",
      },
      {
        url: "/images/event-planning/portfolio-1.jpg",
        alt: "Spring Collection Reveal - Photo 3",
      },
    ],
    title: "Spring Collection Reveal",
    category: "Fashion Shows",
  },
  {
    id: "project-2",
    images: [
      {
        url: "/images/event-planning/gallery-3.jpg",
        alt: "VIP Gala Evening - Photo 1",
      },
      {
        url: "/images/event-planning/gallery-4.jpg",
        alt: "VIP Gala Evening - Photo 2",
      },
      {
        url: "/images/event-planning/portfolio-2.jpg",
        alt: "VIP Gala Evening - Photo 3",
      },
      {
        url: "/images/event-planning/portfolio-3.jpg",
        alt: "VIP Gala Evening - Photo 4",
      },
    ],
    title: "VIP Gala Evening",
    category: "Private Dinners",
  },
  {
    id: "project-3",
    images: [
      {
        url: "/images/event-planning/portfolio-4.jpg",
        alt: "Contemporary Art Opening - Photo 1",
      },
      {
        url: "/images/event-planning/portfolio-5.jpg",
        alt: "Contemporary Art Opening - Photo 2",
      },
    ],
    title: "Contemporary Art Opening",
    category: "Art & Lifestyle Pop-Ups",
  },
  {
    id: "project-4",
    images: [
      {
        url: "/images/event-planning/service-corporate.jpg",
        alt: "Annual Awards Ceremony - Photo 1",
      },
      {
        url: "/images/event-planning/service-press-events.jpg",
        alt: "Annual Awards Ceremony - Photo 2",
      },
      {
        url: "/images/event-planning/service-product-launches.jpg",
        alt: "Annual Awards Ceremony - Photo 3",
      },
    ],
    title: "Annual Awards Ceremony",
    category: "Corporate Celebrations",
  },
];

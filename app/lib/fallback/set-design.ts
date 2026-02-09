/**
 * Set Design page fallback data for development when Strapi CMS is unavailable.
 */

import type { ServiceCard } from "@/app/components/service-cards-carousel/ServiceCardsCarousel";
import type { PortfolioItem } from "@/app/components/portfolio-section/PortfolioSection";
import type { TestimonialItem } from "@/app/components/testimonials-section/TestimonialsSection";

export const FALLBACK_SET_DESIGN_HERO = {
  heading:
    "From Moodboard to Build \u2014 Complete Set Design for Visual Storytelling",
  backgroundImage: "/images/set-design/hero-background.jpg",
  backgroundAlt: "Set Design",
};

export const FALLBACK_SET_DESIGN_WORKFLOW: ServiceCard[] = [
  { id: "brief-concept", imageUrl: "/images/set-design/set-brief-concept.jpg", counter: "01.", title: "Brief & Concept", description: "We analyze your vision and develop creative concepts that align with your brand story." },
  { id: "layout-render", imageUrl: "/images/set-design/set-layout-render.jpg", counter: "02.", title: "Layout & Render", description: "Detailed 2D layouts and 3D renders bring your vision to life before construction." },
  { id: "feedback-loop", imageUrl: "/images/set-design/set-feedback-loop.jpg", counter: "03.", title: "Feedback Loop", description: "Collaborative refinement ensures every detail meets your expectations." },
  { id: "construction", imageUrl: "/images/set-design/set-construction.jpg", counter: "04.", title: "Construction", description: "Our skilled team builds your set with precision craftsmanship." },
  { id: "shoot-support", imageUrl: "/images/set-design/set-shoot-support.jpg", counter: "05.", title: "Shoot Support", description: "On-set assistance ensures everything runs smoothly during production." },
  { id: "maintenance", imageUrl: "/images/set-design/set-maintenance.jpg", counter: "06.", title: "Maintenance", description: "Post-shoot care and storage options for reusable set elements." },
];

export const FALLBACK_SET_DESIGN_PORTFOLIO: PortfolioItem[] = [
  { id: "fressi-kv", imageUrl: "/images/set-design/campaign-fressi.jpg", category: "Campaign", title: "FRESSI KV", size: "large" },
  { id: "mirinda", imageUrl: "/images/set-design/campaign-mirinda.jpg", category: "Campaign", title: "Mirinda", size: "large" },
  { id: "den-vau-1", imageUrl: "/images/set-design/portfolio-den-vau-1.jpg", category: "Campaign", title: "MV Di\u1EC5n Vi\u00EAn T\u1ED3i - \u0110en V\u00E2u", size: "short" },
  { id: "den-vau-2", imageUrl: "/images/set-design/portfolio-den-vau-2.jpg", category: "Campaign", title: "MV Di\u1EC5n Vi\u00EAn T\u1ED3i - \u0110en V\u00E2u", size: "tall" },
  { id: "den-vau-3", imageUrl: "/images/set-design/portfolio-den-vau-3.jpg", category: "Campaign", title: "MV Di\u1EC5n Vi\u00EAn T\u1ED3i - \u0110en V\u00E2u", size: "tall" },
  { id: "den-vau-4", imageUrl: "/images/set-design/portfolio-den-vau-4.jpg", category: "Campaign", title: "MV Di\u1EC5n Vi\u00EAn T\u1ED3i - \u0110en V\u00E2u", size: "tall" },
  { id: "den-vau-5", imageUrl: "/images/set-design/portfolio-den-vau-5.jpg", category: "Campaign", title: "MV Di\u1EC5n Vi\u00EAn T\u1ED3i - \u0110en V\u00E2u", size: "short" },
  { id: "yamaha", imageUrl: "/images/set-design/portfolio-yamaha.jpg", category: "Campaign", title: "YAMAHA SOCIAL LAYOUT", size: "short" },
];

export const FALLBACK_SET_DESIGN_TESTIMONIALS: TestimonialItem[] = [
  { id: "vinfast", logoUrl: "/images/set-design/logo-vinfast.png", logoAlt: "VinFast", quote: "Saint Six Studio helped us create an authentic Vietnamese atmosphere for our commercial shoot. Their attention to detail and understanding of our vision was exceptional.", authorName: "Nguy\u1EC5n V\u0103n A", authorTitle: "Creative Director, VinFast" },
  { id: "pepsi", logoUrl: "/images/set-design/logo-pepsi.png", logoAlt: "Pepsi", quote: "The set design team delivered beyond our expectations. They transformed our concept into a stunning reality that perfectly captured the energy of our brand.", authorName: "Tr\u1EA7n Th\u1ECB B", authorTitle: "Marketing Manager, PepsiCo Vietnam" },
  { id: "samsung", logoUrl: "/images/set-design/logo-samsung.png", logoAlt: "Samsung", quote: "Working with Saint Six was seamless. From initial concept to final build, they maintained the highest standards of quality and professionalism.", authorName: "L\u00EA V\u0103n C", authorTitle: "Brand Director, Samsung Vietnam" },
  { id: "honda", logoUrl: "/images/set-design/logo-honda.png", logoAlt: "Honda", quote: "Their creative approach and technical expertise made our product launch a visual success. The team understood exactly what we needed.", authorName: "Ph\u1EA1m Th\u1ECB D", authorTitle: "Event Manager, Honda Vietnam" },
  { id: "unilever", logoUrl: "/images/set-design/logo-unilever.png", logoAlt: "Unilever", quote: "Saint Six Studio consistently delivers exceptional set designs that elevate our campaigns. They're our go-to partner for all production needs.", authorName: "Ho\u00E0ng V\u0103n E", authorTitle: "Production Head, Unilever Vietnam" },
  { id: "grab", logoUrl: "/images/set-design/logo-grab.png", logoAlt: "Grab", quote: "The team's ability to bring our digital brand into physical spaces was remarkable. They created an immersive experience that resonated with our audience.", authorName: "\u0110\u1ED7 Th\u1ECB F", authorTitle: "Creative Lead, Grab Vietnam" },
];

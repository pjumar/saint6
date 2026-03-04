/**
 * Creative page fallback data for development when Strapi CMS is unavailable.
 */

import type { CreativeServiceItem } from "@/app/components/creative-services-grid/CreativeServicesGrid";
import type { PortfolioItem } from "@/app/components/portfolio-section/PortfolioSection";
import type { ServiceCard } from "@/app/components/service-cards-carousel/ServiceCardsCarousel";
import type { TestimonialItem } from "@/app/components/testimonials-section/TestimonialsSection";

export const FALLBACK_CREATIVE_HERO = {
  heading: "Creative production for brands, campaigns & products",
  backgroundImage: "/images/creative/hero-background.jpg",
  backgroundAlt: "Creative",
};

export const FALLBACK_CREATIVE_SERVICES: CreativeServiceItem[] = [
  {
    id: "brand-advertising",
    imageUrl: "/images/creative/service-advertising.png",
    title: "Brand &\nAdvertising Campaigns",
    description:
      "We produce fashion, lifestyle, editorial, social media, and influencer campaigns that bring brands to life with fresh creative energy.",
  },
  {
    id: "product-packaging",
    imageUrl: "/images/creative/service-packaging.png",
    title: "Product &\nPackaging Shoots",
    description:
      "From product labels and e-commerce images to packshots and still life, we create polished visuals that elevate packaging, catalogs, and online stores.",
  },
];

export const FALLBACK_CREATIVE_WORKFLOW: ServiceCard[] = [
  {
    id: "creative-direction",
    imageUrl: "/images/creative/workflow-direction.jpg",
    counter: "01.",
    title: "Creative Direction",
    description:
      "We study your brief and develop creative directions based on your brand, audience, and goals.",
  },
  {
    id: "storyboard",
    imageUrl: "/images/creative/workflow-storyboard.jpg",
    counter: "02.",
    title: "Storyboard Development",
    description:
      "Our team creates detailed storyboards and shot lists to visualize the final output.",
  },
  {
    id: "pre-production",
    imageUrl: "/images/creative/workflow-preproduction.jpg",
    counter: "03.",
    title: "Pre-production & Sourcing",
    description:
      "We coordinate talent, locations, props, and equipment to ensure smooth execution.",
  },
  {
    id: "shoot-production",
    imageUrl: "/images/creative/workflow-shoot.jpg",
    counter: "04.",
    title: "Shoot / Production",
    description:
      "Our experienced crew captures your vision with precision and creative flair.",
  },
  {
    id: "post-production",
    imageUrl: "/images/creative/workflow-post.jpg",
    counter: "05.",
    title: "Post-production",
    description:
      "Professional editing, color grading, and retouching bring the final deliverables to life.",
  },
  {
    id: "delivery",
    imageUrl: "/images/creative/workflow-delivery.jpg",
    counter: "06.",
    title: "Final Delivery",
    description:
      "We deliver polished assets ready for print, digital, and social media deployment.",
  },
];

export const FALLBACK_CREATIVE_PORTFOLIO: PortfolioItem[] = [
  {
    id: "fressi-kv",
    imageUrl: "/images/creative/portfolio-fressi.jpg",
    category: "Campaign",
    title: "FRESSI KV",
    aspectRatio: "3/2",
  },
  {
    id: "mirinda",
    imageUrl: "/images/creative/portfolio-mirinda.jpg",
    category: "Campaign",
    title: "MIRINDA",
    aspectRatio: "3/2",
  },
  {
    id: "den-vau-1",
    imageUrl: "/images/creative/portfolio-denvau-1.jpg",
    category: "Campaign",
    title: "MV DI\u1EC4N VI\u00CAN T\u1ED2I - \u0110\u00CAN V\u00C2U",
    aspectRatio: "3/2",
  },
  {
    id: "den-vau-2",
    imageUrl: "/images/creative/portfolio-denvau-2.jpg",
    category: "Campaign",
    title: "MV DI\u1EC4N VI\u00CAN T\u1ED2I - \u0110\u00CAN V\u00C2U",
    aspectRatio: "3/4",
  },
  {
    id: "den-vau-3",
    imageUrl: "/images/creative/portfolio-denvau-3.jpg",
    category: "Campaign",
    title: "MV DI\u1EC4N VI\u00CAN T\u1ED2I - \u0110\u00CAN V\u00C2U",
    aspectRatio: "3/4",
  },
  {
    id: "den-vau-4",
    imageUrl: "/images/creative/portfolio-denvau-4.jpg",
    category: "Campaign",
    title: "MV DI\u1EC4N VI\u00CAN T\u1ED2I - \u0110\u00CAN V\u00C2U",
    aspectRatio: "3/2",
  },
  {
    id: "den-vau-5",
    imageUrl: "/images/creative/portfolio-denvau-5.jpg",
    category: "Campaign",
    title: "MV DI\u1EC4N VI\u00CAN T\u1ED2I - \u0110\u00CAN V\u00C2U",
    aspectRatio: "3/4",
  },
  {
    id: "yamaha",
    imageUrl: "/images/creative/portfolio-yamaha.jpg",
    category: "Campaign",
    title: "YAMAHA SOCIAL LAYOUT",
    aspectRatio: "3/2",
  },
];

export const FALLBACK_CREATIVE_TESTIMONIALS: TestimonialItem[] = [
  {
    id: "testimonial-1",
    logoUrl: "/images/brands/brand-01.png",
    logoAlt: "L'OFFICIEL",
    quote:
      "It's rare to find a studio where creative direction, production, and hospitality all come together. Saint 6 delivered on every front. Our client was blown away.",
    authorName: "Aaron Tan",
    authorTitle: "Creative Director, Elle Vietnam",
  },
  {
    id: "testimonial-2",
    logoUrl: "/images/brands/brand-02.png",
    logoAlt: "Fressi",
    quote:
      "Saint 6's attention to detail and creative vision transformed our campaign into something truly memorable. The team understood our brand from day one.",
    authorName: "Nguyen Thi Mai",
    authorTitle: "Marketing Director, Fressi Vietnam",
  },
  {
    id: "testimonial-3",
    logoUrl: "/images/brands/brand-03.png",
    logoAlt: "Vinamilk",
    quote:
      "Working with Saint 6 was seamless. Their production quality and creative approach exceeded our expectations for the product launch.",
    authorName: "Tran Van Duc",
    authorTitle: "Brand Manager, Vinamilk",
  },
  {
    id: "testimonial-4",
    logoUrl: "/images/brands/brand-04.png",
    logoAlt: "Sony",
    quote:
      "The team's expertise in both creative direction and technical execution made our collaboration incredibly smooth and successful.",
    authorName: "Le Hoang Nam",
    authorTitle: "Creative Lead, Sony Vietnam",
  },
];

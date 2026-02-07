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
import type { CreativeServiceItem } from "@/app/components/creative-services-grid/CreativeServicesGrid";
import type { ServiceCard } from "@/app/components/service-cards-carousel/ServiceCardsCarousel";
import type { PortfolioItem } from "@/app/components/portfolio-section/PortfolioSection";
import type { TestimonialItem } from "@/app/components/testimonials-section/TestimonialsSection";
import type { ProductionServiceItem } from "@/app/components/production-service-grid/ProductionServiceGrid";

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

// ============================================================================
// Creative Page Fallback Data
// ============================================================================

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
    size: "large",
  },
  {
    id: "mirinda",
    imageUrl: "/images/creative/portfolio-mirinda.jpg",
    category: "Campaign",
    title: "MIRINDA",
    size: "large",
  },
  {
    id: "den-vau-1",
    imageUrl: "/images/creative/portfolio-denvau-1.jpg",
    category: "Campaign",
    title: "MV DIỄN VIÊN TỒI - ĐEN VÂU",
    size: "short",
  },
  {
    id: "den-vau-2",
    imageUrl: "/images/creative/portfolio-denvau-2.jpg",
    category: "Campaign",
    title: "MV DIỄN VIÊN TỒI - ĐEN VÂU",
    size: "tall",
  },
  {
    id: "den-vau-3",
    imageUrl: "/images/creative/portfolio-denvau-3.jpg",
    category: "Campaign",
    title: "MV DIỄN VIÊN TỒI - ĐEN VÂU",
    size: "tall",
  },
  {
    id: "den-vau-4",
    imageUrl: "/images/creative/portfolio-denvau-4.jpg",
    category: "Campaign",
    title: "MV DIỄN VIÊN TỒI - ĐEN VÂU",
    size: "tall",
  },
  {
    id: "den-vau-5",
    imageUrl: "/images/creative/portfolio-denvau-5.jpg",
    category: "Campaign",
    title: "MV DIỄN VIÊN TỒI - ĐEN VÂU",
    size: "short",
  },
  {
    id: "yamaha",
    imageUrl: "/images/creative/portfolio-yamaha.jpg",
    category: "Campaign",
    title: "YAMAHA SOCIAL LAYOUT",
    size: "short",
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

// ============================================================================
// Production Page Fallback Data
// ============================================================================

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
      "We curate bespoke campaigns and editorials that blend artistry, narrative, and timeless sophistication — bringing each brand story to life with cinematic allure.",
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

// ============================================================================
// Set Design Page Fallback Data
// ============================================================================

export const FALLBACK_SET_DESIGN_HERO = {
  heading:
    "From Moodboard to Build — Complete Set Design for Visual Storytelling",
  backgroundImage: "/images/set-design/hero-background.jpg",
  backgroundAlt: "Set Design",
};

export const FALLBACK_SET_DESIGN_WORKFLOW: ServiceCard[] = [
  {
    id: "brief-concept",
    imageUrl: "/images/set-design/set-brief-concept.jpg",
    counter: "01.",
    title: "Brief & Concept",
    description:
      "We analyze your vision and develop creative concepts that align with your brand story.",
  },
  {
    id: "layout-render",
    imageUrl: "/images/set-design/set-layout-render.jpg",
    counter: "02.",
    title: "Layout & Render",
    description:
      "Detailed 2D layouts and 3D renders bring your vision to life before construction.",
  },
  {
    id: "feedback-loop",
    imageUrl: "/images/set-design/set-feedback-loop.jpg",
    counter: "03.",
    title: "Feedback Loop",
    description:
      "Collaborative refinement ensures every detail meets your expectations.",
  },
  {
    id: "construction",
    imageUrl: "/images/set-design/set-construction.jpg",
    counter: "04.",
    title: "Construction",
    description:
      "Our skilled team builds your set with precision craftsmanship.",
  },
  {
    id: "shoot-support",
    imageUrl: "/images/set-design/set-shoot-support.jpg",
    counter: "05.",
    title: "Shoot Support",
    description:
      "On-set assistance ensures everything runs smoothly during production.",
  },
  {
    id: "maintenance",
    imageUrl: "/images/set-design/set-maintenance.jpg",
    counter: "06.",
    title: "Maintenance",
    description:
      "Post-shoot care and storage options for reusable set elements.",
  },
];

export const FALLBACK_SET_DESIGN_PORTFOLIO: PortfolioItem[] = [
  {
    id: "fressi-kv",
    imageUrl: "/images/set-design/campaign-fressi.jpg",
    category: "Campaign",
    title: "FRESSI KV",
    size: "large",
  },
  {
    id: "mirinda",
    imageUrl: "/images/set-design/campaign-mirinda.jpg",
    category: "Campaign",
    title: "Mirinda",
    size: "large",
  },
  {
    id: "den-vau-1",
    imageUrl: "/images/set-design/portfolio-den-vau-1.jpg",
    category: "Campaign",
    title: "MV Diễn Viên Tồi - Đen Vâu",
    size: "short",
  },
  {
    id: "den-vau-2",
    imageUrl: "/images/set-design/portfolio-den-vau-2.jpg",
    category: "Campaign",
    title: "MV Diễn Viên Tồi - Đen Vâu",
    size: "tall",
  },
  {
    id: "den-vau-3",
    imageUrl: "/images/set-design/portfolio-den-vau-3.jpg",
    category: "Campaign",
    title: "MV Diễn Viên Tồi - Đen Vâu",
    size: "tall",
  },
  {
    id: "den-vau-4",
    imageUrl: "/images/set-design/portfolio-den-vau-4.jpg",
    category: "Campaign",
    title: "MV Diễn Viên Tồi - Đen Vâu",
    size: "tall",
  },
  {
    id: "den-vau-5",
    imageUrl: "/images/set-design/portfolio-den-vau-5.jpg",
    category: "Campaign",
    title: "MV Diễn Viên Tồi - Đen Vâu",
    size: "short",
  },
  {
    id: "yamaha",
    imageUrl: "/images/set-design/portfolio-yamaha.jpg",
    category: "Campaign",
    title: "YAMAHA SOCIAL LAYOUT",
    size: "short",
  },
];

export const FALLBACK_SET_DESIGN_TESTIMONIALS: TestimonialItem[] = [
  {
    id: "vinfast",
    logoUrl: "/images/set-design/logo-vinfast.png",
    logoAlt: "VinFast",
    quote:
      "Saint Six Studio helped us create an authentic Vietnamese atmosphere for our commercial shoot. Their attention to detail and understanding of our vision was exceptional.",
    authorName: "Nguyễn Văn A",
    authorTitle: "Creative Director, VinFast",
  },
  {
    id: "pepsi",
    logoUrl: "/images/set-design/logo-pepsi.png",
    logoAlt: "Pepsi",
    quote:
      "The set design team delivered beyond our expectations. They transformed our concept into a stunning reality that perfectly captured the energy of our brand.",
    authorName: "Trần Thị B",
    authorTitle: "Marketing Manager, PepsiCo Vietnam",
  },
  {
    id: "samsung",
    logoUrl: "/images/set-design/logo-samsung.png",
    logoAlt: "Samsung",
    quote:
      "Working with Saint Six was seamless. From initial concept to final build, they maintained the highest standards of quality and professionalism.",
    authorName: "Lê Văn C",
    authorTitle: "Brand Director, Samsung Vietnam",
  },
  {
    id: "honda",
    logoUrl: "/images/set-design/logo-honda.png",
    logoAlt: "Honda",
    quote:
      "Their creative approach and technical expertise made our product launch a visual success. The team understood exactly what we needed.",
    authorName: "Phạm Thị D",
    authorTitle: "Event Manager, Honda Vietnam",
  },
  {
    id: "unilever",
    logoUrl: "/images/set-design/logo-unilever.png",
    logoAlt: "Unilever",
    quote:
      "Saint Six Studio consistently delivers exceptional set designs that elevate our campaigns. They're our go-to partner for all production needs.",
    authorName: "Hoàng Văn E",
    authorTitle: "Production Head, Unilever Vietnam",
  },
  {
    id: "grab",
    logoUrl: "/images/set-design/logo-grab.png",
    logoAlt: "Grab",
    quote:
      "The team's ability to bring our digital brand into physical spaces was remarkable. They created an immersive experience that resonated with our audience.",
    authorName: "Đỗ Thị F",
    authorTitle: "Creative Lead, Grab Vietnam",
  },
];

// ============================================================================
// Event Planning Page Fallback Data
// ============================================================================

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
    description:
      "Meticulous planning ensures every detail is accounted for.",
  },
  {
    id: "venue-styling",
    imageUrl: "/images/event-planning/workflow-execution.jpg",
    counter: "04.",
    title: "Execution",
    description:
      "Flawless execution brings your event to life with precision.",
  },
  {
    id: "catering-entertainment",
    imageUrl: "/images/event-planning/workflow-followup.jpg",
    counter: "05.",
    title: "Follow-up",
    description:
      "Post-event support and documentation capture your success.",
  },
];

export interface EventProjectFallback {
  id: string;
  imageUrl: string;
  imageAlt: string;
  title: string;
  category: string;
}

export const FALLBACK_EVENT_PROJECTS: EventProjectFallback[] = [
  {
    id: "project-1",
    imageUrl: "/images/project-1.jpg",
    imageAlt: "Fashion Show Event",
    title: "Spring Collection Reveal",
    category: "Fashion Shows",
  },
  {
    id: "project-2",
    imageUrl: "/images/project-1.jpg",
    imageAlt: "Private Dinner Event",
    title: "VIP Gala Evening",
    category: "Private Dinners",
  },
  {
    id: "project-3",
    imageUrl: "/images/project-1.jpg",
    imageAlt: "Art Pop-Up Event",
    title: "Contemporary Art Opening",
    category: "Art & Lifestyle Pop-Ups",
  },
  {
    id: "project-4",
    imageUrl: "/images/project-1.jpg",
    imageAlt: "Corporate Celebration",
    title: "Annual Awards Ceremony",
    category: "Corporate Celebrations",
  },
];

// ============================================================================
// Decor Page Fallback Data
// ============================================================================

export const FALLBACK_DECOR_HERO = {
  heading:
    "From flagship stores to private villas — we design and decorate spaces that tell a story.",
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
    size: "large",
  },
  {
    id: "mirinda",
    imageUrl: "/images/decoration/portfolio-mirinda.jpg",
    category: "Campaign",
    title: "MIRINDA",
    size: "large",
  },
  {
    id: "den-vau-1",
    imageUrl: "/images/decoration/portfolio-denvau-1.jpg",
    category: "Campaign",
    title: "MV DIỄN VIÊN TỒI - ĐEN VÂU",
    size: "short",
  },
  {
    id: "den-vau-2",
    imageUrl: "/images/decoration/portfolio-denvau-2.jpg",
    category: "Campaign",
    title: "MV DIỄN VIÊN TỒI - ĐEN VÂU",
    size: "tall",
  },
  {
    id: "den-vau-3",
    imageUrl: "/images/decoration/portfolio-denvau-3.jpg",
    category: "Campaign",
    title: "MV DIỄN VIÊN TỒI - ĐEN VÂU",
    size: "tall",
  },
  {
    id: "den-vau-4",
    imageUrl: "/images/decoration/portfolio-denvau-4.jpg",
    category: "Campaign",
    title: "MV DIỄN VIÊN TỒI - ĐEN VÂU",
    size: "tall",
  },
  {
    id: "den-vau-5",
    imageUrl: "/images/decoration/portfolio-denvau-5.jpg",
    category: "Campaign",
    title: "MV DIỄN VIÊN TỒI - ĐEN VÂU",
    size: "short",
  },
  {
    id: "yamaha",
    imageUrl: "/images/decoration/portfolio-yamaha.jpg",
    category: "Campaign",
    title: "YAMAHA SOCIAL LAYOUT",
    size: "short",
  },
];

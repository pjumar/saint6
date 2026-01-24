"use client";

import { useRef, useEffect } from "react";
import { HeroSection } from "@/app/components/hero-section/HeroSection";
import { StudioIntro } from "@/app/components/studio-intro/StudioIntro";
import { ContactSection } from "@/app/components/contact-section/ContactSection";
import { ServiceCard } from "@/app/components/service-card/ServiceCard";
import { PortfolioSection, PortfolioItem } from "@/app/components/portfolio-section/PortfolioSection";
import { TestimonialsSection, TestimonialItem } from "@/app/components/testimonials-section/TestimonialsSection";
import { useTranslation } from "@/app/contexts/TranslationContext";
import styles from "./SetDesign.module.css";

// Portfolio items data (CMS integration in Phase 8)
const portfolioItems: PortfolioItem[] = [
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

// Testimonial items data (CMS integration in Phase 8)
const testimonialItems: TestimonialItem[] = [
  {
    id: "vinfast",
    logoUrl: "/images/set-design/logo-vinfast.png",
    logoAlt: "VinFast",
    quote: "Saint Six Studio helped us create an authentic Vietnamese atmosphere for our commercial shoot. Their attention to detail and understanding of our vision was exceptional.",
    authorName: "Nguyễn Văn A",
    authorTitle: "Creative Director, VinFast",
  },
  {
    id: "pepsi",
    logoUrl: "/images/set-design/logo-pepsi.png",
    logoAlt: "Pepsi",
    quote: "The set design team delivered beyond our expectations. They transformed our concept into a stunning reality that perfectly captured the energy of our brand.",
    authorName: "Trần Thị B",
    authorTitle: "Marketing Manager, PepsiCo Vietnam",
  },
  {
    id: "samsung",
    logoUrl: "/images/set-design/logo-samsung.png",
    logoAlt: "Samsung",
    quote: "Working with Saint Six was seamless. From initial concept to final build, they maintained the highest standards of quality and professionalism.",
    authorName: "Lê Văn C",
    authorTitle: "Brand Director, Samsung Vietnam",
  },
  {
    id: "honda",
    logoUrl: "/images/set-design/logo-honda.png",
    logoAlt: "Honda",
    quote: "Their creative approach and technical expertise made our product launch a visual success. The team understood exactly what we needed.",
    authorName: "Phạm Thị D",
    authorTitle: "Event Manager, Honda Vietnam",
  },
  {
    id: "unilever",
    logoUrl: "/images/set-design/logo-unilever.png",
    logoAlt: "Unilever",
    quote: "Saint Six Studio consistently delivers exceptional set designs that elevate our campaigns. They're our go-to partner for all production needs.",
    authorName: "Hoàng Văn E",
    authorTitle: "Production Head, Unilever Vietnam",
  },
  {
    id: "grab",
    logoUrl: "/images/set-design/logo-grab.png",
    logoAlt: "Grab",
    quote: "The team's ability to bring our digital brand into physical spaces was remarkable. They created an immersive experience that resonated with our audience.",
    authorName: "Đỗ Thị F",
    authorTitle: "Creative Lead, Grab Vietnam",
  },
];

// Service capability data (CMS integration in Phase 8)
const serviceCapabilities = [
  {
    id: "brief-concept",
    imageUrl: "/images/set-design/set-brief-concept.jpg",
    counter: "01.",
  },
  {
    id: "layout-render",
    imageUrl: "/images/set-design/set-layout-render.jpg",
    counter: "02.",
  },
  {
    id: "feedback-loop",
    imageUrl: "/images/set-design/set-feedback-loop.jpg",
    counter: "03.",
  },
  {
    id: "construction",
    imageUrl: "/images/set-design/set-construction.jpg",
    counter: "04.",
  },
  {
    id: "shoot-support",
    imageUrl: "/images/set-design/set-shoot-support.jpg",
    counter: "05.",
  },
  {
    id: "maintenance",
    imageUrl: "/images/set-design/set-maintenance.jpg",
    counter: "06.",
  },
];

export default function SetDesignPage() {
  const { t } = useTranslation();
  const carouselRef = useRef<HTMLDivElement>(null);

  // Enable mouse wheel horizontal scroll
  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    const handleWheel = (e: WheelEvent) => {
      // Only handle if there's vertical scroll (deltaY)
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        e.preventDefault();
        carousel.scrollLeft += e.deltaY;
      }
    };

    carousel.addEventListener("wheel", handleWheel, { passive: false });
    return () => carousel.removeEventListener("wheel", handleWheel);
  }, []);

  // Get service translations
  const serviceTranslations = [
    t.SET_DESIGN?.SERVICES?.CARD_1,
    t.SET_DESIGN?.SERVICES?.CARD_2,
    t.SET_DESIGN?.SERVICES?.CARD_3,
    t.SET_DESIGN?.SERVICES?.CARD_4,
    t.SET_DESIGN?.SERVICES?.CARD_5,
    t.SET_DESIGN?.SERVICES?.CARD_6,
  ];

  return (
    <div className={styles.setDesignPage}>
      {/* Hero Section */}
      <HeroSection
        heading={t.SET_DESIGN?.HERO?.TAGLINE || "From Moodboard to Build — Complete Set Design for Visual Storytelling"}
        backgroundImage="/images/set-design/hero-background.jpg"
        backgroundAlt="Set Design"
        showScrollIndicator={true}
        showDecorativeLine={true}
      />

      <div className={styles.contentContainer}>
        {/* How It Works Section with Service Cards */}
        <section className={styles.section} id="how-it-works">
          <div className={styles.sectionInner}>
            <StudioIntro
              title={t.SET_DESIGN?.INTRO?.TITLE || "How We Work"}
              description={t.SET_DESIGN?.INTRO?.DESCRIPTION || "We design, construct, and manage physical sets that transform creative direction into production-ready environments."}
              ctaText={t.SET_DESIGN?.INTRO?.CTA || "Get in touch"}
            />
            <div
              ref={carouselRef}
              className={styles.serviceCardsContainer}
              id="services"
            >
              {serviceCapabilities.map((service, index) => (
                <ServiceCard
                  key={service.id}
                  imageUrl={service.imageUrl}
                  counter={service.counter}
                  title={serviceTranslations[index]?.TITLE || `Service ${index + 1}`}
                  description={serviceTranslations[index]?.DESCRIPTION || "Service description"}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Portfolio Section */}
        <div className={styles.portfolioWrapper} id="portfolio">
          <PortfolioSection
            label={t.SET_DESIGN?.PORTFOLIO?.LABEL || "PORTFOLIO"}
            statement={t.SET_DESIGN?.PORTFOLIO?.STATEMENT || "We shape physical spaces that reflect your creative intent — environments that become part of your story"}
            items={portfolioItems}
          />
        </div>

        {/* Testimonials Section */}
        <div id="testimonials">
          <TestimonialsSection
            label={t.SET_DESIGN?.TESTIMONIALS?.LABEL || "VOICES BEHIND THE LENS"}
            title={t.SET_DESIGN?.TESTIMONIALS?.TITLE || "Stories from Brands Who Trusted Us to Build Their Vision"}
            items={testimonialItems}
          />
        </div>

        {/* Contact Section */}
        <div className={styles.contactSectionWrapper} id="contact-form">
          <ContactSection backgroundImageUrl="/images/get-in-touch-bg.jpg" />
        </div>
      </div>
    </div>
  );
}

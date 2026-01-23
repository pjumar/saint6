"use client";

import { StudioHeroSection } from "@/app/components/studio-hero-section/StudioHeroSection";
import { RoomCard } from "@/app/components/room-card/RoomCard";
import { StudioStats } from "@/app/components/studio-stats/StudioStats";
import { StudioIntro } from "@/app/components/studio-intro/StudioIntro";
import { FAQAccordion } from "@/app/components/faq-accordion/FAQAccordion";
import { InquiryForm } from "@/app/components/inquiry-form/InquiryForm";
import { ConceptRoomsShowcase } from "@/app/components/concept-rooms-showcase/ConceptRoomsShowcase";
import { useTranslation } from "@/app/contexts/TranslationContext";
import styles from "./StudioRental.module.css";

// Hardcoded room data (CMS integration in Phase 8)
const studioRooms = [
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
    showEnterButton: true,
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
    showEnterButton: true,
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
    showEnterButton: true,
  },
];

const conceptRooms = [
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
    showEnterButton: true,
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
    showEnterButton: true,
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
    showEnterButton: true,
  },
];

export default function StudioRentalPage() {
  const { t } = useTranslation();

  // FAQ data using translations (CMS integration in Phase 8)
  const faqItems = [
    { question: t.STUDIO_RENTAL.FAQ.Q1, answer: t.STUDIO_RENTAL.FAQ.A1 },
    { question: t.STUDIO_RENTAL.FAQ.Q2, answer: t.STUDIO_RENTAL.FAQ.A2 },
    { question: t.STUDIO_RENTAL.FAQ.Q3, answer: t.STUDIO_RENTAL.FAQ.A3 },
    { question: t.STUDIO_RENTAL.FAQ.Q4, answer: t.STUDIO_RENTAL.FAQ.A4 },
  ];

  return (
    <div className={styles.studioRentalPage}>
      <StudioHeroSection />

      <div className={styles.contentContainer}>
        {/* How It Works Intro Section */}
        <section className={styles.section} id="how-it-works">
          <StudioIntro
            title={t.STUDIO_RENTAL.INTRO.TITLE}
            description={t.STUDIO_RENTAL.INTRO.DESCRIPTION}
            ctaText={t.STUDIO_RENTAL.INTRO.CTA}
          />
        </section>

        {/* Stats Section */}
        <section className={styles.section} id="stats">
          <StudioStats
            totalRooms={6}
            ceilingHeight="4.5m"
            totalSpace="900m²"
            blankRooms={3}
            conceptRooms={3}
          />
        </section>

        {/* Studio Overview Section */}
        <section className={styles.section} id="studio-overview">
          <div className={styles.roomGrid}>
            {studioRooms.map((room) => (
              <RoomCard key={room.id} {...room} />
            ))}
          </div>
        </section>

        {/* Seasonal Concept Rooms Showcase */}
        <ConceptRoomsShowcase rooms={conceptRooms} />

        {/* Full Studio Rental Section */}
        <section className={styles.section} id="full-studio">
          <div className={styles.sectionPlaceholder}>
            {/* TODO [Plan 02-02]: Implement exclusive use description and pricing */}
            <p className={styles.placeholderText}>Full Studio Rental</p>
          </div>
        </section>

        {/* Makeup & Dining Sections */}
        <section className={styles.section} id="facilities">
          <div className={styles.sectionPlaceholder}>
            {/* TODO [Plan 02-02]: Implement makeup and dining support facilities */}
            <p className={styles.placeholderText}>Makeup & Dining</p>
          </div>
        </section>

        {/* Lighting Equipment Section */}
        <section className={styles.section} id="lighting">
          <div className={styles.sectionPlaceholder}>
            {/* TODO [Plan 02-02]: Implement lighting equipment showcase */}
            <p className={styles.placeholderText}>Lighting Equipment</p>
          </div>
        </section>

        {/* FAQs Section */}
        <section className={styles.section} id="faqs">
          <h2 className={styles.sectionHeading}>{t.STUDIO_RENTAL.FAQ.TITLE}</h2>
          <FAQAccordion items={faqItems} defaultExpandedIndex={1} />
        </section>

        {/* Contact Form Section */}
        <section className={styles.section} id="contact-form">
          <h2 className={styles.sectionHeading}>{t.STUDIO_RENTAL.FORM.TITLE}</h2>
          <p className={styles.sectionDescription}>
            {t.STUDIO_RENTAL.FORM.DESCRIPTION}
          </p>
          <InquiryForm />
        </section>
      </div>
    </div>
  );
}

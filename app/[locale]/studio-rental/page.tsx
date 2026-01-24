"use client";

import { StudioHeroSection } from "@/app/components/studio-hero-section/StudioHeroSection";
import { RoomCard } from "@/app/components/room-card/RoomCard";
import { StudioStats } from "@/app/components/studio-stats/StudioStats";
import { StudioIntro } from "@/app/components/studio-intro/StudioIntro";
import { FAQAccordion } from "@/app/components/faq-accordion/FAQAccordion";
import { ContactSection } from "@/app/components/contact-section/ContactSection";
import { ConceptRoomsShowcase } from "@/app/components/concept-rooms-showcase/ConceptRoomsShowcase";
import { FullRentalCard } from "@/app/components/full-rental-card/FullRentalCard";
import { FacilitiesShowcase } from "@/app/components/facilities-showcase/FacilitiesShowcase";
import { EquipmentGrid } from "@/app/components/equipment-grid/EquipmentGrid";
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


  // Equipment data (CMS integration in Phase 8)
  const equipmentItems = [
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

  return (
    <div className={styles.studioRentalPage}>
      <StudioHeroSection />

      <div className={styles.contentContainer}>
        {/* How It Works Intro + Stats + Studio Overview Section */}
        <section className={styles.section} id="how-it-works">
          <div className={styles.sectionInner}>
            <StudioIntro
              title={t.STUDIO_RENTAL.INTRO.TITLE}
              description={t.STUDIO_RENTAL.INTRO.DESCRIPTION}
              ctaText={t.STUDIO_RENTAL.INTRO.CTA}
            />
            <StudioStats
              totalRooms={6}
              ceilingHeight="4.5m"
              totalSpace="900m²"
              blankRooms={3}
              conceptRooms={3}
            />
            <div className={styles.roomGrid}>
              {studioRooms.map((room) => (
                <RoomCard key={room.id} {...room} />
              ))}
            </div>
          </div>
        </section>

        {/* Seasonal Concept Rooms Showcase */}
        <ConceptRoomsShowcase rooms={conceptRooms} />

        {/* Full Studio Rental Section */}
        <section className={styles.fullWidthSection} id="full-studio">
          <FullRentalCard
            price="2,500,000"
            backgroundImageUrl="/images/full-studio-bg.jpg"
          />
        </section>

        {/* Makeup & Dining Sections */}
        <section className={styles.section} id="facilities">
          <div className={styles.sectionInner}>
            <FacilitiesShowcase
              makeupImageUrl="/images/facilities/makeup-room.jpg"
              loungeImageUrl="/images/facilities/dining-lounge.jpg"
            />
          </div>
        </section>

        {/* Lighting Equipment Section */}
        <section className={styles.section} id="lighting">
          <div className={styles.sectionInner}>
            <EquipmentGrid
              items={equipmentItems}
              backgroundColorsImage="/images/equipment/background-color.jpg"
            />
          </div>
        </section>

        {/* FAQs Section */}
        <section className={styles.section} id="faqs">
          <div className={styles.sectionInner}>
            <div className={styles.faqSection}>
              <div className={styles.faqHeadingColumn}>
                <p className={styles.faqLabel}>{t.STUDIO_RENTAL.FAQ.LABEL}</p>
                <h2 className={styles.faqTitle}>{t.STUDIO_RENTAL.FAQ.TITLE}</h2>
              </div>
              <div className={styles.faqAccordionColumn}>
                <FAQAccordion items={faqItems} defaultExpandedIndex={0} />
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <div className={styles.contactSectionWrapper} id="contact-form">
          <ContactSection backgroundImageUrl="/images/get-in-touch-bg.jpg" />
        </div>
      </div>
    </div>
  );
}

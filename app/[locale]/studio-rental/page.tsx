"use client";

import { StudioHeroSection } from "@/app/components/studio-hero-section/StudioHeroSection";
import { RoomCard } from "@/app/components/room-card/RoomCard";
import { StudioStats } from "@/app/components/studio-stats/StudioStats";
import { StudioIntro } from "@/app/components/studio-intro/StudioIntro";
import { FAQAccordion } from "@/app/components/faq-accordion/FAQAccordion";
import { InquiryForm } from "@/app/components/inquiry-form/InquiryForm";
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

// FAQ data (CMS integration in Phase 8)
const faqItems = [
  {
    question: "How do I book?",
    answer:
      "You can book by filling out the inquiry form below or contacting us directly. We'll respond within 24 hours to confirm availability and details.",
  },
  {
    question: "What's the cancellation policy?",
    answer:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Cancellations made 48 hours in advance receive a full refund. Cancellations within 48 hours are subject to a 50% fee.",
  },
  {
    question: "Can I visit before booking?",
    answer:
      "Yes, we offer studio tours by appointment. Contact us to schedule a walkthrough of our spaces.",
  },
  {
    question: "What's included in the rental?",
    answer:
      "Studio rental includes access to the space, basic lighting equipment, makeup facilities, and on-site support. Additional equipment and services are available upon request.",
  },
];

export default function StudioRentalPage() {
  return (
    <div className={styles.studioRentalPage}>
      <StudioHeroSection />

      <div className={styles.contentContainer}>
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

        {/* How It Work Intro Section */}
        <section className={styles.section} id="how-it-work">
          <StudioIntro
            title="How IT Work"
            description="Because your vision deserves more than a space— It needs a stage, a story, and a studio that moves with you."
            ctaText="Get in touch"
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

        {/* Seasonal Concept Rooms Section */}
        <section className={styles.section} id="concept-rooms">
          <h2 className={styles.sectionHeading}>Seasonal Concept Rooms</h2>
          <p className={styles.sectionDescription}>
            Explore our rotating themed spaces designed for unique creative
            visions.
          </p>
          <div className={styles.roomGrid}>
            {conceptRooms.map((room) => (
              <RoomCard key={room.id} {...room} />
            ))}
          </div>
        </section>

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
          <h2 className={styles.sectionHeading}>Frequently Asked Questions</h2>
          <FAQAccordion items={faqItems} defaultExpandedIndex={1} />
        </section>

        {/* Contact Form Section */}
        <section className={styles.section} id="contact-form">
          <h2 className={styles.sectionHeading}>Send an Inquiry</h2>
          <p className={styles.sectionDescription}>
            Have questions or ready to book? Fill out the form below and we'll
            get back to you shortly.
          </p>
          <InquiryForm />
        </section>
      </div>
    </div>
  );
}

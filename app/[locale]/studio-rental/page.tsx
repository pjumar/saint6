import type { Metadata } from "next";
import type { Locale } from "@/app/types";
import { StudioHeroSection } from "@/app/components/studio-hero-section/StudioHeroSection";
import { RoomCard } from "@/app/components/room-card/RoomCard";
import styles from "./StudioRental.module.css";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const typedLocale = locale as Locale;
  const isVi = typedLocale === "vi";

  return {
    title: isVi
      ? "Thuê Studio | Saint 6 Studio"
      : "Studio Rental | Saint 6 Studio",
    description: isVi
      ? "Thuê không gian studio chuyên nghiệp của chúng tôi cho các dự án sáng tạo của bạn. The Loft, The Studio, The Arena và các phòng concept theo mùa có sẵn cho chụp ảnh, sản xuất và sự kiện."
      : "Rent our professional studio spaces for your creative projects. The Loft, The Studio, The Arena, and seasonal concept rooms available for photoshoots, productions, and events.",
    openGraph: {
      title: isVi
        ? "Thuê Studio | Saint 6 Studio"
        : "Studio Rental | Saint 6 Studio",
      description: isVi
        ? "Thuê không gian studio chuyên nghiệp của chúng tôi cho các dự án sáng tạo của bạn."
        : "Rent our professional studio spaces for your creative projects.",
      type: "website",
      locale: isVi ? "vi_VN" : "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title: isVi
        ? "Thuê Studio | Saint 6 Studio"
        : "Studio Rental | Saint 6 Studio",
      description: isVi
        ? "Thuê không gian studio chuyên nghiệp của chúng tôi cho các dự án sáng tạo của bạn."
        : "Rent our professional studio spaces for your creative projects.",
    },
  };
}

export const revalidate = 3600;

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

export default function StudioRentalPage() {
  return (
    <div className={styles.studioRentalPage}>
      <StudioHeroSection />

      <div className={styles.contentContainer}>
        {/* Stats Section */}
        <section className={styles.section} id="stats">
          <div className={styles.sectionPlaceholder}>
            {/* TODO [Plan 02-02]: Implement stats section with total rooms, ceiling height, total space, blank rooms, concept rooms */}
            <p className={styles.placeholderText}>Stats Section</p>
          </div>
        </section>

        {/* How It Work Intro Section */}
        <section className={styles.section} id="how-it-work">
          <div className={styles.sectionPlaceholder}>
            {/* TODO [Plan 02-02]: Implement how it works description and CTA button */}
            <p className={styles.placeholderText}>How It Work Section</p>
          </div>
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
          <div className={styles.sectionPlaceholder}>
            {/* TODO [Plan 02-02]: Implement collapsible Q&A */}
            <p className={styles.placeholderText}>FAQs</p>
          </div>
        </section>

        {/* Contact Form Section */}
        <section className={styles.section} id="contact-form">
          <div className={styles.sectionPlaceholder}>
            {/* TODO [Plan 02-02]: Implement inquiry form */}
            <p className={styles.placeholderText}>Contact Form</p>
          </div>
        </section>
      </div>
    </div>
  );
}

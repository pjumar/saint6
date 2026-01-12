import type { Metadata } from "next";
import type { Locale } from "@/app/types";
import { StudioHeroSection } from "@/app/components/studio-hero-section/StudioHeroSection";
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

        {/* Studio Overview Carousel */}
        <section className={styles.section} id="studio-overview">
          <div className={styles.sectionPlaceholder}>
            {/* TODO [Plan 02-02]: Implement carousel with 3 room previews (The Loft, The Studio, The Arena) */}
            <p className={styles.placeholderText}>Studio Overview Carousel</p>
          </div>
        </section>

        {/* Seasonal Concept Rooms Section */}
        <section className={styles.section} id="concept-rooms">
          <div className={styles.sectionPlaceholder}>
            {/* TODO [Plan 02-02]: Implement header, description, and 3 concept room cards */}
            <p className={styles.placeholderText}>Seasonal Concept Rooms</p>
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

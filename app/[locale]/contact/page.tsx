"use client";

import { HeroSection } from "@/app/components/hero-section/HeroSection";
import { ContactInfo } from "@/app/components/contact-info";
import { MapImage } from "@/app/components/map-image";
import { ContactSection } from "@/app/components/contact-section/ContactSection";
import { SOCIAL_LINKS } from "@/app/constants/social-links";
import { useTranslation } from "@/app/contexts/TranslationContext";
import styles from "./Contact.module.css";

export default function ContactPage() {
  const { t } = useTranslation();

  // Access translations with fallbacks
  const contactTranslations = (t as { CONTACT_US?: Record<string, unknown> }).CONTACT_US || {};
  const infoTranslations = (contactTranslations.INFO as Record<string, string>) || {};

  return (
    <div className={styles.contactPage}>
      {/* 1. Hero Section - Studio exterior with main heading */}
      <HeroSection
        heading={infoTranslations.HEADING ?? "Let's Create Something Exceptional Together"}
        backgroundImage="/images/hero/hero-background.jpg"
        backgroundAlt="Saint 6 Studio exterior"
        showScrollIndicator={true}
        showDecorativeLine={true}
      />

      {/* 2. Contact Info Section - Two columns: heading/subheading | details */}
      <section className={styles.contactInfoSection}>
        <ContactInfo
          heading={infoTranslations.TITLE ?? "Contact Us"}
          subheading={infoTranslations.SUBHEADING ?? "Let's Create Something Exceptional Together"}
          address={`${infoTranslations.ADDRESS_LINE1 ?? "6 Be Van Cam, Tan Kieng"}, ${infoTranslations.ADDRESS_LINE2 ?? "District 7, HCMC"}`}
          email={infoTranslations.EMAIL ?? "Saint6studios@gmail.com"}
          phone={infoTranslations.PHONE ?? "0919 403 784 - 0918 756 573"}
          socialLinks={SOCIAL_LINKS}
        />
      </section>

      {/* 3. Map Section - Full width with spiral decoration */}
      <section className={styles.mapSection}>
        <MapImage
          imageUrl="/images/contact/saint6-map.jpg"
          alt="Saint 6 Studio location map"
          showSpiral={true}
          showPin={true}
        />
      </section>

      {/* 4. Contact Form Section - Background image with overlaid form card */}
      <ContactSection
        backgroundImageUrl="/images/get-in-touch-bg.jpg"
      />
    </div>
  );
}

"use client";

import { HeroSection } from "@/app/components/hero-section/HeroSection";
import { ContactInfo, SocialLink } from "@/app/components/contact-info";
import { MapImage } from "@/app/components/map-image";
import { ContactFormSection } from "@/app/components/contact-form-section";
import { useTranslation } from "@/app/contexts/TranslationContext";
import styles from "./Contact.module.css";

// Social links data (CMS integration in Phase 8)
const socialLinksData: SocialLink[] = [
  {
    platform: "Facebook",
    url: "https://facebook.com/saint6studio",
    icon: "/assets/social/facebook.svg",
  },
  {
    platform: "Instagram",
    url: "https://instagram.com/saint6studio",
    icon: "/assets/social/instagram.svg",
  },
  {
    platform: "TikTok",
    url: "https://tiktok.com/@saint6studio",
    icon: "/assets/social/tiktok.svg",
  },
];

export default function ContactPage() {
  const { t } = useTranslation();

  // Access translations with fallbacks
  const contactTranslations = (t as { CONTACT_US?: Record<string, unknown> }).CONTACT_US || {};
  const heroTranslations = (contactTranslations.HERO as Record<string, string>) || {};
  const infoTranslations = (contactTranslations.INFO as Record<string, string>) || {};

  return (
    <div className={styles.contactPage}>
      {/* 1. Hero Section */}
      <HeroSection
        heading={heroTranslations.TAGLINE ?? "Let's Connect"}
        backgroundImage="/images/about-us/hero-background.jpg"
        backgroundAlt="Contact Saint 6 Studio"
        showScrollIndicator={true}
        showDecorativeLine={true}
      />

      <div className={styles.contentContainer}>
        {/* 2. Contact Info + Map Section */}
        <section className={styles.contactInfoSection}>
          <div className={styles.contactInfoWrapper}>
            <ContactInfo
              label={infoTranslations.LABEL ?? "CONTACT US"}
              heading={infoTranslations.HEADING ?? "Let's Create Something Exceptional Together"}
              address={{
                line1: infoTranslations.ADDRESS_LINE1 ?? "6 Be Van Cam, Tan Kieng",
                line2: infoTranslations.ADDRESS_LINE2 ?? "District 7, HCMC",
              }}
              email={infoTranslations.EMAIL ?? "Saint6studios@gmail.com"}
              phone={infoTranslations.PHONE ?? "0919 403 784 - 0918 756 573"}
              socialLinks={socialLinksData}
            />
          </div>
          <div className={styles.mapWrapper}>
            <MapImage
              imageUrl="/images/contact/map-placeholder.jpg"
              alt="Saint 6 Studio location"
            />
          </div>
        </section>

        {/* 3. Contact Form Section */}
        <ContactFormSection />
      </div>
    </div>
  );
}

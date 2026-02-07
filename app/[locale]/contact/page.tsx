import { ContactInfo } from "@/app/components/contact-info";
import { ContactSection } from "@/app/components/contact-section/ContactSection";
import { HeroSection } from "@/app/components/hero-section/HeroSection";
import { MapImage } from "@/app/components/map-image";
import { SOCIAL_LINKS } from "@/app/constants/social-links";
import {
  FALLBACK_CONTACT_HERO,
  FALLBACK_CONTACT_INFO,
  FALLBACK_CONTACT_MAP_IMAGE,
} from "@/app/lib/fallback-data";
import { getContactPage, getStrapiImageUrl } from "@/app/lib/strapi";
import { getTranslations } from "@/app/lib/translations";
import styles from "./Contact.module.css";

// ============================================================================
// Page Component - Server Component with static generation
// ============================================================================

interface PageProps {
  params: Promise<{ locale: string }>;
}

export default async function ContactPage({ params }: PageProps) {
  const { locale } = await params;
  const t = getTranslations(locale);
  const isDev = process.env.NODE_ENV === "development";

  // Fetch CMS data at build time
  const strapiData = await getContactPage(locale);

  // Dev fallback - use hardcoded data when Strapi is unavailable during development
  const useFallback = !strapiData && isDev;
  if (useFallback) {
    console.warn(
      "[ContactPage] Using fallback data - Strapi CMS not available in development"
    );
  }

  // Access translations with fallbacks
  const contactTranslations =
    (t as { CONTACT_US?: Record<string, unknown> }).CONTACT_US || {};
  const infoTranslations =
    (contactTranslations.INFO as Record<string, string>) || {};

  // Hero
  const heroHeading =
    strapiData?.hero?.heading ||
    (useFallback
      ? FALLBACK_CONTACT_HERO.heading
      : infoTranslations.HEADING ??
        "Let's Create Something Exceptional Together");
  const heroBackgroundFromCms = strapiData?.hero?.background_image
    ? getStrapiImageUrl(strapiData.hero.background_image)
    : null;
  const heroBackground =
    heroBackgroundFromCms || FALLBACK_CONTACT_HERO.backgroundImage;
  const heroBackgroundAlt =
    strapiData?.hero?.background_alt || FALLBACK_CONTACT_HERO.backgroundAlt;

  // Contact Info
  const contactTitle =
    strapiData?.info?.title ||
    (useFallback
      ? FALLBACK_CONTACT_INFO.title
      : infoTranslations.TITLE ?? "Contact Us");
  const contactSubheading =
    strapiData?.info?.subheading ||
    (useFallback
      ? FALLBACK_CONTACT_INFO.subheading
      : infoTranslations.SUBHEADING ??
        "Let's Create Something Exceptional Together");
  const addressLine1 =
    strapiData?.info?.address_line_1 ||
    (useFallback
      ? FALLBACK_CONTACT_INFO.addressLine1
      : infoTranslations.ADDRESS_LINE1 ?? "6 Be Van Cam, Tan Kieng");
  const addressLine2 =
    strapiData?.info?.address_line_2 ||
    (useFallback
      ? FALLBACK_CONTACT_INFO.addressLine2
      : infoTranslations.ADDRESS_LINE2 ?? "District 7, HCMC");
  const contactEmail =
    strapiData?.info?.email ||
    (useFallback
      ? FALLBACK_CONTACT_INFO.email
      : infoTranslations.EMAIL ?? "Saint6studios@gmail.com");
  const contactPhone =
    strapiData?.info?.phone ||
    (useFallback
      ? FALLBACK_CONTACT_INFO.phone
      : infoTranslations.PHONE ?? "0919 403 784 - 0918 756 573");

  // Combine address lines
  const fullAddress = `${addressLine1}, ${addressLine2}`;

  // Map Image
  const mapImageFromCms = strapiData?.map_image
    ? getStrapiImageUrl(strapiData.map_image)
    : null;
  const mapImageUrl = mapImageFromCms || FALLBACK_CONTACT_MAP_IMAGE;

  return (
    <div className={styles.contactPage}>
      {/* 1. Hero Section - Studio exterior with main heading */}
      <HeroSection
        heading={heroHeading}
        backgroundImage={heroBackground}
        backgroundAlt={heroBackgroundAlt}
        showScrollIndicator={true}
        showDecorativeLine={true}
      />

      {/* 2. Contact Info Section - Two columns: heading/subheading | details */}
      <section className={styles.contactInfoSection}>
        <ContactInfo
          heading={contactTitle}
          subheading={contactSubheading}
          address={fullAddress}
          email={contactEmail}
          phone={contactPhone}
          socialLinks={SOCIAL_LINKS}
        />
      </section>

      {/* 3. Map Section - Full width */}
      <section className={styles.mapSection}>
        <MapImage
          imageUrl={mapImageUrl}
          alt="Saint 6 Studio location map"
          showSpiral={false}
          showPin={true}
        />
      </section>

      {/* 4. Contact Form Section - Background image with overlaid form card */}
      <ContactSection backgroundImageUrl="/images/get-in-touch-bg.jpg" />
    </div>
  );
}

import { ContactInfo } from "@/app/components/contact-info";
import { ContactSection } from "@/app/components/contact-section/ContactSection";
import { HeroSection } from "@/app/components/hero-section/HeroSection";
import { MapImage } from "@/app/components/map-image";
import { SOCIAL_LINKS } from "@/app/constants/social-links";
import {
  FALLBACK_CONTACT_HERO,
  FALLBACK_CONTACT_INFO,
  FALLBACK_CONTACT_MAP_IMAGE,
} from "@/app/lib/fallback";
import { buildPageMetadata } from "@/app/lib/seo";
import { getContactPage, getStrapiImageUrl } from "@/app/lib/strapi";
import { getTranslations } from "@/app/lib/translations";
import type { Locale } from "@/app/types";
import styles from "./Contact.module.css";

// ============================================================================
// SEO Metadata
// ============================================================================

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const data = await getContactPage(locale);
  return buildPageMetadata({
    hero: data?.hero,
    locale: locale as Locale,
    path: "contact",
  });
}

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
      "[ContactPage] Using fallback data - Strapi CMS not available in development",
    );
  }

  // Access translations directly via typed object
  const contactT = t.CONTACT_US;

  // Hero
  const heroHeading =
    strapiData?.hero?.heading ||
    (useFallback ? FALLBACK_CONTACT_HERO.heading : contactT.INFO.HEADING);
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
    (useFallback ? FALLBACK_CONTACT_INFO.title : contactT.INFO.TITLE);
  const contactSubheading =
    strapiData?.info?.subheading ||
    (useFallback ? FALLBACK_CONTACT_INFO.subheading : contactT.INFO.SUBHEADING);
  const addressLine1 =
    strapiData?.info?.address_line_1 ||
    (useFallback
      ? FALLBACK_CONTACT_INFO.addressLine1
      : contactT.INFO.ADDRESS_LINE1);
  const addressLine2 =
    strapiData?.info?.address_line_2 ||
    (useFallback
      ? FALLBACK_CONTACT_INFO.addressLine2
      : contactT.INFO.ADDRESS_LINE2);
  const contactEmail =
    strapiData?.info?.email ||
    (useFallback ? FALLBACK_CONTACT_INFO.email : contactT.INFO.EMAIL);
  const contactPhone =
    strapiData?.info?.phone ||
    (useFallback ? FALLBACK_CONTACT_INFO.phone : contactT.INFO.PHONE);

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
      <ContactSection backgroundImageUrl="/images/contact-section-bg.webp" />
    </div>
  );
}

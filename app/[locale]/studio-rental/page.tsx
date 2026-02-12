import { BlankRoomsGrid } from "@/app/components/blank-rooms-grid/BlankRoomsGrid";
import { ConceptRoomsShowcase } from "@/app/components/concept-rooms-showcase/ConceptRoomsShowcase";
import { ContactSection } from "@/app/components/contact-section/ContactSection";
import { EquipmentGrid } from "@/app/components/equipment-grid/EquipmentGrid";
import { FacilitiesShowcase } from "@/app/components/facilities-showcase/FacilitiesShowcase";
import { FAQAccordion } from "@/app/components/faq-accordion/FAQAccordion";
import { FullRentalCard } from "@/app/components/full-rental-card/FullRentalCard";
import { StudioHeroSection } from "@/app/components/studio-hero-section/StudioHeroSection";
import { StudioIntro } from "@/app/components/studio-intro/StudioIntro";
import { StudioStats } from "@/app/components/studio-stats/StudioStats";
import type { BookingRoomData } from "@/app/components/booking-modal/BookingModal";
import {
  FALLBACK_CONCEPT_ROOMS,
  FALLBACK_EQUIPMENT,
  FALLBACK_FACILITIES,
  FALLBACK_FULL_RENTAL,
  FALLBACK_STUDIO_HERO,
  FALLBACK_STUDIO_INTRO,
  FALLBACK_STUDIO_ROOMS,
  FALLBACK_STUDIO_STATS,
} from "@/app/lib/fallback";
import { buildPageMetadata } from "@/app/lib/seo";
import {
  getStrapiImageUrl,
  getStudioRentalPage,
  type StrapiEquipmentItem,
  type StrapiFaqItem,
  type StrapiStudioRoom,
} from "@/app/lib/strapi";
import { getTranslations } from "@/app/lib/translations";
import type { Locale } from "@/app/types";
import styles from "./StudioRental.module.css";

// ============================================================================
// SEO Metadata
// ============================================================================

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const data = await getStudioRentalPage(locale);
  return buildPageMetadata({
    hero: data?.hero,
    locale: locale as Locale,
    path: "studio-rental",
  });
}

// ============================================================================
// Transformer Functions - Convert Strapi data to component props
// ============================================================================

interface GalleryImage {
  url: string;
  alt?: string;
}

interface RoomData {
  id: string;
  title: string;
  pricePerHour: string;
  counter: string;
  space: string;
  width: string;
  ceilingHeight: string;
  description: string;
  imageUrl: string;
  showEnterButton?: boolean;
  gallery?: GalleryImage[];
}

function transformRooms(
  rooms: StrapiStudioRoom[] | undefined,
  startIndex: number = 0,
  totalRooms: number = 6,
): RoomData[] {
  if (!rooms || rooms.length === 0) return [];

  const result: RoomData[] = [];

  rooms
    .sort((a, b) => a.order - b.order)
    .forEach((room, index) => {
      const imageUrl = getStrapiImageUrl(room.image);
      if (!imageUrl) return;

      const roomIndex = startIndex + index + 1;
      const counter = `${String(roomIndex).padStart(2, "0")}/${String(totalRooms).padStart(2, "0")}`;

      // Transform gallery images
      const gallery: GalleryImage[] = [];
      if (room.gallery && room.gallery.length > 0) {
        for (const img of room.gallery) {
          const galleryUrl = getStrapiImageUrl(img);
          if (galleryUrl) {
            gallery.push({
              url: galleryUrl,
              alt: img.alternativeText || room.title,
            });
          }
        }
      }

      result.push({
        id: room.slug || String(room.id),
        title: room.title,
        pricePerHour: room.price_per_hour,
        counter: room.counter || counter,
        space: room.space || "125m²",
        width: room.width || "6m",
        ceilingHeight: room.ceiling_height || "4.5m",
        description: room.description || "",
        imageUrl,
        showEnterButton: true,
        gallery,
      });
    });

  return result;
}

interface EquipmentData {
  id: string;
  name: string;
  spec: string;
  imageUrl: string;
}

function transformEquipment(
  equipment: StrapiEquipmentItem[] | undefined,
): EquipmentData[] {
  if (!equipment || equipment.length === 0) return [];

  return equipment
    .sort((a, b) => a.order - b.order)
    .map((item) => {
      const imageUrl = getStrapiImageUrl(item.image);
      if (!imageUrl) return null;

      return {
        id: String(item.id),
        name: item.name,
        spec: item.spec || "",
        imageUrl,
      };
    })
    .filter((item): item is EquipmentData => item !== null);
}

interface FAQData {
  question: string;
  answer: string;
}

function transformFaqs(faqs: StrapiFaqItem[] | undefined): FAQData[] {
  if (!faqs || faqs.length === 0) return [];

  return faqs
    .sort((a, b) => a.order - b.order)
    .map((faq) => ({
      question: faq.question,
      answer: faq.answer,
    }));
}

// ============================================================================
// Page Component - Server Component with static generation
// ============================================================================

interface PageProps {
  params: Promise<{ locale: string }>;
}

export default async function StudioRentalPage({ params }: PageProps) {
  const { locale } = await params;
  const t = getTranslations(locale);
  const isDev = process.env.NODE_ENV === "development";

  // Fetch CMS data at build time
  const strapiData = await getStudioRentalPage(locale);

  // Dev fallback - use hardcoded data when Strapi is unavailable during development
  const useFallback = !strapiData && isDev;
  if (useFallback) {
    console.warn(
      "[StudioRentalPage] Using fallback data - Strapi CMS not available in development",
    );
  }

  // Transform Strapi data to component props (or use fallbacks)

  // Hero
  const heroHeading =
    strapiData?.hero?.heading ||
    (useFallback ? FALLBACK_STUDIO_HERO.heading : t.STUDIO_RENTAL.HERO.TAGLINE);
  const heroBackgroundFromCms = strapiData?.hero?.background_image
    ? getStrapiImageUrl(strapiData.hero.background_image)
    : null;
  const heroBackground =
    heroBackgroundFromCms || FALLBACK_STUDIO_HERO.backgroundImage;
  const heroBackgroundAlt =
    strapiData?.hero?.background_alt || FALLBACK_STUDIO_HERO.backgroundAlt;

  // Intro
  const introTitle =
    strapiData?.intro?.label ||
    (useFallback ? FALLBACK_STUDIO_INTRO.title : t.STUDIO_RENTAL.INTRO.TITLE);
  const introDescription =
    strapiData?.intro?.description ||
    (useFallback
      ? FALLBACK_STUDIO_INTRO.description
      : t.STUDIO_RENTAL.INTRO.DESCRIPTION);
  const introCtaText =
    strapiData?.intro?.cta_text ||
    (useFallback ? FALLBACK_STUDIO_INTRO.ctaText : t.STUDIO_RENTAL.INTRO.CTA);

  // Stats
  const statsData = strapiData?.stats
    ? {
        totalRooms: strapiData.stats.total_rooms,
        ceilingHeight: strapiData.stats.ceiling_height,
        totalSpace: strapiData.stats.total_space,
        blankRooms: strapiData.stats.blank_rooms,
        conceptRooms: strapiData.stats.concept_rooms,
      }
    : useFallback
      ? FALLBACK_STUDIO_STATS
      : {
          totalRooms: 6,
          ceilingHeight: "4.5m",
          totalSpace: "900m²",
          blankRooms: 3,
          conceptRooms: 3,
        };

  // Rooms
  const totalRooms =
    (strapiData?.rooms?.length || 0) + (strapiData?.concept_rooms?.length || 0);
  const studioRooms = strapiData?.rooms
    ? transformRooms(strapiData.rooms, 0, totalRooms || 6)
    : useFallback
      ? FALLBACK_STUDIO_ROOMS
      : [];

  const conceptRooms = strapiData?.concept_rooms
    ? transformRooms(
        strapiData.concept_rooms,
        strapiData?.rooms?.length || 0,
        totalRooms || 6,
      )
    : useFallback
      ? FALLBACK_CONCEPT_ROOMS
      : [];

  // Full Rental
  const fullRentalPrice =
    strapiData?.full_rental?.price ||
    (useFallback ? FALLBACK_FULL_RENTAL.price : "2,500,000");
  const fullRentalBgFromCms = strapiData?.full_rental?.background_image
    ? getStrapiImageUrl(strapiData.full_rental.background_image)
    : null;
  const fullRentalBg =
    fullRentalBgFromCms || FALLBACK_FULL_RENTAL.backgroundImageUrl;

  // Facilities
  const makeupImageFromCms = strapiData?.facilities?.makeup_image
    ? getStrapiImageUrl(strapiData.facilities.makeup_image)
    : null;
  const loungeImageFromCms = strapiData?.facilities?.lounge_image
    ? getStrapiImageUrl(strapiData.facilities.lounge_image)
    : null;
  const facilitiesData = {
    makeupImageUrl:
      makeupImageFromCms ||
      (useFallback
        ? FALLBACK_FACILITIES.makeupImageUrl
        : "/images/facilities/makeup-room.jpg"),
    loungeImageUrl:
      loungeImageFromCms ||
      (useFallback
        ? FALLBACK_FACILITIES.loungeImageUrl
        : "/images/facilities/dining-lounge.jpg"),
  };

  // Equipment
  const equipmentItems = strapiData?.equipment
    ? transformEquipment(strapiData.equipment)
    : useFallback
      ? FALLBACK_EQUIPMENT
      : [];

  // All rooms combined for booking modal tabs
  const allBookingRooms: BookingRoomData[] = [
    ...[...studioRooms, ...conceptRooms].map((r) => ({
      title: r.title,
      pricePerHour: r.pricePerHour,
      description: r.description,
      space: r.space,
      width: r.width,
      ceilingHeight: r.ceilingHeight,
      imageUrl: r.imageUrl,
      gallery: r.gallery,
    })),
    {
      title: t.STUDIO_RENTAL.FULL_RENTAL.ROOM_NAME,
      pricePerHour: fullRentalPrice,
      description: t.STUDIO_RENTAL.FULL_RENTAL.DESCRIPTION,
      space: "900m²",
      width: "",
      ceilingHeight: "",
      imageUrl: fullRentalBg,
    },
  ];

  // FAQs - use CMS data if available, otherwise use translations
  const faqItems = strapiData?.faqs
    ? transformFaqs(strapiData.faqs)
    : [
        { question: t.STUDIO_RENTAL.FAQ.Q1, answer: t.STUDIO_RENTAL.FAQ.A1 },
        { question: t.STUDIO_RENTAL.FAQ.Q2, answer: t.STUDIO_RENTAL.FAQ.A2 },
        { question: t.STUDIO_RENTAL.FAQ.Q3, answer: t.STUDIO_RENTAL.FAQ.A3 },
        { question: t.STUDIO_RENTAL.FAQ.Q4, answer: t.STUDIO_RENTAL.FAQ.A4 },
      ];

  return (
    <div className={styles.studioRentalPage}>
      <StudioHeroSection
        heading={heroHeading}
        backgroundImage={heroBackground}
        backgroundAlt={heroBackgroundAlt}
      />

      <div className={styles.contentContainer}>
        {/* How It Works Intro + Stats + Studio Overview Section */}
        <section className={styles.section} id="how-it-works">
          <div className={styles.sectionInner}>
            <StudioIntro
              title={introTitle}
              description={introDescription}
              ctaText={introCtaText}
            />
            <StudioStats {...statsData} />
            <BlankRoomsGrid
              rooms={studioRooms}
              allBookingRooms={allBookingRooms}
            />
          </div>
        </section>

        {/* Seasonal Concept Rooms Showcase */}
        {conceptRooms.length > 0 && (
          <ConceptRoomsShowcase
            rooms={conceptRooms}
            allBookingRooms={allBookingRooms}
            bookingRoomIndexOffset={studioRooms.length}
          />
        )}

        {/* Full Studio Rental Section */}
        <section className={styles.fullWidthSection} id="full-studio">
          <FullRentalCard
            price={fullRentalPrice}
            backgroundImageUrl={fullRentalBg}
            allBookingRooms={allBookingRooms}
            bookingRoomIndex={allBookingRooms.length - 1}
          />
        </section>

        {/* Makeup & Dining Sections */}
        <section className={styles.section} id="facilities">
          <div className={styles.sectionInner}>
            <FacilitiesShowcase {...facilitiesData} />
          </div>
        </section>

        {/* Lighting Equipment Section */}
        {equipmentItems.length > 0 && (
          <section className={styles.section} id="lighting">
            <div className={styles.sectionInner}>
              <EquipmentGrid
                items={equipmentItems}
                backgroundColorsImage="/images/equipment/background-color.jpg"
              />
            </div>
          </section>
        )}

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

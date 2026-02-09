import Image from "next/image";
import { AboutIntro } from "@/app/components/about-intro/AboutIntro";
import { ContactSection } from "@/app/components/contact-section/ContactSection";
import { FounderQuote } from "@/app/components/founder-quote/FounderQuote";
import { HeroSection } from "@/app/components/hero-section/HeroSection";
import { HighlightBand } from "@/app/components/highlight-band/HighlightBand";
import {
  type ServiceCard,
  ServiceCardsCarousel,
} from "@/app/components/service-cards-carousel/ServiceCardsCarousel";
import {
  type ValueItem,
  ValuesGrid,
} from "@/app/components/values-grid/ValuesGrid";
import {
  FALLBACK_ABOUT_FOUNDER,
  FALLBACK_ABOUT_FULL_WIDTH_IMAGE,
  FALLBACK_ABOUT_HERO,
  FALLBACK_ABOUT_INTRO,
  FALLBACK_ABOUT_MISSION,
  FALLBACK_ABOUT_STORY,
  FALLBACK_ABOUT_TIMELINE,
  FALLBACK_ABOUT_VALUES,
  FALLBACK_ABOUT_VISION,
} from "@/app/lib/fallback";
import { buildPageMetadata } from "@/app/lib/seo";
import {
  getAboutPage,
  getStrapiImageUrl,
  type StrapiFounder,
  type StrapiTimelineItem,
  type StrapiValue,
} from "@/app/lib/strapi";
import { getTranslations } from "@/app/lib/translations";
import type { Locale } from "@/app/types";
import styles from "./About.module.css";

// ============================================================================
// SEO Metadata
// ============================================================================

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const data = await getAboutPage(locale);
  return buildPageMetadata({
    hero: data?.hero,
    locale: locale as Locale,
    path: "about",
  });
}

// ============================================================================
// Transformer Functions - Convert Strapi data to component props
// ============================================================================

function transformValues(values: StrapiValue[] | undefined): ValueItem[] {
  if (!values || values.length === 0) return [];

  // Map Strapi values to component ValueItem format
  // The id is derived from the title (lowercase, spaces to hyphens)
  return values.map((value) => ({
    id: value.title.toLowerCase().replace(/\s+/g, "-"),
    letter: value.letter,
    title: value.title,
    description: value.description,
  }));
}

function transformTimeline(
  timeline: StrapiTimelineItem[] | undefined,
): ServiceCard[] {
  if (!timeline || timeline.length === 0) return [];

  return timeline.map((item) => {
    const imageUrl = getStrapiImageUrl(item.image);
    return {
      id: item.year,
      imageUrl: imageUrl || "",
      counter: item.year,
      title: "",
      description: item.description,
    };
  });
}

function transformFounder(founder: StrapiFounder | undefined): {
  imageUrl: string;
  quote: string;
  name: string;
  title: string;
} | null {
  if (!founder) return null;

  const imageUrl = getStrapiImageUrl(founder.image);
  if (!imageUrl) return null;

  return {
    imageUrl,
    quote: founder.quote,
    name: founder.name,
    title: founder.title,
  };
}

// ============================================================================
// Page Component - Server Component with static generation
// ============================================================================

interface PageProps {
  params: Promise<{ locale: string }>;
}

export default async function AboutPage({ params }: PageProps) {
  const { locale } = await params;
  const t = getTranslations(locale);
  const isDev = process.env.NODE_ENV === "development";

  // Fetch CMS data at build time
  const strapiData = await getAboutPage(locale);

  // Dev fallback - use hardcoded data when Strapi is unavailable during development
  const useFallback = !strapiData && isDev;
  if (useFallback) {
    console.warn(
      "[AboutPage] Using fallback data - Strapi CMS not available in development",
    );
  }

  // Access translations directly via typed object
  const aboutT = t.ABOUT_US;

  // Hero
  const heroHeading =
    strapiData?.hero?.heading ||
    (useFallback
      ? FALLBACK_ABOUT_HERO.heading
      : (aboutT.HERO.TAGLINE ?? "We Imagine. We Design. We Create."));
  const heroBackgroundFromCms = strapiData?.hero?.background_image
    ? getStrapiImageUrl(strapiData.hero.background_image)
    : null;
  const heroBackground =
    heroBackgroundFromCms || FALLBACK_ABOUT_HERO.backgroundImage;
  const heroBackgroundAlt =
    strapiData?.hero?.background_alt || FALLBACK_ABOUT_HERO.backgroundAlt;

  // Intro
  const introLabel =
    strapiData?.intro?.label ||
    (useFallback ? FALLBACK_ABOUT_INTRO.label : aboutT.INTRO.LABEL);
  const introHeadline =
    strapiData?.intro?.headline ||
    (useFallback ? FALLBACK_ABOUT_INTRO.headline : aboutT.INTRO.HEADLINE);
  const introBody1 =
    strapiData?.intro?.body_paragraph_1 ||
    (useFallback ? FALLBACK_ABOUT_INTRO.bodyParagraph1 : aboutT.INTRO.BODY_1);
  const introBody2 =
    strapiData?.intro?.body_paragraph_2 ||
    (useFallback ? FALLBACK_ABOUT_INTRO.bodyParagraph2 : aboutT.INTRO.BODY_2);
  const introImageFromCms = strapiData?.intro?.image
    ? getStrapiImageUrl(strapiData.intro.image)
    : null;
  const introImageUrl = introImageFromCms || FALLBACK_ABOUT_INTRO.imageUrl;

  // Vision
  const visionLabel =
    strapiData?.vision?.label ||
    (useFallback ? FALLBACK_ABOUT_VISION.label : aboutT.VISION.LABEL);
  const visionStatement =
    strapiData?.vision?.statement ||
    (useFallback ? FALLBACK_ABOUT_VISION.statement : aboutT.VISION.STATEMENT);

  // Full-width image
  const fullWidthImageFromCms = strapiData?.full_width_image
    ? getStrapiImageUrl(strapiData.full_width_image)
    : null;
  const fullWidthImage =
    fullWidthImageFromCms || FALLBACK_ABOUT_FULL_WIDTH_IMAGE;

  // Mission
  const missionLabel =
    strapiData?.mission?.label ||
    (useFallback ? FALLBACK_ABOUT_MISSION.label : aboutT.MISSION.LABEL);
  const missionStatement =
    strapiData?.mission?.statement ||
    (useFallback ? FALLBACK_ABOUT_MISSION.statement : aboutT.MISSION.STATEMENT);

  // Values
  const valuesData = strapiData?.values
    ? transformValues(strapiData.values)
    : useFallback
      ? FALLBACK_ABOUT_VALUES
      : [];

  // Apply translations to values — use a lookup array to avoid dynamic key casting
  const valuesTranslations = [
    aboutT.VALUES.ITEM_1,
    aboutT.VALUES.ITEM_2,
    aboutT.VALUES.ITEM_3,
    aboutT.VALUES.ITEM_4,
    aboutT.VALUES.ITEM_5,
    aboutT.VALUES.ITEM_6,
  ];
  const translatedValues = valuesData.map((value, index) => {
    const translation = valuesTranslations[index];
    return {
      ...value,
      title: translation?.TITLE ?? value.title,
      description: translation?.DESCRIPTION ?? value.description,
    };
  });

  // Our Story
  const storyLabel =
    strapiData?.our_story?.label ||
    (useFallback ? FALLBACK_ABOUT_STORY.label : aboutT.OUR_STORY.LABEL);
  const storyParagraph1 =
    strapiData?.our_story?.paragraph_1 ||
    (useFallback
      ? FALLBACK_ABOUT_STORY.paragraph1
      : aboutT.OUR_STORY.PARAGRAPH_1);
  const storyParagraph2 =
    strapiData?.our_story?.paragraph_2 ||
    (useFallback
      ? FALLBACK_ABOUT_STORY.paragraph2
      : aboutT.OUR_STORY.PARAGRAPH_2);

  // Timeline
  const timelineData = strapiData?.timeline
    ? transformTimeline(strapiData.timeline)
    : useFallback
      ? FALLBACK_ABOUT_TIMELINE
      : [];

  // Timeline descriptions come from CMS data, no static translations needed
  const translatedTimeline = timelineData;

  // Founder
  const founderData = strapiData?.founder
    ? transformFounder(strapiData.founder)
    : useFallback
      ? FALLBACK_ABOUT_FOUNDER
      : null;

  // Apply translations to founder
  const translatedFounder = founderData
    ? {
        ...founderData,
        quote: aboutT.FOUNDER.QUOTE ?? founderData.quote,
        name: aboutT.FOUNDER.NAME ?? founderData.name,
        title: aboutT.FOUNDER.TITLE ?? founderData.title,
      }
    : null;

  return (
    <div className={styles.aboutPage}>
      {/* 1. Hero Section */}
      <HeroSection
        heading={heroHeading}
        backgroundImage={heroBackground}
        backgroundAlt={heroBackgroundAlt}
        showScrollIndicator={true}
        showDecorativeLine={true}
      />

      <div className={styles.contentContainer}>
        {/* 2. About Intro Section */}
        <AboutIntro
          label={introLabel}
          headline={introHeadline}
          bodyText={[introBody1, introBody2]}
          imageUrl={introImageUrl}
          imageAlt={FALLBACK_ABOUT_INTRO.imageAlt}
        />

        {/* 3. Vision Band */}
        <HighlightBand label={visionLabel} statement={visionStatement} />

        {/* 4. Full-width image */}
        <div className={styles.fullWidthImage}>
          <Image
            src={fullWidthImage}
            alt="Saint 6 Studio work"
            fill
            className={styles.fullWidthImageImg}
            sizes="100vw"
          />
        </div>

        {/* 5. Mission Band */}
        <HighlightBand label={missionLabel} statement={missionStatement} />

        {/* 6. Values Grid with Our Story */}
        {translatedValues.length > 0 && (
          <ValuesGrid
            values={translatedValues}
            story={{
              label: storyLabel,
              paragraphs: [storyParagraph1, storyParagraph2],
            }}
          />
        )}

        {/* 7. Timeline Carousel */}
        {translatedTimeline.length > 0 && (
          <section className={styles.servicesSection}>
            <div className={styles.servicesSectionInner}>
              <ServiceCardsCarousel cards={translatedTimeline} />
            </div>
          </section>
        )}

        {/* 9. Founder Quote */}
        {translatedFounder && (
          <FounderQuote
            imageUrl={translatedFounder.imageUrl}
            quote={translatedFounder.quote}
            name={translatedFounder.name}
            title={translatedFounder.title}
          />
        )}

        {/* 10. Contact Section */}
        <div className={styles.contactSectionWrapper}>
          <ContactSection backgroundImageUrl="/images/get-in-touch-bg.jpg" />
        </div>
      </div>
    </div>
  );
}

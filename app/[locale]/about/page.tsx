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
} from "@/app/lib/fallback-data";
import {
  getAboutPage,
  getStrapiImageUrl,
  type StrapiTimelineItem,
  type StrapiValue,
  type StrapiFounder,
} from "@/app/lib/strapi";
import { getTranslations } from "@/app/lib/translations";
import styles from "./About.module.css";

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
  timeline: StrapiTimelineItem[] | undefined
): ServiceCard[] {
  if (!timeline || timeline.length === 0) return [];

  return timeline.map((item) => {
    const imageUrl = getStrapiImageUrl(item.image);
    return {
      id: item.year,
      imageUrl: imageUrl || `/images/about-us/timeline-${item.year}.jpg`,
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
      "[AboutPage] Using fallback data - Strapi CMS not available in development"
    );
  }

  // Access translations with fallbacks
  const aboutTranslations =
    (t as { ABOUT_US?: Record<string, unknown> }).ABOUT_US || {};

  // Hero
  const heroHeading =
    strapiData?.hero?.heading ||
    (useFallback
      ? FALLBACK_ABOUT_HERO.heading
      : (aboutTranslations.HERO as { TAGLINE?: string })?.TAGLINE ??
        "We Imagine. We Design. We Create.");
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
    (useFallback
      ? FALLBACK_ABOUT_INTRO.label
      : (aboutTranslations.INTRO as { LABEL?: string })?.LABEL ?? "ABOUT US");
  const introHeadline =
    strapiData?.intro?.headline ||
    (useFallback
      ? FALLBACK_ABOUT_INTRO.headline
      : (aboutTranslations.INTRO as { HEADLINE?: string })?.HEADLINE ??
        "We are a studio of artists, builders, stylists, dreamers, problem solvers, and storytellers.\nWe turn ideas into places, feelings, and memories.");
  const introBody1 =
    strapiData?.intro?.body_paragraph_1 ||
    (useFallback
      ? FALLBACK_ABOUT_INTRO.bodyParagraph1
      : (aboutTranslations.INTRO as { BODY_1?: string })?.BODY_1 ??
        "Saint 6 Studios, founded by Trang Nhe Nhang, is a multi-disciplinary creative studio crafting sets, spaces, environments, and experiences.");
  const introBody2 =
    strapiData?.intro?.body_paragraph_2 ||
    (useFallback
      ? FALLBACK_ABOUT_INTRO.bodyParagraph2
      : (aboutTranslations.INTRO as { BODY_2?: string })?.BODY_2 ??
        'We create work that feels alive, work that holds emotion, atmosphere, and story. For us, it\'s never "just decor." It\'s the feeling someone carries home.');
  const introImageFromCms = strapiData?.intro?.image
    ? getStrapiImageUrl(strapiData.intro.image)
    : null;
  const introImageUrl = introImageFromCms || FALLBACK_ABOUT_INTRO.imageUrl;

  // Vision
  const visionLabel =
    strapiData?.vision?.label ||
    (useFallback
      ? FALLBACK_ABOUT_VISION.label
      : (aboutTranslations.VISION as { LABEL?: string })?.LABEL ?? "VISION");
  const visionStatement =
    strapiData?.vision?.statement ||
    (useFallback
      ? FALLBACK_ABOUT_VISION.statement
      : (aboutTranslations.VISION as { STATEMENT?: string })?.STATEMENT ??
        "To create work that is remembered through the feelings it evokes.");

  // Full-width image
  const fullWidthImageFromCms = strapiData?.full_width_image
    ? getStrapiImageUrl(strapiData.full_width_image)
    : null;
  const fullWidthImage = fullWidthImageFromCms || FALLBACK_ABOUT_FULL_WIDTH_IMAGE;

  // Mission
  const missionLabel =
    strapiData?.mission?.label ||
    (useFallback
      ? FALLBACK_ABOUT_MISSION.label
      : (aboutTranslations.MISSION as { LABEL?: string })?.LABEL ?? "MISSION");
  const missionStatement =
    strapiData?.mission?.statement ||
    (useFallback
      ? FALLBACK_ABOUT_MISSION.statement
      : (aboutTranslations.MISSION as { STATEMENT?: string })?.STATEMENT ??
        "We transform ideas, identities, and stories into visual experiences that move people.");

  // Values
  const valuesData = strapiData?.values
    ? transformValues(strapiData.values)
    : useFallback
      ? FALLBACK_ABOUT_VALUES
      : [];

  // Apply translations to values
  const translatedValues = valuesData.map((value, index) => {
    const itemKey = `ITEM_${index + 1}` as keyof typeof aboutTranslations.VALUES;
    const translation = (
      aboutTranslations as {
        VALUES?: Record<string, { TITLE?: string; DESCRIPTION?: string }>;
      }
    ).VALUES?.[itemKey];
    return {
      ...value,
      title: translation?.TITLE ?? value.title,
      description: translation?.DESCRIPTION ?? value.description,
    };
  });

  // Our Story
  const storyLabel =
    strapiData?.our_story?.label ||
    (useFallback
      ? FALLBACK_ABOUT_STORY.label
      : (aboutTranslations.OUR_STORY as { LABEL?: string })?.LABEL ?? "Our Story");
  const storyParagraph1 =
    strapiData?.our_story?.paragraph_1 ||
    (useFallback
      ? FALLBACK_ABOUT_STORY.paragraph1
      : (aboutTranslations.OUR_STORY as { PARAGRAPH_1?: string })?.PARAGRAPH_1 ??
        "Before Saint 6, there was Haus of Trang - where Trang learned that styling is not only about how things look, but how they make people feel.");
  const storyParagraph2 =
    strapiData?.our_story?.paragraph_2 ||
    (useFallback
      ? FALLBACK_ABOUT_STORY.paragraph2
      : (aboutTranslations.OUR_STORY as { PARAGRAPH_2?: string })?.PARAGRAPH_2 ??
        "That realization became the foundation of Saint 6");

  // Timeline
  const timelineData = strapiData?.timeline
    ? transformTimeline(strapiData.timeline)
    : useFallback
      ? FALLBACK_ABOUT_TIMELINE
      : [];

  // Apply translations to timeline
  const translatedTimeline = timelineData.map((item, index) => {
    const itemKey = `ITEM_${index + 1}`;
    const translation = (
      aboutTranslations as {
        TIMELINE?: Record<string, { DESCRIPTION?: string }>;
      }
    ).TIMELINE?.[itemKey];
    return {
      ...item,
      description: translation?.DESCRIPTION ?? item.description,
    };
  });

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
        quote:
          (aboutTranslations.FOUNDER as { QUOTE?: string })?.QUOTE ??
          founderData.quote,
        name:
          (aboutTranslations.FOUNDER as { NAME?: string })?.NAME ??
          founderData.name,
        title:
          (aboutTranslations.FOUNDER as { TITLE?: string })?.TITLE ??
          founderData.title,
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

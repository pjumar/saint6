"use client";

import { HeroSection } from "@/app/components/hero-section/HeroSection";
import { useTranslation } from "@/app/contexts/TranslationContext";

export function StudioHeroSection() {
  const { t } = useTranslation();

  return (
    <HeroSection
      heading={t.STUDIO_RENTAL.HERO.TAGLINE}
      backgroundImage="/images/studio-rental/hero-background.jpg"
      backgroundAlt="Studio Rental"
      showScrollIndicator={false}
      showDecorativeLine={false}
    />
  );
}

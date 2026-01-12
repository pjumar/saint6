"use client";

import { ServiceHero } from "@/app/components/service-hero/ServiceHero";
import { useTranslation } from "@/app/contexts/TranslationContext";

export function StudioHeroSection() {
  const { t } = useTranslation();

  return (
    <ServiceHero
      tagline={t.STUDIO_RENTAL.HERO.TAGLINE}
      backgroundImage="/images/studio-rental/hero-background.jpg"
      backgroundAlt="Studio Rental"
    />
  );
}

import { HeroSection } from "@/app/components/hero-section/HeroSection";

export interface StudioHeroSectionProps {
  heading: string;
  backgroundImage: string;
  backgroundAlt: string;
}

export function StudioHeroSection({
  heading,
  backgroundImage,
  backgroundAlt,
}: StudioHeroSectionProps) {
  return (
    <HeroSection
      heading={heading}
      backgroundImage={backgroundImage}
      backgroundAlt={backgroundAlt}
      showScrollIndicator={true}
      showDecorativeLine={true}
    />
  );
}

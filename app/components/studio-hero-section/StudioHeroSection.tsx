import { HeroSection } from "@/app/components/hero-section/HeroSection";

export interface StudioHeroSectionProps {
  heading: string;
  backgroundImage: string;
  backgroundAlt: string;
  placeholderImage?: string | null;
}

export function StudioHeroSection({
  heading,
  backgroundImage,
  backgroundAlt,
  placeholderImage,
}: StudioHeroSectionProps) {
  return (
    <HeroSection
      heading={heading}
      backgroundImage={backgroundImage}
      backgroundAlt={backgroundAlt}
      placeholderImage={placeholderImage}
      showScrollIndicator={true}
      showDecorativeLine={true}
    />
  );
}

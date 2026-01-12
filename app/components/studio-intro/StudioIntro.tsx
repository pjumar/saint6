import { Button } from "@/app/components/ui/button";
import styles from "./StudioIntro.module.css";

export interface StudioIntroProps {
  title: string;
  description: string;
  ctaText: string;
  onCtaClick?: () => void;
}

export function StudioIntro({
  title,
  description,
  ctaText,
  onCtaClick,
}: StudioIntroProps) {
  return (
    <div className={styles.introContainer}>
      <h2 className={styles.title}>{title}</h2>
      <p className={styles.description}>{description}</p>
      <Button
        variant="default"
        size="lg"
        onClick={onCtaClick}
        className={styles.ctaButton}
      >
        {ctaText}
      </Button>
    </div>
  );
}

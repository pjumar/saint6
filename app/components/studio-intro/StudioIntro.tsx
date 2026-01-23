import { CommonButton } from "@/app/components/common-button/CommonButton";
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
      <CommonButton variant="primary" size="lg" onClick={onCtaClick}>
        {ctaText}
      </CommonButton>
    </div>
  );
}

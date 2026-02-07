"use client";

import { CommonButton } from "@/app/components/common-button/CommonButton";
import styles from "./StudioIntro.module.css";

export interface StudioIntroProps {
  title: string;
  description: string;
  ctaText: string;
  ctaLink?: string;
  onCtaClick?: () => void;
}

export function StudioIntro({
  title,
  description,
  ctaText,
  ctaLink = "#contact-form",
  onCtaClick,
}: StudioIntroProps) {
  const handleClick = () => {
    if (onCtaClick) {
      onCtaClick();
      return;
    }

    if (ctaLink.startsWith("#")) {
      const element = document.querySelector(ctaLink);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      window.location.href = ctaLink;
    }
  };

  return (
    <div className={styles.introContainer}>
      <h2 className={styles.title}>{title}</h2>
      <p className={styles.description}>{description}</p>
      <CommonButton variant="primary" size="lg" onClick={handleClick}>
        {ctaText}
      </CommonButton>
    </div>
  );
}

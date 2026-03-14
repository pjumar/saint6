"use client";

import { ProgressiveImage } from "@/app/components/progressive-image/ProgressiveImage";
import styles from "./PortfolioCard.module.css";

export interface PortfolioCardProps {
  imageUrl: string;
  category: string;
  title: string;
  aspectRatio?: string;
}

export function PortfolioCard({
  imageUrl,
  category,
  title,
  aspectRatio = "3/2",
}: PortfolioCardProps) {
  return (
    <div className={styles.portfolioCard}>
      <div
        className={styles.imageContainer}
        style={
          {
            "--mobile-aspect-ratio": aspectRatio,
            "--desktop-aspect-ratio": aspectRatio,
          } as React.CSSProperties
        }
      >
        <ProgressiveImage
          src={imageUrl}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className={styles.portfolioImage}
        />
      </div>
      <div className={styles.content}>
        <div className={styles.categoryRow}>
          <p className={styles.category}>{category}</p>
        </div>
        <h3 className={styles.title}>{title}</h3>
      </div>
    </div>
  );
}

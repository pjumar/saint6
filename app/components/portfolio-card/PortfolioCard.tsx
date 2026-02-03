"use client";

import Image from "next/image";
import { useMemo } from "react";
import styles from "./PortfolioCard.module.css";

export interface PortfolioCardProps {
  imageUrl: string;
  category: string;
  title: string;
  imageHeight?: "short" | "tall" | "large";
  aspectRatio?: string; // Override aspect ratio (used for top row)
  desktopAspectRatio?: string; // Fixed aspect ratio for desktop masonry
}

// Pinterest-style aspect ratios for mobile variety
const ASPECT_RATIOS = [
  "3/4", // portrait
  "4/5", // tall portrait
  "1/1", // square
  "4/3", // landscape
  "3/5", // extra tall
  "2/3", // classic portrait
  "5/7", // photo portrait
  "9/16", // vertical video
  "5/4", // slight landscape
  "7/9", // medium tall
  "2/5", // very tall
  "16/9", // wide landscape
];

export function PortfolioCard({
  imageUrl,
  category,
  title,
  aspectRatio: overrideAspectRatio,
  desktopAspectRatio,
}: PortfolioCardProps) {
  // Generate consistent random aspect ratio for mobile based on image URL + title
  const randomAspectRatio = useMemo(() => {
    const seed = imageUrl + title;
    let hash = 5381;
    for (let i = 0; i < seed.length; i++) {
      hash = ((hash << 5) + hash) ^ seed.charCodeAt(i);
    }
    return ASPECT_RATIOS[Math.abs(hash) % ASPECT_RATIOS.length];
  }, [imageUrl, title]);

  // Mobile uses random or override, desktop uses desktopAspectRatio if provided
  const mobileAspectRatio = overrideAspectRatio || randomAspectRatio;

  return (
    <div className={styles.portfolioCard}>
      <div
        className={styles.imageContainer}
        style={
          {
            "--mobile-aspect-ratio": mobileAspectRatio,
            "--desktop-aspect-ratio": desktopAspectRatio || mobileAspectRatio,
          } as React.CSSProperties
        }
      >
        <Image
          src={imageUrl}
          alt={title}
          fill
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

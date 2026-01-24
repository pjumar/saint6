"use client";

import Image from "next/image";
import styles from "./PortfolioCard.module.css";

export interface PortfolioCardProps {
  imageUrl: string;
  category: string;
  title: string;
  imageHeight?: "short" | "tall" | "large";
}

export function PortfolioCard({
  imageUrl,
  category,
  title,
  imageHeight = "short",
}: PortfolioCardProps) {
  return (
    <div className={styles.portfolioCard}>
      <div className={`${styles.imageContainer} ${styles[imageHeight]}`}>
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

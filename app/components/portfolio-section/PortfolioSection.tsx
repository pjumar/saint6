"use client";

import { PortfolioCard, PortfolioCardProps } from "@/app/components/portfolio-card/PortfolioCard";
import { SectionHeader } from "@/app/components/section-header/SectionHeader";
import styles from "./PortfolioSection.module.css";

export interface PortfolioItem extends Omit<PortfolioCardProps, "imageHeight"> {
  id: string;
  size?: "large" | "short" | "tall"; // Optional, not used with Pinterest-style
}

export interface PortfolioSectionProps {
  label: string;
  statement: string;
  items: PortfolioItem[];
}

// Desktop masonry pattern (3 columns, CSS columns flow down each column):
// Column 1: short, tall | Column 2: tall, short | Column 3: tall, short
const DESKTOP_ASPECT_RATIOS = ["3/2", "3/4", "3/4", "3/2", "3/4", "3/2"];

export function PortfolioSection({
  label,
  statement,
  items,
}: PortfolioSectionProps) {
  // First 2 items go in top row, rest in masonry grid
  const topRow = items.slice(0, 2);
  const masonryItems = items.slice(2);

  return (
    <div className={styles.portfolioWrapper}>
      {/* Statement Section - Red Background */}
      <SectionHeader
        label={label}
        title={statement}
        textAlign="left"
        spiralPosition="right"
      />

      {/* Portfolio Grid Section */}
      <section className={styles.gridSection}>
        <div className={styles.gridContainer}>
          {/* Top Row - Side by side on desktop, stacked on mobile */}
          {topRow.length > 0 && (
            <div className={styles.topRow}>
              {topRow.map((item) => (
                <div key={item.id} className={styles.topRowItem}>
                  <PortfolioCard
                    imageUrl={item.imageUrl}
                    category={item.category}
                    title={item.title}
                    aspectRatio="3/2"
                  />
                </div>
              ))}
            </div>
          )}

          {/* Masonry Grid - Random on mobile, fixed pattern on desktop */}
          {masonryItems.length > 0 && (
            <div className={styles.masonryGrid}>
              {masonryItems.map((item, index) => (
                <PortfolioCard
                  key={item.id}
                  imageUrl={item.imageUrl}
                  category={item.category}
                  title={item.title}
                  desktopAspectRatio={DESKTOP_ASPECT_RATIOS[index % DESKTOP_ASPECT_RATIOS.length]}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

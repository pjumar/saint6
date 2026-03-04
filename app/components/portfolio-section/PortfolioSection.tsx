"use client";

import {
  PortfolioCard,
  type PortfolioCardProps,
} from "@/app/components/portfolio-card/PortfolioCard";
import { SectionHeader } from "@/app/components/section-header/SectionHeader";
import {
  useScrollAnimationChildren,
  useScrollAnimationGrid,
} from "@/app/hooks";
import styles from "./PortfolioSection.module.css";

export interface PortfolioItem extends PortfolioCardProps {
  id: string;
  aspectRatio?: string;
}

export interface PortfolioSectionProps {
  label: string;
  statement: string;
  items: PortfolioItem[];
  gridClassName?: string;
}

export function PortfolioSection({
  label,
  statement,
  items,
  gridClassName,
}: PortfolioSectionProps) {
  // First 2 items go in top row, rest in masonry grid
  const topRow = items.slice(0, 2);
  const masonryItems = items.slice(2);

  // Scroll animation refs - smoother settings
  const topRowRef = useScrollAnimationChildren<HTMLDivElement>({
    type: "scale",
    duration: 0.9,
    stagger: 0.2,
    ease: "power2.out",
  });
  const masonryRef = useScrollAnimationGrid<HTMLDivElement>({
    columns: 3,
    duration: 0.9,
    ease: "power2.out",
  });

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
        <div className={`${styles.gridContainer}${gridClassName ? ` ${gridClassName}` : ""}`}>
          {/* Top Row - Side by side on desktop, stacked on mobile */}
          {topRow.length > 0 && (
            <div className={styles.topRow} ref={topRowRef}>
              {topRow.map((item) => (
                <div key={item.id} className={styles.topRowItem}>
                  <PortfolioCard
                    imageUrl={item.imageUrl}
                    category={item.category}
                    title={item.title}
                    aspectRatio={item.aspectRatio || "3/2"}
                  />
                </div>
              ))}
            </div>
          )}

          {/* Masonry Grid */}
          {masonryItems.length > 0 && (
            <div className={styles.masonryGrid} ref={masonryRef}>
              {masonryItems.map((item) => (
                <PortfolioCard
                  key={item.id}
                  imageUrl={item.imageUrl}
                  category={item.category}
                  title={item.title}
                  aspectRatio={item.aspectRatio || "3/2"}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

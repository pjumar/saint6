"use client";

import { PortfolioCard, PortfolioCardProps } from "@/app/components/portfolio-card/PortfolioCard";
import styles from "./PortfolioSection.module.css";

export interface PortfolioItem extends Omit<PortfolioCardProps, "imageHeight"> {
  id: string;
  size: "large" | "short" | "tall";
}

export interface PortfolioSectionProps {
  label: string;
  statement: string;
  items: PortfolioItem[];
}

export function PortfolioSection({
  label,
  statement,
  items,
}: PortfolioSectionProps) {
  // Split items into rows for masonry layout
  // First 2 items are large (top row)
  // Remaining items are distributed in 3 columns
  const topRow = items.slice(0, 2);
  const bottomItems = items.slice(2);

  // Distribute bottom items into 3 columns alternating tall/short
  const column1 = bottomItems.filter((_, i) => i % 3 === 0);
  const column2 = bottomItems.filter((_, i) => i % 3 === 1);
  const column3 = bottomItems.filter((_, i) => i % 3 === 2);

  return (
    <div className={styles.portfolioWrapper}>
      {/* Statement Section - Red Background */}
      <section className={styles.statementSection}>
        <p className={styles.label}>{label}</p>
        <p className={styles.statement}>{statement}</p>
        {/* Decorative spiral graphic */}
        <div className={styles.decorativeGraphic}>
          <svg
            viewBox="0 0 710 710"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={styles.spiral}
          >
            <circle
              cx="355"
              cy="355"
              r="340"
              stroke="white"
              strokeWidth="1"
              strokeOpacity="0.3"
              fill="none"
            />
            <circle
              cx="355"
              cy="355"
              r="280"
              stroke="white"
              strokeWidth="1"
              strokeOpacity="0.25"
              fill="none"
            />
            <circle
              cx="355"
              cy="355"
              r="220"
              stroke="white"
              strokeWidth="1"
              strokeOpacity="0.2"
              fill="none"
            />
            <circle
              cx="355"
              cy="355"
              r="160"
              stroke="white"
              strokeWidth="1"
              strokeOpacity="0.15"
              fill="none"
            />
          </svg>
        </div>
      </section>

      {/* Portfolio Grid Section */}
      <section className={styles.gridSection}>
        <div className={styles.gridContainer}>
          {/* Top Row - Two large cards */}
          <div className={styles.topRow}>
            {topRow.map((item) => (
              <div key={item.id} className={styles.topRowItem}>
                <PortfolioCard
                  imageUrl={item.imageUrl}
                  category={item.category}
                  title={item.title}
                  imageHeight="large"
                />
              </div>
            ))}
          </div>

          {/* Bottom Grid - Masonry 3-column layout */}
          <div className={styles.masonryGrid}>
            <div className={styles.column}>
              {column1.map((item, idx) => (
                <PortfolioCard
                  key={item.id}
                  imageUrl={item.imageUrl}
                  category={item.category}
                  title={item.title}
                  imageHeight={idx % 2 === 0 ? "short" : "tall"}
                />
              ))}
            </div>
            <div className={styles.column}>
              {column2.map((item, idx) => (
                <PortfolioCard
                  key={item.id}
                  imageUrl={item.imageUrl}
                  category={item.category}
                  title={item.title}
                  imageHeight={idx % 2 === 0 ? "tall" : "short"}
                />
              ))}
            </div>
            <div className={styles.column}>
              {column3.map((item, idx) => (
                <PortfolioCard
                  key={item.id}
                  imageUrl={item.imageUrl}
                  category={item.category}
                  title={item.title}
                  imageHeight={idx % 2 === 0 ? "tall" : "short"}
                />
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

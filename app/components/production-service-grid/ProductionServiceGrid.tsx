"use client";

import Image from "next/image";
import styles from "./ProductionServiceGrid.module.css";

export interface ProductionServiceItem {
  id: string;
  imageUrl: string;
  title: string;
  description: string;
}

interface ProductionServiceGridProps {
  items: ProductionServiceItem[];
}

function formatCounter(index: number): string {
  return `${String(index + 1).padStart(2, "0")}.`;
}

export function ProductionServiceGrid({ items }: ProductionServiceGridProps) {
  // First 2 items are large, rest are small
  const largeItems = items.slice(0, 2);
  const smallItems = items.slice(2, 6);

  return (
    <div className={styles.productionServiceGrid}>
      {/* Mobile Carousel - All 6 cards in horizontal scroll */}
      <div className={styles.carouselContainer}>
        {items.map((item, index) => (
          <div key={item.id} className={styles.largeCard}>
            <div className={styles.cardImageContainer}>
              <Image
                src={item.imageUrl}
                alt={item.title}
                fill
                sizes="85vw"
                className={styles.cardImage}
              />
            </div>
            <div className={styles.cardContent}>
              <span className={styles.cardCounter}>{formatCounter(index)}</span>
              <div className={styles.cardTextContent}>
                <h3 className={styles.cardTitle}>{item.title}</h3>
                <p className={styles.cardDescription}>{item.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop: Large Cards Row */}
      <div className={styles.largeCardsRow}>
        {largeItems.map((item, index) => (
          <div
            key={item.id}
            className={`${styles.largeCard} ${index === 0 ? styles.firstLarge : styles.secondLarge}`}
          >
            <div className={styles.cardImageContainer}>
              <Image
                src={item.imageUrl}
                alt={item.title}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className={styles.cardImage}
              />
            </div>
            <div className={styles.cardContent}>
              <span className={styles.cardCounter}>{formatCounter(index)}</span>
              <div className={styles.cardTextContent}>
                <h3 className={styles.cardTitle}>{item.title}</h3>
                <p className={styles.cardDescription}>{item.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop: Small Cards Row */}
      <div className={styles.smallCardsRow}>
        {smallItems.map((item, index) => (
          <div key={item.id} className={styles.smallCard}>
            <div className={styles.smallCardImageContainer}>
              <Image
                src={item.imageUrl}
                alt={item.title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                className={styles.cardImage}
              />
            </div>
            <div className={styles.cardContent}>
              <span className={styles.cardCounter}>{formatCounter(index + 2)}</span>
              <div className={styles.cardTextContent}>
                <h3 className={styles.cardTitle}>{item.title}</h3>
                <p className={styles.cardDescription}>{item.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

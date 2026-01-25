"use client";

import { WorkflowStepCard } from "@/app/components/workflow-step-card/WorkflowStepCard";
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
      <div className={styles.carouselWrapper}>
        <div className={styles.carouselContainer}>
          {items.map((item, index) => (
            <div key={item.id} className={styles.carouselCard}>
              <WorkflowStepCard
                imageUrl={item.imageUrl}
                counter={formatCounter(index)}
                title={item.title}
                description={item.description}
                layout="horizontal"
                imageSizes="85vw"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Desktop: Large Cards Row */}
      <div className={styles.largeCardsRow}>
        {largeItems.map((item, index) => (
          <div
            key={item.id}
            className={`${styles.largeCard} ${index === 0 ? styles.firstLarge : styles.secondLarge}`}
          >
            <WorkflowStepCard
              imageUrl={item.imageUrl}
              counter={formatCounter(index)}
              title={item.title}
              description={item.description}
              layout="horizontal"
              imageSizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        ))}
      </div>

      {/* Desktop: Small Cards Row */}
      <div className={styles.smallCardsRow}>
        {smallItems.map((item, index) => (
          <div key={item.id} className={styles.smallCard}>
            <WorkflowStepCard
              imageUrl={item.imageUrl}
              counter={formatCounter(index + 2)}
              title={item.title}
              description={item.description}
              layout="horizontal"
              imageSizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

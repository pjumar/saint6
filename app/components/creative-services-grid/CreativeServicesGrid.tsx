"use client";

import { ProgressiveImage } from "@/app/components/progressive-image/ProgressiveImage";
import { useScrollAnimationChildren } from "@/app/hooks";
import styles from "./CreativeServicesGrid.module.css";

export interface CreativeServiceItem {
  id: string;
  imageUrl: string;
  title: string;
  description: string;
}

interface CreativeServicesGridProps {
  items: CreativeServiceItem[];
}

export function CreativeServicesGrid({ items }: CreativeServicesGridProps) {
  const mobileRef = useScrollAnimationChildren<HTMLDivElement>({
    type: "fadeUp",
    stagger: 0.15,
  });
  const textRowRef = useScrollAnimationChildren<HTMLDivElement>({
    type: "fadeUp",
    stagger: 0.15,
  });
  const imageRowRef = useScrollAnimationChildren<HTMLDivElement>({
    type: "scale",
    stagger: 0.15,
    delay: 0.2,
  });

  return (
    <div className={styles.grid}>
      {/* Mobile: stacked cards */}
      <div ref={mobileRef} className={styles.mobileView}>
        {items.map((item) => (
          <div key={item.id} className={styles.card}>
            <div className={styles.textContent}>
              <h2 className={styles.title}>{item.title}</h2>
              <p className={styles.description}>{item.description}</p>
            </div>
            <div className={styles.imageContainer}>
              <ProgressiveImage
                src={item.imageUrl}
                alt={item.title}
                fill
                sizes="100vw"
                className={styles.image}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Desktop: aligned rows */}
      <div className={styles.desktopView}>
        <div ref={textRowRef} className={styles.textRow}>
          {items.map((item) => (
            <div key={item.id} className={styles.textContent}>
              <h2 className={styles.title}>{item.title}</h2>
              <p className={styles.description}>{item.description}</p>
            </div>
          ))}
        </div>
        <div ref={imageRowRef} className={styles.imageRow}>
          {items.map((item) => (
            <div key={item.id} className={styles.imageContainer}>
              <ProgressiveImage
                src={item.imageUrl}
                alt={item.title}
                fill
                sizes="50vw"
                className={styles.image}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

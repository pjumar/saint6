"use client";

import Image from "next/image";
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
  return (
    <div className={styles.grid}>
      {/* Mobile: stacked cards */}
      <div className={styles.mobileView}>
        {items.map((item) => (
          <div key={item.id} className={styles.card}>
            <div className={styles.textContent}>
              <h3 className={styles.title}>{item.title}</h3>
              <p className={styles.description}>{item.description}</p>
            </div>
            <div className={styles.imageContainer}>
              <Image
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
        <div className={styles.textRow}>
          {items.map((item) => (
            <div key={item.id} className={styles.textContent}>
              <h3 className={styles.title}>{item.title}</h3>
              <p className={styles.description}>{item.description}</p>
            </div>
          ))}
        </div>
        <div className={styles.imageRow}>
          {items.map((item) => (
            <div key={item.id} className={styles.imageContainer}>
              <Image
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

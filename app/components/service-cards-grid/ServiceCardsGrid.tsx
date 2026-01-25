"use client";

import Image from "next/image";
import styles from "./ServiceCardsGrid.module.css";

export interface ServiceCard {
  id: string;
  imageUrl: string;
  counter: string;
  title: string;
  description: string;
}

interface ServiceCardsGridProps {
  cards: ServiceCard[];
}

export function ServiceCardsGrid({ cards }: ServiceCardsGridProps) {
  return (
    <div className={styles.container}>
      <div className={styles.carousel}>
        {cards.map((card) => (
          <div key={card.id} className={styles.card}>
            <div className={styles.imageContainer}>
              <Image
                src={card.imageUrl}
                alt={card.title}
                fill
                sizes="(max-width: 768px) 85vw, 26vw"
                className={styles.image}
              />
            </div>
            <div className={styles.content}>
              <span className={styles.counter}>{card.counter}</span>
              <h3 className={styles.title}>{card.title}</h3>
              <p className={styles.description}>{card.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

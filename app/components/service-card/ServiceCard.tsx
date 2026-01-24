"use client";

import Image from "next/image";
import styles from "./ServiceCard.module.css";

export interface ServiceCardProps {
  imageUrl: string;
  counter: string;
  title: string;
  description: string;
}

export function ServiceCard({
  imageUrl,
  counter,
  title,
  description,
}: ServiceCardProps) {
  return (
    <div className={styles.serviceCard}>
      {/* Service Image */}
      <div className={styles.imageContainer}>
        <Image
          src={imageUrl}
          alt={title}
          width={391}
          height={523}
          className={styles.serviceImage}
        />
      </div>

      {/* Service Content */}
      <div className={styles.content}>
        <p className={styles.counter}>{counter}</p>
        <div className={styles.details}>
          <h3 className={styles.title}>{title}</h3>
          <p className={styles.description}>{description}</p>
        </div>
      </div>
    </div>
  );
}

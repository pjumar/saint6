"use client";

import Image from "next/image";
import styles from "./TestimonialCard.module.css";

export interface TestimonialCardProps {
  logoUrl: string;
  logoAlt: string;
  quote: string;
  authorName: string;
  authorTitle: string;
}

export function TestimonialCard({
  logoUrl,
  logoAlt,
  quote,
  authorName,
  authorTitle,
}: TestimonialCardProps) {
  return (
    <div className={styles.testimonialCard}>
      <div className={styles.logoContainer}>
        <Image
          src={logoUrl}
          alt={logoAlt}
          fill
          sizes="120px"
          className={styles.logo}
        />
      </div>
      <div className={styles.progressLine} />
      <blockquote className={styles.quote}>{quote}</blockquote>
      <div className={styles.author}>
        <p className={styles.authorName}>{authorName}</p>
        <p className={styles.authorTitle}>{authorTitle}</p>
      </div>
    </div>
  );
}

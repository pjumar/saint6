"use client";

import Image from "next/image";
import styles from "./WorkflowStepCard.module.css";

export interface WorkflowStepCardProps {
  imageUrl: string;
  counter: string;
  title: string;
  description: string;
  /** Card size variant - affects image container aspect ratio */
  variant?: "default" | "large" | "small";
  /** Content layout - vertical (counter above text) or horizontal (counter beside text) */
  layout?: "vertical" | "horizontal";
  /** Image sizes attribute for responsive loading */
  imageSizes?: string;
  /** Additional class name for custom styling */
  className?: string;
}

export function WorkflowStepCard({
  imageUrl,
  counter,
  title,
  description,
  variant = "default",
  layout = "vertical",
  imageSizes = "(max-width: 768px) 85vw, 26vw",
  className = "",
}: WorkflowStepCardProps) {
  const layoutClass = layout === "horizontal" ? styles.horizontal : "";

  return (
    <div className={`${styles.card} ${styles[variant]} ${layoutClass} ${className}`}>
      <div className={styles.imageContainer}>
        <Image
          src={imageUrl}
          alt={title}
          fill
          sizes={imageSizes}
          className={styles.image}
        />
      </div>
      <div className={styles.content}>
        <span className={styles.counter}>{counter}</span>
        <div className={styles.textContent}>
          <h3 className={styles.title}>{title}</h3>
          <p className={styles.description}>{description}</p>
        </div>
      </div>
    </div>
  );
}

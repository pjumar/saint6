"use client";

import Image from "next/image";
import styles from "./CrewAreaSection.module.css";

export interface CrewAreaSectionProps {
  caption?: string;
  heading: string;
  infoLabel?: string;
  infoText: string;
  mainImage: {
    src: string;
    alt: string;
  };
  secondaryImage1?: {
    src: string;
    alt: string;
  };
  secondaryImage2?: {
    src: string;
    alt: string;
  };
}

export function CrewAreaSection({
  caption = "CREW AREA",
  heading,
  infoLabel = "INFO",
  infoText,
  mainImage,
  secondaryImage1,
  secondaryImage2,
}: CrewAreaSectionProps) {
  return (
    <section className={styles.crewAreaSection}>
      <div className={styles.content}>
        <div className={styles.leftColumn}>
          <p className={styles.caption}>{caption}</p>
          <h2 className={styles.heading}>{heading}</h2>

          <div className={styles.infoSection}>
            <p className={styles.infoLabel}>{infoLabel}</p>
            <p className={styles.infoText}>{infoText}</p>
          </div>
        </div>

        <div className={styles.rightColumn}>
          <div className={styles.mainImageWrapper}>
            <Image
              src={mainImage.src}
              alt={mainImage.alt}
              fill
              className={styles.image}
            />
          </div>

          <div className={styles.secondaryImages}>
            {secondaryImage1 && (
              <div className={styles.secondaryImageWrapper}>
                <Image
                  src={secondaryImage1.src}
                  alt={secondaryImage1.alt}
                  fill
                  className={styles.image}
                />
              </div>
            )}
            {secondaryImage2 && (
              <div className={styles.secondaryImageWrapper}>
                <Image
                  src={secondaryImage2.src}
                  alt={secondaryImage2.alt}
                  fill
                  className={styles.image}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

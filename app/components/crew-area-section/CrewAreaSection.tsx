"use client";

import Image from "next/image";
import { useScrollAnimation, useScrollAnimationChildren } from "@/app/hooks";
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
  const leftColumnRef = useScrollAnimation<HTMLDivElement>({ type: "fadeUp" });
  const mainImageRef = useScrollAnimation<HTMLDivElement>({
    type: "scale",
    duration: 0.8,
  });
  const secondaryImagesRef = useScrollAnimationChildren<HTMLDivElement>({
    type: "scale",
    stagger: 0.15,
  });

  return (
    <section className={styles.crewAreaSection}>
      <div className={styles.content}>
        <div ref={leftColumnRef} className={styles.leftColumn}>
          <p className={styles.caption}>{caption}</p>
          <h2 className={styles.heading}>{heading}</h2>

          <div className={styles.infoSection}>
            <p className={styles.infoLabel}>{infoLabel}</p>
            <p className={styles.infoText}>{infoText}</p>
          </div>
        </div>

        <div className={styles.rightColumn}>
          <div ref={mainImageRef} className={styles.mainImageWrapper}>
            <Image
              src={mainImage.src}
              alt={mainImage.alt}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className={styles.image}
            />
          </div>

          <div ref={secondaryImagesRef} className={styles.secondaryImages}>
            {secondaryImage1 && (
              <div className={styles.secondaryImageWrapper}>
                <Image
                  src={secondaryImage1.src}
                  alt={secondaryImage1.alt}
                  fill
                  sizes="(max-width: 768px) 50vw, 25vw"
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
                  sizes="(max-width: 768px) 50vw, 25vw"
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

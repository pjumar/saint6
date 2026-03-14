"use client";

import Link from "next/link";
import { ProgressiveImage } from "@/app/components/progressive-image/ProgressiveImage";
import { useTranslation } from "@/app/contexts/TranslationContext";
import { AnimatedValue } from "@/app/components/animated-value/AnimatedValue";
import { useScrollAnimation, useScrollAnimationChildren } from "@/app/hooks";
import { SpiralDecoration } from "@/app/components/spiral-decoration";
import styles from "./SpaceSection.module.css";

export interface SpaceStat {
  label: string;
  value: string;
}

export interface SpaceImage {
  src: string;
  alt: string;
}

export interface SpaceSectionProps {
  caption?: string;
  description: string;
  ctaText?: string;
  ctaLink?: string;
  stats: SpaceStat[];
  galleryImages: SpaceImage[];
}

export function SpaceSection({
  caption = "WIDE RANGE OF SPACE",
  description,
  ctaText = "VIEW STUDIO RENTAL",
  ctaLink = "/studio-rental",
  stats,
  galleryImages,
}: SpaceSectionProps) {
  const { locale } = useTranslation();
  const contentRef = useScrollAnimation<HTMLDivElement>({ type: "fadeUp" });
  const galleryRef = useScrollAnimationChildren<HTMLDivElement>({
    type: "scale",
    stagger: 0.1,
  });

  return (
    <section className={styles.spaceSection}>
      <SpiralDecoration
        className={styles.decorativeSpiral}
        imageClassName={styles.spiralImage}
      />

      <div className={styles.content}>
        <p className={styles.caption}>{caption}</p>

        <div ref={contentRef} className={styles.mainContent}>
          <p className={styles.description}>{description}</p>

          <Link href={`/${locale}${ctaLink}`} className={styles.ctaLink}>
            <span className={styles.ctaArrow}>
              <span className={styles.arrowLine} />
              <span className={styles.arrowHead} />
            </span>
            <span className={styles.ctaText}>{ctaText}</span>
          </Link>

          <div className={styles.statsGrid}>
            {stats.slice(0, 3).map((stat, index) => (
              <div key={index} className={styles.statItem}>
                <p className={styles.statLabel}>{stat.label}</p>
                <p className={styles.statValue}>
                  <AnimatedValue value={stat.value} delay={index * 100} />
                </p>
              </div>
            ))}
          </div>
          <div className={styles.statsGridSecond}>
            {stats.slice(3, 5).map((stat, index) => (
              <div key={index} className={styles.statItem}>
                <p className={styles.statLabel}>{stat.label}</p>
                <p className={styles.statValue}>
                  <AnimatedValue value={stat.value} delay={(index + 3) * 100} />
                </p>
              </div>
            ))}
          </div>
        </div>

        <div ref={galleryRef} className={styles.galleryGrid}>
          {galleryImages.slice(0, 4).map((image, index) => (
            <div key={index} className={styles.galleryItem}>
              <ProgressiveImage
                src={image.src}
                alt={image.alt}
                fill
                sizes="(max-width: 768px) 45vw, 23vw"
                className={styles.galleryImage}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

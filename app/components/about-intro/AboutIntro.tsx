"use client";

import Image from "next/image";
import { useScrollAnimation, useScrollAnimationChildren } from "@/app/hooks";
import styles from "./AboutIntro.module.css";

export interface AboutIntroProps {
  /** Section label (e.g., "ABOUT US") */
  label: string;
  /** Main headline text */
  headline: string;
  /** Body text paragraphs */
  bodyText: string[];
  /** Side portrait image URL */
  imageUrl: string;
  /** Image alt text */
  imageAlt?: string;
}

export function AboutIntro({
  label,
  headline,
  bodyText,
  imageUrl,
  imageAlt = "Portrait",
}: AboutIntroProps) {
  const labelRef = useScrollAnimation<HTMLDivElement>({ type: "fadeUp" });
  const headlineRef = useScrollAnimation<HTMLHeadingElement>({
    type: "fadeUp",
    delay: 0.1,
  });
  const bodyRef = useScrollAnimationChildren<HTMLDivElement>({
    type: "fadeUp",
    stagger: 0.1,
    delay: 0.2,
  });
  const imageRef = useScrollAnimation<HTMLDivElement>({
    type: "scale",
    delay: 0.15,
  });

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div ref={labelRef} className={styles.labelWrapper}>
          <p className={styles.label}>{label}</p>
        </div>

        <div className={styles.contentWrapper}>
          <h2 ref={headlineRef} className={styles.headline}>{headline}</h2>

          <div className={styles.bodyRow}>
            <div ref={bodyRef} className={styles.bodyContent}>
              {bodyText.map((paragraph) => (
                <p key={paragraph} className={styles.bodyText}>
                  {paragraph}
                </p>
              ))}
            </div>

            <div ref={imageRef} className={styles.imageWrapper}>
              <Image
                src={imageUrl}
                alt={imageAlt}
                fill
                className={styles.image}
                sizes="(max-width: 768px) 100vw, 330px"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

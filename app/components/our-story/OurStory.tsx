"use client";

import { useScrollAnimation, useScrollAnimationChildren } from "@/app/hooks";
import styles from "./OurStory.module.css";

export interface OurStoryProps {
  /** Section label (e.g., "Our Story") */
  label: string;
  /** Story paragraphs */
  paragraphs: string[];
}

export function OurStory({ label, paragraphs }: OurStoryProps) {
  const labelRef = useScrollAnimation<HTMLDivElement>({ type: "fadeUp" });
  const textRef = useScrollAnimationChildren<HTMLDivElement>({
    type: "fadeUp",
    stagger: 0.15,
    delay: 0.1,
  });

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div ref={labelRef} className={styles.labelWrapper}>
          <p className={styles.label}>{label}</p>
        </div>

        <div ref={textRef} className={styles.textWrapper}>
          {paragraphs.map((paragraph, index) => (
            <p key={index} className={styles.text}>
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}

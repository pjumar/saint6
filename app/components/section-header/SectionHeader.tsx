"use client";

import { useScrollAnimation } from "@/app/hooks";
import { SpiralDecoration } from "@/app/components/spiral-decoration";
import styles from "./SectionHeader.module.css";

export interface SectionHeaderProps {
  label?: string;
  title: string;
  textAlign?: "left" | "center" | "right";
  spiralPosition?: "center" | "right" | "none";
  className?: string;
}

export function SectionHeader({
  label,
  title,
  textAlign = "left",
  spiralPosition = "center",
  className,
}: SectionHeaderProps) {
  const contentRef = useScrollAnimation<HTMLDivElement>({ type: "fadeUp" });

  const spiralClass =
    spiralPosition !== "none"
      ? styles[
          `spiral${spiralPosition.charAt(0).toUpperCase() + spiralPosition.slice(1)}`
        ]
      : "";

  return (
    <section className={`${styles.sectionHeader} ${className || ""}`}>
      <div ref={contentRef} className={`${styles.content} ${styles[textAlign]}`}>
        {label && <p className={styles.label}>{label}</p>}
        <h2 className={styles.title}>{title}</h2>
      </div>
      {spiralPosition !== "none" && (
        <SpiralDecoration
          className={`${styles.decorativeSpiral} ${spiralClass}`}
          imageClassName={styles.spiralImage}
        />
      )}
    </section>
  );
}

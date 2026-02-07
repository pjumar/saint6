"use client";

import Image from "next/image";
import { useScrollAnimation } from "@/app/hooks";
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
        <div className={`${styles.decorativeSpiral} ${spiralClass}`}>
          <Image
            src="/images/spiral_decoration.svg"
            alt=""
            width={710}
            height={710}
            className={styles.spiralImage}
            aria-hidden="true"
          />
        </div>
      )}
    </section>
  );
}

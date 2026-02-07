"use client";

import Image from "next/image";
import { useTranslation } from "@/app/contexts/TranslationContext";
import { useScrollAnimation, useScrollAnimationChildren } from "@/app/hooks";
import styles from "./EquipmentGrid.module.css";

export interface EquipmentItem {
  id: string;
  name: string;
  spec: string;
  imageUrl: string;
  isWide?: boolean;
}

export interface EquipmentGridProps {
  items: EquipmentItem[];
  backgroundColorsImage?: string;
}

export function EquipmentGrid({
  items,
  backgroundColorsImage,
}: EquipmentGridProps) {
  const { t } = useTranslation();
  const headingRef = useScrollAnimation<HTMLDivElement>({ type: "fadeUp" });
  const bgColorsRef = useScrollAnimation<HTMLDivElement>({
    type: "scale",
    delay: 0.15,
  });
  const gridRef = useScrollAnimationChildren<HTMLDivElement>({
    type: "fadeUp",
    stagger: 0.1,
  });

  return (
    <div className={styles.equipmentSection}>
      {/* Left side - Heading and Background Colors */}
      <div className={styles.headingColumn}>
        <div ref={headingRef} className={styles.headingContent}>
          <span className={styles.sectionLabel}>
            {t.STUDIO_RENTAL.EQUIPMENT.TITLE}
          </span>
          <h3 className={styles.sectionTitle}>
            {t.STUDIO_RENTAL.EQUIPMENT.HEADING}
          </h3>
        </div>

        {backgroundColorsImage && (
          <div ref={bgColorsRef} className={styles.backgroundColorsCard}>
            <div className={styles.backgroundColorsImageContainer}>
              <Image
                src={backgroundColorsImage}
                alt="Background Colors"
                fill
                className={styles.backgroundColorsImage}
              />
            </div>
            <div className={styles.itemInfo}>
              <p className={styles.equipmentName}>
                {t.STUDIO_RENTAL.EQUIPMENT.BACKGROUND_COLORS}
              </p>
              <p className={styles.equipmentSpec}>60CM</p>
            </div>
          </div>
        )}
      </div>

      {/* Right side - Equipment Grid */}
      <div className={styles.gridColumn}>
        <div ref={gridRef} className={styles.grid}>
          {items.map((item) => (
            <div key={item.id} className={styles.equipmentCard}>
              <div className={styles.imageContainer}>
                <Image
                  src={item.imageUrl}
                  alt={item.name}
                  width={200}
                  height={200}
                  className={styles.equipmentImage}
                />
              </div>
              <div className={styles.itemInfo}>
                <p className={styles.equipmentName}>{item.name}</p>
                <p className={styles.equipmentSpec}>{item.spec}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

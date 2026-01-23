"use client";

import Image from "next/image";
import { useTranslation } from "@/app/contexts/TranslationContext";
import styles from "./EquipmentGrid.module.css";

export interface EquipmentItem {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
}

export interface EquipmentGridProps {
  items: EquipmentItem[];
}

export function EquipmentGrid({ items }: EquipmentGridProps) {
  const { t } = useTranslation();

  return (
    <div className={styles.equipmentSection}>
      <h3 className={styles.sectionTitle}>{t.STUDIO_RENTAL.EQUIPMENT.TITLE}</h3>
      <p className={styles.sectionDescription}>
        {t.STUDIO_RENTAL.EQUIPMENT.DESCRIPTION}
      </p>
      <div className={styles.grid}>
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
            <div className={styles.content}>
              <h4 className={styles.equipmentName}>{item.name}</h4>
              <p className={styles.equipmentDescription}>{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

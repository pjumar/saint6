"use client";

import { useTranslation } from "@/app/contexts/TranslationContext";
import { CommonButton } from "@/app/components/common-button/CommonButton";
import styles from "./FullRentalCard.module.css";

export interface FullRentalCardProps {
  price: string;
  description: string;
}

export function FullRentalCard({ price, description }: FullRentalCardProps) {
  const { t } = useTranslation();

  return (
    <div className={styles.card}>
      <div className={styles.content}>
        <h3 className={styles.title}>{t.STUDIO_RENTAL.FULL_RENTAL.TITLE}</h3>
        <p className={styles.price}>
          {price}
          <span className={styles.perHour}>{t.STUDIO_RENTAL.ROOMS.PER_HOUR}</span>
        </p>
        <p className={styles.description}>{description}</p>
        <div className={styles.features}>
          <div className={styles.feature}>
            <span className={styles.checkmark}>&#10003;</span>
            <span>{t.STUDIO_RENTAL.FULL_RENTAL.FEATURE_1}</span>
          </div>
          <div className={styles.feature}>
            <span className={styles.checkmark}>&#10003;</span>
            <span>{t.STUDIO_RENTAL.FULL_RENTAL.FEATURE_2}</span>
          </div>
          <div className={styles.feature}>
            <span className={styles.checkmark}>&#10003;</span>
            <span>{t.STUDIO_RENTAL.FULL_RENTAL.FEATURE_3}</span>
          </div>
        </div>
        <CommonButton variant="primary" size="lg">
          {t.STUDIO_RENTAL.ROOMS.MAKE_BOOKING}
        </CommonButton>
      </div>
    </div>
  );
}

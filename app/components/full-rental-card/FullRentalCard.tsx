"use client";

import Image from "next/image";
import { useTranslation } from "@/app/contexts/TranslationContext";
import { CommonButton } from "@/app/components/common-button/CommonButton";
import styles from "./FullRentalCard.module.css";

export interface FullRentalCardProps {
  price: string;
  backgroundImageUrl: string;
}

export function FullRentalCard({ price, backgroundImageUrl }: FullRentalCardProps) {
  const { t } = useTranslation();

  return (
    <div className={styles.section}>
      <div className={styles.backgroundContainer}>
        <Image
          src={backgroundImageUrl}
          alt="Full Studio Rental"
          fill
          className={styles.backgroundImage}
        />
        <div className={styles.overlay} />
      </div>

      <div className={styles.contentRow}>
        {/* Left side - Facilities intro text */}
        <div className={styles.introTextContainer}>
          <p className={styles.introText}>
            {t.STUDIO_RENTAL.FACILITIES.INTRO_TEXT}
          </p>
        </div>

        {/* Right side - Rental card */}
        <div className={styles.contentCard}>
          <h3 className={styles.title}>{t.STUDIO_RENTAL.FULL_RENTAL.TITLE}</h3>
          <div className={styles.details}>
            <p className={styles.price}>
              {price}<span className={styles.perHour}>{t.STUDIO_RENTAL.ROOMS.PER_HOUR}</span>
            </p>
            <p className={styles.description}>{t.STUDIO_RENTAL.FULL_RENTAL.DESCRIPTION}</p>
            <div className={styles.actions}>
              <CommonButton variant="primary" size="lg">
                {t.STUDIO_RENTAL.ROOMS.MAKE_BOOKING}
              </CommonButton>
              <CommonButton variant="outline" size="lg">
                {t.STUDIO_RENTAL.ROOMS.GALLERY}
              </CommonButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import Image from "next/image";
import { useTranslation } from "@/app/contexts/TranslationContext";
import styles from "./FacilitiesShowcase.module.css";

export interface FacilitiesShowcaseProps {
  makeupImageUrl: string;
  loungeImageUrl: string;
}

export function FacilitiesShowcase({
  makeupImageUrl,
  loungeImageUrl,
}: FacilitiesShowcaseProps) {
  const { t } = useTranslation();

  return (
    <div className={styles.showcase}>
      {/* Left Column - Dining Lounge */}
      <div className={styles.leftColumn}>
        <div className={styles.loungeCard}>
          <p className={styles.cardLabel}>
            {t.STUDIO_RENTAL.FACILITIES.DINING_LABEL}
          </p>
          <div className={styles.loungeImageContainer}>
            <Image
              src={loungeImageUrl}
              alt={t.STUDIO_RENTAL.FACILITIES.DINING_LOUNGE}
              fill
              className={styles.loungeImage}
            />
          </div>
        </div>
      </div>

      {/* Right Column - Makeup Room */}
      <div className={styles.rightColumn}>
        <p className={styles.cardLabel}>
          {t.STUDIO_RENTAL.FACILITIES.MAKEUP_LABEL}
        </p>
        <div className={styles.makeupImageContainer}>
          <Image
            src={makeupImageUrl}
            alt={t.STUDIO_RENTAL.FACILITIES.MAKEUP_ROOM}
            fill
            className={styles.makeupImage}
          />
        </div>
        <div className={styles.freeBadge}>
          {t.STUDIO_RENTAL.FACILITIES.FREE_BADGE}
        </div>
        <ul className={styles.featuresList}>
          <li className={styles.featureItem}>
            <Image
              src="/images/icons/makeup-table.svg"
              alt=""
              width={24}
              height={24}
              className={styles.featureIcon}
            />
            <span>{t.STUDIO_RENTAL.FACILITIES.FEATURE_1}</span>
          </li>
          <li className={styles.featureItem}>
            <Image
              src="/images/icons/changing-room.svg"
              alt=""
              width={24}
              height={24}
              className={styles.featureIcon}
            />
            <span>{t.STUDIO_RENTAL.FACILITIES.FEATURE_2}</span>
          </li>
          <li className={styles.featureItem}>
            <Image
              src="/images/icons/steam-iron.svg"
              alt=""
              width={24}
              height={24}
              className={styles.featureIcon}
            />
            <span>{t.STUDIO_RENTAL.FACILITIES.FEATURE_3}</span>
          </li>
          <li className={styles.featureItem}>
            <Image
              src="/images/icons/hanging-pole.svg"
              alt=""
              width={24}
              height={24}
              className={styles.featureIcon}
            />
            <span>{t.STUDIO_RENTAL.FACILITIES.FEATURE_4}</span>
          </li>
          <li className={styles.featureItem}>
            <Image
              src="/images/icons/sofa-table.svg"
              alt=""
              width={24}
              height={24}
              className={styles.featureIcon}
            />
            <span>{t.STUDIO_RENTAL.FACILITIES.FEATURE_5}</span>
          </li>
        </ul>
      </div>
    </div>
  );
}

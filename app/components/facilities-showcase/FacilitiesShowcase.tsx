"use client";

import Image from "next/image";
import { ProgressiveImage } from "@/app/components/progressive-image/ProgressiveImage";
import { useTranslation } from "@/app/contexts/TranslationContext";
import { useScrollAnimation, useScrollAnimationChildren } from "@/app/hooks";
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
  const leftColumnRef = useScrollAnimation<HTMLDivElement>({ type: "fadeLeft" });
  const rightColumnRef = useScrollAnimation<HTMLDivElement>({
    type: "fadeRight",
    delay: 0.15,
  });
  const featuresRef = useScrollAnimationChildren<HTMLUListElement>({
    type: "fadeUp",
    stagger: 0.08,
    delay: 0.3,
  });

  return (
    <div className={styles.showcase}>
      {/* Left Column - Dining Lounge */}
      <div ref={leftColumnRef} className={styles.leftColumn}>
        <div className={styles.loungeCard}>
          <p className={styles.cardLabel}>
            {t.STUDIO_RENTAL.FACILITIES.DINING_LABEL}
          </p>
          <div className={styles.loungeImageContainer}>
            <ProgressiveImage
              src={loungeImageUrl}
              alt={t.STUDIO_RENTAL.FACILITIES.DINING_LOUNGE}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className={styles.loungeImage}
            />
          </div>
        </div>
      </div>

      {/* Right Column - Makeup Room */}
      <div ref={rightColumnRef} className={styles.rightColumn}>
        <p className={styles.cardLabel}>
          {t.STUDIO_RENTAL.FACILITIES.MAKEUP_LABEL}
        </p>
        <div className={styles.makeupImageContainer}>
          <ProgressiveImage
            src={makeupImageUrl}
            alt={t.STUDIO_RENTAL.FACILITIES.MAKEUP_ROOM}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className={styles.makeupImage}
          />
        </div>
        <div className={styles.freeBadge}>
          {t.STUDIO_RENTAL.FACILITIES.FREE_BADGE}
        </div>
        <ul ref={featuresRef} className={styles.featuresList}>
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

"use client";

import Image from "next/image";
import { useTranslation } from "@/app/contexts/TranslationContext";
import styles from "./FacilitiesShowcase.module.css";

export interface Facility {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  features: string[];
}

export interface FacilitiesShowcaseProps {
  facilities: Facility[];
}

export function FacilitiesShowcase({ facilities }: FacilitiesShowcaseProps) {
  const { t } = useTranslation();

  return (
    <div className={styles.showcase}>
      <h3 className={styles.sectionTitle}>{t.STUDIO_RENTAL.FACILITIES.TITLE}</h3>
      <div className={styles.facilitiesGrid}>
        {facilities.map((facility) => (
          <div key={facility.id} className={styles.facilityCard}>
            <div className={styles.imageContainer}>
              <Image
                src={facility.imageUrl}
                alt={facility.title}
                width={400}
                height={300}
                className={styles.facilityImage}
              />
            </div>
            <div className={styles.content}>
              <h4 className={styles.facilityTitle}>{facility.title}</h4>
              <p className={styles.facilityDescription}>{facility.description}</p>
              <ul className={styles.featuresList}>
                {facility.features.map((feature, index) => (
                  <li key={index} className={styles.featureItem}>
                    <span className={styles.checkmark}>&#10003;</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

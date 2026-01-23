"use client";

import Image from "next/image";
import { useTranslation } from "@/app/contexts/TranslationContext";
import styles from "./ConceptRoomCard.module.css";
import { CommonButton } from "@/app/components/common-button/CommonButton";

export interface ConceptRoomCardProps {
  imageUrl: string;
  title: string;
  pricePerHour: string;
  space: string;
  width: string;
  ceilingHeight: string;
  description: string;
  showEnterButton?: boolean;
}

export function ConceptRoomCard({
  imageUrl,
  title,
  pricePerHour,
  space,
  width,
  ceilingHeight,
  description,
  showEnterButton = false,
}: ConceptRoomCardProps) {
  const { t } = useTranslation();

  return (
    <div className={styles.conceptCard}>
      {/* Arch-shaped Image Container */}
      <div className={styles.imageContainer}>
        <Image
          src={imageUrl}
          alt={title}
          width={449}
          height={449}
          className={styles.roomImage}
        />
        {showEnterButton && (
          <button type="button" className={styles.enterButton}>
            <span className={styles.enterButtonText}>{t.STUDIO_RENTAL.ROOMS.ENTER_ROOM}</span>
          </button>
        )}
      </div>

      {/* Content Box */}
      <div className={styles.contentBox}>
        {/* Title and Price Header */}
        <div className={styles.header}>
          <h3 className={styles.title}>{title}</h3>
          <p className={styles.price}>{pricePerHour}{t.STUDIO_RENTAL.ROOMS.PER_HOUR}</p>
        </div>

        {/* Specs Section */}
        <div className={styles.specs}>
          <div className={styles.specItem}>
            <span className={styles.specLabel}>{t.STUDIO_RENTAL.ROOMS.SPACE}</span>
            <span className={styles.specValue}>{space}</span>
          </div>
          <div className={styles.specItem}>
            <span className={styles.specLabel}>{t.STUDIO_RENTAL.ROOMS.WIDTH}</span>
            <span className={styles.specValue}>{width}</span>
          </div>
          <div className={styles.specItem}>
            <span className={styles.specLabel}>{t.STUDIO_RENTAL.ROOMS.CEILING_HEIGHT}</span>
            <span className={styles.specValue}>{ceilingHeight}</span>
          </div>
        </div>

        {/* Description and Actions */}
        <div className={styles.footer}>
          <p className={styles.description}>{description}</p>
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
  );
}

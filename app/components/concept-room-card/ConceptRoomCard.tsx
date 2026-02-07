"use client";

import Image from "next/image";
import { useState } from "react";
import { CommonButton } from "@/app/components/common-button/CommonButton";
import { GalleryModal } from "@/app/components/gallery-modal/GalleryModal";
import { useTranslation } from "@/app/contexts/TranslationContext";
import styles from "./ConceptRoomCard.module.css";

export interface GalleryImage {
  url: string;
  alt?: string;
}

export interface ConceptRoomCardProps {
  imageUrl: string;
  title: string;
  pricePerHour: string;
  space: string;
  width: string;
  ceilingHeight: string;
  description: string;
  showEnterButton?: boolean;
  gallery?: GalleryImage[];
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
  gallery = [],
}: ConceptRoomCardProps) {
  const { t } = useTranslation();
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);

  const handleEnterRoom = () => {
    if (gallery.length > 0) {
      setIsGalleryOpen(true);
    }
  };

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
        {showEnterButton && gallery.length > 0 && (
          <button
            type="button"
            className={styles.enterButton}
            onClick={handleEnterRoom}
          >
            <span className={styles.enterButtonText}>
              {t.STUDIO_RENTAL.ROOMS.ENTER_ROOM}
            </span>
          </button>
        )}
      </div>

      {/* Content Box */}
      <div className={styles.contentBox}>
        {/* Title and Price Header */}
        <div className={styles.header}>
          <h3 className={styles.title}>{title}</h3>
          <p className={styles.price}>
            {pricePerHour}
            {t.STUDIO_RENTAL.ROOMS.PER_HOUR}
          </p>
        </div>

        {/* Specs Section */}
        <div className={styles.specs}>
          <div className={styles.specItem}>
            <span className={styles.specLabel}>
              {t.STUDIO_RENTAL.ROOMS.SPACE}
            </span>
            <span className={styles.specValue}>{space}</span>
          </div>
          <div className={styles.specItem}>
            <span className={styles.specLabel}>
              {t.STUDIO_RENTAL.ROOMS.WIDTH}
            </span>
            <span className={styles.specValue}>{width}</span>
          </div>
          <div className={styles.specItem}>
            <span className={styles.specLabel}>
              {t.STUDIO_RENTAL.ROOMS.CEILING_HEIGHT}
            </span>
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
            <CommonButton
              variant="outline"
              size="lg"
              onClick={gallery.length > 0 ? handleEnterRoom : undefined}
            >
              {t.STUDIO_RENTAL.ROOMS.GALLERY}
            </CommonButton>
          </div>
        </div>
      </div>

      {/* Gallery Modal */}
      <GalleryModal
        isOpen={isGalleryOpen}
        onClose={() => setIsGalleryOpen(false)}
        images={gallery}
        title={title}
      />
    </div>
  );
}

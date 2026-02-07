"use client";

import Image from "next/image";
import { useState } from "react";
import { useTranslation } from "@/app/contexts/TranslationContext";
import {
  GalleryModal,
  type GalleryImage,
} from "@/app/components/gallery-modal/GalleryModal";
import styles from "./RoomCard.module.css";

export interface RoomCardProps {
  imageUrl: string;
  title: string;
  pricePerHour: string;
  counter: string;
  space: string;
  width: string;
  ceilingHeight: string;
  description: string;
  showEnterButton?: boolean;
  gallery?: GalleryImage[];
}

export function RoomCard({
  imageUrl,
  title,
  pricePerHour,
  counter,
  space,
  width,
  ceilingHeight,
  description,
  showEnterButton = false,
  gallery = [],
}: RoomCardProps) {
  const { t } = useTranslation();
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);

  const hasGallery = gallery.length > 0;

  return (
    <>
      <div className={styles.roomCard}>
        {/* Room Image */}
        <div className={styles.imageContainer}>
          <Image
            src={imageUrl}
            alt={title}
            width={449}
            height={596}
            className={styles.roomImage}
          />
          {showEnterButton && hasGallery && (
            <button
              type="button"
              className={styles.enterButton}
              onClick={() => setIsGalleryOpen(true)}
            >
              <span className={styles.enterButtonText}>
                {t.STUDIO_RENTAL.ROOMS.ENTER_ROOM}
              </span>
            </button>
          )}
        </div>

        {/* Room Content */}
        <div className={styles.content}>
          {/* Room Counter */}
          <p className={styles.counter}>{counter}</p>

          {/* Title, Price, Description */}
          <div className={styles.details}>
            <h3 className={styles.title}>{title}</h3>
            <p className={styles.priceAmount}>
              {pricePerHour}
              {t.STUDIO_RENTAL.ROOMS.PER_HOUR}
            </p>
            <p className={styles.description}>{description}</p>
          </div>
        </div>
      </div>

      {hasGallery && (
        <GalleryModal
          isOpen={isGalleryOpen}
          onClose={() => setIsGalleryOpen(false)}
          images={gallery}
          title={title}
        />
      )}
    </>
  );
}

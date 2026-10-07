"use client";

import { useState } from "react";
import { ProgressiveImage } from "@/app/components/progressive-image/ProgressiveImage";
import { CommonButton } from "@/app/components/common-button/CommonButton";
import { GalleryModal } from "@/app/components/gallery-modal/GalleryModal";
import {
  BookingModal,
  type BookingRoomData,
} from "@/app/components/booking-modal/BookingModal";
import { useTranslation } from "@/app/contexts/TranslationContext";
import styles from "./ConceptRoomCard.module.css";
import type { StudioDiscovery } from "@/app/lib/studio-discovery/types";

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
  dimensions?: string;
  inclusions?: string;
  currency?: string;
  specLabels?: StudioDiscovery["spec_labels"];
  showEnterButton?: boolean;
  gallery?: GalleryImage[];
  allBookingRooms?: BookingRoomData[];
  bookingRoomIndex?: number;
}

export function ConceptRoomCard({
  imageUrl,
  title,
  pricePerHour,
  space,
  width,
  ceilingHeight,
  description,
  dimensions,
  inclusions,
  currency,
  specLabels,
  showEnterButton = false,
  gallery = [],
  allBookingRooms,
  bookingRoomIndex = 0,
}: ConceptRoomCardProps) {
  const { t } = useTranslation();
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  const handleEnterRoom = () => {
    if (gallery.length > 0) {
      setIsGalleryOpen(true);
    }
  };

  return (
    <div className={styles.conceptCard}>
      {/* Arch-shaped Image Container */}
      <div className={styles.imageContainer}>
        <ProgressiveImage
          src={imageUrl}
          alt={title}
          width={449}
          height={449}
          sizes="(max-width: 768px) 100vw, 449px"
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
            {currency ? ` ${currency}` : ""}
            {t.STUDIO_RENTAL.ROOMS.PER_HOUR}
          </p>
        </div>

        {/* Specs Section */}
        <div className={styles.specs}>
          <div className={styles.specItem}>
            <span className={styles.specLabel}>
              {specLabels?.area || t.STUDIO_RENTAL.ROOMS.SPACE}
            </span>
            <span className={styles.specValue}>{space}</span>
          </div>
          {width && (
            <div className={styles.specItem}>
              <span className={styles.specLabel}>
                {specLabels?.width || t.STUDIO_RENTAL.ROOMS.WIDTH}
              </span>
              <span className={styles.specValue}>{width}</span>
            </div>
          )}
          <div className={styles.specItem}>
            <span className={styles.specLabel}>
              {specLabels?.ceiling_height ||
                t.STUDIO_RENTAL.ROOMS.CEILING_HEIGHT}
            </span>
            <span className={styles.specValue}>{ceilingHeight}</span>
          </div>
          {dimensions && (
            <div className={styles.specItem}>
              <span className={styles.specLabel}>{specLabels?.dimensions}</span>
              <span className={styles.specValue}>{dimensions}</span>
            </div>
          )}
        </div>

        {/* Description and Actions */}
        <div className={styles.footer}>
          <p className={styles.description}>{description}</p>
          {inclusions && (
            <p className={styles.description}>
              {specLabels?.inclusions}: {inclusions}
            </p>
          )}
          <div className={styles.actions}>
            <CommonButton
              variant="primary"
              size="lg"
              onClick={() => setIsBookingOpen(true)}
            >
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

      {/* Booking Modal */}
      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        rooms={
          allBookingRooms || [
            {
              title,
              pricePerHour,
              description,
              space,
              width,
              ceilingHeight,
              imageUrl,
              gallery,
            },
          ]
        }
        initialRoomIndex={allBookingRooms ? bookingRoomIndex : 0}
      />
    </div>
  );
}

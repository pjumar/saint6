"use client";

import { useState } from "react";
import { ProgressiveImage } from "@/app/components/progressive-image/ProgressiveImage";
import { useTranslation } from "@/app/contexts/TranslationContext";
import {
  GalleryModal,
  type GalleryImage,
} from "@/app/components/gallery-modal/GalleryModal";
import {
  BookingModal,
  type BookingRoomData,
} from "@/app/components/booking-modal/BookingModal";
import { CommonButton } from "@/app/components/common-button/CommonButton";
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
  allBookingRooms?: BookingRoomData[];
  bookingRoomIndex?: number;
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
  allBookingRooms,
  bookingRoomIndex = 0,
}: RoomCardProps) {
  const { t } = useTranslation();
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  const hasGallery = gallery.length > 0;

  return (
    <>
      <div className={styles.roomCard}>
        {/* Room Image */}
        <div className={styles.imageContainer}>
          <ProgressiveImage
            src={imageUrl}
            alt={title}
            width={449}
            height={596}
            sizes="(max-width: 768px) 100vw, 449px"
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

          <div className={styles.actions}>
            <CommonButton
              variant="primary"
              size="lg"
              onClick={() => setIsBookingOpen(true)}
            >
              {t.STUDIO_RENTAL.ROOMS.MAKE_BOOKING}
            </CommonButton>
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
    </>
  );
}

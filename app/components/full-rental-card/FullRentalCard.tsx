"use client";

import { useMemo, useState } from "react";
import { ProgressiveImage } from "@/app/components/progressive-image/ProgressiveImage";
import { CommonButton } from "@/app/components/common-button/CommonButton";
import {
  BookingModal,
  type BookingRoomData,
} from "@/app/components/booking-modal/BookingModal";
import {
  GalleryModal,
  type GalleryImage,
} from "@/app/components/gallery-modal/GalleryModal";
import { useTranslation } from "@/app/contexts/TranslationContext";
import { useScrollAnimation } from "@/app/hooks";
import styles from "./FullRentalCard.module.css";

export interface FullRentalCardProps {
  price: string;
  backgroundImageUrl: string;
  allBookingRooms?: BookingRoomData[];
  bookingRoomIndex?: number;
}

export function FullRentalCard({
  price,
  backgroundImageUrl,
  allBookingRooms,
  bookingRoomIndex = 0,
}: FullRentalCardProps) {
  const { t } = useTranslation();
  const introRef = useScrollAnimation<HTMLDivElement>({ type: "fadeLeft" });
  const cardRef = useScrollAnimation<HTMLDivElement>({
    type: "fadeUp",
    delay: 0.2,
  });
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);

  // Collect all images from all rooms for the gallery
  const allGalleryImages: GalleryImage[] = useMemo(() => {
    if (!allBookingRooms) return [];
    const images: GalleryImage[] = [];
    for (const room of allBookingRooms) {
      if (room.gallery && room.gallery.length > 0) {
        for (const img of room.gallery) {
          images.push({ url: img.url, alt: img.alt || room.title });
        }
      } else if (room.imageUrl) {
        images.push({ url: room.imageUrl, alt: room.title });
      }
    }
    return images;
  }, [allBookingRooms]);

  return (
    <div className={styles.section}>
      <div className={styles.backgroundContainer}>
        <ProgressiveImage
          src={backgroundImageUrl}
          alt="Full Studio Rental"
          fill
          sizes="(max-width: 1440px) 100vw, 1440px"
          className={styles.backgroundImage}
        />
        <div className={styles.overlay} />
      </div>

      <div className={styles.contentRow}>
        {/* Left side - Facilities intro text */}
        <div ref={introRef} className={styles.introTextContainer}>
          <p className={styles.introText}>
            {t.STUDIO_RENTAL.FACILITIES.INTRO_TEXT}
          </p>
        </div>

        {/* Right side - Rental card */}
        <div ref={cardRef} className={styles.contentCard}>
          <h3 className={styles.title}>{t.STUDIO_RENTAL.FULL_RENTAL.TITLE}</h3>
          <div className={styles.details}>
            <p className={styles.price}>
              {price}
              <span className={styles.perHour}>
                {t.STUDIO_RENTAL.ROOMS.PER_HOUR}
              </span>
            </p>
            <p className={styles.description}>
              {t.STUDIO_RENTAL.FULL_RENTAL.DESCRIPTION}
            </p>
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
                onClick={() => setIsGalleryOpen(true)}
              >
                {t.STUDIO_RENTAL.ROOMS.GALLERY}
              </CommonButton>
            </div>
          </div>
        </div>
      </div>

      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        rooms={allBookingRooms || []}
        initialRoomIndex={allBookingRooms ? bookingRoomIndex : 0}
      />

      {allGalleryImages.length > 0 && (
        <GalleryModal
          isOpen={isGalleryOpen}
          onClose={() => setIsGalleryOpen(false)}
          images={allGalleryImages}
          title={t.STUDIO_RENTAL.FULL_RENTAL.ROOM_NAME}
        />
      )}
    </div>
  );
}

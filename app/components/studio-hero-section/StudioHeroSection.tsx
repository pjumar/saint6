"use client";

import { useCallback, useId, useState } from "react";
import {
  BookingModal,
  type BookingRoomData,
} from "@/app/components/booking-modal/BookingModal";
import { CommonButton } from "@/app/components/common-button/CommonButton";
import { HeroSection } from "@/app/components/hero-section/HeroSection";
import { useTranslation } from "@/app/contexts/TranslationContext";
import styles from "./StudioHeroSection.module.css";

export interface StudioHeroSectionProps {
  heading: string;
  backgroundImage: string;
  backgroundAlt: string;
  placeholderImage?: string | null;
  rooms: BookingRoomData[];
  blankRoomSizes: string;
}

export function StudioHeroSection({
  heading,
  backgroundImage,
  backgroundAlt,
  placeholderImage,
  rooms,
  blankRoomSizes,
}: StudioHeroSectionProps) {
  const { t, locale } = useTranslation();
  const copy = t.STUDIO_RENTAL.HERO;
  const roomSelectId = useId();
  const [selectedRoomIndex, setSelectedRoomIndex] = useState(0);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const closeBooking = useCallback(() => setIsBookingOpen(false), []);
  const roomPrices = rooms.map((room) =>
    Number(room.pricePerHour.replace(/[^0-9]/g, "")),
  );
  const minimumPrice = Math.min(...roomPrices.filter((price) => price > 0));
  const priceFormatter = new Intl.NumberFormat(
    locale === "vi" ? "vi-VN" : "en-US",
  );

  return (
    <>
      <HeroSection
        heading={heading}
        backgroundImage={backgroundImage}
        backgroundAlt={backgroundAlt}
        placeholderImage={placeholderImage}
        showScrollIndicator={true}
        showDecorativeLine={true}
        mobileOffer={
          Number.isFinite(minimumPrice)
            ? {
                heading: copy.MOBILE_HEADING,
                content: (
                  <div className={styles.offer}>
                    <p className={styles.price}>
                      {copy.FROM} {priceFormatter.format(minimumPrice)}
                      {copy.HOURLY_CURRENCY}
                    </p>
                    <p className={styles.specs}>
                      {blankRoomSizes} · {copy.CONCEPT_ROOMS}
                    </p>
                    <p className={styles.minimum}>{copy.MINIMUM_RENTAL}</p>
                    <div className={styles.roomChoice}>
                      <label htmlFor={roomSelectId}>{copy.ROOM_LABEL}</label>
                      <select
                        id={roomSelectId}
                        value={selectedRoomIndex}
                        onChange={(event) =>
                          setSelectedRoomIndex(Number(event.target.value))
                        }
                      >
                        {rooms.map((room, index) => (
                          <option key={room.title} value={index}>
                            {room.title} —{" "}
                            {priceFormatter.format(roomPrices[index])}
                            {copy.HOURLY_CURRENCY}
                          </option>
                        ))}
                      </select>
                    </div>
                    <CommonButton
                      type="button"
                      size="lg"
                      fullWidth
                      onClick={() => setIsBookingOpen(true)}
                    >
                      {copy.CHECK_AVAILABILITY}
                    </CommonButton>
                  </div>
                ),
              }
            : undefined
        }
      />
      <BookingModal
        isOpen={isBookingOpen}
        onClose={closeBooking}
        rooms={rooms}
        initialRoomIndex={selectedRoomIndex}
      />
    </>
  );
}

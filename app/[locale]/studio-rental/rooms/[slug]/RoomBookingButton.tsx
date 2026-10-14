"use client";

import {
  BookingModal,
  type BookingRoomData,
} from "@/app/components/booking-modal/BookingModal";
import { CommonButton } from "@/app/components/common-button/CommonButton";
import { useTranslation } from "@/app/contexts/TranslationContext";

export function RoomBookingButton() {
  const { t } = useTranslation();

  function scrollToBooking() {
    const booking = document.getElementById("booking");
    if (!booking) return;
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    booking.scrollIntoView({ behavior: reducedMotion ? "instant" : "smooth" });
  }

  return (
    <CommonButton
      variant="primary"
      size="lg"
      aria-controls="booking"
      onClick={scrollToBooking}
    >
      {t.STUDIO_RENTAL.ROOMS.MAKE_BOOKING}
    </CommonButton>
  );
}

export function RoomBookingForm({ room }: { room: BookingRoomData }) {
  return (
    <BookingModal
      isOpen
      inline
      onClose={() => {}}
      rooms={[room]}
      initialRoomIndex={0}
    />
  );
}

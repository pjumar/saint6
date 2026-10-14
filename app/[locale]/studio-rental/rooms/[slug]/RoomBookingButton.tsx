"use client";

import { useState } from "react";
import {
  BookingModal,
  type BookingRoomData,
} from "@/app/components/booking-modal/BookingModal";
import { CommonButton } from "@/app/components/common-button/CommonButton";
import { useTranslation } from "@/app/contexts/TranslationContext";

export function RoomBookingButton({ room }: { room: BookingRoomData }) {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <CommonButton variant="primary" size="lg" onClick={() => setIsOpen(true)}>
        {t.STUDIO_RENTAL.ROOMS.MAKE_BOOKING}
      </CommonButton>
      <BookingModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        rooms={[room]}
        initialRoomIndex={0}
      />
    </>
  );
}

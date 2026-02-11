"use client";

import type { BookingRoomData } from "@/app/components/booking-modal/BookingModal";
import { RoomCard, type RoomCardProps } from "@/app/components/room-card/RoomCard";
import { useScrollAnimationChildren } from "@/app/hooks";
import styles from "./BlankRoomsGrid.module.css";

export interface BlankRoomsGridProps {
  rooms: (RoomCardProps & { id: string })[];
  allBookingRooms?: BookingRoomData[];
  bookingRoomIndexOffset?: number;
}

export function BlankRoomsGrid({
  rooms,
  allBookingRooms,
  bookingRoomIndexOffset = 0,
}: BlankRoomsGridProps) {
  const gridRef = useScrollAnimationChildren<HTMLDivElement>({
    type: "fadeUp",
    stagger: 0.12,
  });

  if (rooms.length === 0) return null;

  return (
    <div ref={gridRef} className={styles.roomGrid}>
      {rooms.map((room, index) => (
        <RoomCard
          key={room.id}
          {...room}
          allBookingRooms={allBookingRooms}
          bookingRoomIndex={bookingRoomIndexOffset + index}
        />
      ))}
    </div>
  );
}

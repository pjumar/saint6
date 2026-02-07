"use client";

import { RoomCard, type RoomCardProps } from "@/app/components/room-card/RoomCard";
import { useScrollAnimationChildren } from "@/app/hooks";
import styles from "./BlankRoomsGrid.module.css";

export interface BlankRoomsGridProps {
  rooms: (RoomCardProps & { id: string })[];
}

export function BlankRoomsGrid({ rooms }: BlankRoomsGridProps) {
  const gridRef = useScrollAnimationChildren<HTMLDivElement>({
    type: "fadeUp",
    stagger: 0.12,
  });

  if (rooms.length === 0) return null;

  return (
    <div ref={gridRef} className={styles.roomGrid}>
      {rooms.map((room) => (
        <RoomCard key={room.id} {...room} />
      ))}
    </div>
  );
}

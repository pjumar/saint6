import { ConceptRoomCard } from "@/app/components/concept-room-card/ConceptRoomCard";
import styles from "./ConceptRoomsShowcase.module.css";

export interface ConceptRoom {
  id: string;
  imageUrl: string;
  title: string;
  pricePerHour: string;
  space: string;
  width: string;
  ceilingHeight: string;
  description: string;
  showEnterButton?: boolean;
}

export interface ConceptRoomsShowcaseProps {
  rooms: ConceptRoom[];
}

export function ConceptRoomsShowcase({ rooms }: ConceptRoomsShowcaseProps) {
  return (
    <section className={styles.showcaseSection}>
      {/* Background decorative pattern - placeholder for SVG pattern */}
      <div className={styles.backgroundPattern} aria-hidden="true" />

      {/* Content */}
      <div className={styles.content}>
        {/* Header */}
        <div className={styles.header}>
          <p className={styles.subtitle}>Seasonal Concept Rooms</p>
          <h2 className={styles.title}>
            Seasonal Concept Rooms
            <br />
            Crafted for Limitless Creativity
          </h2>
          <p className={styles.description}>
            Updated every six months, our Concept Rooms feature one-of-a-kind
            themes that elevate photoshoots, filming, livestreams, and
            workshops.
          </p>
        </div>

        {/* Room Cards Grid */}
        <div className={styles.roomsGrid}>
          {rooms.map((room) => (
            <ConceptRoomCard key={room.id} {...room} />
          ))}
        </div>
      </div>
    </section>
  );
}

"use client";

import { ConceptRoomCard } from "@/app/components/concept-room-card/ConceptRoomCard";
import { useTranslation } from "@/app/contexts/TranslationContext";
import styles from "./ConceptRoomsShowcase.module.css";

export interface GalleryImage {
  url: string;
  alt?: string;
}

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
  gallery?: GalleryImage[];
}

export interface ConceptRoomsShowcaseProps {
  rooms: ConceptRoom[];
}

export function ConceptRoomsShowcase({ rooms }: ConceptRoomsShowcaseProps) {
  const { t } = useTranslation();

  // Split the title into two lines for formatting
  const titleLines = t.STUDIO_RENTAL.CONCEPT.TITLE.split("\n");

  return (
    <section className={styles.showcaseSection}>
      {/* Background decorative pattern - placeholder for SVG pattern */}
      <div className={styles.backgroundPattern} aria-hidden="true" />

      {/* Content */}
      <div className={styles.content}>
        {/* Header */}
        <div className={styles.header}>
          <p className={styles.subtitle}>{t.STUDIO_RENTAL.CONCEPT.SUBTITLE}</p>
          <h2 className={styles.title}>
            {titleLines[0]}
            {titleLines[1] && (
              <>
                <br />
                {titleLines[1]}
              </>
            )}
          </h2>
          <p className={styles.description}>
            {t.STUDIO_RENTAL.CONCEPT.DESCRIPTION}
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

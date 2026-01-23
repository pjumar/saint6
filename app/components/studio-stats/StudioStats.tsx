"use client";

import { useTranslation } from "@/app/contexts/TranslationContext";
import styles from "./StudioStats.module.css";

export interface StudioStatsProps {
  totalRooms: number;
  ceilingHeight: string;
  totalSpace: string;
  blankRooms: number;
  conceptRooms: number;
}

export function StudioStats({
  totalRooms,
  ceilingHeight,
  totalSpace,
  blankRooms,
  conceptRooms,
}: StudioStatsProps) {
  const { t } = useTranslation();

  const stats = [
    { label: t.STUDIO_RENTAL.STATS.TOTAL_ROOMS, value: totalRooms.toString() },
    { label: t.STUDIO_RENTAL.STATS.CEILING_HEIGHT, value: ceilingHeight },
    { label: t.STUDIO_RENTAL.STATS.TOTAL_SPACE, value: totalSpace },
    { label: t.STUDIO_RENTAL.STATS.BLANK_ROOMS, value: blankRooms.toString() },
    { label: t.STUDIO_RENTAL.STATS.CONCEPT_ROOMS, value: conceptRooms.toString() },
  ];

  return (
    <div className={styles.statsContainer}>
      {stats.map((stat, index) => (
        <div key={index} className={styles.statItem}>
          <p className={styles.statLabel}>{stat.label}</p>
          <p className={styles.statValue}>{stat.value}</p>
        </div>
      ))}
    </div>
  );
}

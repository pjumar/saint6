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
  const stats = [
    { label: "Total Rooms", value: totalRooms.toString() },
    { label: "Ceiling Height", value: ceilingHeight },
    { label: "Total Space", value: totalSpace },
    { label: "Blank Rooms", value: blankRooms.toString() },
    { label: "Concept Rooms", value: conceptRooms.toString() },
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

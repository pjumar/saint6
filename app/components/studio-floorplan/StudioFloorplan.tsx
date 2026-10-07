import Image from "next/image";
import type { StudioDiscovery } from "@/app/lib/studio-discovery/types";
import styles from "./StudioFloorplan.module.css";

interface StudioFloorplanProps {
  content: StudioDiscovery["floorplan"];
}

export function StudioFloorplan({ content }: StudioFloorplanProps) {
  return (
    <section
      id="floorplan"
      tabIndex={-1}
      className={styles.section}
      aria-labelledby="floorplan-heading"
    >
      <div className={styles.inner}>
        <header className={styles.header}>
          <p className={styles.label}>{content.label}</p>
          <h2 id="floorplan-heading" className={styles.heading}>
            {content.heading}
          </h2>
          <p className={styles.description}>{content.description}</p>
        </header>
        <figure className={styles.figure}>
          <a
            href={content.image.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={content.enlarge_label}
          >
            <Image
              src={content.image.url}
              alt={content.image_alt}
              width={content.image.width || 1440}
              height={content.image.height || 970}
              sizes="(min-width: 90rem) 1360px, 100vw"
              className={styles.image}
            />
            <span className={styles.enlarge}>{content.enlarge_label} ↗</span>
          </a>
        </figure>
      </div>
    </section>
  );
}

"use client";

import { ProgressiveImage } from "@/app/components/progressive-image/ProgressiveImage";
import { useScrollAnimation } from "@/app/hooks";
import { SpiralDecoration } from "@/app/components/spiral-decoration";
import styles from "./MapImage.module.css";

export interface MapImageProps {
  imageUrl: string;
  alt?: string;
  showSpiral?: boolean;
  showPin?: boolean;
}

/**
 * MapImage component - Full-width map with optional decorations
 * Based on Figma design: full-width map with spiral decoration and pin marker
 */
export function MapImage({
  imageUrl,
  alt = "Location map",
  showSpiral = true,
  showPin = true,
}: MapImageProps) {
  const mapRef = useScrollAnimation<HTMLDivElement>({ type: "scale" });

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div ref={mapRef} className={styles.mapImage}>
          <ProgressiveImage
            src={imageUrl}
            alt={alt}
            fill
            className={styles.image}
            sizes="(max-width: 1440px) 100vw, 1440px"
          />

          {/* Spiral Decoration */}
          {showSpiral && (
            <SpiralDecoration
              className={styles.spiralDecoration}
              imageClassName={styles.spiralImage}
              width={400}
              height={400}
            />
          )}

          {/* Location Pin */}
          {showPin && (
            <div className={styles.pinMarker}>
              <svg
                width="32"
                height="40"
                viewBox="0 0 32 40"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M16 0C7.163 0 0 7.163 0 16c0 12 16 24 16 24s16-12 16-24c0-8.837-7.163-16-16-16zm0 22a6 6 0 110-12 6 6 0 010 12z"
                  fill="#880300"
                />
              </svg>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

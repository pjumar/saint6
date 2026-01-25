"use client";

import Image from "next/image";
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
  return (
    <div className={styles.mapImage}>
      <Image
        src={imageUrl}
        alt={alt}
        fill
        className={styles.image}
        sizes="100vw"
      />

      {/* Spiral Decoration */}
      {showSpiral && (
        <div className={styles.spiralDecoration}>
          <Image
            src="/images/spiral_decoration.svg"
            alt=""
            width={400}
            height={400}
            className={styles.spiralImage}
          />
        </div>
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
  );
}

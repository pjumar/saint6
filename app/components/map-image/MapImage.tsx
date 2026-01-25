"use client";

import Image from "next/image";
import styles from "./MapImage.module.css";

export interface MapImageProps {
  imageUrl: string;
  alt?: string;
}

export function MapImage({ imageUrl, alt = "Location map" }: MapImageProps) {
  return (
    <div className={styles.mapImage}>
      <Image
        src={imageUrl}
        alt={alt}
        fill
        className={styles.image}
        sizes="(max-width: 768px) 100vw, 50vw"
      />
    </div>
  );
}

import type { GalleryImage } from "../types";

export const galleryImages: GalleryImage[] = Array.from(
  { length: 15 },
  (_, i) => ({
    image: `/images/gallery/gallery-${String(i + 1).padStart(2, "0")}.jpg`,
    alt: `Gallery image ${i + 1}`,
  })
);

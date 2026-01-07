import Image from "next/image";
import styles from "./GallerySection.module.css";

interface GalleryImage {
  id: number;
  src: string;
  alt: string;
}

export function GallerySection() {
  const galleryImages: GalleryImage[] = [
    { id: 1, src: "/images/gallery/gallery-01.jpg", alt: "Gallery image 1" },
    { id: 2, src: "/images/gallery/gallery-02.jpg", alt: "Gallery image 2" },
    { id: 3, src: "/images/gallery/gallery-03.jpg", alt: "Gallery image 3" },
    { id: 4, src: "/images/gallery/gallery-04.jpg", alt: "Gallery image 4" },
    { id: 5, src: "/images/gallery/gallery-05.jpg", alt: "Gallery image 5" },
    { id: 6, src: "/images/gallery/gallery-06.jpg", alt: "Gallery image 6" },
    { id: 7, src: "/images/gallery/gallery-07.jpg", alt: "Gallery image 7" },
    { id: 8, src: "/images/gallery/gallery-08.jpg", alt: "Gallery image 8" },
    { id: 9, src: "/images/gallery/gallery-09.jpg", alt: "Gallery image 9" },
    { id: 10, src: "/images/gallery/gallery-10.jpg", alt: "Gallery image 10" },
    { id: 11, src: "/images/gallery/gallery-11.jpg", alt: "Gallery image 11" },
    { id: 12, src: "/images/gallery/gallery-12.jpg", alt: "Gallery image 12" },
    { id: 13, src: "/images/gallery/gallery-13.jpg", alt: "Gallery image 13" },
    { id: 14, src: "/images/gallery/gallery-14.jpg", alt: "Gallery image 14" },
    { id: 15, src: "/images/gallery/gallery-15.jpg", alt: "Gallery image 15" },
  ];

  return (
    <section className={styles.gallery}>
      <div className={styles.galleryGrid}>
        {galleryImages.map((image) => (
          <div key={image.id} className={styles.galleryItem}>
            <Image
              src={image.src}
              alt={image.alt}
              width={400}
              height={600}
              className={styles.galleryImage}
            />
          </div>
        ))}
      </div>
    </section>
  );
}


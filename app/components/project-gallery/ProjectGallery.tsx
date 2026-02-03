"use client";

import Image from "next/image";
import styles from "./ProjectGallery.module.css";

export interface ProjectGalleryImage {
  src: string;
  alt: string;
  width: number;
  height: number;
}

export interface ProjectGalleryData {
  id: string;
  title: string;
  category?: string;
  description?: string;
  images: ProjectGalleryImage[];
}

interface ProjectGalleryProps {
  project: ProjectGalleryData;
}

export function ProjectGallery({ project }: ProjectGalleryProps) {
  // Take up to 4 images
  const displayImages = project.images.slice(0, 4);

  return (
    <section className={styles.projectGallery}>
      <div className={styles.projectHeader}>
        <div className={styles.titleBar}>
          {project.category && (
            <span className={styles.category}>{project.category}</span>
          )}
          <h3 className={styles.title}>{project.title}</h3>
        </div>
        {project.description && (
          <p className={styles.description}>{project.description}</p>
        )}
      </div>

      <div className={styles.imageGrid} data-count={displayImages.length}>
        {displayImages.map((image, index) => (
          <div
            key={index}
            className={styles[`image${index + 1}`] || styles.image}
          >
            <Image
              src={image.src}
              alt={image.alt}
              width={image.width}
              height={image.height}
              className={styles.galleryImage}
            />
          </div>
        ))}
      </div>
    </section>
  );
}

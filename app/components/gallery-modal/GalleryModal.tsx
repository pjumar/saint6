"use client";

import Image from "next/image";
import { useEffect, useCallback, useRef, useState } from "react";
import { ProgressiveImage } from "@/app/components/progressive-image/ProgressiveImage";
import { createPortal } from "react-dom";
import styles from "./GalleryModal.module.css";

export interface GalleryImage {
  url: string;
  alt?: string;
}

export interface GalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  images: GalleryImage[];
  title?: string;
  initialIndex?: number;
}

export function GalleryModal({
  isOpen,
  onClose,
  images,
  title,
  initialIndex = 0,
}: GalleryModalProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const thumbnailsRef = useRef<HTMLDivElement>(null);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const goToPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowRight") {
        goToNext();
      } else if (e.key === "ArrowLeft") {
        goToPrev();
      }
    },
    [onClose, goToNext, goToPrev]
  );

  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(initialIndex);
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, handleKeyDown, initialIndex]);

  // Scroll active thumbnail into view
  useEffect(() => {
    const container = thumbnailsRef.current;
    const thumb = container?.children[currentIndex] as HTMLElement | undefined;
    if (thumb) thumb.scrollIntoView({ block: "nearest", inline: "nearest", behavior: "smooth" });
  }, [currentIndex]);

  // Wheel-to-scroll horizontally for thumbnails
  useEffect(() => {
    const el = thumbnailsRef.current;
    if (!el) return;

    const onWheel = (e: WheelEvent) => {
      if (el.scrollWidth <= el.clientWidth) return;
      e.preventDefault();
      el.scrollLeft += e.deltaY;
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [isOpen]);

  if (!isOpen || images.length === 0) return null;

  const currentImage = images[currentIndex];

  return createPortal(
    <div className={styles.overlay} onClick={onClose}>
      <div
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-label={title || "Image gallery"}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          className={styles.closeButton}
          onClick={onClose}
          aria-label="Close gallery"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M18 6L6 18M6 6L18 18"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        {/* Title */}
        {title && <h2 className={styles.title}>{title}</h2>}

        {/* Main image area */}
        <div className={styles.imageContainer}>
          {/* Previous button */}
          {images.length > 1 && (
            <button
              className={`${styles.navButton} ${styles.prevButton}`}
              onClick={goToPrev}
              aria-label="Previous image"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M15 18L9 12L15 6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          )}

          {/* Image */}
          <div className={styles.imageWrapper}>
            <ProgressiveImage
              src={currentImage.url}
              alt={currentImage.alt || `Gallery image ${currentIndex + 1}`}
              fill
              className={styles.image}
              sizes="100vw"
              priority
            />
          </div>

          {/* Next button */}
          {images.length > 1 && (
            <button
              className={`${styles.navButton} ${styles.nextButton}`}
              onClick={goToNext}
              aria-label="Next image"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M9 18L15 12L9 6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          )}
        </div>

        {/* Counter */}
        {images.length > 1 && (
          <div className={styles.counter}>
            {currentIndex + 1} / {images.length}
          </div>
        )}

        {/* Thumbnail strip */}
        {images.length > 1 && (
          <div className={styles.thumbnails} ref={thumbnailsRef}>
            {images.map((image, index) => (
              <button
                key={index}
                className={`${styles.thumbnail} ${index === currentIndex ? styles.thumbnailActive : ""}`}
                onClick={() => setCurrentIndex(index)}
                aria-label={`Go to image ${index + 1}`}
              >
                <Image
                  src={image.url}
                  alt=""
                  fill
                  className={styles.thumbnailImage}
                  sizes="80px"
                />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}

"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import styles from "./EventProjectGallery.module.css";

export interface EventProjectImage {
  url: string;
  alt: string;
}

export interface EventProject {
  id: string;
  images: EventProjectImage[];
  title: string;
  category: string;
}

interface EventProjectGalleryProps {
  projects: EventProject[];
  autoScrollInterval?: number;
}

interface ImageState {
  projectIndex: number;
  imageIndex: number;
  key: string;
}

function formatCounter(index: number): string {
  return `${String(index + 1).padStart(2, "0")}.`;
}

export function EventProjectGallery({
  projects,
  autoScrollInterval = 1500,
}: EventProjectGalleryProps) {
  const [activeProjectIndex, setActiveProjectIndex] = useState(0);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [previousImage, setPreviousImage] = useState<ImageState | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const transitionTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Use refs to track current values for the interval callback
  const activeProjectIndexRef = useRef(activeProjectIndex);
  const activeImageIndexRef = useRef(activeImageIndex);

  // Keep refs in sync with state
  useEffect(() => {
    activeProjectIndexRef.current = activeProjectIndex;
  }, [activeProjectIndex]);

  useEffect(() => {
    activeImageIndexRef.current = activeImageIndex;
  }, [activeImageIndex]);

  const activeProject = projects[activeProjectIndex];
  const activeImage = activeProject?.images[activeImageIndex];
  const currentImageKey = `${activeProjectIndex}-${activeImageIndex}`;

  // Handle crossfade transition when image changes
  useEffect(() => {
    // Skip on initial render
    if (previousImage === null && !isTransitioning) {
      setPreviousImage({
        projectIndex: activeProjectIndex,
        imageIndex: activeImageIndex,
        key: currentImageKey,
      });
      return;
    }

    // If the image actually changed, trigger transition
    if (previousImage && previousImage.key !== currentImageKey) {
      setIsTransitioning(true);

      // Clear any existing timeout
      if (transitionTimeoutRef.current) {
        clearTimeout(transitionTimeoutRef.current);
      }

      // After transition completes, update previous image
      transitionTimeoutRef.current = setTimeout(() => {
        setPreviousImage({
          projectIndex: activeProjectIndex,
          imageIndex: activeImageIndex,
          key: currentImageKey,
        });
        setIsTransitioning(false);
      }, 300); // Match CSS transition duration
    }

    return () => {
      if (transitionTimeoutRef.current) {
        clearTimeout(transitionTimeoutRef.current);
      }
    };
  }, [activeProjectIndex, activeImageIndex, currentImageKey, previousImage, isTransitioning]);

  // Calculate total images and current global index for navigation
  const totalImages = useMemo(
    () => projects.reduce((sum, p) => sum + p.images.length, 0),
    [projects]
  );

  // Auto-scroll effect - advance through images, switch to next project on last image
  useEffect(() => {
    if (isPaused || totalImages <= 1) return;

    intervalRef.current = setInterval(() => {
      const currentProjectIndex = activeProjectIndexRef.current;
      const currentImageIndex = activeImageIndexRef.current;
      const currentProject = projects[currentProjectIndex];
      const isLastImage = currentImageIndex >= currentProject.images.length - 1;

      if (isLastImage) {
        // Move to next project
        const nextProjectIndex =
          currentProjectIndex >= projects.length - 1 ? 0 : currentProjectIndex + 1;
        setActiveProjectIndex(nextProjectIndex);
        setActiveImageIndex(0);
      } else {
        setActiveImageIndex(currentImageIndex + 1);
      }
    }, autoScrollInterval);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPaused, totalImages, autoScrollInterval, projects]);

  // Reset image index when project changes manually
  const handleProjectClick = (projectIndex: number) => {
    setActiveProjectIndex(projectIndex);
    setActiveImageIndex(0);
  };

  const handlePrevious = () => {
    if (activeImageIndex > 0) {
      // Go to previous image in same project
      setActiveImageIndex((prev) => prev - 1);
    } else {
      // Go to previous project's last image
      const prevProjectIndex =
        activeProjectIndex === 0 ? projects.length - 1 : activeProjectIndex - 1;
      setActiveProjectIndex(prevProjectIndex);
      setActiveImageIndex(projects[prevProjectIndex].images.length - 1);
    }
  };

  const handleNext = () => {
    const currentProject = projects[activeProjectIndex];
    if (activeImageIndex < currentProject.images.length - 1) {
      // Go to next image in same project
      setActiveImageIndex((prev) => prev + 1);
    } else {
      // Go to next project's first image
      setActiveProjectIndex((prev) =>
        prev >= projects.length - 1 ? 0 : prev + 1
      );
      setActiveImageIndex(0);
    }
  };

  // Calculate progress percentage for active project
  const progressPercentage = activeProject
    ? ((activeImageIndex + 1) / activeProject.images.length) * 100
    : 0;

  return (
    <section
      className={styles.gallerySection}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Main Image with Crossfade */}
      <div className={styles.imageContainer}>
        {/* Previous image (stable background) */}
        {isTransitioning && previousImage && (
          <Image
            key={`prev-${previousImage.key}`}
            src={projects[previousImage.projectIndex]?.images[previousImage.imageIndex]?.url || ""}
            alt={projects[previousImage.projectIndex]?.images[previousImage.imageIndex]?.alt || ""}
            fill
            sizes="100vw"
            className={`${styles.backgroundImage} ${styles.imageBase}`}
          />
        )}
        {/* Current image (fades in on top) */}
        {activeImage && (
          <Image
            key={`current-${currentImageKey}`}
            src={activeImage.url}
            alt={activeImage.alt}
            fill
            sizes="100vw"
            className={`${styles.backgroundImage} ${isTransitioning ? styles.imageFadeIn : ""}`}
            priority
          />
        )}
      </div>

      {/* Navigation Arrows */}
      <button
        className={`${styles.navButton} ${styles.navButtonLeft}`}
        onClick={handlePrevious}
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
      <button
        className={`${styles.navButton} ${styles.navButtonRight}`}
        onClick={handleNext}
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

      {/* Project Tabs */}
      <div className={styles.tabsContainer}>
        {projects.map((project, index) => {
          const isActive = index === activeProjectIndex;
          const tabProgressPercentage = isActive ? progressPercentage : 0;

          return (
            <button
              key={project.id}
              className={`${styles.tab} ${isActive ? styles.tabActive : ""}`}
              onClick={() => handleProjectClick(index)}
            >
              <span className={styles.tabCounter}>{formatCounter(index)}</span>
              <div className={styles.tabContent}>
                <h3 className={styles.tabTitle}>{project.title}</h3>
                <p className={styles.tabCategory}>{project.category}</p>
              </div>
              <div
                className={styles.progressIndicator}
                style={{ width: `${tabProgressPercentage}%` }}
              />
            </button>
          );
        })}
      </div>
    </section>
  );
}

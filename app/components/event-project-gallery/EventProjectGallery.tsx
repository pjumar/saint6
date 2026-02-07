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

function formatCounter(index: number): string {
  return `${String(index + 1).padStart(2, "0")}.`;
}

export function EventProjectGallery({
  projects,
  autoScrollInterval = 5000,
}: EventProjectGalleryProps) {
  const [activeProjectIndex, setActiveProjectIndex] = useState(0);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const activeProject = projects[activeProjectIndex];
  const activeImage = activeProject?.images[activeImageIndex];

  // Calculate total images and current global index for navigation
  const totalImages = useMemo(
    () => projects.reduce((sum, p) => sum + p.images.length, 0),
    [projects]
  );

  // Auto-scroll effect - advance through images, switch to next project on last image
  useEffect(() => {
    if (isPaused || totalImages <= 1) return;

    intervalRef.current = setInterval(() => {
      setActiveImageIndex((prevImageIndex) => {
        const currentProject = projects[activeProjectIndex];
        const isLastImage = prevImageIndex >= currentProject.images.length - 1;

        if (isLastImage) {
          // Move to next project
          setActiveProjectIndex((prevProjectIndex) =>
            prevProjectIndex >= projects.length - 1 ? 0 : prevProjectIndex + 1
          );
          return 0; // Reset to first image of next project
        }

        return prevImageIndex + 1;
      });
    }, autoScrollInterval);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPaused, totalImages, autoScrollInterval, projects, activeProjectIndex]);

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
      {/* Main Image */}
      <div className={styles.imageContainer}>
        {activeImage && (
          <Image
            src={activeImage.url}
            alt={activeImage.alt}
            fill
            sizes="100vw"
            className={styles.backgroundImage}
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

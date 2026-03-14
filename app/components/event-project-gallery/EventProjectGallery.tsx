"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ProgressiveImage } from "@/app/components/progressive-image/ProgressiveImage";
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

// Build a flat list of all images across all projects for preloading
function flattenImages(projects: EventProject[]) {
  return projects.flatMap((p, pi) =>
    p.images.map((img, ii) => ({ ...img, projectIndex: pi, imageIndex: ii, key: `${pi}-${ii}` }))
  );
}

export function EventProjectGallery({
  projects,
  autoScrollInterval = 2000,
}: EventProjectGalleryProps) {
  const [activeProjectIndex, setActiveProjectIndex] = useState(0);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isManualMode, setIsManualMode] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const tabsContainerRef = useRef<HTMLDivElement | null>(null);

  // Use refs to track current values for the interval callback
  const activeProjectIndexRef = useRef(activeProjectIndex);
  const activeImageIndexRef = useRef(activeImageIndex);

  useEffect(() => {
    activeProjectIndexRef.current = activeProjectIndex;
  }, [activeProjectIndex]);

  useEffect(() => {
    activeImageIndexRef.current = activeImageIndex;
  }, [activeImageIndex]);

  const activeProject = projects[activeProjectIndex];
  const currentImageKey = `${activeProjectIndex}-${activeImageIndex}`;

  // Flatten all images — they all stay mounted, only opacity changes
  const allImages = useMemo(() => flattenImages(projects), [projects]);

  const totalImages = allImages.length;

  // Auto-scroll the tab bar on mobile when active project changes
  // Use manual scrollLeft instead of scrollIntoView to avoid scrolling the whole page
  useEffect(() => {
    const container = tabsContainerRef.current;
    if (!container) return;
    const activeTab = container.children[activeProjectIndex] as HTMLElement | undefined;
    if (activeTab) {
      const scrollTarget = activeTab.offsetLeft - container.offsetLeft;
      container.scrollTo({ left: scrollTarget, behavior: "smooth" });
    }
  }, [activeProjectIndex]);

  // Auto-scroll effect
  useEffect(() => {
    if (isPaused || isManualMode || totalImages <= 1) return;

    intervalRef.current = setInterval(() => {
      const currentProjectIndex = activeProjectIndexRef.current;
      const currentImageIndex = activeImageIndexRef.current;
      const currentProject = projects[currentProjectIndex];
      const isLastImage = currentImageIndex >= currentProject.images.length - 1;

      if (isLastImage) {
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
  }, [isPaused, isManualMode, totalImages, autoScrollInterval, projects]);

  const handleProjectClick = (projectIndex: number) => {
    setIsManualMode(true);
    setActiveProjectIndex(projectIndex);
    setActiveImageIndex(0);
  };

  const handlePrevious = () => {
    setIsManualMode(true);
    if (activeImageIndex > 0) {
      setActiveImageIndex((prev) => prev - 1);
    } else {
      const prevProjectIndex =
        activeProjectIndex === 0 ? projects.length - 1 : activeProjectIndex - 1;
      setActiveProjectIndex(prevProjectIndex);
      setActiveImageIndex(projects[prevProjectIndex].images.length - 1);
    }
  };

  const handleNext = () => {
    setIsManualMode(true);
    const currentProject = projects[activeProjectIndex];
    if (activeImageIndex < currentProject.images.length - 1) {
      setActiveImageIndex((prev) => prev + 1);
    } else {
      setActiveProjectIndex((prev) =>
        prev >= projects.length - 1 ? 0 : prev + 1
      );
      setActiveImageIndex(0);
    }
  };

  const progressPercentage = activeProject
    ? ((activeImageIndex + 1) / activeProject.images.length) * 100
    : 0;

  return (
    <section
      className={styles.gallerySection}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* All images stay mounted — active one gets opacity 1, others get opacity 0 */}
      <div className={styles.imageContainer}>
        {allImages.map((img) => (
          <ProgressiveImage
            key={img.key}
            src={img.url}
            alt={img.alt}
            fill
            sizes="100vw"
            className={`${styles.backgroundImage} ${img.key === currentImageKey ? styles.imageActive : styles.imageInactive}`}
          />
        ))}
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
      <div ref={tabsContainerRef} className={styles.tabsContainer}>
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

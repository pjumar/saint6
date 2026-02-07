"use client";

import Image from "next/image";
import { useState } from "react";
import { SectionHeader } from "@/app/components/section-header/SectionHeader";
import { useTranslation } from "@/app/contexts/TranslationContext";
import {
  useScrollAnimation,
  useScrollAnimationChildren,
} from "@/app/hooks";
import styles from "./KeyProjectSection.module.css";

export interface ProjectTeamMember {
  role: string;
  name: string;
}

export interface ProjectImage {
  src: string;
  alt: string;
  width: number;
  height: number;
}

export interface KeyProjectData {
  projectNumber: string;
  title: string;
  infoText: string;
  team: ProjectTeamMember[];
  expertise: string[];
  client: string;
  mainImage: ProjectImage;
  testimonial?: {
    quote: string;
    author: string;
    role: string;
  };
  galleryImages: ProjectImage[];
}

interface KeyProjectSectionProps {
  projects: KeyProjectData[];
}

const PLACEHOLDER_SRC = "/images/placeholder.svg";

function ProjectItem({ project }: { project: KeyProjectData }) {
  const { t } = useTranslation();
  const [mainImageError, setMainImageError] = useState(false);
  const [galleryErrors, setGalleryErrors] = useState<Set<string>>(new Set());

  const headerRef = useScrollAnimation<HTMLDivElement>({ type: "fadeUp" });
  const mainImageRef = useScrollAnimation<HTMLDivElement>({
    type: "scale",
    duration: 0.8,
  });
  const galleryRef = useScrollAnimationChildren<HTMLDivElement>({
    type: "scaleRotate",
    stagger: 0.15,
    duration: 0.6,
  });

  const handleMainImageError = () => {
    setMainImageError(true);
  };

  const handleGalleryError = (src: string) => {
    setGalleryErrors((prev) => new Set(prev).add(src));
  };

  const getMainImageSrc = () => {
    return mainImageError ? PLACEHOLDER_SRC : project.mainImage.src;
  };

  const getGalleryImageSrc = (image: ProjectImage) => {
    return galleryErrors.has(image.src) ? PLACEHOLDER_SRC : image.src;
  };

  return (
    <div className={styles.projectItem}>
      <div ref={headerRef} className={styles.projectHeader}>
        <div className={styles.projectNumber}>
          <p className={styles.projectNoLabel}>{t.KEY_PROJECT.PROJECT_NO}</p>
          <p className={styles.projectNoValue}>{project.projectNumber}</p>
        </div>

        <div className={styles.projectContent}>
          <h2 className={styles.projectTitle}>{project.title}</h2>

          <div className={styles.projectDetails}>
            <div className={styles.infoSection}>
              <div className={styles.sectionLabel}>{t.KEY_PROJECT.INFO}</div>
              <p className={styles.infoText}>{project.infoText}</p>
            </div>

            <div className={styles.ekipSection}>
              <div className={styles.sectionLabel}>{t.KEY_PROJECT.EKIP}</div>
              <div className={styles.ekipList}>
                {project.team.map((member) => (
                  <p key={`${member.role}-${member.name}`}>
                    {member.role} : {member.name}
                  </p>
                ))}
              </div>
            </div>

            <div className={styles.expertiseClientRow}>
              <div className={styles.expertiseSection}>
                <div className={styles.sectionLabel}>
                  {t.KEY_PROJECT.EXPERTISE}
                </div>
                <div className={styles.expertiseList}>
                  {project.expertise.map((item) => (
                    <p key={item}>{item}</p>
                  ))}
                </div>
              </div>

              <div className={styles.clientSection}>
                <div className={styles.sectionLabel}>
                  {t.KEY_PROJECT.CLIENT}
                </div>
                <p className={styles.clientName}>{project.client}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.contentGrid}>
        <div ref={mainImageRef} className={styles.mainImageContainer}>
          <Image
            src={getMainImageSrc()}
            alt={project.mainImage.alt}
            width={project.mainImage.width}
            height={project.mainImage.height}
            className={styles.mainImage}
            onError={handleMainImageError}
          />
        </div>

        <div className={styles.infoTextSection}>
          <div className={styles.infoLabel}>{t.KEY_PROJECT.INFO}</div>
          <p className={styles.infoText}>{project.infoText}</p>
        </div>

        {project.testimonial && (
          <div className={styles.testimonialContent}>
            <div className={styles.testimonialQuote}>
              <Image
                src="/images/icons/quote-mark.svg"
                alt=""
                width={36}
                height={32}
                className={styles.quoteMark}
              />
              <p className={styles.quoteText}>{project.testimonial.quote}</p>
            </div>
            <div className={styles.testimonialAuthor}>
              <div className={styles.authorLine}>
                <div className={styles.authorLineDecoration} />
                <p className={styles.authorName}>
                  {project.testimonial.author}
                </p>
              </div>
              <p className={styles.authorRole}>{project.testimonial.role}</p>
            </div>
          </div>
        )}

        {project.galleryImages.length > 0 && (
          <div ref={galleryRef} className={styles.galleryGrid}>
            {project.galleryImages.slice(0, 3).map((image, index) => (
              <div key={image.src} className={styles[`galleryImage${index + 1}`]}>
                <Image
                  src={getGalleryImageSrc(image)}
                  alt={image.alt}
                  width={image.width}
                  height={image.height}
                  className={styles.galleryImage}
                  onError={() => handleGalleryError(image.src)}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export function KeyProjectSection({ projects }: KeyProjectSectionProps) {
  const { t } = useTranslation();

  if (projects.length === 0) return null;

  return (
    <div className={styles.keyProjectWrapper}>
      <SectionHeader
        label={t.KEY_PROJECT.CAPTION}
        title={t.KEY_PROJECT.HEADING}
        textAlign="center"
        spiralPosition="center"
      />

      <section className={styles.keyProjectSection}>
        {projects.map((project) => (
          <ProjectItem key={project.title} project={project} />
        ))}
      </section>
    </div>
  );
}

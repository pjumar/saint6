"use client";

import { useState } from "react";
import Image from "next/image";
import { useTranslation } from "@/app/contexts/TranslationContext";
import { SectionHeader } from "@/app/components/section-header/SectionHeader";
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
  project: KeyProjectData;
}

const PLACEHOLDER_SRC = "/images/placeholder.svg";

export function KeyProjectSection({ project }: KeyProjectSectionProps) {
  const { t } = useTranslation();
  const [mainImageError, setMainImageError] = useState(false);
  const [galleryErrors, setGalleryErrors] = useState<Set<number>>(new Set());

  const handleMainImageError = () => {
    setMainImageError(true);
  };

  const handleGalleryError = (index: number) => {
    setGalleryErrors((prev) => new Set(prev).add(index));
  };

  const getMainImageSrc = () => {
    return mainImageError ? PLACEHOLDER_SRC : project.mainImage.src;
  };

  const getGalleryImageSrc = (image: ProjectImage, index: number) => {
    return galleryErrors.has(index) ? PLACEHOLDER_SRC : image.src;
  };

  return (
    <div className={styles.keyProjectWrapper}>
      <SectionHeader
        label={t.KEY_PROJECT.CAPTION}
        title={t.KEY_PROJECT.HEADING}
        textAlign="center"
        spiralPosition="center"
      />

      <section className={styles.keyProjectSection}>
        <div className={styles.projectHeader}>
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
                {project.team.map((member, index) => (
                  <p key={index}>
                    {member.role} : {member.name}
                  </p>
                ))}
              </div>
            </div>

            <div className={styles.expertiseClientRow}>
              <div className={styles.expertiseSection}>
                <div className={styles.sectionLabel}>{t.KEY_PROJECT.EXPERTISE}</div>
                <div className={styles.expertiseList}>
                  {project.expertise.map((item, index) => (
                    <p key={index}>{item}</p>
                  ))}
                </div>
              </div>

              <div className={styles.clientSection}>
                <div className={styles.sectionLabel}>{t.KEY_PROJECT.CLIENT}</div>
                <p className={styles.clientName}>{project.client}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.contentGrid}>
        <div className={styles.mainImageContainer}>
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
              <p className={styles.quoteMark}>"</p>
              <p className={styles.quoteText}>{project.testimonial.quote}</p>
            </div>
            <div className={styles.testimonialAuthor}>
              <div className={styles.authorLine}>
                <div className={styles.authorLineDecoration} />
                <p className={styles.authorName}>{project.testimonial.author}</p>
              </div>
              <p className={styles.authorRole}>{project.testimonial.role}</p>
            </div>
          </div>
        )}

        {project.galleryImages.length > 0 && (
          <div className={styles.galleryGrid}>
            {project.galleryImages.slice(0, 3).map((image, index) => (
              <div key={index} className={styles[`galleryImage${index + 1}`]}>
                <Image
                  src={getGalleryImageSrc(image, index)}
                  alt={image.alt}
                  width={image.width}
                  height={image.height}
                  className={styles.galleryImage}
                  onError={() => handleGalleryError(index)}
                />
              </div>
            ))}
          </div>
        )}
      </div>
      </section>
    </div>
  );
}

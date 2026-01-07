"use client";

import Image from "next/image";
import { useTranslation } from "@/app/contexts/TranslationContext";
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

export function KeyProjectSection({ project }: KeyProjectSectionProps) {
  const { t } = useTranslation();
  
  return (
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
      
      <div className={styles.projectImages}>
        <div className={styles.mainImageContainer}>
          <Image
            src={project.mainImage.src}
            alt={project.mainImage.alt}
            width={project.mainImage.width}
            height={project.mainImage.height}
            className={styles.mainImage}
          />
        </div>
        
        <div className={styles.testimonialGallerySection}>
          {project.testimonial && (
            <div className={styles.testimonialContent}>
              <div className={styles.testimonialQuote}>
                <p className={styles.quoteMark}>"</p>
                <p className={styles.quoteText}>{project.testimonial.quote}</p>
              </div>
              <div className={styles.testimonialAuthor}>
                <div className={styles.authorLine}>
                  <Image
                    src="/images/project/testimonial-line.svg"
                    alt=""
                    width={39}
                    height={1}
                    className={styles.authorLineImage}
                  />
                  <p className={styles.authorName}>{project.testimonial.author}</p>
                </div>
                <p className={styles.authorRole}>{project.testimonial.role}</p>
              </div>
            </div>
          )}
          
          {project.galleryImages.length > 0 && (
            <div className={styles.galleryGrid}>
              <div className={styles.galleryImageLarge}>
                <Image
                  src={project.galleryImages[0].src}
                  alt={project.galleryImages[0].alt}
                  width={project.galleryImages[0].width}
                  height={project.galleryImages[0].height}
                  className={styles.galleryImage}
                />
              </div>
              {project.galleryImages.length > 1 && (
                <div className={styles.galleryImagesSmall}>
                  {project.galleryImages.slice(1, 3).map((image, index) => (
                    <div key={index} className={styles.galleryImageSmall}>
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
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

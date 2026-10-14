import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import { projectThumbnail } from "@/app/lib/styling/project-thumbnails";
import type { StylingLocale, StylingProject } from "@/app/lib/styling/types";
import styles from "./Styling.module.css";

export function Paragraphs({ text }: { text: string }) {
  return (
    <>
      {text.split(/\n\n+/).map((paragraph) => (
        <p key={paragraph}>{paragraph}</p>
      ))}
    </>
  );
}
export function ProjectCard({
  project,
  locale,
  imageSizes = "(max-width: 600px) 100vw, 50vw",
  priority = false,
  uniformImage = false,
}: {
  project: StylingProject;
  locale: StylingLocale;
  imageSizes?: string;
  priority?: boolean;
  uniformImage?: boolean;
}) {
  const { image, fit, background, ratio } = projectThumbnail(project);
  return (
    <Link
      className={styles.projectCard}
      href={`/${locale}/styling/${project.slug}`}
      prefetch={false}
    >
      <div
        className={`${styles.cardImage} ${uniformImage ? styles.uniformCardImage : ""}`}
        style={
          uniformImage
            ? { background }
            : ({
                aspectRatio: fit ? "4 / 5" : `${image.width} / ${image.height}`,
                "--card-ratio": ratio,
                background,
              } as CSSProperties)
        }
      >
        <Image
          src={image.url}
          alt={image.alternativeText}
          fill
          sizes={imageSizes}
          priority={priority}
          style={fit ? { objectFit: fit } : undefined}
        />
      </div>
      <div className={styles.cardInfo}>
        <p className={styles.label}>{project.category}</p>
        <h3>
          {project.title}
          <span aria-hidden="true">↗</span>
        </h3>
        <p>{project.summary}</p>
      </div>
    </Link>
  );
}

import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
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
}: {
  project: StylingProject;
  locale: StylingLocale;
  imageSizes?: string;
  priority?: boolean;
}) {
  return (
    <Link
      className={styles.projectCard}
      href={`/${locale}/styling/${project.slug}`}
    >
      <div
        className={styles.cardImage}
        style={
          {
            aspectRatio: `${project.cover.width} / ${project.cover.height}`,
            "--card-ratio": project.cover.width / project.cover.height,
          } as CSSProperties
        }
      >
        <Image
          src={project.cover.url}
          alt={project.cover.alternativeText}
          fill
          sizes={imageSizes}
          priority={priority}
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

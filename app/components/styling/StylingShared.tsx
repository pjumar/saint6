import Image from "next/image";
import Link from "next/link";
import type {
  StylingLocale,
  StylingPage,
  StylingProject,
} from "@/app/lib/styling/types";
import styles from "./Styling.module.css";
import { StylingContactLinks } from "./StylingContactLinks";

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
        style={{
          aspectRatio: `${project.cover.width} / ${project.cover.height}`,
        }}
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
export function StylingEnquiry({
  page,
  locale,
}: {
  page: StylingPage;
  locale: StylingLocale;
}) {
  const vi = locale === "vi";
  return (
    <section
      className={styles.enquiry}
      id="enquiry"
      aria-labelledby="styling-enquiry-heading"
    >
      <div className={styles.container}>
        <p className={styles.label}>
          {vi ? "BẮT ĐẦU CUỘC TRÒ CHUYỆN" : "START A CONVERSATION"}
        </p>
        <h2 id="styling-enquiry-heading">{page.contact_title}</h2>
        <p>{page.contact_text}</p>
        <div className={styles.actions}>
          <Link href={`/${locale}/contact`} className={styles.button}>
            {vi ? "Gửi yêu cầu" : "Send your brief"}
            <span aria-hidden="true">↗</span>
          </Link>
          <StylingContactLinks locale={locale} />
        </div>
      </div>
    </section>
  );
}

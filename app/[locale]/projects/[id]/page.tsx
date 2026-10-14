import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ContactSection } from "@/app/components/contact-section/ContactSection";
import { HeroSection } from "@/app/components/hero-section/HeroSection";
import {
  getPortfolioProjects,
  serviceCategories,
  translatedProject,
} from "@/app/lib/portfolio/content";
import type { StylingLocale } from "@/app/lib/styling/types";
import styles from "./ProjectDetail.module.css";

type Props = { params: Promise<{ locale: string; id: string }> };
export const revalidate = 3600;

async function content(params: Props["params"]) {
  const { locale, id } = await params;
  if (locale !== "en" && locale !== "vi") notFound();
  const otherLocale = locale === "en" ? "vi" : "en";
  const [projects, otherProjects] = await Promise.all([
    getPortfolioProjects(locale),
    getPortfolioProjects(otherLocale),
  ]);
  const project = projects.find(
    (entry) => entry.id === id && !entry.id.startsWith("styling-"),
  );
  if (!project) notFound();
  const alternate = translatedProject(project, otherProjects);
  return { locale: locale as StylingLocale, project, projects, alternate };
}

export async function generateMetadata({ params }: Props) {
  const { locale, project, alternate } = await content(params);
  const title = project.seoTitle?.trim() || `${project.title} | Saint 6 Studio`;
  const summary = project.summary.trim().replace(/\s+/g, " ");
  const shortSummary =
    summary.length > 160
      ? `${summary.slice(0, 159).replace(/\s+\S*$/, "")}…`
      : summary;
  const services = project.services
    .map((service) => serviceCategories[service][locale])
    .join(", ");
  const description =
    project.seoDescription?.trim() ||
    shortSummary ||
    (locale === "vi"
      ? `Khám phá dự án ${project.title}${services ? ` thuộc mảng ${services}` : ""} của Saint 6 Studio.`
      : `Explore ${project.title}${services ? ` — ${services}` : ""} by Saint 6 Studio.`);
  const url = `https://www.saint6.studio${project.href}`;
  return {
    title: { absolute: title },
    description,
    alternates: {
      canonical: url,
      ...(alternate
        ? {
            languages: {
              [locale]: url,
              [locale === "en" ? "vi" : "en"]:
                `https://www.saint6.studio${alternate.href}`,
            },
          }
        : {}),
    },
    openGraph: {
      type: "website",
      title,
      description,
      url,
      locale: locale === "vi" ? "vi_VN" : "en_US",
      siteName: "Saint 6 Studio",
      images: [{ url: project.image, alt: project.imageAlt }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [project.image],
    },
  };
}

export default async function ProjectDetailPage({ params }: Props) {
  const { locale, project, projects, alternate } = await content(params);
  const vi = locale === "vi";
  const languageHref = alternate?.href || `/${vi ? "en" : "vi"}/portfolio`;
  const images = project.images?.length
    ? project.images
    : [{ url: project.image, alt: project.imageAlt, width: 1200, height: 800 }];
  const related = projects
    .filter(
      (entry) =>
        entry.id !== project.id &&
        entry.services.some((service) => project.services.includes(service)),
    )
    .slice(0, 3);

  return (
    <>
      <main className={styles.page}>
        <HeroSection
          heading={project.title}
          backgroundImage={project.image}
          backgroundAlt={project.imageAlt}
          languageHref={languageHref}
          showScrollIndicator
        />
        <div className={styles.container}>
          <nav
            className={styles.breadcrumbs}
            aria-label={vi ? "Đường dẫn" : "Breadcrumb"}
          >
            <Link href={`/${locale}`}>Saint 6</Link>
            <span aria-hidden="true">/</span>
            <Link href={`/${locale}/portfolio`}>
              {vi ? "Dự án" : "Portfolio"}
            </Link>
            <span aria-hidden="true">/</span>
            <span aria-current="page">{project.title}</span>
          </nav>
          <section className={styles.intro}>
            <div>
              <p className={styles.label}>{project.category}</p>
              <h2>{project.title}</h2>
              <div className={styles.services}>
                {project.services.map((service) => (
                  <span key={service}>
                    {serviceCategories[service][locale]}
                  </span>
                ))}
              </div>
            </div>
            <div className={styles.copy}>
              {project.summary && (
                <p className={styles.lead}>{project.summary}</p>
              )}
              {project.body &&
                project.body !== project.summary &&
                project.body
                  .split(/\n\n+/)
                  .map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              {project.client && (
                <p>
                  {vi ? "Khách hàng" : "Client"}: {project.client}
                </p>
              )}
            </div>
          </section>
          <section
            className={styles.gallery}
            aria-label={vi ? "Hình ảnh dự án" : "Project images"}
          >
            {images.map((image) => (
              <figure key={image.url}>
                <Image
                  src={image.url}
                  alt={image.alt}
                  width={image.width}
                  height={image.height}
                  sizes="(max-width: 700px) 100vw, 80vw"
                />
              </figure>
            ))}
          </section>
          {!!project.credits?.length && (
            <section className={styles.credits}>
              <h2>{vi ? "Ê-kíp" : "Project credits"}</h2>
              <dl>
                {project.credits.map(({ role, name }) => (
                  <div className={styles.creditRow} key={`${role}-${name}`}>
                    <dt>{role}</dt>
                    <dd>{name}</dd>
                  </div>
                ))}
              </dl>
            </section>
          )}
          {!!related.length && (
            <section className={styles.related}>
              <h2>{vi ? "Khám phá thêm" : "More projects"}</h2>
              <div className={styles.relatedGrid}>
                {related.map((entry) => (
                  <Link key={entry.id} href={entry.href} prefetch={false}>
                    <Image
                      src={entry.image}
                      alt={entry.imageAlt}
                      width={480}
                      height={320}
                    />
                    <span>{entry.title} ↗</span>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
      <ContactSection backgroundImageUrl="/images/contact-section-bg.webp" />
    </>
  );
}

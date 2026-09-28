import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ContactSection } from "@/app/components/contact-section/ContactSection";
import { HeroSection } from "@/app/components/hero-section/HeroSection";
import styles from "@/app/components/styling/Styling.module.css";
import { StylingProjectHero } from "@/app/components/styling/StylingProjectHero";
import {
  Paragraphs,
  ProjectCard,
} from "@/app/components/styling/StylingShared";
import { StylingVideo } from "@/app/components/styling/StylingVideo";
import {
  getStylingContent,
  stylingEnabled,
  stylingOrigin,
} from "@/app/lib/styling/content";
import { StylingStructuredData, stylingMetadata } from "@/app/lib/styling/seo";
import { youtubeVideoId } from "@/app/lib/styling/video";

type Props = { params: Promise<{ locale: string; slug: string }> };
export const revalidate = 300;
export async function generateStaticParams() {
  if (!stylingEnabled) return [];
  const entries = await Promise.all(
    (["en", "vi"] as const).map(async (locale) =>
      (await getStylingContent(locale)).projects.map(({ slug }) => ({
        locale,
        slug,
      })),
    ),
  );
  return entries.flat();
}
async function content(params: Props["params"]) {
  const { locale, slug } = await params;
  if (!stylingEnabled || (locale !== "en" && locale !== "vi")) notFound();
  const data = await getStylingContent(locale);
  const project = data.projects.find((item) => item.slug === slug);
  if (!project) notFound();
  return { ...data, locale, project } as const;
}
export async function generateMetadata({ params }: Props) {
  const { locale, project } = await content(params);
  return stylingMetadata(
    locale,
    `/${project.slug}`,
    project.seo_title,
    project.seo_description,
    project.cover,
  );
}
export default async function StylingProjectPage({ params }: Props) {
  const { projects, project, locale } = await content(params);
  const vi = locale === "vi";
  const videoId = youtubeVideoId(project.video_url);
  const videoPoster =
    project.gallery.find(({ image }) => image.width / image.height >= 1.4)
      ?.image || project.cover;
  const gallery = videoId
    ? project.gallery.filter(({ image }) => image.url !== videoPoster.url)
    : project.gallery;
  const index = projects.findIndex((item) => item.slug === project.slug);
  const related = [
    projects[(index + 1) % projects.length],
    projects[(index + 2) % projects.length],
  ].filter(
    (item, n, all) =>
      item.slug !== project.slug &&
      all.findIndex((p) => p.slug === item.slug) === n,
  );
  const url = `${stylingOrigin}/${locale}/styling/${project.slug}`;
  return (
    <>
      <div className={styles.page}>
        <StylingStructuredData
          value={{
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "CreativeWork",
                name: project.title,
                description: project.summary,
                url,
                image: project.gallery.map(
                  ({ image }) => new URL(image.url, stylingOrigin).href,
                ),
                contributor: {
                  "@type": "Person",
                  name: "Trần Hoài Trang",
                  jobTitle: "Stylist",
                  url: `${stylingOrigin}/${locale}/styling#stylist`,
                },
                creditText: project.credits
                  .map(({ role, name }) => `${role}: ${name}`)
                  .join("; "),
                inLanguage: locale,
              },
              {
                "@type": "BreadcrumbList",
                itemListElement: [
                  {
                    "@type": "ListItem",
                    position: 1,
                    name: "Saint 6",
                    item: `${stylingOrigin}/${locale}`,
                  },
                  {
                    "@type": "ListItem",
                    position: 2,
                    name: "Styling",
                    item: `${stylingOrigin}/${locale}/styling`,
                  },
                  {
                    "@type": "ListItem",
                    position: 3,
                    name: project.title,
                    item: url,
                  },
                ],
              },
            ],
          }}
        />
        <HeroSection
          heading={project.title}
          backgroundImage={project.cover.url}
          backgroundAlt={project.cover.alternativeText}
          backgroundContent={<StylingProjectHero project={project} />}
          showScrollIndicator
        />
        <div className={styles.container}>
          <nav
            className={styles.breadcrumbs}
            aria-label={vi ? "Đường dẫn" : "Breadcrumb"}
          >
            <Link href={`/${locale}`}>Saint 6</Link>
            <span aria-hidden="true">/</span>
            <Link href={`/${locale}/styling`}>Styling</Link>
            <span aria-hidden="true">/</span>
            <span aria-current="page">{project.title}</span>
          </nav>
        </div>
        <section
          className={`${styles.container} ${styles.projectIntro}`}
          aria-labelledby="project-summary"
        >
          <div>
            <p className={styles.label}>{project.category}</p>
            <h2 id="project-summary">{project.summary}</h2>
          </div>
          <div className={styles.prose}>
            <Paragraphs text={project.body} />
            <p className={styles.stylistCredit}>
              {vi ? "Styling bởi" : "Styled by"}{" "}
              <strong>Trần Hoài Trang</strong>
            </p>
          </div>
        </section>
        {videoId && (
          <StylingVideo
            videoId={videoId}
            title={project.title}
            locale={locale}
            poster={videoPoster}
          />
        )}
        {gallery.length > 0 && (
          <section
            className={`${styles.container} ${styles.gallery}`}
            aria-label={vi ? "Hình ảnh dự án" : "Project gallery"}
          >
            {gallery.map(({ image, alt }) => (
              <figure key={image.url}>
                <Image
                  src={image.url}
                  alt={alt || image.alternativeText}
                  width={image.width}
                  height={image.height}
                  sizes="(max-width: 600px) 100vw, 50vw"
                  style={{ maxWidth: image.width }}
                />
              </figure>
            ))}
          </section>
        )}
        <section
          className={`${styles.container} ${styles.credits}`}
          aria-labelledby="project-credits"
        >
          <div>
            <p className={styles.label}>{vi ? "Ê-KÍP" : "THE COLLABORATORS"}</p>
            <h2 id="project-credits">
              {vi ? "Thông tin dự án" : "Project credits"}
            </h2>
          </div>
          <div>
            <dl>
              {project.credits.map(({ role, name }) => (
                <div key={`${role}-${name}`}>
                  <dt>{role}</dt>
                  <dd>{name}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>
        {related.length > 0 && (
          <section
            className={`${styles.container} ${styles.related}`}
            aria-labelledby="more-styling"
          >
            <div className={styles.sectionTop}>
              <h2 id="more-styling">
                {vi ? "Khám phá thêm" : "More perspectives"}
              </h2>
              <Link
                href={`/${locale}/styling/projects`}
                className={styles.textLink}
              >
                {vi ? "Tất cả dự án" : "All styling projects"} ↗
              </Link>
            </div>
            <div className={styles.projectGrid}>
              {related.map((item) => (
                <ProjectCard key={item.slug} project={item} locale={locale} />
              ))}
            </div>
          </section>
        )}
      </div>
      <div className={styles.contactForm} id="enquiry">
        <ContactSection backgroundImageUrl="/images/contact-section-bg.webp" />
      </div>
    </>
  );
}

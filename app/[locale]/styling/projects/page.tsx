import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ContactSection } from "@/app/components/contact-section/ContactSection";
import styles from "@/app/components/styling/Styling.module.css";
import { ProjectCard } from "@/app/components/styling/StylingShared";
import {
  getStylingPage,
  getStylingProjectSummaries,
  stylingEnabled,
  stylingIsPublic,
} from "@/app/lib/styling/content";
import {
  portfolioCategories,
  portfolioHref,
  portfolioResults,
} from "@/app/lib/styling/portfolio";
import { stylingMetadata } from "@/app/lib/styling/seo";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};
async function content({ params, searchParams }: Props) {
  const { locale } = await params;
  if (!stylingEnabled || (locale !== "en" && locale !== "vi")) notFound();
  const values = await searchParams;
  const single = (key: string) =>
    typeof values[key] === "string" ? (values[key] as string) : "";
  const category = Object.hasOwn(portfolioCategories, single("category"))
    ? single("category")
    : "";
  const query = single("q").trim().slice(0, 120);
  const [pageContent, projects] = await Promise.all([
    getStylingPage(locale),
    getStylingProjectSummaries(locale),
  ]);
  return {
    locale,
    pageContent,
    all: projects,
    category,
    query,
    ...portfolioResults(projects, category, query, single("page")),
  } as const;
}
export async function generateMetadata(props: Props) {
  const data = await content(props);
  const vi = data.locale === "vi";
  const path = portfolioHref(data.locale, data.category, data.query, data.page)
    .replace(`/${data.locale}/styling`, "")
    .split("#")[0];
  const categoryLabel =
    portfolioCategories[data.category as keyof typeof portfolioCategories]?.[
      data.locale
    ];
  const pageLabel =
    data.page > 1 ? ` · ${vi ? "Trang" : "Page"} ${data.page}` : "";
  const meta = stylingMetadata(
    data.locale,
    path,
    `${categoryLabel || (vi ? "Portfolio Styling" : "Our Styling Portfolio")}${pageLabel} | Saint 6`,
    vi
      ? `${categoryLabel ? `${categoryLabel}: ` : ""}Khám phá portfolio styling của chúng tôi tại Saint 6. Styling bởi Trần Hoài Trang.${data.page > 1 ? ` Trang ${data.page}.` : ""}`
      : `${categoryLabel ? `${categoryLabel}: ` : ""}Explore our styling portfolio at Saint 6 across advertising, celebrity, fashion and music. Styling by Trần Hoài Trang.${data.page > 1 ? ` Page ${data.page}.` : ""}`,
    data.pageContent.hero_image,
    data.pageContent.social_image,
    data.pageContent.social_image_alt,
  );
  if (data.query) meta.robots = { index: false, follow: stylingIsPublic };
  return meta;
}
export default async function StylingPortfolio(props: Props) {
  const { locale, all, category, query, projects, total, totalPages, page } =
    await content(props);
  const vi = locale === "vi";
  const href = (nextPage: number) =>
    portfolioHref(locale, category, query, nextPage);
  const pages = [...new Set([1, page - 1, page, page + 1, totalPages])]
    .filter((n) => n >= 1 && n <= totalPages)
    .sort((a, b) => a - b);
  return (
    <>
      <div className={styles.page}>
        <div className={styles.archiveBar}>
          <div className={styles.container}>
            <Link href={`/${locale}`} aria-label="Saint 6">
              <Image
                src="/assets/saint6-logo.svg"
                alt="Saint 6"
                width={96}
                height={48}
                style={{ width: 96, height: "auto" }}
              />
            </Link>
            <Link href={`/${locale}/styling`}>
              ← {vi ? "DỊCH VỤ STYLING" : "STYLING AT SAINT 6"}
            </Link>
            <Link
              href={portfolioHref(vi ? "en" : "vi", category, query, page)}
              hrefLang={vi ? "en" : "vi"}
            >
              {vi ? "EN" : "VI"}
            </Link>
          </div>
        </div>
        <section className={`${styles.container} ${styles.archiveHeading}`}>
          <p className={styles.label}>
            SAINT 6 / {vi ? "PORTFOLIO CỦA CHÚNG TÔI" : "OUR PORTFOLIO"}
          </p>
          <h1>
            {vi
              ? "Mỗi hình ảnh, một câu chuyện."
              : "Every image, a different story."}
          </h1>
          <p>
            {vi
              ? "Từ chiến dịch thương hiệu và lookbook đến nghệ sĩ, âm nhạc và những dấu ấn cá nhân. Khám phá các dự án qua từng góc nhìn."
              : "Brand campaigns, lookbooks, artists, music and personal expression. Explore the work, one perspective at a time."}
          </p>
        </section>
        <section
          className={styles.container}
          id="portfolio-results"
          aria-label={vi ? "Các dự án styling" : "Styling projects"}
        >
          <h2 className={styles.visuallyHidden}>
            {vi ? "Các dự án styling" : "Styling projects"}
          </h2>
          <div className={styles.archiveControls}>
            <nav
              className={styles.filters}
              aria-label={vi ? "Thể loại dự án" : "Project categories"}
            >
              <Link
                href={portfolioHref(locale, "", query)}
                aria-current={!category ? "page" : undefined}
              >
                {vi ? "Tất cả" : "All work"} ({all.length})
              </Link>
              {Object.entries(portfolioCategories).map(([key, label]) => (
                <Link
                  key={key}
                  href={portfolioHref(locale, key, query)}
                  aria-current={category === key ? "page" : undefined}
                >
                  {label[locale]}
                </Link>
              ))}
            </nav>
            <form
              className={styles.search}
              action={`/${locale}/styling/projects#portfolio-results`}
              method="get"
            >
              {category && (
                <input type="hidden" name="category" value={category} />
              )}
              <input
                name="q"
                type="search"
                defaultValue={query}
                maxLength={120}
                aria-label={
                  vi
                    ? "Tìm theo tên, nghệ sĩ, thương hiệu"
                    : "Search projects, artists or brands"
                }
                placeholder={
                  vi
                    ? "Tìm tên, nghệ sĩ, thương hiệu"
                    : "Project, artist or brand"
                }
              />
              <button type="submit">{vi ? "Tìm" : "Search"}</button>
            </form>
          </div>
          <p className={styles.portfolioNote}>
            {total} {vi ? "dự án" : "projects"} · {vi ? "Trang" : "Page"} {page}
            /{totalPages}
            {query && (
              <>
                {" "}
                · “{query}” ·{" "}
                <Link href={portfolioHref(locale, category)}>
                  {vi ? "Xóa tìm kiếm" : "Clear search"}
                </Link>
              </>
            )}
          </p>
          {projects.length ? (
            <div className={styles.archiveGrid}>
              {projects.map((project, index) => (
                <ProjectCard
                  key={project.slug}
                  project={project}
                  locale={locale}
                  priority={index === 0}
                  imageSizes="(max-width: 600px) 100vw, (max-width: 900px) 50vw, 33vw"
                />
              ))}
            </div>
          ) : (
            <p>
              {vi
                ? "Không tìm thấy dự án phù hợp. Hãy thử tên khác hoặc chọn tất cả dự án."
                : "No matching projects. Try another name or choose all work."}
            </p>
          )}
          <nav
            className={styles.pagination}
            aria-label={vi ? "Phân trang dự án" : "Portfolio pagination"}
          >
            {page > 1 && (
              <Link href={href(page - 1)} rel="prev">
                ← {vi ? "Trước" : "Previous"}
              </Link>
            )}
            {pages.map((n, i) => (
              <span key={n}>
                {i > 0 && n - pages[i - 1] > 1 && (
                  <span aria-hidden="true">…</span>
                )}
                <Link
                  href={href(n)}
                  aria-current={page === n ? "page" : undefined}
                  aria-label={`${vi ? "Trang" : "Page"} ${n}`}
                >
                  {n}
                </Link>
              </span>
            ))}
            {page < totalPages && (
              <Link href={href(page + 1)} rel="next">
                {vi ? "Tiếp" : "Next"} →
              </Link>
            )}
          </nav>
        </section>
      </div>
      <div className={styles.contactForm} id="enquiry">
        <ContactSection backgroundImageUrl="/images/contact-section-bg.webp" />
      </div>
    </>
  );
}

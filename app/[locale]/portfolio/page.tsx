import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ContactSection } from "@/app/components/contact-section/ContactSection";
import {
  getPortfolioProjects,
  portfolioHref,
  portfolioResults,
  serviceCategories,
} from "@/app/lib/portfolio/content";
import type { StylingLocale } from "@/app/lib/styling/types";
import styles from "./Portfolio.module.css";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

async function content({ params, searchParams }: Props) {
  const { locale: rawLocale } = await params;
  if (rawLocale !== "en" && rawLocale !== "vi") notFound();
  const locale: StylingLocale = rawLocale;
  const values = await searchParams;
  const single = (key: string) =>
    typeof values[key] === "string" ? (values[key] as string) : "";
  const category = Object.hasOwn(serviceCategories, single("category"))
    ? single("category")
    : "";
  const query = single("q").trim().slice(0, 120);
  const all = await getPortfolioProjects(locale);
  return {
    locale,
    all,
    category,
    query,
    ...portfolioResults(all, category, query, single("page")),
  };
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { locale, category, query, page } = await content(props);
  const vi = locale === "vi";
  const title = `${vi ? "Portfolio dự án" : "Our portfolio"}${category ? ` · ${serviceCategories[category as keyof typeof serviceCategories][locale]}` : ""}`;
  const description = vi
    ? "Khám phá các dự án của Saint 6 trong thiết kế bối cảnh, sản xuất, tổ chức sự kiện, trang trí, sáng tạo và styling."
    : "Explore Saint 6 projects across set design, production, event planning, decor, creative direction and styling.";
  const canonical = `https://www.saint6.studio${portfolioHref(locale, category, "", page).split("#")[0]}`;
  return {
    title,
    description,
    alternates: {
      canonical,
      languages: {
        en: `https://www.saint6.studio${portfolioHref("en", category, "", page).split("#")[0]}`,
        vi: `https://www.saint6.studio${portfolioHref("vi", category, "", page).split("#")[0]}`,
      },
    },
    robots: query ? { index: false, follow: true } : undefined,
    openGraph: { title, description, url: canonical, type: "website" },
  };
}

export default async function PortfolioPage(props: Props) {
  const { locale, all, category, query, projects, total, totalPages, page } =
    await content(props);
  const vi = locale === "vi";
  const pages = [...new Set([1, page - 1, page, page + 1, totalPages])]
    .filter((n) => n >= 1 && n <= totalPages)
    .sort((a, b) => a - b);
  return (
    <>
      <main className={styles.page}>
        <div className={styles.topBar}>
          <div className={styles.container}>
            <Link
              href={`/${locale}`}
              aria-label="Saint 6 homepage"
              prefetch={false}
            >
              <Image
                src="/assets/saint6-logo.svg"
                alt="Saint 6"
                width={96}
                height={48}
                style={{ width: 96, height: "auto" }}
              />
            </Link>
            <Link
              href={`/${locale}`}
              className={styles.backLink}
              prefetch={false}
            >
              ← {vi ? "TRANG CHỦ" : "SAINT 6"}
            </Link>
            <Link
              href={portfolioHref(vi ? "en" : "vi", category, query, page)}
              hrefLang={vi ? "en" : "vi"}
              prefetch={false}
            >
              {vi ? "EN" : "VI"}
            </Link>
          </div>
        </div>
        <header className={`${styles.container} ${styles.heading}`}>
          <p className={styles.eyebrow}>
            SAINT 6 / {vi ? "DỰ ÁN" : "OUR PORTFOLIO"}
          </p>
          <h1>
            {vi ? "Những câu chuyện đã thành hình." : "Ideas brought to life."}
          </h1>
          <p>
            {vi
              ? "Khám phá các dự án của chúng tôi trong thiết kế bối cảnh, sản xuất, tổ chức sự kiện, trang trí, sáng tạo và styling."
              : "Explore work across set design, production, event planning, decor, creative direction and styling."}
          </p>
        </header>
        <section
          className={styles.container}
          id="portfolio-results"
          aria-label={vi ? "Các dự án" : "Projects"}
        >
          <div className={styles.controls}>
            <nav
              className={styles.filters}
              aria-label={vi ? "Lọc theo dịch vụ" : "Filter by service"}
            >
              <Link
                href={portfolioHref(locale, "", query)}
                prefetch={false}
                aria-current={!category ? "page" : undefined}
              >
                {vi ? "Tất cả" : "All work"} ({all.length})
              </Link>
              {Object.entries(serviceCategories).map(([key, label]) => (
                <Link
                  key={key}
                  href={portfolioHref(locale, key, query)}
                  prefetch={false}
                  aria-current={category === key ? "page" : undefined}
                >
                  {label[locale as StylingLocale]} (
                  {
                    all.filter((project) =>
                      project.services.includes(
                        key as keyof typeof serviceCategories,
                      ),
                    ).length
                  }
                  )
                </Link>
              ))}
            </nav>
            <form
              className={styles.search}
              action={`/${locale}/portfolio#portfolio-results`}
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
                aria-label={vi ? "Tìm dự án" : "Search projects"}
                placeholder={
                  vi ? "Tìm dự án hoặc thương hiệu" : "Project or brand"
                }
              />
              <button type="submit">{vi ? "Tìm" : "Search"}</button>
            </form>
          </div>
          <p className={styles.resultCount}>
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
            <div className={styles.grid}>
              {projects.map((project, index) => (
                <Link
                  className={styles.card}
                  href={project.href}
                  key={project.id}
                  prefetch={false}
                >
                  <div className={styles.image}>
                    <Image
                      src={project.image}
                      alt={project.imageAlt}
                      fill
                      sizes="(max-width: 600px) 100vw, (max-width: 900px) 50vw, 33vw"
                      priority={index === 0}
                    />
                  </div>
                  <div className={styles.cardInfo}>
                    <p className={styles.cardCategory}>
                      {project.services
                        .map((service) => serviceCategories[service][locale])
                        .join(" · ")}
                    </p>
                    <h2>
                      {project.title}
                      <span className={styles.cardArrow} aria-hidden="true">
                        ↗
                      </span>
                    </h2>
                    {project.summary && (
                      <p className={styles.summary}>{project.summary}</p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className={styles.empty}>
              {vi ? "Không tìm thấy dự án phù hợp." : "No matching projects."}
            </p>
          )}
          {totalPages > 1 && (
            <nav
              className={styles.pagination}
              aria-label={vi ? "Phân trang" : "Portfolio pagination"}
            >
              {page > 1 && (
                <Link
                  href={portfolioHref(locale, category, query, page - 1)}
                  rel="prev"
                  prefetch={false}
                >
                  ← {vi ? "Trước" : "Previous"}
                </Link>
              )}
              {pages.map((n, index) => (
                <span key={n}>
                  {index > 0 && n - pages[index - 1] > 1 && (
                    <span aria-hidden="true">…</span>
                  )}
                  <Link
                    href={portfolioHref(locale, category, query, n)}
                    prefetch={false}
                    aria-current={page === n ? "page" : undefined}
                    aria-label={`${vi ? "Trang" : "Page"} ${n}`}
                  >
                    {n}
                  </Link>
                </span>
              ))}
              {page < totalPages && (
                <Link
                  href={portfolioHref(locale, category, query, page + 1)}
                  rel="next"
                  prefetch={false}
                >
                  {vi ? "Tiếp" : "Next"} →
                </Link>
              )}
            </nav>
          )}
        </section>
      </main>
      <div className={styles.contact} id="enquiry">
        <ContactSection backgroundImageUrl="/images/contact-section-bg.webp" />
      </div>
    </>
  );
}

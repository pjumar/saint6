import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ContactSection } from "@/app/components/contact-section/ContactSection";
import { InnerPageNav } from "@/app/components/inner-page-nav/InnerPageNav";
import {
  getPortfolioProjects,
  portfolioHref,
  portfolioResults,
  serviceCategories,
} from "@/app/lib/portfolio/content";
import type { StylingLocale } from "@/app/lib/styling/types";
import styles from "./Portfolio.module.css";
import { PortfolioExplorer } from "./PortfolioExplorer";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

async function pageState({ params, searchParams }: Props) {
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
  const page = Math.max(1, Number.parseInt(single("page"), 10) || 1);
  return { locale, category, query, page };
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { locale, category, query, page } = await pageState(props);
  const vi = locale === "vi";
  const title = `${vi ? "Dự án Saint 6" : "Saint 6 Projects"}${category ? ` · ${serviceCategories[category as keyof typeof serviceCategories][locale]}` : ""}`;
  const description = vi
    ? "Khám phá các dự án của Saint 6 trong thiết kế bối cảnh, sản xuất, tổ chức sự kiện, trang trí, sáng tạo và styling."
    : "Explore Saint 6 projects across set design, production, event planning, decor, creative direction and styling.";
  const canonical = `https://www.saint6.studio${portfolioHref(locale, category, "", page)}`;
  return {
    title,
    description,
    alternates: {
      canonical,
      languages: {
        en: `https://www.saint6.studio${portfolioHref("en", category, "", page)}`,
        vi: `https://www.saint6.studio${portfolioHref("vi", category, "", page)}`,
      },
    },
    robots: query ? { index: false, follow: true } : undefined,
    openGraph: { title, description, url: canonical, type: "website" },
  };
}

export default async function PortfolioPage(props: Props) {
  const {
    locale,
    category,
    query,
    page: requestedPage,
  } = await pageState(props);
  const all = (await getPortfolioProjects(locale)).map(
    ({
      id,
      title,
      category: projectCategory,
      summary,
      image,
      imageAlt,
      href,
      services,
    }) => ({
      id,
      title,
      category: projectCategory,
      summary,
      image,
      imageAlt,
      href,
      services,
    }),
  );
  const { page } = portfolioResults(
    all,
    category,
    query,
    String(requestedPage),
  );
  const vi = locale === "vi";

  return (
    <>
      <main className={styles.page}>
        <div className={styles.topBar}>
          <InnerPageNav
            locale={locale}
            languageHref={portfolioHref(
              vi ? "en" : "vi",
              category,
              query,
              page,
            )}
          />
        </div>
        <header className={`${styles.container} ${styles.heading}`}>
          <p className={styles.eyebrow}>
            SAINT 6 / {vi ? "DỰ ÁN" : "OUR PORTFOLIO"}
          </p>
          <h1>
            {vi ? "Dấu ấn Saint 6 qua từng dự án." : "Our work, in every form."}
          </h1>
          <p>
            {vi
              ? "Khám phá các dự án của chúng tôi trong thiết kế bối cảnh, sản xuất, tổ chức sự kiện, trang trí, sáng tạo và styling."
              : "Explore work across set design, production, event planning, decor, creative direction and styling."}
          </p>
        </header>
        <PortfolioExplorer
          locale={locale}
          all={all}
          initialFilters={{ category, query, page }}
        />
      </main>
      <div className={styles.contact} id="enquiry">
        <ContactSection backgroundImageUrl="/images/contact-section-bg.webp" />
      </div>
    </>
  );
}

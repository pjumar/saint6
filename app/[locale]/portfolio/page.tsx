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
import { portfolioSeoTitle } from "@/app/lib/portfolio/listing";
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
  const {
    locale,
    category,
    query,
    page: requestedPage,
  } = await pageState(props);
  const projects = await getPortfolioProjects(locale);
  const { projects: results, page } = portfolioResults(
    projects,
    category,
    query,
    String(requestedPage),
  );
  const vi = locale === "vi";
  const service = category
    ? serviceCategories[category as keyof typeof serviceCategories][locale]
    : "";
  const title = portfolioSeoTitle(locale, category, page);
  const description = service
    ? vi
      ? `Khám phá các dự án ${service.toLowerCase()} của Saint 6 tại TP.HCM, từ ý tưởng đến hình ảnh và không gian hoàn thiện.`
      : `Explore Saint 6 ${service.toLowerCase()} projects in Ho Chi Minh City, from creative direction to finished imagery and spaces.`
    : vi
      ? "Khám phá các dự án của Saint 6 trong thiết kế bối cảnh, sản xuất, tổ chức sự kiện, trang trí, sáng tạo và styling."
      : "Explore Saint 6 projects across set design, production, event planning, decor, creative direction and styling.";
  const canonical = `https://www.saint6.studio${portfolioHref(locale, category, "", page)}`;
  const image = results[0]?.image || "/og-image.jpg";
  const imageUrl = new URL(image, "https://www.saint6.studio").href;
  return {
    title: { absolute: title },
    description,
    alternates: {
      canonical,
      languages: {
        en: `https://www.saint6.studio${portfolioHref("en", category, "", page)}`,
        vi: `https://www.saint6.studio${portfolioHref("vi", category, "", page)}`,
      },
    },
    robots: query ? { index: false, follow: true } : undefined,
    openGraph: {
      title,
      description,
      url: canonical,
      type: "website",
      locale: vi ? "vi_VN" : "en_US",
      siteName: "Saint 6 Studio",
      images: [{ url: imageUrl, alt: results[0]?.imageAlt || title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
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
      imageFit,
      imageBackground,
      href,
      services,
    }) => ({
      id,
      title,
      category: projectCategory,
      summary,
      image,
      imageAlt,
      imageFit,
      imageBackground,
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

import Link from "next/link";
import { notFound } from "next/navigation";
import { HeroSection } from "@/app/components/hero-section/HeroSection";
import { SectionHeader } from "@/app/components/section-header/SectionHeader";
import styles from "@/app/components/styling/Styling.module.css";
import {
  Paragraphs,
  ProjectCard,
  StylingEnquiry,
} from "@/app/components/styling/StylingShared";
import {
  getStylingContent,
  stylingEnabled,
  stylingOrigin,
} from "@/app/lib/styling/content";
import { StylingStructuredData, stylingMetadata } from "@/app/lib/styling/seo";

type Props = { params: Promise<{ locale: string }> };
export const revalidate = 300;
async function content(params: Props["params"]) {
  const { locale } = await params;
  if (!stylingEnabled || (locale !== "en" && locale !== "vi")) notFound();
  return { locale, ...(await getStylingContent(locale)) } as const;
}
export async function generateMetadata({ params }: Props) {
  const { locale, page } = await content(params);
  return stylingMetadata(
    locale,
    "",
    page.seo_title,
    page.seo_description,
    page.hero_image,
  );
}
export default async function StylingPage({ params }: Props) {
  const { locale, page, projects } = await content(params);
  const vi = locale === "vi";
  return (
    <div className={styles.page}>
      <StylingStructuredData
        value={{
          "@context": "https://schema.org",
          "@type": "Service",
          name: "Styling by Trần Hoài Trang",
          serviceType: "Fashion, commercial and personal styling",
          description: page.seo_description,
          url: `${stylingOrigin}/${locale}/styling`,
          image: new URL(page.hero_image.url, stylingOrigin).href,
          areaServed: { "@type": "City", name: "Ho Chi Minh City" },
          provider: {
            "@type": "Organization",
            name: "Saint 6 Studio",
            url: stylingOrigin,
          },
        }}
      />
      <HeroSection
        heading={page.hero_heading}
        backgroundImage={page.hero_image.url}
        backgroundAlt={page.hero_image.alternativeText}
        showScrollIndicator
      />
      <section
        className={`${styles.container} ${styles.intro}`}
        aria-labelledby="styling-intro"
      >
        <div>
          <p className={styles.label}>{page.intro_label}</p>
          <h2 id="styling-intro">{page.intro_title}</h2>
        </div>
        <div className={styles.prose}>
          <Paragraphs text={page.intro_text} />
          <div className={styles.actions}>
            <a href="#selected-work" className={styles.button}>
              {vi ? "Xem dự án" : "Explore the work"}
              <span aria-hidden="true">↓</span>
            </a>
            <a href="#enquiry" className={styles.textLink}>
              {vi ? "Trao đổi cùng chúng tôi" : "Discuss your project"} ↗
            </a>
          </div>
        </div>
      </section>
      <section
        className={`${styles.container} ${styles.services}`}
        aria-labelledby="styling-services"
      >
        <h2 id="styling-services">{page.services_title}</h2>
        <div className={styles.serviceGrid}>
          {page.services.map((service, index) => (
            <article key={service.title}>
              <span className={styles.label}>0{index + 1}</span>
              <h3>{service.title}</h3>
              <p>{service.text}</p>
            </article>
          ))}
        </div>
      </section>
      <div id="selected-work" className={styles.anchor}>
        <SectionHeader
          label={page.portfolio_label}
          title={page.portfolio_title}
        />
      </div>
      <section className={styles.portfolio} aria-label={page.portfolio_label}>
        <div className={styles.container}>
          <p className={styles.portfolioNote}>{page.portfolio_note}</p>
          <div className={styles.projectGrid}>
            {projects.map((project) => (
              <ProjectCard
                key={project.slug}
                project={project}
                locale={locale}
              />
            ))}
          </div>
        </div>
      </section>
      <section
        className={`${styles.container} ${styles.intro}`}
        aria-labelledby="stylist-name"
      >
        <div>
          <p className={styles.label}>{page.founder_label}</p>
          <h2 id="stylist-name">{page.founder_title}</h2>
          <a
            className={styles.textLink}
            href="https://tranhoaitrang.com/portfolio-page/"
            target="_blank"
            rel="noopener noreferrer"
          >
            {vi ? "Portfolio cá nhân" : "Personal portfolio"} ↗
          </a>
        </div>
        <div className={styles.prose}>
          <Paragraphs text={page.founder_text} />
          <Link className={styles.textLink} href={`/${locale}/production`}>
            {vi ? "Khám phá dịch vụ sản xuất" : "Explore production at Saint 6"}{" "}
            ↗
          </Link>
        </div>
      </section>
      <section className={styles.process} aria-labelledby="styling-process">
        <div className={styles.container}>
          <h2 id="styling-process">{page.process_title}</h2>
          <div className={styles.processGrid}>
            {page.process.map((step) => (
              <article key={step.title}>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section
        className={`${styles.container} ${styles.faq}`}
        aria-labelledby="styling-faq"
      >
        <h2 id="styling-faq">{page.faq_title}</h2>
        <div>
          {page.faqs.map((faq) => (
            <details key={faq.title}>
              <summary>{faq.title}</summary>
              <p>{faq.text}</p>
            </details>
          ))}
        </div>
      </section>
      <StylingEnquiry page={page} locale={locale} />
    </div>
  );
}

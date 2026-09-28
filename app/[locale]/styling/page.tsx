import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ContactSection } from "@/app/components/contact-section/ContactSection";
import { HeroSection } from "@/app/components/hero-section/HeroSection";
import { SectionHeader } from "@/app/components/section-header/SectionHeader";
import styles from "@/app/components/styling/Styling.module.css";
import { StylingHero } from "@/app/components/styling/StylingHero";
import {
  Paragraphs,
  ProjectCard,
} from "@/app/components/styling/StylingShared";
import { StylingWorkLink } from "@/app/components/styling/StylingWorkLink";
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
    <>
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
          backgroundContent={<StylingHero page={page} />}
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
              <StylingWorkLink>
                {vi ? "Xem dự án" : "Explore the work"}
              </StylingWorkLink>
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
        {!!page.clients?.length && (
          <section
            id="styling-brands"
            className={`${styles.container} ${styles.clients}`}
            aria-label={page.clients_title}
          >
            <p className={styles.label}>{page.clients_title}</p>
            <div className={styles.clientLogos}>
              {page.clients.map((client) => (
                <Link
                  key={client.name}
                  href={`/${locale}/styling/projects?q=${encodeURIComponent(client.name)}#portfolio-results`}
                  aria-label={`${client.name} — ${vi ? "xem dự án" : "view projects"}`}
                >
                  <svg
                    className={styles.clientLogo}
                    viewBox={
                      client.logo_view_box ||
                      `0 0 ${client.logo.width} ${client.logo.height}`
                    }
                    style={{ width: `${client.display_width || 11}rem` }}
                    aria-hidden="true"
                    focusable="false"
                  >
                    <image
                      href={client.logo.url}
                      width={client.logo.width}
                      height={client.logo.height}
                    />
                  </svg>
                </Link>
              ))}
            </div>
          </section>
        )}
        <div id="selected-work" className={styles.anchor}>
          <SectionHeader
            label={page.portfolio_label}
            title={page.portfolio_title}
          />
        </div>
        <section className={styles.portfolio} aria-label={page.portfolio_label}>
          <div className={styles.container}>
            <p className={styles.portfolioNote}>{page.portfolio_note}</p>
            <section
              id="styling-projects"
              tabIndex={-1}
              aria-label={page.portfolio_label}
              className={`${styles.projectGrid} ${styles.workAnchor}`}
            >
              {projects
                .filter((project) => project.featured)
                .slice(0, 6)
                .map((project) => (
                  <ProjectCard
                    key={project.slug}
                    project={project}
                    locale={locale}
                  />
                ))}
            </section>
            <div className={styles.archiveCta}>
              <Link
                href={`/${locale}/styling/projects`}
                className={styles.button}
              >
                {vi ? "Khám phá tất cả dự án" : "Explore all projects"}{" "}
                <span aria-hidden="true">↗</span>
              </Link>
            </div>
          </div>
        </section>
        <section
          className={`${styles.container} ${styles.founder}`}
          aria-labelledby="stylist-name"
          id="stylist"
        >
          {page.founder_image && (
            <Image
              className={styles.founderImage}
              src={page.founder_image.url}
              alt={page.founder_image.alternativeText}
              width={page.founder_image.width}
              height={page.founder_image.height}
              sizes="(max-width: 768px) 100vw, 45vw"
            />
          )}
          <div className={styles.prose}>
            <p className={styles.label}>{page.founder_label}</p>
            <h2 id="stylist-name">{page.founder_title}</h2>
            <Paragraphs text={page.founder_text} />
            <Link className={styles.textLink} href={`/${locale}/production`}>
              {vi
                ? "Khám phá dịch vụ sản xuất"
                : "Explore production at Saint 6"}{" "}
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
      </div>
      <div id="enquiry" className={styles.contactForm}>
        <ContactSection backgroundImageUrl="/images/contact-section-bg.webp" />
      </div>
    </>
  );
}

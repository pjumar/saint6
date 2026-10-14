import Image from "next/image";
import Link from "next/link";
import type { Locale } from "@/app/types";
import styles from "./InnerPageNav.module.css";

type Props = {
  locale: Locale;
  languageHref: string;
  theme?: "light" | "red";
};

export function InnerPageNav({ locale, languageHref, theme = "light" }: Props) {
  const vi = locale === "vi";
  const services = [
    { label: vi ? "Thiết kế bối cảnh" : "Set design", slug: "set-design" },
    { label: vi ? "Sản xuất" : "Production", slug: "production" },
    {
      label: vi ? "Tổ chức sự kiện" : "Event planning",
      slug: "event-planning",
    },
    { label: vi ? "Trang trí" : "Decor", slug: "decor" },
    { label: vi ? "Sáng tạo" : "Creative", slug: "creative" },
    ...(process.env.NEXT_PUBLIC_STYLING_ENABLED === "true"
      ? [{ label: "Styling", slug: "styling" }]
      : []),
  ];
  const links = [
    {
      label: vi ? "Thuê studio" : "Studio rental",
      href: `/${locale}/studio-rental`,
    },
    { label: "Portfolio", href: `/${locale}/portfolio` },
    { label: vi ? "Về chúng tôi" : "About us", href: `/${locale}/about` },
    { label: vi ? "Liên hệ" : "Contact", href: `/${locale}/contact` },
  ];

  const serviceMenu = (
    <details className={styles.dropdown}>
      <summary>
        {vi ? "Dịch vụ" : "Services"}
        <span aria-hidden="true">⌄</span>
      </summary>
      <div className={styles.dropdownPanel}>
        {services.map((service) => (
          <Link
            key={service.slug}
            href={`/${locale}/${service.slug}`}
            prefetch={false}
          >
            {service.label}
          </Link>
        ))}
      </div>
    </details>
  );

  return (
    <nav
      className={`${styles.nav} ${theme === "red" ? styles.red : styles.light}`}
      aria-label={vi ? "Điều hướng chính" : "Main navigation"}
    >
      <Link
        className={styles.logo}
        href={`/${locale}`}
        aria-label="Saint 6 Studios home"
        prefetch={false}
      >
        <Image
          src="/assets/saint6-logo.svg"
          alt="Saint 6 Studios"
          width={171}
          height={36}
          priority
        />
      </Link>
      <div className={styles.desktopLinks}>
        <Link href={links[0].href} prefetch={false}>
          {links[0].label}
        </Link>
        {serviceMenu}
        {links.slice(1).map((link) => (
          <Link key={link.href} href={link.href} prefetch={false}>
            {link.label}
          </Link>
        ))}
        <Link href={languageHref} hrefLang={vi ? "en" : "vi"} prefetch={false}>
          {vi ? "EN" : "VI"}
        </Link>
      </div>
      <details className={styles.mobileMenu}>
        <summary>
          {vi ? "Danh mục" : "Menu"}
          <span aria-hidden="true">⌄</span>
        </summary>
        <div className={styles.mobilePanel}>
          <Link href={links[0].href} prefetch={false}>
            {links[0].label}
          </Link>
          <p>{vi ? "Dịch vụ" : "Services"}</p>
          {services.map((service) => (
            <Link
              key={service.slug}
              href={`/${locale}/${service.slug}`}
              prefetch={false}
            >
              {service.label}
            </Link>
          ))}
          {links.slice(1).map((link) => (
            <Link key={link.href} href={link.href} prefetch={false}>
              {link.label}
            </Link>
          ))}
          <Link
            href={languageHref}
            hrefLang={vi ? "en" : "vi"}
            prefetch={false}
          >
            {vi ? "EN" : "VI"}
          </Link>
        </div>
      </details>
    </nav>
  );
}

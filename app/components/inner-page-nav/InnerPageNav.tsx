"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import type { Locale } from "@/app/types";
import styles from "./InnerPageNav.module.css";

type Props = {
  locale: Locale;
  languageHref: string;
  theme?: "light" | "red";
};

export function InnerPageNav({ locale, languageHref, theme = "light" }: Props) {
  const vi = locale === "vi";
  const serviceMenuRef = useRef<HTMLDetailsElement>(null);
  const mobileMenuRef = useRef<HTMLDetailsElement>(null);
  const desktopRoomsRef = useRef<HTMLDetailsElement>(null);
  const mobileRoomsRef = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    const closeOnOutsideClick = (event: PointerEvent) => {
      if (!(event.target instanceof Node)) return;
      for (const menu of [serviceMenuRef.current, mobileMenuRef.current]) {
        if (menu && !menu.contains(event.target)) menu.open = false;
      }
      for (const menu of [desktopRoomsRef.current, mobileRoomsRef.current]) {
        if (menu && !menu.contains(event.target)) menu.open = false;
      }
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      serviceMenuRef.current?.removeAttribute("open");
      mobileMenuRef.current?.removeAttribute("open");
      desktopRoomsRef.current?.removeAttribute("open");
      mobileRoomsRef.current?.removeAttribute("open");
    };
    document.addEventListener("pointerdown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, []);

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
  const rooms = [
    { label: vi ? "Phòng 125m²" : "Room 125m²", slug: "room-125m2" },
    { label: vi ? "Phòng 250m²" : "Room 250m²", slug: "medium-room" },
    { label: vi ? "Phòng 360m²" : "Room 360m²", slug: "big-room" },
    ...[1, 2, 3].map((number) => ({
      label: vi ? `Phòng Concept ${number}` : `Concept Room ${number}`,
      slug: `concept-room-${number}`,
    })),
  ];
  const links = [
    { label: "Portfolio", href: `/${locale}/portfolio` },
    { label: vi ? "Về chúng tôi" : "About us", href: `/${locale}/about` },
    { label: vi ? "Liên hệ" : "Contact", href: `/${locale}/contact` },
  ];

  const roomSubmenu = (mobile: boolean) => (
    <details
      className={styles.roomSubmenu}
      ref={mobile ? mobileRoomsRef : desktopRoomsRef}
    >
      <summary
        aria-label={
          vi ? "Thuê studio, mở danh sách phòng" : "Studio rental, show rooms"
        }
      >
        {vi ? "Thuê studio" : "Studio rental"}
        <svg aria-hidden="true" focusable="false" viewBox="0 0 10 10">
          <path d="m1 3 4 4 4-4" />
        </svg>
      </summary>
      <div className={styles.roomPanel}>
        <Link
          href={`/${locale}/studio-rental`}
          aria-label={vi ? "Xem tất cả phòng" : "View all rooms"}
          prefetch={false}
        >
          {vi ? "Tất cả phòng" : "All rooms"}
        </Link>
        {rooms.map((room) => (
          <Link
            key={room.slug}
            href={`/${locale}/studio-rental/rooms/${room.slug}`}
            aria-label={room.label}
            prefetch={false}
          >
            {room.label}
          </Link>
        ))}
      </div>
    </details>
  );

  const serviceMenu = (
    <details className={styles.dropdown} ref={serviceMenuRef}>
      <summary>
        {vi ? "Dịch vụ" : "Services"}
        <svg aria-hidden="true" focusable="false" viewBox="0 0 10 10">
          <path d="m1 3 4 4 4-4" />
        </svg>
      </summary>
      <div className={styles.dropdownPanel}>
        {roomSubmenu(false)}
        {services.map((service) => (
          <Link
            key={service.slug}
            href={`/${locale}/${service.slug}`}
            aria-label={service.label}
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
        {serviceMenu}
        {links.map((link) => (
          <Link key={link.href} href={link.href} prefetch={false}>
            {link.label}
          </Link>
        ))}
        <Link href={languageHref} hrefLang={vi ? "en" : "vi"} prefetch={false}>
          {vi ? "EN" : "VI"}
        </Link>
      </div>
      <details className={styles.mobileMenu} ref={mobileMenuRef}>
        <summary>
          {vi ? "Danh mục" : "Menu"}
          <svg aria-hidden="true" focusable="false" viewBox="0 0 10 10">
            <path d="m1 3 4 4 4-4" />
          </svg>
        </summary>
        <div className={styles.mobilePanel}>
          <p>{vi ? "Dịch vụ" : "Services"}</p>
          {roomSubmenu(true)}
          {services.map((service) => (
            <Link
              key={service.slug}
              href={`/${locale}/${service.slug}`}
              aria-label={service.label}
              prefetch={false}
            >
              {service.label}
            </Link>
          ))}
          {links.map((link) => (
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

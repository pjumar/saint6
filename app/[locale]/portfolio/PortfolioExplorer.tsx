"use client";

import Image from "next/image";
import Link from "next/link";
import {
  type FormEvent,
  type MouseEvent,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  type PortfolioListingProject,
  portfolioHref,
  portfolioResults,
  serviceCategories,
} from "@/app/lib/portfolio/listing";
import type { StylingLocale } from "@/app/lib/styling/types";
import styles from "./Portfolio.module.css";

type Filters = { category: string; query: string; page: number };
type Props = {
  locale: StylingLocale;
  all: PortfolioListingProject[];
  initialFilters: Filters;
};

function browserFilters(): Filters {
  const params = new URLSearchParams(window.location.search);
  const requestedCategory = params.get("category") || "";
  return {
    category: Object.hasOwn(serviceCategories, requestedCategory)
      ? requestedCategory
      : "",
    query: (params.get("q") || "").trim().slice(0, 120),
    page: Math.max(1, Number.parseInt(params.get("page") || "1", 10) || 1),
  };
}

function isPlainClick(event: MouseEvent<HTMLAnchorElement>) {
  return (
    event.button === 0 &&
    !event.metaKey &&
    !event.ctrlKey &&
    !event.shiftKey &&
    !event.altKey
  );
}

export function PortfolioExplorer({ locale, all, initialFilters }: Props) {
  const [filters, setFilters] = useState(initialFilters);
  const [searchInput, setSearchInput] = useState(initialFilters.query);
  const vi = locale === "vi";
  const { projects, total, totalPages, page } = useMemo(
    () =>
      portfolioResults(
        all,
        filters.category,
        filters.query,
        String(filters.page),
      ),
    [all, filters.category, filters.query, filters.page],
  );
  const categoryCounts = useMemo(
    () =>
      Object.fromEntries(
        Object.keys(serviceCategories).map((key) => [
          key,
          all.filter((project) =>
            project.services.includes(key as keyof typeof serviceCategories),
          ).length,
        ]),
      ),
    [all],
  );
  const pages = [...new Set([1, page - 1, page, page + 1, totalPages])]
    .filter((number) => number >= 1 && number <= totalPages)
    .sort((a, b) => a - b);

  useEffect(() => {
    const restore = () => {
      const next = browserFilters();
      setFilters(next);
      setSearchInput(next.query);
    };
    restore();
    window.addEventListener("popstate", restore);
    return () => window.removeEventListener("popstate", restore);
  }, []);

  useEffect(() => {
    const title = vi ? "Portfolio dự án" : "Our portfolio";
    const category = filters.category
      ? ` · ${serviceCategories[filters.category as keyof typeof serviceCategories][locale]}`
      : "";
    document.title = `Saint 6 Studios | ${title}${category}`;
  }, [filters.category, locale, vi]);

  function navigate(next: Filters, scrollToResults = false) {
    const href = portfolioHref(locale, next.category, next.query, next.page);
    if (`${window.location.pathname}${window.location.search}` !== href)
      window.history.pushState(null, "", href);
    setFilters(next);
    setSearchInput(next.query);
    if (scrollToResults) {
      requestAnimationFrame(() => {
        const reducedMotion = window.matchMedia(
          "(prefers-reduced-motion: reduce)",
        ).matches;
        document.getElementById("portfolio-results")?.scrollIntoView({
          behavior: reducedMotion ? "instant" : "smooth",
          block: "start",
        });
      });
    }
  }

  function filterClick(event: MouseEvent<HTMLAnchorElement>, next: Filters) {
    if (!isPlainClick(event)) return;
    event.preventDefault();
    navigate(next);
  }

  function pageClick(event: MouseEvent<HTMLAnchorElement>, next: Filters) {
    if (!isPlainClick(event)) return;
    event.preventDefault();
    navigate(next, true);
  }

  function search(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    navigate({
      category: filters.category,
      query: searchInput.trim().slice(0, 120),
      page: 1,
    });
  }

  return (
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
          <a
            href={portfolioHref(locale, "", filters.query)}
            onClick={(event) =>
              filterClick(event, {
                category: "",
                query: filters.query,
                page: 1,
              })
            }
            aria-current={!filters.category ? "page" : undefined}
          >
            {vi ? "Tất cả" : "All work"} ({all.length})
          </a>
          {Object.entries(serviceCategories).map(([key, label]) => (
            <a
              key={key}
              href={portfolioHref(locale, key, filters.query)}
              onClick={(event) =>
                filterClick(event, {
                  category: key,
                  query: filters.query,
                  page: 1,
                })
              }
              aria-current={filters.category === key ? "page" : undefined}
            >
              {label[locale]} ({categoryCounts[key]})
            </a>
          ))}
        </nav>
        <form
          className={styles.search}
          action={`/${locale}/portfolio`}
          method="get"
          onSubmit={search}
        >
          {filters.category && (
            <input type="hidden" name="category" value={filters.category} />
          )}
          <input
            name="q"
            type="search"
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
            maxLength={120}
            aria-label={vi ? "Tìm dự án" : "Search projects"}
            placeholder={vi ? "Tìm dự án hoặc thương hiệu" : "Project or brand"}
          />
          <button type="submit">{vi ? "Tìm" : "Search"}</button>
        </form>
      </div>
      <p className={styles.resultCount} aria-live="polite">
        {total} {vi ? "dự án" : total === 1 ? "project" : "projects"} ·{" "}
        {vi ? "Trang" : "Page"} {page}/{totalPages}
        {filters.query && (
          <>
            {" "}
            · “{filters.query}” ·{" "}
            <a
              href={portfolioHref(locale, filters.category)}
              onClick={(event) =>
                filterClick(event, {
                  category: filters.category,
                  query: "",
                  page: 1,
                })
              }
            >
              {vi ? "Xóa tìm kiếm" : "Clear search"}
            </a>
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
              <div
                className={styles.image}
                style={{ background: project.imageBackground }}
              >
                <Image
                  src={project.image}
                  alt={project.imageAlt}
                  fill
                  sizes="(max-width: 600px) 100vw, (max-width: 900px) 50vw, 33vw"
                  priority={index === 0}
                  style={
                    project.imageFit
                      ? { objectFit: project.imageFit }
                      : undefined
                  }
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
            <a
              href={portfolioHref(
                locale,
                filters.category,
                filters.query,
                page - 1,
              )}
              rel="prev"
              onClick={(event) =>
                pageClick(event, { ...filters, page: page - 1 })
              }
            >
              ← {vi ? "Trước" : "Previous"}
            </a>
          )}
          {pages.map((number, index) => (
            <span key={number}>
              {index > 0 && number - pages[index - 1] > 1 && (
                <span aria-hidden="true">…</span>
              )}
              <a
                href={portfolioHref(
                  locale,
                  filters.category,
                  filters.query,
                  number,
                )}
                onClick={(event) =>
                  pageClick(event, { ...filters, page: number })
                }
                aria-current={page === number ? "page" : undefined}
                aria-label={`${vi ? "Trang" : "Page"} ${number}`}
              >
                {number}
              </a>
            </span>
          ))}
          {page < totalPages && (
            <a
              href={portfolioHref(
                locale,
                filters.category,
                filters.query,
                page + 1,
              )}
              rel="next"
              onClick={(event) =>
                pageClick(event, { ...filters, page: page + 1 })
              }
            >
              {vi ? "Tiếp" : "Next"} →
            </a>
          )}
        </nav>
      )}
    </section>
  );
}

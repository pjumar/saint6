import { searchText } from "@/app/lib/styling/portfolio";
import type { StylingLocale } from "@/app/lib/styling/types";

export const serviceCategories = {
  "set-design": { en: "Set design", vi: "Thiết kế bối cảnh" },
  production: { en: "Production", vi: "Sản xuất" },
  "event-planning": { en: "Event planning", vi: "Tổ chức sự kiện" },
  decor: { en: "Decor", vi: "Trang trí" },
  creative: { en: "Creative", vi: "Sáng tạo" },
  styling: { en: "Styling", vi: "Styling" },
} as const;
export type ServiceCategory = keyof typeof serviceCategories;

export function portfolioSeoTitle(
  locale: StylingLocale,
  category: string,
  page = 1,
): string {
  const service = Object.hasOwn(serviceCategories, category)
    ? serviceCategories[category as ServiceCategory][locale]
    : "";
  const label =
    locale === "vi"
      ? service
        ? `Dự án ${service}`
        : "Dự án"
      : service
        ? `${service} Projects`
        : "Portfolio";
  return `${label}${page > 1 ? ` · ${locale === "vi" ? "Trang" : "Page"} ${page}` : ""} | Saint 6 Studio`;
}

export interface PortfolioListingProject {
  id: string;
  title: string;
  category: string;
  summary: string;
  image: string;
  imageAlt: string;
  imageFit?: "contain";
  imageBackground?: string;
  href: string;
  services: ServiceCategory[];
}

export function portfolioResults(
  projects: PortfolioListingProject[],
  category: string,
  query: string,
  requestedPage: string,
) {
  const term = searchText(query.trim());
  const filtered = projects.filter(
    (project) =>
      (!category || project.services.includes(category as ServiceCategory)) &&
      (!term ||
        searchText(
          `${project.title} ${project.category} ${project.summary}`,
        ).includes(term)),
  );
  const totalPages = Math.max(1, Math.ceil(filtered.length / 18));
  const page = Math.min(
    totalPages,
    Math.max(1, Number.parseInt(requestedPage, 10) || 1),
  );
  return {
    projects: filtered.slice((page - 1) * 18, page * 18),
    total: filtered.length,
    totalPages,
    page,
  };
}

export function portfolioHref(
  locale: StylingLocale,
  category = "",
  query = "",
  page = 1,
) {
  const params = new URLSearchParams();
  if (category) params.set("category", category);
  if (query) params.set("q", query);
  if (page > 1) params.set("page", String(page));
  return `/${locale}/portfolio${params.size ? `?${params}` : ""}`;
}

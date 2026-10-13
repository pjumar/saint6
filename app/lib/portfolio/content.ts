import { cache } from "react";
import {
  getCreativePage,
  getDecorPage,
  getEventPlanningPage,
  getHomepage,
  getProductionPage,
  getSetDesignPage,
  getStrapiImageUrl,
  type StrapiKeyProject,
  type StrapiPortfolioItem,
} from "@/app/lib/strapi";
import {
  getStylingProjectSummaries,
  stylingEnabled,
} from "@/app/lib/styling/content";
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

export interface PortfolioProject {
  id: string;
  title: string;
  category: string;
  summary: string;
  image: string;
  imageAlt: string;
  href: string;
  services: ServiceCategory[];
}

function projectServices(expertise: string[] = []): ServiceCategory[] {
  const text = searchText(expertise.join(" "));
  const services: ServiceCategory[] = [];
  if (/set design|thiet ke boi canh/.test(text)) services.push("set-design");
  if (/production|san xuat/.test(text)) services.push("production");
  if (/event planning|to chuc su kien/.test(text))
    services.push("event-planning");
  if (/decor|trang tri/.test(text)) services.push("decor");
  if (/creative|sang tao/.test(text)) services.push("creative");
  if (/stylist|styling/.test(text)) services.push("styling");
  return services;
}

function keyProject(
  project: StrapiKeyProject,
  locale: StylingLocale,
  source: "home" | "production",
): PortfolioProject | null {
  const image = getStrapiImageUrl(project.main_image);
  if (!image) return null;
  return {
    id: `key-${project.slug || project.id}`,
    title: project.title,
    category:
      project.client || (locale === "vi" ? "Dự án nổi bật" : "Key project"),
    summary: project.info_text || "",
    image,
    imageAlt: project.main_image.alternativeText || project.title,
    href: `/${locale}${source === "home" ? "" : "/production"}#key-project-${project.slug || project.id}`,
    services: projectServices(project.expertise),
  };
}

function portfolioItem(
  item: StrapiPortfolioItem,
  locale: StylingLocale,
  service: "set-design" | "decor" | "creative",
): PortfolioProject | null {
  const image = getStrapiImageUrl(item.image);
  if (!image) return null;
  return {
    id: `${service}-${item.id}`,
    title: item.title,
    category: item.category || serviceCategories[service][locale],
    summary: "",
    image,
    imageAlt: item.image.alternativeText || item.title,
    href: `/${locale}/${service}#portfolio-item-${item.id}`,
    services: [service],
  };
}

export const getPortfolioProjects = cache(async (locale: StylingLocale) => {
  const [home, production, setDesign, events, decor, creative, styling] =
    await Promise.all([
      getHomepage(locale),
      getProductionPage(locale),
      getSetDesignPage(locale),
      getEventPlanningPage(locale),
      getDecorPage(locale),
      getCreativePage(locale),
      stylingEnabled ? getStylingProjectSummaries(locale) : Promise.resolve([]),
    ]);
  const projects: PortfolioProject[] = [];
  const seenKeys = new Set<string>();
  for (const [source, entries] of [
    ["home", home?.key_projects],
    ["production", production?.key_projects],
  ] as const) {
    for (const entry of entries || []) {
      const key = entry.slug || searchText(entry.title);
      if (seenKeys.has(key)) continue;
      const project = keyProject(entry, locale, source);
      if (project) {
        projects.push(project);
        seenKeys.add(key);
      }
    }
  }
  for (const [service, entries] of [
    ["set-design", setDesign?.portfolio_items],
    ["decor", decor?.portfolio_items],
    ["creative", creative?.portfolio_items],
  ] as const) {
    for (const entry of entries || []) {
      const project = portfolioItem(entry, locale, service);
      if (project) projects.push(project);
    }
  }
  for (const entry of events?.event_projects || []) {
    const image = getStrapiImageUrl(entry.images?.[0]);
    if (!image) continue;
    projects.push({
      id: `event-${entry.id}`,
      title: entry.title,
      category: entry.category,
      summary: "",
      image,
      imageAlt: entry.images[0].alternativeText || entry.title,
      href: `/${locale}/event-planning#gallery`,
      services: ["event-planning"],
    });
  }
  for (const entry of styling) {
    const item: PortfolioProject = {
      id: `styling-${entry.slug}`,
      title: entry.title,
      category: entry.category,
      summary: entry.summary,
      image: entry.cover.url,
      imageAlt: entry.cover.alternativeText,
      href: `/${locale}/styling/${entry.slug}`,
      services: ["styling"],
    };
    if (entry.slug === "2-ngay-1-dem-vietnam") projects.unshift(item);
    else projects.push(item);
  }
  return projects;
});

export function portfolioResults(
  projects: PortfolioProject[],
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
  return `/${locale}/portfolio${params.size ? `?${params}` : ""}#portfolio-results`;
}

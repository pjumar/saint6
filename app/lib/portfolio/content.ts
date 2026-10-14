import { cache } from "react";
import { hasProjectName } from "@/app/lib/portfolio/names";
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
import { projectThumbnail } from "@/app/lib/styling/project-thumbnails";
import type { StylingLocale } from "@/app/lib/styling/types";
import {
  type PortfolioListingProject,
  type ServiceCategory,
  serviceCategories,
} from "./listing";

export type { PortfolioListingProject, ServiceCategory } from "./listing";
export { portfolioHref, portfolioResults, serviceCategories } from "./listing";

export interface PortfolioProject extends PortfolioListingProject {
  body?: string;
  images?: { url: string; alt: string; width: number; height: number }[];
  credits?: { role: string; name: string }[];
  client?: string;
  expertise?: string[];
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
): PortfolioProject | null {
  const image = getStrapiImageUrl(project.main_image);
  if (!image || !hasProjectName(project.title)) return null;
  const id = `key-${project.slug || project.id}`;
  return {
    id,
    title: project.title,
    category:
      project.client || (locale === "vi" ? "Dự án nổi bật" : "Key project"),
    summary: project.info_text || "",
    image,
    imageAlt: project.main_image.alternativeText || project.title,
    href: `/${locale}/projects/${encodeURIComponent(id)}`,
    services: projectServices(project.expertise),
    body: project.info_text || "",
    images: [
      project.main_image,
      ...(project.gallery_images || []).map((item) => item.image),
    ]
      .map((item) => {
        const url = getStrapiImageUrl(item);
        return url
          ? {
              url,
              alt: item.alternativeText || project.title,
              width: item.width || 1200,
              height: item.height || 800,
            }
          : null;
      })
      .filter((item): item is NonNullable<typeof item> => item !== null),
    credits: project.team || [],
    client: project.client,
    expertise: project.expertise || [],
  };
}

function portfolioItem(
  item: StrapiPortfolioItem,
  locale: StylingLocale,
  service: "set-design" | "decor" | "creative",
): PortfolioProject | null {
  const image = getStrapiImageUrl(item.image);
  if (!image || !hasProjectName(item.title)) return null;
  const id = `${service}-${item.id}`;
  return {
    id,
    title: item.title,
    category: item.category || serviceCategories[service][locale],
    summary: item.summary || "",
    image,
    imageAlt: item.image.alternativeText || item.title,
    href: `/${locale}/projects/${id}`,
    services: [service],
    body: item.body || "",
    images: [item.image, ...(item.gallery || [])]
      .map((entry) => {
        const url = getStrapiImageUrl(entry);
        return url
          ? {
              url,
              alt: entry.alternativeText || item.title,
              width: entry.width || 1200,
              height: entry.height || 800,
            }
          : null;
      })
      .filter((entry): entry is NonNullable<typeof entry> => entry !== null),
    credits: item.credits || [],
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
  for (const entries of [home?.key_projects, production?.key_projects]) {
    for (const entry of entries || []) {
      const key = entry.slug || searchText(entry.title);
      if (seenKeys.has(key)) continue;
      const project = keyProject(entry, locale);
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
    if (!hasProjectName(entry.title)) continue;
    const image = getStrapiImageUrl(entry.images?.[0]);
    if (!image) continue;
    projects.push({
      id: `event-${entry.id}`,
      title: entry.title,
      category: entry.category,
      summary: entry.summary || "",
      image,
      imageAlt: entry.images[0].alternativeText || entry.title,
      href: `/${locale}/projects/event-${entry.id}`,
      services: ["event-planning"],
      body: entry.body || "",
      images: entry.images
        .map((entryImage) => {
          const url = getStrapiImageUrl(entryImage);
          return url
            ? {
                url,
                alt: entryImage.alternativeText || entry.title,
                width: entryImage.width || 1200,
                height: entryImage.height || 800,
              }
            : null;
        })
        .filter(
          (entryImage): entryImage is NonNullable<typeof entryImage> =>
            entryImage !== null,
        ),
      credits: entry.credits || [],
    });
  }
  for (const entry of styling) {
    const { image, fit, background } = projectThumbnail(entry);
    const item: PortfolioProject = {
      id: `styling-${entry.slug}`,
      title: entry.title,
      category: entry.category,
      summary: entry.summary,
      image: image.url,
      imageAlt: image.alternativeText,
      imageFit: fit,
      imageBackground: background,
      href: `/${locale}/styling/${entry.slug}`,
      services: ["styling"],
    };
    if (entry.slug === "2-ngay-1-dem-vietnam") projects.unshift(item);
    else projects.push(item);
  }
  return projects;
});

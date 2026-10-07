import type { MetadataRoute } from "next";
import {
  getStylingProjectSummaries,
  stylingIsPublic,
} from "@/app/lib/styling/content";

const BASE_URL = "https://www.saint6.studio";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const locales = ["en", "vi"];
  const routes = [
    "",
    "/about",
    "/contact",
    "/creative",
    "/decor",
    "/event-planning",
    "/production",
    "/set-design",
    "/studio-rental",
  ];

  const existing: MetadataRoute.Sitemap = locales.flatMap((locale) =>
    routes.map((route) => ({
      url: `${BASE_URL}/${locale}${route}`,
      alternates: {
        languages: {
          en: `${BASE_URL}/en${route}`,
          vi: `${BASE_URL}/vi${route}`,
        },
      },
      changeFrequency: "weekly" as const,
      priority: route === "" ? 1 : 0.8,
    })),
  );
  if (!stylingIsPublic) return existing;
  const styling = await Promise.all(
    (["en", "vi"] as const).map(async (locale) => {
      const projects = await getStylingProjectSummaries(locale);
      return [
        "",
        "/projects",
        ...projects.map((project) => `/${project.slug}`),
      ].map((path) => ({
        url: `${BASE_URL}/${locale}/styling${path}`,
        alternates: {
          languages: {
            en: `${BASE_URL}/en/styling${path}`,
            vi: `${BASE_URL}/vi/styling${path}`,
          },
        },
      }));
    }),
  );
  return [...existing, ...styling.flat()];
}

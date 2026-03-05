import type { MetadataRoute } from "next";

const BASE_URL = "https://saint6.studio";

export default function sitemap(): MetadataRoute.Sitemap {
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

  return locales.flatMap((locale) =>
    routes.map((route) => ({
      url: `${BASE_URL}/${locale}${route}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: route === "" ? 1 : 0.8,
    }))
  );
}

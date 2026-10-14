import type { MetadataRoute } from "next";
import {
  getPortfolioProjects,
  translatedProject,
} from "@/app/lib/portfolio/content";
import { getRentalRooms } from "@/app/lib/studio-rental/rooms";
import { stylingIsPublic } from "@/app/lib/styling/content";

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
    "/portfolio",
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
  const rooms = (
    await Promise.all(
      (["en", "vi"] as const).map(async (locale) =>
        (
          await getRentalRooms(locale)
        ).map((room) => ({
          url: `${BASE_URL}${room.href}`,
          alternates: {
            languages: {
              en: `${BASE_URL}/en/studio-rental/rooms/${room.id}`,
              vi: `${BASE_URL}/vi/studio-rental/rooms/${room.id}`,
            },
          },
          changeFrequency: "weekly" as const,
          priority: 0.7,
        })),
      ),
    )
  ).flat();
  const [enProjects, viProjects] = await Promise.all([
    getPortfolioProjects("en"),
    getPortfolioProjects("vi"),
  ]);
  const projectPages: MetadataRoute.Sitemap = (
    [
      [enProjects, viProjects],
      [viProjects, enProjects],
    ] as const
  ).flatMap(([projects, translated]) =>
    projects
      .filter((project) => !project.id.startsWith("styling-"))
      .map((project) => {
        const alternate = translatedProject(project, translated);
        const language = project.href.startsWith("/en/") ? "en" : "vi";
        return {
          url: `${BASE_URL}${project.href}`,
          ...(alternate
            ? {
                alternates: {
                  languages: {
                    [language]: `${BASE_URL}${project.href}`,
                    [language === "en" ? "vi" : "en"]:
                      `${BASE_URL}${alternate.href}`,
                  },
                },
              }
            : {}),
          changeFrequency: "weekly" as const,
          priority: 0.7,
        };
      }),
  );
  if (!stylingIsPublic) return [...existing, ...rooms, ...projectPages];
  const styling: MetadataRoute.Sitemap = (
    [
      ["en", enProjects],
      ["vi", viProjects],
    ] as const
  ).flatMap(([locale, projects]) =>
    [
      `/${locale}/styling`,
      ...projects
        .filter((project) => project.id.startsWith("styling-"))
        .map((project) => project.href),
    ].map((path) => {
      const otherLocale = locale === "en" ? "vi" : "en";
      const otherPath = `/${otherLocale}${path.slice(locale.length + 1)}`;
      return {
        url: `${BASE_URL}${path}`,
        alternates: {
          languages: {
            [locale]: `${BASE_URL}${path}`,
            [otherLocale]: `${BASE_URL}${otherPath}`,
          },
        },
      };
    }),
  );
  return [...existing, ...rooms, ...projectPages, ...styling];
}

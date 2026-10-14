import type { MetadataRoute } from "next";
import { getRentalRooms } from "@/app/lib/studio-rental/rooms";
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
  if (!stylingIsPublic) return [...existing, ...rooms];
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
  return [...existing, ...rooms, ...styling.flat()];
}

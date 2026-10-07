import { cache } from "react";
import seed from "@/app/lib/studio-discovery/seed.json";
import type { StudioDiscovery } from "@/app/lib/studio-discovery/types";
import type { Locale } from "@/app/types";

export const getStudioDiscovery = cache(
  async (locale: Locale): Promise<StudioDiscovery> => {
    if (locale !== "en" && locale !== "vi")
      throw new Error("Unsupported discovery locale");
    if (process.env.STUDIO_DISCOVERY_SOURCE !== "cms") {
      if (process.env.VERCEL_ENV === "production") {
        throw new Error(
          "Production studio discovery requires STUDIO_DISCOVERY_SOURCE=cms",
        );
      }
      return seed[locale] as StudioDiscovery;
    }

    const origin =
      process.env.STUDIO_DISCOVERY_STRAPI_URL ||
      process.env.NEXT_PUBLIC_STRAPI_URL ||
      "https://strapi.saint6.studio";
    const token =
      process.env.STUDIO_DISCOVERY_STRAPI_TOKEN ||
      (!process.env.STUDIO_DISCOVERY_STRAPI_URL
        ? process.env.STRAPI_API_TOKEN
        : undefined);
    const query = new URLSearchParams({
      locale,
      status: "published",
      "populate[pages]": "true",
      "populate[navigation_links]": "true",
      "populate[floorplan][populate][image]": "true",
      "populate[room_summaries]": "true",
      "populate[spec_labels]": "true",
      "populate[stats_labels]": "true",
      "populate[workshops]": "true",
    });
    const response = await fetch(`${origin}/api/studio-discovery?${query}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      next: { revalidate: 300, tags: ["studio-discovery"] },
    });
    if (!response.ok)
      throw new Error(
        `Studio discovery CMS request failed (${response.status})`,
      );
    const { data } = (await response.json()) as {
      data: StudioDiscovery | null;
    };
    if (
      !data?.pages?.length ||
      !data.floorplan?.image?.url ||
      !data.spec_labels ||
      !data.stats_labels ||
      !data.room_summaries ||
      !data.room_inclusions ||
      !data.currency ||
      !data.workshops ||
      !data.navigation_links?.length
    ) {
      throw new Error(
        `Published studio discovery content is incomplete (${locale})`,
      );
    }
    for (const expected of seed[locale].pages) {
      const pages = data.pages.filter((page) => page.path === expected.path);
      if (
        pages.length !== 1 ||
        !pages[0].seo_title ||
        !pages[0].seo_description
      ) {
        throw new Error(
          `Studio discovery metadata is incomplete (${locale}/${expected.path})`,
        );
      }
    }
    return {
      ...data,
      floorplan: {
        ...data.floorplan,
        image: {
          ...data.floorplan.image,
          url: new URL(data.floorplan.image.url, origin).href,
        },
      },
    };
  },
);

export async function getDiscoveryPage(locale: Locale, path = "") {
  const content = await getStudioDiscovery(locale);
  return content.pages.find((page) => page.path === (path || "home"));
}

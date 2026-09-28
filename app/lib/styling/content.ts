import { cache } from "react";
import seed from "./seed.json";
import type { StylingContent, StylingImage, StylingLocale } from "./types";

export const stylingEnabled =
  process.env.NEXT_PUBLIC_STYLING_ENABLED === "true";
export const stylingIsPublic =
  process.env.VERCEL_ENV === "production" && stylingEnabled;
export const stylingOrigin = "https://www.saint6.studio";

function media(image: StylingImage, origin: string): StylingImage {
  if (!image?.url || !image.width || !image.height)
    throw new Error("Styling content is missing image metadata");
  return { ...image, url: new URL(image.url, origin).href };
}

// No silent seed fallback in CMS mode: ISR must retain its last successful render
// if the CMS is unavailable, rather than replacing editorial changes with the draft.
export const getStylingContent = cache(
  async (locale: StylingLocale): Promise<StylingContent> => {
    if (process.env.STYLING_CONTENT_SOURCE !== "cms") {
      if (stylingIsPublic)
        throw new Error("Public styling requires STYLING_CONTENT_SOURCE=cms");
      return { page: seed.pages[locale], projects: seed.projects[locale] };
    }
    const origin =
      process.env.STYLING_STRAPI_URL ||
      process.env.NEXT_PUBLIC_STRAPI_URL ||
      "https://strapi.saint6.studio";
    const token =
      process.env.STYLING_STRAPI_TOKEN || process.env.STRAPI_API_TOKEN;
    async function read(endpoint: string, params: Record<string, string>) {
      const query = new URLSearchParams({
        locale,
        status: "published",
        ...params,
      });
      const response = await fetch(`${origin}/api/${endpoint}?${query}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        next: { revalidate: 300, tags: ["styling"] },
      });
      if (!response.ok)
        throw new Error(`Styling CMS request failed (${response.status})`);
      return response.json();
    }
    const projectParams = {
      "populate[cover]": "true",
      "populate[gallery][populate][image]": "true",
      "populate[credits]": "true",
      "sort[0]": "sort_order:asc",
      "sort[1]": "slug:asc",
      "pagination[pageSize]": "100",
    };
    const [pageResult, projectResult] = await Promise.all([
      read("styling-page", {
        "populate[hero_image]": "true",
        "populate[hero_mobile_image]": "true",
        "populate[hero_panels][populate][image]": "true",
        "populate[clients][populate][logo]": "true",
        "populate[services]": "true",
        "populate[process]": "true",
        "populate[faqs]": "true",
      }),
      read("styling-projects", { ...projectParams, "pagination[page]": "1" }),
    ]);
    const page: StylingContent["page"] = pageResult.data;
    const projects: StylingContent["projects"] = [
      ...(projectResult.data || []),
    ];
    for (
      let nextPage = 2;
      nextPage <= (projectResult.meta?.pagination?.pageCount || 1);
      nextPage++
    ) {
      const next = await read("styling-projects", {
        ...projectParams,
        "pagination[page]": String(nextPage),
      });
      if (!Array.isArray(next.data) || !next.data.length)
        throw new Error("Incomplete styling project pagination");
      projects.push(...next.data);
    }
    if (
      !page?.hero_heading ||
      !page.intro_title ||
      !Array.isArray(page.services) ||
      !Array.isArray(page.process) ||
      !Array.isArray(page.faqs) ||
      !Array.isArray(projects)
    ) {
      throw new Error(`Incomplete published styling content for ${locale}`);
    }
    if (projectResult.meta?.pagination?.total > projects.length)
      throw new Error("Incomplete styling project pagination");
    return {
      page: {
        ...page,
        hero_panels: page.hero_panels?.map((panel) => ({
          ...panel,
          image: media(panel.image, origin),
        })),
        hero_mobile_image: page.hero_mobile_image
          ? media(page.hero_mobile_image, origin)
          : null,
        clients: page.clients?.map((client) => ({
          ...client,
          logo: media(client.logo, origin),
        })),
        hero_image: {
          ...media(page.hero_image, origin),
          alternativeText: page.hero_alt || page.hero_image.alternativeText,
        },
      },
      projects: projects.map((project) => {
        if (
          !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(project.slug) ||
          !project.title ||
          !Array.isArray(project.gallery) ||
          !Array.isArray(project.credits)
        )
          throw new Error("Incomplete styling project");
        return {
          ...project,
          cover: {
            ...media(project.cover, origin),
            alternativeText: project.cover_alt || project.cover.alternativeText,
          },
          gallery: project.gallery.map((item) => ({
            ...item,
            image: media(item.image, origin),
          })),
        };
      }),
    };
  },
);

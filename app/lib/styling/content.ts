import { cache } from "react";
import seed from "./seed.json";
import type {
  SharedContactContent,
  StylingContent,
  StylingImage,
  StylingLocale,
  StylingPage,
  StylingProject,
} from "./types";

export const stylingEnabled =
  process.env.NEXT_PUBLIC_STYLING_ENABLED === "true";
export const stylingIsPublic =
  process.env.VERCEL_ENV === "production" && stylingEnabled;
export const stylingOrigin = "https://www.saint6.studio";
export const stylingShareOrigin =
  process.env.VERCEL_ENV === "preview" && process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : stylingOrigin;

function cmsMode() {
  if (process.env.STYLING_CONTENT_SOURCE === "cms") return true;
  if (stylingIsPublic)
    throw new Error("Public styling requires STYLING_CONTENT_SOURCE=cms");
  return false;
}
function cmsOrigin() {
  return (
    process.env.STYLING_STRAPI_URL ||
    process.env.NEXT_PUBLIC_STRAPI_URL ||
    "https://strapi.saint6.studio"
  );
}
export function stylingMedia(
  image: StylingImage,
  origin = cmsOrigin(),
): StylingImage {
  if (!image?.url || !image.width || !image.height)
    throw new Error("Styling content is missing image metadata");
  return { ...image, url: new URL(image.url, origin).href };
}
async function read(
  locale: StylingLocale,
  endpoint: string,
  params: Record<string, string>,
) {
  const token =
    process.env.STYLING_STRAPI_TOKEN ||
    (!process.env.STYLING_STRAPI_URL
      ? process.env.STRAPI_API_TOKEN
      : undefined);
  const query = new URLSearchParams({ locale, status: "published", ...params });
  const response = await fetch(`${cmsOrigin()}/api/${endpoint}?${query}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    next: { revalidate: 300, tags: ["styling"] },
  });
  if (!response.ok)
    throw new Error(`Styling CMS request failed (${response.status})`);
  return response.json();
}
function social<T extends { social_image?: StylingImage | null }>(data: T): T {
  return {
    ...data,
    social_image: data.social_image ? stylingMedia(data.social_image) : null,
  };
}
export const getStylingPage = cache(
  async (locale: StylingLocale): Promise<StylingPage> => {
    if (!cmsMode()) return seed.pages[locale];
    const { data } = await read(locale, "styling-page", {
      "populate[hero_image]": "true",
      "populate[founder_image]": "true",
      "populate[hero_mobile_image]": "true",
      "populate[social_image]": "true",
      "populate[hero_panels][populate][image]": "true",
      "populate[clients][populate][logo]": "true",
      "populate[services]": "true",
      "populate[process]": "true",
      "populate[faqs]": "true",
    });
    const page = data as StylingPage;
    if (
      !page?.hero_heading ||
      !page.intro_title ||
      !Array.isArray(page.services) ||
      !Array.isArray(page.process) ||
      !Array.isArray(page.faqs)
    ) {
      throw new Error(`Incomplete published styling content for ${locale}`);
    }
    return social({
      ...page,
      founder_image: page.founder_image
        ? stylingMedia(page.founder_image)
        : null,
      hero_panels: page.hero_panels?.map((p) => ({
        ...p,
        image: stylingMedia(p.image),
      })),
      hero_mobile_image: page.hero_mobile_image
        ? stylingMedia(page.hero_mobile_image)
        : null,
      clients: page.clients?.map((c) => ({ ...c, logo: stylingMedia(c.logo) })),
      hero_image: {
        ...stylingMedia(page.hero_image),
        alternativeText: page.hero_alt || page.hero_image.alternativeText,
      },
    });
  },
);
const summaryFields = [
  "slug",
  "title",
  "category",
  "category_key",
  "featured",
  "summary",
  "cover_alt",
  "sort_order",
  "seo_title",
  "seo_description",
  "updatedAt",
];
const fullPopulate = {
  "populate[cover]": "true",
  "populate[social_image]": "true",
  "populate[gallery][populate][image]": "true",
  "populate[credits]": "true",
};
function projectRecord(project: StylingProject, full: boolean): StylingProject {
  if (
    !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(project.slug) ||
    !project.title ||
    (full &&
      (!Array.isArray(project.gallery) || !Array.isArray(project.credits)))
  ) {
    throw new Error("Incomplete styling project");
  }
  return social({
    ...project,
    body: project.body || "",
    credits: project.credits || [],
    cover: {
      ...stylingMedia(project.cover),
      alternativeText: project.cover_alt || project.cover.alternativeText,
    },
    gallery: (project.gallery || []).map((g) => ({
      ...g,
      image: stylingMedia(g.image),
    })),
  });
}
const readProjects = cache(
  async (locale: StylingLocale, full: boolean): Promise<StylingProject[]> => {
    if (!cmsMode()) return seed.projects[locale];
    const params: Record<string, string> = {
      ...(full
        ? fullPopulate
        : {
            "populate[cover]": "true",
            ...Object.fromEntries(
              summaryFields.map((field, i) => [`fields[${i}]`, field]),
            ),
          }),
      "sort[0]": "sort_order:asc",
      "sort[1]": "slug:asc",
      "pagination[pageSize]": "100",
    };
    const first = await read(locale, "styling-projects", {
      ...params,
      "pagination[page]": "1",
    });
    if (!Array.isArray(first.data))
      throw new Error("Incomplete styling project pagination");
    const projects = [...first.data];
    for (let n = 2; n <= (first.meta?.pagination?.pageCount || 1); n++) {
      const result = await read(locale, "styling-projects", {
        ...params,
        "pagination[page]": String(n),
      });
      if (!Array.isArray(result.data) || !result.data.length)
        throw new Error("Incomplete styling project pagination");
      projects.push(...result.data);
    }
    if (first.meta?.pagination?.total > projects.length)
      throw new Error("Incomplete styling project pagination");
    if (new Set(projects.map((p) => p.slug)).size !== projects.length)
      throw new Error("Duplicate styling project URLs");
    return projects.map((p) => projectRecord(p, full));
  },
);
export const getStylingProjectSummaries = (locale: StylingLocale) =>
  readProjects(locale, false);
export const getStylingProject = cache(
  async (
    locale: StylingLocale,
    slug: string,
  ): Promise<StylingProject | null> => {
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) return null;
    if (!cmsMode())
      return seed.projects[locale].find((p) => p.slug === slug) || null;
    const result = await read(locale, "styling-projects", {
      ...fullPopulate,
      "filters[slug][$eq]": slug,
      "pagination[pageSize]": "2",
    });
    if (!Array.isArray(result.data))
      throw new Error("Incomplete styling project response");
    if (result.data.length > 1)
      throw new Error("Duplicate styling project URLs");
    return result.data[0] ? projectRecord(result.data[0], true) : null;
  },
);
// Full export remains available for import verification. Pages use lightweight lists.
export const getStylingContent = cache(
  async (locale: StylingLocale): Promise<StylingContent> => {
    const [page, projects] = await Promise.all([
      getStylingPage(locale),
      readProjects(locale, true),
    ]);
    return { page, projects };
  },
);
export const getSharedContactContent = cache(
  async (locale: StylingLocale): Promise<SharedContactContent> => {
    if (!cmsMode()) return seed.contactSections[locale];
    const { data } = await read(locale, "shared-contact", {
      "populate[image]": "true",
    });
    if (!data?.heading || !data.text || !data.form_title || !data.form_subtitle)
      throw new Error(`Shared contact section is not published in ${locale}`);
    return { ...data, image: stylingMedia(data.image) };
  },
);

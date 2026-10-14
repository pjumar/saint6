import { cache } from "react";
import { driveStylingProjects } from "./drive-projects";
import { featuredStylingProjects } from "./featured-projects";
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
    next: { revalidate: 3600, tags: ["styling"] },
  });
  if (!response.ok) {
    const body =
      response.status === 400 ? await response.json().catch(() => null) : null;
    const error = new Error(`Styling CMS request failed (${response.status})`);
    if (typeof body?.error?.details?.key === "string")
      Object.assign(error, { invalidKey: body.error.details.key });
    throw error;
  }
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
let videoFilesUnsupportedUntil = 0;
let thumbnailUnsupportedUntil = 0;
function invalidKey(error: unknown, key: string) {
  return (
    error instanceof Error && "invalidKey" in error && error.invalidKey === key
  );
}
async function readFullProject(
  locale: StylingLocale,
  params: Record<string, string>,
) {
  const base = { ...fullPopulate, ...params };
  if (Date.now() < videoFilesUnsupportedUntil)
    return read(locale, "styling-projects", base);
  try {
    return await read(locale, "styling-projects", {
      ...base,
      "populate[video_files]": "true",
    });
  } catch (error) {
    if (!invalidKey(error, "video_files")) throw error;
    // The website can deploy before Strapi Cloud finishes adding this field.
    // Retry the old schema and probe again after its normal one-hour cache window.
    videoFilesUnsupportedUntil = Date.now() + 3600_000;
    return read(locale, "styling-projects", base);
  }
}
async function readProjectPage(
  locale: StylingLocale,
  full: boolean,
  params: Record<string, string>,
) {
  const request = (query: Record<string, string>) =>
    full
      ? readFullProject(locale, query)
      : read(locale, "styling-projects", query);
  if (Date.now() < thumbnailUnsupportedUntil) return request(params);
  try {
    return await request({ ...params, "populate[thumbnail]": "true" });
  } catch (error) {
    if (!invalidKey(error, "thumbnail")) throw error;
    // Allow the website and Strapi schema to deploy independently.
    thumbnailUnsupportedUntil = Date.now() + 3600_000;
    return request(params);
  }
}
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
    thumbnail: project.thumbnail
      ? {
          ...stylingMedia(project.thumbnail),
          alternativeText: project.thumbnail.alternativeText || project.title,
        }
      : null,
    gallery: (project.gallery || []).map((g) => ({
      ...g,
      image: stylingMedia(g.image),
    })),
    local_videos: (project.video_files || []).map(
      (video) => new URL(video.url, cmsOrigin()).href,
    ),
  });
}
const readProjects = cache(
  async (locale: StylingLocale, full: boolean): Promise<StylingProject[]> => {
    if (!cmsMode()) return mergeFeatured(locale, seed.projects[locale]);
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
    const firstParams = {
      ...params,
      "pagination[page]": "1",
    };
    const first = await readProjectPage(locale, full, firstParams);
    if (!Array.isArray(first.data))
      throw new Error("Incomplete styling project pagination");
    const projects = [...first.data];
    for (let n = 2; n <= (first.meta?.pagination?.pageCount || 1); n++) {
      const pageParams = {
        ...params,
        "pagination[page]": String(n),
      };
      const result = await readProjectPage(locale, full, pageParams);
      if (!Array.isArray(result.data) || !result.data.length)
        throw new Error("Incomplete styling project pagination");
      projects.push(...result.data);
    }
    if (first.meta?.pagination?.total > projects.length)
      throw new Error("Incomplete styling project pagination");
    if (new Set(projects.map((p) => p.slug)).size !== projects.length)
      throw new Error("Duplicate styling project URLs");
    return mergeFeatured(
      locale,
      projects.map((p) => projectRecord(p, full)),
    );
  },
);
function mergeFeatured(locale: StylingLocale, projects: StylingProject[]) {
  const slugs = new Set(projects.map((project) => project.slug));
  const localProjects = [
    ...featuredStylingProjects[locale],
    ...driveStylingProjects[locale],
  ];
  return [
    ...localProjects.filter((project) => !slugs.has(project.slug)),
    ...projects,
  ];
}
export const getStylingProjectSummaries = (locale: StylingLocale) =>
  readProjects(locale, false);
export const getStylingProject = cache(
  async (
    locale: StylingLocale,
    slug: string,
  ): Promise<StylingProject | null> => {
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) return null;
    const featured = [
      ...featuredStylingProjects[locale],
      ...driveStylingProjects[locale],
    ].find((p) => p.slug === slug);
    if (!cmsMode())
      return (
        featured || seed.projects[locale].find((p) => p.slug === slug) || null
      );
    const result = await readProjectPage(locale, true, {
      "filters[slug][$eq]": slug,
      "pagination[pageSize]": "2",
    });
    if (!Array.isArray(result.data))
      throw new Error("Incomplete styling project response");
    if (result.data.length > 1)
      throw new Error("Duplicate styling project URLs");
    if (!result.data[0]) return featured || null;
    const cmsProject = projectRecord(result.data[0], true);
    return result.data[0].video_files === undefined && featured?.local_videos
      ? { ...cmsProject, local_videos: featured.local_videos }
      : cmsProject;
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

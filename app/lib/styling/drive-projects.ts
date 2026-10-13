import entries from "./drive-projects.json";
import type { StylingLocale, StylingProject } from "./types";

const mediaRoot = "Saint 6 Studio project";

function localProjects(locale: StylingLocale): StylingProject[] {
  return entries
    .filter((entry) => entry.slug !== "2-ngay-1-dem-vietnam")
    .map((entry, index) => {
      const title = entry.title[locale];
      const images = entry.images.map((image, imageIndex) => ({
        ...image,
        alternativeText: `${title} — ${mediaRoot} image ${imageIndex + 1}`,
      }));
      const [cover, ...galleryImages] = images;
      if (!cover) throw new Error(`Missing project cover: ${entry.slug}`);
      return {
        slug: entry.slug,
        title,
        category: entry.category[locale],
        category_key: entry.category_key,
        featured: index < 5,
        summary: entry.summary[locale],
        body: entry.body[locale],
        cover,
        gallery: galleryImages.map((image) => ({
          image,
          alt: image.alternativeText,
        })),
        credits: entry.credits[locale],
        local_videos: entry.videos,
        source_url: "",
        sort_order: index,
        seo_title: `${title} | Saint 6 Studio`,
        seo_description: entry.summary[locale],
      };
    });
}

export const driveStylingProjects: Record<StylingLocale, StylingProject[]> = {
  en: localProjects("en"),
  vi: localProjects("vi"),
};

import type { StylingProject } from "./types";

export const squareArtworkBackgrounds: Record<string, string> = {
  "elise-pure-urban-chic-lookbook": "#f8f7f3",
  "mb-priflexi-hoa-minzy": "linear-gradient(180deg, #347bc8 0%, #0a2a6e 100%)",
};

export function projectThumbnail(project: StylingProject) {
  const image = project.thumbnail || project.cover;
  const contain = !!project.thumbnail && image.width / image.height >= 0.95;
  return {
    image,
    fit: contain ? ("contain" as const) : undefined,
    background: contain
      ? squareArtworkBackgrounds[project.slug] || "#e8e4e2"
      : undefined,
    ratio: contain ? 4 / 5 : image.width / image.height,
  };
}

import type { StylingLocale, StylingProject } from "./types";

export const portfolioCategories = {
  commercial: { en: "Campaigns", vi: "Quảng cáo" },
  celebrity: { en: "Celebrity", vi: "Nghệ sĩ" },
  editorial: { en: "Editorial", vi: "Tạp chí" },
  lookbook: { en: "Lookbooks", vi: "Lookbook" },
  music: { en: "Music & film", vi: "Âm nhạc & phim" },
  personal: { en: "Personal", vi: "Cá nhân" },
} as const;
export const portfolioPageSize = 18;
export function searchText(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase();
}
export function portfolioResults(
  projects: StylingProject[],
  category: string,
  query: string,
  requestedPage: string,
) {
  const term = searchText(query.trim());
  const filtered = projects.filter(
    (p) =>
      (!category || p.category_key === category) &&
      (!term ||
        searchText(`${p.title} ${p.category} ${p.summary}`).includes(term)),
  );
  const totalPages = Math.max(
    1,
    Math.ceil(filtered.length / portfolioPageSize),
  );
  const page = Math.min(
    totalPages,
    Math.max(1, Number.parseInt(requestedPage, 10) || 1),
  );
  return {
    projects: filtered.slice(
      (page - 1) * portfolioPageSize,
      page * portfolioPageSize,
    ),
    total: filtered.length,
    totalPages,
    page,
  };
}
export function portfolioHref(
  locale: StylingLocale,
  category = "",
  query = "",
  page = 1,
) {
  const params = new URLSearchParams();
  if (category) params.set("category", category);
  if (query) params.set("q", query);
  if (page > 1) params.set("page", String(page));
  return `/${locale}/styling/projects${params.size ? `?${params}` : ""}#portfolio-results`;
}

import { searchText } from "@/app/lib/styling/portfolio";

const unnamedTitles = new Set([
  "by saint 6",
  "set decor",
  "set design",
  "villa",
  "collection reveal",
  "spring collection reveal",
  "vip gala evening",
  "contemporary art opening",
  "annual awards ceremony",
]);

export function hasProjectName(title: string | null | undefined): boolean {
  const normalized = searchText((title || "").normalize("NFKD"))
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
  return Boolean(normalized) && !unnamedTitles.has(normalized);
}

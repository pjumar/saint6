import type { Locale } from "@/app/types";

export function getLocalizedPath(path: string, locale: Locale): string {
  const cleanPath = path.startsWith("/") ? path.slice(1) : path;
  return `/${locale}${cleanPath ? `/${cleanPath}` : ""}`;
}

export function switchLocale(currentPath: string, newLocale: Locale): string {
  const pathWithoutLocale = currentPath.replace(/^\/(en|vi)/, "") || "/";
  return `/${newLocale}${pathWithoutLocale === "/" ? "" : pathWithoutLocale}`;
}


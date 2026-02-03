/**
 * Server-side translations utility for Server Components.
 * Use this for static generation where we can't use React Context.
 */

import enTranslations from "@/app/translations/en.json";
import viTranslations from "@/app/translations/vi.json";

export type Translations = typeof enTranslations;

/**
 * Get translations for a given locale (server-side).
 * Used in Server Components for static generation.
 */
export function getTranslations(locale: string): Translations {
  return locale === "vi" ? viTranslations : enTranslations;
}

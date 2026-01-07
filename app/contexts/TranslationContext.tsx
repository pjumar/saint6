"use client";

import { createContext, useContext, type ReactNode } from "react";
import { useParams, usePathname } from "next/navigation";
import enTranslations from "@/app/translations/en.json";
import viTranslations from "@/app/translations/vi.json";
import type { Locale } from "@/app/types";

type Language = "EN" | "VI";

type Translations = typeof enTranslations;

interface TranslationContextType {
  locale: Locale;
  language: Language;
  t: Translations;
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

export function TranslationProvider({
  children,
  locale: initialLocale,
}: {
  children: ReactNode;
  locale: Locale;
}) {
  const params = useParams();
  const pathname = usePathname();
  const locale = (params?.locale as Locale) || initialLocale || "en";
  const language: Language = locale === "vi" ? "VI" : "EN";
  const translations: Translations = locale === "vi" ? viTranslations : enTranslations;

  return (
    <TranslationContext.Provider value={{ locale, language, t: translations }}>
      {children}
    </TranslationContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(TranslationContext);
  if (context === undefined) {
    throw new Error("useTranslation must be used within a TranslationProvider");
  }
  return context;
}


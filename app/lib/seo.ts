import type { Metadata } from "next";
import { FALLBACK_SEO } from "@/app/lib/fallback";
import {
  getSeoMetadata,
  getStrapiImageUrl,
  type StrapiHero,
} from "@/app/lib/strapi";
import type { Locale } from "@/app/types";
import { getDiscoveryPage } from "@/app/lib/studio-discovery/content";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://www.saint6.studio";

interface PageSeoInput {
  hero?: StrapiHero;
  description?: string;
  locale: Locale;
  path?: string;
}

export async function buildPageMetadata({
  hero,
  description,
  locale,
  path = "",
}: PageSeoInput): Promise<Metadata> {
  const [seo, page] = await Promise.all([
    getSeoMetadata(locale),
    getDiscoveryPage(locale, path),
  ]);
  const lang = locale === "vi" ? "vi" : "en";
  const isVi = locale === "vi";

  const siteName = seo?.site_name || FALLBACK_SEO.site_name;
  const heroHeading = hero?.heading;
  const brandedTitle =
    page?.seo_title ||
    (heroHeading ? `${siteName} | ${heroHeading}` : FALLBACK_SEO.title[lang]);
  const desc =
    page?.seo_description ||
    description ||
    seo?.description ||
    FALLBACK_SEO.description[lang];
  const heroImageUrl = hero?.background_image
    ? getStrapiImageUrl(hero.background_image)
    : null;
  const imageUrl =
    heroImageUrl || getStrapiImageUrl(seo?.og_image) || FALLBACK_SEO.og_image;

  // OG images require absolute URLs
  const absoluteImageUrl = imageUrl.startsWith("/")
    ? `${SITE_URL}${imageUrl}`
    : imageUrl;

  const pagePath = path ? `/${path}` : "";

  return {
    title: { absolute: brandedTitle },
    description: desc,
    alternates: {
      canonical: `${SITE_URL}/${locale}${pagePath}`,
      languages: {
        en: `${SITE_URL}/en${pagePath}`,
        vi: `${SITE_URL}/vi${pagePath}`,
      },
    },
    openGraph: {
      type: "website",
      url: `${SITE_URL}/${locale}${pagePath}`,
      locale: isVi ? "vi_VN" : "en_US",
      siteName,
      title: brandedTitle,
      description: desc,
      images: [
        {
          url: absoluteImageUrl,
          width: 1200,
          height: 630,
          alt: brandedTitle,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: brandedTitle,
      description: desc,
      images: [absoluteImageUrl],
    },
  };
}

import { createHash } from "node:crypto";
import type { Metadata } from "next";
import { stylingIsPublic, stylingOrigin, stylingShareOrigin } from "./content";
import type { StylingImage, StylingLocale } from "./types";

export function stylingMetadata(
  locale: StylingLocale,
  path: string,
  title: string,
  description: string,
  image: StylingImage,
  socialImage?: StylingImage | null,
  socialAlt?: string,
): Metadata {
  const url = `${stylingOrigin}/${locale}/styling${path}`;
  const slug = path.split("?")[0].slice(1);
  const cardQuery = new URLSearchParams({
    locale,
    ...(slug && slug !== "projects" ? { slug } : {}),
    // A new image URL lets sharing services refresh changed copy or artwork.
    v: `2-${createHash("sha256")
      .update(JSON.stringify([title, description, image.url]))
      .digest("hex")
      .slice(0, 12)}`,
  });
  const imageUrl = socialImage
    ? new URL(socialImage.url, stylingShareOrigin).href
    : `${stylingShareOrigin}/api/styling/social?${cardQuery}`;
  return {
    title: { absolute: title },
    description,
    alternates: {
      canonical: url,
      languages: {
        en: `${stylingOrigin}/en/styling${path}`,
        vi: `${stylingOrigin}/vi/styling${path}`,
        "x-default": `${stylingOrigin}/vi/styling${path}`,
      },
    },
    robots: { index: stylingIsPublic, follow: stylingIsPublic },
    openGraph: {
      type: "website",
      title,
      description,
      url: `${stylingShareOrigin}/${locale}/styling${path}`,
      siteName: "Saint 6 Studio",
      locale: locale === "vi" ? "vi_VN" : "en_US",
      images: [
        {
          url: imageUrl,
          ...(!socialImage ? { type: "image/png" } : {}),
          width: socialImage?.width || 1200,
          height: socialImage?.height || 630,
          alt:
            socialAlt ||
            socialImage?.alternativeText ||
            `${title} — ${image.alternativeText}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
  };
}
export function StylingStructuredData({
  value,
}: {
  value: Record<string, unknown>;
}) {
  return (
    <script
      type="application/ld+json"
      // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD is serialized with < escaped, preventing script termination.
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(value).replace(/</g, "\\u003c"),
      }}
    />
  );
}

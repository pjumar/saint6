import type { Metadata } from "next";
import { stylingIsPublic, stylingOrigin } from "./content";
import type { StylingImage, StylingLocale } from "./types";

export function stylingMetadata(
  locale: StylingLocale,
  path: string,
  title: string,
  description: string,
  image: StylingImage,
): Metadata {
  const url = `${stylingOrigin}/${locale}/styling${path}`;
  const imageUrl = new URL(image.url, stylingOrigin).href;
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
      url,
      siteName: "Saint 6 Studio",
      locale: locale === "vi" ? "vi_VN" : "en_US",
      images: [
        {
          url: imageUrl,
          width: image.width,
          height: image.height,
          alt: image.alternativeText,
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

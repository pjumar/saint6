import type {
  StrapiContactInfo,
  StrapiFooter,
  StrapiSeoMetadata,
  StrapiSocialLink,
} from "@/app/lib/strapi";
import { getStrapiImageUrl } from "@/app/lib/strapi";
import type { Locale } from "@/app/types";

export const businessOrigin = "https://www.saint6.studio";
export const businessId = `${businessOrigin}/#studio`;
const websiteId = `${businessOrigin}/#website`;

type StructuredNode = Record<string, unknown>;

export function businessStructuredData({
  locale,
  seo,
  footer,
  contact,
  social,
  description,
}: {
  locale: Locale;
  seo: StrapiSeoMetadata | null;
  footer: StrapiFooter | null;
  contact?: StrapiContactInfo;
  social: StrapiSocialLink | null;
  description?: string;
}): StructuredNode | null {
  const name = seo?.site_name;
  const streetAddress = contact?.address_line_1 || footer?.address;
  if (!name || !streetAddress) return null;

  const phones = (footer?.phone || contact?.phone || "")
    .split(/\s*[-–—/]\s*/)
    .map((phone) => phone.replace(/[^\d+]/g, ""))
    .filter((phone) => /^(?:0\d{9}|\+84\d{9})$/.test(phone))
    .map((phone) => (phone.startsWith("0") ? `+84${phone.slice(1)}` : phone));
  const sameAs = [
    social?.facebook_url,
    social?.instagram_url,
    social?.tiktok_url,
  ].filter((url): url is string => Boolean(url && /^https?:\/\//.test(url)));
  const image = getStrapiImageUrl(seo?.og_image);

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "LocalBusiness",
        "@id": businessId,
        name,
        url: `${businessOrigin}/${locale}`,
        ...(description ? { description } : {}),
        address: {
          "@type": "PostalAddress",
          streetAddress,
          ...(contact?.address_line_2
            ? { addressLocality: contact.address_line_2 }
            : {}),
          addressCountry: "VN",
        },
        ...(phones.length ? { telephone: phones } : {}),
        ...(footer?.email || contact?.email
          ? { email: footer?.email || contact?.email }
          : {}),
        ...(sameAs.length ? { sameAs } : {}),
        ...(image ? { image: new URL(image, businessOrigin).href } : {}),
      },
      {
        "@type": "WebSite",
        "@id": websiteId,
        url: businessOrigin,
        name,
        inLanguage: ["en", "vi"],
        publisher: { "@id": businessId },
      },
    ],
  };
}

export interface RentalOffer {
  key: string;
  name: string;
  description?: string;
  pricePerHour: string;
  imageUrl?: string;
  anchor: "rooms" | "full-studio";
}

// Published rates are whole VND amounts. Never turn arbitrary copy into a price.
export function hourlyVndPrice(value: string): number | null {
  const input = value.trim();
  if (!/^(?:\d+|\d{1,3}(?:[, .]\d{3})+)$/.test(input)) return null;
  const price = Number(input.replace(/[, .]/g, ""));
  return Number.isSafeInteger(price) && price > 0 ? price : null;
}

export function serviceStructuredData({
  locale,
  path,
  name,
  description,
  imageUrl,
  rentalOffers,
  currency,
}: {
  locale: Locale;
  path: "studio-rental" | "production";
  name: string;
  description: string;
  imageUrl?: string;
  rentalOffers?: RentalOffer[];
  currency?: string;
}): StructuredNode {
  const url = `${businessOrigin}/${locale}/${path}`;
  const serviceId = `${businessOrigin}/#service-${path}`;
  const offers =
    currency === "VND"
      ? (rentalOffers || []).flatMap((offer) => {
          const price = hourlyVndPrice(offer.pricePerHour);
          if (price === null) return [];
          return [
            {
              "@type": "Offer",
              "@id": `${url}#offer-${encodeURIComponent(offer.key)}`,
              name: offer.name,
              url: `${url}#${offer.anchor}`,
              seller: { "@id": businessId },
              priceSpecification: {
                "@type": "UnitPriceSpecification",
                price,
                priceCurrency: "VND",
                referenceQuantity: {
                  "@type": "QuantitativeValue",
                  value: 1,
                  unitCode: "HUR",
                },
              },
              itemOffered: {
                "@type": "Service",
                name: offer.name,
                ...(offer.description
                  ? { description: offer.description }
                  : {}),
                ...(offer.imageUrl
                  ? { image: new URL(offer.imageUrl, businessOrigin).href }
                  : {}),
                provider: { "@id": businessId },
              },
            },
          ];
        })
      : [];

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        "@id": serviceId,
        name,
        description,
        url,
        provider: { "@id": businessId },
        ...(imageUrl ? { image: new URL(imageUrl, businessOrigin).href } : {}),
        ...(offers.length ? { offers } : {}),
        mainEntityOfPage: { "@id": `${url}#webpage` },
      },
      {
        "@type": "WebPage",
        "@id": `${url}#webpage`,
        url,
        name,
        description,
        inLanguage: locale,
        isPartOf: { "@id": websiteId },
        mainEntity: { "@id": serviceId },
      },
    ],
  };
}

export function BusinessStructuredData({
  value,
}: {
  value: StructuredNode | null;
}) {
  if (!value) return null;
  return (
    <script
      type="application/ld+json"
      // biome-ignore lint/security/noDangerouslySetInnerHtml: Escape < so CMS text cannot terminate the JSON-LD script.
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(value).replace(/</g, "\\u003c"),
      }}
    />
  );
}

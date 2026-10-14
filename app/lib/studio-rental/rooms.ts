import { cache } from "react";
import { getStrapiImageUrl, getStudioRentalPage } from "@/app/lib/strapi";
import { getStudioDiscovery } from "@/app/lib/studio-discovery/content";
import type { StudioDiscovery } from "@/app/lib/studio-discovery/types";
import type { Locale } from "@/app/types";

export interface RentalRoom {
  id: string;
  href: string;
  type: "blank" | "concept";
  title: string;
  pricePerHour: string;
  counter: string;
  space: string;
  width: string;
  ceilingHeight: string;
  description: string;
  dimensions?: string;
  inclusions?: string;
  currency?: string;
  specLabels?: StudioDiscovery["spec_labels"];
  imageUrl: string;
  imageAlt: string;
  imageWidth: number;
  imageHeight: number;
  showEnterButton: true;
  gallery: { url: string; alt: string; width: number; height: number }[];
}

export const getRentalRooms = cache(
  async (locale: Locale): Promise<RentalRoom[]> => {
    const [page, english, discovery] = await Promise.all([
      getStudioRentalPage(locale),
      locale === "en" ? Promise.resolve(null) : getStudioRentalPage("en"),
      getStudioDiscovery(locale),
    ]);
    if (!page) return [];

    const current = [...(page.rooms || []), ...(page.concept_rooms || [])];
    const reference = english
      ? [...(english.rooms || []), ...(english.concept_rooms || [])]
      : current;
    const englishByPosition = new Map(
      reference.map((room) => [`${room.type}:${room.order}`, room]),
    );
    const total = current.length;

    return current
      .sort((a, b) => a.order - b.order)
      .flatMap((room, index) => {
        const source = englishByPosition.get(`${room.type}:${room.order}`);
        const cover = room.image?.url ? room.image : source?.image;
        const imageUrl = getStrapiImageUrl(cover);
        if (!imageUrl) return [];
        const rawSlug = source?.slug || room.slug || `room-${room.order}`;
        const slug = rawSlug.toLowerCase();
        const summary = discovery.room_summaries.find(
          (entry) =>
            entry.room_type === room.type &&
            entry.area_sqm === Number.parseFloat(room.space || ""),
        );
        const gallerySource = room.gallery?.length
          ? room.gallery
          : source?.gallery || [];
        const gallery = gallerySource.flatMap((image) => {
          const url = getStrapiImageUrl(image);
          return url
            ? [
                {
                  url,
                  alt: image.alternativeText || room.title,
                  width: image.width || 1200,
                  height: image.height || 800,
                },
              ]
            : [];
        });
        return [
          {
            id: slug,
            href: `/${locale}/studio-rental/rooms/${encodeURIComponent(slug)}`,
            type: room.type,
            title: room.title,
            pricePerHour: room.price_per_hour,
            counter:
              room.counter ||
              `${String(index + 1).padStart(2, "0")}/${String(total).padStart(2, "0")}`,
            space: room.space || "",
            width: room.width || "",
            ceilingHeight: room.ceiling_height || "",
            description: summary?.description || room.description || "",
            dimensions: room.dimensions,
            inclusions: room.inclusions || discovery.room_inclusions,
            currency: discovery.currency,
            specLabels: discovery.spec_labels,
            imageUrl,
            imageAlt: cover?.alternativeText || room.title,
            imageWidth: cover?.width || 1200,
            imageHeight: cover?.height || 800,
            showEnterButton: true as const,
            gallery,
          },
        ];
      });
  },
);

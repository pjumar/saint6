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
  heroImageUrl: string;
  heroImageAlt: string;
  heroImageWidth: number;
  heroImageHeight: number;
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
        // Existing gallery choices remain useful until editors set hero_image in Strapi.
        const roomKey = `${room.type}:${room.order}`;
        const localHero: Record<
          string,
          { url: string; width: number; height: number }
        > = {
          "blank:1": {
            url: "/images/room-heroes/blank-125.webp",
            width: 2048,
            height: 1537,
          },
          "blank:3": {
            url: "/images/room-heroes/blank-360.webp",
            width: 2560,
            height: 1920,
          },
        };
        const preferredHeroName: Record<string, string> = {
          "blank:2": "IMG_2087_",
          "concept:4": "R1_2_",
          "concept:5": "R2_2_",
          "concept:6": "R3_2_",
        };
        const preferred = preferredHeroName[roomKey];
        const hero = room.hero_image?.url
          ? room.hero_image
          : source?.hero_image?.url
            ? source.hero_image
            : gallerySource.find(
                (image) => preferred && image.url.includes(preferred),
              ) ||
              gallerySource.find(
                (image) => (image.width || 0) / (image.height || 1) >= 1.2,
              ) ||
              cover;
        const fallbackHero = localHero[roomKey];
        const cmsHero = room.hero_image?.url
          ? room.hero_image
          : source?.hero_image;
        const heroImageUrl =
          getStrapiImageUrl(cmsHero) ||
          fallbackHero?.url ||
          getStrapiImageUrl(hero) ||
          imageUrl;
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
            heroImageUrl,
            heroImageAlt: cmsHero?.alternativeText || room.title,
            heroImageWidth:
              cmsHero?.width || fallbackHero?.width || hero?.width || 1200,
            heroImageHeight:
              cmsHero?.height || fallbackHero?.height || hero?.height || 800,
            showEnterButton: true as const,
            gallery,
          },
        ];
      });
  },
);

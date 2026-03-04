/**
 * Update Aspect Ratios for Existing Portfolio Items
 *
 * Fetches current portfolio items (with images) from CMS,
 * reads each image's actual dimensions, and sets the closest
 * matching aspect ratio as a w{x}_h{y} enum value.
 *
 * Usage: npx tsx scripts/strapi/collections/portfolio-items/update-aspect-ratios.ts
 */

import { apiRequest } from "../../shared/api";
import type { AspectRatioEnum } from "../../shared/types";

const ASPECT_RATIOS: { enum: AspectRatioEnum; w: number; h: number }[] = [
  { enum: "w2_h3", w: 2, h: 3 },
  { enum: "w2_h5", w: 2, h: 5 },
  { enum: "w3_h2", w: 3, h: 2 },
  { enum: "w3_h4", w: 3, h: 4 },
  { enum: "w3_h5", w: 3, h: 5 },
  { enum: "w4_h3", w: 4, h: 3 },
  { enum: "w4_h5", w: 4, h: 5 },
  { enum: "w5_h4", w: 5, h: 4 },
  { enum: "w5_h7", w: 5, h: 7 },
  { enum: "w7_h9", w: 7, h: 9 },
  { enum: "w9_h16", w: 9, h: 16 },
  { enum: "w16_h9", w: 16, h: 9 },
];

function findClosestRatio(imgWidth: number, imgHeight: number): AspectRatioEnum {
  const actual = imgWidth / imgHeight;
  let closest = ASPECT_RATIOS[0];
  let minDiff = Infinity;

  for (const ratio of ASPECT_RATIOS) {
    const diff = Math.abs(ratio.w / ratio.h - actual);
    if (diff < minDiff) {
      minDiff = diff;
      closest = ratio;
    }
  }

  return closest.enum;
}

interface PortfolioEntry {
  id: number;
  documentId: string;
  title: string;
  order: number;
  page: string;
  image: {
    url: string;
    width: number;
    height: number;
  };
}

async function updateAspectRatios() {
  console.log("\nFetching portfolio items with images...");

  const result = (await apiRequest(
    "portfolio-items?pagination[pageSize]=100&sort=page:asc,order:asc&populate=image"
  )) as { data: PortfolioEntry[] };

  const items = result.data;
  console.log(`Found ${items.length} portfolio items\n`);

  let updated = 0;

  for (const item of items) {
    if (!item.image) {
      console.log(`  SKIP ${item.page} #${item.order} "${item.title}" — no image`);
      continue;
    }

    const { width, height } = item.image;
    const aspectRatio = findClosestRatio(width, height);
    const actual = (width / height).toFixed(3);

    console.log(
      `  ${item.page} #${item.order} "${item.title}" — ${width}x${height} (${actual}) -> ${aspectRatio}`
    );

    await apiRequest(`portfolio-items/${item.documentId}`, {
      method: "PUT",
      body: JSON.stringify({ data: { aspectRatio } }),
    });

    updated++;
  }

  console.log(`\nUpdated ${updated} portfolio items with aspect ratios`);
}

updateAspectRatios()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Failed to update aspect ratios:", error);
    process.exit(1);
  });

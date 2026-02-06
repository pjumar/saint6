/**
 * Seed Equipment Items
 *
 * Seeds equipment entries with both EN and VI localizations.
 *
 * Usage: npx tsx scripts/strapi/collections/equipment-items/seed.ts
 */

import { uploadImage, createEntry, createLocalization } from "../../shared/api";
import { equipmentItems } from "../../shared/data/equipment-items";

async function seedEquipmentItems(): Promise<number[]> {
  console.log("\n Seeding Equipment Items...");
  const createdIds: number[] = [];

  for (const item of equipmentItems) {
    const imageId = await uploadImage(item.image);

    // Create English version
    const entry = await createEntry("equipment-items", {
      name: item.name,
      spec: item.spec,
      image: imageId,
      order: item.order,
    });

    if (entry) {
      createdIds.push(entry.id);
      // Create Vietnamese localization
      await createLocalization("equipment-items", entry.documentId, "vi", {
        name: item.name_vi,
        image: imageId,
      });
    }
  }

  console.log(`  Seeded ${createdIds.length} equipment items`);
  return createdIds;
}

export { seedEquipmentItems };

// Run if executed directly
const isMainModule = import.meta.url === `file://${process.argv[1]}`;
if (isMainModule) {
  seedEquipmentItems()
    .then((ids) => {
      console.log(`\nEquipment items seeded. IDs: ${ids.join(", ")}`);
      process.exit(0);
    })
    .catch((error) => {
      console.error("Failed to seed equipment items:", error);
      process.exit(1);
    });
}

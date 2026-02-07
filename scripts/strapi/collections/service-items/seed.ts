/**
 * Seed Service Items
 *
 * Seeds service/workflow entries with both EN and VI localizations.
 *
 * Usage: npx tsx scripts/strapi/collections/service-items/seed.ts
 */

import { uploadImage, createEntry, createLocalization } from "../../shared/api";
import { serviceItems } from "../../shared/data/service-items";

async function seedServiceItems(): Promise<
  { id: number; page: string; section: string }[]
> {
  console.log("\n Seeding Service Items...");
  const createdEntries: { id: number; page: string; section: string }[] = [];

  for (const item of serviceItems) {
    // Upload image if available
    const imageId = item.image ? await uploadImage(item.image) : null;

    const entry = await createEntry("service-items", {
      title: item.title,
      description: item.description,
      page: item.page,
      section: item.section,
      order: item.order,
      image: imageId,
    });

    if (entry) {
      createdEntries.push({
        id: entry.id,
        page: item.page,
        section: item.section,
      });
      // Create Vietnamese localization (include image for both locales)
      await createLocalization("service-items", entry.documentId, "vi", {
        title: item.title_vi,
        description: item.description_vi,
        image: imageId,
      });
    }
  }

  console.log(`  Seeded ${createdEntries.length} service items`);
  return createdEntries;
}

export { seedServiceItems };

// Run if executed directly
const isMainModule = import.meta.url === `file://${process.argv[1]}`;
if (isMainModule) {
  seedServiceItems()
    .then((entries) => {
      console.log(`\nService items seeded. Count: ${entries.length}`);
      process.exit(0);
    })
    .catch((error) => {
      console.error("Failed to seed service items:", error);
      process.exit(1);
    });
}

/**
 * Seed FAQ Items
 *
 * Seeds FAQ entries with both EN and VI localizations.
 *
 * Usage: npx tsx scripts/strapi/collections/faq-items/seed.ts
 */

import { createEntry, createLocalization } from "../../shared/api";
import { faqItems } from "../../shared/data/faq-items";

async function seedFaqItems(): Promise<number[]> {
  console.log("\n Seeding FAQ Items...");
  const createdIds: number[] = [];

  for (const item of faqItems) {
    // Create English version
    const entry = await createEntry("faq-items", {
      question: item.question,
      answer: item.answer,
      category: item.category,
      order: item.order,
    });

    if (entry) {
      createdIds.push(entry.id);
      // Create Vietnamese localization
      await createLocalization("faq-items", entry.documentId, "vi", {
        question: item.question_vi,
        answer: item.answer_vi,
      });
    }
  }

  console.log(`  Seeded ${createdIds.length} FAQ items`);
  return createdIds;
}

export { seedFaqItems };

// Run if executed directly
const isMainModule = import.meta.url === `file://${process.argv[1]}`;
if (isMainModule) {
  seedFaqItems()
    .then((ids) => {
      console.log(`\nFAQ items seeded. IDs: ${ids.join(", ")}`);
      process.exit(0);
    })
    .catch((error) => {
      console.error("Failed to seed FAQ items:", error);
      process.exit(1);
    });
}

/**
 * Seed Studio Rental Page
 *
 * Seeds studio rental page content for both EN and VI locales.
 * Requires studio-rooms, equipment-items, and faq-items to be seeded first.
 *
 * Usage: npx tsx scripts/strapi/pages/studio-rental-page/seed.ts
 */

import {
  uploadImage,
  updateSingleType,
  getCollectionIds,
  apiRequest,
} from "../../shared/api";

async function seedStudioRentalPage(): Promise<void> {
  console.log("\n Seeding Studio Rental Page...");

  // Get required collection IDs
  const roomIds = await getCollectionIds("studio-rooms");
  const equipmentIds = await getCollectionIds("equipment-items");
  const faqIds = await getCollectionIds("faq-items");

  // Separate blank rooms and concept rooms by querying with filters
  let blankRoomIds: number[] = [];
  let conceptRoomIds: number[] = [];

  try {
    const blankResult = (await apiRequest(
      "studio-rooms?filters[type][$eq]=blank&pagination[pageSize]=100"
    )) as { data: { id: number }[] };
    blankRoomIds = blankResult.data?.map((r) => r.id) || [];

    const conceptResult = (await apiRequest(
      "studio-rooms?filters[type][$eq]=concept&pagination[pageSize]=100"
    )) as { data: { id: number }[] };
    conceptRoomIds = conceptResult.data?.map((r) => r.id) || [];
  } catch {
    // Fallback: use first 3 as blank, rest as concept
    blankRoomIds = roomIds.slice(0, 3);
    conceptRoomIds = roomIds.slice(3);
  }

  // Upload images
  const heroImageId = await uploadImage(
    "/images/studio-rental/hero-background.jpg"
  );
  const fullRentalBgId = await uploadImage("/images/full-studio-bg.jpg");
  const makeupImageId = await uploadImage("/images/facilities/makeup-room.jpg");
  const loungeImageId = await uploadImage(
    "/images/facilities/dining-lounge.jpg"
  );

  // English
  await updateSingleType("studio-rental-page", {
    hero: {
      heading: "Your creative playground",
      background_image: heroImageId,
      background_alt: "Studio Rental",
    },
    intro: {
      label: "How It Works",
      description:
        "Because your vision deserves more than a space— It needs a stage, a story, and a studio that moves with you.",
      cta_text: "Get in touch",
      cta_link: "#contact-form",
    },
    stats: {
      total_rooms: 6,
      ceiling_height: "4.5m",
      total_space: "900m²",
      blank_rooms: 3,
      concept_rooms: 3,
    },
    rooms: blankRoomIds,
    concept_rooms: conceptRoomIds,
    full_rental: {
      price: "2,500,000",
      background_image: fullRentalBgId,
    },
    facilities: {
      makeup_image: makeupImageId,
      lounge_image: loungeImageId,
    },
    equipment: equipmentIds,
    faqs: faqIds,
  });

  // Vietnamese
  await updateSingleType(
    "studio-rental-page",
    {
      hero: {
        heading: "Sân chơi sáng tạo của bạn",
        background_image: heroImageId,
        background_alt: "Studio Rental",
      },
      intro: {
        label: "Cách thức hoạt động",
        description:
          "Vì tầm nhìn của bạn xứng đáng hơn một không gian— Nó cần một sân khấu, một câu chuyện, và một studio đồng hành cùng bạn.",
        cta_text: "Liên hệ ngay",
        cta_link: "#contact-form",
      },
      stats: {
        total_rooms: 6,
        ceiling_height: "4.5m",
        total_space: "900m²",
        blank_rooms: 3,
        concept_rooms: 3,
      },
      rooms: blankRoomIds,
      concept_rooms: conceptRoomIds,
      full_rental: {
        price: "2,500,000",
        background_image: fullRentalBgId,
      },
      facilities: {
        makeup_image: makeupImageId,
        lounge_image: loungeImageId,
      },
      equipment: equipmentIds,
      faqs: faqIds,
    },
    "vi"
  );

  console.log("  Studio rental page seeded");
}

export { seedStudioRentalPage };

// Run if executed directly
const isMainModule = import.meta.url === `file://${process.argv[1]}`;
if (isMainModule) {
  seedStudioRentalPage()
    .then(() => {
      console.log("\nStudio rental page seeded successfully.");
      process.exit(0);
    })
    .catch((error) => {
      console.error("Failed to seed studio rental page:", error);
      process.exit(1);
    });
}

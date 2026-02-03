/**
 * Strapi CMS Reset Script
 *
 * This script clears all seeded data from Strapi CMS to allow fresh re-seeding.
 *
 * Usage: npx tsx scripts/reset-strapi.ts
 */

import 'dotenv/config';

// Configuration
const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'https://fantastic-attraction-7b2626fe03.strapiapp.com';
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN;

if (!STRAPI_API_TOKEN) {
  console.error('❌ STRAPI_API_TOKEN is required. Set it in .env.local');
  process.exit(1);
}

const headers = {
  'Authorization': `Bearer ${STRAPI_API_TOKEN}`,
  'Content-Type': 'application/json',
};

// Collections to clear (in order - clear dependent items first)
const collectionsToReset = [
  'brand-logos',
  'studio-rooms',
  'equipment-items',
  'faq-items',
  'portfolio-items',
  'key-projects',
];

// Single types to reset
const singleTypesToReset = [
  'homepage',
  'studio-rental-page',
  'about-page',
  'contact-page',
  'creative-page',
  'production-page',
  'set-design-page',
  'event-planning-page',
  'decor-page',
];

async function apiRequest(endpoint: string, options: RequestInit = {}) {
  const url = `${STRAPI_URL}/api/${endpoint}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      ...headers,
      ...options.headers,
    },
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`API Error ${response.status}: ${text}`);
  }

  return response.json();
}

async function getCollectionEntries(contentType: string): Promise<{ id: number; documentId: string }[]> {
  try {
    const result = await apiRequest(`${contentType}?pagination[pageSize]=100`);
    return result.data?.map((entry: { id: number; documentId: string }) => ({
      id: entry.id,
      documentId: entry.documentId,
    })) || [];
  } catch (error) {
    console.log(`⚠️  Could not fetch ${contentType}: ${error}`);
    return [];
  }
}

async function deleteEntry(contentType: string, documentId: string): Promise<boolean> {
  try {
    await apiRequest(`${contentType}/${documentId}`, { method: 'DELETE' });
    return true;
  } catch (error) {
    console.log(`⚠️  Could not delete ${contentType}/${documentId}: ${error}`);
    return false;
  }
}

async function resetCollection(contentType: string): Promise<number> {
  console.log(`\n📦 Resetting ${contentType}...`);

  const entries = await getCollectionEntries(contentType);

  if (entries.length === 0) {
    console.log(`   ✓ No entries found in ${contentType}`);
    return 0;
  }

  let deleted = 0;
  for (const entry of entries) {
    const success = await deleteEntry(contentType, entry.documentId);
    if (success) {
      deleted++;
      console.log(`   ✓ Deleted ${contentType}/${entry.documentId}`);
    }
  }

  console.log(`   ✅ Deleted ${deleted}/${entries.length} entries from ${contentType}`);
  return deleted;
}

async function resetSingleType(contentType: string): Promise<boolean> {
  console.log(`\n📄 Resetting ${contentType}...`);

  try {
    // For single types, we reset by setting all fields to null/empty
    // First, get the current data to understand the structure
    const result = await apiRequest(contentType);

    if (!result.data) {
      console.log(`   ✓ ${contentType} is already empty`);
      return true;
    }

    // Reset the single type with empty data
    await apiRequest(contentType, {
      method: 'PUT',
      body: JSON.stringify({
        data: {
          // Reset common fields to null
          hero: null,
          intro: null,
          trusted_by: null,
          brand_logos: [],
          gallery_images: [],
          featured_project: null,
          space_section: null,
          crew_area: null,
          stats: null,
          rooms: [],
          full_rental: null,
          facilities: null,
          equipment: [],
          faq_items: [],
          workflow: [],
          services: [],
          portfolio_settings: null,
          portfolio_items: [],
          vision: null,
          mission: null,
          values: [],
          our_story: null,
          timeline: [],
          founder: null,
          full_width_image: null,
          info: null,
          map_image: null,
        },
      }),
    });

    console.log(`   ✅ Reset ${contentType}`);
    return true;
  } catch (error) {
    console.log(`   ⚠️  Could not reset ${contentType}: ${error}`);
    return false;
  }
}

async function deleteAllMedia(): Promise<number> {
  console.log('\n🖼️  Deleting uploaded media files...');

  try {
    const result = await apiRequest('upload/files?pagination[pageSize]=100');
    const files = result || [];

    if (files.length === 0) {
      console.log('   ✓ No media files found');
      return 0;
    }

    let deleted = 0;
    for (const file of files) {
      try {
        await apiRequest(`upload/files/${file.id}`, { method: 'DELETE' });
        deleted++;
        console.log(`   ✓ Deleted media file: ${file.name}`);
      } catch {
        console.log(`   ⚠️  Could not delete file: ${file.name}`);
      }
    }

    console.log(`   ✅ Deleted ${deleted}/${files.length} media files`);
    return deleted;
  } catch (error) {
    console.log(`   ⚠️  Could not fetch media files: ${error}`);
    return 0;
  }
}

async function main() {
  console.log('🗑️  Starting Strapi CMS Reset...\n');
  console.log(`📍 Strapi URL: ${STRAPI_URL}`);

  const summary = {
    collections: 0,
    singleTypes: 0,
    mediaFiles: 0,
  };

  try {
    // Reset single types first (to remove references)
    for (const contentType of singleTypesToReset) {
      const success = await resetSingleType(contentType);
      if (success) summary.singleTypes++;
    }

    // Reset collections (delete all entries)
    for (const contentType of collectionsToReset) {
      const deleted = await resetCollection(contentType);
      summary.collections += deleted;
    }

    // Delete uploaded media files
    summary.mediaFiles = await deleteAllMedia();

    console.log('\n✅ Reset completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`   - Single types reset: ${summary.singleTypes}`);
    console.log(`   - Collection entries deleted: ${summary.collections}`);
    console.log(`   - Media files deleted: ${summary.mediaFiles}`);

  } catch (error) {
    console.error('\n❌ Reset failed:', error);
    process.exit(1);
  }
}

main();

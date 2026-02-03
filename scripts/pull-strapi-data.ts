/**
 * Strapi Data Pull Script
 *
 * This script pulls data from the live Strapi CMS and outputs it in a format
 * that can be used to update the seed script. Useful for syncing production
 * changes back to the seed data.
 *
 * Usage: npx tsx scripts/pull-strapi-data.ts [options]
 *
 * Options:
 *   --collections    Pull collection data (brand-logos, studio-rooms, etc.)
 *   --pages          Pull page data (homepage, studio-rental-page, etc.)
 *   --all            Pull all data (default)
 *   --output <file>  Output to file instead of stdout
 *   --locale <code>  Locale to pull (default: en)
 */

import { config } from 'dotenv';
config({ path: '.env.local' });
import * as fs from 'fs';

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

// ============================================================================
// API Utilities
// ============================================================================

async function fetchFromStrapi(endpoint: string, locale: string = 'en'): Promise<unknown> {
  const url = `${STRAPI_URL}/api/${endpoint}?populate=deep&locale=${locale}`;

  try {
    const response = await fetch(url, { headers });

    if (!response.ok) {
      const text = await response.text();
      console.error(`❌ Failed to fetch ${endpoint}: ${response.status} - ${text}`);
      return null;
    }

    const json = await response.json();
    return json.data;
  } catch (error) {
    console.error(`❌ Error fetching ${endpoint}:`, error);
    return null;
  }
}

// ============================================================================
// Collection Endpoints
// ============================================================================

const COLLECTIONS = [
  'brand-logos',
  'studio-rooms',
  'equipment-items',
  'faq-items',
  'portfolio-items',
  'key-projects',
  'testimonial-items',
  'service-items',
];

// ============================================================================
// Page Endpoints (Single Types)
// ============================================================================

const PAGES = [
  'homepage',
  'studio-rental-page',
  'creative-page',
  'production-page',
  'set-design-page',
  'event-planning-page',
  'decor-page',
  'about-page',
  'contact-page',
];

// ============================================================================
// Data Transformation Utilities
// ============================================================================

interface StrapiImage {
  id: number;
  url: string;
  alternativeText?: string;
  name?: string;
}

function extractImagePath(image: StrapiImage | null | undefined): string | null {
  if (!image?.url) return null;

  // If it's a local path, return as-is
  if (image.url.startsWith('/')) return image.url;

  // If it's an uploaded image, try to extract a reasonable path
  // This assumes images follow a naming convention
  const fileName = image.name || image.url.split('/').pop() || '';
  return `/images/${fileName}`;
}

function cleanDataForSeed(data: unknown, depth: number = 0): unknown {
  if (data === null || data === undefined) return null;

  if (Array.isArray(data)) {
    return data.map(item => cleanDataForSeed(item, depth + 1));
  }

  if (typeof data === 'object') {
    const obj = data as Record<string, unknown>;
    const cleaned: Record<string, unknown> = {};

    for (const [key, value] of Object.entries(obj)) {
      // Skip internal Strapi fields
      if (['id', 'documentId', 'createdAt', 'updatedAt', 'publishedAt', 'locale', 'localizations'].includes(key)) {
        continue;
      }

      // Handle image/media fields
      if (value && typeof value === 'object' && 'url' in (value as Record<string, unknown>)) {
        cleaned[key] = extractImagePath(value as StrapiImage);
        continue;
      }

      cleaned[key] = cleanDataForSeed(value, depth + 1);
    }

    return cleaned;
  }

  return data;
}

// ============================================================================
// Main Functions
// ============================================================================

async function pullCollections(locale: string = 'en'): Promise<Record<string, unknown>> {
  console.log('\n📦 Pulling Collections...');
  const results: Record<string, unknown> = {};

  for (const collection of COLLECTIONS) {
    console.log(`  Fetching ${collection}...`);
    const data = await fetchFromStrapi(collection, locale);
    if (data) {
      results[collection] = cleanDataForSeed(data);
      console.log(`  ✅ ${collection}: ${Array.isArray(data) ? data.length : 1} items`);
    }
  }

  return results;
}

async function pullPages(locale: string = 'en'): Promise<Record<string, unknown>> {
  console.log('\n📄 Pulling Pages...');
  const results: Record<string, unknown> = {};

  for (const page of PAGES) {
    console.log(`  Fetching ${page}...`);
    const data = await fetchFromStrapi(page, locale);
    if (data) {
      results[page] = cleanDataForSeed(data);
      console.log(`  ✅ ${page}`);
    }
  }

  return results;
}

async function pullAll(locale: string = 'en'): Promise<Record<string, unknown>> {
  const collections = await pullCollections(locale);
  const pages = await pullPages(locale);

  return {
    collections,
    pages,
    metadata: {
      pulledAt: new Date().toISOString(),
      locale,
      strapiUrl: STRAPI_URL,
    },
  };
}

function generateSeedDataOutput(data: Record<string, unknown>): string {
  const output: string[] = [];

  output.push('/**');
  output.push(' * Pulled from Strapi CMS');
  output.push(` * Date: ${new Date().toISOString()}`);
  output.push(` * URL: ${STRAPI_URL}`);
  output.push(' */');
  output.push('');

  // Generate collection data
  if (data.collections) {
    const collections = data.collections as Record<string, unknown>;

    for (const [name, items] of Object.entries(collections)) {
      const varName = name.replace(/-/g, '_').replace(/s$/, '') + 's';
      output.push(`export const ${varName} = ${JSON.stringify(items, null, 2)};`);
      output.push('');
    }
  }

  // Generate page data
  if (data.pages) {
    const pages = data.pages as Record<string, unknown>;

    for (const [name, pageData] of Object.entries(pages)) {
      const varName = name.replace(/-/g, '_') + '_data';
      output.push(`export const ${varName} = ${JSON.stringify(pageData, null, 2)};`);
      output.push('');
    }
  }

  return output.join('\n');
}

// ============================================================================
// CLI
// ============================================================================

async function main() {
  const args = process.argv.slice(2);

  let mode: 'all' | 'collections' | 'pages' = 'all';
  let outputFile: string | null = null;
  let locale = 'en';

  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case '--collections':
        mode = 'collections';
        break;
      case '--pages':
        mode = 'pages';
        break;
      case '--all':
        mode = 'all';
        break;
      case '--output':
        outputFile = args[++i];
        break;
      case '--locale':
        locale = args[++i];
        break;
      case '--help':
        console.log(`
Usage: npx tsx scripts/pull-strapi-data.ts [options]

Options:
  --collections    Pull collection data (brand-logos, studio-rooms, etc.)
  --pages          Pull page data (homepage, studio-rental-page, etc.)
  --all            Pull all data (default)
  --output <file>  Output to file instead of stdout
  --locale <code>  Locale to pull (default: en)
  --help           Show this help message
`);
        process.exit(0);
    }
  }

  console.log('🚀 Strapi Data Pull Script\n');
  console.log(`📍 Strapi URL: ${STRAPI_URL}`);
  console.log(`🌐 Locale: ${locale}`);
  console.log(`📋 Mode: ${mode}`);

  let data: Record<string, unknown>;

  switch (mode) {
    case 'collections':
      data = { collections: await pullCollections(locale) };
      break;
    case 'pages':
      data = { pages: await pullPages(locale) };
      break;
    default:
      data = await pullAll(locale);
  }

  const output = generateSeedDataOutput(data);

  if (outputFile) {
    fs.writeFileSync(outputFile, output);
    console.log(`\n✅ Data written to ${outputFile}`);
  } else {
    console.log('\n' + '='.repeat(80));
    console.log('SEED DATA OUTPUT:');
    console.log('='.repeat(80) + '\n');
    console.log(output);
  }

  // Also output raw JSON for reference
  const jsonFile = outputFile ? outputFile.replace(/\.[^.]+$/, '.json') : null;
  if (jsonFile) {
    fs.writeFileSync(jsonFile, JSON.stringify(data, null, 2));
    console.log(`📄 Raw JSON written to ${jsonFile}`);
  }
}

main().catch(console.error);

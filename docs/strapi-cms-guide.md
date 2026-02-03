# Strapi CMS Guide

This document explains how to manage content in the Strapi CMS for the Saint 6 website, including seeding, syncing, and the data flow between Strapi and the Next.js frontend.

## Table of Contents

- [Architecture Overview](#architecture-overview)
- [Content Structure](#content-structure)
- [Scripts](#scripts)
- [Seeding Process](#seeding-process)
- [Syncing Process](#syncing-process)
- [Working with Localization](#working-with-localization)
- [Next.js Integration](#nextjs-integration)
- [Best Practices](#best-practices)

## Architecture Overview

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   Next.js App   │────▶│   Strapi CMS    │◀────│  Seed Scripts   │
│  (ISG/SSG)      │     │  (Cloud/Local)  │     │  (TypeScript)   │
└─────────────────┘     └─────────────────┘     └─────────────────┘
        │                       │                       │
        │                       │                       │
        ▼                       ▼                       ▼
   Static Pages            Database              Mock Data
   (Revalidated)          (PostgreSQL)        (seed-strapi.ts)
```

### Data Flow

1. **Seeding**: `seed-strapi.ts` uploads images and creates content entries
2. **Editing**: Content editors modify data in Strapi admin panel
3. **Fetching**: Next.js fetches data via Strapi REST API
4. **Rendering**: Pages are statically generated with ISR (Incremental Static Regeneration)
5. **Syncing**: `pull-strapi-data.ts` extracts live data for seed updates

## Content Structure

### Single Types (Pages)

| Page | Endpoint | Sections |
|------|----------|----------|
| Homepage | `homepage` | hero, brand_logos, gallery_images, key_projects, space_section, crew_area |
| Studio Rental | `studio-rental-page` | hero, intro, stats, rooms, concept_rooms, full_rental, facilities, equipment, faqs |
| Creative | `creative-page` | hero, clients, client_logos, services, intro, workflow, portfolio_settings, portfolio_items, testimonials |
| Production | `production-page` | hero, intro, services, intro_2, workflow, key_projects |
| Set Design | `set-design-page` | hero, intro, workflow, portfolio_settings, portfolio_items, testimonials |
| Event Planning | `event-planning-page` | hero, intro, services, intro_2, workflow, event_projects |
| Decor | `decor-page` | hero, intro, workflow, intro_2, portfolio_settings, portfolio_items |
| About | `about-page` | hero, intro, vision, full_width_image, mission, values, our_story, timeline, founder |
| Contact | `contact-page` | hero, info, map_image |

### Collection Types

| Collection | Endpoint | Purpose |
|------------|----------|---------|
| Brand Logos | `brand-logos` | Client/partner logos |
| Studio Rooms | `studio-rooms` | Rental room details |
| Equipment Items | `equipment-items` | Photography equipment |
| FAQ Items | `faq-items` | Frequently asked questions |
| Portfolio Items | `portfolio-items` | Project portfolio images |
| Key Projects | `key-projects` | Featured project case studies |
| Testimonial Items | `testimonial-items` | Client testimonials |

### Shared Components

- `shared.hero` - Page hero with heading and background image
- `shared.intro` - Introduction section with label, description, and CTA
- `shared.service` - Service/workflow item with optional counter
- `shared.gallery-image` - Gallery image with alt text
- `shared.clients-section` - Client section header
- `portfolio.settings` - Portfolio section settings
- `studio.*` - Studio-specific components
- `about.*` - About page-specific components
- `contact.*` - Contact page-specific components
- `homepage.*` - Homepage-specific components

## Scripts

### Reset Strapi Data

Deletes all content from Strapi (use with caution):

```bash
npx tsx scripts/reset-strapi.ts
```

### Seed Strapi Data

Uploads images and creates all content entries:

```bash
npx tsx scripts/seed-strapi.ts
```

### Pull Strapi Data

Extracts live data from Strapi for seed script updates:

```bash
# Pull all data
npx tsx scripts/pull-strapi-data.ts

# Pull only collections
npx tsx scripts/pull-strapi-data.ts --collections

# Pull only pages
npx tsx scripts/pull-strapi-data.ts --pages

# Output to file
npx tsx scripts/pull-strapi-data.ts --output ./pulled-data.ts

# Pull specific locale
npx tsx scripts/pull-strapi-data.ts --locale vi
```

## Seeding Process

### Prerequisites

1. Set up environment variables in `.env.local`:
   ```
   NEXT_PUBLIC_STRAPI_URL=https://your-strapi-instance.com
   STRAPI_API_TOKEN=your-api-token-here
   ```

2. Ensure images exist in `public/images/` directory

### Full Seed Workflow

```bash
# 1. Reset existing data (optional, for clean start)
npx tsx scripts/reset-strapi.ts

# 2. Run the seed script
npx tsx scripts/seed-strapi.ts
```

### What the Seed Script Does

1. **Uploads Images**: All images from `public/images/` are uploaded to Strapi
2. **Creates Collections**: Brand logos, rooms, equipment, FAQs, portfolio items, testimonials
3. **Creates Pages**: All single-type pages with English content
4. **Creates Localizations**: Vietnamese translations for all content

### Image Handling

Images are cached during seeding to avoid re-uploading:

```typescript
const imageCache: Record<string, number> = {};
```

The cache maps file paths to Strapi media IDs.

## Syncing Process

When content is edited in Strapi and needs to be reflected in the seed script:

### 1. Pull Current Data

```bash
npx tsx scripts/pull-strapi-data.ts --output ./scripts/pulled-data.ts
```

### 2. Review Changes

Compare `pulled-data.ts` with existing seed data in `seed-strapi.ts`.

### 3. Update Seed Script

Manually update the seed script with any content changes you want to preserve.

### Why Manual Sync?

- Seed data serves as the "source of truth" for initial state
- Production changes may be temporary or experimental
- Manual review ensures intentional updates only

## Working with Localization

The CMS supports two locales:
- `en` - English (default)
- `vi` - Vietnamese

### Seeding Localized Content

```typescript
// Create English entry
await updateSingleType('homepage', { hero: {...} });

// Create Vietnamese localization
await updateSingleType('homepage', { hero: {...} }, 'vi');
```

### Fetching Localized Content

```typescript
// In Next.js
const data = await getHomepage('vi'); // Vietnamese
const data = await getHomepage('en'); // English (default)
```

## Next.js Integration

### Type Definitions

Types are defined in `app/lib/strapi.ts`:

```typescript
export interface StrapiHomepage {
  id: number;
  hero?: StrapiHero;
  brand_logos?: StrapiBrandLogo[];
  // ...
}
```

### Fetch Functions

```typescript
// Fetch homepage
export async function getHomepage(locale: string = 'en') {
  return fetchStrapi<StrapiHomepage>('homepage', {
    locale,
    populate: 'deep',
    revalidate: 60, // ISR: revalidate every 60 seconds
  });
}
```

### Using in Pages

```typescript
// app/page.tsx
export default async function HomePage() {
  const data = await getHomepage();

  return (
    <>
      {data?.hero && <HeroSection hero={data.hero} />}
      {data?.brand_logos && <BrandLogos logos={data.brand_logos} />}
    </>
  );
}
```

### Image Handling

```typescript
import { getStrapiImageUrl } from '@/lib/strapi';

// Get full image URL
const imageUrl = getStrapiImageUrl(data.hero?.background_image);
```

## Best Practices

### Content Editing

1. **Use Strapi Admin** for day-to-day content changes
2. **Test locally** before publishing to production
3. **Preserve localization** - update both EN and VI when needed

### Seed Data Management

1. **Keep seed data minimal** - only essential initial content
2. **Don't include production data** that changes frequently
3. **Document content structure** in comments

### Schema Changes

When changing Strapi schemas:

1. Update schema JSON files in `strapi/src/api/*/content-types/`
2. Update TypeScript types in `app/lib/strapi.ts`
3. Update seed script in `scripts/seed-strapi.ts`
4. Deploy Strapi changes first, then run seed

### Troubleshooting

**Seed fails with 400 error**
- Check that all required fields have values
- Ensure image paths exist in `public/images/`

**Missing content after seed**
- Verify Strapi deployment includes latest schema changes
- Check API token has write permissions

**Localization not working**
- Ensure i18n plugin is enabled in Strapi
- Check locale is configured in Strapi admin

## File Reference

| File | Purpose |
|------|---------|
| `scripts/seed-strapi.ts` | Seeds all CMS content |
| `scripts/reset-strapi.ts` | Deletes all CMS content |
| `scripts/pull-strapi-data.ts` | Extracts live CMS data |
| `app/lib/strapi.ts` | TypeScript types and fetch utilities |
| `strapi/src/api/*/content-types/*/schema.json` | Content type schemas |
| `strapi/src/components/*/` | Component schemas |

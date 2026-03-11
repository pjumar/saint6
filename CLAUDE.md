# Claude Code Project Context

This is the Saint6 Studio website - a Next.js 15 application with Strapi CMS backend.

## Tech Stack

- **Frontend**: Next.js 15 (App Router), TypeScript, CSS Modules
- **CMS**: Strapi 5 (hosted on Strapi Cloud)
- **Styling**: CSS Modules with CSS variables for theming
- **i18n**: English (en) and Vietnamese (vi) locales

## Project Structure

```
/app                    # Next.js app directory
  /[locale]             # Locale-based routing
  /components           # React components
  /lib                  # Utilities (strapi.ts, translations.ts)
  /contexts             # React contexts
/public                 # Static assets
/strapi                 # Strapi CMS project (separate deployment)
/scripts/strapi         # CMS seeding scripts
/.claude                # Claude-specific documentation
```

## Key Documentation

- [Strapi Seeding Guide](.claude/strapi-seeding.md) - Patterns for seeding CMS data
- [Performance & Lighthouse](.claude/performance.md) - All performance optimizations and Lighthouse fixes

## Development Commands

```bash
# Start Next.js dev server
npm run dev

# Start local Strapi (from /strapi folder)
cd strapi && npm run dev

# Seed CMS data
npx tsx scripts/strapi/seed-all.ts

# Reset specific collection
npx tsx scripts/strapi/collections/studio-rooms/reset.ts

# Seed specific collection
npx tsx scripts/strapi/collections/studio-rooms/seed.ts
```

## Environment Variables

Required in `.env.local`:
```
STRAPI_API_TOKEN=...
NEXT_PUBLIC_STRAPI_URL=https://strapi.saint6.studio
```

## Component Patterns

### Client Components
- Use `"use client"` directive at top
- Import from `@/app/contexts/TranslationContext` for translations
- CSS Modules imported as `styles`

### Server Components (Pages)
- Fetch data using functions from `@/app/lib/strapi.ts`
- Use `getTranslations(locale)` for static translations
- Include fallback data for development when CMS unavailable

## Strapi Integration

### Image URLs
```typescript
import { getStrapiImageUrl } from "@/app/lib/strapi";
const url = getStrapiImageUrl(strapiImage); // Returns full URL or null
```

### Fetching Page Data
```typescript
import { getStudioRentalPage } from "@/app/lib/strapi";
const data = await getStudioRentalPage(locale);
```

## Strict Rules

- **Never add Co-Authored-By or any AI watermark to git commits.** Commit messages should look like they were written by a human developer. No attribution to Claude, AI, or any bot.

## Important Notes

1. **Strapi 5 breaking changes**: Media relations use different formats for POST vs PUT. See [Strapi Seeding Guide](.claude/strapi-seeding.md).

2. **Localization**: All content types support EN and VI. When seeding, create EN first, then use `createLocalization()` for VI.

3. **Relations**: Use `documentId` (not `id`) for relations in Strapi 5.

4. **ISG Pattern**: Pages use Incremental Static Generation with 60-second revalidation.

5. **Relations are NOT shared between locales**: When seeding single types (pages), relations must be explicitly included for BOTH EN and VI locales. Relations are not automatically inherited from EN to VI. The same `documentId` values work across locales, so you can reuse them:

   ```typescript
   // EN
   await updateSingleType("my-page", { relations: docIds });
   // VI - must also include relations!
   await updateSingleType("my-page", { relations: docIds }, "vi");
   ```

---
phase: 08-cms-integration
plan: 01
subsystem: ui
tags: [strapi, cms, next.js, isr, static-generation, server-components]

# Dependency graph
requires:
  - phase: 07-code-quality
    provides: Clean codebase with linting and type safety
provides:
  - Homepage Server Component with Strapi CMS integration
  - ISR (Incremental Static Regeneration) pattern with 60s revalidation
  - Transformer functions for CMS data to component props
  - Dev fallback data for offline development
  - Server-side translations utility
affects: [08-02-studio-rental, 08-03-remaining-pages]

# Tech tracking
tech-stack:
  added: []
  patterns: [server-component-cms-fetch, strapi-transformer-pattern, dev-fallback-pattern]

key-files:
  created:
    - app/lib/translations.ts
    - app/lib/fallback-data.ts
    - .env.example
  modified:
    - app/lib/strapi.ts
    - app/[locale]/page.tsx
    - app/components/trusted-by-section/TrustedBySection.tsx
    - app/components/gallery-section/GallerySection.tsx
    - .gitignore

key-decisions:
  - "Keep ISR with 60-second revalidation instead of pure static for easier content updates"
  - "Components have built-in fallback defaults, dev fallback data is supplementary"
  - "Server-side translations utility for static generation (separate from client context)"

patterns-established:
  - "Server Component CMS fetch: async function, getHomepage(locale), transform to props"
  - "Transformer pattern: transformXxx() converts Strapi types to component props"
  - "Dev fallback: FALLBACK_XXX_DATA constants, used when !strapiData && isDev"

issues-created: []

# Metrics
duration: 25min
completed: 2026-02-03
---

# Phase 8 Plan 1: Homepage CMS Integration Summary

**Homepage converted to Server Component fetching Strapi data at build time with ISR (60s revalidation) and dev fallback support.**

## Performance

- **Duration:** 25 min
- **Started:** 2026-02-03T20:33:00Z
- **Completed:** 2026-02-03T20:58:00Z
- **Tasks:** 3
- **Files modified:** 8

## Accomplishments

- Homepage converted from Client Component to Server Component with async CMS fetch
- Strapi data fetched at build time and baked into static HTML
- ISR configured with 60-second revalidation for content updates
- Dev fallback data for local development when Strapi unavailable
- Updated TrustedBySection and GallerySection to accept data as props
- Created transformer functions for CMS data to component props

## Task Commits

Each task was committed atomically:

1. **Task 1: Configure Strapi for static generation** - `97b2ae1`
2. **Task 2: Convert Homepage to Server Component with CMS** - `3d47ccc`
3. **Task 3: Add dev fallback and verify ISG** - `ce9b5d6`

**Post-execution fixes:**
- `3240559` - fix(08-01): use standard Strapi populate syntax
- `5c7d8ff` - fix(08-01): handle null image URLs from Strapi

## Files Created/Modified

- `.env.example` - Documents required environment variables for Strapi
- `app/lib/strapi.ts` - Added ISR documentation and caching strategy comments
- `app/lib/translations.ts` - Server-side translations utility for static generation
- `app/lib/fallback-data.ts` - Hardcoded fallback data for dev mode
- `app/[locale]/page.tsx` - Server Component with CMS fetch and transformers
- `app/components/trusted-by-section/TrustedBySection.tsx` - Accept logos prop
- `app/components/gallery-section/GallerySection.tsx` - Accept images prop
- `.gitignore` - Allow .env.example files to be committed

## Decisions Made

1. **Keep ISR (60s revalidation) instead of pure static:** ISR allows content updates without full rebuild while still serving static pages. Pure static would require rebuild for every content change.

2. **Components have built-in defaults:** TrustedBySection and GallerySection have DEFAULT_LOGOS and DEFAULT_IMAGES - this provides graceful fallback without explicit fallback data file.

3. **Created server-side translations utility:** The existing TranslationContext is client-side (uses hooks). Created getTranslations() for Server Components to access translations at build time.

4. **Transformer functions in page file:** Transform functions (transformBrandLogos, transformSpaceSection, etc.) kept in page.tsx for now. Can be extracted to separate file if reused across pages.

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

- **Strapi 400 Bad Request:** The `populate=deep` parameter requires `strapi-plugin-populate-deep` plugin. Fixed by changing to `populate=*` (standard Strapi 4 syntax).

- **Empty src attribute warning:** `getStrapiImageUrl()` returned empty string `""` when image was missing, causing browser to re-download the page. Fixed by returning `null` and filtering out items with missing images in transform functions.

## Next Phase Readiness

- ISR pattern established and verified with `pnpm build`
- Transformer pattern documented for remaining pages (studio-rental, about, contact, etc.)
- Ready for 08-02-PLAN.md (Studio Rental CMS Integration)

---
*Phase: 08-cms-integration*
*Completed: 2026-02-03*

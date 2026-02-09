---
phase: 09-polish-launch
plan: 02
subsystem: code-quality
tags: [transformers, typescript, refactoring, fallback-data, null-safety]

requires:
  - phase: 09-01
    provides: shared transformers in app/lib/transformers.ts
  - phase: 08-01 through 08-04
    provides: CMS integration with Strapi, all page data fetching
provides:
  - consistent null-image handling across all transformers
  - type-safe translation access in About and Contact pages
  - modular fallback data (per-page files)
affects: [09-03]

tech-stack:
  added: []
  patterns:
    - "filter-out pattern for image-dependent items"
    - "empty-string pattern for text-primary items with optional images"
    - "per-page fallback module organization"

key-files:
  created:
    - app/lib/fallback/index.ts
    - app/lib/fallback/homepage.ts
    - app/lib/fallback/studio-rental.ts
    - app/lib/fallback/creative.ts
    - app/lib/fallback/production.ts
    - app/lib/fallback/set-design.ts
    - app/lib/fallback/event-planning.ts
    - app/lib/fallback/decor.ts
    - app/lib/fallback/about.ts
    - app/lib/fallback/contact.ts
  modified:
    - app/lib/transformers.ts
    - app/[locale]/about/page.tsx
    - app/[locale]/contact/page.tsx
    - app/[locale]/creative/page.tsx
    - app/[locale]/production/page.tsx
    - app/[locale]/event-planning/page.tsx
    - app/[locale]/set-design/page.tsx
    - app/[locale]/decor/page.tsx

key-decisions:
  - "Two-strategy null-image: filter-out for image-primary items, empty-string for text-primary items"
  - "Barrel re-export pattern for fallback modules to maintain backward-compatible imports"

patterns-established:
  - "Filter-out: items where image IS the content return null and get filtered"
  - "Empty-string: text-primary items keep entry with imageUrl '' when image missing"
  - "Per-page fallback modules under app/lib/fallback/ with barrel index"

issues-created: []

duration: 17min
completed: 2026-02-10
---

# Phase 9 Plan 2: Code Quality Standardization Summary

**Consistent null-image handling across all transformers, zero unsafe type assertions in About/Contact, fallback data split into 10 per-page modules**

## Performance

- **Duration:** 17 min
- **Started:** 2026-02-09T19:26:41Z
- **Completed:** 2026-02-09T19:43:34Z
- **Tasks:** 3
- **Files modified:** ~25 (10 created, 1 deleted, 14 modified)

## Accomplishments

- Standardized null-image handling: image-primary items filtered out, text-primary items keep entry with empty image
- Removed all 20 unsafe `as` type assertions from About and Contact pages — direct typed translation access
- Split 1,311-line fallback-data.ts into 9 per-page modules + barrel index under app/lib/fallback/

## Task Commits

1. **Task 1: Standardize null-image handling** — `fc8367f` (refactor)
2. **Task 2: Remove unsafe type assertions** — `2372a04` (refactor)
3. **Task 3: Split fallback-data.ts** — `227675f` (refactor), `bb607c0` (style: biome formatting)

## Files Created/Modified

**Created:**
- `app/lib/fallback/index.ts` — barrel re-exports all fallback symbols + FALLBACK_SEO
- `app/lib/fallback/homepage.ts` — homepage fallback data (~187 lines)
- `app/lib/fallback/studio-rental.ts` — studio rental fallback (~350 lines)
- `app/lib/fallback/creative.ts` — creative page fallback (~200 lines)
- `app/lib/fallback/production.ts` — production page fallback (~170 lines)
- `app/lib/fallback/set-design.ts` — set design fallback (~182 lines)
- `app/lib/fallback/event-planning.ts` — event planning fallback (~189 lines)
- `app/lib/fallback/decor.ts` — decor fallback (~90 lines)
- `app/lib/fallback/about.ts` — about page fallback (~157 lines)
- `app/lib/fallback/contact.ts` — contact page fallback (~35 lines)

**Deleted:**
- `app/lib/fallback-data.ts` — original 1,311-line monolith

**Modified:**
- `app/lib/transformers.ts` — removed fallbackImage param from transformWorkflow, standardized null handling
- `app/[locale]/about/page.tsx` — removed 18 `as` casts, direct translation access, null-image standardization
- `app/[locale]/contact/page.tsx` — removed 2 `as` casts, direct translation access
- `app/[locale]/creative/page.tsx` — filter-out pattern, removed placeholder paths
- `app/[locale]/production/page.tsx` — filter-out pattern, removed placeholder paths
- `app/[locale]/event-planning/page.tsx` — filter-out pattern, updated imports
- `app/[locale]/set-design/page.tsx` — null-image standardization, updated imports
- `app/[locale]/decor/page.tsx` — null-image standardization, updated imports
- `app/[locale]/studio-rental/page.tsx` — updated imports
- `app/[locale]/page.tsx` — updated imports

## Decisions Made

- **Two-strategy null-image handling:** Image-primary items (portfolio, gallery, project cards, client logos) get filtered out when image is missing. Text-primary items (workflow steps, testimonials, timeline) keep the entry with empty-string image. This follows the plan's exception clause.
- **Barrel re-export for fallback modules:** Created index.ts that re-exports all symbols, so existing imports only need path change from `fallback-data` to `fallback`.

## Deviations from Plan

### Auto-handled

**1. [Nuance] Two-strategy null-image instead of uniform filter-out**
- **Found during:** Task 1
- **Issue:** Uniform filter-out would lose meaningful text content (workflow steps, testimonials) when only the image is missing
- **Fix:** Applied plan's own exception: text-primary items keep entry with empty-string image
- **Verification:** Build passes, all pages render correctly

**2. [Rule 3 - Blocking] Extra biome formatting commit for Task 3**
- **Found during:** Task 3
- **Issue:** Biome formatter expanded compact object literals in newly created fallback files
- **Fix:** Separate formatting commit `bb607c0`
- **Verification:** `npx biome check` passes

---

**Total deviations:** 2 (1 nuance following plan exception, 1 formatting fix)
**Impact on plan:** No scope creep. Both deviations necessary for correctness and code standards.

## Issues Encountered

None — plan executed as specified.

## Next Phase Readiness

- Code quality standardized across all transformers and pages
- Ready for 09-03 (production build verification, SEO audit, deploy prep)
- No blockers

---
*Phase: 09-polish-launch*
*Completed: 2026-02-10*

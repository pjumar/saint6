---
phase: 07-error-handling
plan: 03
subsystem: code-quality
tags: [biome, eslint, react-keys, performance, best-practices]

# Dependency graph
requires:
  - phase: 07-error-handling
    provides: error boundaries and image fallbacks
provides:
  - Clean codebase with no unused imports
  - Unique React list keys
  - Best practices audit results
affects: [phase-8-cms, phase-9-launch]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Track expanded state by content (question string) not index"
    - "Use stable keys from data (src, name) not array indices"

key-files:
  created: []
  modified:
    - app/contexts/TranslationContext.tsx
    - app/components/about-intro/AboutIntro.tsx
    - app/components/faq-accordion/FAQAccordion.tsx
    - app/components/key-project-section/KeyProjectSection.tsx
    - 150+ files with Biome auto-fixes

key-decisions:
  - "Keep GSAP in above-the-fold components (no lazy loading needed)"
  - "Single-component barrels are acceptable (not the problematic pattern)"

patterns-established:
  - "Track state by content identifier, not array index"

issues-created: []

# Metrics
duration: 5min
completed: 2026-02-03
---

# Phase 7 Plan 3: Code Cleanup Summary

**Biome lint fixes, unique React keys, and Vercel best practices audit - no CRITICAL issues found**

## Performance

- **Duration:** 5 min
- **Started:** 2026-02-03T13:10:52Z
- **Completed:** 2026-02-03T13:16:22Z
- **Tasks:** 3
- **Files modified:** 153

## Accomplishments

- Removed unused imports and applied Biome auto-fixes across 150 files
- Fixed all React list key warnings - replaced index-based keys with unique identifiers
- Completed Vercel React best practices audit - no CRITICAL/HIGH issues found

## Task Commits

Each task was committed atomically:

1. **Task 1: Fix unused imports and variables** - `44adda0` (fix)
2. **Task 2: Fix React list key warnings** - `18b7051` (fix)
3. **Task 3: Apply Vercel React best practices audit** - No code changes (audit only)

**Plan metadata:** (pending)

## Files Created/Modified

### Task 1: Unused imports (150 files)
- `app/contexts/TranslationContext.tsx` - Removed unused usePathname import and variable
- `app/[locale]/about/page.tsx` - Removed unused StoryContent import
- Multiple files - Added `type` keyword to type-only imports
- All app/ files - Biome formatting and import organization

### Task 2: React list keys (3 files)
- `app/components/about-intro/AboutIntro.tsx` - Use paragraph content as key
- `app/components/faq-accordion/FAQAccordion.tsx` - Track by question string, use question as key
- `app/components/key-project-section/KeyProjectSection.tsx` - Use role+name, expertise item, image src as keys

## Decisions Made

- **GSAP lazy loading**: Decided NOT to lazy load GSAP components. HeroSection and Header are above-the-fold (must load immediately). TrustedBySection is close to fold - lazy loading could cause layout shift.
- **Single-component barrels**: Kept existing pattern. ErrorBoundary, ContactInfo, MapImage barrels are fine - they only export one component each.

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## Best Practices Audit Results

### CRITICAL Priority
- **Barrel imports**: No issues. Only single-component barrels exist (acceptable pattern).
- **Dynamic imports**: GSAP used in 4 components, all above or near fold. Lazy loading not beneficial.
- **Third-party scripts**: No problematic script loading patterns found.

### HIGH Priority
- **Data serialization**: Page uses "use client" - no server/client boundary issues.
- **Duplicate data fetching**: No issues found.

### MEDIUM Priority
- **Inline props**: No problematic patterns found.
- **Derived state in effects**: No useState in useEffect patterns found.
- **Conditional rendering**: All `&&` operators use proper boolean conditions.

**Conclusion**: Codebase follows React/Next.js best practices. No changes required.

## Next Phase Readiness

- Phase 7 complete - all 3 plans finished
- Ready for Phase 8: CMS Integration
- Codebase is clean, stable, and production-ready

---
*Phase: 07-error-handling*
*Completed: 2026-02-03*

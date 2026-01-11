# Codebase Concerns

**Analysis Date:** 2026-01-12

## Tech Debt

**Hardcoded Project Data:**
- Issue: Example project data is hardcoded in `app/[locale]/page.tsx` (lines 52+)
- Files: `app/[locale]/page.tsx`
- Why: MVP approach - placeholder content
- Impact: Cannot update projects without code changes, no CMS flexibility
- Fix approach: Integrate headless CMS (Strapi, Contentful, Sanity, etc.) and fetch data at build time
- Priority: **HIGH** (TODO comment indicates this is next task)

**Hardcoded Navigation Links:**
- Issue: Navigation items duplicated in multiple places without single source of truth
- Files: `app/components/header/Header.tsx`, `app/components/menu-overlay/MenuOverlay.tsx`
- Why: Rapid development without abstraction
- Impact: Maintenance burden - updating links requires changes in multiple places
- Fix approach: Extract navigation items to configuration file or constants
- Priority: Medium

**Locale Middleware Not Connected:**
- Issue: `proxy.ts` contains locale middleware but unclear if integrated with `middleware.ts`
- Files: `proxy.ts` (appears to be development/build-time utility)
- Why: Locale detection via custom middleware
- Impact: Locale switching depends on proper middleware setup
- Fix approach: Document middleware integration or create explicit `middleware.ts` file
- Priority: Low (appears to work correctly)

## Known Bugs

**Unused Import in LanguageSelector:**
- Symptoms: Component imports `usePathname` but never uses it
- File: `app/components/language-selector/LanguageSelector.tsx` (line 21)
- Root cause: Refactoring leftover, path not needed for locale switching
- Fix: Remove unused import `usePathname`
- Priority: Low (no functional impact)

**Unused usePathname in TranslationContext:**
- Symptoms: Context imports `usePathname()` but never uses the result
- File: `app/contexts/TranslationContext.tsx` (line 29)
- Root cause: Refactoring leftover from earlier implementation
- Fix: Remove unused `usePathname()` call
- Priority: Low (no functional impact)

**Broken Social Media Links:**
- Symptoms: Social media links go nowhere (href="#")
- Files: `app/components/footer/Footer.tsx`, `app/components/social-links/SocialLinks.tsx`
- Current: Facebook, Instagram, TikTok all link to "#"
- Fix: Update hrefs with actual social media profile URLs
- Priority: Medium (affects user engagement)

**Non-Unique List Keys Using Index:**
- Symptoms: React warnings in development (or future issues with list reordering)
- Files:
  - `app/components/key-project-section/KeyProjectSection.tsx` (lines 62, 74, 136) - team, expertise, gallery use index
  - `app/components/trusted-by-section/TrustedBySection.tsx` (lines 118, 129) - brand logos use index
- Root cause: Simplified for static data, but anti-pattern
- Impact: If data ever becomes dynamic, list reordering will cause bugs
- Fix: Use unique identifiers (id field) instead of index
- Priority: Low (stable data now, medium if data becomes dynamic)

## Security Considerations

**No Sensitive Data Exposure:**
- ✓ No hardcoded API keys in code
- ✓ No authentication tokens
- ✓ No private credentials
- ✓ No `dangerouslySetInnerHTML` usage
- Status: **CLEAN**

**CSP & Injection Risks:**
- ✓ No eval() or Function() constructors
- ✓ No dynamic script loading
- ✓ All content static (no user-generated content)
- Status: **CLEAN**

## Accessibility Issues

**Missing Alt Text (Intentional but Should Verify):**
- Status: Decorative images use empty alt text (`alt=""`), which is appropriate
- Files: Multiple components use this pattern correctly
- Note: Ensure all meaningful images have descriptive alt text
- No issues found - decorative images are properly handled

**Broken Navigation Links:**
- Issue: Social media links are non-functional (href="#")
- Impact: Users cannot reach social profiles
- Fix: Update links to actual social URLs

## Performance Concerns

**Image Dimensions Not Responsive:**
- Issue: Gallery images in `GallerySection.tsx` use fixed dimensions (400x600)
- File: `app/components/gallery-section/GallerySection.tsx` (lines 37-38)
- Impact: Images don't scale responsively on smaller screens
- Fix: Remove fixed dimensions or use responsive sizing with Next.js Image
- Priority: Low (appears responsive on mobile in CSS modules)

**GSAP Animation Complexity:**
- Issue: Trusted by section has complex animation with resize listeners and timeline management
- File: `app/components/trusted-by-section/TrustedBySection.tsx` (70+ lines)
- Impact: Recalculates on every window resize, could cause jank on frequent resizing
- Fix: Debounce resize listener, consider using CSS animations for simpler cases
- Priority: Low (animation only runs on mobile)

**Brand Logo Duplication:**
- Issue: Logos array is duplicated in TrustedBySection for animation purposes (lines 128-139)
- Impact: Doubles DOM elements for logos (16 instead of 8)
- Fix: Use CSS or GSAP to achieve infinite scroll without duplication
- Priority: Low (minor performance impact)

## Fragile Areas

**Event Listener Management in Components:**
- File: `app/components/trusted-by-section/TrustedBySection.tsx`
- Why fragile: Uses `window.addEventListener` with cleanup, but resize recalculates animations
- Common failures: Memory leaks if cleanup doesn't run, layout thrashing on resize
- Safe modification: Test cleanup properly, consider `useCallback` for handlers
- Test coverage: No tests for animation behavior

**Translation Context Error Handling:**
- File: `app/contexts/TranslationContext.tsx` (line 44)
- Why fragile: Throws error if used outside provider context
- No error boundary to catch this error → app crashes
- Safe modification: Add error boundary wrapper or verify provider setup

**Menu State and DOM Side Effects:**
- File: `app/components/hero-section/HeroSection.tsx` (lines 19-25)
- Issue: Directly modifies `document.body.style.overflow` to prevent scroll
- Why fragile: Multiple components could try to manage this, conflicts possible
- Safe modification: Use CSS-only solution or portal pattern

## Missing Error Boundaries

**Critical Gap:**
- Issue: No error boundary component exists
- Impact: Any component error crashes entire application (white screen)
- Fix: Create `app/components/error-boundary/ErrorBoundary.tsx` or wrap app with error handler
- Priority: **HIGH** (affects availability)

**Missing Image Error Handlers:**
- Issue: Next.js Image components lack `onError` handlers
- Files: 7+ files use Image component
- Impact: Broken image links show as blank with no fallback
- Fix: Add `onError` callback with fallback image/message
- Priority: Medium (affects UX on broken images)

## Testing Gaps

**Entire Codebase Untested:**
- No test files exist
- No test framework configured
- Critical paths without coverage:
  - Locale switching logic (`app/lib/navigation.ts`)
  - Translation context behavior
  - Component rendering with different translations
  - Menu open/close state management
  - Responsive behavior

## Documentation Gaps

**Missing .env.example:**
- Issue: No `.env.example` file documenting environment variables
- Expected: Document `NEXT_PUBLIC_SITE_URL` and any other env vars
- Impact: New developers don't know what to configure
- Fix: Create `.env.example` with sample values
- Priority: Low (currently only one env var)

**Undocumented Animation Logic:**
- File: `app/components/trusted-by-section/TrustedBySection.tsx`
- Issue: 70+ lines of GSAP animation code without comments
- Impact: Difficult to maintain or modify animation behavior
- Fix: Add comments explaining timeline logic and responsive breakpoints
- Priority: Medium (complex code needs explanation)

**Middleware Integration Unclear:**
- Issue: `proxy.ts` exists but relationship to Next.js routing unclear
- Impact: Confusion about how locale detection works
- Fix: Document middleware pattern or move to explicit `middleware.ts`
- Priority: Low (appears to work)

## Unused Code

**usePathname Import:**
- File: `app/components/language-selector/LanguageSelector.tsx` (line 21)
- Import: `import { usePathname } from "next/navigation"`
- Status: Imported but never used
- Fix: Remove unused import
- Priority: Low (cleanup)

**usePathname in Context:**
- File: `app/contexts/TranslationContext.tsx` (line 29)
- Pattern: `const pathname = usePathname()` - assigned but never used
- Fix: Remove unused variable
- Priority: Low (cleanup)

---

## Summary Priority Matrix

| Category | Severity | Count | Action |
|----------|----------|-------|--------|
| **HIGH** | Blocking | 2 | CMS integration, error boundaries |
| **MEDIUM** | Important | 8 | Navigation abstraction, broken links, test framework |
| **LOW** | Nice-to-have | 10 | Cleanup, documentation, minor fixes |

**Next Steps (Recommended):**
1. Add error boundary for crash prevention
2. Replace hardcoded project data with CMS
3. Fix broken social media links
4. Remove unused imports
5. Document environment variables in `.env.example`

---

*Concerns audit: 2026-01-12*
*Update as issues are fixed or new ones discovered*

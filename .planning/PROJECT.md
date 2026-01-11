# Saint 6 Studio

## What This Is

A modern portfolio website for Saint 6 Studio, a creative agency. It showcases design work, team, and services with bilingual support (English/Vietnamese). Built with Next.js, React 19, and TypeScript. Currently has hardcoded project data that needs to be replaced with a dynamic CMS backend.

## Core Value

Seamless, animated portfolio experience that dynamically displays project work from a content management system.

## Requirements

### Validated

- ✓ Bilingual website (English/Vietnamese) — existing i18n implementation
- ✓ Responsive design (mobile-first) — existing Tailwind CSS setup
- ✓ Component library with Shadcn/ui — 4 UI primitives in place
- ✓ Header, footer, and navigation sections — implemented
- ✓ Gallery grid for images — implemented
- ✓ Smooth animations with GSAP — implemented in TrustedBySection
- ✓ SEO metadata per locale — existing Next.js metadata setup

### Active

- [ ] CMS backend integration (replacing hardcoded project data)
  - Currently: Example data hardcoded in `app/[locale]/page.tsx`
  - Target: Fetch projects, team, testimonials from CMS at build time
- [ ] Error boundaries for crash prevention
  - Impact: Missing error boundary causes white screen on component errors
  - Location: Root layout or app wrapper
- [ ] Social media links functionality
  - Currently: Placeholder `href="#"` in footer/social links
  - Target: Connect to actual social profiles
- [ ] Image error handling
  - Currently: Next.js Image components have no fallbacks
  - Target: Add `onError` handlers with fallback images
- [ ] Clean up unused imports
  - `usePathname` in LanguageSelector.tsx
  - `usePathname()` in TranslationContext.tsx

### Out of Scope

- Backend authentication system — Static portfolio, no user accounts needed
- Backend database — CMS handles data persistence
- Real-time updates — Static generation sufficient (build-time content)
- Ecommerce/payments — Portfolio only, no transactions
- User-generated content — Gallery is curated/managed via CMS
- Test coverage in v1 — Will add testing framework after CMS integration

## Context

**Codebase State:**
- Modern Next.js 16 + React 19 stack with TypeScript strict mode
- Component-based architecture with clean separation of concerns
- Custom i18n implementation (no external library)
- Biome linter/formatter configured
- React Compiler enabled for automatic memoization
- GSAP animations for visual polish
- 14+ components organized by feature

**Current Limitations:**
- No backend API calls (all data hardcoded)
- No test coverage (linting only via Biome)
- No error boundaries (app crashes on component errors)
- Social links are non-functional (placeholders)

**Team Context:**
- Solo developer (implied by usage of Claude Code)
- Rapid prototyping mode (MVP with hardcoded data)
- Ready to move to production-grade setup

**User Expectations:**
- Portfolio should display current/updated projects
- Data should be manageable without code changes
- Site should be reliable (no crashes)
- Mobile and desktop experiences should work seamlessly

## Constraints

- **CMS Choice**: TBD — Need to choose headless CMS (Strapi, Contentful, Sanity, Supabase, etc.)
- **Build Strategy**: Static generation (current) or ISR (incremental static regeneration)
- **Data Structure**: Projects, team members, testimonials, gallery images
- **Deployment**: Vercel (implied by Next.js App Router usage)
- **Development Speed**: Want quick wins before perfection

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Next.js App Router + React 19 | Modern, performant, built-in optimizations | ✓ Good - enables React Compiler |
| Custom i18n vs external library | Lightweight, full control, simple data | — Pending - works well for 2 locales |
| Hardcoded data in MVP | Faster initial development | ⚠️ Revisit - needs CMS integration |
| No testing framework yet | Speed up MVP, add after CMS | — Pending - no test coverage |
| CSS Modules + Tailwind hybrid | Component scoping + utility classes | ✓ Good - best of both worlds |

---

*Last updated: 2026-01-12 after codebase mapping*

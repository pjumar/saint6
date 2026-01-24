# Saint 6 Studio

## What This Is

A modern portfolio website for Saint 6 Studio, a creative agency. It showcases design work, team, and services with bilingual support (English/Vietnamese). Built with Next.js, React 19, and TypeScript. Currently has hardcoded project data that needs to be replaced with a dynamic CMS backend.

## Core Value

Seamless, animated portfolio experience that dynamically displays project work from a content management system.

## Current State (v0.2)

**Shipped:** Homepage + Studio Rental page complete with responsive design and Vietnamese translations.

**Codebase:**
- ~6,378 lines TypeScript/CSS
- 14+ components organized by feature
- 8 reusable service page components established
- Service page template documented for Phase 3-5 reuse

**What Works:**
- Homepage with GSAP animations and responsive layout
- Studio Rental page with all sections (hero, rooms, FAQ, contact form)
- Vietnamese translations for Studio Rental content
- FAQ accordion with smooth expand/collapse
- Contact form with client-side validation

## Requirements

### Validated

- ✓ Bilingual website (English/Vietnamese) — v0.2
- ✓ Responsive design (mobile-first) — v0.2
- ✓ Component library with Shadcn/ui — v0.2
- ✓ Header, footer, and navigation sections — v0.2
- ✓ Gallery grid for images — v0.2
- ✓ Smooth animations with GSAP — v0.2
- ✓ SEO metadata per locale — v0.2
- ✓ Studio Rental service page — v0.2
- ✓ FAQ accordion component — v0.2
- ✓ Contact inquiry form with validation — v0.2

### Active

- [ ] Remaining service pages (Set Design, Production, Event Planning, Decoration, Creative)
- [ ] About Us page
- [ ] Contact Us page
- [ ] CMS backend integration (replacing hardcoded project data)
- [ ] Error boundaries for crash prevention
- [ ] Social media links functionality
- [ ] Image error handling

### Out of Scope

- Backend authentication system — Static portfolio, no user accounts needed
- Backend database — CMS handles data persistence
- Real-time updates — Static generation sufficient (build-time content)
- Ecommerce/payments — Portfolio only, no transactions
- User-generated content — Gallery is curated/managed via CMS
- Test coverage in v1 — Will add testing framework after CMS integration

## Context

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
| Custom i18n vs external library | Lightweight, full control, simple data | ✓ Good - works well for 2 locales |
| Hardcoded data in MVP | Faster initial development | ⚠️ Revisit - needs CMS integration |
| No testing framework yet | Speed up MVP, add after CMS | — Pending - no test coverage |
| CSS Modules + Tailwind hybrid | Component scoping + utility classes | ✓ Good - best of both worlds |
| Hero Height Strategy (01-02) | Viewport-based sizing (100vh) with min/max | ✓ Good - responsive control |
| Phase Sign-off Approach (01-03) | User approves based on visual inspection | ✓ Good - faster iteration |
| Shared HeroSection (02-01) | Reuse homepage hero for service pages | ✓ Good - consistent UX |

---

*Last updated: 2026-01-24 after v0.2 milestone*

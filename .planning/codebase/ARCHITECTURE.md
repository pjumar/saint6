# Architecture

**Analysis Date:** 2026-01-12

## Pattern Overview

**Overall:** Component-Based Frontend with Next.js App Router

**Key Characteristics:**
- Modern React 19 + Next.js 16 frontend application
- File-based routing with dynamic locale segments
- Client and Server Component mixture
- Global state management via React Context
- Static generation with client-side hydration (JAMstack approach)
- Animation-heavy UI with GSAP

## Layers

**Presentation Layer:**
- Purpose: Render UI and handle user interactions
- Contains: React components (sections, features, primitives)
- Location: `app/components/*` (14+ component directories)
- Depends on: Context API for state, utility functions
- Used by: Page layouts, other components

**State/Context Layer:**
- Purpose: Manage application-wide state (translation/locale)
- Contains: TranslationProvider context, useTranslation hook
- Location: `app/contexts/TranslationContext.tsx`
- Depends on: React Hooks (useState, useContext, useEffect)
- Used by: All components needing translation or locale

**Utility Layer:**
- Purpose: Reusable helper functions and type definitions
- Contains: Navigation logic, CSS utilities, type definitions
- Location: `app/lib/navigation.ts`, `app/lib/utils.ts`, `app/types.ts`
- Depends on: TypeScript types, Next.js routing
- Used by: Components and contexts

**Configuration Layer:**
- Purpose: Build-time and runtime configuration
- Contains: Next.js config, TypeScript config, Tailwind setup
- Location: Root configuration files (`next.config.ts`, `tsconfig.json`, etc.)
- Depends on: Package.json, environment variables
- Used by: Build system and runtime

## Data Flow

**Initial Page Load:**
1. User requests `https://saint6studio.com/[locale]`
2. Next.js App Router matches `app/[locale]/layout.tsx`
3. `generateStaticParams()` provides pre-rendered "en" and "vi" locales
4. `generateMetadata()` creates locale-specific SEO metadata
5. Layout component renders with TranslationProvider wrapper
6. Page component `app/[locale]/page.tsx` orchestrates sections
7. Sections render with hardcoded project data (TODO: CMS integration)
8. Client hydrates with translations loaded from JSON

**User Interaction Flow (Language Switch):**
1. User clicks language selector in header
2. `LanguageSelector.tsx` calls `switchLocale()` function
3. `switchLocale()` replaces locale segment in URL path
4. Next.js navigates to new locale route
5. Page re-renders with new language selected
6. TranslationProvider updates context with new dictionary
7. All components re-render with new translations

**Component Composition Flow:**
```
RootLayout (app/layout.tsx - passthrough)
  └─ LocaleLayout (app/[locale]/layout.tsx)
      ├─ TranslationProvider (wraps children)
      └─ LocalePageContent (app/[locale]/page.tsx)
          ├─ HeroSection (Header + MenuOverlay + hero content)
          ├─ TrustedBySection (animated brand logos)
          ├─ GallerySection (image grid)
          ├─ KeyProjectSection (featured project with testimonial)
          └─ Footer (global)
```

**State Management:**
- Global: Translation state via React Context
- Component: Local state via useState for UI interactions (menu open, etc.)
- No persistence: All state is ephemeral (resets on page reload)
- No API calls: All data is static/hardcoded

## Key Abstractions

**Section Components:**
- Purpose: Large layout sections that compose the page
- Examples: `HeroSection.tsx`, `TrustedBySection.tsx`, `GallerySection.tsx`, `KeyProjectSection.tsx`
- Pattern: Props-based configuration, pure functional components
- Location: `app/components/{section-name}/`

**Feature Components:**
- Purpose: Interactive UI elements with behavior
- Examples: `Header.tsx`, `MenuOverlay.tsx`, `LanguageSelector.tsx`, `Footer.tsx`
- Pattern: Manage local state, handle events, delegate to children
- Location: `app/components/{feature-name}/`

**UI Primitives:**
- Purpose: Base design system components
- Examples: `Button.tsx`, `Card.tsx`, `Badge.tsx`, `Separator.tsx`
- Pattern: CVA (Class Variance Authority) for variant management
- Source: shadcn/ui (Radix UI + Tailwind)
- Location: `app/components/ui/`

**Context Providers:**
- Purpose: Global state and utilities accessible to all components
- Example: TranslationProvider with useTranslation hook
- Pattern: React Context API with useContext hook
- Location: `app/contexts/`

**Utility Functions:**
- Purpose: Pure helper functions for common operations
- Examples: `getLocalizedPath()`, `switchLocale()`, `cn()` (CSS class merger)
- Pattern: Functional, no side effects, testable
- Location: `app/lib/`

## Entry Points

**Page Entry Point:**
- Location: `app/[locale]/page.tsx`
- Triggers: Direct navigation to locale path (en, vi)
- Responsibilities: Orchestrate page layout, compose sections, pass project data
- Exports: Home component function

**Layout Entry Point:**
- Location: `app/[locale]/layout.tsx`
- Triggers: All requests to locale paths
- Responsibilities: Setup fonts, wrap with providers, apply global styles
- Exports: generateMetadata (SEO), generateStaticParams (static generation), LocaleLayout

**Root Layout:**
- Location: `app/layout.tsx`
- Triggers: All requests
- Responsibilities: Minimal (just returns children)
- Purpose: Required by Next.js App Router

**Context Provider Entry:**
- Location: `app/contexts/TranslationContext.tsx`
- Triggers: Layout initialization
- Responsibilities: Load translation dictionary, provide via Context
- Exports: TranslationProvider component, useTranslation hook

## Error Handling

**Strategy:** Minimal error handling in current architecture

**Patterns:**
- TranslationContext throws if `useTranslation()` called without provider
- No error boundaries present (app crashes if component throws)
- No image loading error handling or fallbacks
- No API error handling (no API calls currently)

**Gaps:**
- Missing error boundary component for crash prevention
- Missing fallback UI for failed image loads

## Cross-Cutting Concerns

**Internationalization (i18n):**
- Implementation: Manual locale routing + JSON translation files
- Location: `app/translations/{en,vi}.json`
- Transport: TranslationContext provides to entire tree
- No external i18n library (custom solution)

**Styling:**
- Approach: CSS Modules (component-scoped) + Tailwind CSS (utility)
- Variables: Global CSS variables in `app/globals.css`
- Responsive: Mobile-first, media queries for desktop breakpoints
- Strategy: Tailwind for layout/utilities, CSS Modules for component-specific styles

**Animation:**
- Framework: GSAP (GreenSock Animation Platform)
- Usage: Complex scroll animations in TrustedBySection
- Responsive: Animations only run on mobile, disabled on desktop
- Cleanup: useEffect cleanup properly disposes timelines

---

*Architecture analysis: 2026-01-12*
*Update when major patterns change*

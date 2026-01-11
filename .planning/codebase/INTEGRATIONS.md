# External Integrations

**Analysis Date:** 2026-01-12

## APIs & External Services

**Status:** No direct external API integrations currently

The application is self-contained with no backend dependencies or third-party service integrations at this time.

## Data Storage

**Static Content:**
- All data hardcoded in components
- Example project data in `app/[locale]/page.tsx` (lines 52+)
- Gallery images served from `public/images/gallery/`
- Brand logos from `public/images/brands/`

**Future Integration:**
- TODO comment in `app/[locale]/page.tsx` line 52: "Replace with actual CMS data fetching"
- Planned to integrate headless CMS (type unspecified)

## Authentication & Identity

**Status:** No authentication configured

The site is public with no user accounts or authentication required.

## Monitoring & Observability

**Status:** No monitoring configured

- No error tracking (Sentry, etc.)
- No analytics (Google Analytics, Mixpanel, etc.)
- No logging service
- No performance monitoring

## Image Hosting

**Local Storage:**
- All images stored in `public/images/` directory
- Served via Next.js static file serving
- Optimized via Next.js Image component

**Image Locations:**
- Hero images: `public/images/hero/`
- Gallery images: `public/images/gallery/` (15+ images)
- Project images: `public/images/project/`
- Brand logos: `public/images/brands/` (company client logos)
- Decorative assets: `public/images/` and `public/assets/`

## Fonts & Typography

**Google Fonts:**
- Integration method: Next.js `next/font/google` native integration
- No external CSS link required (optimized by Next.js)
- Fonts configured in `app/[locale]/layout.tsx`:
  - Public Sans - Body text
  - Spectral - Headings
  - JetBrains Mono - Captions/code

**Font Loading:**
- Static font loading (no variable fonts)
- Fonts preloaded by Next.js
- Zero layout shift via Next.js font optimization

## Internationalization (i18n)

**Custom Implementation:**
- Not using external i18n library (next-i18n-router, react-i18next, etc.)
- Manual locale routing via `[locale]` dynamic segment
- Translation files: `app/translations/{en,vi}.json`

**Locale Support:**
- English (en) - Default
- Vietnamese (vi)
- Language picker in header: `app/components/language-selector/LanguageSelector.tsx`

**Middleware:**
- Locale detection middleware in `proxy.ts`
- Accepts language preference from `Accept-Language` header
- Falls back to English if unsupported locale requested

**Translation Management:**
- Hierarchical JSON structure in translation files
- Examples: `HERO.HEADING`, `NAVIGATION.STUDIO_RENTAL`, `TRUSTED_BY.TITLE`
- Accessed via `useTranslation()` hook from `TranslationContext`

## Static Asset Hosting

**CDN Approach:**
- All static assets served from `public/` directory
- Next.js handles caching headers automatically
- Images use Next.js Image component for optimization

**Asset Types:**
- SVG logos: `public/assets/saint6-logo.svg`
- PNG/JPG images: `public/images/**/*.{png,jpg}`
- Metadata: `favicon.ico`, `apple-touch-icon.png`
- Manifest: `manifest.json` (PWA config, if present)

## Environment Configuration

**Development:**
- Base URL fallback: `https://saint6studio.com` (hardcoded)
- Environment variable: `NEXT_PUBLIC_SITE_URL` (used for metadata)
- No `.env.example` file (documentation gap)

**Production:**
- Deployment platform: Vercel (inferred from Next.js setup)
- Environment variables: Configured in Vercel dashboard
- Base URL: Set via `NEXT_PUBLIC_SITE_URL` in deployment

**Missing Configuration:**
- No `.env.example` file to document required variables
- No API endpoint configuration
- No backend URL configuration

## Analytics & Tracking

**Current Status:** None configured

**Potential Integrations (Future):**
- Google Analytics (gtag)
- Mixpanel or Segment for product analytics
- Hotjar for user behavior recording
- Sentry for error tracking

## Deployment & Hosting

**Platform:** Vercel (implied by Next.js App Router usage)

**Features:**
- Static generation for performance
- Automatic image optimization
- CDN distribution globally
- Zero-downtime deployments

**Build Process:**
- Next.js build output: `.next/` directory
- No server-side rendering (static generation)
- All routes pre-built at build time

## Webhooks

**Status:** No webhooks configured

No incoming or outgoing webhooks are implemented.

## Third-Party Scripts

**Status:** None

No third-party scripts (tracking, fonts in <script>, etc.) are included. Google Fonts are loaded via Next.js native integration (optimized).

## Security & Secrets

**Current Status:** No secrets used

- No API keys in code
- No authentication tokens
- No private credentials

**Secret Management (If Needed):**
- Store in Vercel environment variables (dashboard)
- Access via `process.env.SECRET_NAME` in server code
- Never commit `.env.local` file
- Create `.env.example` for documentation

---

*Integration audit: 2026-01-12*
*Update when adding/removing external services*

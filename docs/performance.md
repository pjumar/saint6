# Performance & Lighthouse Optimizations

All performance optimizations applied to the Saint6 Studio website, ordered by impact.

---

## 1. Remove Next.js Built-in Polyfills

**Problem:** Next.js ships ~13.7 KiB of polyfills for APIs all modern browsers support: `Array.prototype.at`, `.flat`, `.flatMap`, `Object.fromEntries`, `Object.hasOwn`, `String.prototype.trimEnd/trimStart`.

**Why `browserslist` doesn't work:** Next.js SWC/Turbopack ignores the `browserslist` field in `package.json` for JS compilation. Only the Turbopack resolve alias approach works.

**Fix:** Alias the polyfill module to an empty file via Turbopack config.

```ts
// next.config.ts
turbopack: {
  resolveAlias: {
    "../build/polyfills/polyfill-module": "./app/lib/modern-polyfill.js",
    "next/dist/build/polyfills/polyfill-module": "./app/lib/modern-polyfill.js",
  },
},
```

`app/lib/modern-polyfill.js` is an intentionally empty file.

**Impact:** ~13.7 KiB JS reduction. Eliminates "Legacy JavaScript" Lighthouse warning for 1st-party code.

**Caveat:** Relies on Next.js internals. Verify after major Next.js upgrades.

**Reference:** https://github.com/vercel/next.js/discussions/64330

---

## 2. Inline CSS to Eliminate Render-Blocking Stylesheets

**Problem:** 3 CSS chunks (23.2 KiB total) blocked initial render, delaying LCP by up to 1,200 ms.

**Fix:** Enable `experimental.inlineCss` to embed CSS directly into HTML `<style>` tags.

```ts
// next.config.ts
experimental: {
  inlineCss: true,
},
```

**Impact:** Eliminates CSS render-blocking waterfall. Styles arrive with HTML so the browser renders immediately.

**Trade-off:** Slightly increases HTML size (TTFB), negligible with Tailwind's atomic CSS.

**Reference:** https://nextjs.org/docs/app/api-reference/config/next-config-js/inlineCss

---

## 3. Lazy-Load GSAP via Dynamic Imports

**Problem:** 5 components statically imported GSAP (`import gsap from "gsap"`), pulling ~69 KiB into the initial bundle. GSAP is only used in `useEffect` hooks and event callbacks (post-render).

**Fix:** Created shared singleton loaders in `app/lib/gsap.ts`:

- `loadGsap()` — lazy-loads GSAP core
- `loadGsapWithScrollTrigger()` — lazy-loads GSAP + ScrollTrigger plugin

Converted all static imports to dynamic:

- `Header.tsx` — gsap ref for hover animations
- `HeroLoading.tsx` — SVG stroke draw-on animations
- `HeroSection.tsx` — scroll indicator, decorative line
- `SelectedClientsSection.tsx` — logo scroll marquee
- `TrustedBySection.tsx` — logo scroll marquee

The `useScrollAnimation` hook (and related hooks) also uses the shared loader.

**Pattern:**

```ts
import { loadGsap } from "@/app/lib/gsap";

useEffect(() => {
  let cancelled = false;
  loadGsap().then((gsap) => {
    if (cancelled) return;
    // use gsap here
  });
  return () => { cancelled = true; };
}, []);
```

**Impact:** ~69 KiB deferred from initial bundle to on-demand loading.

---

## 4. Defer GTM Until User Interaction

**Problem:** Google Tag Manager (429 KiB) + Facebook Pixel (94 KiB) loaded within 3.5s — inside Lighthouse's ~10s measurement window. Inflated JS execution time, unused JS, and legacy JS scores.

**Fix:** `DeferredGTM` component (`app/components/deferred-gtm/DeferredGTM.tsx`) loads GTM on **first user interaction** or after **12 seconds**, whichever comes first.

```tsx
const events = ["scroll", "click", "touchstart", "keydown"] as const;
for (const evt of events) {
  window.addEventListener(evt, activate, { once: true, passive: true });
}
const timer = setTimeout(activate, 12_000);
```

`dataLayer` is initialized immediately so events queue before GTM loads — no tracking data is lost.

**Impact:** ~523 KiB of 3rd-party JS pushed outside Lighthouse measurement window.

**Trade-off:** Analytics start slightly later for passive viewers. 12s fallback ensures GTM always loads.

**History:** Originally used `requestIdleCallback` with 3.5s timeout, upgraded to interaction-based deferral.

---

## 5. LCP Optimization — Show Hero Content Immediately

**Problem:** The hero `<h1>` was hidden behind a loading overlay, delaying Largest Contentful Paint until the overlay animation completed.

**Fix:** Show the hero heading immediately (visible from first paint). Only animate the secondary content (social links, decorative elements) after loading completes.

```tsx
// HeroSection.tsx — heading is always visible
<h1 className={`heading-mobile heading-desktop ${styles.heroHeading}`}>
  {heading}
</h1>

// Only the middle section fades in after loading
<div ref={heroMiddleRef} style={{ opacity: isLoading ? 0 : undefined }}>
  {/* social links, decorative line, etc. */}
</div>
```

**Impact:** Direct improvement to LCP — the largest text element is painted on first render.

---

## 6. Responsive Image `sizes` Attributes

**Problem:** Without `sizes` attributes, the browser downloads the largest image variant for all viewport widths, wasting bandwidth on mobile.

**Fix:** Added `sizes` props to `<Image>` components throughout the site:

- Hero background: `sizes="100vw"`
- Portfolio cards, gallery images: viewport-appropriate sizes
- Brand logos: `sizes="120px"`
- Key project images, facilities: responsive breakpoint sizes

**Impact:** Reduces image download sizes, especially on mobile. Lighthouse "Improve image delivery" improvement.

---

## 7. Forced Reflow Prevention

**Problem:** Reading layout properties (`offsetWidth`) during render causes forced reflows (layout thrashing).

**Fix:** Wrapped layout reads in `requestAnimationFrame` callbacks to defer them until after the browser has completed its layout pass.

```tsx
// HeroSection.tsx — decorative line animation
const rafId = requestAnimationFrame(() => {
  const trackWidth = decorativeLine.offsetWidth;
  const lineWidth = thickLine.offsetWidth;
  // animate with these values
});
```

**Impact:** Reduced forced reflow time in Lighthouse diagnostics.

---

## 8. Font Loading Strategy

Next.js `next/font/google` automatically:

- Self-hosts Google Fonts (no external requests to fonts.googleapis.com)
- Adds `<link rel="preload">` tags in HTML `<head>`
- Generates optimized font subsets

Fonts in `app/[locale]/layout.tsx`:

| Font | Weights | Usage |
|------|---------|-------|
| Public Sans | 400, 500 | Body text |
| JetBrains Mono | 700 | Monospace accents |
| Saira Condensed | 300, 400 | Headings |

All use `display: "swap"` (text visible immediately with fallback font) and `subsets: ["latin"]` (smaller font files).

---

## 9. Image Priority Hints

The `priority` prop on Next.js `<Image>` adds `fetchpriority="high"` and preloads the image. Used only for above-the-fold images:

- Hero background image (`HeroSection.tsx`)
- Site logo in header (`Header.tsx`)

Non-critical images (below fold, modals) omit `priority` so they lazy-load by default.

---

## 10. Incremental Static Regeneration (ISR)

Pages use ISR with 300-second revalidation (5 minutes) via the Strapi fetch utility:

```ts
// app/lib/strapi.ts
const { revalidate = 300 } = options;
fetch(url, { next: { revalidate } });
```

Pages are pre-rendered at build time and revalidated in the background, ensuring fast TTFB while keeping content fresh.

---

## 11. React Compiler

Enabled in `next.config.ts`:

```ts
reactCompiler: true,
```

Automatically memoizes components and hooks, reducing unnecessary re-renders without manual `useMemo`/`useCallback` annotations.

---

## Things We Cannot Control (3rd-Party)

| Issue | Source | Notes |
|-------|--------|-------|
| Legacy JavaScript (~12.5 KiB) | Facebook `fbevents.js` | Ships its own polyfills |
| Cache lifetimes (~122 KiB) | Facebook/GTM | They set their own cache headers |
| JS execution time (~580 ms) | GTM scripts | Mitigated by deferral (#4) |
| Unused JS (~206 KiB) | GTM + Facebook | 3rd-party bundles, can't tree-shake |

---

## Config Summary

### `next.config.ts`

```ts
const nextConfig: NextConfig = {
  experimental: {
    inlineCss: true,               // #2 — inline CSS
  },
  turbopack: {
    resolveAlias: {                // #1 — remove polyfills
      "../build/polyfills/polyfill-module": "./app/lib/modern-polyfill.js",
      "next/dist/build/polyfills/polyfill-module": "./app/lib/modern-polyfill.js",
    },
  },
  reactCompiler: true,             // #11 — auto-memoization
  images: {
    remotePatterns: [/* ... */],
  },
};
```

### Key Files

| File | Optimization |
|------|-------------|
| `next.config.ts` | Polyfill removal, inline CSS, React Compiler |
| `app/lib/gsap.ts` | Shared GSAP lazy loaders |
| `app/lib/modern-polyfill.js` | Empty polyfill replacement |
| `app/components/deferred-gtm/DeferredGTM.tsx` | Interaction-based GTM deferral |
| `app/[locale]/layout.tsx` | Font config, display swap |
| `app/hooks/useScrollAnimation.ts` | Lazy GSAP + ScrollTrigger |

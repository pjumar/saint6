# Performance & Lighthouse Optimizations

This document tracks all performance optimizations applied to the Saint6 Studio website.

## 1. Modern Browser Targets — Remove Legacy Polyfills

**Problem:** Next.js ships ~13.7 KiB of polyfills for APIs that all modern browsers already support: `Array.prototype.at`, `.flat`, `.flatMap`, `Object.fromEntries`, `Object.hasOwn`, `String.prototype.trimEnd/trimStart`.

**Fix:** Alias Next.js's built-in polyfill module to an empty file via Turbopack config. The `browserslist` field in `package.json` does **not** affect Next.js SWC/Turbopack JS compilation — only the resolve alias works.

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

**Impact:** ~13.7 KiB reduction in 1st-party JS. Eliminates the "Legacy JavaScript" Lighthouse warning for 1st-party code.

**Caveat:** Relies on Next.js internals that could change between versions. Verify after major Next.js upgrades.

**Reference:** https://github.com/vercel/next.js/discussions/64330

---

## 2. Inline CSS — Eliminate Render-Blocking Stylesheets

**Problem:** CSS chunks (23.2 KiB across 3 files) were render-blocking, delaying LCP by up to 1,200 ms.

**Fix:** Enable `experimental.inlineCss` in Next.js config. This embeds CSS directly into the HTML `<style>` tags instead of loading separate `.css` files.

```ts
// next.config.ts
experimental: {
  inlineCss: true,
},
```

**Impact:** Eliminates the CSS render-blocking waterfall. Styles arrive with the HTML so the browser can render immediately.

**Trade-off:** Slightly increases HTML size (TTFB), but this is negligible with Tailwind's atomic CSS approach. Works well for small-to-medium CSS bundles.

**Reference:** https://nextjs.org/docs/app/api-reference/config/next-config-js/inlineCss

---

## 3. Lazy-Load GSAP — Reduce Initial JS Bundle

**Problem:** 5 components statically imported GSAP (`import gsap from "gsap"`), pulling ~69 KiB into the initial JS bundle even though GSAP is only used in `useEffect` hooks and event callbacks (after render).

**Fix:** Created shared singleton loaders in `app/lib/gsap.ts`:
- `loadGsap()` — lazy-loads GSAP core
- `loadGsapWithScrollTrigger()` — lazy-loads GSAP + ScrollTrigger plugin

Converted all 5 components to use dynamic imports:
- `Header.tsx` — stores gsap in a ref, uses in hover callbacks
- `HeroLoading.tsx` — loads in useEffect for SVG stroke animations
- `HeroSection.tsx` — loads in callbacks and useEffects
- `SelectedClientsSection.tsx` — loads in useEffect for logo scroll
- `TrustedBySection.tsx` — loads in useEffect for logo scroll

The `useScrollAnimation` hook already used dynamic imports and was updated to use the shared loader.

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

**Impact:** ~69 KiB of GSAP moved from initial bundle to on-demand loading. Reduces "Reduce unused JavaScript" Lighthouse warning for 1st-party code.

---

## 4. Defer GTM Until User Interaction

**Problem:** Google Tag Manager (429 KiB) plus Facebook Pixel (94 KiB) loaded within 3.5 seconds, well inside Lighthouse's ~10s measurement window. This inflated JS execution time, unused JS, and legacy JS scores.

**Fix:** Changed `DeferredGTM` component to load GTM on the **first user interaction** (scroll, click, touch, keydown) or after **12 seconds**, whichever comes first.

```tsx
const events = ["scroll", "click", "touchstart", "keydown"] as const;
for (const evt of events) {
  window.addEventListener(evt, activate, { once: true, passive: true });
}
const timer = setTimeout(activate, 12_000);
```

**Impact:** Pushes ~523 KiB of 3rd-party JS (GTM + GA + FB Pixel) completely outside the Lighthouse measurement window. No tracking data is lost because `dataLayer` queues events before GTM loads.

**Trade-off:** Analytics start slightly later for users who don't interact. The 12s fallback ensures GTM still loads even if user is passively viewing.

---

## 5. Font Preloading (Already Handled)

Next.js `next/font/google` automatically self-hosts Google Fonts and adds `<link rel="preload">` tags in the HTML `<head>`. No manual configuration needed.

Fonts configured in `app/[locale]/layout.tsx`:
- Public Sans (400, 500) — body text
- JetBrains Mono (700) — monospace
- Saira Condensed (300, 400) — headings

All use `display: "swap"` and `subsets: ["latin"]`.

---

## Things We Cannot Control (3rd-Party)

| Issue | Source | Why |
|-------|--------|-----|
| Legacy JavaScript (~12.5 KiB) | Facebook `fbevents.js` | Their code ships polyfills |
| Cache lifetimes (~122 KiB) | Facebook/GTM | They set their own cache headers |
| JS execution time (~580 ms) | GTM scripts | 3rd-party execution (mitigated by deferral) |
| Unused JS (~206 KiB) | GTM + Facebook | 3rd-party bundles load more than needed |

---

## Lighthouse Config Summary

All optimizations are in `next.config.ts`:

```ts
const nextConfig: NextConfig = {
  experimental: {
    inlineCss: true,               // #2 - inline CSS
  },
  turbopack: {
    resolveAlias: {                // #1 - remove polyfills
      "../build/polyfills/polyfill-module": "./app/lib/modern-polyfill.js",
      "next/dist/build/polyfills/polyfill-module": "./app/lib/modern-polyfill.js",
    },
  },
  reactCompiler: true,
  // ...images config
};
```

GTM deferral is in `app/components/deferred-gtm/DeferredGTM.tsx` (#4).
GSAP lazy loading is in `app/lib/gsap.ts` (#3).

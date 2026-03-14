# Next.js Performance & Lighthouse Playbook

Reusable patterns for scoring 90+ on Lighthouse Performance and Accessibility in Next.js (App Router) projects.

---

## 1. Remove Next.js Built-in Polyfills

Next.js ships ~13.7 KiB of polyfills (`Array.prototype.at`, `.flat`, `.flatMap`, `Object.fromEntries`, `Object.hasOwn`, `String.prototype.trimEnd/trimStart`) that all modern browsers already support.

**Why `browserslist` doesn't work:** Next.js SWC/Turbopack ignores `browserslist` in `package.json` for JS compilation.

**Fix:** Alias the polyfill module to an empty file via Turbopack config:

```ts
// next.config.ts
turbopack: {
  resolveAlias: {
    "../build/polyfills/polyfill-module": "./app/lib/modern-polyfill.js",
    "next/dist/build/polyfills/polyfill-module": "./app/lib/modern-polyfill.js",
  },
},
```

Create an empty `app/lib/modern-polyfill.js` file.

**Caveat:** Relies on Next.js internals — verify after major upgrades.

**Reference:** https://github.com/vercel/next.js/discussions/64330

---

## 2. Inline CSS

CSS chunks block initial render, delaying LCP. Next.js can embed CSS directly into HTML `<style>` tags:

```ts
// next.config.ts
experimental: {
  inlineCss: true,
},
```

Eliminates the CSS render-blocking waterfall. Slightly increases HTML size, negligible in practice.

**Reference:** https://nextjs.org/docs/app/api-reference/config/next-config-js/inlineCss

---

## 3. Lazy-Load Animation Libraries (GSAP, Framer Motion, etc.)

Animation libraries are only needed post-render (in `useEffect` or callbacks), so they should never be in the initial bundle.

**Pattern:** Create shared singleton loaders to avoid duplicate imports:

```ts
// app/lib/gsap.ts
let gsapPromise: Promise<typeof import("gsap").gsap> | null = null;

export function loadGsap() {
  if (!gsapPromise) {
    gsapPromise = import("gsap").then((m) => m.gsap ?? m.default);
  }
  return gsapPromise;
}

export function loadGsapWithScrollTrigger() {
  // similar pattern — registers plugin once
}
```

**Usage in components:**

```ts
useEffect(() => {
  let cancelled = false;
  loadGsap().then((gsap) => {
    if (cancelled) return;
    // use gsap
  });
  return () => { cancelled = true; };
}, []);
```

Applies to any heavy client-only library: GSAP, Three.js, Lottie, chart libraries, etc.

---

## 4. Defer GTM / Analytics Until User Interaction

GTM + tracking pixels (often 500+ KiB combined) inflate JS execution time, unused JS, and legacy JS scores when loaded inside Lighthouse's ~10s measurement window.

**Fix:** Load on first user interaction or after a fallback timeout:

```tsx
const events = ["scroll", "click", "touchstart", "keydown"] as const;
for (const evt of events) {
  window.addEventListener(evt, activate, { once: true, passive: true });
}
const timer = setTimeout(activate, 12_000); // fallback
```

Initialize `dataLayer` immediately so events queue before GTM loads — no tracking data is lost.

**Trade-off:** Analytics start slightly later for passive viewers.

---

## 5. LCP — Progressive Hero Image Loading

If LCP content is hidden behind a loading animation, LCP is delayed until the animation completes. Additionally, serving a full-size hero image to mobile devices wastes bandwidth.

**Fix:** Use progressive loading with Strapi's responsive image formats:

1. **Remove loading gates** — show hero content (heading, nav) immediately at FCP
2. **Use a blurred thumbnail placeholder** — Strapi auto-generates `thumbnail` (~245px) and `small` (~500px) formats. Show the smallest one with a CSS blur while the full image loads:

```tsx
// Placeholder: blurred thumbnail from Strapi formats
{placeholderImage && (
  <img
    src={placeholderImage}
    alt=""
    className={styles.heroPlaceholder}
    aria-hidden="true"
  />
)}
// Full image loads on top
<Image src={backgroundImage} alt={alt} fill priority
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 1440px"
/>
```

```css
.heroPlaceholder {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: blur(20px);
  transform: scale(1.1); /* prevents blur edges from showing */
}
```

**Get the thumbnail URL from Strapi formats:**

```ts
export function getStrapiThumbnailUrl(image: StrapiImage | undefined): string | null {
  const thumbUrl = image?.formats?.thumbnail?.url || image?.formats?.small?.url;
  // ... apply CDN rewrite same as getStrapiImageUrl
}
```

**Reference:** [Strapi + Next.js Performance](https://strapi.io/blog/performance-mistakes-strapi-nextjs-apps)

---

## 6. Responsive Image `sizes` & `deviceSizes`

Without `sizes`, the browser downloads the largest image variant for all viewports. Without custom `deviceSizes`, Next.js generates images up to 3840px which is overkill.

**Config:**

```ts
// next.config.ts
images: {
  deviceSizes: [640, 750, 828, 1080, 1200, 1440], // cap at site max-width
  imageSizes: [16, 32, 48, 64, 96, 128, 256],
},
```

**Guidelines:**

- Full-width hero: `sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 1440px"`
- Grid cards: `sizes="(min-width: 768px) 33vw, 100vw"`
- Fixed-size elements (logos, icons): `sizes="120px"`
- Above-the-fold images: add `priority` prop

```tsx
<Image src={src} alt={alt} fill sizes="(min-width: 768px) 50vw, 100vw" />
```

---

## 7. Avoid Forced Reflows

Reading layout properties (`offsetWidth`, `getBoundingClientRect`) during render causes layout thrashing.

**Fix:** Defer layout reads to `requestAnimationFrame`:

```ts
const rafId = requestAnimationFrame(() => {
  const width = element.offsetWidth;
  // animate with this value
});
return () => cancelAnimationFrame(rafId);
```

---

## 8. Font Loading

Use `next/font/google` or `next/font/local` for automatic self-hosting, preloading, and subsetting:

```ts
import { Public_Sans } from "next/font/google";

const publicSans = Public_Sans({
  subsets: ["latin"],
  display: "swap", // text visible immediately with fallback
  weight: ["400", "500"],
});
```

Key settings:
- `display: "swap"` — prevents invisible text during font load
- `subsets: ["latin"]` — reduces font file size
- Load only the weights you use

---

## 9. Image Priority Hints

The `priority` prop on Next.js `<Image>` adds `fetchpriority="high"` and preloads the image. Use only for above-the-fold images:

```tsx
<Image src={heroImg} alt="Hero" priority sizes="100vw" />
```

All other images lazy-load by default.

---

## 10. ISR / Static Generation + Cache Warming

Pre-render pages at build time with background revalidation for fast TTFB:

```ts
fetch(url, { next: { revalidate: 600 } }); // 10 minutes
```

Use `generateStaticParams` in every page file (not just layout) to ensure all locale variants are pre-built at deploy time:

```ts
export function generateStaticParams() {
  return [{ locale: "en" }, { locale: "vi" }];
}
```

**Cache warming cron:** Pair ISR with a warmup endpoint that hits all pages on a schedule shorter than `revalidate`, so the edge cache is always warm:

```ts
// vercel.json
{ "crons": [{ "path": "/api/warmup", "schedule": "*/8 * * * *" }] }
```

The warmup endpoint fetches all page URLs (locales x routes) to trigger ISR regeneration before real users hit a cold cache. Protect with `CRON_SECRET` env var.

**Preconnect hints:** Add `<link rel="preconnect">` and `<link rel="dns-prefetch">` for external origins (CMS, CDN) in the root layout `<head>` to save ~100-200ms on first connection.

---

## 11. React Compiler

```ts
// next.config.ts
reactCompiler: true,
```

Automatically memoizes components and hooks, eliminating manual `useMemo`/`useCallback`.

---

## 12. WCAG AA Text Contrast

Lighthouse flags text with contrast ratio below 4.5:1 (normal text) or 3:1 (large text).

**Common culprit:** `opacity: 0.4` or `rgba(*, *, *, 0.4)` on label/caption text.

**Fix:** Increase to `opacity: 0.65` — this passes on both light (`#f5f4f4`) and dark (`#880f00`) backgrounds.

**What to change:**
- Labels, captions, subtitles, counters, spec text — any text using low opacity
- `opacity` property on text elements
- `rgba()` alpha channel on `color` values

**What to leave alone:**
- Decorative lines, borders, dividers
- Icon buttons (close buttons, arrows)
- Background overlays

---

## 13. Main Landmark

Lighthouse flags "Page does not have a main landmark" if content isn't wrapped in `<main>`.

```tsx
// layout.tsx
<body>
  <Header />
  <main>{children}</main>
  <Footer />
</body>
```

Screen readers use this to skip navigation and jump to content.

---

## 3rd-Party Limitations

Issues you can mitigate but not eliminate:

| Issue | Source | Mitigation |
|-------|--------|------------|
| Legacy JavaScript | Facebook `fbevents.js`, older SDKs | Defer loading (#4) |
| Short cache lifetimes | Facebook/GTM set their own headers | None |
| JS execution time | GTM scripts | Defer loading (#4) |
| Unused JS | 3rd-party bundles | Can't tree-shake, defer instead |

---

## Quick Config Reference

```ts
// next.config.ts
const nextConfig: NextConfig = {
  experimental: {
    inlineCss: true,
  },
  turbopack: {
    resolveAlias: {
      "../build/polyfills/polyfill-module": "./app/lib/modern-polyfill.js",
      "next/dist/build/polyfills/polyfill-module": "./app/lib/modern-polyfill.js",
    },
  },
  reactCompiler: true,
  images: {
    deviceSizes: [640, 750, 828, 1080, 1200, 1440],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
  },
};
```

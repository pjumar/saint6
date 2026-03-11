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

## 5. LCP — Show Hero Content Immediately

If LCP content (hero heading, hero image) is hidden behind a loading animation, LCP is delayed until the animation completes.

**Fix:** Keep the LCP element visible from first paint. Only animate secondary/decorative content after loading:

```tsx
<h1>{heading}</h1> {/* always visible */}
<div style={{ opacity: isLoading ? 0 : undefined }}>
  {/* secondary content fades in */}
</div>
```

---

## 6. Responsive Image `sizes`

Without `sizes`, the browser downloads the largest image variant for all viewports.

**Guidelines:**
- Full-width images: `sizes="100vw"`
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

## 10. ISR / Static Generation

Pre-render pages at build time with background revalidation for fast TTFB:

```ts
fetch(url, { next: { revalidate: 300 } }); // 5 minutes
```

Or use `generateStaticParams` for dynamic routes.

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
};
```

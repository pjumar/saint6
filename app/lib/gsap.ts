let gsapPromise: Promise<typeof import("gsap").gsap> | null = null;

/**
 * Lazy-load GSAP to keep it out of the initial JS bundle.
 * Returns the same promise on repeated calls (singleton).
 */
export function loadGsap() {
  if (!gsapPromise) {
    gsapPromise = import("gsap").then((m) => m.gsap ?? m.default);
  }
  return gsapPromise;
}

let gsapWithScrollTriggerPromise: Promise<typeof import("gsap").gsap> | null =
  null;

/**
 * Lazy-load GSAP + ScrollTrigger plugin.
 */
export function loadGsapWithScrollTrigger() {
  if (!gsapWithScrollTriggerPromise) {
    gsapWithScrollTriggerPromise = Promise.all([
      import("gsap"),
      import("gsap/ScrollTrigger"),
    ]).then(([{ gsap }, { ScrollTrigger }]) => {
      gsap.registerPlugin(ScrollTrigger);
      return gsap;
    });
  }
  return gsapWithScrollTriggerPromise;
}

import { useEffect, useRef } from "react";
import { loadGsapWithScrollTrigger } from "@/app/lib/gsap";

export type AnimationType =
  | "fadeUp"
  | "fadeIn"
  | "fadeLeft"
  | "fadeRight"
  | "scale"
  | "scaleRotate"
  | "slideUp";

interface UseScrollAnimationOptions {
  type?: AnimationType;
  duration?: number;
  delay?: number;
  stagger?: number;
  start?: string;
  ease?: string;
  once?: boolean;
}

const animations: Record<AnimationType, Record<string, number>> = {
  fadeUp: {
    opacity: 0,
    y: 60,
  },
  fadeIn: {
    opacity: 0,
  },
  fadeLeft: {
    opacity: 0,
    x: -60,
  },
  fadeRight: {
    opacity: 0,
    x: 60,
  },
  scale: {
    opacity: 0,
    scale: 0.9,
  },
  scaleRotate: {
    opacity: 0,
    scale: 0.8,
    rotation: -5,
  },
  slideUp: {
    opacity: 0,
    y: 100,
    scale: 0.95,
  },
};

// Helper to compute target values from "from" state
const getToVars = (
  fromVars: Record<string, number>,
): Record<string, number> => {
  const toVars: Record<string, number> = {};
  for (const key of Object.keys(fromVars)) {
    if (key === "opacity") toVars[key] = 1;
    else if (key === "scale") toVars[key] = 1;
    else toVars[key] = 0; // x, y, rotation all go to 0
  }
  return toVars;
};

const loadGsap = loadGsapWithScrollTrigger;

export function useScrollAnimation<T extends HTMLElement>(
  options: UseScrollAnimationOptions = {},
) {
  const {
    type = "fadeUp",
    duration = 0.8,
    delay = 0,
    start = "top 85%",
    ease = "power3.out",
    once = true,
  } = options;

  const elementRef = useRef<T>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    let animation: gsap.core.Tween;
    let cancelled = false;

    loadGsap().then((gsap) => {
      if (cancelled) return;

      const fromVars = animations[type];
      gsap.set(element, fromVars);

      animation = gsap.to(element, {
        ...getToVars(fromVars),
        duration,
        delay,
        ease,
        scrollTrigger: {
          trigger: element,
          start,
          toggleActions: once
            ? "play none none none"
            : "play reverse play reverse",
        },
      });
    });

    return () => {
      cancelled = true;
      animation?.scrollTrigger?.kill();
      animation?.kill();
    };
  }, [type, duration, delay, start, ease, once]);

  return elementRef;
}

// Hook for animating multiple children with stagger
export function useScrollAnimationChildren<T extends HTMLElement>(
  options: UseScrollAnimationOptions = {},
) {
  const {
    type = "fadeUp",
    duration = 0.6,
    delay = 0,
    stagger = 0.1,
    start = "top 85%",
    ease = "power3.out",
    once = true,
  } = options;

  const containerRef = useRef<T>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const children = container.children;
    if (!children.length) return;

    let animation: gsap.core.Tween;
    let cancelled = false;

    loadGsap().then((gsap) => {
      if (cancelled) return;

      const fromVars = animations[type];
      gsap.set(children, fromVars);

      animation = gsap.to(children, {
        ...getToVars(fromVars),
        duration,
        delay,
        stagger,
        ease,
        scrollTrigger: {
          trigger: container,
          start,
          toggleActions: once
            ? "play none none none"
            : "play reverse play reverse",
        },
      });
    });

    return () => {
      cancelled = true;
      animation?.scrollTrigger?.kill();
      animation?.kill();
    };
  }, [type, duration, delay, stagger, start, ease, once]);

  return containerRef;
}

// Hook for spin-in animation on scroll
export function useSpiralSpin<T extends HTMLElement>(
  options: { duration?: number; start?: string } = {},
) {
  const { duration = 1.2, start = "top 85%" } = options;
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let animation: gsap.core.Tween;
    let cancelled = false;

    loadGsap().then((gsap) => {
      if (cancelled) return;

      gsap.set(el, { rotation: -180 });

      animation = gsap.to(el, {
        rotation: 0,
        duration,
        ease: "power3.out",
        scrollTrigger: {
          trigger: el,
          start,
          toggleActions: "play none none none",
        },
      });
    });

    return () => {
      cancelled = true;
      animation?.scrollTrigger?.kill();
      animation?.kill();
    };
  }, [duration, start]);

  return ref;
}

// Hook for grid animations with wave-like stagger from center
export function useScrollAnimationGrid<T extends HTMLElement>(
  options: {
    columns?: number;
    duration?: number;
    start?: string;
    ease?: string;
  } = {},
) {
  const { duration = 0.9, start = "top 85%", ease = "power2.out" } = options;
  const containerRef = useRef<T>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const children = Array.from(container.children) as HTMLElement[];
    if (!children.length) return;

    let animation: gsap.core.Tween;
    let cancelled = false;

    loadGsap().then((gsap) => {
      if (cancelled) return;

      gsap.set(children, {
        opacity: 0,
        scale: 0.95,
        y: 40,
      });

      animation = gsap.to(children, {
        opacity: 1,
        scale: 1,
        y: 0,
        duration,
        ease,
        stagger: {
          amount: 0.6,
          from: "start",
        },
        scrollTrigger: {
          trigger: container,
          start,
          toggleActions: "play none none none",
        },
      });
    });

    return () => {
      cancelled = true;
      animation?.scrollTrigger?.kill();
      animation?.kill();
    };
  }, [duration, start, ease]);

  return containerRef;
}

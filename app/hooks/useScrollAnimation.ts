import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register ScrollTrigger plugin
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

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

const animations: Record<AnimationType, gsap.TweenVars> = {
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
const getToVars = (fromVars: gsap.TweenVars): gsap.TweenVars => {
  const toVars: gsap.TweenVars = {};
  for (const key of Object.keys(fromVars)) {
    if (key === "opacity") toVars[key] = 1;
    else if (key === "scale") toVars[key] = 1;
    else toVars[key] = 0; // x, y, rotation all go to 0
  }
  return toVars;
};

export function useScrollAnimation<T extends HTMLElement>(
  options: UseScrollAnimationOptions = {}
) {
  const {
    type = "fadeUp",
    duration = 0.8,
    delay = 0,
    stagger = 0,
    start = "top 85%",
    ease = "power3.out",
    once = true,
  } = options;

  const elementRef = useRef<T>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const fromVars = animations[type];

    // Set initial state
    gsap.set(element, fromVars);

    // Create scroll trigger animation
    const animation = gsap.to(element, {
      ...getToVars(fromVars),
      duration,
      delay,
      ease,
      scrollTrigger: {
        trigger: element,
        start,
        toggleActions: once ? "play none none none" : "play reverse play reverse",
      },
    });

    return () => {
      animation.scrollTrigger?.kill();
      animation.kill();
    };
  }, [type, duration, delay, start, ease, once]);

  return elementRef;
}

// Hook for animating multiple children with stagger
export function useScrollAnimationChildren<T extends HTMLElement>(
  options: UseScrollAnimationOptions = {}
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

    const fromVars = animations[type];

    // Set initial state for all children
    gsap.set(children, fromVars);

    // Create scroll trigger animation with stagger
    const animation = gsap.to(children, {
      ...getToVars(fromVars),
      duration,
      delay,
      stagger,
      ease,
      scrollTrigger: {
        trigger: container,
        start,
        toggleActions: once ? "play none none none" : "play reverse play reverse",
      },
    });

    return () => {
      animation.scrollTrigger?.kill();
      animation.kill();
    };
  }, [type, duration, delay, stagger, start, ease, once]);

  return containerRef;
}

// Hook for grid animations with wave-like stagger from center
export function useScrollAnimationGrid<T extends HTMLElement>(
  options: { columns?: number; duration?: number; start?: string } = {}
) {
  const { columns = 5, duration = 0.6, start = "top 85%" } = options;
  const containerRef = useRef<T>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const children = Array.from(container.children) as HTMLElement[];
    if (!children.length) return;

    // Set initial state
    gsap.set(children, {
      opacity: 0,
      scale: 0.8,
      y: 30,
    });

    // Calculate stagger based on position - items in center appear first
    const animation = gsap.to(children, {
      opacity: 1,
      scale: 1,
      y: 0,
      duration,
      ease: "back.out(1.2)",
      stagger: {
        amount: 0.8,
        grid: [Math.ceil(children.length / columns), columns],
        from: "center",
      },
      scrollTrigger: {
        trigger: container,
        start,
        toggleActions: "play none none none",
      },
    });

    return () => {
      animation.scrollTrigger?.kill();
      animation.kill();
    };
  }, [columns, duration, start]);

  return containerRef;
}

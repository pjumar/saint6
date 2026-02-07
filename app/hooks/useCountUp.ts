import { useState, useEffect, useRef, useCallback } from "react";

interface UseCountUpOptions {
  duration?: number;
  delay?: number;
}

export function useCountUp(
  targetValue: string,
  options: UseCountUpOptions = {}
) {
  const { duration = 1500, delay = 0 } = options;
  const [displayValue, setDisplayValue] = useState("0");
  const [hasAnimated, setHasAnimated] = useState(false);
  const elementRef = useRef<HTMLElement>(null);

  // Parse the target value to extract number and suffix
  const parseValue = useCallback((value: string) => {
    const match = value.match(/^([\d,.]+)(.*)$/);
    if (match) {
      const numStr = match[1].replace(/,/g, "");
      const num = parseFloat(numStr);
      const suffix = match[2];
      const decimalPlaces = numStr.includes(".")
        ? numStr.split(".")[1]?.length || 0
        : 0;
      return { num, suffix, decimalPlaces };
    }
    return { num: 0, suffix: value, decimalPlaces: 0 };
  }, []);

  const animate = useCallback(() => {
    const { num: target, suffix, decimalPlaces } = parseValue(targetValue);

    if (target === 0) {
      setDisplayValue(targetValue);
      return;
    }

    const startTime = performance.now();
    const easeOutQuart = (t: number) => 1 - Math.pow(1 - t, 4);

    const step = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOutQuart(progress);
      const currentValue = target * easedProgress;

      const formattedValue =
        decimalPlaces > 0
          ? currentValue.toFixed(decimalPlaces)
          : Math.floor(currentValue).toString();

      setDisplayValue(formattedValue + suffix);

      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };

    requestAnimationFrame(step);
  }, [targetValue, duration, parseValue]);

  useEffect(() => {
    const element = elementRef.current;
    if (!element || hasAnimated) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            setHasAnimated(true);
            if (delay > 0) {
              setTimeout(animate, delay);
            } else {
              animate();
            }
          }
        });
      },
      { threshold: 0.1 }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [animate, delay, hasAnimated]);

  return { displayValue, elementRef };
}

"use client";

import { useCountUp } from "@/app/hooks/useCountUp";

interface AnimatedValueProps {
  value: string;
  className?: string;
  duration?: number;
  delay?: number;
}

export function AnimatedValue({
  value,
  className,
  duration = 1500,
  delay = 0,
}: AnimatedValueProps) {
  const { displayValue, elementRef } = useCountUp(value, { duration, delay });

  return (
    <span ref={elementRef as React.RefObject<HTMLSpanElement>} className={className}>
      {displayValue}
    </span>
  );
}

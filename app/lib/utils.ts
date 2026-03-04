import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Convert Strapi aspect-ratio enum (e.g. "w3_h2") to CSS value (e.g. "3/2").
 */
export function aspectRatioToCss(value?: string): string {
  if (!value) return "3/2";
  return value.replace(/^w(\d+)_h(\d+)$/, "$1/$2");
}

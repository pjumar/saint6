"use client";

import { useState, useCallback } from "react";

const DEFAULT_PLACEHOLDER = "/images/placeholder.svg";

interface UseImageFallbackResult {
  currentSrc: string;
  hasError: boolean;
  handleError: () => void;
}

/**
 * Custom hook for handling image load errors with fallback support.
 *
 * @param src - The original image source URL
 * @param fallbackSrc - Optional fallback image URL (defaults to placeholder.svg)
 * @returns Object containing currentSrc, hasError flag, and handleError callback
 *
 * @example
 * ```tsx
 * const { currentSrc, hasError, handleError } = useImageFallback(
 *   "/images/photo.jpg",
 *   "/images/default-photo.jpg"
 * );
 *
 * <Image
 *   src={currentSrc}
 *   onError={handleError}
 *   alt="Photo"
 * />
 * ```
 */
export function useImageFallback(
  src: string,
  fallbackSrc: string = DEFAULT_PLACEHOLDER
): UseImageFallbackResult {
  const [hasError, setHasError] = useState(false);

  const handleError = useCallback(() => {
    if (!hasError) {
      setHasError(true);
    }
  }, [hasError]);

  const currentSrc = hasError ? fallbackSrc : src;

  return {
    currentSrc,
    hasError,
    handleError,
  };
}

"use client";

import Image, { type ImageProps } from "next/image";
import { useCallback, useMemo, useState } from "react";
import styles from "./ProgressiveImage.module.css";

/**
 * Derive a Strapi thumbnail URL from a full-size image URL.
 * Strapi stores format variants by prefixing the filename:
 *   /uploads/image_abc123.jpg → /uploads/thumbnail_image_abc123.jpg
 *
 * Returns null for non-Strapi URLs (static images, SVGs, etc.).
 */
function deriveThumbnailUrl(src: string | undefined): string | null {
  if (!src || typeof src !== "string") return null;
  // Only derive for URLs containing /uploads/ (Strapi media pattern)
  const uploadsIndex = src.lastIndexOf("/uploads/");
  if (uploadsIndex === -1) return null;
  const before = src.slice(0, uploadsIndex + "/uploads/".length);
  const filename = src.slice(uploadsIndex + "/uploads/".length);
  // Skip if already a format variant
  if (/^(thumbnail|small|medium|large)_/.test(filename)) return null;
  return `${before}thumbnail_${filename}`;
}

type ProgressiveImageProps = Omit<ImageProps, "placeholder"> & {
  placeholderSrc?: string | null;
  containerClassName?: string;
  containerStyle?: React.CSSProperties;
};

export function ProgressiveImage({
  placeholderSrc,
  containerClassName,
  containerStyle,
  onLoad,
  fill,
  width,
  height,
  style,
  src,
  ...rest
}: ProgressiveImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  // Use explicit placeholderSrc if provided, otherwise derive from src
  const resolvedPlaceholder = useMemo(
    () => placeholderSrc ?? deriveThumbnailUrl(typeof src === "string" ? src : undefined),
    [placeholderSrc, src],
  );

  const handleLoad = useCallback(
    (e: React.SyntheticEvent<HTMLImageElement>) => {
      setIsLoaded(true);
      if (onLoad) {
        (onLoad as (e: React.SyntheticEvent<HTMLImageElement>) => void)(e);
      }
    },
    [onLoad],
  );

  const objectPosition =
    (style as React.CSSProperties | undefined)?.objectPosition;

  const wrapperClassName = [
    styles.container,
    fill ? styles.fillMode : undefined,
    containerClassName,
  ]
    .filter(Boolean)
    .join(" ");

  const wrapperStyle: React.CSSProperties = {
    ...containerStyle,
  };

  return (
    <div className={wrapperClassName} style={wrapperStyle}>
      {resolvedPlaceholder && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={resolvedPlaceholder}
          alt=""
          className={`${styles.placeholder}${isLoaded ? ` ${styles.placeholderHidden}` : ""}`}
          style={objectPosition ? { objectPosition } : undefined}
          aria-hidden="true"
        />
      )}
      <Image
        {...rest}
        src={src}
        fill={fill}
        width={fill ? undefined : width}
        height={fill ? undefined : height}
        style={style}
        onLoad={handleLoad}
      />
    </div>
  );
}

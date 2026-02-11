"use client";

import type { ReactNode } from "react";
import Image from "next/image";
import { useSpiralSpin } from "@/app/hooks";

interface SpiralDecorationProps {
  className?: string;
  imageClassName?: string;
  width?: number;
  height?: number;
  children?: ReactNode;
}

export function SpiralDecoration({
  className,
  imageClassName,
  width = 710,
  height = 710,
  children,
}: SpiralDecorationProps) {
  const spinRef = useSpiralSpin<HTMLDivElement>();

  return (
    <div className={className}>
      <div ref={spinRef} style={{ width: "100%", height: "100%" }}>
        {children || (
          <Image
            src="/images/spiral_decoration.svg"
            alt=""
            width={width}
            height={height}
            className={imageClassName}
            aria-hidden="true"
          />
        )}
      </div>
    </div>
  );
}

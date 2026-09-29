import { getImageProps } from "next/image";
import type { StylingPage } from "@/app/lib/styling/types";
import styles from "./Styling.module.css";

// Separate mobile artwork avoids squeezing a wide collage into a tall viewport.
// picture lets the browser request only the source that matches its screen.
export function StylingHero({ page }: { page: StylingPage }) {
  const panels = page.hero_panels?.length
    ? page.hero_panels
    : [{ image: page.hero_image, alt: page.hero_image.alternativeText }];
  const mobile = page.hero_mobile_image || page.hero_image;
  return (
    <div className={styles.heroCollage}>
      {panels.slice(0, 3).map(({ image, alt }, index) => {
        const desktopProps = getImageProps({
          src: image.url,
          alt,
          width: image.width,
          height: image.height,
          sizes: "(max-width: 768px) 100vw, 34vw",
          loading: "eager",
        }).props;
        const mobileProps = getImageProps({
          src: mobile.url,
          alt: mobile.alternativeText,
          width: mobile.width,
          height: mobile.height,
          sizes: "100vw",
          loading: "eager",
        }).props;
        return (
          <picture key={image.url} className={styles.heroPanel}>
            <source
              media="(max-width: 768px)"
              srcSet={
                index === 0
                  ? mobileProps.srcSet
                  : "data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs="
              }
              sizes="100vw"
            />
            <img
              {...desktopProps}
              alt={index === 0 ? mobile.alternativeText : alt}
              fetchPriority={index === 0 ? "high" : "auto"}
            />
          </picture>
        );
      })}
    </div>
  );
}

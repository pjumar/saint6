import Image, { getImageProps } from "next/image";
import type { StylingProject } from "@/app/lib/styling/types";
import styles from "./Styling.module.css";

export function StylingProjectHero({ project }: { project: StylingProject }) {
  const cover = project.cover;
  const wideCover = cover.width / cover.height >= 1.55 && cover.width >= 1280;
  const candidates = project.gallery
    .map(({ image }) => image)
    .filter(
      (image) =>
        image.url !== cover.url &&
        image.width >= 700 &&
        Math.max(image.width, image.height) >= 1200,
    );
  // Prefer portrait companions for a wide triptych; gallery order stays editable in Strapi.
  const companions = [
    ...candidates.filter((image) => image.width < image.height),
    ...candidates.filter((image) => image.width >= image.height),
  ];
  const panels = wideCover
    ? [cover]
    : [
        cover,
        ...companions.filter(
          (image, i) =>
            companions.findIndex((other) => other.url === image.url) === i,
        ),
      ].slice(0, 3);
  if (panels.length === 1 && !wideCover) {
    return (
      <div className={styles.projectHeroFallback}>
        <Image
          src={cover.url}
          alt=""
          fill
          sizes="100vw"
          className={styles.projectHeroBackdrop}
          priority
        />
        <Image
          src={cover.url}
          alt={cover.alternativeText}
          width={cover.width}
          height={cover.height}
          sizes="(max-width: 768px) 100vw, 60vw"
          className={styles.projectHeroForeground}
          style={{ maxWidth: cover.width, maxHeight: cover.height }}
          priority
        />
      </div>
    );
  }
  const mobileImage =
    cover.width < cover.height
      ? cover
      : candidates.find(
          (image) => image.height > image.width && image.width >= 900,
        ) || cover;
  const mobile = getImageProps({
    src: mobileImage.url,
    alt: mobileImage.alternativeText,
    width: mobileImage.width,
    height: mobileImage.height,
    sizes: "100vw",
    loading: "eager",
  }).props;
  return (
    <div
      className={styles.projectHeroCollage}
      style={{
        gridTemplateColumns: `repeat(${panels.length}, minmax(0, 1fr))`,
      }}
    >
      {panels.map((image, index) => {
        const props = getImageProps({
          src: image.url,
          alt: image.alternativeText,
          width: image.width,
          height: image.height,
          sizes: `(max-width: 768px) 100vw, ${Math.ceil(100 / panels.length)}vw`,
          loading: "eager",
        }).props;
        return (
          <picture key={image.url} className={styles.projectHeroPanel}>
            <source
              media="(max-width: 768px)"
              srcSet={
                index === 0
                  ? mobile.srcSet
                  : "data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs="
              }
              sizes="100vw"
            />
            <img
              {...props}
              alt={image.alternativeText}
              fetchPriority={index === 0 ? "high" : "auto"}
            />
          </picture>
        );
      })}
    </div>
  );
}

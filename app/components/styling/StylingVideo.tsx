"use client";

import Image from "next/image";
import { useState } from "react";
import type { StylingImage, StylingLocale } from "@/app/lib/styling/types";
import styles from "./Styling.module.css";

export function StylingVideo({
  videoId,
  title,
  poster,
  locale,
}: {
  videoId: string;
  title: string;
  poster: StylingImage;
  locale: StylingLocale;
}) {
  const [playing, setPlaying] = useState(false);
  const vi = locale === "vi";
  return (
    <section
      className={`${styles.container} ${styles.film}`}
      id="project-film"
      aria-labelledby="project-film-title"
    >
      <div className={styles.sectionTop}>
        <h2 id="project-film-title">{vi ? "Xem phim" : "Watch the film"}</h2>
        <a
          href={`https://www.youtube.com/watch?v=${videoId}`}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.textLink}
        >
          {vi ? "Mở trên YouTube" : "Open on YouTube"} ↗
        </a>
      </div>
      <div className={styles.videoFrame}>
        {playing ? (
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&playsinline=1&rel=0`}
            title={`${title} — YouTube`}
            allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
            onLoad={(event) => event.currentTarget.focus()}
          />
        ) : (
          <button
            type="button"
            className={styles.videoPoster}
            onClick={() => setPlaying(true)}
            aria-label={`${vi ? "Phát video" : "Play video"}: ${title}`}
          >
            <Image
              src={poster.url}
              alt=""
              fill
              sizes="(max-width: 1440px) 100vw, 1440px"
            />
            <span className={styles.playVideo}>
              <span aria-hidden="true">▶</span>
              {vi ? "Phát video" : "Play film"}
            </span>
          </button>
        )}
      </div>
      <p className={styles.videoNote}>
        {vi
          ? "Video từ YouTube sẽ được tải khi bạn nhấn phát. Nếu video không phát tại đây, hãy mở trên YouTube."
          : "YouTube loads when you press play. If the video cannot play here, open it on YouTube."}
      </p>
    </section>
  );
}

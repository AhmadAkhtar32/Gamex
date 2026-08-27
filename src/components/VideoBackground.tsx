"use client";

import { useEffect, useRef } from "react";

export function VideoBackground({
  src,
  poster,
  className = "",
  overlayClassName = "",
}: {
  src: string;
  poster?: string;
  className?: string;
  overlayClassName?: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;

    if (!video) {
      return;
    }

    if (
      window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches
    ) {
      video.pause();
      return;
    }

    video.muted = true;

    const playPromise = video.play();

    if (playPromise) {
      playPromise.catch(() => {
        // Autoplay may be blocked by the browser.
      });
    }
  }, []);

  return (
    <div
      className={`absolute inset-0 overflow-hidden ${className}`}
      aria-hidden="true"
    >
      <video
        ref={ref}
        className="h-full w-full object-cover"
        src={src}
        poster={poster}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
      />

      {overlayClassName ? (
        <div
          className={`absolute inset-0 ${overlayClassName}`}
        />
      ) : null}
    </div>
  );
}
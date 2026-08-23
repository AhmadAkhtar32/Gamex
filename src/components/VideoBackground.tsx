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
    const v = ref.current;
    if (!v) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      v.pause();
      return;
    }
    v.muted = true;
    const play = v.play();
    if (play) play.catch(() => {});
  }, []);

  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`} aria-hidden="true">
      <video
        ref={ref}
        className="h-full w-full object-cover"
        src={src}
        poster={poster}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
      />
      {overlayClassName ? <div className={`absolute inset-0 ${overlayClassName}`} /> : null}
    </div>
  );
}

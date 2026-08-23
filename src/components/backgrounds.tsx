"use client";

import { ParticleField } from "./ui";
import { VideoBackground } from "./VideoBackground";

const RED_ABSTRACT_VIDEO =
  "https://videos.pexels.com/video-files/29797609/12802106_3840_2160_30fps.mp4";
const RED_ABSTRACT_POSTER =
  "https://images.pexels.com/videos/29797609/art-artistic-background-black-29797609.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=630&w=1200";

export function GlobalBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-[#08080a]">
      {/* Red / black video backdrop (the "video-type" animation) */}
      <VideoBackground
        src={RED_ABSTRACT_VIDEO}
        poster={RED_ABSTRACT_POSTER}
        className="opacity-45"
        overlayClassName="bg-black/55 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.7)_100%)]"
      />

      {/* Red tint wash to keep the whole page saturated red */}
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,0,0,0.12),transparent_28%,transparent_70%,rgba(255,0,0,0.14))]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,0,0,0.08),transparent_70%)]" />

      {/* Drifting aurora light fields (red-hot) */}
      <div className="animate-aurora absolute -left-[10%] -top-[20%] h-[55vmax] w-[55vmax] rounded-full bg-brand/25 blur-[140px]" />
      <div className="animate-aurora absolute -right-[15%] top-[22%] h-[45vmax] w-[45vmax] rounded-full bg-brand/20 blur-[150px] [animation-delay:-7s]" />
      <div className="animate-aurora absolute bottom-[-22%] left-[15%] h-[45vmax] w-[45vmax] rounded-full bg-brand/15 blur-[140px] [animation-delay:-13s]" />
      <div className="animate-aurora absolute left-[45%] top-[55%] h-[30vmax] w-[30vmax] rounded-full bg-brand/10 blur-[120px] [animation-delay:-4s]" />

      {/* Mouse-reactive particle constellation */}
      <ParticleField className="absolute inset-0" />

      {/* Red cinematic vignette */}
      <div className="red-vignette absolute inset-0" />
      <div className="vignette absolute inset-0" />
    </div>
  );
}

export function GrainOverlay() {
  return (
    <div className="film-grain grain-animated pointer-events-none fixed inset-0 z-[90] opacity-[0.06]" />
  );
}

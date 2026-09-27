"use client";

import { ParticleField } from "./ui";

export function GlobalBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-white">
      {/* MAIN WHITE / SOFT RED BACKGROUND */}

      <div className="absolute inset-0 bg-[linear-gradient(180deg,#ffffff_0%,#fffafa_42%,#fff5f5_72%,#ffffff_100%)]" />

      {/* RED AMBIENT LIGHT */}

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_8%,rgba(230,0,0,0.08),transparent_28%),radial-gradient(circle_at_84%_25%,rgba(255,42,42,0.065),transparent_27%),radial-gradient(circle_at_50%_78%,rgba(230,0,0,0.045),transparent_34%)]" />

      {/* TECH GRID */}

      <div className="bg-grid grid-animated absolute inset-0 opacity-45" />

      {/* RED AURORA FIELDS */}

      <div className="animate-aurora absolute -left-[14%] -top-[24%] h-[48vmax] w-[48vmax] rounded-full bg-brand/[0.055] blur-[145px]" />

      <div className="animate-aurora absolute -right-[16%] top-[15%] h-[42vmax] w-[42vmax] rounded-full bg-brand-soft/[0.045] blur-[150px] [animation-delay:-7s]" />

      <div className="animate-aurora absolute bottom-[-24%] left-[10%] h-[42vmax] w-[42vmax] rounded-full bg-brand/[0.04] blur-[145px] [animation-delay:-13s]" />

      <div className="animate-aurora absolute left-[42%] top-[48%] h-[30vmax] w-[30vmax] rounded-full bg-brand-soft/[0.035] blur-[125px] [animation-delay:-4s]" />

      {/* LIGHT RED BLOBS */}

      <div className="absolute left-[6%] top-[28%] h-72 w-72 rounded-full bg-[#fff1f1]/70 blur-[100px]" />

      <div className="absolute right-[8%] top-[55%] h-80 w-80 rounded-full bg-[#fff3f3]/75 blur-[110px]" />

      {/* RED PARTICLES */}

      <ParticleField className="absolute inset-0 opacity-30" />

      {/* EDGE DEPTH */}

      <div className="red-vignette absolute inset-0 opacity-70" />

      <div className="vignette absolute inset-0 opacity-45" />
    </div>
  );
}

export function GrainOverlay() {
  return (
    <div className="film-grain grain-animated pointer-events-none fixed inset-0 z-[90] opacity-[0.018] mix-blend-multiply" />
  );
}
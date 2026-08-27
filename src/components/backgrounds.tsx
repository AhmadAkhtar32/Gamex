"use client";

import { ParticleField } from "./ui";

export function GlobalBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-white">
      {/* =====================================================
          MAIN WHITE BACKGROUND
          ===================================================== */}

      <div className="absolute inset-0 bg-[linear-gradient(180deg,#ffffff_0%,#f9fbfe_42%,#f5f8fc_72%,#ffffff_100%)]" />

      {/* =====================================================
          SOFT BLUE AMBIENT LIGHT
          ===================================================== */}

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_8%,rgba(23,49,96,0.08),transparent_28%),radial-gradient(circle_at_84%_25%,rgba(49,91,145,0.065),transparent_27%),radial-gradient(circle_at_50%_78%,rgba(23,49,96,0.045),transparent_34%)]" />

      {/* =====================================================
          SUBTLE TECH GRID
          ===================================================== */}

      <div className="bg-grid grid-animated absolute inset-0 opacity-45" />

      {/* =====================================================
          DRIFTING BLUE AURORA FIELDS
          ===================================================== */}

      <div className="animate-aurora absolute -left-[14%] -top-[24%] h-[48vmax] w-[48vmax] rounded-full bg-brand/[0.055] blur-[145px]" />

      <div className="animate-aurora absolute -right-[16%] top-[15%] h-[42vmax] w-[42vmax] rounded-full bg-brand-soft/[0.045] blur-[150px] [animation-delay:-7s]" />

      <div className="animate-aurora absolute bottom-[-24%] left-[10%] h-[42vmax] w-[42vmax] rounded-full bg-brand/[0.04] blur-[145px] [animation-delay:-13s]" />

      <div className="animate-aurora absolute left-[42%] top-[48%] h-[30vmax] w-[30vmax] rounded-full bg-brand-soft/[0.035] blur-[125px] [animation-delay:-4s]" />

      {/* =====================================================
          SOFT DECORATIVE LIGHT BLOBS
          ===================================================== */}

      <div className="absolute left-[6%] top-[28%] h-72 w-72 rounded-full bg-[#edf3f8]/70 blur-[100px]" />

      <div className="absolute right-[8%] top-[55%] h-80 w-80 rounded-full bg-[#eef4fa]/75 blur-[110px]" />

      {/* =====================================================
          MOUSE-REACTIVE PARTICLE CONSTELLATION
          ===================================================== */}

      <ParticleField className="absolute inset-0 opacity-30" />

      {/* =====================================================
          VERY SUBTLE EDGE DEPTH
          ===================================================== */}

      <div className="red-vignette absolute inset-0 opacity-70" />

      <div className="vignette absolute inset-0 opacity-55" />
    </div>
  );
}

export function GrainOverlay() {
  return (
    <div className="film-grain grain-animated pointer-events-none fixed inset-0 z-[90] opacity-[0.018] mix-blend-multiply" />
  );
}
import {
  BadgeCheck,
  Gauge,
  RefreshCcw,
  ShieldCheck,
  Wrench,
  Zap,
} from "lucide-react";
import { features } from "@/lib/data";
import { SectionHeading } from "./ui";
import { BlurReveal } from "./fx";

const ICONS: Record<string, typeof Wrench> = {
  wrench: Wrench,
  shield: ShieldCheck,
  gauge: Gauge,
  badge: BadgeCheck,
  zap: Zap,
  refresh: RefreshCcw,
};

export function Features() {
  return (
    <section
      id="features"
      className="
        relative
        overflow-hidden
        bg-white
        py-24
        md:py-32
      "
    >
      {/* =====================================================
          BACKGROUND EFFECTS
          ===================================================== */}

      <div
        className="
          animate-pulse-glow
          absolute
          -right-40
          top-20
          -z-10
          h-[28rem]
          w-[28rem]
          rounded-full
          bg-brand/[0.055]
          blur-[130px]
        "
      />

      <div
        className="
          absolute
          -left-40
          bottom-10
          -z-10
          h-[24rem]
          w-[24rem]
          rounded-full
          bg-brand-soft/[0.035]
          blur-[130px]
        "
      />

      <div
        className="
          bg-grid
          grid-animated
          absolute
          inset-0
          -z-10
          opacity-25
          [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,black,transparent)]
        "
      />

      {/* =====================================================
          CONTENT
          ===================================================== */}

      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <SectionHeading
          eyebrow="Why Gamex"
          title="Engineered for peak performance"
          accent="peak"
          subtitle="We obsess over every frame, every degree and every detail — so your rig is as serious about winning as you are."
        />

        {/* ===================================================
            FEATURE GRID
            =================================================== */}

        <div
          className="
            mt-14
            grid
            gap-5
            sm:grid-cols-2
            lg:grid-cols-3
          "
        >
          {features.map((feature, index) => {
            const Icon =
              ICONS[feature.icon] ?? Zap;

            return (
              <BlurReveal
                key={feature.title}
                delay={index * 0.07}
                className="h-full"
              >
                <div
                  className="
                    group
                    relative
                    h-full
                    overflow-hidden

                    rounded-2xl

                    border
                    border-brand/12

                    bg-white

                    p-6

                    shadow-[0_18px_48px_-34px_rgba(23,49,96,0.34)]

                    transition-all
                    duration-300

                    hover:-translate-y-1.5
                    hover:border-brand/28
                    hover:shadow-[0_28px_65px_-34px_rgba(23,49,96,0.45)]
                  "
                >
                  {/* Soft hover glow */}
                  <div
                    className="
                      pointer-events-none
                      absolute
                      -right-16
                      -top-16
                      h-40
                      w-40
                      rounded-full
                      bg-brand/[0.06]
                      blur-[60px]

                      opacity-0

                      transition-opacity
                      duration-300

                      group-hover:opacity-100
                    "
                  />

                  {/* =========================================
                      ICON
                      ========================================= */}

                  <div
                    className="
                      relative
                      z-10

                      grid
                      h-12
                      w-12
                      place-items-center

                      rounded-xl

                      border
                      border-brand/18

                      bg-brand/[0.07]

                      text-brand

                      shadow-[0_10px_28px_-20px_rgba(23,49,96,0.4)]

                      transition-all
                      duration-300

                      group-hover:scale-110
                      group-hover:border-brand
                      group-hover:bg-brand
                      group-hover:text-white
                      group-hover:shadow-[0_14px_32px_-16px_rgba(23,49,96,0.6)]
                    "
                  >
                    <Icon className="h-6 w-6" />
                  </div>

                  {/* =========================================
                      TITLE
                      ========================================= */}

                  <h3
                    className="
                      relative
                      z-10

                      mt-5

                      font-display
                      text-lg
                      font-bold
                      text-brand-deep

                      transition-colors
                      duration-300

                      group-hover:text-brand
                    "
                  >
                    {feature.title}
                  </h3>

                  {/* =========================================
                      DESCRIPTION
                      ========================================= */}

                  <p
                    className="
                      relative
                      z-10

                      mt-2

                      text-sm
                      leading-relaxed
                      text-slate-600
                    "
                  >
                    {feature.description}
                  </p>

                  {/* Decorative bottom accent */}
                  <div
                    className="
                      absolute
                      bottom-0
                      left-0
                      h-[2px]
                      w-0

                      bg-gradient-to-r
                      from-brand
                      to-brand-soft

                      transition-all
                      duration-500

                      group-hover:w-full
                    "
                  />
                </div>
              </BlurReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
import {
  BadgeCheck,
  Gauge,
  RefreshCcw,
  ShieldCheck,
  Wrench,
  Zap,
} from "lucide-react";

import {
  SectionHeading,
} from "./ui";

import {
  BlurReveal,
} from "./fx";

/* =========================================================
   TYPES
   ========================================================= */

export type FeaturesSectionContent = {
  eyebrow: string;
  title: string;
  subtitle: string;
  isVisible: boolean;
};

export type PublicFeature = {
  id: number;
  icon: string;
  title: string;
  description: string;
};

/* =========================================================
   ICON MAP
   ========================================================= */

const ICONS: Record<
  string,
  typeof Wrench
> = {
  wrench:
    Wrench,

  shield:
    ShieldCheck,

  gauge:
    Gauge,

  badge:
    BadgeCheck,

  zap:
    Zap,

  refresh:
    RefreshCcw,
};

/* =========================================================
   FEATURES
   ========================================================= */

export function Features({
  settings,
  features,
}: {
  settings: FeaturesSectionContent;
  features: PublicFeature[];
}) {
  /*
   * If Admin hides the complete section,
   * do not render it.
   */
  if (
    !settings.isVisible
  ) {
    return null;
  }

  /*
   * If every card is hidden/deleted,
   * avoid showing an empty section.
   */
  if (
    features.length ===
    0
  ) {
    return null;
  }

  /*
   * SectionHeading supports one accented word.
   *
   * We automatically choose a middle word.
   */
  const titleWords =
    settings.title
      .trim()
      .split(/\s+/);

  const accentWord =
    titleWords.length >
    0
      ? titleWords[
          Math.floor(
            titleWords.length /
              2
          )
        ]
      : undefined;

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
          BACKGROUND RED GLOW — RIGHT
          ===================================================== */}

      <div
        aria-hidden="true"
        className="
          animate-pulse-glow

          pointer-events-none

          absolute

          -right-40
          top-20

          -z-10

          h-[28rem]
          w-[28rem]

          rounded-full

          bg-brand/[0.07]

          blur-[130px]
        "
      />

      {/* =====================================================
          BACKGROUND RED GLOW — LEFT
          ===================================================== */}

      <div
        aria-hidden="true"
        className="
          pointer-events-none

          absolute

          -left-40
          bottom-10

          -z-10

          h-[26rem]
          w-[26rem]

          rounded-full

          bg-brand-soft/[0.045]

          blur-[130px]
        "
      />

      {/* =====================================================
          BACKGROUND GRID
          ===================================================== */}

      <div
        aria-hidden="true"
        className="
          bg-grid
          grid-animated

          pointer-events-none

          absolute
          inset-0

          -z-10

          opacity-25

          [mask-image:radial-gradient(ellipse_65%_65%_at_50%_50%,black,transparent)]
        "
      />

      {/* =====================================================
          TOP RED LINE
          ===================================================== */}

      <div
        aria-hidden="true"
        className="
          pointer-events-none

          absolute

          left-1/2
          top-0

          h-px
          w-[80%]

          -translate-x-1/2

          bg-gradient-to-r

          from-transparent
          via-brand/15
          to-transparent
        "
      />

      {/* =====================================================
          CONTENT
          ===================================================== */}

      <div
        className="
          relative

          mx-auto

          max-w-7xl

          px-5

          md:px-8
        "
      >
        {/* ===================================================
            SECTION HEADING
            =================================================== */}

        <SectionHeading
          eyebrow={
            settings.eyebrow
          }
          title={
            settings.title
          }
          accent={
            accentWord
          }
          subtitle={
            settings.subtitle
          }
        />

        {/* ===================================================
            FEATURE CARDS
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
          {features.map(
            (
              feature,
              index
            ) => {
              const Icon =
                ICONS[
                  feature.icon
                ] ??
                Zap;

              return (
                <BlurReveal
                  key={
                    feature.id
                  }
                  delay={
                    index *
                    0.07
                  }
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
                      border-black/[0.07]

                      bg-white

                      p-6

                      shadow-[0_18px_55px_-38px_rgba(0,0,0,0.28)]

                      transition-all

                      duration-300

                      hover:-translate-y-1.5

                      hover:border-brand/25

                      hover:shadow-[0_26px_60px_-35px_rgba(230,0,0,0.32)]
                    "
                  >
                    {/* =======================================
                        TOP HOVER LINE
                        ======================================= */}

                    <div
                      aria-hidden="true"
                      className="
                        absolute

                        left-0
                        top-0

                        h-[3px]
                        w-0

                        bg-brand

                        transition-all

                        duration-500

                        group-hover:w-full
                      "
                    />

                    {/* =======================================
                        RED BACKGROUND GLOW
                        ======================================= */}

                    <div
                      aria-hidden="true"
                      className="
                        pointer-events-none

                        absolute

                        -right-16
                        -top-16

                        h-40
                        w-40

                        rounded-full

                        bg-brand/[0.055]

                        opacity-0

                        blur-[55px]

                        transition-all

                        duration-500

                        group-hover:opacity-100
                      "
                    />

                    {/* =======================================
                        DECORATIVE CORNER
                        ======================================= */}

                    <div
                      aria-hidden="true"
                      className="
                        pointer-events-none

                        absolute

                        right-4
                        top-4

                        h-7
                        w-7

                        border-r
                        border-t

                        border-brand/10

                        transition-all

                        duration-300

                        group-hover:h-10
                        group-hover:w-10
                        group-hover:border-brand/30
                      "
                    />

                    {/* =======================================
                        ICON
                        ======================================= */}

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
                        border-brand/20

                        bg-brand/[0.07]

                        text-brand

                        shadow-[0_10px_28px_-18px_rgba(230,0,0,0.35)]

                        transition-all

                        duration-300

                        group-hover:scale-110

                        group-hover:border-brand

                        group-hover:bg-brand

                        group-hover:text-white

                        group-hover:shadow-[0_12px_30px_-15px_rgba(230,0,0,0.6)]
                      "
                    >
                      <Icon
                        className="
                          h-6
                          w-6
                        "
                      />
                    </div>

                    {/* =======================================
                        NUMBER
                        ======================================= */}

                    <span
                      aria-hidden="true"
                      className="
                        absolute

                        right-6
                        top-5

                        font-display

                        text-4xl

                        font-black

                        text-black/[0.035]

                        transition-colors

                        duration-300

                        group-hover:text-brand/[0.06]
                      "
                    >
                      {String(
                        index +
                          1
                      ).padStart(
                        2,
                        "0"
                      )}
                    </span>

                    {/* =======================================
                        TITLE
                        ======================================= */}

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
                      {
                        feature.title
                      }
                    </h3>

                    {/* =======================================
                        SMALL RED DIVIDER
                        ======================================= */}

                    <div
                      className="
                        relative
                        z-10

                        mt-3

                        h-[2px]
                        w-8

                        rounded-full

                        bg-brand/30

                        transition-all

                        duration-300

                        group-hover:w-12

                        group-hover:bg-brand
                      "
                    />

                    {/* =======================================
                        DESCRIPTION
                        ======================================= */}

                    <p
                      className="
                        relative
                        z-10

                        mt-4

                        text-sm

                        leading-7

                        text-slate-600
                      "
                    >
                      {
                        feature.description
                      }
                    </p>

                    {/* =======================================
                        BOTTOM DECORATIVE DOTS
                        ======================================= */}

                    <div
                      aria-hidden="true"
                      className="
                        relative
                        z-10

                        mt-6

                        flex

                        items-center

                        gap-1.5
                      "
                    >
                      <span
                        className="
                          h-1.5
                          w-1.5

                          rounded-full

                          bg-brand
                        "
                      />

                      <span
                        className="
                          h-1.5
                          w-1.5

                          rounded-full

                          bg-brand/35
                        "
                      />

                      <span
                        className="
                          h-1.5
                          w-1.5

                          rounded-full

                          bg-black/10
                        "
                      />
                    </div>
                  </div>
                </BlurReveal>
              );
            }
          )}
        </div>
      </div>

      {/* =====================================================
          BOTTOM RED LINE
          ===================================================== */}

      <div
        aria-hidden="true"
        className="
          pointer-events-none

          absolute

          bottom-0
          left-1/2

          h-px
          w-[80%]

          -translate-x-1/2

          bg-gradient-to-r

          from-transparent
          via-brand/15
          to-transparent
        "
      />
    </section>
  );
}
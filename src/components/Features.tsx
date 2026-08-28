import {
  BadgeCheck,
  Gauge,
  RefreshCcw,
  ShieldCheck,
  Wrench,
  Zap,
} from "lucide-react";

import { SectionHeading } from "./ui";
import { BlurReveal } from "./fx";

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
  wrench: Wrench,
  shield: ShieldCheck,
  gauge: Gauge,
  badge: BadgeCheck,
  zap: Zap,
  refresh: RefreshCcw,
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
  if (!settings.isVisible) {
    return null;
  }

  /*
   * If every card is hidden/deleted,
   * avoid showing an empty section.
   */
  if (features.length === 0) {
    return null;
  }

  /*
   * SectionHeading supports one accented word.
   *
   * We automatically choose a middle word.
   *
   * Original title:
   * Engineered for peak performance
   *
   * Result:
   * "peak" remains highlighted.
   */
  const titleWords =
    settings.title
      .trim()
      .split(/\s+/);

  const accentWord =
    titleWords.length > 0
      ? titleWords[
          Math.floor(
            titleWords.length / 2
          )
        ]
      : undefined;

  return (
    <section
      id="features"
      className="
        relative
        overflow-hidden
        bg-white/70
        py-24
        md:py-32
      "
    >
      {/* =====================================================
          BACKGROUND GLOW
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
          bg-brand/10
          blur-[130px]
        "
      />

      {/* =====================================================
          BACKGROUND GRID
          ===================================================== */}

      <div
        className="
          bg-grid
          grid-animated
          absolute
          inset-0
          -z-10
          opacity-30
          [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,black,transparent)]
        "
      />

      {/* =====================================================
          CONTENT
          ===================================================== */}

      <div
        className="
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
                ] ?? Zap;

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
                      h-full
                      rounded-2xl

                      border
                      border-brand/15

                      bg-white

                      p-6

                      shadow-[0_18px_55px_-38px_rgba(23,49,96,0.30)]

                      transition-all
                      duration-300

                      hover:-translate-y-1
                      hover:border-brand/30
                      hover:shadow-[0_16px_40px_-16px_rgba(23,49,96,0.18)]
                    "
                  >
                    {/* =======================================
                        ICON
                        ======================================= */}

                    <div
                      className="
                        grid
                        h-12
                        w-12
                        place-items-center

                        rounded-xl

                        border
                        border-brand/30

                        bg-brand/10

                        text-brand

                        transition-all
                        duration-300

                        group-hover:scale-110
                        group-hover:bg-brand
                        group-hover:text-white

                        group-hover:shadow-[0_0_24px_rgba(23,49,96,0.24)]
                      "
                    >
                      <Icon className="h-6 w-6" />
                    </div>

                    {/* =======================================
                        TITLE
                        ======================================= */}

                    <h3
                      className="
                        mt-5
                        font-display
                        text-lg
                        font-bold
                        text-brand-deep
                      "
                    >
                      {
                        feature.title
                      }
                    </h3>

                    {/* =======================================
                        DESCRIPTION
                        ======================================= */}

                    <p
                      className="
                        mt-2
                        text-sm
                        leading-relaxed
                        text-slate-600
                      "
                    >
                      {
                        feature.description
                      }
                    </p>
                  </div>
                </BlurReveal>
              );
            }
          )}
        </div>
      </div>
    </section>
  );
}
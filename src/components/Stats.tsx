import { CountUp } from "./ui";
import { BlurReveal } from "./fx";

/* =========================================================
   TYPE
   ========================================================= */

export type PublicStat = {
  id: number;
  value: string;
  label: string;
};

/* =========================================================
   PARSE DISPLAY VALUE

   Examples:

   12K+  -> 12 + K+
   3.5K+ -> 3.5 + K+
   48h   -> 48 + h
   24/7  -> 24 + /7
   ========================================================= */

function parseStatValue(value: string) {
  const trimmed =
    value.trim();

  const match =
    trimmed.match(
      /^(-?\d+(?:\.\d+)?)(.*)$/
    );

  /*
   * If the value does not start with
   * a number, we cannot use CountUp.
   */
  if (!match) {
    return {
      isNumeric: false,
      number: 0,
      decimals: 0,
      suffix: "",
      raw: trimmed,
    };
  }

  const numericText =
    match[1];

  const suffix =
    match[2] ?? "";

  const number =
    Number.parseFloat(
      numericText
    );

  const decimalPart =
    numericText.includes(".")
      ? numericText.split(".")[1]
      : "";

  const decimals =
    decimalPart.length;

  return {
    isNumeric:
      Number.isFinite(number),

    number,
    decimals,
    suffix,
    raw: trimmed,
  };
}

/* =========================================================
   STATS
   ========================================================= */

export function Stats({
  stats,
}: {
  stats: PublicStat[];
}) {
  /*
   * If Admin has removed all statistics,
   * do not render an empty Stats section.
   */
  if (stats.length === 0) {
    return null;
  }

  return (
    <section
      className="
        relative
        overflow-hidden
        border-y
        border-brand/10
        bg-[#f7f9fc]/90
      "
    >
      {/* =====================================================
          ANIMATED BLUE ACCENT LINE
          ===================================================== */}

      <div
        className="
          animated-gradient
          absolute
          inset-x-0
          top-0
          h-px
          [background-image:linear-gradient(90deg,transparent,#173160,#6f93c9,#173160,transparent)]
        "
      />

      {/* =====================================================
          SOFT AMBIENT BLUE GLOW
          ===================================================== */}

      <div
        className="
          absolute
          left-1/2
          top-0
          -z-10
          h-40
          w-[30rem]
          -translate-x-1/2
          rounded-full
          bg-brand/[0.07]
          blur-[100px]
        "
      />

      {/* =====================================================
          GRID
          ===================================================== */}

      <div
        className="
          mx-auto
          grid
          max-w-7xl
          grid-cols-2
          lg:grid-cols-4
        "
      >
        {stats.map(
          (stat, index) => {
            const parsed =
              parseStatValue(
                stat.value
              );

            return (
              <div
                key={stat.id}
                className={`
                  group
                  relative
                  flex
                  flex-col
                  items-center
                  gap-2

                  px-4
                  py-10
                  text-center

                  transition-colors
                  duration-300

                  md:py-12

                  ${
                    index > 0
                      ? "border-l border-brand/10"
                      : ""
                  }

                  ${
                    index % 2 === 1
                      ? "border-l-0 lg:border-l"
                      : ""
                  }
                `}
              >
                {/* ===========================================
                    HOVER BACKGROUND
                    =========================================== */}

                <div
                  className="
                    pointer-events-none
                    absolute
                    inset-0
                    bg-brand/[0.035]
                    opacity-0
                    transition-opacity
                    duration-300
                    group-hover:opacity-100
                  "
                />

                {/* ===========================================
                    STAT
                    =========================================== */}

                <BlurReveal
                  delay={
                    index * 0.08
                  }
                >
                  <div
                    className="
                      relative
                      z-10

                      font-display
                      text-4xl
                      font-black
                      text-brand-deep

                      transition-all
                      duration-300

                      group-hover:-translate-y-1
                      group-hover:text-brand

                      md:text-5xl
                    "
                  >
                    {parsed.isNumeric ? (
                      <CountUp
                        value={
                          parsed.number
                        }
                        decimals={
                          parsed.decimals
                        }
                        suffix={
                          parsed.suffix
                        }
                      />
                    ) : (
                      /*
                       * This fallback lets Admin enter
                       * non-numeric values if necessary.
                       */
                      <span>
                        {parsed.raw}
                      </span>
                    )}
                  </div>

                  {/* =========================================
                      LABEL
                      ========================================= */}

                  <p
                    className="
                      relative
                      z-10

                      mt-2

                      text-sm
                      font-semibold
                      uppercase
                      tracking-widest
                      text-slate-500

                      transition-colors
                      duration-300

                      group-hover:text-slate-600
                    "
                  >
                    {stat.label}
                  </p>
                </BlurReveal>
              </div>
            );
          }
        )}
      </div>
    </section>
  );
}
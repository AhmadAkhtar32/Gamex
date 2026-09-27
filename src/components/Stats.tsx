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

        bg-[#fff8f8]/95
      "
    >
      {/* =====================================================
          ANIMATED RED ACCENT LINE
          ===================================================== */}

      <div
        className="
          animated-gradient

          absolute
          inset-x-0
          top-0

          h-[2px]

          [background-image:linear-gradient(90deg,transparent,#e60000,#ff6b66,#e60000,transparent)]
        "
      />

      {/* =====================================================
          CENTRAL RED AMBIENT GLOW
          ===================================================== */}

      <div
        aria-hidden="true"
        className="
          absolute

          left-1/2
          top-0

          -z-10

          h-44
          w-[34rem]

          -translate-x-1/2

          rounded-full

          bg-brand/[0.08]

          blur-[110px]
        "
      />

      {/* =====================================================
          SUBTLE GRID
          ===================================================== */}

      <div
        aria-hidden="true"
        className="
          bg-grid

          pointer-events-none

          absolute
          inset-0

          -z-10

          opacity-20

          [mask-image:radial-gradient(ellipse_75%_90%_at_50%_50%,black,transparent)]
        "
      />

      {/* =====================================================
          RED DECORATIVE GLOW — LEFT
          ===================================================== */}

      <div
        aria-hidden="true"
        className="
          pointer-events-none

          absolute

          -left-36
          top-1/2

          -z-10

          h-64
          w-64

          -translate-y-1/2

          rounded-full

          bg-brand/[0.045]

          blur-[100px]
        "
      />

      {/* =====================================================
          RED DECORATIVE GLOW — RIGHT
          ===================================================== */}

      <div
        aria-hidden="true"
        className="
          pointer-events-none

          absolute

          -right-36
          top-1/2

          -z-10

          h-64
          w-64

          -translate-y-1/2

          rounded-full

          bg-brand-soft/[0.04]

          blur-[100px]
        "
      />

      {/* =====================================================
          GRID
          ===================================================== */}

      <div
        className="
          relative

          mx-auto

          grid

          max-w-7xl

          grid-cols-2

          lg:grid-cols-4
        "
      >
        {stats.map(
          (
            stat,
            index
          ) => {
            const parsed =
              parseStatValue(
                stat.value
              );

            return (
              <div
                key={
                  stat.id
                }
                className={`
                  group

                  relative

                  flex

                  flex-col

                  items-center

                  gap-2

                  overflow-hidden

                  px-4
                  py-10

                  text-center

                  transition-all

                  duration-300

                  md:py-12

                  ${
                    index > 0
                      ? "border-l border-black/[0.06]"
                      : ""
                  }

                  ${
                    index %
                      2 ===
                    1
                      ? "border-l-0 lg:border-l"
                      : ""
                  }
                `}
              >
                {/* ===========================================
                    HOVER BACKGROUND
                    =========================================== */}

                <div
                  aria-hidden="true"
                  className="
                    pointer-events-none

                    absolute
                    inset-0

                    bg-gradient-to-b

                    from-brand/[0.055]
                    via-brand/[0.025]
                    to-transparent

                    opacity-0

                    transition-opacity

                    duration-300

                    group-hover:opacity-100
                  "
                />

                {/* ===========================================
                    HOVER TOP RED LINE
                    =========================================== */}

                <span
                  aria-hidden="true"
                  className="
                    absolute

                    left-1/2
                    top-0

                    h-[3px]
                    w-0

                    -translate-x-1/2

                    rounded-full

                    bg-brand

                    transition-all

                    duration-500

                    group-hover:w-16
                  "
                />

                {/* ===========================================
                    BACKGROUND NUMBER GLOW
                    =========================================== */}

                <div
                  aria-hidden="true"
                  className="
                    absolute

                    left-1/2
                    top-1/2

                    h-20
                    w-20

                    -translate-x-1/2
                    -translate-y-1/2

                    rounded-full

                    bg-brand/[0.05]

                    opacity-0

                    blur-2xl

                    transition-all

                    duration-300

                    group-hover:scale-150
                    group-hover:opacity-100
                  "
                />

                {/* ===========================================
                    STAT
                    =========================================== */}

                <BlurReveal
                  delay={
                    index *
                    0.08
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
                        {
                          parsed.raw
                        }
                      </span>
                    )}
                  </div>

                  {/* =========================================
                      SMALL RED DIVIDER
                      ========================================= */}

                  <div
                    className="
                      relative
                      z-10

                      mx-auto
                      mt-3

                      h-[2px]
                      w-6

                      rounded-full

                      bg-brand/30

                      transition-all

                      duration-300

                      group-hover:w-10

                      group-hover:bg-brand
                    "
                  />

                  {/* =========================================
                      LABEL
                      ========================================= */}

                  <p
                    className="
                      relative
                      z-10

                      mt-3

                      text-xs

                      font-bold

                      uppercase

                      tracking-[0.16em]

                      text-slate-500

                      transition-colors

                      duration-300

                      group-hover:text-brand-deep

                      sm:text-sm
                    "
                  >
                    {
                      stat.label
                    }
                  </p>
                </BlurReveal>
              </div>
            );
          }
        )}
      </div>

      {/* =====================================================
          BOTTOM ACCENT
          ===================================================== */}

      <div
        aria-hidden="true"
        className="
          pointer-events-none

          absolute

          bottom-0
          left-1/2

          h-px
          w-[75%]

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
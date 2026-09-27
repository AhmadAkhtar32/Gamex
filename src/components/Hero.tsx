"use client";

import {
  useEffect,
  useState,
  type MouseEvent,
} from "react";

import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  type Variants,
} from "framer-motion";

import {
  Cpu,
  Gauge,
  MousePointerClick,
  Zap,
} from "lucide-react";

import {
  DEFAULT_HERO_CONTENT,
  type HeroContent,
} from "@/lib/hero-content";

import {
  GlitchText,
  Magnetic,
} from "./ui";

import {
  MouseIndicator,
  ScrambleText,
} from "./fx";

import {
  useReady,
} from "./chrome";

/* =========================================================
   ANIMATION VARIANTS
   ========================================================= */

const container: Variants = {
  hidden: {},
  show: {},
};

const item: Variants = {
  hidden: {
    opacity: 0,
    y: 32,
  },

  show: (
    index: number
  ) => ({
    opacity: 1,
    y: 0,

    transition: {
      duration: 0.75,

      delay:
        0.1 +
        index * 0.08,

      ease: [
        0.22,
        1,
        0.36,
        1,
      ],
    },
  }),
};

/* =========================================================
   HERO
   ========================================================= */

export function Hero({
  content,
}: {
  content: HeroContent;
}) {
  const ready =
    useReady();

  /* =======================================================
     ROTATING WORDS
     ======================================================= */

  const words =
    content.rotatingWords.length >
    0
      ? content.rotatingWords
      : DEFAULT_HERO_CONTENT.rotatingWords;

  const wordCount =
    words.length;

  const [
    wordIndex,
    setWordIndex,
  ] = useState(0);

  useEffect(() => {
    if (
      wordCount <= 1
    ) {
      return;
    }

    const timer =
      window.setInterval(
        () => {
          setWordIndex(
            (
              value
            ) =>
              (value + 1) %
              wordCount
          );
        },
        2300
      );

    return () => {
      window.clearInterval(
        timer
      );
    };
  }, [
    wordCount,
  ]);

  /* =======================================================
     MOUSE PARALLAX
     ======================================================= */

  const mouseX =
    useMotionValue(0);

  const mouseY =
    useMotionValue(0);

  const springX =
    useSpring(
      mouseX,
      {
        stiffness: 60,
        damping: 18,
      }
    );

  const springY =
    useSpring(
      mouseY,
      {
        stiffness: 60,
        damping: 18,
      }
    );

  const rotateY =
    useTransform(
      springX,
      [
        -0.5,
        0.5,
      ],
      [
        7,
        -7,
      ]
    );

  const rotateX =
    useTransform(
      springY,
      [
        -0.5,
        0.5,
      ],
      [
        -7,
        7,
      ]
    );

  const chip1x =
    useTransform(
      springX,
      [
        -0.5,
        0.5,
      ],
      [
        -20,
        20,
      ]
    );

  const chip1y =
    useTransform(
      springY,
      [
        -0.5,
        0.5,
      ],
      [
        -14,
        14,
      ]
    );

  const chip2x =
    useTransform(
      springX,
      [
        -0.5,
        0.5,
      ],
      [
        16,
        -16,
      ]
    );

  const chip3x =
    useTransform(
      springX,
      [
        -0.5,
        0.5,
      ],
      [
        -12,
        12,
      ]
    );

  function onMouseMove(
    event: MouseEvent<HTMLElement>
  ) {
    const rect =
      event.currentTarget.getBoundingClientRect();

    mouseX.set(
      (
        event.clientX -
        rect.left
      ) /
        rect.width -
        0.5
    );

    mouseY.set(
      (
        event.clientY -
        rect.top
      ) /
        rect.height -
        0.5
    );
  }

  function onMouseLeave() {
    mouseX.set(0);
    mouseY.set(0);
  }

  /* =======================================================
     VISIBILITY
     ======================================================= */

  if (
    !content.isVisible
  ) {
    return null;
  }

  /* =======================================================
     HERO
     ======================================================= */

  return (
    <section
      id="home"
      onMouseMove={
        onMouseMove
      }
      onMouseLeave={
        onMouseLeave
      }
      className="
        relative

        overflow-hidden

        bg-white

        pb-16
        pt-28

        md:pb-24
        md:pt-40
      "
    >
      {/* ===================================================
          BACKGROUND — BASE
          =================================================== */}

      <div
        aria-hidden="true"
        className="
          pointer-events-none

          absolute
          inset-0
          -z-30

          bg-white
        "
      />

      {/* ===================================================
          BACKGROUND — GRID
          =================================================== */}

      <div
        aria-hidden="true"
        className="
          bg-grid
          grid-animated

          pointer-events-none

          absolute
          inset-0
          -z-20

          opacity-60

          [mask-image:radial-gradient(ellipse_78%_68%_at_50%_15%,black,transparent)]
        "
      />

      {/* ===================================================
          BACKGROUND — DIAGONAL RED LINES
          =================================================== */}

      <div
        aria-hidden="true"
        className="
          stripes-red

          pointer-events-none

          absolute
          inset-0
          -z-20

          opacity-25

          [mask-image:radial-gradient(ellipse_72%_60%_at_50%_40%,black,transparent)]
        "
      />

      {/* ===================================================
          BACKGROUND — LARGE RADAR
          =================================================== */}

      <div
        aria-hidden="true"
        className="
          radar-sweep

          pointer-events-none

          absolute

          left-1/2
          top-1/2

          -z-20

          h-[70rem]
          w-[70rem]

          -translate-x-1/2
          -translate-y-1/2

          rounded-full

          opacity-20
        "
      />

      {/* ===================================================
          BACKGROUND — SCAN
          =================================================== */}

      <div
        aria-hidden="true"
        className="
          red-scan

          pointer-events-none

          absolute

          inset-x-0
          top-0

          -z-10

          h-44

          bg-gradient-to-b

          from-transparent
          via-brand/[0.055]
          to-transparent
        "
      />

      {/* ===================================================
          BACKGROUND — LEFT RED GLOW
          =================================================== */}

      <div
        aria-hidden="true"
        className="
          animate-orb

          pointer-events-none

          absolute

          -left-48
          -top-44

          -z-20

          h-[36rem]
          w-[36rem]

          rounded-full

          bg-brand/[0.09]

          blur-[135px]
        "
      />

      {/* ===================================================
          BACKGROUND — RIGHT RED GLOW
          =================================================== */}

      <div
        aria-hidden="true"
        className="
          animate-pulse-glow

          pointer-events-none

          absolute

          -right-48
          top-20

          -z-20

          h-[34rem]
          w-[34rem]

          rounded-full

          bg-brand-soft/[0.08]

          blur-[135px]
        "
      />

      {/* ===================================================
          BLACK / RED DECORATIVE CORNER
          =================================================== */}

      <div
        aria-hidden="true"
        className="
          pointer-events-none

          absolute

          -right-24
          top-20

          -z-10

          hidden

          h-72
          w-72

          rotate-45

          border-l
          border-brand/10

          lg:block
        "
      />

      {/* ===================================================
          MAIN CONTENT
          =================================================== */}

      <div
        className="
          relative

          mx-auto

          grid

          max-w-7xl

          items-center

          gap-14

          px-5

          md:px-8

          lg:grid-cols-2
          lg:gap-12

          xl:gap-20
        "
      >
        {/* =================================================
            LEFT SIDE
            ================================================= */}

        <motion.div
          initial="hidden"
          animate={
            ready
              ? "show"
              : "hidden"
          }
          variants={
            container
          }
          className="
            relative
            z-10
          "
        >
          {/* ===============================================
              EYEBROW
              =============================================== */}

          <motion.div
            variants={
              item
            }
            custom={0}
          >
            <span
              className="
                inline-flex

                items-center

                gap-2

                rounded-full

                border
                border-brand/20

                bg-brand/[0.06]

                px-4
                py-2

                text-[10px]

                font-extrabold

                uppercase

                tracking-[0.24em]

                text-brand

                shadow-[0_10px_30px_-20px_rgba(230,0,0,0.45)]

                backdrop-blur-sm

                sm:text-xs
              "
            >
              <Zap
                className="
                  h-3.5
                  w-3.5
                  fill-brand
                "
              />

              <ScrambleText
                text={
                  content.eyebrow
                }
                duration={
                  1200
                }
              />
            </span>
          </motion.div>

          {/* ===============================================
              MAIN HEADING
              =============================================== */}

          <h1
            className="
              mt-6

              max-w-3xl

              font-display

              text-4xl

              font-black

              uppercase

              leading-[1.02]

              tracking-tight

              text-brand-deep

              sm:text-6xl

              lg:text-[4.25rem]

              xl:text-7xl
            "
          >
            {/* LINE 1 */}

            <span className="block">
              <motion.span
                variants={
                  item
                }
                custom={1}
                className="
                  inline-block
                "
              >
                {
                  content.headingLine1
                }
              </motion.span>
            </span>

            {/* LINE 2 */}

            <span className="block">
              <motion.span
                variants={
                  item
                }
                custom={2}
                className="
                  inline-block
                "
              >
                {
                  content.headingLine2
                }
                &nbsp;
              </motion.span>

              {/* =============================================
                  ROTATING WORD
                  ============================================= */}

              <motion.span
                variants={
                  item
                }
                custom={3}
                className="
                  inline-block

                  align-bottom

                  text-brand
                "
              >
                <span
                  className="
                    relative

                    inline-block

                    overflow-hidden

                    align-bottom
                  "
                >
                  <AnimatePresence
                    mode="wait"
                  >
                    <motion.span
                      key={
                        words[
                          wordIndex
                        ]
                      }
                      initial={{
                        y:
                          "105%",

                        opacity:
                          0,
                      }}
                      animate={{
                        y:
                          0,

                        opacity:
                          1,
                      }}
                      exit={{
                        y:
                          "-105%",

                        opacity:
                          0,
                      }}
                      transition={{
                        duration:
                          0.45,

                        ease:
                          "easeOut",
                      }}
                      className="
                        inline-block
                      "
                    >
                      <GlitchText
                        text={
                          words[
                            wordIndex
                          ]
                        }
                      />
                    </motion.span>
                  </AnimatePresence>
                </span>
              </motion.span>
            </span>
          </h1>

          {/* ===============================================
              RED ACCENT LINE
              =============================================== */}

          <motion.div
            variants={
              item
            }
            custom={3.5}
            className="
              mt-5

              flex
              items-center
              gap-3
            "
          >
            <span
              className="
                h-[3px]
                w-16

                rounded-full

                bg-brand

                shadow-[0_0_14px_rgba(230,0,0,0.35)]
              "
            />

            <span
              className="
                h-[3px]
                w-5

                rounded-full

                bg-black/75
              "
            />

            <span
              className="
                h-[3px]
                w-2

                rounded-full

                bg-brand/40
              "
            />
          </motion.div>

          {/* ===============================================
              DESCRIPTION
              =============================================== */}

          <motion.p
            variants={
              item
            }
            custom={4}
            className="
              mt-6

              max-w-xl

              text-base

              font-medium

              leading-8

              text-slate-600

              md:text-lg
            "
          >
            {
              content.description
            }
          </motion.p>

          {/* ===============================================
              BUTTONS
              =============================================== */}

          <motion.div
            variants={
              item
            }
            custom={5}
            className="
              mt-9

              flex

              flex-wrap

              items-center

              gap-3

              sm:gap-4
            "
          >
            {/* =============================================
                PRIMARY BUTTON
                ============================================= */}

            <Magnetic>
              <a
                href={
                  content.primaryButtonLink
                }
                className="
                  cta-pulse

                  group

                  relative

                  inline-flex

                  items-center

                  gap-2

                  overflow-hidden

                  rounded-xl

                  bg-brand

                  px-7
                  py-3.5

                  font-display

                  text-xs

                  font-bold

                  uppercase

                  tracking-widest

                  text-white

                  shadow-[0_16px_38px_-17px_rgba(230,0,0,0.75)]

                  transition-all

                  duration-300

                  hover:-translate-y-0.5

                  hover:bg-[#c90000]

                  hover:shadow-[0_20px_42px_-17px_rgba(230,0,0,0.85)]

                  sm:text-sm
                "
              >
                {/* BUTTON SHINE */}

                <span
                  aria-hidden="true"
                  className="
                    absolute

                    -left-12
                    top-0

                    h-full
                    w-9

                    -skew-x-12

                    bg-white/25

                    transition-all

                    duration-700

                    group-hover:left-[120%]
                  "
                />

                <span
                  className="
                    relative
                  "
                >
                  {
                    content.primaryButtonText
                  }
                </span>

                <span
                  className="
                    relative

                    transition-transform

                    duration-300

                    group-hover:translate-x-1
                  "
                >
                  →
                </span>
              </a>
            </Magnetic>

            {/* =============================================
                SECONDARY BUTTON
                ============================================= */}

            <Magnetic
              strength={
                0.25
              }
            >
              <a
                href={
                  content.secondaryButtonLink
                }
                className="
                  group

                  inline-flex

                  items-center

                  gap-2

                  rounded-xl

                  border
                  border-black/15

                  bg-white

                  px-7
                  py-3.5

                  font-display

                  text-xs

                  font-bold

                  uppercase

                  tracking-widest

                  text-brand-deep

                  shadow-[0_12px_30px_-22px_rgba(0,0,0,0.35)]

                  transition-all

                  duration-300

                  hover:-translate-y-0.5

                  hover:border-brand/40

                  hover:bg-brand/[0.04]

                  hover:text-brand

                  hover:shadow-[0_14px_34px_-22px_rgba(230,0,0,0.35)]

                  sm:text-sm
                "
              >
                {
                  content.secondaryButtonText
                }

                <span
                  className="
                    h-1.5
                    w-1.5

                    rounded-full

                    bg-brand

                    transition-transform

                    group-hover:scale-150
                  "
                />
              </a>
            </Magnetic>
          </motion.div>

          {/* ===============================================
              TRUST POINTS
              =============================================== */}

          <motion.div
            variants={
              item
            }
            custom={6}
            className="
              mt-10

              flex

              flex-wrap

              items-center

              gap-x-7
              gap-y-4

              border-t

              border-black/[0.06]

              pt-6

              text-sm

              font-semibold

              text-slate-500
            "
          >
            {/* TRUST 1 */}

            <span
              className="
                group

                inline-flex

                items-center

                gap-2
              "
            >
              <span
                className="
                  grid

                  h-8
                  w-8

                  place-items-center

                  rounded-lg

                  bg-brand/[0.07]

                  text-brand

                  transition-all

                  group-hover:bg-brand

                  group-hover:text-white
                "
              >
                <Gauge
                  className="
                    h-4
                    w-4
                  "
                />
              </span>

              {
                content.trustPoint1
              }
            </span>

            {/* TRUST 2 */}

            <span
              className="
                group

                inline-flex

                items-center

                gap-2
              "
            >
              <span
                className="
                  grid

                  h-8
                  w-8

                  place-items-center

                  rounded-lg

                  bg-brand/[0.07]

                  text-brand

                  transition-all

                  group-hover:bg-brand

                  group-hover:text-white
                "
              >
                <Cpu
                  className="
                    h-4
                    w-4
                  "
                />
              </span>

              {
                content.trustPoint2
              }
            </span>

            {/* TRUST 3 */}

            <span
              className="
                group

                inline-flex

                items-center

                gap-2
              "
            >
              <span
                className="
                  grid

                  h-8
                  w-8

                  place-items-center

                  rounded-lg

                  bg-brand/[0.07]

                  text-brand

                  transition-all

                  group-hover:bg-brand

                  group-hover:text-white
                "
              >
                <MousePointerClick
                  className="
                    h-4
                    w-4
                  "
                />
              </span>

              {
                content.trustPoint3
              }
            </span>
          </motion.div>
        </motion.div>

        {/* =================================================
            RIGHT SIDE
            ================================================= */}

        <motion.div
          initial={{
            opacity:
              0,

            scale:
              0.94,

            y:
              20,
          }}
          animate={
            ready
              ? {
                  opacity:
                    1,

                  scale:
                    1,

                  y:
                    0,
                }
              : {
                  opacity:
                    0,

                  scale:
                    0.94,

                  y:
                    20,
                }
          }
          transition={{
            duration:
              0.9,

            delay:
              0.35,

            ease: [
              0.22,
              1,
              0.36,
              1,
            ],
          }}
          className="
            relative

            mx-auto

            w-full

            max-w-xl
          "
        >
          {/* ===============================================
              OUTER DASHED FRAME
              =============================================== */}

          <div
            aria-hidden="true"
            className="
              animate-spin-slow

              absolute

              -inset-8

              -z-20

              rounded-[3rem]

              border

              border-dashed

              border-brand/15

              [animation-duration:50s]
            "
          />

          {/* ===============================================
              BLACK CORNER ACCENT
              =============================================== */}

          <div
            aria-hidden="true"
            className="
              absolute

              -right-4
              -top-4

              -z-10

              h-24
              w-24

              rotate-12

              rounded-2xl

              border-r-2
              border-t-2

              border-black/10
            "
          />

          {/* ===============================================
              PARALLAX IMAGE
              =============================================== */}

          <motion.div
            style={{
              rotateX,
              rotateY,

              transformPerspective:
                1100,
            }}
            className="
              relative
            "
          >
            {/* =============================================
                RED GLOW
                ============================================= */}

            <div
              aria-hidden="true"
              className="
                animate-pulse-glow

                absolute

                -inset-7

                -z-20

                rounded-[2.4rem]

                bg-brand/[0.11]

                blur-3xl
              "
            />

            {/* =============================================
                RED / BLACK ROTATING BORDER
                ============================================= */}

            <div
              aria-hidden="true"
              className="
                animate-spin-slow

                absolute

                -inset-[2px]

                rounded-[1.9rem]

                opacity-80

                [animation-duration:14s]

                [background:conic-gradient(from_0deg,transparent_0%,#e60000_18%,transparent_36%,#181818_50%,transparent_65%,#ff2a2a_82%,transparent_100%)]
              "
            />

            {/* =============================================
                MAIN IMAGE CARD
                ============================================= */}

            <div
              className="
                glow

                relative

                overflow-hidden

                rounded-[1.75rem]

                border
                border-black/[0.08]

                bg-white

                shadow-[0_32px_80px_-38px_rgba(230,0,0,0.28)]
              "
            >
              <div
                className="
                  relative

                  aspect-[4/3]

                  overflow-hidden

                  bg-[#fff7f7]
                "
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}

                <img
                  src={
                    content.image
                  }
                  alt={
                    content.imageAlt
                  }
                  className="
                    animate-kenburns

                    h-full
                    w-full

                    object-cover
                  "
                />

                {/* ===========================================
                    IMAGE DARK OVERLAY

                    Kept because white information text
                    sits on the image.
                    =========================================== */}

                <div
                  className="
                    absolute
                    inset-0

                    bg-gradient-to-t

                    from-black/80
                    via-black/10
                    to-black/5
                  "
                />

                {/* RED IMAGE TINT */}

                <div
                  aria-hidden="true"
                  className="
                    absolute
                    inset-0

                    bg-gradient-to-tr

                    from-brand/10
                    via-transparent
                    to-brand/5

                    mix-blend-screen
                  "
                />

                {/* SCAN LINE */}

                <div className="scanline" />

                {/* ===========================================
                    IMAGE TOP RED DETAIL
                    =========================================== */}

                <div
                  aria-hidden="true"
                  className="
                    absolute

                    left-0
                    top-0

                    h-[3px]

                    w-1/2

                    bg-gradient-to-r

                    from-brand

                    to-transparent
                  "
                />

                {/* ===========================================
                    IMAGE INFORMATION
                    =========================================== */}

                <div
                  className="
                    absolute

                    bottom-4
                    left-4
                    right-4

                    flex

                    items-end

                    justify-between

                    gap-4
                  "
                >
                  <div
                    className="
                      min-w-0
                    "
                  >
                    {/* TITLE */}

                    <p
                      className="
                        font-display

                        text-sm

                        font-bold

                        uppercase

                        tracking-wider

                        text-white

                        drop-shadow
                      "
                    >
                      {
                        content.imageTitle
                      }
                    </p>

                    {/* SUBTITLE */}

                    <p
                      className="
                        mt-1

                        text-[10px]

                        font-semibold

                        uppercase

                        tracking-widest

                        text-white/65

                        sm:text-xs
                      "
                    >
                      {
                        content.imageSubtitle
                      }
                    </p>
                  </div>

                  {/* BADGE */}

                  <span
                    className="
                      shrink-0

                      rounded-lg

                      border
                      border-white/25

                      bg-white/95

                      px-3
                      py-1.5

                      font-display

                      text-[10px]

                      font-bold

                      uppercase

                      tracking-wider

                      text-brand

                      shadow-[0_8px_25px_-14px_rgba(0,0,0,0.55)]

                      backdrop-blur-md

                      sm:text-xs
                    "
                  >
                    {
                      content.imageBadge
                    }
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* ===============================================
              CHIP 1
              =============================================== */}

          <motion.div
            style={{
              x:
                chip1x,

              y:
                chip1y,
            }}
            className="
              absolute

              -left-2
              top-7

              z-20

              sm:-left-8
            "
          >
            <div
              className="
                animate-float

                relative

                overflow-hidden

                rounded-xl

                border
                border-brand/15

                bg-white/95

                px-4
                py-3

                shadow-[0_16px_38px_-22px_rgba(230,0,0,0.35)]

                backdrop-blur-xl
              "
            >
              <span
                aria-hidden="true"
                className="
                  absolute

                  left-0
                  top-0

                  h-full
                  w-[3px]

                  bg-brand
                "
              />

              <p
                className="
                  font-display

                  text-base

                  font-extrabold

                  text-brand-deep

                  sm:text-lg
                "
              >
                {
                  content.chip1Title
                }
              </p>

              <p
                className="
                  mt-0.5

                  text-[9px]

                  font-bold

                  uppercase

                  tracking-widest

                  text-slate-500

                  sm:text-xs
                "
              >
                {
                  content.chip1Subtitle
                }
              </p>
            </div>
          </motion.div>

          {/* ===============================================
              CHIP 2
              =============================================== */}

          <motion.div
            style={{
              x:
                chip2x,
            }}
            className="
              absolute

              -right-2
              top-1/2

              z-20

              sm:-right-8
            "
          >
            <div
              className="
                animate-float-slow

                relative

                overflow-hidden

                rounded-xl

                border
                border-brand/15

                bg-white/95

                px-4
                py-3

                shadow-[0_16px_38px_-22px_rgba(230,0,0,0.35)]

                backdrop-blur-xl
              "
            >
              <span
                aria-hidden="true"
                className="
                  absolute

                  right-0
                  top-0

                  h-full
                  w-[3px]

                  bg-brand
                "
              />

              <p
                className="
                  font-display

                  text-base

                  font-extrabold

                  text-brand-deep

                  sm:text-lg
                "
              >
                {
                  content.chip2Title
                }
              </p>

              <p
                className="
                  mt-0.5

                  text-[9px]

                  font-bold

                  uppercase

                  tracking-widest

                  text-slate-500

                  sm:text-xs
                "
              >
                {
                  content.chip2Subtitle
                }
              </p>
            </div>
          </motion.div>

          {/* ===============================================
              CHIP 3
              =============================================== */}

          <motion.div
            style={{
              x:
                chip3x,
            }}
            className="
              absolute

              -bottom-5
              left-7

              z-20
            "
          >
            <div
              className="
                animate-float

                relative

                overflow-hidden

                rounded-xl

                border
                border-brand/20

                bg-white/95

                px-4
                py-3

                shadow-[0_18px_42px_-22px_rgba(230,0,0,0.42)]

                backdrop-blur-xl
              "
            >
              <span
                aria-hidden="true"
                className="
                  absolute

                  inset-x-0
                  bottom-0

                  h-[3px]

                  bg-gradient-to-r

                  from-black
                  via-brand
                  to-brand-soft
                "
              />

              <p
                className="
                  font-display

                  text-base

                  font-extrabold

                  text-brand

                  sm:text-lg
                "
              >
                {
                  content.chip3Title
                }
              </p>

              <p
                className="
                  mt-0.5

                  text-[9px]

                  font-bold

                  uppercase

                  tracking-widest

                  text-slate-500

                  sm:text-xs
                "
              >
                {
                  content.chip3Subtitle
                }
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* ===================================================
          SCROLL INDICATOR
          =================================================== */}

      <motion.div
        initial={{
          opacity:
            0,
        }}
        animate={{
          opacity:
            ready
              ? 1
              : 0,
        }}
        transition={{
          delay:
            1.4,

          duration:
            0.5,
        }}
        className="
          mt-14

          flex

          justify-center
        "
      >
        <MouseIndicator />
      </motion.div>

      {/* ===================================================
          BOTTOM RED FADE
          =================================================== */}

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
          via-brand/20
          to-transparent
        "
      />
    </section>
  );
}
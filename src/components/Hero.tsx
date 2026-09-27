"use client";

import {
  useEffect,
  useState,
  type ReactNode,
} from "react";

import {
  AnimatePresence,
  motion,
  type Variants,
} from "framer-motion";

import {
  ChevronLeft,
  ChevronRight,
  Cpu,
  Gauge,
  MousePointerClick,
  Zap,
} from "lucide-react";

import {
  DEFAULT_HERO_CONTENT,
  type HeroContent,
  type HeroMediaItem,
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
   ANIMATION
   ========================================================= */

const container:
  Variants = {
  hidden: {},
  show: {},
};

const item:
  Variants = {
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
      duration:
        0.75,

      delay:
        0.1 +
        index *
          0.08,

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
  media,
}: {
  content: HeroContent;

  media: HeroMediaItem[];
}) {
  const ready =
    useReady();

  /* =======================================================
     ROTATING WORDS
     ======================================================= */

  const words =
    content
      .rotatingWords
      .length >
    0
      ? content.rotatingWords
      : DEFAULT_HERO_CONTENT.rotatingWords;

  const [
    wordIndex,
    setWordIndex,
  ] =
    useState(
      0
    );

  useEffect(() => {
    if (
      words.length <=
      1
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
              (value +
                1) %
              words.length
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
    words.length,
  ]);

  /* =======================================================
     SLIDES
     ======================================================= */

  const slides:
    HeroMediaItem[] =
    media.length >
    0
      ? media
      : content.image
        ? [
            {
              id:
                -1,

              mediaType:
                "image",

              url:
                content.image,

              alt:
                content.imageAlt ||
                "Gamex gaming hardware",

              sortOrder:
                0,
            },
          ]
        : [];

  const [
    slideIndex,
    setSlideIndex,
  ] =
    useState(
      0
    );

  const currentSlide =
    slides[
      slideIndex
    ] ??
    slides[0];

  /* =======================================================
     VALID INDEX
     ======================================================= */

  useEffect(() => {
    if (
      slideIndex >=
      slides.length
    ) {
      setSlideIndex(
        0
      );
    }
  }, [
    slideIndex,
    slides.length,
  ]);

  /* =======================================================
     IMAGE AUTOPLAY

     Images = 5 seconds.

     Videos advance when playback ends.
     ======================================================= */

  useEffect(() => {
    if (
      slides.length <=
        1 ||
      !currentSlide ||
      currentSlide.mediaType ===
        "video"
    ) {
      return;
    }

    const timer =
      window.setTimeout(
        () => {
          setSlideIndex(
            (
              value
            ) =>
              (value +
                1) %
              slides.length
          );
        },
        5000
      );

    return () => {
      window.clearTimeout(
        timer
      );
    };
  }, [
    currentSlide,
    slides.length,
  ]);

  /* =======================================================
     CONTROLS
     ======================================================= */

  function nextSlide() {
    if (
      slides.length ===
      0
    ) {
      return;
    }

    setSlideIndex(
      (
        value
      ) =>
        (value +
          1) %
        slides.length
    );
  }

  function previousSlide() {
    if (
      slides.length ===
      0
    ) {
      return;
    }

    setSlideIndex(
      (
        value
      ) =>
        (value -
          1 +
          slides.length) %
        slides.length
    );
  }

  /* =======================================================
     VISIBILITY
     ======================================================= */

  if (
    !content.isVisible
  ) {
    return null;
  }

  return (
    <section
      id="home"
      className="
        relative

        overflow-hidden

        pb-10
pt-24
md:pb-14
md:pt-28
      "
    >
      {/* =====================================================
          BACKGROUND
          ===================================================== */}

      <div
        className="
          bg-grid
          grid-animated

          absolute
          inset-0

          -z-10

          opacity-55

          [mask-image:radial-gradient(ellipse_75%_65%_at_50%_0%,black,transparent)]
        "
      />

      <div
        className="
          stripes-red

          absolute
          inset-0

          -z-10

          opacity-35

          [mask-image:radial-gradient(ellipse_70%_60%_at_50%_40%,black,transparent)]
        "
      />

      <div
        className="
          radar-sweep

          absolute

          left-1/2
          top-1/2

          -z-10

          h-[70rem]
          w-[70rem]

          -translate-x-1/2
          -translate-y-1/2

          rounded-full

          opacity-30
        "
      />

      <div
        className="
          red-scan

          absolute

          inset-x-0
          top-0

          -z-10

          h-44

          bg-gradient-to-b

          from-transparent
          via-brand/[0.06]
          to-transparent
        "
      />

      <div
        className="
          animate-orb

          absolute

          -left-40
          -top-40

          -z-10

          h-[34rem]
          w-[34rem]

          rounded-full

          bg-brand/[0.09]

          blur-[130px]
        "
      />

      <div
        className="
          animate-pulse-glow

          absolute

          -right-40
          top-24

          -z-10

          h-[30rem]
          w-[30rem]

          rounded-full

          bg-brand-soft/[0.07]

          blur-[120px]
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

          items-center

          gap-14

          px-5

          md:px-8

          lg:grid-cols-2
        "
      >
        {/* ===================================================
            LEFT
            =================================================== */}

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
        >
          {/* EYEBROW */}

          <motion.span
            variants={
              item
            }
            custom={
              0
            }
            className="inline-block"
          >
            <span
              className="
                inline-flex

                items-center

                gap-2

                rounded-full

                border
                border-brand/20

                bg-brand/[0.07]

                px-4
                py-1.5

                text-xs

                font-bold

                uppercase

                tracking-[0.25em]

                text-brand

                shadow-[0_8px_28px_-20px_rgba(230,0,0,0.35)]
              "
            >
              <Zap className="h-3.5 w-3.5" />

              <ScrambleText
                text={
                  content.eyebrow
                }
                duration={
                  1200
                }
              />
            </span>
          </motion.span>

          {/* HEADING */}

          <h1
            className="
              mt-6

              font-display

              text-4xl

              font-black

              uppercase

              leading-[1.02]

              tracking-tight

              text-brand-deep

              sm:text-5xl

              md:text-6xl

              xl:text-7xl
            "
          >
            <motion.span
              variants={
                item
              }
              custom={
                1
              }
              className="block"
            >
              <GlitchText
                text={
                  content.headingLine1
                }
              />
            </motion.span>

            <motion.span
              variants={
                item
              }
              custom={
                2
              }
              className="
                mt-1

                flex

                flex-wrap

                items-baseline

                gap-x-3
              "
            >
              <span>
                {
                  content.headingLine2
                }
              </span>

              <span
                className="
                  relative

                  inline-flex

                  min-w-[4.6em]

                  text-brand
                "
              >
                <AnimatePresence mode="wait">
                  <motion.span
                    key={`${wordIndex}-${words[wordIndex]}`}
                    initial={{
                      opacity:
                        0,

                      y:
                        18,

                      filter:
                        "blur(7px)",
                    }}
                    animate={{
                      opacity:
                        1,

                      y:
                        0,

                      filter:
                        "blur(0px)",
                    }}
                    exit={{
                      opacity:
                        0,

                      y:
                        -18,

                      filter:
                        "blur(7px)",
                    }}
                    transition={{
                      duration:
                        0.35,

                      ease: [
                        0.22,
                        1,
                        0.36,
                        1,
                      ],
                    }}
                  >
                    {
                      words[
                        wordIndex
                      ]
                    }
                  </motion.span>
                </AnimatePresence>
              </span>
            </motion.span>
          </h1>

          {/* DIVIDER */}

          <motion.div
            variants={
              item
            }
            custom={
              3
            }
            className="
              mt-6

              flex

              items-center

              gap-3
            "
          >
            <span className="h-[3px] w-16 rounded-full bg-brand" />

            <span className="h-[3px] w-5 rounded-full bg-black/70" />

            <span className="h-[3px] w-2 rounded-full bg-brand/40" />
          </motion.div>

          {/* DESCRIPTION */}

          <motion.p
            variants={
              item
            }
            custom={
              4
            }
            className="
              mt-6

              max-w-2xl

              text-base

              font-medium

              leading-8

              text-slate-600

              sm:text-lg
            "
          >
            {
              content.description
            }
          </motion.p>

          {/* BUTTONS */}

          <motion.div
            variants={
              item
            }
            custom={
              5
            }
            className="
              mt-8

              flex

              flex-wrap

              gap-3
            "
          >
            <Magnetic>
              <a
                href={
                  content.primaryButtonLink
                }
                className="
                  group

                  relative

                  inline-flex

                  items-center
                  justify-center

                  gap-2

                  overflow-hidden

                  rounded-xl

                  bg-brand

                  px-7
                  py-4

                  font-display

                  text-xs

                  font-bold

                  uppercase

                  tracking-[0.12em]

                  text-white

                  shadow-[0_16px_38px_-18px_rgba(230,0,0,0.72)]

                  transition-all

                  duration-300

                  hover:-translate-y-0.5

                  hover:bg-[#c90000]
                "
              >
                <span
                  className="
                    absolute

                    -left-12
                    top-0

                    h-full
                    w-10

                    -skew-x-12

                    bg-white/20

                    transition-all

                    duration-700

                    group-hover:left-[120%]
                  "
                />

                <span className="relative">
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

            <Magnetic>
              <a
                href={
                  content.secondaryButtonLink
                }
                className="
                  group

                  inline-flex

                  items-center
                  justify-center

                  gap-2

                  rounded-xl

                  border
                  border-black/15

                  bg-white

                  px-7
                  py-4

                  font-display

                  text-xs

                  font-bold

                  uppercase

                  tracking-[0.12em]

                  text-brand-deep

                  transition-all

                  duration-300

                  hover:-translate-y-0.5

                  hover:border-brand/35

                  hover:bg-[#fff8f8]

                  hover:text-brand
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

                    duration-300

                    group-hover:scale-125
                  "
                />
              </a>
            </Magnetic>
          </motion.div>

          {/* TRUST POINTS */}

          <motion.div
            variants={
              item
            }
            custom={
              6
            }
            className="
              mt-10

              grid

              max-w-xl

              gap-3

              border-t
              border-black/[0.07]

              pt-5

              sm:grid-cols-3
            "
          >
            <TrustPoint
              icon={
                <Gauge className="h-4 w-4" />
              }
              text={
                content.trustPoint1
              }
            />

            <TrustPoint
              icon={
                <Cpu className="h-4 w-4" />
              }
              text={
                content.trustPoint2
              }
            />

            <TrustPoint
              icon={
                <MousePointerClick className="h-4 w-4" />
              }
              text={
                content.trustPoint3
              }
            />
          </motion.div>
        </motion.div>

        {/* ===================================================
            RIGHT — MEDIA SLIDER

            NO FLOATING CARDS
            NO IMAGE CROPPING
            =================================================== */}

        <motion.div
          initial={{
            opacity:
              0,

            y:
              34,

            scale:
              0.97,
          }}
          animate={
            ready
              ? {
                  opacity:
                    1,

                  y:
                    0,

                  scale:
                    1,
                }
              : {
                  opacity:
                    0,

                  y:
                    34,

                  scale:
                    0.97,
                }
          }
          transition={{
            duration:
              0.9,

            delay:
              0.28,

            ease: [
              0.22,
              1,
              0.36,
              1,
            ],
          }}
          className="relative"
        >
          <div
            className="
              absolute

              -inset-5

              -z-10

              rounded-[2.4rem]

              bg-brand/[0.07]

              blur-3xl
            "
          />

          <div
            className="
              relative

              overflow-hidden

              rounded-[1.8rem]

              border
              border-brand/20

              bg-[#111]

              shadow-[0_30px_90px_-35px_rgba(230,0,0,0.42)]
            "
          >
            {/* FRAME */}

            <div
              className="
                pointer-events-none

                absolute
                inset-0

                z-30

                rounded-[1.8rem]

                ring-1
                ring-inset
                ring-white/10
              "
            />

            <div
              className="
                pointer-events-none

                absolute

                inset-x-0
                top-0

                z-30

                h-[3px]

                bg-gradient-to-r

                from-transparent
                via-brand
                to-transparent
              "
            />

            {/* =================================================
                MEDIA AREA

                Stable 16:10 frame.

                object-contain preserves the source ratio and
                keeps the complete image/video visible.
                ================================================= */}

            <div
              className="
                relative

                aspect-[16/10]

                w-full

                bg-[#0d0d0d]
              "
            >
              {currentSlide ? (
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`${currentSlide.id}-${slideIndex}`}
                    initial={{
                      opacity:
                        0,

                      scale:
                        1.015,
                    }}
                    animate={{
                      opacity:
                        1,

                      scale:
                        1,
                    }}
                    exit={{
                      opacity:
                        0,

                      scale:
                        0.99,
                    }}
                    transition={{
                      duration:
                        0.45,

                      ease: [
                        0.22,
                        1,
                        0.36,
                        1,
                      ],
                    }}
                    className="
                      absolute
                      inset-0
                    "
                  >
                    {currentSlide.mediaType ===
                    "video" ? (
                      <video
                        src={
                          currentSlide.url
                        }
                        aria-label={
                          currentSlide.alt ||
                          "Gamex Hero video"
                        }
                        autoPlay
                        muted
                        playsInline
                        loop={
                          slides.length ===
                          1
                        }
                        onEnded={
                          slides.length >
                          1
                            ? nextSlide
                            : undefined
                        }
                        className="
                          h-full
                          w-full

                          object-contain
                        "
                      />
                    ) : (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={
                          currentSlide.url
                        }
                        alt={
                          currentSlide.alt ||
                          "Gamex Hero image"
                        }
                        className="
                          h-full
                          w-full

                          object-contain
                        "
                      />
                    )}
                  </motion.div>
                </AnimatePresence>
              ) : (
                <div
                  className="
                    absolute
                    inset-0

                    grid

                    place-items-center

                    px-8

                    text-center
                  "
                >
                  <div>
                    <Zap
                      className="
                        mx-auto

                        h-10
                        w-10

                        text-brand
                      "
                    />

                    <p
                      className="
                        mt-4

                        font-display

                        text-sm

                        font-bold

                        uppercase

                        tracking-wider

                        text-white
                      "
                    >
                      Hero Media
                    </p>

                    <p
                      className="
                        mt-2

                        text-xs

                        leading-relaxed

                        text-white/50
                      "
                    >
                      Add images or video from Admin → Hero
                      Settings.
                    </p>
                  </div>
                </div>
              )}

              {/* ===============================================
                  SLIDER CONTROLS
                  =============================================== */}

              {slides.length >
              1 ? (
                <>
                  <button
                    type="button"
                    onClick={
                      previousSlide
                    }
                    aria-label="Previous Hero media"
                    className="
                      absolute

                      left-3
                      top-1/2

                      z-40

                      grid

                      h-10
                      w-10

                      -translate-y-1/2

                      place-items-center

                      rounded-full

                      border
                      border-white/20

                      bg-black/45

                      text-white

                      backdrop-blur-md

                      transition-all

                      hover:border-brand

                      hover:bg-brand

                      sm:left-4
                    "
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>

                  <button
                    type="button"
                    onClick={
                      nextSlide
                    }
                    aria-label="Next Hero media"
                    className="
                      absolute

                      right-3
                      top-1/2

                      z-40

                      grid

                      h-10
                      w-10

                      -translate-y-1/2

                      place-items-center

                      rounded-full

                      border
                      border-white/20

                      bg-black/45

                      text-white

                      backdrop-blur-md

                      transition-all

                      hover:border-brand

                      hover:bg-brand

                      sm:right-4
                    "
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>

                  {/* DOTS */}

                  <div
                    className="
                      absolute

                      bottom-4
                      left-1/2

                      z-40

                      flex

                      -translate-x-1/2

                      items-center

                      gap-2

                      rounded-full

                      border
                      border-white/15

                      bg-black/45

                      px-3
                      py-2

                      backdrop-blur-md
                    "
                  >
                    {slides.map(
                      (
                        slide,
                        index
                      ) => (
                        <button
                          key={
                            slide.id
                          }
                          type="button"
                          onClick={() =>
                            setSlideIndex(
                              index
                            )
                          }
                          aria-label={`Show Hero media ${
                            index +
                            1
                          }`}
                          className={`
                            h-1.5

                            rounded-full

                            transition-all

                            duration-300

                            ${
                              index ===
                              slideIndex
                                ? "w-7 bg-brand"
                                : "w-1.5 bg-white/55 hover:bg-white"
                            }
                          `}
                        />
                      )
                    )}
                  </div>
                </>
              ) : null}
            </div>
          </div>

          {/* COUNTER */}

          {slides.length >
          0 ? (
            <div
              className="
                mt-3

                flex

                items-center
                justify-between

                px-1

                text-[10px]

                font-bold

                uppercase

                tracking-[0.18em]

                text-slate-400
              "
            >
              <span>
                {currentSlide?.mediaType ===
                "video"
                  ? "Video"
                  : "Image"}
              </span>

              <span>
                {slideIndex +
                  1}{" "}
                /{" "}
                {
                  slides.length
                }
              </span>
            </div>
          ) : null}
        </motion.div>
      </div>

      {/* SCROLL */}

      <motion.div
        initial={{
          opacity:
            0,
        }}
        animate={
          ready
            ? {
                opacity:
                  1,
              }
            : {
                opacity:
                  0,
              }
        }
        transition={{
          delay:
            1,

          duration:
            0.5,
        }}
        className="
          mt-8

          flex

          justify-center

          md:mt-10
        "
      >
        <MouseIndicator />
      </motion.div>
    </section>
  );
}

/* =========================================================
   TRUST POINT
   ========================================================= */

function TrustPoint({
  icon,
  text,
}: {
  icon: ReactNode;

  text: string;
}) {
  return (
    <div
      className="
        flex

        items-center

        gap-2.5

        text-xs

        font-semibold

        text-slate-500
      "
    >
      <span
        className="
          grid

          h-8
          w-8

          shrink-0

          place-items-center

          rounded-lg

          bg-brand/[0.07]

          text-brand
        "
      >
        {icon}
      </span>

      <span className="leading-snug">
        {text}
      </span>
    </div>
  );
}
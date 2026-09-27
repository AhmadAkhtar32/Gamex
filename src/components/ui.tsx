"use client";

import {
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

import {
  animate,
  motion,
  useInView,
  useScroll,
  useSpring,
} from "framer-motion";

/* =========================================================
   SHARED EASING
   ========================================================= */

const EASE:
  [
    number,
    number,
    number,
    number
  ] = [
    0.22,
    1,
    0.36,
    1,
  ];

/* =========================================================
   REVEAL
   ========================================================= */

export function Reveal({
  children,
  delay = 0,
  y = 28,
  className,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y,
      }}
      whileInView={{
        opacity: 1,
        y: 0,
      }}
      viewport={{
        once: true,
        margin: "-80px",
      }}
      transition={{
        duration: 0.7,
        delay,
        ease: EASE,
      }}
      className={
        className
      }
    >
      {children}
    </motion.div>
  );
}

/* =========================================================
   ANIMATED WORDS
   ========================================================= */

export function AnimatedWords({
  text,
  accents = [],
  className = "",
  delay = 0,
}: {
  text: string;
  accents?: string[];
  className?: string;
  delay?: number;
}) {
  const words =
    text.split(" ");

  return (
    <span
      className={
        className
      }
    >
      {words.map(
        (
          word,
          index
        ) => {
          const isAccent =
            accents.includes(
              word
            );

          return (
            <span
              key={
                index
              }
              className="
                inline-block
                overflow-hidden
                pb-[0.08em]
                align-bottom
              "
            >
              <motion.span
                className={`
                  inline-block

                  ${
                    isAccent
                      ? "text-brand"
                      : ""
                  }
                `}
                initial={{
                  y: "112%",
                }}
                whileInView={{
                  y: 0,
                }}
                viewport={{
                  once: true,
                  margin:
                    "-60px",
                }}
                transition={{
                  duration:
                    0.7,

                  delay:
                    delay +
                    index *
                      0.07,

                  ease: EASE,
                }}
              >
                {word}

                {index <
                words.length -
                  1
                  ? "\u00A0"
                  : ""}
              </motion.span>
            </span>
          );
        }
      )}
    </span>
  );
}

/* =========================================================
   SECTION HEADING
   ========================================================= */

export function SectionHeading({
  eyebrow,
  title,
  accent,
  subtitle,
  align = "center",
}: {
  eyebrow: string;
  title: string;
  accent?:
    | string
    | string[];
  subtitle?: string;
  align?:
    | "center"
    | "left";
}) {
  const isCenter =
    align ===
    "center";

  const accents =
    accent
      ? Array.isArray(
          accent
        )
        ? accent
        : [
            accent,
          ]
      : [];

  return (
    <div
      className={`
        flex
        flex-col

        ${
          isCenter
            ? `
              items-center
              text-center
            `
            : `
              items-start
              text-left
            `
        }
      `}
    >
      {/* =====================================================
          EYEBROW
          ===================================================== */}

      <Reveal>
        <span
          className="
            inline-flex

            items-center

            gap-2.5

            rounded-full

            border
            border-brand/20

            bg-brand/[0.055]

            px-4
            py-2

            text-[10px]

            font-extrabold

            uppercase

            tracking-[0.24em]

            text-brand

            shadow-[0_10px_28px_-20px_rgba(230,0,0,0.45)]

            sm:text-xs
          "
        >
          {/* ===============================================
              LIVE RED DOT
              =============================================== */}

          <span
            className="
              relative

              flex

              h-2
              w-2

              items-center
              justify-center
            "
          >
            <span
              className="
                absolute

                h-full
                w-full

                animate-ping

                rounded-full

                bg-brand/30
              "
            />

            <span
              className="
                relative

                h-1.5
                w-1.5

                rounded-full

                bg-brand

                shadow-[0_0_8px_rgba(230,0,0,0.55)]
              "
            />
          </span>

          {eyebrow}
        </span>
      </Reveal>

      {/* =====================================================
          MAIN HEADING
          ===================================================== */}

      <h2
        className="
          mt-5

          font-display

          text-3xl

          font-extrabold

          uppercase

          leading-tight

          tracking-tight

          text-brand-deep

          sm:text-4xl

          md:text-5xl
        "
      >
        <AnimatedWords
          text={
            title
          }
          accents={
            accents
          }
        />
      </h2>

      {/* =====================================================
          RED DECORATIVE DIVIDER
          ===================================================== */}

      <Reveal
        delay={
          0.08
        }
      >
        <div
          className={`
            mt-5

            flex

            items-center

            gap-2

            ${
              isCenter
                ? "justify-center"
                : "justify-start"
            }
          `}
        >
          <span
            className="
              h-[3px]
              w-10

              rounded-full

              bg-brand

              shadow-[0_0_10px_rgba(230,0,0,0.35)]
            "
          />

          <span
            className="
              h-[3px]
              w-3

              rounded-full

              bg-black/65
            "
          />

          <span
            className="
              h-[3px]
              w-1.5

              rounded-full

              bg-brand/35
            "
          />
        </div>
      </Reveal>

      {/* =====================================================
          SUBTITLE
          ===================================================== */}

      {subtitle ? (
        <Reveal
          delay={
            0.14
          }
        >
          <p
            className={`
              mt-5

              max-w-2xl

              text-base

              font-medium

              leading-8

              text-slate-600

              sm:text-lg

              ${
                isCenter
                  ? "mx-auto"
                  : ""
              }
            `}
          >
            {subtitle}
          </p>
        </Reveal>
      ) : null}
    </div>
  );
}

/* =========================================================
   COUNT UP
   ========================================================= */

export function CountUp({
  value,
  suffix = "",
  decimals = 0,
  duration = 2,
}: {
  value: number;
  suffix?: string;
  decimals?: number;
  duration?: number;
}) {
  const ref =
    useRef<HTMLSpanElement>(
      null
    );

  const inView =
    useInView(
      ref,
      {
        once: true,
        margin:
          "-60px",
      }
    );

  const [
    display,
    setDisplay,
  ] =
    useState(
      "0"
    );

  useEffect(() => {
    if (!inView) {
      return;
    }

    const controls =
      animate(
        0,
        value,
        {
          duration,

          ease:
            "easeOut",

          onUpdate: (
            currentValue
          ) => {
            setDisplay(
              currentValue.toFixed(
                decimals
              )
            );
          },
        }
      );

    return () => {
      controls.stop();
    };
  }, [
    inView,
    value,
    decimals,
    duration,
  ]);

  return (
    <span
      ref={
        ref
      }
    >
      {display}
      {suffix}
    </span>
  );
}

/* =========================================================
   SPOTLIGHT CARD
   ========================================================= */

export function SpotlightCard({
  children,
  className = "",
  max = 7,
}: {
  children: ReactNode;
  className?: string;
  max?: number;
}) {
  const ref =
    useRef<HTMLDivElement>(
      null
    );

  const [
    transform,
    setTransform,
  ] =
    useState(
      "perspective(1000px) rotateX(0deg) rotateY(0deg)"
    );

  const [
    spot,
    setSpot,
  ] =
    useState({
      opacity: 0,
      x: 50,
      y: 50,
    });

  /* =======================================================
     MOUSE MOVE
     ======================================================= */

  function onMove(
    event: React.MouseEvent<HTMLDivElement>
  ) {
    const element =
      ref.current;

    if (!element) {
      return;
    }

    const rect =
      element.getBoundingClientRect();

    const px =
      (event.clientX -
        rect.left) /
      rect.width;

    const py =
      (event.clientY -
        rect.top) /
      rect.height;

    const rotateX =
      (0.5 -
        py) *
      max *
      2;

    const rotateY =
      (px -
        0.5) *
      max *
      2;

    setTransform(
      `perspective(1000px) rotateX(${rotateX.toFixed(
        2
      )}deg) rotateY(${rotateY.toFixed(
        2
      )}deg) scale3d(1.02,1.02,1.02)`
    );

    setSpot({
      opacity: 1,
      x:
        px *
        100,
      y:
        py *
        100,
    });
  }

  /* =======================================================
     MOUSE LEAVE
     ======================================================= */

  function onLeave() {
    setTransform(
      "perspective(1000px) rotateX(0deg) rotateY(0deg)"
    );

    setSpot(
      (
        current
      ) => ({
        ...current,
        opacity: 0,
      })
    );
  }

  return (
    <div
      ref={
        ref
      }
      onMouseMove={
        onMove
      }
      onMouseLeave={
        onLeave
      }
      style={{
        transform,

        transition:
          "transform 0.2s ease-out",
      }}
      className={`
        relative

        overflow-hidden

        will-change-transform

        ${className}
      `}
    >
      {/* =====================================================
          MAIN RED MOUSE SPOTLIGHT
          ===================================================== */}

      <div
        className="
          pointer-events-none

          absolute
          inset-0

          z-10

          transition-opacity

          duration-300
        "
        style={{
          opacity:
            spot.opacity,

          background: `radial-gradient(
            560px circle at ${spot.x}% ${spot.y}%,
            rgba(230,0,0,0.115),
            transparent 65%
          )`,
        }}
      />

      {/* =====================================================
          SECONDARY SOFT RED HIGHLIGHT
          ===================================================== */}

      <div
        className="
          pointer-events-none

          absolute
          inset-0

          z-10

          transition-opacity

          duration-300
        "
        style={{
          opacity:
            spot.opacity,

          background: `radial-gradient(
            330px circle at ${spot.x}% ${spot.y}%,
            rgba(255,70,70,0.085),
            transparent 62%
          )`,
        }}
      />

      {/* =====================================================
          VERY SMALL WHITE HIGHLIGHT
          ===================================================== */}

      <div
        className="
          pointer-events-none

          absolute
          inset-0

          z-10

          transition-opacity

          duration-300
        "
        style={{
          opacity:
            spot.opacity,

          background: `radial-gradient(
            170px circle at ${spot.x}% ${spot.y}%,
            rgba(255,255,255,0.18),
            transparent 70%
          )`,
        }}
      />

      {children}
    </div>
  );
}

/* =========================================================
   MAGNETIC EFFECT
   ========================================================= */

export function Magnetic({
  children,
  className = "",
  strength = 0.35,
}: {
  children: ReactNode;
  className?: string;
  strength?: number;
}) {
  const ref =
    useRef<HTMLDivElement>(
      null
    );

  const x =
    useSpring(
      0,
      {
        stiffness:
          200,

        damping:
          18,

        mass:
          0.6,
      }
    );

  const y =
    useSpring(
      0,
      {
        stiffness:
          200,

        damping:
          18,

        mass:
          0.6,
      }
    );

  function onMove(
    event: React.MouseEvent<HTMLDivElement>
  ) {
    const element =
      ref.current;

    if (!element) {
      return;
    }

    const rect =
      element.getBoundingClientRect();

    x.set(
      (
        event.clientX -
        (rect.left +
          rect.width /
            2)
      ) *
        strength
    );

    y.set(
      (
        event.clientY -
        (rect.top +
          rect.height /
            2)
      ) *
        strength
    );
  }

  function onLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.div
      ref={
        ref
      }
      style={{
        x,
        y,
      }}
      onMouseMove={
        onMove
      }
      onMouseLeave={
        onLeave
      }
      className={`
        inline-block

        ${className}
      `}
    >
      {children}
    </motion.div>
  );
}

/* =========================================================
   GLITCH TEXT
   ========================================================= */

export function GlitchText({
  text,
  className = "",
}: {
  text: string;
  className?: string;
}) {
  return (
    <span
      className={`
        glitch

        ${className}
      `}
      data-text={
        text
      }
    >
      {text}
    </span>
  );
}

/* =========================================================
   SCROLL PROGRESS
   ========================================================= */

export function ScrollProgress() {
  const {
    scrollYProgress,
  } =
    useScroll();

  const scaleX =
    useSpring(
      scrollYProgress,
      {
        stiffness:
          120,

        damping:
          30,

        restDelta:
          0.001,
      }
    );

  return (
    <motion.div
      style={{
        scaleX,
      }}
      className="
        fixed

        inset-x-0
        top-0

        z-[70]

        h-[3px]

        origin-left

        bg-gradient-to-r

        from-black

        via-brand

        to-brand-soft

        shadow-[0_2px_14px_rgba(230,0,0,0.3)]
      "
    />
  );
}

/* =========================================================
   SMALL FLOATING PARTICLES
   ========================================================= */

export function Particles({
  count = 18,
  className = "",
}: {
  count?: number;
  className?: string;
}) {
  const dots =
    Array.from({
      length:
        count,
    }).map(
      (
        _,
        index
      ) => ({
        id:
          index,

        left:
          (index *
              37 +
            13) %
          100,

        top:
          (index *
              53 +
            7) %
          100,

        size:
          2 +
          (index %
            3),

        delay:
          (index %
            9) *
          0.7,

        duration:
          6 +
          (index %
            5) *
            1.8,
      })
    );

  return (
    <div
      className={`
        pointer-events-none

        absolute
        inset-0

        overflow-hidden

        ${className}
      `}
    >
      {dots.map(
        (
          dot
        ) => (
          <motion.span
            key={
              dot.id
            }
            className="
              absolute

              rounded-full

              bg-brand/55

              shadow-[0_0_8px_rgba(230,0,0,0.3)]
            "
            style={{
              left:
                `${dot.left}%`,

              top:
                `${dot.top}%`,

              width:
                dot.size,

              height:
                dot.size,
            }}
            animate={{
              y: [
                0,
                -22,
                0,
              ],

              opacity: [
                0.08,
                0.5,
                0.08,
              ],
            }}
            transition={{
              duration:
                dot.duration,

              delay:
                dot.delay,

              repeat:
                Infinity,

              ease:
                "easeInOut",
            }}
          />
        )
      )}
    </div>
  );
}

/* =========================================================
   MOUSE-REACTIVE PARTICLE FIELD
   ========================================================= */

export function ParticleField({
  className = "",
  color = "230,0,0",
}: {
  className?: string;

  /*
   * RGB values only.
   *
   * Default is now GameX red:
   *
   * 230,0,0
   */
  color?: string;
}) {
  const canvasRef =
    useRef<HTMLCanvasElement>(
      null
    );

  useEffect(() => {
    const canvas =
      canvasRef.current;

    if (!canvas) {
      return;
    }

    const context =
      canvas.getContext(
        "2d"
      );

    if (!context) {
      return;
    }

    let width =
      0;

    let height =
      0;

    let raf =
      0;

    const DPR =
      Math.min(
        window.devicePixelRatio ||
          1,
        2
      );

    const mouse = {
      x: -9999,
      y: -9999,
    };

    const particles: {
      x: number;
      y: number;
      vx: number;
      vy: number;
      r: number;
    }[] = [];

    /* =====================================================
       RESIZE
       ===================================================== */

    const resize =
      () => {
        const parent =
          canvas.parentElement;

        if (
          !parent
        ) {
          return;
        }

        const rect =
          parent.getBoundingClientRect();

        width =
          rect.width;

        height =
          rect.height;

        canvas.width =
          width *
          DPR;

        canvas.height =
          height *
          DPR;

        canvas.style.width =
          `${width}px`;

        canvas.style.height =
          `${height}px`;

        context.setTransform(
          DPR,
          0,
          0,
          DPR,
          0,
          0
        );

        const count =
          Math.min(
            65,
            Math.floor(
              (width *
                height) /
                26000
            )
          );

        particles.length =
          0;

        for (
          let index =
            0;
          index <
          count;
          index++
        ) {
          particles.push({
            x:
              Math.random() *
              width,

            y:
              Math.random() *
              height,

            vx:
              (Math.random() -
                0.5) *
              0.34,

            vy:
              (Math.random() -
                0.5) *
              0.34,

            r:
              Math.random() *
                1.25 +
              0.5,
          });
        }
      };

    /* =====================================================
       PARTICLE ANIMATION
       ===================================================== */

    const step =
      () => {
        context.clearRect(
          0,
          0,
          width,
          height
        );

        for (
          const particle
          of particles
        ) {
          particle.x +=
            particle.vx;

          particle.y +=
            particle.vy;

          if (
            particle.x <
            0
          ) {
            particle.x =
              width;
          }

          if (
            particle.x >
            width
          ) {
            particle.x =
              0;
          }

          if (
            particle.y <
            0
          ) {
            particle.y =
              height;
          }

          if (
            particle.y >
            height
          ) {
            particle.y =
              0;
          }

          /* ===============================================
             MOUSE REPULSION
             =============================================== */

          const dx =
            particle.x -
            mouse.x;

          const dy =
            particle.y -
            mouse.y;

          const distance =
            Math.hypot(
              dx,
              dy
            );

          if (
            distance <
              120 &&
            distance >
              0
          ) {
            particle.x +=
              (dx /
                distance) *
              0.62;

            particle.y +=
              (dy /
                distance) *
              0.62;
          }

          /* ===============================================
             DRAW PARTICLE
             =============================================== */

          context.beginPath();

          context.arc(
            particle.x,
            particle.y,
            particle.r,
            0,
            Math.PI *
              2
          );

          context.fillStyle =
            `rgba(${color},0.34)`;

          context.fill();
        }

        /* ===============================================
           CONNECT NEARBY PARTICLES
           =============================================== */

        for (
          let firstIndex =
            0;
          firstIndex <
          particles.length;
          firstIndex++
        ) {
          for (
            let secondIndex =
              firstIndex +
              1;
            secondIndex <
            particles.length;
            secondIndex++
          ) {
            const firstParticle =
              particles[
                firstIndex
              ];

            const secondParticle =
              particles[
                secondIndex
              ];

            const distance =
              Math.hypot(
                firstParticle.x -
                  secondParticle.x,

                firstParticle.y -
                  secondParticle.y
              );

            if (
              distance <
              110
            ) {
              context.beginPath();

              context.moveTo(
                firstParticle.x,
                firstParticle.y
              );

              context.lineTo(
                secondParticle.x,
                secondParticle.y
              );

              context.strokeStyle =
                `rgba(${color},${(
                  (1 -
                    distance /
                      110) *
                  0.105
                ).toFixed(
                  3
                )})`;

              context.lineWidth =
                1;

              context.stroke();
            }
          }
        }

        raf =
          requestAnimationFrame(
            step
          );
      };

    /* =====================================================
       MOUSE
       ===================================================== */

    const onMove =
      (
        event: MouseEvent
      ) => {
        const rect =
          canvas.getBoundingClientRect();

        mouse.x =
          event.clientX -
          rect.left;

        mouse.y =
          event.clientY -
          rect.top;
      };

    const onLeave =
      () => {
        mouse.x =
          -9999;

        mouse.y =
          -9999;
      };

    /* =====================================================
       START
       ===================================================== */

    resize();

    raf =
      requestAnimationFrame(
        step
      );

    window.addEventListener(
      "resize",
      resize
    );

    window.addEventListener(
      "mousemove",
      onMove
    );

    document.addEventListener(
      "mouseleave",
      onLeave
    );

    /* =====================================================
       CLEANUP
       ===================================================== */

    return () => {
      cancelAnimationFrame(
        raf
      );

      window.removeEventListener(
        "resize",
        resize
      );

      window.removeEventListener(
        "mousemove",
        onMove
      );

      document.removeEventListener(
        "mouseleave",
        onLeave
      );
    };
  }, [
    color,
  ]);

  return (
    <canvas
      ref={
        canvasRef
      }
      className={
        className
      }
      aria-hidden="true"
    />
  );
}

/* =========================================================
   MARQUEE
   ========================================================= */

export function Marquee({
  reverse = false,
  className = "",
}: {
  reverse?: boolean;
  className?: string;
}) {
  const items = [
    "Custom Builds",
    "Flagship Graphics Cards",
    "High-Speed Memory",
    "Gaming Processors",
    "High-Refresh Monitors",
    "Water Cooling",
    "Mechanical Keyboards",
    "RGB Everything",
  ];

  const row = [
    ...items,
    ...items,
  ];

  return (
    <div
      className={`
        relative

        overflow-hidden

        border-y
        border-brand/15

        bg-[#fff8f8]/95

        py-4

        backdrop-blur-sm

        ${className}
      `}
    >
      {/* =====================================================
          RED TOP ACCENT
          ===================================================== */}

      <div
        aria-hidden="true"
        className="
          absolute

          inset-x-0
          top-0

          h-px

          bg-gradient-to-r

          from-transparent
          via-brand/15
          to-transparent
        "
      />

      {/* =====================================================
          SOFT FADE — LEFT
          ===================================================== */}

      <div
        className="
          pointer-events-none

          absolute

          inset-y-0
          left-0

          z-10

          w-16

          bg-gradient-to-r

          from-[#fff8f8]
          via-[#fff8f8]/85
          to-transparent

          sm:w-28
        "
      />

      {/* =====================================================
          SOFT FADE — RIGHT
          ===================================================== */}

      <div
        className="
          pointer-events-none

          absolute

          inset-y-0
          right-0

          z-10

          w-16

          bg-gradient-to-l

          from-[#fff8f8]
          via-[#fff8f8]/85
          to-transparent

          sm:w-28
        "
      />

      {/* =====================================================
          MARQUEE CONTENT
          ===================================================== */}

      <div
        className={`
          flex

          w-max

          gap-10

          ${
            reverse
              ? "animate-marquee-reverse"
              : "animate-marquee"
          }
        `}
      >
        {row.map(
          (
            marqueeItem,
            index
          ) => (
            <div
              key={
                index
              }
              className="
                flex

                items-center

                gap-10

                whitespace-nowrap
              "
            >
              {/* =============================================
                  TEXT
                  ============================================= */}

              <span
                className="
                  font-display

                  text-sm

                  font-bold

                  uppercase

                  tracking-[0.3em]

                  text-slate-500

                  transition-colors

                  duration-300

                  hover:text-brand
                "
              >
                {
                  marqueeItem
                }
              </span>

              {/* =============================================
                  RED X-STYLE SEPARATOR
                  ============================================= */}

              <span
                aria-hidden="true"
                className="
                  relative

                  grid

                  h-5
                  w-5

                  place-items-center

                  text-brand
                "
              >
                <span
                  className="
                    absolute

                    h-[2px]
                    w-4

                    rotate-45

                    rounded-full

                    bg-brand
                  "
                />

                <span
                  className="
                    absolute

                    h-[2px]
                    w-4

                    -rotate-45

                    rounded-full

                    bg-brand/65
                  "
                />
              </span>
            </div>
          )
        )}
      </div>

      {/* =====================================================
          BOTTOM ACCENT
          ===================================================== */}

      <div
        aria-hidden="true"
        className="
          absolute

          inset-x-0
          bottom-0

          h-px

          bg-gradient-to-r

          from-transparent
          via-brand/10
          to-transparent
        "
      />
    </div>
  );
}
"use client";

import {
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  motion,
  useInView,
  useScroll,
  useTransform,
} from "framer-motion";

const EASE: [number, number, number, number] = [
  0.22,
  1,
  0.36,
  1,
];


/* =========================================================
   BLUR REVEAL
   ========================================================= */

export function BlurReveal({
  children,
  delay = 0,
  y = 26,
  className = "",
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
        filter: "blur(12px)",
      }}
      whileInView={{
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
      }}
      viewport={{
        once: true,
        margin: "-60px",
      }}
      transition={{
        duration: 0.7,
        delay,
        ease: EASE,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}


/* =========================================================
   SCRAMBLE TEXT
   ========================================================= */

export function ScrambleText({
  text,
  className = "",
  duration = 900,
}: {
  text: string;
  className?: string;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  const inView = useInView(ref, {
    once: true,
    margin: "-40px",
  });

  const [output, setOutput] = useState(text);

  const chars =
    "!<>-_\\/[]{}—=+*^?#$%&@";

  useEffect(() => {
    if (!inView) {
      return;
    }

    let start = 0;
    let raf = 0;

    const step = (time: number) => {
      if (!start) {
        start = time;
      }

      const progress = Math.min(
        1,
        (time - start) / duration
      );

      setOutput(
        text
          .split("")
          .map((character, index) => {
            if (character === " ") {
              return " ";
            }

            if (progress === 1) {
              return character;
            }

            if (
              index <
              progress * text.length
            ) {
              return character;
            }

            return chars[
              Math.floor(
                Math.random() *
                  chars.length
              )
            ];
          })
          .join("")
      );

      if (progress < 1) {
        raf =
          requestAnimationFrame(step);
      }
    };

    raf = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(raf);
    };
  }, [inView, text, duration]);

  return (
    <span
      ref={ref}
      className={className}
    >
      {output}
    </span>
  );
}


/* =========================================================
   PARALLAX
   ========================================================= */

export function Parallax({
  children,
  speed = 80,
  className = "",
}: {
  children?: ReactNode;
  speed?: number;
  className?: string;
}) {
  const ref =
    useRef<HTMLDivElement>(null);

  const { scrollYProgress } =
    useScroll({
      target: ref,
      offset: [
        "start end",
        "end start",
      ],
    });

  const y = useTransform(
    scrollYProgress,
    [0, 1],
    [speed, -speed]
  );

  return (
    <motion.div
      ref={ref}
      style={{
        y,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}


/* =========================================================
   SCROLL SKEW
   ========================================================= */

export function ScrollSkew({
  children,
  className = "",
  amount = 3,
}: {
  children: ReactNode;
  className?: string;
  amount?: number;
}) {
  const ref =
    useRef<HTMLDivElement>(null);

  const { scrollYProgress } =
    useScroll({
      target: ref,
      offset: [
        "start end",
        "end start",
      ],
    });

  const skewY = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [amount, 0, -amount]
  );

  return (
    <motion.div
      ref={ref}
      style={{
        skewY,
      }}
      className={`will-change-transform ${className}`}
    >
      {children}
    </motion.div>
  );
}


/* =========================================================
   MOUSE / SCROLL INDICATOR
   ========================================================= */

export function MouseIndicator({
  className = "",
}: {
  className?: string;
}) {
  return (
    <div
      className={`
        flex
        flex-col
        items-center
        gap-2.5
        ${className}
      `}
    >
      {/* Mouse body */}
      <div
        className="
          flex
          h-9
          w-6
          items-start
          justify-center

          rounded-full

          border-2
          border-brand/35

          bg-white/70

          p-1.5

          shadow-[0_8px_24px_-16px_rgba(23,49,96,0.45)]

          backdrop-blur-sm
        "
      >
        {/* Mouse wheel */}
        <span
          className="
            animate-wheel
            block
            h-1.5
            w-1.5
            rounded-full
            bg-brand
            shadow-[0_0_8px_rgba(23,49,96,0.35)]
          "
        />
      </div>

      {/* Label */}
      <span
        className="
          text-[10px]
          font-bold
          uppercase
          tracking-[0.35em]
          text-slate-500
        "
      >
        Scroll
      </span>
    </div>
  );
}
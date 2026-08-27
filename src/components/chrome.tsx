"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import Lenis from "lenis";
import { GlitchText } from "./ui";
import { GlobalBackground, GrainOverlay } from "./backgrounds";

const ReadyContext = createContext(false);

export function useReady() {
  return useContext(ReadyContext);
}

export function Chrome({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const onDone = useCallback(() => setReady(true), []);

  return (
    <ReadyContext.Provider value={ready}>
      <CustomCursor />
      <SmoothScroll />
      <GlobalBackground />
      <Preloader onDone={onDone} />
      {children}
      <GrainOverlay />
    </ReadyContext.Provider>
  );
}

function Preloader({ onDone }: { onDone: () => void }) {
  const [count, setCount] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    let raf = 0;
    let start: number | null = null;

    const dur = 950;

    const tick = (t: number) => {
      if (start === null) start = t;

      const p = Math.min(1, (t - start) / dur);
      const eased = 1 - Math.pow(1 - p, 3);

      setCount(Math.round(eased * 100));

      if (p < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        setTimeout(() => {
          setDone(true);
          onDone();
        }, 220);
      }
    };

    raf = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(raf);
  }, [onDone]);

  useEffect(() => {
    document.body.style.overflow = done ? "" : "hidden";

    return () => {
      document.body.style.overflow = "";
    };
  }, [done]);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#08080a]"
          exit={{
            y: "-100%",
            transition: {
              duration: 0.7,
              ease: [0.76, 0, 0.24, 1],
            },
          }}
        >
          <GlitchText
            text="GAMEX"
            className="font-display text-5xl font-black tracking-[0.18em] text-white md:text-7xl"
          />

          <div className="mt-8 h-1 w-56 overflow-hidden rounded-full bg-white/10">
            <motion.div
              className="h-full bg-gradient-to-r from-brand-deep via-brand to-brand-soft"
              style={{ width: `${count}%` }}
            />
          </div>

          <div className="mt-4 font-display text-sm font-bold tracking-[0.35em] text-brand">
            {count}%
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/**
 * Simple Gamex Custom Cursor
 *
 * Desktop / mouse devices only.
 * Mobile and touch devices keep the normal browser behavior.
 */
function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;

    document.documentElement.classList.add("custom-cursor");

    const cursor = cursorRef.current;
    if (!cursor) return;

    const onMove = (e: MouseEvent) => {
      cursor.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
    };

    window.addEventListener("mousemove", onMove);

    return () => {
      document.documentElement.classList.remove("custom-cursor");
      window.removeEventListener("mousemove", onMove);
    };
  }, []);

  return (
    <div ref={cursorRef} className="custom-cursor-dot">
      <svg width="22" height="22" viewBox="0 0 320 512" fill="none">
        <path
          d="M0 55.2V426c0 12.2 9.9 22 22 22c6.3 0 12.4-2.7 16.6-7.5L121.2 346l58.1 116.3c7.9 15.8 27.1 22.2 42.9 14.3s22.2-27.1 14.3-42.9L179.4 320H297.9c12.2 0 22.1-9.9 22.1-22.1c0-6.3-2.7-12.3-7.4-16.5L38.6 37.9C34.3 34.1 28.9 32 23.2 32C10.4 32 0 42.4 0 55.2z"
          fill="#ff0000"
        />
      </svg>
    </div>
  );
}

function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const lenis = new Lenis({
      lerp: 0.1,
      smoothWheel: true,
    });

    let raf = 0;

    const loop = (time: number) => {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    };

    raf = requestAnimationFrame(loop);

    const onClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement).closest?.(
        'a[href^="#"]'
      ) as HTMLAnchorElement | null;

      if (!anchor) return;

      const href = anchor.getAttribute("href");

      if (!href || href.length < 2) return;

      const target = document.querySelector(href);

      if (target) {
        e.preventDefault();

        lenis.scrollTo(target as HTMLElement, {
          offset: -70,
        });
      }
    };

    document.addEventListener("click", onClick);

    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("click", onClick);
      lenis.destroy();
    };
  }, []);

  return null;
}
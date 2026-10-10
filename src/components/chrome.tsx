"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import Lenis from "lenis";
import gamexLogo from "@/app/logo.png";
import { GlobalBackground, GrainOverlay } from "./backgrounds";

const ReadyContext = createContext(false);
const INTRO_SEEN_KEY = "gamex:intro-seen:v1";
let introSeenInMemory = false;

export function useReady() {
  return useContext(ReadyContext);
}

export function Chrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isAdmin =
    pathname === "/admin" || pathname.startsWith("/admin/");
  const [ready, setReady] = useState(false);
  const [showIntro, setShowIntro] = useState(false);

  useEffect(() => {
    if (isAdmin || pathname !== "/") {
      setShowIntro(false);
      setReady(true);
      return;
    }

    let alreadySeen = introSeenInMemory;
    try {
      alreadySeen =
        alreadySeen ||
        sessionStorage.getItem(INTRO_SEEN_KEY) === "1";
    } catch {
      // Skip the optional intro if browser storage is unavailable.
      alreadySeen = true;
    }

    if (
      alreadySeen ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setShowIntro(false);
      setReady(true);
      return;
    }

    introSeenInMemory = true;
    try {
      sessionStorage.setItem(INTRO_SEEN_KEY, "1");
    } catch {
      // The in-memory flag prevents repeats during client navigation.
    }

    setReady(false);
    setShowIntro(true);
  }, [isAdmin, pathname]);

  const onDone = useCallback(() => {
    setReady(true);
  }, []);

  return (
    <ReadyContext.Provider value={isAdmin || ready}>
      {!isAdmin && <SmoothScroll />}
      <GlobalBackground />
      {!isAdmin && showIntro && <Preloader onDone={onDone} />}
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
    let timeout = 0;
    let start: number | null = null;
    const duration = 950;

    const tick = (time: number) => {
      if (start === null) start = time;
      const progress = Math.min(1, (time - start) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * 100));

      if (progress < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        timeout = window.setTimeout(() => {
          setDone(true);
          onDone();
        }, 220);
      }
    };

    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(timeout);
    };
  }, [onDone]);

  useEffect(() => {
    if (done) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [done]);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden bg-white"
          exit={{
            y: "-100%",
            transition: {
              duration: 0.7,
              ease: [0.76, 0, 0.24, 1],
            },
          }}
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-1/2 h-[28rem] w-[28rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand/[0.07] blur-[120px]"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 0.45,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="relative"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={gamexLogo.src}
              alt="Gamex"
              className="h-auto w-[220px] object-contain sm:w-[280px] md:w-[330px]"
            />
          </motion.div>

          <div className="relative mt-8 h-1 w-56 overflow-hidden rounded-full bg-brand/10 sm:w-64">
            <motion.div
              className="h-full bg-gradient-to-r from-black via-brand to-brand-soft"
              style={{ width: `${count}%` }}
            />
          </div>
          <div className="relative mt-4 font-display text-sm font-bold tracking-[0.35em] text-brand">
            {count}%
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function SmoothScroll() {
  useEffect(() => {
    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
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

    const onClick = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;

      const anchor = target.closest<HTMLAnchorElement>(
        'a[href^="#"]'
      );
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      if (!href || href.length < 2) return;

      // Use the ID directly rather than treating it as a CSS selector.
      let id: string;
      try {
        id = decodeURIComponent(href.slice(1));
      } catch {
        return;
      }

      const destination = document.getElementById(id);
      if (!destination) return;

      event.preventDefault();
      lenis.scrollTo(destination, { offset: -70 });
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
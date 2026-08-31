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

import {
  AnimatePresence,
  motion,
} from "framer-motion";

import Lenis from "lenis";

import {
  GlitchText,
} from "./ui";

import {
  GlobalBackground,
  GrainOverlay,
} from "./backgrounds";

/* =========================================================
   READY CONTEXT
   ========================================================= */

const ReadyContext =
  createContext(false);

/* =========================================================
   USE READY
   ========================================================= */

export function useReady() {
  return useContext(
    ReadyContext
  );
}

/* =========================================================
   CHROME WRAPPER
   ========================================================= */

export function Chrome({
  children,
}: {
  children: ReactNode;
}) {
  const [
    ready,
    setReady,
  ] = useState(false);

  const onDone =
    useCallback(
      () => {
        setReady(true);
      },
      []
    );

  return (
    <ReadyContext.Provider
      value={ready}
    >
      <CustomCursor />

      <SmoothScroll />

      <GlobalBackground />

      <Preloader
        onDone={
          onDone
        }
      />

      {children}

      <GrainOverlay />
    </ReadyContext.Provider>
  );
}

/* =========================================================
   PRELOADER
   ========================================================= */

function Preloader({
  onDone,
}: {
  onDone: () => void;
}) {
  const [
    count,
    setCount,
  ] = useState(0);

  const [
    done,
    setDone,
  ] = useState(false);

  /* =======================================================
     LOADING COUNTER
     ======================================================= */

  useEffect(() => {
    let raf =
      0;

    let start:
      number | null =
      null;

    const dur =
      950;

    const tick = (
      t: number
    ) => {
      if (
        start === null
      ) {
        start =
          t;
      }

      const p =
        Math.min(
          1,
          (t - start) /
            dur
        );

      const eased =
        1 -
        Math.pow(
          1 - p,
          3
        );

      setCount(
        Math.round(
          eased * 100
        )
      );

      if (
        p < 1
      ) {
        raf =
          requestAnimationFrame(
            tick
          );
      } else {
        setTimeout(
          () => {
            setDone(
              true
            );

            onDone();
          },
          220
        );
      }
    };

    raf =
      requestAnimationFrame(
        tick
      );

    return () => {
      cancelAnimationFrame(
        raf
      );
    };
  }, [onDone]);

  /* =======================================================
     LOCK SCROLL DURING PRELOADER
     ======================================================= */

  useEffect(() => {
    document.body.style.overflow =
      done
        ? ""
        : "hidden";

    return () => {
      document.body.style.overflow =
        "";
    };
  }, [done]);

  /* =======================================================
     PRELOADER UI
     ======================================================= */

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="
            fixed
            inset-0
            z-[100]
            flex
            flex-col
            items-center
            justify-center
            bg-white
          "
          exit={{
            y: "-100%",

            transition: {
              duration:
                0.7,

              ease: [
                0.76,
                0,
                0.24,
                1,
              ],
            },
          }}
        >
          <GlitchText
            text="GAMEX"
            className="
              font-display
              text-5xl
              font-black
              tracking-[0.18em]
              text-brand-deep
              md:text-7xl
            "
          />

          <div
            className="
              mt-8
              h-1
              w-56
              overflow-hidden
              rounded-full
              bg-brand/10
            "
          >
            <motion.div
              className="
                h-full
                bg-gradient-to-r
                from-brand-deep
                via-brand
                to-brand-soft
              "
              style={{
                width:
                  `${count}%`,
              }}
            />
          </div>

          <div
            className="
              mt-4
              font-display
              text-sm
              font-bold
              tracking-[0.35em]
              text-brand
            "
          >
            {count}%
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* =========================================================
   CUSTOM CURSOR

   Goals:

   Desktop:
   - show custom Gamex cursor
   - hide normal website cursor
   - hide custom cursor when mouse leaves webpage

   Mobile / touch:
   - do not render custom cursor at all
   ========================================================= */

function CustomCursor() {
  const cursorRef =
    useRef<HTMLDivElement>(
      null
    );

  const [
    enabled,
    setEnabled,
  ] = useState(false);

  const [
    visible,
    setVisible,
  ] = useState(false);

  /* =======================================================
     DETECT REAL MOUSE / TRACKPAD

     This deliberately excludes normal touch screens.
     ======================================================= */

  useEffect(() => {
    const mediaQuery =
      window.matchMedia(
        "(hover: hover) and (pointer: fine)"
      );

    const updatePointerMode =
      () => {
        setEnabled(
          mediaQuery.matches
        );
      };

    updatePointerMode();

    mediaQuery.addEventListener(
      "change",
      updatePointerMode
    );

    return () => {
      mediaQuery.removeEventListener(
        "change",
        updatePointerMode
      );
    };
  }, []);

  /* =======================================================
     CURSOR MOVEMENT / VISIBILITY
     ======================================================= */

  useEffect(() => {
    /* =====================================================
       TOUCH / MOBILE
       ===================================================== */

    if (!enabled) {
      document.documentElement.classList.remove(
        "custom-cursor"
      );

      setVisible(
        false
      );

      return;
    }

    /* =====================================================
       DESKTOP
       ===================================================== */

    const cursor =
      cursorRef.current;

    if (!cursor) {
      return;
    }

    /*
     * The CSS uses this class to hide the normal browser
     * pointer while it is inside the webpage.
     */

    document.documentElement.classList.add(
      "custom-cursor"
    );

    /* =====================================================
       MOVE
       ===================================================== */

    const onMove = (
      event: MouseEvent
    ) => {
      cursor.style.transform =
        `translate3d(${event.clientX}px, ${event.clientY}px, 0)`;

      /*
       * Only make it visible once we know the current
       * mouse position.
       */

      setVisible(
        true
      );
    };

    /* =====================================================
       MOUSE LEAVES WEBPAGE

       This is important.

       When the mouse moves upward into Chrome's toolbar,
       the custom cursor disappears instead of remaining
       frozen at the top of the webpage.

       Therefore you no longer see:
       system cursor + custom cursor
       at the same time.
       ===================================================== */

    const onMouseLeave =
      () => {
        setVisible(
          false
        );
      };

    /* =====================================================
       WINDOW LOSES FOCUS

       For example:
       - Alt+Tab
       - click another window
       - browser loses focus
       ===================================================== */

    const onWindowBlur =
      () => {
        setVisible(
          false
        );
      };

    /* =====================================================
       WINDOW REGAINS FOCUS

       Keep it hidden until the next real mousemove.
       This prevents the cursor appearing at an old position.
       ===================================================== */

    const onWindowFocus =
      () => {
        setVisible(
          false
        );
      };

    /* =====================================================
       REGISTER EVENTS
       ===================================================== */

    window.addEventListener(
      "mousemove",
      onMove
    );

    document.documentElement.addEventListener(
      "mouseleave",
      onMouseLeave
    );

    window.addEventListener(
      "blur",
      onWindowBlur
    );

    window.addEventListener(
      "focus",
      onWindowFocus
    );

    /* =====================================================
       CLEANUP
       ===================================================== */

    return () => {
      document.documentElement.classList.remove(
        "custom-cursor"
      );

      window.removeEventListener(
        "mousemove",
        onMove
      );

      document.documentElement.removeEventListener(
        "mouseleave",
        onMouseLeave
      );

      window.removeEventListener(
        "blur",
        onWindowBlur
      );

      window.removeEventListener(
        "focus",
        onWindowFocus
      );
    };
  }, [enabled]);

  /* =======================================================
     MOBILE / TOUCH

     Do not even create the custom cursor element.
     ======================================================= */

  if (!enabled) {
    return null;
  }

  /* =======================================================
     DESKTOP CURSOR
     ======================================================= */

  return (
    <div
      ref={
        cursorRef
      }
      aria-hidden="true"
      className={`
        custom-cursor-dot
        transition-opacity
        duration-100

        ${
          visible
            ? "opacity-100"
            : "opacity-0"
        }
      `}
    >
      <svg
        width="22"
        height="22"
        viewBox="0 0 320 512"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M0 55.2V426c0 12.2 9.9 22 22 22c6.3 0 12.4-2.7 16.6-7.5L121.2 346l58.1 116.3c7.9 15.8 27.1 22.2 42.9 14.3s22.2-27.1 14.3-42.9L179.4 320H297.9c12.2 0 22.1-9.9 22.1-22.1c0-6.3-2.7-12.3-7.4-16.5L38.6 37.9C34.3 34.1 28.9 32 23.2 32C10.4 32 0 42.4 0 55.2z"
          fill="#173160"
        />
      </svg>
    </div>
  );
}

/* =========================================================
   SMOOTH SCROLL
   ========================================================= */

function SmoothScroll() {
  useEffect(() => {
    /* =====================================================
       ACCESSIBILITY:
       respect reduced-motion setting
       ===================================================== */

    if (
      window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches
    ) {
      return;
    }

    /* =====================================================
       LENIS
       ===================================================== */

    const lenis =
      new Lenis({
        lerp:
          0.1,

        smoothWheel:
          true,
      });

    let raf =
      0;

    /* =====================================================
       ANIMATION LOOP
       ===================================================== */

    const loop = (
      time: number
    ) => {
      lenis.raf(
        time
      );

      raf =
        requestAnimationFrame(
          loop
        );
    };

    raf =
      requestAnimationFrame(
        loop
      );

    /* =====================================================
       SMOOTH INTERNAL ANCHOR LINKS

       Examples:
       #products
       #builds
       #contact
       ===================================================== */

    const onClick = (
      event: MouseEvent
    ) => {
      const anchor =
        (
          event.target as HTMLElement
        ).closest?.(
          'a[href^="#"]'
        ) as
          | HTMLAnchorElement
          | null;

      if (!anchor) {
        return;
      }

      const href =
        anchor.getAttribute(
          "href"
        );

      if (
        !href ||
        href.length <
          2
      ) {
        return;
      }

      const target =
        document.querySelector(
          href
        );

      if (!target) {
        return;
      }

      event.preventDefault();

      lenis.scrollTo(
        target as HTMLElement,
        {
          offset:
            -70,
        }
      );
    };

    document.addEventListener(
      "click",
      onClick
    );

    /* =====================================================
       CLEANUP
       ===================================================== */

    return () => {
      cancelAnimationFrame(
        raf
      );

      document.removeEventListener(
        "click",
        onClick
      );

      lenis.destroy();
    };
  }, []);

  return null;
}
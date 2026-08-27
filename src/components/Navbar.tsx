"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Gamepad2, Menu, X, Zap } from "lucide-react";
import { navLinks } from "@/lib/data";
import { GlitchText, Magnetic } from "./ui";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("#home");

  /* =========================================================
     NAVBAR SCROLL STATE
     ========================================================= */

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 24);
    };

    onScroll();

    window.addEventListener("scroll", onScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  /* =========================================================
     ACTIVE SECTION DETECTION
     ========================================================= */

  useEffect(() => {
    const ids = navLinks.map((link) =>
      link.href.replace("#", "")
    );

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActive(`#${entry.target.id}`);
          }
        });
      },
      {
        rootMargin: "-45% 0px -50% 0px",
        threshold: 0,
      }
    );

    ids.forEach((id) => {
      const element = document.getElementById(id);

      if (element) {
        observer.observe(element);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  /* =========================================================
     MOBILE MENU BODY LOCK
     ========================================================= */

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      {/* =====================================================
          DESKTOP / TOP NAVBAR
          ===================================================== */}

      <motion.header
        initial={{
          y: -90,
          opacity: 0,
        }}
        animate={{
          y: 0,
          opacity: 1,
        }}
        transition={{
          duration: 0.7,
          ease: "easeOut",
        }}
        className={`
          fixed
          inset-x-0
          top-0
          z-50
          transition-all
          duration-300

          ${
            scrolled || open
              ? `
                border-b
                border-brand/10
                bg-white/90
                shadow-[0_14px_45px_-32px_rgba(23,49,96,0.45)]
                backdrop-blur-xl
              `
              : `
                border-b
                border-transparent
                bg-white/55
                backdrop-blur-md
              `
          }
        `}
      >
        <nav
          className="
            mx-auto
            flex
            h-16
            max-w-7xl
            items-center
            justify-between
            px-5
            md:h-20
            md:px-8
          "
        >
          {/* =================================================
              LOGO
              ================================================= */}

          <a
            href="#home"
            className="group flex items-center gap-2.5"
            aria-label="Gamex home"
          >
            <span
              className="
                grid
                h-9
                w-9
                place-items-center
                rounded-lg
                bg-brand
                text-white

                shadow-[0_10px_30px_-12px_rgba(23,49,96,0.65)]

                transition-all
                duration-300

                group-hover:scale-110
                group-hover:rotate-6
                group-hover:bg-brand-soft
              "
            >
              <Gamepad2 className="h-5 w-5" />
            </span>

            <GlitchText
              text="GAMEX"
              className="
                font-display
                text-xl
                font-extrabold
                tracking-widest
                text-brand-deep
              "
            />
          </a>

          {/* =================================================
              DESKTOP NAVIGATION
              ================================================= */}

          <ul className="hidden items-center gap-1 lg:flex">
            {navLinks.map((link) => {
              const isActive =
                active === link.href;

              return (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className={`
                      relative
                      block
                      rounded-md
                      px-3.5
                      py-2

                      text-sm
                      font-semibold
                      uppercase
                      tracking-wider

                      transition-colors
                      duration-300

                      ${
                        isActive
                          ? "text-brand"
                          : "text-slate-600 hover:text-brand-deep"
                      }
                    `}
                  >
                    {link.label}

                    {isActive ? (
                      <motion.span
                        layoutId="nav-active"
                        className="
                          absolute
                          inset-x-2
                          -bottom-0.5
                          h-0.5
                          rounded-full
                          bg-brand
                          shadow-[0_0_10px_rgba(23,49,96,0.35)]
                        "
                      />
                    ) : null}
                  </a>
                </li>
              );
            })}
          </ul>

          {/* =================================================
              CTA + MOBILE BUTTON
              ================================================= */}

          <div className="flex items-center gap-3">
            <Magnetic
              strength={0.3}
              className="hidden sm:inline-block"
            >
              <a
                href="#contact"
                className="
                  cta-pulse
                  inline-flex
                  items-center
                  gap-2
                  rounded-lg

                  bg-brand
                  px-5
                  py-2.5

                  font-display
                  text-xs
                  font-bold
                  uppercase
                  tracking-widest
                  text-white

                  shadow-[0_12px_30px_-16px_rgba(23,49,96,0.65)]

                  transition-all
                  duration-300

                  hover:-translate-y-0.5
                  hover:bg-brand-soft
                  hover:shadow-[0_16px_38px_-16px_rgba(23,49,96,0.7)]
                "
              >
                <Zap className="h-4 w-4" />

                Build Your Rig
              </a>
            </Magnetic>

            <button
              type="button"
              onClick={() =>
                setOpen((value) => !value)
              }
              className="
                grid
                h-10
                w-10
                place-items-center

                rounded-lg

                border
                border-brand/15

                bg-white/80
                text-brand-deep

                shadow-sm

                transition-all
                duration-300

                hover:border-brand/40
                hover:bg-brand/[0.06]
                hover:text-brand

                lg:hidden
              "
              aria-label={
                open
                  ? "Close navigation menu"
                  : "Open navigation menu"
              }
              aria-expanded={open}
              aria-controls="mobile-navigation"
            >
              {open ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </nav>
      </motion.header>

      {/* =====================================================
          MOBILE MENU
          ===================================================== */}

      <AnimatePresence>
        {open ? (
          <motion.div
            id="mobile-navigation"
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            exit={{
              opacity: 0,
            }}
            transition={{
              duration: 0.3,
            }}
            className="
              fixed
              inset-0
              z-40

              overflow-hidden

              bg-white/96
              backdrop-blur-2xl

              lg:hidden
            "
          >
            {/* Background grid */}
            <div
              className="
                bg-grid
                pointer-events-none
                absolute
                inset-0
                opacity-50
              "
            />

            {/* Top ambient glow */}
            <div
              className="
                pointer-events-none
                absolute
                -left-24
                top-12
                h-72
                w-72
                rounded-full
                bg-brand/[0.08]
                blur-[100px]
              "
            />

            {/* Bottom ambient glow */}
            <div
              className="
                pointer-events-none
                absolute
                -right-24
                bottom-10
                h-80
                w-80
                rounded-full
                bg-brand-soft/[0.07]
                blur-[110px]
              "
            />

            <div
              className="
                relative
                z-10
                flex
                h-full
                flex-col
                items-center
                justify-center
                gap-3
                px-8
              "
            >
              {navLinks.map(
                (link, index) => {
                  const isActive =
                    active === link.href;

                  return (
                    <motion.a
                      key={link.href}
                      href={link.href}
                      onClick={() =>
                        setOpen(false)
                      }
                      initial={{
                        opacity: 0,
                        y: 24,
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                      }}
                      exit={{
                        opacity: 0,
                        y: -12,
                      }}
                      transition={{
                        delay:
                          0.08 * index +
                          0.08,
                        duration: 0.4,
                        ease: "easeOut",
                      }}
                      className={`
                        relative
                        py-2

                        font-display
                        text-3xl
                        font-extrabold
                        uppercase
                        tracking-wider

                        transition-colors
                        duration-300

                        ${
                          isActive
                            ? "text-brand"
                            : "text-brand-deep hover:text-brand"
                        }
                      `}
                    >
                      {link.label}

                      {isActive ? (
                        <span
                          className="
                            absolute
                            -bottom-0.5
                            left-1/2
                            h-0.5
                            w-8
                            -translate-x-1/2
                            rounded-full
                            bg-brand
                          "
                        />
                      ) : null}
                    </motion.a>
                  );
                }
              )}

              {/* Mobile CTA */}

              <motion.a
                href="#contact"
                onClick={() =>
                  setOpen(false)
                }
                initial={{
                  opacity: 0,
                  y: 24,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                exit={{
                  opacity: 0,
                }}
                transition={{
                  delay: 0.6,
                  duration: 0.4,
                }}
                className="
                  cta-pulse
                  mt-8
                  inline-flex
                  items-center
                  gap-2

                  rounded-lg

                  bg-brand
                  px-8
                  py-3.5

                  font-display
                  text-sm
                  font-bold
                  uppercase
                  tracking-widest
                  text-white

                  shadow-[0_14px_34px_-16px_rgba(23,49,96,0.7)]

                  transition-all
                  duration-300

                  hover:bg-brand-soft
                "
              >
                <Zap className="h-4 w-4" />

                Build Your Rig
              </motion.a>

              {/* Decorative line */}
              <motion.div
                initial={{
                  opacity: 0,
                }}
                animate={{
                  opacity: 1,
                }}
                transition={{
                  delay: 0.72,
                  duration: 0.4,
                }}
                className="
                  mt-7
                  h-px
                  w-24
                  bg-gradient-to-r
                  from-transparent
                  via-brand/25
                  to-transparent
                "
              />
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
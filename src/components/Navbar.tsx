"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  AnimatePresence,
  motion,
} from "framer-motion";

import {
  Gamepad2,
  Menu,
  X,
  Zap,
} from "lucide-react";

import {
  GlitchText,
  Magnetic,
} from "./ui";

/* =========================================================
   TYPES
   ========================================================= */

export type NavbarSettingsContent = {
  brandText: string;
  brandHref: string;

  logoImage: string;
  logoAlt: string;

  ctaText: string;
  ctaHref: string;
  ctaVisible: boolean;

  isVisible: boolean;
};

export type PublicNavbarLink = {
  id:
    | number
    | string;

  label: string;
  href: string;
};

/* =========================================================
   ORIGINAL NAVBAR DEFAULTS
   ========================================================= */

export const DEFAULT_NAVBAR_SETTINGS: NavbarSettingsContent = {
  brandText:
    "GAMEX",

  brandHref:
    "#home",

  logoImage:
    "",

  logoAlt:
    "Gamex",

  ctaText:
    "Build Your Rig",

  ctaHref:
    "#contact",

  ctaVisible:
    true,

  isVisible:
    true,
};

/* =========================================================
   ORIGINAL NAVIGATION LINKS
   ========================================================= */

export const DEFAULT_NAVBAR_LINKS: PublicNavbarLink[] = [
  {
    id:
      "default-home",

    label:
      "Home",

    href:
      "#home",
  },

  {
    id:
      "default-products",

    label:
      "Products",

    href:
      "#products",
  },

  {
    id:
      "default-builds",

    label:
      "Custom Builds",

    href:
      "#builds",
  },

  {
    id:
      "default-features",

    label:
      "Why Gamex",

    href:
      "#features",
  },

  {
    id:
      "default-blog",

    label:
      "Blog",

    href:
      "#blog",
  },

  {
    id:
      "default-contact",

    label:
      "Contact",

    href:
      "#contact",
  },
];

/* =========================================================
   EXTERNAL LINK CHECK
   ========================================================= */

function isExternalLink(
  href: string
) {
  return (
    href.startsWith(
      "https://"
    ) ||
    href.startsWith(
      "http://"
    )
  );
}

/* =========================================================
   NAVBAR
   ========================================================= */

export function Navbar({
  settings =
    DEFAULT_NAVBAR_SETTINGS,

  links =
    DEFAULT_NAVBAR_LINKS,
}: {
  settings?: NavbarSettingsContent;

  links?: PublicNavbarLink[];
}) {
  /* =======================================================
     STATE
     ======================================================= */

  const [
    scrolled,
    setScrolled,
  ] = useState(false);

  const [
    open,
    setOpen,
  ] = useState(false);

  const [
    active,
    setActive,
  ] = useState(
    "#home"
  );

  /* =======================================================
     SCROLL EFFECT
     ======================================================= */

  useEffect(() => {
    const onScroll =
      () => {
        setScrolled(
          window.scrollY >
            24
        );
      };

    onScroll();

    window.addEventListener(
      "scroll",
      onScroll,
      {
        passive:
          true,
      }
    );

    return () => {
      window.removeEventListener(
        "scroll",
        onScroll
      );
    };
  }, []);

  /* =======================================================
     ACTIVE SECTION OBSERVER
     ======================================================= */

  useEffect(() => {
    const ids =
      links
        .filter(
          (link) =>
            link.href.startsWith(
              "#"
            )
        )
        .map(
          (link) =>
            link.href.replace(
              "#",
              ""
            )
        )
        .filter(
          Boolean
        );

    if (
      ids.length ===
      0
    ) {
      return;
    }

    const observer =
      new IntersectionObserver(
        (
          entries
        ) => {
          entries.forEach(
            (
              entry
            ) => {
              if (
                entry.isIntersecting
              ) {
                setActive(
                  `#${entry.target.id}`
                );
              }
            }
          );
        },
        {
          rootMargin:
            "-45% 0px -50% 0px",

          threshold:
            0,
        }
      );

    ids.forEach(
      (
        id
      ) => {
        const element =
          document.getElementById(
            id
          );

        if (
          element
        ) {
          observer.observe(
            element
          );
        }
      }
    );

    return () => {
      observer.disconnect();
    };
  }, [links]);

  /* =======================================================
     MOBILE MENU BODY LOCK
     ======================================================= */

  useEffect(() => {
    document.body.style.overflow =
      open
        ? "hidden"
        : "";

    return () => {
      document.body.style.overflow =
        "";
    };
  }, [open]);

  /* =======================================================
     NAVBAR VISIBILITY

     Keep this AFTER hooks.
     ======================================================= */

  if (
    !settings.isVisible
  ) {
    return null;
  }

  /* =======================================================
     RENDER
     ======================================================= */

  return (
    <>
      {/* =====================================================
          TOP NAVBAR
          ===================================================== */}

      <motion.header
        initial={{
          y:
            -90,

          opacity:
            0,
        }}
        animate={{
          y:
            0,

          opacity:
            1,
        }}
        transition={{
          duration:
            0.7,

          ease:
            "easeOut",
        }}
        className={`
          fixed
          inset-x-0
          top-0
          z-50
          transition-colors
          duration-300

          ${
            scrolled ||
            open
              ? "border-b border-brand/10 bg-white/90 shadow-[0_12px_40px_-28px_rgba(23,49,96,0.35)] backdrop-blur-xl"
              : "border-b border-transparent bg-transparent"
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
            gap-4
            px-5
            md:h-20
            md:px-8
          "
        >
          {/* =================================================
              BRAND
              ================================================= */}

          <a
            href={
              settings.brandHref
            }
            aria-label={
              settings.logoAlt ||
              settings.brandText ||
              "Gamex"
            }
            className="
              group
              flex
              min-w-0
              shrink-0
              items-center
            "
          >
            {/* ===============================================
                CUSTOM HORIZONTAL LOGO
                =============================================== */}

            {settings.logoImage ? (
              // Admin-controlled URL.
              // Normal img avoids remote Next/Image
              // hostname configuration.
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={
                  settings.logoImage
                }
                alt={
                  settings.logoAlt ||
                  "Gamex"
                }
                className="
                  h-9
                  w-auto
                  max-w-[140px]
                  object-contain
                  object-left
                  transition-transform
                  duration-300

                  group-hover:scale-[1.03]

                  sm:h-10
                  sm:max-w-[160px]

                  md:h-11
                  md:max-w-[185px]

                  xl:h-12
                  xl:max-w-[205px]
                "
              />
            ) : (
              /* =============================================
                 FALLBACK:
                 OLD GAMEPAD + BRAND TEXT
                 ============================================= */

              <div
                className="
                  flex
                  items-center
                  gap-2.5
                "
              >
                <span
                  className="
                    grid
                    h-9
                    w-9
                    shrink-0
                    place-items-center
                    rounded-lg
                    bg-brand
                    text-white
                    shadow-[0_0_22px_rgba(23,49,96,0.28)]
                    transition-transform
                    duration-300
                    group-hover:scale-110
                    group-hover:rotate-6
                  "
                >
                  <Gamepad2
                    className="
                      h-5
                      w-5
                    "
                  />
                </span>

                <GlitchText
                  text={
                    settings.brandText
                  }
                  className="
                    font-display
                    text-xl
                    font-extrabold
                    tracking-widest
                    text-brand-deep
                  "
                />
              </div>
            )}
          </a>

          {/* =================================================
              DESKTOP NAVIGATION LINKS
              ================================================= */}

          <ul
            className="
              hidden
              min-w-0
              items-center
              gap-0.5
              lg:flex
              xl:gap-1
            "
          >
            {links.map(
              (
                link
              ) => {
                const isActive =
                  active ===
                  link.href;

                const external =
                  isExternalLink(
                    link.href
                  );

                return (
                  <li
                    key={
                      link.id
                    }
                  >
                    <a
                      href={
                        link.href
                      }
                      target={
                        external
                          ? "_blank"
                          : undefined
                      }
                      rel={
                        external
                          ? "noopener noreferrer"
                          : undefined
                      }
                      className={`
                        relative
                        block
                        rounded-md
                        px-2.5
                        py-2
                        text-xs
                        font-semibold
                        uppercase
                        tracking-wider
                        transition-colors

                        xl:px-3.5
                        xl:text-sm

                        ${
                          isActive
                            ? "text-brand"
                            : "text-slate-600 hover:text-brand"
                        }
                      `}
                    >
                      {
                        link.label
                      }

                      {/* =====================================
                          ACTIVE SECTION LINE
                          ===================================== */}

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
                            shadow-[0_0_10px_rgba(23,49,96,0.45)]
                          "
                        />
                      ) : null}
                    </a>
                  </li>
                );
              }
            )}
          </ul>

          {/* =================================================
              RIGHT SIDE
              ================================================= */}

          <div
            className="
              flex
              shrink-0
              items-center
              gap-3
            "
          >
            {/* ===============================================
                DESKTOP CTA
                =============================================== */}

            {settings.ctaVisible ? (
              <Magnetic
                strength={
                  0.3
                }
                className="
                  hidden
                  sm:inline-block
                "
              >
                <a
                  href={
                    settings.ctaHref
                  }
                  target={
                    isExternalLink(
                      settings.ctaHref
                    )
                      ? "_blank"
                      : undefined
                  }
                  rel={
                    isExternalLink(
                      settings.ctaHref
                    )
                      ? "noopener noreferrer"
                      : undefined
                  }
                  className="
                    cta-pulse
                    inline-flex
                    items-center
                    gap-2
                    rounded-lg
                    bg-brand
                    px-4
                    py-2.5
                    font-display
                    text-[10px]
                    font-bold
                    uppercase
                    tracking-widest
                    text-white
                    transition-all
                    duration-300
                    hover:bg-brand-soft

                    md:px-5
                    md:text-xs
                  "
                >
                  <Zap
                    className="
                      h-4
                      w-4
                    "
                  />

                  {
                    settings.ctaText
                  }
                </a>
              </Magnetic>
            ) : null}

            {/* ===============================================
                MOBILE MENU BUTTON
                =============================================== */}

            <button
              type="button"
              onClick={() =>
                setOpen(
                  (
                    value
                  ) =>
                    !value
                )
              }
              className="
                grid
                h-10
                w-10
                place-items-center
                rounded-lg
                border
                border-brand/20
                bg-white/80
                text-brand
                transition-colors
                hover:border-brand/50
                lg:hidden
              "
              aria-label={
                open
                  ? "Close menu"
                  : "Open menu"
              }
              aria-expanded={
                open
              }
            >
              {open ? (
                <X
                  className="
                    h-5
                    w-5
                  "
                />
              ) : (
                <Menu
                  className="
                    h-5
                    w-5
                  "
                />
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
            initial={{
              opacity:
                0,
            }}
            animate={{
              opacity:
                1,
            }}
            exit={{
              opacity:
                0,
            }}
            transition={{
              duration:
                0.3,
            }}
            className="
              fixed
              inset-0
              z-40
              bg-white/95
              backdrop-blur-xl
              lg:hidden
            "
          >
            <div
              className="
                flex
                h-full
                flex-col
                items-center
                justify-center
                gap-3
                px-8
                pt-16
              "
            >
              {/* =============================================
                  MOBILE BRAND
                  ============================================= */}

              {settings.logoImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={
                    settings.logoImage
                  }
                  alt={
                    settings.logoAlt ||
                    "Gamex"
                  }
                  className="
                    mb-7
                    h-auto
                    w-[170px]
                    object-contain
                  "
                />
              ) : (
                <div
                  className="
                    mb-7
                    flex
                    items-center
                    gap-3
                  "
                >
                  <span
                    className="
                      grid
                      h-10
                      w-10
                      place-items-center
                      rounded-xl
                      bg-brand
                      text-white
                    "
                  >
                    <Gamepad2
                      className="
                        h-5
                        w-5
                      "
                    />
                  </span>

                  <GlitchText
                    text={
                      settings.brandText
                    }
                    className="
                      font-display
                      text-2xl
                      font-extrabold
                      tracking-widest
                      text-brand-deep
                    "
                  />
                </div>
              )}

              {/* =============================================
                  MOBILE LINKS
                  ============================================= */}

              {links.map(
                (
                  link,
                  index
                ) => {
                  const external =
                    isExternalLink(
                      link.href
                    );

                  return (
                    <motion.a
                      key={
                        link.id
                      }
                      href={
                        link.href
                      }
                      target={
                        external
                          ? "_blank"
                          : undefined
                      }
                      rel={
                        external
                          ? "noopener noreferrer"
                          : undefined
                      }
                      onClick={() =>
                        setOpen(
                          false
                        )
                      }
                      initial={{
                        opacity:
                          0,

                        y:
                          24,
                      }}
                      animate={{
                        opacity:
                          1,

                        y:
                          0,
                      }}
                      exit={{
                        opacity:
                          0,

                        y:
                          -12,
                      }}
                      transition={{
                        delay:
                          0.08 *
                            index +
                          0.08,

                        duration:
                          0.4,

                        ease:
                          "easeOut",
                      }}
                      className="
                        font-display
                        text-2xl
                        font-extrabold
                        uppercase
                        tracking-wider
                        text-brand-deep
                        transition-colors
                        hover:text-brand

                        sm:text-3xl
                      "
                    >
                      {
                        link.label
                      }
                    </motion.a>
                  );
                }
              )}

              {/* =============================================
                  MOBILE CTA
                  ============================================= */}

              {settings.ctaVisible ? (
                <motion.a
                  href={
                    settings.ctaHref
                  }
                  target={
                    isExternalLink(
                      settings.ctaHref
                    )
                      ? "_blank"
                      : undefined
                  }
                  rel={
                    isExternalLink(
                      settings.ctaHref
                    )
                      ? "noopener noreferrer"
                      : undefined
                  }
                  onClick={() =>
                    setOpen(
                      false
                    )
                  }
                  initial={{
                    opacity:
                      0,

                    y:
                      24,
                  }}
                  animate={{
                    opacity:
                      1,

                    y:
                      0,
                  }}
                  exit={{
                    opacity:
                      0,
                  }}
                  transition={{
                    delay:
                      Math.min(
                        0.08 *
                          links.length +
                          0.12,
                        0.65
                      ),

                    duration:
                      0.4,
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
                  "
                >
                  <Zap
                    className="
                      h-4
                      w-4
                    "
                  />

                  {
                    settings.ctaText
                  }
                </motion.a>
              ) : null}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
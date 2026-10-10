"use client";



import {

  useEffect,

  useRef,

  useState,

} from "react";



import {

  AnimatePresence,

  motion,

} from "framer-motion";



import {

  Menu,

  Search,

  X,

  Zap,

} from "lucide-react";



import gamexLogo from "@/app/logo.png";



import {

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

   DEFAULT NAVBAR SETTINGS

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

   DEFAULT NAVIGATION LINKS

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



  const [searchOpen, setSearchOpen] = useState(false);

  const searchContainerRef = useRef<HTMLDivElement>(null);

  const searchInputRef = useRef<HTMLInputElement>(null);

  const searchButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {

    if (!searchOpen) return;

    searchInputRef.current?.focus({ preventScroll: true });

    const closeOnOutsideClick = (event: PointerEvent) => {

      if (event.target instanceof Node && !searchContainerRef.current?.contains(event.target)) {

        setSearchOpen(false);

      }

    };

    const closeOnEscape = (event: KeyboardEvent) => {

      if (event.key === "Escape") {

        setSearchOpen(false);

        searchButtonRef.current?.focus({ preventScroll: true });

      }

    };

    document.addEventListener("pointerdown", closeOnOutsideClick);

    document.addEventListener("keydown", closeOnEscape);

    return () => {

      document.removeEventListener("pointerdown", closeOnOutsideClick);

      document.removeEventListener("keydown", closeOnEscape);

    };

  }, [searchOpen]);

  /* =======================================================

     LOGO



     Admin logo has priority.



     If there is no logo stored in Admin,

     automatically use:



     src/app/logo.png

     ======================================================= */



  const logoSrc =

    settings.logoImage?.trim()

      ? settings.logoImage

      : gamexLogo.src;



  /* =======================================================

     SCROLL EFFECT

     ======================================================= */



  useEffect(() => {

    const onScroll =

      () => {

        setScrolled(

          window.scrollY >

            20

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

        .filter(Boolean);



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

      (id) => {

        const element =

          document.getElementById(

            id

          );



        if (element) {

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

     CLOSE MOBILE MENU WITH ESC

     ======================================================= */



  useEffect(() => {

    if (!open) {

      return;

    }



    const onKeyDown =

      (

        event: KeyboardEvent

      ) => {

        if (

          event.key ===

          "Escape"

        ) {

          setOpen(

            false

          );

        }

      };



    document.addEventListener(

      "keydown",

      onKeyDown

    );



    return () => {

      document.removeEventListener(

        "keydown",

        onKeyDown

      );

    };

  }, [open]);



  /* =======================================================

     VISIBILITY

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

          NAVBAR

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

            0.65,



          ease:

            "easeOut",

        }}

        className={`

          fixed

          inset-x-0

          top-0

          z-50



          border-b



          transition-all

          duration-300



          ${

            scrolled ||

            open

              ? `

                border-brand/15

                bg-white/95

                shadow-[0_12px_45px_-26px_rgba(230,0,0,0.25)]

                backdrop-blur-xl

              `

              : `

                border-black/[0.06]

                bg-white/90

                backdrop-blur-md

              `

          }

        `}

      >

        {/* ===================================================

            RED TOP ACCENT

            =================================================== */}



        <div

          className={`

            absolute

            inset-x-0

            top-0



            h-[2px]



            bg-gradient-to-r



            from-transparent

            via-brand

            to-transparent



            transition-opacity

            duration-300



            ${

              scrolled

                ? "opacity-100"

                : "opacity-60"

            }

          `}

        />



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

              LOGO

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



              relative



              flex

              min-w-0

              shrink-0



              items-center

            "

          >

            {/* eslint-disable-next-line @next/next/no-img-element */}



            <img

              src={

                logoSrc

              }

              alt={

                settings.logoAlt ||

                "Gamex"

              }

              className="

                h-9

                w-auto

                max-w-[145px]



                object-contain

                object-left



                transition-all

                duration-300



                group-hover:scale-[1.04]



                sm:h-10

                sm:max-w-[165px]



                md:h-11

                md:max-w-[190px]



                xl:h-12

                xl:max-w-[210px]

              "

            />



            {/* ===============================================

                LOGO HOVER GLOW

                =============================================== */}



            <span

              aria-hidden="true"

              className="

                pointer-events-none



                absolute

                inset-x-[10%]

                -bottom-2



                h-3



                rounded-full



                bg-brand/20



                opacity-0

                blur-xl



                transition-opacity

                duration-300



                group-hover:opacity-100

              "

            />

          </a>



          {/* =================================================

              DESKTOP LINKS

              ================================================= */}



          <ul

            className="

              hidden



              min-w-0



              items-center



              gap-0.5



              xl:flex



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

                        group/nav



                        relative



                        block



                        rounded-lg



                        px-2.5

                        py-2



                        text-xs



                        font-bold



                        uppercase



                        tracking-wider



                        transition-all

                        duration-300



                        xl:px-3.5

                        xl:text-sm



                        ${

                          isActive

                            ? `

                              bg-brand/[0.06]

                              text-brand

                            `

                            : `

                              text-[#2b2b2b]



                              hover:bg-brand/[0.04]

                              hover:text-brand

                            `

                        }

                      `}

                    >

                      {

                        link.label

                      }



                      {/* =====================================

                          ACTIVE LINE

                          ===================================== */}



                      {isActive ? (

                        <motion.span

                          layoutId="nav-active"

                          className="

                            absolute



                            inset-x-2



                            -bottom-0.5



                            h-[2px]



                            rounded-full



                            bg-brand



                            shadow-[0_0_12px_rgba(230,0,0,0.45)]

                          "

                        />

                      ) : (

                        <span

                          className="

                            absolute



                            inset-x-1/2



                            -bottom-0.5



                            h-[2px]



                            rounded-full



                            bg-brand



                            opacity-0



                            transition-all

                            duration-300



                            group-hover/nav:inset-x-2

                            group-hover/nav:opacity-100

                          "

                        />

                      )}

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

            <div ref={searchContainerRef}>

              <button

                ref={searchButtonRef}

                type="button"

                aria-label={searchOpen ? "Close website search" : "Search website"}

                aria-expanded={searchOpen}

                aria-controls="navbar-search-panel"

                onClick={() => {

                  setOpen(false);

                  setSearchOpen((value) => !value);

                }}

                className="grid h-10 w-10 place-items-center rounded-lg border border-brand/20 bg-white text-brand transition-colors hover:bg-red-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"

              >

                <Search className="h-5 w-5" />

              </button>

              {searchOpen && (

                <div

                  id="navbar-search-panel"

                  role="search"

                  className="absolute inset-x-3 top-full mt-3 rounded-2xl border border-red-100 bg-white p-4 font-sans shadow-xl sm:inset-x-auto sm:right-5 sm:w-[min(440px,calc(100vw-2.5rem))] md:right-8"

                >

                  <div className="mb-3 flex items-center justify-between gap-3">

                    <label htmlFor="navbar-search-input" className="text-sm font-semibold text-slate-900">

                      Search GameX

                    </label>

                    <button

                      type="button"

                      aria-label="Close search"

                      onClick={() => {

                        setSearchOpen(false);

                        searchButtonRef.current?.focus({ preventScroll: true });

                      }}

                      className="grid h-9 w-9 place-items-center rounded-lg text-slate-500 hover:bg-slate-100"

                    >

                      <X className="h-4 w-4" />

                    </button>

                  </div>

                  <form action="/search" method="get" className="flex min-w-0 gap-2">

                    <input

                      ref={searchInputRef}

                      id="navbar-search-input"

                      name="q"

                      type="search"

                      required

                      maxLength={100}

                      placeholder="Products, builds, articles…"

                      className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-base text-slate-900 outline-none focus:border-brand focus:ring-2 focus:ring-red-100"

                    />

                    <button type="submit" className="shrink-0 rounded-xl bg-brand px-4 py-3 text-sm font-semibold text-white hover:bg-red-700">

                      Search

                    </button>

                  </form>

                  <p className="mt-3 text-xs leading-5 text-slate-500">

                    Find products, custom builds, categories and blog articles.

                  </p>

                </div>

              )}

            </div>

            {/* ===============================================

                CTA

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

                    group/cta



                    relative



                    inline-flex



                    items-center



                    gap-2



                    overflow-hidden



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



                    shadow-[0_12px_32px_-16px_rgba(230,0,0,0.7)]



                    transition-all

                    duration-300



                    hover:-translate-y-0.5



                    hover:bg-[#c80000]



                    hover:shadow-[0_18px_38px_-16px_rgba(230,0,0,0.8)]



                    md:px-5

                    md:text-xs

                  "

                >

                  {/* =========================================

                      CTA SHINE

                      ========================================= */}



                  <span

                    aria-hidden="true"

                    className="

                      absolute



                      -left-10

                      top-0



                      h-full

                      w-8



                      -skew-x-12



                      bg-white/25



                      transition-all

                      duration-700



                      group-hover/cta:left-[120%]

                    "

                  />



                  <Zap

                    className="

                      relative



                      h-4

                      w-4

                    "

                  />



                  <span className="relative">

                    {

                      settings.ctaText

                    }

                  </span>

                </a>

              </Magnetic>

            ) : null}



            {/* ===============================================

                MOBILE BUTTON

                =============================================== */}



            <button

              type="button"

              onClick={() => {

                setSearchOpen(false);

                setOpen(

                  (

                    value

                  ) =>

                    !value

                );

              }}

              className="

                grid



                h-10

                w-10



                place-items-center



                rounded-lg



                border

                border-brand/20



                bg-white



                text-brand



                shadow-[0_8px_24px_-16px_rgba(230,0,0,0.5)]



                transition-all

                duration-300



                hover:border-brand/50



                hover:bg-brand/[0.05]



                focus:outline-none

                focus:ring-4

                focus:ring-brand/10



                xl:hidden

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

                0.28,

            }}

            className="

              fixed

              inset-0

              z-40



              overflow-hidden



              bg-white/98



              backdrop-blur-xl



              xl:hidden

            "

          >

            {/* ===============================================

                MOBILE BACKGROUND DECORATION

                =============================================== */}



            <div

              aria-hidden="true"

              className="

                pointer-events-none



                absolute



                -right-28

                top-16



                h-72

                w-72



                rounded-full



                bg-brand/[0.08]



                blur-[90px]

              "

            />



            <div

              aria-hidden="true"

              className="

                pointer-events-none



                absolute



                -left-28

                bottom-10



                h-72

                w-72



                rounded-full



                bg-brand/[0.05]



                blur-[100px]

              "

            />



            <div

              aria-hidden="true"

              className="

                absolute



                inset-x-0

                top-0



                h-[2px]



                bg-gradient-to-r



                from-transparent

                via-brand

                to-transparent

              "

            />



            <div

              className="

                relative



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

                  MOBILE LOGO

                  ============================================= */}



              <motion.a

                href={

                  settings.brandHref

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

                    -16,

                }}

                animate={{

                  opacity:

                    1,



                  y:

                    0,

                }}

                transition={{

                  duration:

                    0.4,

                }}

                className="

                  mb-7

                "

              >

                {/* eslint-disable-next-line @next/next/no-img-element */}



                <img

                  src={

                    logoSrc

                  }

                  alt={

                    settings.logoAlt ||

                    "Gamex"

                  }

                  className="

                    h-auto

                    w-[180px]



                    object-contain

                  "

                />

              </motion.a>



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



                  const isActive =

                    active ===

                    link.href;



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

                          0.07 *

                            index +

                          0.06,



                        duration:

                          0.36,



                        ease:

                          "easeOut",

                      }}

                      className={`

                        relative



                        rounded-xl



                        px-5

                        py-2



                        font-display



                        text-2xl



                        font-extrabold



                        uppercase



                        tracking-wider



                        transition-all

                        duration-300



                        sm:text-3xl



                        ${

                          isActive

                            ? `

                              bg-brand/[0.06]

                              text-brand

                            `

                            : `

                              text-[#181818]

                              hover:text-brand

                            `

                        }

                      `}

                    >

                      {

                        link.label

                      }



                      {isActive ? (

                        <span

                          className="

                            absolute



                            left-1/2



                            -bottom-0.5



                            h-[2px]

                            w-10



                            -translate-x-1/2



                            rounded-full



                            bg-brand



                            shadow-[0_0_12px_rgba(230,0,0,0.4)]

                          "

                        />

                      ) : null}

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

                        0.07 *

                          links.length +

                          0.12,

                        0.62

                      ),



                    duration:

                      0.4,

                  }}

                  className="

                    mt-8



                    inline-flex



                    items-center



                    gap-2



                    rounded-xl



                    bg-brand



                    px-8

                    py-3.5



                    font-display



                    text-sm



                    font-bold



                    uppercase



                    tracking-widest



                    text-white



                    shadow-[0_14px_35px_-18px_rgba(230,0,0,0.75)]



                    transition-all



                    hover:bg-[#c80000]

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



              {/* =============================================

                  MOBILE DECORATIVE TEXT

                  ============================================= */}



              <motion.p

                initial={{

                  opacity:

                    0,

                }}

                animate={{

                  opacity:

                    1,

                }}

                transition={{

                  delay:

                    0.5,

                }}

                className="

                  mt-8



                  text-[9px]



                  font-bold



                  uppercase



                  tracking-[0.3em]



                  text-black/30

                "

              >

                Game • Build • Dominate

              </motion.p>

            </div>

          </motion.div>

        ) : null}

      </AnimatePresence>

    </>

  );

}
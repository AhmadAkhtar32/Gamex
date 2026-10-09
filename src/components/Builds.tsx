"use client";



import {

  useEffect,

  useState,

} from "react";



import Link from "next/link";



import {

  ArrowRight,

  Check,

  ChevronDown,

  ChevronUp,

  Images,

} from "lucide-react";



import {

  DetailsModal,

} from "@/components/DetailsModal";



import {

  formatPrice,

} from "@/lib/price";



import {

  SectionHeading,

} from "./ui";



import {

  BlurReveal,

  ScrollSkew,

} from "./fx";



/* =========================================================

   TYPES

   ========================================================= */



export type PublicBuild = {

  id: string;



  name: string;



  role: string;



  badge: string;



  price:

    | number

    | null;



  description: string;



  specs: string[];



  /*

   * Existing primary image.

   */

  image: string;



  /*

   * Optional additional images.

   */

  images?: string[];

};



/* =========================================================

   IMAGE HELPERS

   ========================================================= */



function getBuildImages(

  build: PublicBuild

) {

  const values = [

    build.image,

    ...(build.images ?? []),

  ]

    .map(

      (

        value

      ) =>

        value?.trim()

    )

    .filter(

      (

        value

      ): value is string =>

        Boolean(

          value

        )

    );



  return Array.from(

    new Set(

      values

    )

  );

}



/* =========================================================

   TWO ROW LIMIT

   ========================================================= */



function getBuildLimit() {

  if (

    typeof window ===

    "undefined"

  ) {

    return 6;

  }



  if (

    window.innerWidth >=

    1024

  ) {

    return 6;

  }



  if (

    window.innerWidth >=

    768

  ) {

    return 4;

  }



  return 2;

}



/* =========================================================

   BUILDS

   ========================================================= */



export function Builds({

  builds,

}: {

  builds: PublicBuild[];

}) {

  const [

    selectedBuild,

    setSelectedBuild,

  ] =

    useState<PublicBuild | null>(

      null

    );



  const [

    showAll,

    setShowAll,

  ] =

    useState(

      false

    );



  const [

    initialLimit,

    setInitialLimit,

  ] =

    useState(

      6

    );



  /* =======================================================

     RESPONSIVE LIMIT

     ======================================================= */



  useEffect(() => {

    const updateLimit =

      () => {

        setInitialLimit(

          getBuildLimit()

        );

      };



    updateLimit();



    window.addEventListener(

      "resize",

      updateLimit

    );



    return () => {

      window.removeEventListener(

        "resize",

        updateLimit

      );

    };

  }, []);



  const visibleBuilds =

    showAll

      ? builds

      : builds.slice(

          0,

          initialLimit

        );



  const canToggle =

    builds.length >

    initialLimit;



  /* =======================================================

     VIEW MORE / LESS

     ======================================================= */



  function toggleBuilds() {

    if (

      showAll

    ) {

      setShowAll(

        false

      );



      window.setTimeout(

        () => {

          document

            .getElementById(

              "builds"

            )

            ?.scrollIntoView({

              behavior:

                "smooth",



              block:

                "start",

            });

        },

        50

      );



      return;

    }



    setShowAll(

      true

    );

  }



  /* =======================================================

     RENDER

     ======================================================= */



  return (

    <>

      <section

        id="builds"

        className="

          relative

          overflow-hidden

          bg-[#fff8f8]

          py-14

          md:py-20

        "

      >

        {/* ===================================================

            BACKGROUND

            =================================================== */}



        <div

          aria-hidden="true"

          className="

            bg-grid

            grid-animated

            pointer-events-none

            absolute

            inset-0

            -z-10

            opacity-25

            [mask-image:radial-gradient(ellipse_68%_68%_at_50%_50%,black,transparent)]

          "

        />



        <div

          aria-hidden="true"

          className="

            pointer-events-none

            absolute

            -left-40

            top-1/3

            -z-10

            h-[28rem]

            w-[28rem]

            rounded-full

            bg-brand/[0.06]

            blur-[140px]

          "

        />



        {/* ===================================================

            CONTENT

            =================================================== */}



        <div

          className="

            relative

            mx-auto

            max-w-7xl

            px-5

            md:px-8

          "

        >

          <SectionHeading

            eyebrow="Custom Builds"

            title="Built for your playstyle"

            accent="your"

            subtitle="Signature gaming rigs, tuned and stress-tested for performance. Configure one of our systems or design your own from scratch."

          />



          {builds.length >

          0 ? (

            <>

              <ScrollSkew

                amount={

                  2

                }

                className="

                  mt-9

                  grid

                  gap-5

                  md:grid-cols-2

                  lg:grid-cols-3

                "

              >

                {visibleBuilds.map(

                  (

                    build,

                    index

                  ) => {

                    const buildImages =

                      getBuildImages(

                        build

                      );



                    const mainImage =

                      buildImages[0] ??

                      build.image;



                    return (

                      <BlurReveal

                        key={

                          build.id

                        }

                        delay={

                          index *

                          0.06

                        }

                        className="h-full min-w-0"

                      >

                        <div

                          role="button"

                          tabIndex={

                            0

                          }

                          aria-label={`View details for ${build.name}`}

                          onClick={() =>

                            setSelectedBuild(

                              build

                            )

                          }

                          onKeyDown={(

                            event

                          ) => {

                            if (event.target !== event.currentTarget) {

                              return;

                            }

                            if (

                              event.key ===

                                "Enter" ||

                              event.key ===

                                " "

                            ) {

                              event.preventDefault();



                              setSelectedBuild(

                                build

                              );

                            }

                          }}

                          className="

                            h-full

                            min-w-0

                            cursor-pointer

                            rounded-2xl

                            focus:outline-none

                            focus-visible:ring-4

                            focus-visible:ring-brand/15

                          "

                        >

                          <div

                            className="

                              group

                              flex

                              h-full

                              min-w-0

                              flex-col

                              overflow-hidden

                              rounded-2xl

                              border

                              border-black/[0.07]

                              bg-white

                              shadow-[0_20px_55px_-38px_rgba(0,0,0,0.28)]

                              transition-all

                              duration-300

                              hover:-translate-y-1

                            "

                          >

                            {/* =================================

                                IMAGE

                                ================================= */}



                            <div

                              className="

                                relative

                                aspect-[4/3]

                                overflow-hidden

                                border-b

                                border-black/[0.05]

                                bg-[#f4f4f4]

                              "

                            >

                              {/* eslint-disable-next-line @next/next/no-img-element */}



                              <img

                                src={

                                  mainImage

                                }

                                alt={`${build.name} custom gaming PC build at GameX Pakistan`}

                                loading="lazy"

                                className="

                                  absolute

                                  inset-0

                                  h-full

                                  w-full

                                  object-cover

                                  object-center

                                  transition-transform

                                  duration-500

                                  ease-out

                                  group-hover:scale-[1.045]

                                "

                              />



                              <div

                                aria-hidden="true"

                                className="

                                  pointer-events-none

                                  absolute

                                  inset-0

                                  bg-gradient-to-t

                                  from-brand/[0.055]

                                  via-transparent

                                  to-transparent

                                "

                              />



                              <div

                                aria-hidden="true"

                                className="

                                  pointer-events-none

                                  absolute

                                  inset-0

                                  ring-1

                                  ring-inset

                                  ring-black/[0.025]

                                "

                              />



                              {/* BADGE */}



                              <span

                                className="

                                  absolute

                                  left-3

                                  top-3

                                  z-20

                                  rounded-full

                                  border

                                  border-brand/20

                                  bg-white/95

                                  px-3

                                  py-1.5

                                  text-[10px]

                                  font-extrabold

                                  uppercase

                                  tracking-wider

                                  text-brand

                                  shadow-[0_8px_22px_-16px_rgba(230,0,0,0.5)]

                                  backdrop-blur-md

                                "

                              >

                                {

                                  build.badge

                                }

                              </span>



                              {/* IMAGE COUNT */}



                              {buildImages.length >

                              1 ? (

                                <span

                                  className="

                                    absolute

                                    right-3

                                    top-3

                                    z-20

                                    inline-flex

                                    items-center

                                    gap-1.5

                                    rounded-full

                                    bg-black/70

                                    px-2.5

                                    py-1.5

                                    text-[9px]

                                    font-bold

                                    text-white

                                    backdrop-blur-md

                                  "

                                >

                                  <Images className="h-3 w-3" />



                                  {

                                    buildImages.length

                                  }

                                </span>

                              ) : null}

                            </div>



                            {/* =================================

                                CONTENT

                                ================================= */}



                            <div

                              className="

                                flex

                                flex-1

                                min-w-0

                                flex-col

                                p-5

                              "

                            >

                              <h3

                                className="

                                  font-display

                                  text-2xl

                                  font-extrabold

                                  leading-tight

                                  text-brand-deep

                                  transition-colors

                                "

                              >

                                {

                                  build.name

                                }

                              </h3>



                              <p

                                className="

                                  mt-1

                                  text-xs

                                  font-bold

                                  uppercase

                                  tracking-[0.16em]

                                  text-slate-500

                                "

                              >

                                {

                                  build.role

                                }

                              </p>



                              {/* =================================

                                  SMALLER PRICE BOX

                                  ================================= */}



                              <div

                                className="mt-3 w-full min-w-0 rounded-lg bg-brand px-3 py-2.5"

                              >

                                <p

                                  className="font-sans text-[10px] font-semibold leading-4 text-white/80"

                                >

                                  Starting Price

                                </p>



                                <p

                                  className="mt-0.5 break-words font-sans text-lg font-bold leading-6 tracking-tight text-white tabular-nums"

                                >

                                  {formatPrice(

                                    build.price

                                  )}

                                </p>

                              </div>



                              {/* DESCRIPTION */}



                              <p

                                className="

                                  mt-3

                                  line-clamp-3

                                  text-sm

                                  leading-relaxed

                                  text-slate-600

                                "

                              >

                                {

                                  build.description

                                }

                              </p>



                              {/* SPECS */}



                              <ul

                                className="

                                  mt-4

                                  space-y-2

                                  border-t

                                  border-black/[0.06]

                                  pt-3

                                "

                              >

                                {build.specs

                                  .slice(

                                    0,

                                    4

                                  )

                                  .map(

                                    (

                                      spec,

                                      specIndex

                                    ) => (

                                      <li

                                        key={`${build.id}-${specIndex}`}

                                        className="

                                          flex

                                          items-start

                                          gap-2

                                          text-xs

                                          leading-relaxed

                                          text-slate-600

                                        "

                                      >

                                        <span

                                          className="

                                            mt-0.5

                                            grid

                                            h-4

                                            w-4

                                            shrink-0

                                            place-items-center

                                            rounded-full

                                            bg-brand/[0.08]

                                            text-brand

                                          "

                                        >

                                          <Check className="h-2.5 w-2.5" />

                                        </span>



                                        <span

                                          className="

                                            min-w-0

                                            flex-1

                                          "

                                        >

                                          {

                                            spec

                                          }

                                        </span>

                                      </li>

                                    )

                                  )}

                              </ul>



                              {/* ACTIONS */}



                              <div

                                className="

                                  mt-auto

                                  grid

                                  gap-2

                                  pt-5

                                "

                              >

                                <button

                                  type="button"

                                  onClick={(

                                    event

                                  ) => {

                                    event.stopPropagation();



                                    setSelectedBuild(

                                      build

                                    );

                                  }}

                                  className="

                                    inline-flex

                                    w-full

                                    min-h-11

                                    min-w-0

                                    gap-2

                                    items-center

                                    justify-between

                                    rounded-xl

                                    border

                                    border-brand/15

                                    bg-[#fff8f8]

                                    px-4

                                    py-3

                                    text-xs

                                    leading-snug

                                    whitespace-normal

                                    text-left

                                    font-bold

                                    uppercase

                                    tracking-wider

                                    text-brand-deep

                                    transition-all

                                    hover:border-brand

                                    hover:bg-brand

                                    hover:text-white

                                  "

                                >

                                  View Details



                                  <ArrowRight className="h-4 w-4 shrink-0" />

                                </button>



                                <Link

                                  href={`/build/${build.id}`}

                                  onClick={(

                                    event

                                  ) => {

                                    event.stopPropagation();

                                  }}

                                  onKeyDown={(

                                    event

                                  ) => {

                                    event.stopPropagation();

                                  }}

                                  className="

                                    inline-flex

                                    w-full

                                    min-h-11

                                    min-w-0

                                    gap-2

                                    items-center

                                    justify-between

                                    rounded-xl

                                    bg-brand

                                    px-4

                                    py-3

                                    text-xs

                                    leading-snug

                                    whitespace-normal

                                    text-left

                                    font-bold

                                    uppercase

                                    tracking-wider

                                    text-white

                                    transition-all

                                    hover:-translate-y-0.5

                                    hover:bg-brand-soft

                                  "

                                >

                                  Build Page



                                  <ArrowRight className="h-4 w-4 shrink-0" />

                                </Link>

                              </div>

                            </div>

                          </div>

                        </div>

                      </BlurReveal>

                    );

                  }

                )}

              </ScrollSkew>



              {/* =============================================

                  VIEW MORE

                  ============================================= */}



              {canToggle ? (

                <div

                  className="

                    mt-9

                    flex

                    justify-center

                  "

                >

                  <button

                    type="button"

                    onClick={

                      toggleBuilds

                    }

                    className="

                      group

                      inline-flex

                      min-w-[175px]

                      items-center

                      justify-center

                      gap-2.5

                      rounded-xl

                      border

                      border-brand/20

                      bg-white

                      px-6

                      py-3.5

                      font-display

                      text-xs

                      font-bold

                      uppercase

                      tracking-[0.14em]

                      text-brand

                      shadow-[0_12px_32px_-22px_rgba(230,0,0,0.5)]

                      transition-all

                      duration-300

                      hover:-translate-y-0.5

                      hover:border-brand

                      hover:bg-brand

                      hover:text-white

                    "

                  >

                    {showAll

                      ? "Show Less"

                      : "View More"}



                    {showAll ? (

                      <ChevronUp className="h-4 w-4" />

                    ) : (

                      <ChevronDown className="h-4 w-4" />

                    )}

                  </button>

                </div>

              ) : null}

            </>

          ) : (

            /* ===============================================

               EMPTY

               =============================================== */



            <div

              className="

                mt-9

                rounded-2xl

                border

                border-dashed

                border-brand/20

                bg-white

                px-6

                py-14

                text-center

              "

            >

              <div

                className="

                  mx-auto

                  h-12

                  w-12

                  rounded-2xl

                  border

                  border-brand/15

                  bg-brand/[0.06]

                "

              />



              <h3

                className="

                  mt-4

                  font-display

                  text-xl

                  font-bold

                  uppercase

                  text-brand-deep

                "

              >

                Custom Builds Coming Soon

              </h3>

            </div>

          )}

        </div>

      </section>



      {/* =====================================================

          DETAILS MODAL

          ===================================================== */}



      <DetailsModal

        item={

          selectedBuild

            ? {

                kind:

                  "build",



                name:

                  selectedBuild.name,



                price:

                  selectedBuild.price,



                eyebrow:

                  "Custom Build",



                badge:

                  selectedBuild.badge,



                secondaryLabel:

                  selectedBuild.role,



                description:

                  selectedBuild.description,



                specs:

                  selectedBuild.specs,



                image:

                  selectedBuild.image,



                images:

                  getBuildImages(

                    selectedBuild

                  ),

              }

            : null

        }

        onClose={() =>

          setSelectedBuild(

            null

          )

        }

      />

    </>

  );

}
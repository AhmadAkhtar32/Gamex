"use client";

import {
  useState,
} from "react";

import {
  ArrowRight,
  Check,
} from "lucide-react";

import {
  DetailsModal,
} from "@/components/DetailsModal";

import {
  formatPrice,
} from "@/lib/price";

import {
  SectionHeading,
  SpotlightCard,
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

  image: string;
};

/* =========================================================
   BUILDS
   ========================================================= */

export function Builds({
  builds,
}: {
  builds: PublicBuild[];
}) {
  /* =======================================================
     SELECTED BUILD FOR POPUP
     ======================================================= */

  const [
    selectedBuild,
    setSelectedBuild,
  ] =
    useState<PublicBuild | null>(
      null
    );

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

          py-24

          md:py-32
        "
      >
        {/* =================================================
            BACKGROUND GRID
            ================================================= */}

        <div
          aria-hidden="true"
          className="
            bg-grid
            grid-animated

            pointer-events-none

            absolute
            inset-0

            -z-10

            opacity-35

            [mask-image:radial-gradient(ellipse_68%_68%_at_50%_50%,black,transparent)]
          "
        />

        {/* =================================================
            LEFT RED GLOW
            ================================================= */}

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

            bg-brand/[0.07]

            blur-[140px]
          "
        />

        {/* =================================================
            RIGHT RED GLOW
            ================================================= */}

        <div
          aria-hidden="true"
          className="
            pointer-events-none

            absolute

            -right-40
            bottom-0

            -z-10

            h-[30rem]
            w-[30rem]

            rounded-full

            bg-brand-soft/[0.055]

            blur-[150px]
          "
        />

        {/* =================================================
            TOP ACCENT
            ================================================= */}

        <div
          aria-hidden="true"
          className="
            pointer-events-none

            absolute

            left-1/2
            top-0

            h-px
            w-[78%]

            -translate-x-1/2

            bg-gradient-to-r

            from-transparent
            via-brand/15
            to-transparent
          "
        />

        {/* =================================================
            CONTENT
            ================================================= */}

        <div
          className="
            relative

            mx-auto

            max-w-7xl

            px-5

            md:px-8
          "
        >
          {/* =================================================
              SECTION HEADING
              ================================================= */}

          <SectionHeading
            eyebrow="Custom Builds"
            title="Built for your playstyle"
            accent="your"
            subtitle="Signature gaming rigs, tuned and stress-tested for performance. Configure one of our systems or design your own from scratch."
          />

          {/* =================================================
              BUILDS GRID
              ================================================= */}

          {builds.length >
          0 ? (
            <ScrollSkew
              amount={2}
              className="
                mt-14

                grid

                gap-6

                md:grid-cols-2

                lg:grid-cols-3
              "
            >
              {builds.map(
                (
                  build,
                  index
                ) => (
                  <BlurReveal
                    key={
                      build.id
                    }
                    delay={
                      index *
                      0.1
                    }
                    className="h-full"
                  >
                    {/* =======================================
                        CLICKABLE BUILD WRAPPER
                        ======================================= */}

                    <div
                      role="button"
                      tabIndex={0}
                      aria-label={`View details for ${build.name}`}
                      onClick={() =>
                        setSelectedBuild(
                          build
                        )
                      }
                      onKeyDown={(
                        event
                      ) => {
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

                        cursor-pointer

                        rounded-2xl

                        focus:outline-none

                        focus-visible:ring-4
                        focus-visible:ring-brand/15
                      "
                    >
                      {/* =====================================
                          BUILD CARD
                          ===================================== */}

                      <SpotlightCard
                        className="
                          group

                          flex
                          h-full

                          flex-col

                          overflow-hidden

                          rounded-2xl

                          border
                          border-black/[0.07]

                          bg-white

                          shadow-[0_20px_55px_-38px_rgba(0,0,0,0.28)]

                          transition-all

                          duration-300

                          hover:-translate-y-1.5

                          hover:border-brand/25

                          hover:shadow-[0_30px_70px_-38px_rgba(230,0,0,0.34)]
                        "
                      >
                        {/* ===================================
                            BUILD IMAGE
                            =================================== */}

                        <div
                          className="
                            relative

                            aspect-[4/3]

                            overflow-hidden

                            border-b
                            border-black/[0.05]

                            bg-[#fff7f7]
                          "
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}

                          <img
                            src={
                              build.image
                            }
                            alt={
                              build.name
                            }
                            loading="lazy"
                            className="
                              h-full
                              w-full

                              object-contain

                              p-4

                              transition-transform

                              duration-700

                              ease-out

                              group-hover:scale-[1.035]
                            "
                          />

                          {/* =================================
                              IMAGE RED GLOW
                              ================================= */}

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

                          {/* =================================
                              TOP RED LINE
                              ================================= */}

                          <div
                            aria-hidden="true"
                            className="
                              absolute

                              left-0
                              top-0

                              h-[3px]

                              w-0

                              bg-brand

                              transition-all

                              duration-500

                              group-hover:w-full
                            "
                          />

                          {/* =================================
                              BUILD BADGE
                              ================================= */}

                          <span
                            className="
                              absolute

                              left-4
                              top-4

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

                              shadow-[0_8px_20px_-14px_rgba(230,0,0,0.5)]

                              backdrop-blur-md
                            "
                          >
                            {
                              build.badge
                            }
                          </span>
                        </div>

                        {/* ===================================
                            BUILD INFORMATION
                            =================================== */}

                        <div
                          className="
                            flex

                            flex-1

                            flex-col

                            p-6
                          "
                        >
                          {/* =================================
                              BUILD NAME
                              ================================= */}

                          <h3
                            className="
                              font-display

                              text-2xl

                              font-extrabold

                              leading-tight

                              text-brand-deep

                              transition-colors

                              duration-300

                              group-hover:text-brand
                            "
                          >
                            {
                              build.name
                            }
                          </h3>

                          {/* =================================
                              BUILD ROLE
                              ================================= */}

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
                              PRICE BLOCK
                              ================================= */}

                          <div
                            className="
                              relative

                              mt-5

                              overflow-hidden

                              rounded-xl

                              bg-brand

                              px-4
                              py-3.5

                              shadow-[0_14px_32px_-18px_rgba(230,0,0,0.72)]
                            "
                          >
                            {/* DECORATIVE SHAPE */}

                            <div
                              aria-hidden="true"
                              className="
                                absolute

                                -right-8
                                -top-8

                                h-24
                                w-24

                                rotate-45

                                border

                                border-white/15
                              "
                            />

                            {/* RIGHT DETAIL */}

                            <div
                              aria-hidden="true"
                              className="
                                absolute

                                right-4
                                top-1/2

                                h-9
                                w-1

                                -translate-y-1/2

                                rounded-full

                                bg-white/15
                              "
                            />

                            <p
                              className="
                                relative

                                text-[9px]

                                font-extrabold

                                uppercase

                                tracking-[0.22em]

                                text-white/65
                              "
                            >
                              Starting Price
                            </p>

                            <p
                              className="
                                relative

                                mt-1

                                font-display

                                text-2xl

                                font-extrabold

                                leading-none

                                text-white
                              "
                            >
                              {formatPrice(
                                build.price
                              )}
                            </p>
                          </div>

                          {/* =================================
                              DESCRIPTION — 3 LINES ONLY
                              ================================= */}

                          <p
                            className="
                              mt-4

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

                          {/* =================================
                              SPECIFICATIONS
                              FIRST 4 ONLY
                              ================================= */}

                          <ul
                            className="
                              mt-5

                              space-y-2.5

                              border-t

                              border-black/[0.06]

                              pt-4
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

                                      gap-2.5

                                      text-sm

                                      font-medium

                                      text-slate-600
                                    "
                                  >
                                    <span
                                      className="
                                        mt-0.5

                                        grid

                                        h-5
                                        w-5

                                        shrink-0

                                        place-items-center

                                        rounded-full

                                        bg-brand/[0.08]

                                        text-brand
                                      "
                                    >
                                      <Check
                                        className="
                                          h-3
                                          w-3
                                        "
                                      />
                                    </span>

                                    <span>
                                      {
                                        spec
                                      }
                                    </span>
                                  </li>
                                )
                              )}
                          </ul>

                          {/* =================================
                              MORE SPECS NOTICE
                              ================================= */}

                          {build.specs.length >
                          4 ? (
                            <p
                              className="
                                mt-3

                                text-[10px]

                                font-bold

                                uppercase

                                tracking-wider

                                text-brand/70
                              "
                            >
                              +
                              {build.specs.length -
                                4}{" "}
                              more specifications
                            </p>
                          ) : null}

                          {/* =================================
                              VIEW DETAILS BUTTON
                              ================================= */}

                          <div
                            className="
                              mt-auto

                              pt-6
                            "
                          >
                            <span
                              className="
                                inline-flex

                                w-full

                                items-center

                                justify-between

                                gap-2

                                rounded-xl

                                border
                                border-black/[0.08]

                                bg-[#fff8f8]

                                px-4
                                py-3

                                font-display

                                text-xs

                                font-bold

                                uppercase

                                tracking-wider

                                text-brand-deep

                                transition-all

                                duration-300

                                group-hover:border-brand

                                group-hover:bg-brand

                                group-hover:text-white

                                group-hover:shadow-[0_10px_28px_-16px_rgba(230,0,0,0.6)]
                              "
                            >
                              View Build Details

                              <ArrowRight
                                className="
                                  h-4
                                  w-4

                                  transition-transform

                                  duration-300

                                  group-hover:translate-x-1
                                "
                              />
                            </span>
                          </div>
                        </div>
                      </SpotlightCard>
                    </div>
                  </BlurReveal>
                )
              )}
            </ScrollSkew>
          ) : (
            /* =================================================
               EMPTY STATE
               ================================================= */

            <div
              className="
                mt-14

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

                  h-1
                  w-14

                  rounded-full

                  bg-brand
                "
              />

              <h3
                className="
                  mt-5

                  font-display

                  text-xl

                  font-bold

                  uppercase

                  text-brand-deep
                "
              >
                Custom Builds Coming Soon
              </h3>

              <p
                className="
                  mt-2

                  text-sm

                  text-slate-500
                "
              >
                New Gamex custom systems are being prepared.
              </p>
            </div>
          )}
        </div>

        {/* =================================================
            BOTTOM RED LINE
            ================================================= */}

        <div
          aria-hidden="true"
          className="
            pointer-events-none

            absolute

            bottom-0
            left-1/2

            h-px
            w-[80%]

            -translate-x-1/2

            bg-gradient-to-r

            from-transparent
            via-brand/15
            to-transparent
          "
        />
      </section>

      {/* ===================================================
          BUILD DETAILS POPUP
          =================================================== */}

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
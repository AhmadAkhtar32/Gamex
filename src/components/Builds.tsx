"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  ArrowRight,
  Check,
  ChevronDown,
  ChevronUp,
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
   TWO ROW LIMIT

   Mobile = 1 column = 2 builds
   Tablet = 2 columns = 4 builds
   Desktop = 3 columns = 6 builds
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
    useState(false);

  const [
    initialLimit,
    setInitialLimit,
  ] =
    useState(6);

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

  function toggleBuilds() {
    if (showAll) {
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
        {/* BACKGROUND */}

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

          {/* =================================================
              BUILDS
              ================================================= */}

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
                  ) => (
                    <BlurReveal
                      key={
                        build.id
                      }
                      delay={
                        index *
                        0.06
                      }
                      className="h-full"
                    >
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

                            hover:-translate-y-1

                            hover:border-brand/25

                            hover:shadow-[0_26px_65px_-38px_rgba(230,0,0,0.34)]
                          "
                        >
                          {/* =================================
                              IMAGE

                              Full image remains visible.

                              Blurred background fills unused
                              space around portrait images.
                              ================================= */}

                          <div
                            className="
                              relative

                              aspect-[16/10]

                              overflow-hidden

                              border-b
                              border-black/[0.05]

                              bg-[#f5f5f5]
                            "
                          >
                            {/* BACKGROUND */}

                            {/* eslint-disable-next-line @next/next/no-img-element */}

                            <img
                              src={
                                build.image
                              }
                              alt=""
                              aria-hidden="true"
                              className="
                                absolute
                                inset-0

                                h-full
                                w-full

                                scale-110

                                object-cover

                                opacity-25

                                blur-xl
                              "
                            />

                            <div
                              aria-hidden="true"
                              className="
                                absolute
                                inset-0

                                bg-white/55
                              "
                            />

                            {/* MAIN IMAGE */}

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
                                relative
                                z-10

                                h-full
                                w-full

                                object-contain

                                p-2

                                transition-transform
                                duration-500

                                group-hover:scale-[1.025]

                                sm:p-3
                              "
                            />

                            <div
                              aria-hidden="true"
                              className="
                                pointer-events-none

                                absolute
                                inset-0

                                z-20

                                bg-gradient-to-t

                                from-brand/[0.06]
                                via-transparent
                                to-transparent
                              "
                            />

                            {/* BADGE */}

                            <span
                              className="
                                absolute

                                left-3
                                top-3

                                z-30

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

                                backdrop-blur-md
                              "
                            >
                              {
                                build.badge
                              }
                            </span>
                          </div>

                          {/* CONTENT */}

                          <div
                            className="
                              flex
                              flex-1
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

                                group-hover:text-brand
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

                            {/* PRICE */}

                            <div
                              className="
                                relative

                                mt-4

                                overflow-hidden

                                rounded-xl

                                bg-brand

                                px-4
                                py-3

                                shadow-[0_14px_32px_-18px_rgba(230,0,0,0.72)]
                              "
                            >
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
                                        <Check className="h-3 w-3" />
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

                            {build.specs.length >
                            4 ? (
                              <p
                                className="
                                  mt-2.5

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

                            {/* DETAILS */}

                            <div
                              className="
                                mt-auto

                                pt-4
                              "
                            >
                              <span
                                className="
                                  inline-flex

                                  w-full

                                  items-center
                                  justify-between

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

                                  group-hover:border-brand
                                  group-hover:bg-brand
                                  group-hover:text-white
                                "
                              >
                                View Build Details

                                <ArrowRight className="h-4 w-4" />
                              </span>
                            </div>
                          </div>
                        </SpotlightCard>
                      </div>
                    </BlurReveal>
                  )
                )}
              </ScrollSkew>

              {/* =============================================
                  VIEW MORE
                  ============================================= */}

              {canToggle ? (
                <div
                  className="
                    mt-8

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

                      min-w-[170px]

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

                      hover:-translate-y-0.5

                      hover:border-brand
                      hover:bg-brand
                      hover:text-white
                    "
                  >
                    {showAll ? (
                      <>
                        Show Less

                        <ChevronUp className="h-4 w-4" />
                      </>
                    ) : (
                      <>
                        View More

                        <ChevronDown className="h-4 w-4" />
                      </>
                    )}
                  </button>
                </div>
              ) : null}
            </>
          ) : (
            <div
              className="
                mt-9

                rounded-2xl

                border
                border-dashed
                border-brand/20

                bg-white

                px-6
                py-10

                text-center
              "
            >
              <div className="mx-auto h-1 w-14 rounded-full bg-brand" />

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

      {/* DETAILS */}

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
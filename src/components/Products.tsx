"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Check } from "lucide-react";
import {
  categories,
  products,
  type CategoryId,
} from "@/lib/data";
import {
  SectionHeading,
  SpotlightCard,
} from "./ui";
import { Parallax } from "./fx";

export function Products() {
  const [active, setActive] =
    useState<CategoryId>("all");

  const filtered =
    active === "all"
      ? products
      : products.filter(
          (product) =>
            product.category === active
        );

  return (
    <section
      id="products"
      className="
        relative
        overflow-hidden
        bg-white
        py-24
        md:py-32
      "
    >
      {/* =====================================================
          BACKGROUND EFFECTS
          ===================================================== */}

      <div
        className="
          absolute
          left-1/2
          top-0
          -z-10
          h-72
          w-[40rem]
          -translate-x-1/2
          rounded-full
          bg-brand/[0.06]
          blur-[120px]
        "
      />

      <Parallax
        speed={100}
        className="
          pointer-events-none
          absolute
          -right-40
          top-1/2
          -z-10
          h-[26rem]
          w-[26rem]
          rounded-full
          bg-brand-soft/[0.05]
          blur-[140px]
        "
      />

      <div
        className="
          bg-grid
          grid-animated
          absolute
          inset-0
          -z-10
          opacity-30
          [mask-image:radial-gradient(ellipse_55%_55%_at_50%_50%,black,transparent)]
        "
      />

      {/* =====================================================
          CONTENT
          ===================================================== */}

      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <SectionHeading
          eyebrow="The Arsenal"
          title="Gear that wins matches"
          accent="wins"
          subtitle="From complete custom rigs to the silicon that powers them — browse the hardware we stock. Every build is custom-quoted, so hit us up for pricing."
        />

        {/* ===================================================
            CATEGORY FILTERS
            =================================================== */}

        <div
          className="
            mt-10
            flex
            flex-wrap
            justify-center
            gap-2
          "
        >
          {categories.map((category) => {
            const isActive =
              active === category.id;

            return (
              <button
                key={category.id}
                type="button"
                onClick={() =>
                  setActive(category.id)
                }
                className={`
                  relative
                  overflow-hidden
                  rounded-full

                  border

                  px-5
                  py-2.5

                  text-sm
                  font-semibold
                  uppercase
                  tracking-wider

                  transition-all
                  duration-300

                  ${
                    isActive
                      ? `
                        border-brand
                        text-white
                        shadow-[0_10px_28px_-16px_rgba(23,49,96,0.6)]
                      `
                      : `
                        border-brand/12
                        bg-white
                        text-slate-600
                        hover:border-brand/30
                        hover:bg-brand/[0.04]
                        hover:text-brand
                      `
                  }
                `}
              >
                {isActive ? (
                  <motion.span
                    layoutId="tab-pill"
                    className="
                      absolute
                      inset-0
                      rounded-full
                      bg-brand
                    "
                    transition={{
                      type: "spring",
                      stiffness: 400,
                      damping: 32,
                    }}
                  />
                ) : null}

                <span className="relative z-10">
                  {category.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* ===================================================
            PRODUCT GRID
            =================================================== */}

        <motion.div
          layout
          className="
            mt-12
            grid
            gap-5
            sm:grid-cols-2
            lg:grid-cols-3
          "
        >
          <AnimatePresence mode="popLayout">
            {filtered.map((product) => (
              <motion.article
                key={product.id}
                layout
                initial={{
                  opacity: 0,
                  scale: 0.9,
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                }}
                exit={{
                  opacity: 0,
                  scale: 0.9,
                }}
                transition={{
                  duration: 0.35,
                  ease: "easeOut",
                }}
              >
                <SpotlightCard
                  className="
                    group
                    h-full
                    rounded-2xl

                    border
                    border-brand/12

                    bg-white

                    shadow-[0_18px_50px_-34px_rgba(23,49,96,0.36)]

                    transition-all
                    duration-300

                    hover:-translate-y-1
                    hover:border-brand/28
                    hover:shadow-[0_28px_65px_-34px_rgba(23,49,96,0.46)]
                  "
                >
                  {/* =========================================
                      PRODUCT IMAGE
                      ========================================= */}

                  <div
                    className="
                      relative
                      aspect-[16/11]
                      overflow-hidden
                      bg-[#edf3f8]
                    "
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      loading="lazy"
                      className="
                        h-full
                        w-full
                        object-cover

                        transition-transform
                        duration-700
                        ease-out

                        group-hover:scale-110
                      "
                    />

                    {/*
                      Keep a subtle dark gradient over
                      the image itself for depth and
                      label readability.
                    */}

                    <div
                      className="
                        absolute
                        inset-0
                        bg-gradient-to-t
                        from-black/28
                        via-transparent
                        to-black/[0.04]
                      "
                    />

                    {/* Product tag */}

                    <span
                      className="
                        absolute
                        left-3
                        top-3

                        rounded-md

                        border
                        border-white/50

                        bg-white/90

                        px-2.5
                        py-1

                        text-[11px]
                        font-bold
                        uppercase
                        tracking-wider
                        text-brand

                        shadow-sm
                        backdrop-blur-md
                      "
                    >
                      {product.tag}
                    </span>
                  </div>

                  {/* =========================================
                      PRODUCT INFORMATION
                      ========================================= */}

                  <div className="p-5">
                    <h3
                      className="
                        font-display
                        text-lg
                        font-bold
                        text-brand-deep

                        transition-colors
                        duration-300

                        group-hover:text-brand
                      "
                    >
                      {product.name}
                    </h3>

                    <p
                      className="
                        mt-1.5
                        text-sm
                        leading-relaxed
                        text-slate-600
                      "
                    >
                      {product.description}
                    </p>

                    {/* =======================================
                        SPECIFICATIONS
                        ======================================= */}

                    <ul
                      className="
                        mt-4
                        grid
                        grid-cols-2
                        gap-x-3
                        gap-y-2
                      "
                    >
                      {product.specs.map(
                        (spec) => (
                          <li
                            key={spec}
                            className="
                              flex
                              items-center
                              gap-1.5

                              text-xs
                              font-medium
                              text-slate-600
                            "
                          >
                            <span
                              className="
                                grid
                                h-4
                                w-4
                                shrink-0
                                place-items-center

                                rounded-full
                                bg-brand/[0.08]
                              "
                            >
                              <Check className="h-3 w-3 text-brand" />
                            </span>

                            {spec}
                          </li>
                        )
                      )}
                    </ul>

                    {/* =======================================
                        ENQUIRE CTA
                        ======================================= */}

                    <a
                      href="#contact"
                      className="
                        mt-5
                        inline-flex
                        items-center
                        gap-1.5

                        font-display
                        text-sm
                        font-bold
                        uppercase
                        tracking-wider
                        text-brand

                        transition-colors
                        duration-300

                        hover:text-brand-soft
                      "
                    >
                      Enquire Now

                      <ArrowUpRight
                        className="
                          h-4
                          w-4

                          transition-transform
                          duration-300

                          group-hover:translate-x-0.5
                          group-hover:-translate-y-0.5
                        "
                      />
                    </a>
                  </div>
                </SpotlightCard>
              </motion.article>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* ===================================================
            BOTTOM NOTE
            =================================================== */}

        <p
          className="
            mt-10
            text-center

            text-sm
            font-medium
            uppercase
            tracking-widest
            text-slate-500
          "
        >
          <span className="text-brand">
            ✦
          </span>{" "}
          Custom-quoted — no fixed prices,
          always built to your spec{" "}
          <span className="text-brand">
            ✦
          </span>
        </p>
      </div>
    </section>
  );
}
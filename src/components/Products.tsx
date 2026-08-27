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
} from "@/components/ui";

export default function Products() {
  const [active, setActive] =
    useState<CategoryId>("all");

  const filteredProducts =
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
      {/* Background decoration */}

      <div
        className="
          pointer-events-none
          absolute
          inset-0
          bg-[radial-gradient(circle_at_15%_20%,rgba(23,49,96,0.06),transparent_30%),radial-gradient(circle_at_85%_80%,rgba(49,91,145,0.05),transparent_32%)]
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
        {/* ===================================================
            SECTION HEADING
            =================================================== */}

        <SectionHeading
          eyebrow="Catalogue"
          title="Products"
          subtitle="Premium gaming hardware selected for performance, reliability, and serious gaming setups."
        />

        {/* ===================================================
            CATEGORY FILTERS
            =================================================== */}

        <div
          className="
            mt-10
            flex
            flex-wrap
            items-center
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
                  rounded-full
                  border
                  px-4
                  py-2.5
                  text-xs
                  font-bold
                  uppercase
                  tracking-wider
                  transition-all
                  duration-300

                  ${
                    isActive
                      ? `
                        border-brand
                        bg-brand
                        text-white
                        shadow-[0_10px_30px_-16px_rgba(23,49,96,0.6)]
                      `
                      : `
                        border-brand/10
                        bg-white
                        text-slate-500
                        hover:border-brand/25
                        hover:text-brand
                      `
                  }
                `}
              >
                {category.label}
              </button>
            );
          })}
        </div>

        {/* ===================================================
            PRODUCT CARDS
            =================================================== */}

        <motion.div
          layout
          className="
            mt-12
            grid
            gap-5
            sm:grid-cols-2
            lg:grid-cols-3
            xl:grid-cols-4
          "
        >
          <AnimatePresence mode="popLayout">
            {filteredProducts.map(
              (product) => (
                <motion.div
                  layout
                  key={product.id}
                  initial={{
                    opacity: 0,
                    y: 20,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  exit={{
                    opacity: 0,
                    scale: 0.96,
                  }}
                  transition={{
                    duration: 0.3,
                  }}
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
                      border-brand/10
                      bg-white
                      shadow-[0_18px_50px_-38px_rgba(23,49,96,0.28)]
                      transition-all
                      duration-300
                      hover:-translate-y-1
                      hover:border-brand/20
                      hover:shadow-[0_30px_70px_-42px_rgba(23,49,96,0.38)]
                    "
                  >
                    {/* =========================================
                        IMAGE
                        ========================================= */}

                    <div
                      className="
                        relative
                        aspect-[4/3]
                        overflow-hidden
                        bg-[#f7f9fc]
                      "
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={product.image}
                        alt={product.name}
                        className="
                          h-full
                          w-full
                          object-cover
                          transition-transform
                          duration-700
                          group-hover:scale-105
                        "
                      />

                      <div
                        className="
                          pointer-events-none
                          absolute
                          inset-0
                          bg-gradient-to-t
                          from-brand-deep/15
                          via-transparent
                          to-transparent
                        "
                      />

                      {/* Tag */}

                      <div
                        className="
                          absolute
                          left-4
                          top-4
                        "
                      >
                        <span
                          className="
                            inline-flex
                            rounded-full
                            border
                            border-white/50
                            bg-white/90
                            px-3
                            py-1.5
                            text-[10px]
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
                    </div>

                    {/* =========================================
                        CONTENT
                        ========================================= */}

                    <div
                      className="
                        flex
                        flex-1
                        flex-col
                        p-5
                      "
                    >
                      <p
                        className="
                          text-[10px]
                          font-bold
                          uppercase
                          tracking-[0.18em]
                          text-brand
                        "
                      >
                        {
                          categories.find(
                            (category) =>
                              category.id ===
                              product.category
                          )?.label
                        }
                      </p>

                      <h3
                        className="
                          mt-2
                          font-display
                          text-lg
                          font-bold
                          leading-tight
                          text-brand-deep
                        "
                      >
                        {product.name}
                      </h3>

                      <p
                        className="
                          mt-3
                          line-clamp-3
                          text-sm
                          leading-relaxed
                          text-slate-500
                        "
                      >
                        {product.description}
                      </p>

                      {/* =======================================
                          SPECS
                          ======================================= */}

                      <div
                        className="
                          mt-5
                          space-y-2
                          border-t
                          border-brand/[0.08]
                          pt-4
                        "
                      >
                        {product.specs
                          .slice(0, 4)
                          .map((spec) => (
                            <div
                              key={spec}
                              className="
                                flex
                                items-start
                                gap-2
                                text-xs
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
                                  bg-brand/[0.07]
                                  text-brand
                                "
                              >
                                <Check className="h-2.5 w-2.5" />
                              </span>

                              <span>
                                {spec}
                              </span>
                            </div>
                          ))}
                      </div>

                      {/* =======================================
                          CTA
                          ======================================= */}

                      <a
                        href="#contact"
                        className="
                          mt-6
                          inline-flex
                          items-center
                          justify-between
                          rounded-xl
                          border
                          border-brand/10
                          bg-[#f7f9fc]
                          px-4
                          py-3
                          text-xs
                          font-bold
                          uppercase
                          tracking-wider
                          text-brand-deep
                          transition-all
                          duration-300
                          hover:border-brand
                          hover:bg-brand
                          hover:text-white
                        "
                      >
                        Enquire Now

                        <ArrowUpRight className="h-4 w-4" />
                      </a>
                    </div>
                  </SpotlightCard>
                </motion.div>
              )
            )}
          </AnimatePresence>
        </motion.div>

        {/* ===================================================
            NO RESULTS
            =================================================== */}

        {filteredProducts.length === 0 ? (
          <div
            className="
              mt-12
              rounded-2xl
              border
              border-dashed
              border-brand/20
              bg-[#f7f9fc]
              px-6
              py-14
              text-center
            "
          >
            <h3
              className="
                font-display
                text-xl
                font-bold
                uppercase
                text-brand-deep
              "
            >
              No Products Found
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              There are currently no products in this category.
            </p>
          </div>
        ) : null}
      </div>
    </section>
  );
}
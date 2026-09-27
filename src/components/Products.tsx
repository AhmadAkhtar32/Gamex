"use client";

import {
  useState,
} from "react";

import {
  AnimatePresence,
  motion,
} from "framer-motion";

import {
  ArrowUpRight,
  Check,
} from "lucide-react";

import {
  DetailsModal,
} from "@/components/DetailsModal";

import {
  formatPrice,
} from "@/lib/price";

import {
  categories,
  type CategoryId,
} from "@/lib/data";

import {
  SectionHeading,
  SpotlightCard,
} from "@/components/ui";

/* =========================================================
   TYPES
   ========================================================= */

export type PublicProduct = {
  id: string;

  name: string;

  category: string;

  tag: string;

  price:
    | number
    | null;

  description: string;

  specs: string[];

  image: string;
};

/* =========================================================
   PRODUCTS
   ========================================================= */

export default function Products({
  products,
}: {
  products: PublicProduct[];
}) {
  /* =======================================================
     ACTIVE CATEGORY
     ======================================================= */

  const [
    active,
    setActive,
  ] =
    useState<CategoryId>(
      "all"
    );

  /* =======================================================
     SELECTED PRODUCT FOR POPUP
     ======================================================= */

  const [
    selectedProduct,
    setSelectedProduct,
  ] =
    useState<PublicProduct | null>(
      null
    );

  /* =======================================================
     FILTER PRODUCTS
     ======================================================= */

  const filteredProducts =
    active === "all"
      ? products
      : products.filter(
          (product) =>
            product.category ===
            active
        );

  /* =======================================================
     RENDER
     ======================================================= */

  return (
    <>
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
        {/* =================================================
            BACKGROUND DECORATION
            ================================================= */}

        <div
          aria-hidden="true"
          className="
            pointer-events-none

            absolute
            inset-0

            bg-[radial-gradient(circle_at_12%_18%,rgba(230,0,0,0.07),transparent_29%),radial-gradient(circle_at_88%_80%,rgba(255,42,42,0.055),transparent_31%)]
          "
        />

        {/* RED GRID */}

        <div
          aria-hidden="true"
          className="
            bg-grid

            pointer-events-none

            absolute
            inset-0

            opacity-25

            [mask-image:radial-gradient(ellipse_80%_70%_at_50%_50%,black,transparent)]
          "
        />

        {/* LEFT RED GLOW */}

        <div
          aria-hidden="true"
          className="
            pointer-events-none

            absolute

            -left-48
            top-1/4

            h-[28rem]
            w-[28rem]

            rounded-full

            bg-brand/[0.06]

            blur-[130px]
          "
        />

        {/* RIGHT RED GLOW */}

        <div
          aria-hidden="true"
          className="
            pointer-events-none

            absolute

            -right-48
            bottom-10

            h-[28rem]
            w-[28rem]

            rounded-full

            bg-brand-soft/[0.05]

            blur-[130px]
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
            eyebrow="Catalogue"
            title="Products"
            subtitle="Premium gaming hardware selected for performance, reliability, and serious gaming setups."
          />

          {/* =================================================
              CATEGORY FILTERS
              ================================================= */}

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
            {categories.map(
              (
                category
              ) => {
                const isActive =
                  active ===
                  category.id;

                return (
                  <button
                    key={
                      category.id
                    }
                    type="button"
                    onClick={() =>
                      setActive(
                        category.id
                      )
                    }
                    className={`
                      relative

                      overflow-hidden

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
                            shadow-[0_10px_28px_-14px_rgba(230,0,0,0.65)]
                          `
                          : `
                            border-black/10
                            bg-white
                            text-slate-600

                            hover:border-brand/40
                            hover:bg-brand/[0.04]
                            hover:text-brand
                          `
                      }
                    `}
                  >
                    {
                      category.label
                    }
                  </button>
                );
              }
            )}
          </div>

          {/* =================================================
              PRODUCT GRID
              ================================================= */}

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
                (
                  product
                ) => {
                  const categoryLabel =
                    categories.find(
                      (
                        category
                      ) =>
                        category.id ===
                        product.category
                    )?.label ??
                    product.category;

                  return (
                    <motion.div
                      layout
                      key={
                        product.id
                      }
                      role="button"
                      tabIndex={0}
                      aria-label={`View details for ${product.name}`}
                      onClick={() =>
                        setSelectedProduct(
                          product
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

                          setSelectedProduct(
                            product
                          );
                        }
                      }}
                      className="
                        cursor-pointer

                        rounded-2xl

                        focus:outline-none

                        focus-visible:ring-4
                        focus-visible:ring-brand/15
                      "
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
                          border-black/[0.07]

                          bg-white

                          shadow-[0_18px_50px_-38px_rgba(0,0,0,0.28)]

                          transition-all

                          duration-300

                          hover:-translate-y-1.5

                          hover:border-brand/25

                          hover:shadow-[0_28px_65px_-38px_rgba(230,0,0,0.34)]
                        "
                      >
                        {/* ===================================
                            PRODUCT IMAGE
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
                              product.image
                            }
                            alt={
                              product.name
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
                              SUBTLE IMAGE RED GLOW
                              ================================= */}

                          <div
                            aria-hidden="true"
                            className="
                              pointer-events-none

                              absolute
                              inset-0

                              bg-gradient-to-t

                              from-brand/[0.05]
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
                              PRODUCT TAG
                              ================================= */}

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
                                border-brand/20

                                bg-white/95

                                px-3
                                py-1.5

                                text-[10px]

                                font-bold

                                uppercase

                                tracking-wider

                                text-brand

                                shadow-[0_8px_20px_-14px_rgba(230,0,0,0.5)]

                                backdrop-blur-md
                              "
                            >
                              {
                                product.tag
                              }
                            </span>
                          </div>
                        </div>

                        {/* ===================================
                            CONTENT
                            =================================== */}

                        <div
                          className="
                            flex

                            flex-1

                            flex-col

                            p-5
                          "
                        >
                          {/* =================================
                              CATEGORY
                              ================================= */}

                          <p
                            className="
                              text-[10px]

                              font-extrabold

                              uppercase

                              tracking-[0.18em]

                              text-brand
                            "
                          >
                            {
                              categoryLabel
                            }
                          </p>

                          {/* =================================
                              TITLE
                              ================================= */}

                          <h3
                            className="
                              mt-2

                              font-display

                              text-lg

                              font-extrabold

                              leading-tight

                              text-brand-deep

                              transition-colors

                              duration-300

                              group-hover:text-brand
                            "
                          >
                            {
                              product.name
                            }
                          </h3>

                          {/* =================================
                              PRICE
                              ================================= */}

                          <div
                            className="
                              mt-4

                              relative

                              overflow-hidden

                              rounded-xl

                              bg-brand

                              px-4
                              py-3

                              shadow-[0_12px_30px_-18px_rgba(230,0,0,0.7)]
                            "
                          >
                            {/* PRICE DECORATION */}

                            <div
                              aria-hidden="true"
                              className="
                                absolute

                                -right-7
                                -top-7

                                h-20
                                w-20

                                rotate-45

                                border

                                border-white/15
                              "
                            />

                            <div
                              aria-hidden="true"
                              className="
                                absolute

                                right-3
                                top-1/2

                                h-8
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
                              Price
                            </p>

                            <p
                              className="
                                relative

                                mt-0.5

                                font-display

                                text-xl

                                font-extrabold

                                leading-tight

                                text-white
                              "
                            >
                              {formatPrice(
                                product.price
                              )}
                            </p>
                          </div>

                          {/* =================================
                              DESCRIPTION — ONLY 3 LINES
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
                              product.description
                            }
                          </p>

                          {/* =================================
                              SPECIFICATIONS — FIRST 4 ONLY
                              ================================= */}

                          <div
                            className="
                              mt-5

                              space-y-2.5

                              border-t

                              border-black/[0.06]

                              pt-4
                            "
                          >
                            {product.specs
                              .slice(
                                0,
                                4
                              )
                              .map(
                                (
                                  spec,
                                  index
                                ) => (
                                  <div
                                    key={`${product.id}-${index}`}
                                    className="
                                      flex

                                      items-start

                                      gap-2.5

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

                                        bg-brand/[0.08]

                                        text-brand
                                      "
                                    >
                                      <Check
                                        className="
                                          h-2.5
                                          w-2.5
                                        "
                                      />
                                    </span>

                                    <span>
                                      {
                                        spec
                                      }
                                    </span>
                                  </div>
                                )
                              )}
                          </div>

                          {/* =================================
                              MORE SPECS NOTICE
                              ================================= */}

                          {product.specs.length >
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
                              {product.specs.length -
                                4}{" "}
                              more specifications
                            </p>
                          ) : null}

                          {/* =================================
                              VIEW DETAILS
                              ================================= */}

                          <span
                            className="
                              mt-auto

                              pt-6
                            "
                          >
                            <span
                              className="
                                flex

                                items-center

                                justify-between

                                rounded-xl

                                border
                                border-black/[0.08]

                                bg-[#fff8f8]

                                px-4
                                py-3

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
                              View Details

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
                            </span>
                          </span>
                        </div>
                      </SpotlightCard>
                    </motion.div>
                  );
                }
              )}
            </AnimatePresence>
          </motion.div>

          {/* =================================================
              EMPTY CATEGORY
              ================================================= */}

          {filteredProducts.length ===
          0 ? (
            <div
              className="
                mt-12

                rounded-2xl

                border
                border-dashed
                border-brand/20

                bg-[#fff8f8]

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
                No Products Found
              </h3>

              <p
                className="
                  mt-2

                  text-sm

                  text-slate-500
                "
              >
                There are currently no products in this category.
              </p>
            </div>
          ) : null}
        </div>

        {/* =================================================
            BOTTOM LINE
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
          PRODUCT DETAILS POPUP
          =================================================== */}

      <DetailsModal
        item={
          selectedProduct
            ? {
                kind:
                  "product",

                name:
                  selectedProduct.name,

                price:
                  selectedProduct.price,

                eyebrow:
                  categories.find(
                    (
                      category
                    ) =>
                      category.id ===
                      selectedProduct.category
                  )?.label ??
                  selectedProduct.category,

                badge:
                  selectedProduct.tag,

                description:
                  selectedProduct.description,

                specs:
                  selectedProduct.specs,

                image:
                  selectedProduct.image,
              }
            : null
        }
        onClose={() =>
          setSelectedProduct(
            null
          )
        }
      />
    </>
  );
}
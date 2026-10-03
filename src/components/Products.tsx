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
  ArrowUpRight,
  Check,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

import {
  FaWhatsapp,
} from "react-icons/fa";

import {
  DetailsModal,
} from "@/components/DetailsModal";

import {
  SectionHeading,
  SpotlightCard,
} from "@/components/ui";

import {
  formatPrice,
} from "@/lib/price";

/* =========================================================
   TYPES
   ========================================================= */

export type PublicCategory = {
  id: string;
  label: string;
};

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
   RESPONSIVE LIMIT
   ========================================================= */

function getProductLimit() {
  if (
    typeof window ===
    "undefined"
  ) {
    return 8;
  }

  if (
    window.innerWidth >=
    1280
  ) {
    return 8;
  }

  if (
    window.innerWidth >=
    1024
  ) {
    return 6;
  }

  if (
    window.innerWidth >=
    640
  ) {
    return 4;
  }

  return 2;
}

/* =========================================================
   PRODUCTS
   ========================================================= */

export default function Products({
  products,
  categories,
}: {
  products: PublicProduct[];
  categories: PublicCategory[];
}) {
  const [
    active,
    setActive,
  ] =
    useState<string>(
      "all"
    );

  const [
    selectedProduct,
    setSelectedProduct,
  ] =
    useState<PublicProduct | null>(
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
    useState(8);

  /* =======================================================
     RESPONSIVE LIMIT
     ======================================================= */

  useEffect(() => {
    const updateLimit =
      () => {
        setInitialLimit(
          getProductLimit()
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

  /* =======================================================
     VALID ACTIVE CATEGORY
     ======================================================= */

  useEffect(() => {
    if (
      active ===
      "all"
    ) {
      return;
    }

    const exists =
      categories.some(
        (
          category
        ) =>
          category.id ===
          active
      );

    if (
      !exists
    ) {
      setActive(
        "all"
      );

      setShowAll(
        false
      );
    }
  }, [
    active,
    categories,
  ]);

  /* =======================================================
     FILTER
     ======================================================= */

  const filteredProducts =
    active ===
    "all"
      ? products
      : products.filter(
          (
            product
          ) =>
            product.category ===
            active
        );

  const visibleProducts =
    showAll
      ? filteredProducts
      : filteredProducts.slice(
          0,
          initialLimit
        );

  const canToggle =
    filteredProducts.length >
    initialLimit;

  /* =======================================================
     CATEGORY CHANGE
     ======================================================= */

  function changeCategory(
    categoryId: string
  ) {
    setActive(
      categoryId
    );

    setShowAll(
      false
    );
  }

  /* =======================================================
     SHOW MORE / LESS
     ======================================================= */

  function toggleProducts() {
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
              "products"
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
        id="products"
        className="
          relative
          overflow-hidden
          bg-white
          py-14
          md:py-20
        "
      >
        {/* BACKGROUND */}

        <div
          aria-hidden="true"
          className="
            pointer-events-none
            absolute
            inset-0
            bg-[radial-gradient(circle_at_12%_18%,rgba(230,0,0,0.06),transparent_29%),radial-gradient(circle_at_88%_80%,rgba(255,42,42,0.045),transparent_31%)]
          "
        />

        <div
          aria-hidden="true"
          className="
            bg-grid
            pointer-events-none
            absolute
            inset-0
            opacity-20
            [mask-image:radial-gradient(ellipse_80%_70%_at_50%_50%,black,transparent)]
          "
        />

        {/* CONTENT */}

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
            eyebrow="Catalogue"
            title="Products"
            subtitle="Premium gaming hardware selected for performance, reliability, and serious gaming setups."
          />

          {/* FILTERS */}

          <div
            className="
              mt-8
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
                      changeCategory(
                        category.id
                      )
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

          {/* PRODUCT GRID */}

          <motion.div
            layout
            className="
              mt-9
              grid
              auto-rows-fr
              gap-5
              sm:grid-cols-2
              lg:grid-cols-3
              xl:grid-cols-4
            "
          >
            <AnimatePresence mode="popLayout">
              {visibleProducts.map(
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

                  const whatsappUrl =
                    `https://wa.me/923036009123?text=${encodeURIComponent(
                      `Hi GameX, I want to order ${product.name}. Product link: https://gamex.pk/product/${product.id}`
                    )}`;

                  const visibleSpecs =
                    product.specs.slice(
                      0,
                      3
                    );

                  const remainingSpecs =
                    Math.max(
                      product.specs.length -
                        3,
                      0
                    );

                  return (
                    <motion.div
                      layout
                      key={
                        product.id
                      }
                      role="button"
                      tabIndex={
                        0
                      }
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
                      initial={{
                        opacity:
                          0,

                        y:
                          18,
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

                        scale:
                          0.97,
                      }}
                      transition={{
                        duration:
                          0.28,
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
                          shadow-[0_18px_50px_-38px_rgba(0,0,0,0.28)]
                          transition-all
                          duration-300
                          hover:-translate-y-1
                          hover:border-brand/25
                          hover:shadow-[0_25px_60px_-38px_rgba(230,0,0,0.34)]
                        "
                      >
                        {/* IMAGE */}

                        <div
                          className="
                            relative
                            aspect-[16/10]
                            overflow-hidden
                            border-b
                            border-black/[0.05]
                            bg-[#f7f7f7]
                            p-2
                          "
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}

                          <img
                            src={
                              product.image
                            }
                            alt={`${product.name} - ${categoryLabel} at GameX Pakistan`}
                            loading="lazy"
                            className="
                              h-full
                              w-full
                              object-contain
                              object-center
                              transition-transform
                              duration-500
                              ease-out
                              group-hover:scale-[1.025]
                            "
                          />

                          <div
                            aria-hidden="true"
                            className="
                              pointer-events-none
                              absolute
                              inset-0
                              bg-gradient-to-t
                              from-brand/[0.035]
                              via-transparent
                              to-transparent
                            "
                          />

                          <div
                            className="
                              absolute
                              left-3
                              top-3
                              z-20
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
                                shadow-sm
                                backdrop-blur-md
                              "
                            >
                              {
                                product.tag
                              }
                            </span>
                          </div>
                        </div>

                        {/* CARD CONTENT */}

                        <div
                          className="
                            flex
                            flex-1
                            flex-col
                            p-4
                          "
                        >
                          {/* CATEGORY */}

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

                          {/* FIXED PRODUCT NAME AREA */}

                          <div
                            className="
                              mt-1.5
                              h-[3.15rem]
                              overflow-hidden
                            "
                          >
                            <h3
                              className="
                                line-clamp-2
                                font-display
                                text-lg
                                font-extrabold
                                leading-[1.35]
                                text-brand-deep
                                transition-colors
                                group-hover:text-brand
                              "
                            >
                              {
                                product.name
                              }
                            </h3>
                          </div>

                          {/* PRICE */}

                          <div
                            className="
                              relative
                              mt-3
                              overflow-hidden
                              rounded-xl
                              bg-brand
                              px-4
                              py-2.5
                              shadow-[0_12px_30px_-18px_rgba(230,0,0,0.7)]
                            "
                          >
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
                                right-4
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

                          {/* 3 SPECIFICATIONS */}

                          <div
                            className="
                              mt-3
                              min-h-[5.25rem]
                              space-y-2
                              border-t
                              border-black/[0.06]
                              pt-3
                            "
                          >
                            {visibleSpecs.map(
                              (
                                spec,
                                index
                              ) => (
                                <div
                                  key={`${product.id}-${index}`}
                                  className="
                                    flex
                                    min-h-[1.25rem]
                                    items-center
                                    gap-2
                                    text-xs
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
                                      text-brand
                                    "
                                  >
                                    <Check className="h-2.5 w-2.5" />
                                  </span>

                                  <span
                                    className="
                                      min-w-0
                                      flex-1
                                      truncate
                                    "
                                  >
                                    {
                                      spec
                                    }
                                  </span>
                                </div>
                              )
                            )}
                          </div>

                          {/* MORE SPECIFICATIONS — FIXED HEIGHT */}

                          <div className="h-5">
                            {remainingSpecs >
                            0 ? (
                              <p
                                className="
                                  text-[10px]
                                  font-bold
                                  uppercase
                                  tracking-wider
                                  text-brand/70
                                "
                              >
                                +
                                {
                                  remainingSpecs
                                }{" "}
                                more specifications
                              </p>
                            ) : null}
                          </div>

                          {/* ORDER NOW ONLY */}

                          <div
                            className="
                              mt-auto
                              pt-3
                            "
                          >
                            <a
                              href={
                                whatsappUrl
                              }
                              target="_blank"
                              rel="noopener noreferrer"
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
                              aria-label={`Order ${product.name} on WhatsApp`}
                              className="
                                flex
                                w-full
                                items-center
                                justify-between
                                rounded-xl
                                bg-[#25D366]
                                px-4
                                py-2.5
                                text-xs
                                font-bold
                                uppercase
                                tracking-wider
                                text-white
                                transition-all
                                duration-300
                                hover:-translate-y-0.5
                                hover:bg-[#1ebe5d]
                                hover:shadow-[0_12px_28px_-16px_rgba(37,211,102,0.75)]
                              "
                            >
                              <span
                                className="
                                  inline-flex
                                  items-center
                                  gap-2
                                "
                              >
                                <FaWhatsapp className="h-4 w-4" />

                                Order Now
                              </span>

                              <ArrowUpRight className="h-4 w-4" />
                            </a>
                          </div>
                        </div>
                      </SpotlightCard>
                    </motion.div>
                  );
                }
              )}
            </AnimatePresence>
          </motion.div>

          {/* VIEW MORE / LESS */}

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
                  toggleProducts
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

          {/* EMPTY */}

          {filteredProducts.length ===
          0 ? (
            <div
              className="
                mt-10
                rounded-2xl
                border
                border-dashed
                border-brand/20
                bg-[#fff8f8]
                px-6
                py-10
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
                  mt-4
                  font-display
                  text-xl
                  font-bold
                  uppercase
                  text-brand-deep
                "
              >
                No Products Found
              </h3>
            </div>
          ) : null}
        </div>
      </section>

      {/* DETAILS POPUP */}

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
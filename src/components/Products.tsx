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

  Images,

} from "lucide-react";



import {

  FaWhatsapp,

} from "react-icons/fa";



import {

  DetailsModal,

} from "@/components/DetailsModal";



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



  /*

   * Existing primary image.

   *

   * Keep this for backwards compatibility.

   */

  image: string;



  /*

   * Optional additional images.

   *

   * Once multiple-image upload is connected in Admin,

   * pass those URLs here.

   */

  images?: string[];

};



/* =========================================================

   NORMALIZE IMAGES

   ========================================================= */



function getProductImages(

  product: PublicProduct

) {

  const values = [

    product.image,

    ...(product.images ?? []),

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

   RESPONSIVE PRODUCT LIMIT



   We show two rows initially.



   XL:

   5 columns × 2 rows = 10



   Desktop:

   3 columns × 2 rows = 6



   Tablet:

   2 columns × 2 rows = 4



   Mobile:

   1 column × 2 rows = 2

   ========================================================= */



function getProductLimit() {

  if (

    typeof window ===

    "undefined"

  ) {

    return 10;

  }



  if (

    window.innerWidth >=

    1280

  ) {

    return 10;

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

    useState(

      false

    );



  const [

    initialLimit,

    setInitialLimit,

  ] =

    useState(

      10

    );



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

     FILTER PRODUCTS

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

     VIEW MORE / LESS

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

          pb-8

          pt-5

          md:pb-10

          md:pt-6

        "

      >

        {/* ===================================================

            BACKGROUND

            =================================================== */}



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



        {/* ===================================================

            CONTENT

            =================================================== */}



        <div

          className="

            relative

            mx-auto

            max-w-[1480px]

            px-5

            md:px-8

          "

        >

          {/* =================================================

              CATALOGUE HEADER

              ================================================= */}



          <div className="text-center">

            <div

              className="

                inline-flex

                items-center

                gap-2

                rounded-full

                border

                border-brand/25

                bg-brand/[0.04]

                px-4

                py-2

                text-xs

                font-bold

                uppercase

                tracking-[0.18em]

                text-brand

              "

            >

              <span

                className="

                  h-2

                  w-2

                  rounded-full

                  bg-brand

                  shadow-[0_0_10px_rgba(230,0,0,0.45)]

                "

              />



              Catalogue

            </div>



            <div

              className="

                mx-auto

                mt-4

                flex

                items-center

                justify-center

                gap-2

              "

            >

              <span className="h-[3px] w-10 rounded-full bg-brand" />



              <span className="h-[3px] w-3 rounded-full bg-brand-deep" />



              <span className="h-[3px] w-2 rounded-full bg-brand/40" />

            </div>

          </div>



          {/* =================================================

              FILTERS

              ================================================= */}



          <div

            className="

              mt-5

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



          {/* =================================================

              PRODUCT GRID



              XL = FIVE CARDS

              ================================================= */}



          <motion.div

            layout

            className="

              mt-6

              grid

              auto-rows-fr

              gap-4

              sm:grid-cols-2

              lg:grid-cols-3

              xl:grid-cols-5

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



                  const productImages =

                    getProductImages(

                      product

                    );



                  const mainImage =

                    productImages[0] ??

                    product.image;



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

                          shadow-[0_18px_50px_-38px_rgba(0,0,0,0.28)]

                          transition-all

                          duration-300

                          hover:-translate-y-1

                        "

                      >

                        {/* ===================================

                            IMAGE

                            =================================== */}



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

                              mainImage

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

                              group-hover:scale-[1.03]

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



                          {/* TAG */}



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

                                text-[9px]

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



                          {/* MULTIPLE IMAGE COUNT */}



                          {productImages.length >

                          1 ? (

                            <div

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

                                productImages.length

                              }

                            </div>

                          ) : null}

                        </div>



                        {/* ===================================

                            CONTENT

                            =================================== */}



                        <div

                          className="

                            flex

                            flex-1

                            min-w-0

                            flex-col

                            p-4

                          "

                        >

                          {/* CATEGORY */}



                          <p

                            className="

                              text-[9px]

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



                          {/* PRODUCT NAME */}



                          <div className="mt-1.5 min-h-[2.8rem]">

                            <h3

                              className="

                                line-clamp-2

                                font-display

                                text-base

                                font-extrabold

                                leading-[1.25]

                                text-brand-deep

                                transition-colors

                              "

                            >

                              {

                                product.name

                              }

                            </h3>

                          </div>



                          {/* =================================

                              SMALLER PRICE TAG

                              ================================= */}



                          <div

                            className="mt-3 w-full min-w-0 rounded-lg bg-brand px-3 py-2.5"

                          >

                            <p

                              className="font-sans text-[10px] font-semibold leading-4 text-white/80"

                            >

                              Price

                            </p>



                            <p

                              className="mt-0.5 break-words font-sans text-lg font-bold leading-6 tracking-tight text-white tabular-nums"

                            >

                              {formatPrice(

                                product.price

                              )}

                            </p>

                          </div>



                          {/* =================================

                              3 SPECS

                              ================================= */}



                          <div

                            className="

                              mt-3

                              min-h-[4.7rem]

                              space-y-1.5

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

                                    min-h-[1.1rem]

                                    items-center

                                    gap-2

                                    text-[11px]

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



                          {/* MORE SPECS */}



                          <div className="h-5">

                            {remainingSpecs >

                            0 ? (

                              <p

                                className="

                                  text-[9px]

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



                          {/* ACTIONS */}



                          <div

                            className="

                              mt-auto

                              grid

                              gap-2

                              pt-2

                            "

                          >

                            <button

                              type="button"

                              onClick={(

                                event

                              ) => {

                                event.stopPropagation();



                                setSelectedProduct(

                                  product

                                );

                              }}

                              className="

                                flex

                                w-full

                                min-h-11

                                min-w-0

                                gap-2

                                items-center

                                justify-between

                                rounded-xl

                                border

                                border-black/[0.08]

                                bg-[#fff8f8]

                                px-3

                                py-2.5

                                text-[10px]

                                leading-snug

                                whitespace-normal

                                text-left

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

                              View Details



                              <ArrowUpRight className="h-3.5 w-3.5 shrink-0" />

                            </button>



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

                                min-h-11

                                min-w-0

                                gap-2

                                items-center

                                justify-between

                                rounded-xl

                                bg-[#25D366]

                                px-3

                                py-2.5

                                text-[10px]

                                leading-snug

                                whitespace-normal

                                text-left

                                font-bold

                                uppercase

                                tracking-wider

                                text-white

                                transition-all

                                duration-300

                                hover:-translate-y-0.5

                                hover:bg-[#20bd5a]

                              "

                            >

                              <span

                                className="

                                  inline-flex

                                  items-center

                                  gap-2

                                "

                              >

                                <FaWhatsapp className="h-4 w-4 shrink-0" />



                                Order Now

                              </span>



                              <ArrowUpRight className="h-3.5 w-3.5 shrink-0" />

                            </a>

                          </div>

                        </div>

                      </div>

                    </motion.div>

                  );

                }

              )}

            </AnimatePresence>

          </motion.div>



          {/* =================================================

              EMPTY STATE

              ================================================= */}



          {filteredProducts.length ===

          0 ? (

            <div

              className="

                mt-8

                rounded-2xl

                border

                border-dashed

                border-brand/20

                bg-[#fff8f8]

                px-6

                py-12

                text-center

              "

            >

              <p

                className="

                  font-display

                  text-lg

                  font-extrabold

                  uppercase

                  text-brand-deep

                "

              >

                No Products Found

              </p>



              <p className="mt-2 text-sm text-slate-500">

                There are no visible products in this category yet.

              </p>

            </div>

          ) : null}



          {/* =================================================

              VIEW MORE

              ================================================= */}



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

        </div>

      </section>



      {/* =====================================================

          DETAILS MODAL

          ===================================================== */}



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



                images:

                  getProductImages(

                    selectedProduct

                  ),

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
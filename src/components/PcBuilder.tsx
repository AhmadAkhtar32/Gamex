"use client";



import {

  type FormEvent,

  useMemo,

  useState,

} from "react";



import Link from "next/link";



import {

  Check,

  CheckCircle2,

  ChevronRight,

  CircleDollarSign,

  Cpu,

  ExternalLink,

  ImageIcon,

  Package,

  Plus,

  RotateCcw,

  ShoppingCart,

  Trash2,

  X,

} from "lucide-react";



import {

  FaWhatsapp,

} from "react-icons/fa";



import {

  formatPrice,

} from "@/lib/price";



const SITE_URL =

  "https://gamex.pk";



type BuilderSettings = {

  title: string;

  subtitle: string;

  readyBuildsLabel: string;

  scratchBuilderLabel: string;

  quoteButtonText: string;

  whatsappNumber: string;

  showReadyBuilds: boolean;

  showScratchBuilder: boolean;

};



type BuilderCategory = {

  id: number;

  name: string;

  slug: string;

  description: string;

  helpText: string;

  isRequired: boolean;

};



type CatalogProduct = {

  id: string;

  name: string;

  category: string;

  tag: string;

  price: number | null;

  description: string;

  specs: string[];

  image: string;

};



type ReadyBuild = {

  id: string;

  name: string;

  role: string;

  badge: string;

  price: number | null;

  description: string;

  specs: string[];

  image: string;

};



type BuilderMode =

  | "scratch"

  | "ready";



type SelectableItem = {

  key: string;

  id: string;

  name: string;

  price: number | null;

  description: string;

  specs: string[];

  image: string;

  productUrl: string;

  badge: string;

};



type SelectedPart = {

  key: string;



  source:

    | "product"

    | "custom";



  categoryId: number;



  name: string;



  price:

    | number

    | null;



  description: string;



  specs: string[];



  image: string;



  productUrl: string;



  note: string;

};



type CustomExtra = {

  id: string;



  name: string;



  price:

    | number

    | null;



  productUrl: string;



  note: string;

};



type SelectionMap =

  Record<

    number,

    SelectedPart | undefined

  >;



type CustomPartInput = {

  name: string;



  price:

    | number

    | null;



  productUrl: string;



  note: string;

};



/* =========================================================

   STRICT CATEGORY MATCHING

   ========================================================= */



function productMatchesCategory(

  category: BuilderCategory,

  product: CatalogProduct

) {

  return (

    product.category ===

    category.slug

  );

}



function createLocalId() {

  if (

    typeof crypto !==

      "undefined" &&

    "randomUUID" in crypto

  ) {

    return crypto.randomUUID();

  }



  return `${Date.now()}-${Math.random()

    .toString(36)

    .slice(2)}`;

}



function parseOptionalPrice(

  value:

    | FormDataEntryValue

    | null

) {

  const raw =

    String(

      value ??

        ""

    ).trim();



  if (!raw) {

    return null;

  }



  const parsed =

    Number(

      raw

    );



  if (

    !Number.isFinite(

      parsed

    ) ||

    parsed <

      0

  ) {

    return null;

  }



  return Math.round(

    parsed

  );

}



function normalizeLink(

  value: string

) {

  const link =

    value.trim();



  if (!link) {

    return "";

  }



  if (

    link.startsWith(

      "/"

    )

  ) {

    return `${SITE_URL}${link}`;

  }



  return link;

}



export function PcBuilder({

  settings,

  categories,

  products,

  builds,

}: {

  settings: BuilderSettings;

  categories: BuilderCategory[];

  products: CatalogProduct[];

  builds: ReadyBuild[];

}) {

  const [

    mode,

    setMode,

  ] =

    useState<BuilderMode>(

      settings.showScratchBuilder

        ? "scratch"

        : "ready"

    );



  const [

    selections,

    setSelections,

  ] =

    useState<SelectionMap>(

      {}

    );



  const [

    activeCategory,

    setActiveCategory,

  ] =

    useState<BuilderCategory | null>(

      null

    );



  const [

    extras,

    setExtras,

  ] =

    useState<CustomExtra[]>(

      []

    );



  const [

    showExtraForm,

    setShowExtraForm,

  ] =

    useState(

      false

    );



  /* =======================================================

     PRODUCTS PER CATEGORY

     ======================================================= */



  const optionsByCategory =

    useMemo(

      () => {

        const result:

          Record<

            number,

            SelectableItem[]

          > = {};



        for (

          const category of

          categories

        ) {

          result[

            category.id

          ] =

            products

              .filter(

                (

                  product

                ) =>

                  productMatchesCategory(

                    category,

                    product

                  )

              )

              .map(

                (

                  product

                ) => ({

                  key:

                    `product-${product.id}`,

                  id:

                    product.id,

                  name:

                    product.name,

                  price:

                    product.price,

                  description:

                    product.description,

                  specs:

                    product.specs,

                  image:

                    product.image,

                  productUrl:

                    `/product/${product.id}`,

                  badge:

                    product.tag,

                })

              );

        }



        return result;

      },

      [

        categories,

        products,

      ]

    );



  const componentsTotal =

    useMemo(

      () =>

        Object.values(

          selections

        ).reduce(

          (

            sum,

            item

          ) =>

            sum +

            (

              item?.price ??

              0

            ),

          0

        ),

      [

        selections,

      ]

    );



  const extrasTotal =

    useMemo(

      () =>

        extras.reduce(

          (

            sum,

            extra

          ) =>

            sum +

            (

              extra.price ??

              0

            ),

          0

        ),

      [

        extras,

      ]

    );



  const total =

    componentsTotal +

    extrasTotal;



  const selectedCount =

    useMemo(

      () =>

        categories.filter(

          (

            category

          ) =>

            Boolean(

              selections[

                category.id

              ]

            )

        ).length,

      [

        categories,

        selections,

      ]

    );



  const activeItems =

    activeCategory

      ? optionsByCategory[

          activeCategory.id

        ] ??

        []

      : [];



  function selectListedItem(

    categoryId: number,

    item: SelectableItem

  ) {

    setSelections(

      (

        current

      ) => ({

        ...current,

        [categoryId]: {

          key:

            item.key,

          source:

            "product",

          categoryId,

          name:

            item.name,

          price:

            item.price,

          description:

            item.description,

          specs:

            item.specs,

          image:

            item.image,

          productUrl:

            item.productUrl,

          note:

            "",

        },

      })

    );



    setActiveCategory(

      null

    );

  }



  function selectCustomPart(

    categoryId: number,

    input: CustomPartInput

  ) {

    setSelections(

      (

        current

      ) => ({

        ...current,

        [categoryId]: {

          key:

            `custom-${createLocalId()}`,

          source:

            "custom",

          categoryId,

          name:

            input.name,

          price:

            input.price,

          description:

            input.note,

          specs:

            [],

          image:

            "",

          productUrl:

            input.productUrl,

          note:

            input.note,

        },

      })

    );



    setActiveCategory(

      null

    );

  }



  function removeItem(

    categoryId: number

  ) {

    setSelections(

      (

        current

      ) => {

        const next = {

          ...current,

        };



        delete next[

          categoryId

        ];



        return next;

      }

    );

  }



  function addExtra(

    input: CustomPartInput

  ) {

    setExtras(

      (

        current

      ) => [

        ...current,

        {

          id:

            createLocalId(),

          name:

            input.name,

          price:

            input.price,

          productUrl:

            input.productUrl,

          note:

            input.note,

        },

      ]

    );



    setShowExtraForm(

      false

    );

  }



  function removeExtra(

    id: string

  ) {

    setExtras(

      (

        current

      ) =>

        current.filter(

          (

            extra

          ) =>

            extra.id !==

            id

        )

    );

  }



  function clearBuild() {

    setSelections(

      {}

    );



    setExtras(

      []

    );

  }



  function createQuoteMessage() {

    const lines:

      string[] = [

      "Hi GameX, I want a quotation for this custom PC build:",

      "",

    ];



    categories.forEach(

      (

        category

      ) => {

        const selected =

          selections[

            category.id

          ];



        lines.push(

          `*${category.name}*`

        );



        if (

          selected

        ) {

          lines.push(

            selected.name

          );



          lines.push(

            selected.price ===

              null

              ? "Price on request"

              : formatPrice(

                  selected.price

                )

          );



          if (

            selected.source ===

            "custom"

          ) {

            lines.push(

              "Custom customer request"

            );

          }



          if (

            selected.note

          ) {

            lines.push(

              `Note: ${selected.note}`

            );

          }



          if (

            selected.productUrl

          ) {

            lines.push(

              normalizeLink(

                selected.productUrl

              )

            );

          }

        } else {

          lines.push(

            category.isRequired

              ? "Not selected (Required)"

              : "Not selected"

          );

        }



        lines.push(

          ""

        );

      }

    );



    lines.push(

      "*CUSTOM / EXTRA ITEMS*",

      ""

    );



    if (

      extras.length >

      0

    ) {

      extras.forEach(

        (

          extra,

          index

        ) => {

          lines.push(

            `${index + 1}. ${extra.name}`

          );



          lines.push(

            extra.price ===

              null

              ? "Price on request"

              : formatPrice(

                  extra.price

                )

          );



          if (

            extra.note

          ) {

            lines.push(

              `Note: ${extra.note}`

            );

          }



          if (

            extra.productUrl

          ) {

            lines.push(

              normalizeLink(

                extra.productUrl

              )

            );

          }



          lines.push(

            ""

          );

        }

      );

    } else {

      lines.push(

        "None",

        ""

      );

    }



    lines.push(

      "--------------------"

    );



    lines.push(

      `*TOTAL: ${formatPrice(

        total

      )}*`

    );



    lines.push(

      "",

      "Items with Price on request are not included in the calculated total.",

      "",

      `Builder: ${SITE_URL}/build-your-rig`

    );



    return lines.join(

      "\n"

    );

  }



  const quoteUrl =

    `https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(

      createQuoteMessage()

    )}`;



  return (

    <main

      className="

        min-h-screen

        bg-[#fff8f8]

        pb-28

        pt-20

        lg:pb-16

      "

    >

      <section className="border-b border-brand/10 bg-white">

        <div

          className="

            mx-auto

            max-w-7xl

            px-5

            py-8

            text-center

            md:px-8

            md:py-10

          "

        >

          <span

            className="

              inline-flex

              items-center

              gap-2

              rounded-full

              border

              border-brand/15

              bg-brand/[0.05]

              px-4

              py-2

              text-[10px]

              font-extrabold

              uppercase

              tracking-[0.2em]

              text-brand

            "

          >

            <Cpu className="h-4 w-4" />



            GameX PC Builder

          </span>



          <h1

            className="

              mx-auto

              mt-4

              max-w-4xl

              font-display

              text-3xl

              font-black

              uppercase

              text-brand-deep

              sm:text-4xl

              lg:text-5xl

            "

          >

            {

              settings.title

            }

          </h1>



          <p

            className="

              mx-auto

              mt-3

              max-w-2xl

              text-sm

              leading-7

              text-slate-500

            "

          >

            {

              settings.subtitle

            }

          </p>



          <div

            className="

              mx-auto

              mt-6

              inline-flex

              rounded-2xl

              border

              border-brand/10

              bg-[#fff8f8]

              p-1.5

            "

          >

            {settings.showReadyBuilds ? (

              <button

                type="button"

                onClick={() =>

                  setMode(

                    "ready"

                  )

                }

                className={`

                  rounded-xl

                  px-5

                  py-3

                  text-xs

                  font-bold

                  uppercase

                  ${

                    mode ===

                    "ready"

                      ? "bg-brand text-white"

                      : "text-slate-500"

                  }

                `}

              >

                {

                  settings.readyBuildsLabel

                }

              </button>

            ) : null}



            {settings.showScratchBuilder ? (

              <button

                type="button"

                onClick={() =>

                  setMode(

                    "scratch"

                  )

                }

                className={`

                  rounded-xl

                  px-5

                  py-3

                  text-xs

                  font-bold

                  uppercase

                  ${

                    mode ===

                    "scratch"

                      ? "bg-brand text-white"

                      : "text-slate-500"

                  }

                `}

              >

                {

                  settings.scratchBuilderLabel

                }

              </button>

            ) : null}

          </div>

        </div>

      </section>



      {mode ===

        "ready" ? (

        <ReadyBuilds

          builds={

            builds

          }

          whatsappNumber={

            settings.whatsappNumber

          }

        />

      ) : (

        <section

          className="

            mx-auto

            max-w-7xl

            px-5

            py-8

            md:px-8

          "

        >

          <div

            className="

              grid

              items-stretch

              gap-7

              lg:grid-cols-[minmax(0,1fr)_360px]

            "

          >

            <div className="flex min-w-0 flex-col">

              <div

                className="

                  mb-5

                  flex

                  items-end

                  justify-between

                  gap-4

                "

              >

                <div>

                  <p

                    className="

                      text-xs

                      font-bold

                      uppercase

                      tracking-[0.2em]

                      text-brand

                    "

                  >

                    Build From Scratch

                  </p>



                  <h2

                    className="

                      mt-1

                      font-display

                      text-2xl

                      font-extrabold

                      uppercase

                      text-brand-deep

                    "

                  >

                    Choose Your Components

                  </h2>

                </div>



                {selectedCount >

                  0 ||

                extras.length >

                  0 ? (

                  <button

                    type="button"

                    onClick={

                      clearBuild

                    }

                    className="

                      inline-flex

                      items-center

                      gap-2

                      rounded-xl

                      border

                      border-brand/15

                      px-4

                      py-2.5

                      text-xs

                      font-bold

                      uppercase

                      text-brand

                    "

                  >

                    <RotateCcw className="h-4 w-4" />



                    Clear

                  </button>

                ) : null}

              </div>



              <div className="space-y-3">

                {categories.map(

                  (

                    category,

                    index

                  ) => {

                    const selected =

                      selections[

                        category.id

                      ];



                    const options =

                      optionsByCategory[

                        category.id

                      ] ??

                      [];



                    return (

                      <div

                        key={

                          category.id

                        }

                        className="

                          rounded-2xl

                          border

                          border-brand/10

                          bg-white

                          p-5

                        "

                      >

                        <div

                          className="

                            flex

                            flex-col

                            gap-4

                            sm:flex-row

                            sm:items-center

                            sm:flex-wrap

                          "

                        >

                          <div

                            className="

                              grid

                              h-10

                              w-10

                              shrink-0

                              place-items-center

                              rounded-xl

                              bg-brand/[0.08]

                              font-display

                              text-sm

                              font-extrabold

                              text-brand

                            "

                          >

                            {String(

                              index +

                                1

                            ).padStart(

                              2,

                              "0"

                            )}

                          </div>



                          <div className="min-w-0 flex-1">

                            <div className="flex flex-wrap items-center gap-2">

                              <h3

                                className="

                                  font-display

                                  text-lg

                                  font-extrabold

                                  uppercase

                                  text-brand-deep

                                "

                              >

                                {

                                  category.name

                                }

                              </h3>



                              <span

                                className="

                                  rounded-full

                                  bg-brand/[0.07]

                                  px-2.5

                                  py-1

                                  text-[9px]

                                  font-bold

                                  uppercase

                                  text-brand

                                "

                              >

                                {category.isRequired

                                  ? "Required"

                                  : "Optional"}

                              </span>

                            </div>



                            <p className="mt-1 text-xs text-slate-400">

                              {

                                category.helpText

                              }

                            </p>



                            {!selected ? (

                              <p className="mt-2 text-xs font-semibold text-slate-500">

                                {options.length >

                                0

                                  ? `${options.length} product${

                                      options.length ===

                                      1

                                        ? ""

                                        : "s"

                                    } available`

                                  : `No products saved in "${category.slug}"`}

                              </p>

                            ) : null}

                          </div>



                          {selected ? (

                            <div

                              className="

                                flex

                                min-w-0

                                items-center

                                gap-3

                                rounded-xl

                                border

                                border-brand/10

                                bg-[#fff8f8]

                                p-3

                                sm:w-[310px]

                              "

                            >

                              <div

                                className="

                                  h-14

                                  w-14

                                  shrink-0

                                  overflow-hidden

                                  rounded-lg

                                  bg-white

                                "

                              >

                                {selected.image ? (

                                  // eslint-disable-next-line @next/next/no-img-element

                                  <img

                                    src={

                                      selected.image

                                    }

                                    alt={

                                      selected.name

                                    }

                                    className="

                                      h-full

                                      w-full

                                      object-contain

                                      p-1

                                    "

                                  />

                                ) : (

                                  <Package className="m-auto mt-4 h-5 w-5 text-slate-300" />

                                )}

                              </div>



                              <div className="min-w-0 flex-1">

                                <p className="line-clamp-2 text-xs font-bold text-brand-deep">

                                  {

                                    selected.name

                                  }

                                </p>



                                <p className="mt-1 text-xs font-bold text-brand">

                                  {selected.price ===

                                  null

                                    ? "Price on request"

                                    : formatPrice(

                                        selected.price

                                      )}

                                </p>

                              </div>

                            </div>

                          ) : null}



                          <div className="flex gap-2">

                            {selected ? (

                              <button

                                type="button"

                                onClick={() =>

                                  removeItem(

                                    category.id

                                  )

                                }

                                className="

                                  grid

                                  h-11

                                  w-11

                                  place-items-center

                                  rounded-xl

                                  border

                                  border-red-200

                                  bg-red-50

                                  text-red-500

                                "

                              >

                                <Trash2 className="h-4 w-4" />

                              </button>

                            ) : null}



                            <button

                              type="button"

                              onClick={() =>

                                setActiveCategory(

                                  category

                                )

                              }

                              className="

                                inline-flex

                                h-11

                                items-center

                                gap-2

                                rounded-xl

                                bg-brand

                                px-5

                                text-xs

                                font-bold

                                uppercase

                                text-white

                              "

                            >

                              {selected

                                ? "Change"

                                : "Select"}



                              <ChevronRight className="h-4 w-4" />

                            </button>

                          </div>

                        </div>

                      </div>

                    );

                  }

                )}

              </div>



              <div

                className="

                  mt-5

                  rounded-2xl

                  border

                  border-brand/10

                  bg-white

                "

              >

                <div

                  className="

                    flex

                    items-center

                    justify-between

                    gap-4

                    border-b

                    border-brand/10

                    p-5

                  "

                >

                  <div>

                    <h3

                      className="

                        font-display

                        text-lg

                        font-extrabold

                        uppercase

                        text-brand-deep

                      "

                    >

                      Extras

                    </h3>



                    <p className="mt-1 text-xs text-slate-400">

                      Add any additional custom item.

                    </p>

                  </div>



                  <button

                    type="button"

                    onClick={() =>

                      setShowExtraForm(

                        !showExtraForm

                      )

                    }

                    className="

                      inline-flex

                      items-center

                      gap-2

                      rounded-xl

                      border

                      border-brand/15

                      px-4

                      py-2.5

                      text-xs

                      font-bold

                      uppercase

                      text-brand

                    "

                  >

                    <Plus className="h-4 w-4" />



                    Add Extra

                  </button>

                </div>



                {extras.length >

                0 ? (

                  <div className="space-y-2 p-4">

                    {extras.map(

                      (

                        extra

                      ) => (

                        <div

                          key={

                            extra.id

                          }

                          className="

                            flex

                            items-center

                            justify-between

                            gap-3

                            rounded-xl

                            bg-[#fff8f8]

                            p-3

                          "

                        >

                          <div>

                            <p className="text-sm font-bold text-brand-deep">

                              {

                                extra.name

                              }

                            </p>



                            <p className="mt-1 text-xs font-bold text-brand">

                              {extra.price ===

                              null

                                ? "Price on request"

                                : formatPrice(

                                    extra.price

                                  )}

                            </p>

                          </div>



                          <button

                            type="button"

                            onClick={() =>

                              removeExtra(

                                extra.id

                              )

                            }

                            className="text-red-500"

                          >

                            <Trash2 className="h-4 w-4" />

                          </button>

                        </div>

                      )

                    )}

                  </div>

                ) : null}



                {showExtraForm ? (

                  <div className="border-t border-brand/10 p-5">

                    <CustomRequestForm

                      buttonText="Add Extra"

                      onSubmit={

                        addExtra

                      }

                      onCancel={() =>

                        setShowExtraForm(

                          false

                        )

                      }

                    />

                  </div>

                ) : null}

              </div>

            </div>



            <aside

              className="

                flex

                min-w-0

                self-stretch

              "

            >

              <BuildSummary

                categories={

                  categories

                }

                selections={

                  selections

                }

                extras={

                  extras

                }

                selectedCount={

                  selectedCount

                }

                total={

                  total

                }

                quoteUrl={

                  quoteUrl

                }

                quoteButtonText={

                  settings.quoteButtonText

                }

                onRemove={

                  removeItem

                }

              />

            </aside>

          </div>

        </section>

      )}



      {activeCategory ? (

        <ItemSelector

          category={

            activeCategory

          }

          items={

            activeItems

          }

          selectedItem={

            selections[

              activeCategory.id

            ]

          }

          onSelect={

            selectListedItem

          }

          onSelectCustom={

            selectCustomPart

          }

          onClose={() =>

            setActiveCategory(

              null

            )

          }

        />

      ) : null}

    </main>

  );

}



/* =========================================================

   READY BUILDS

   ========================================================= */



function ReadyBuilds({

  builds,

  whatsappNumber,

}: {

  builds: ReadyBuild[];

  whatsappNumber: string;

}) {

  return (

    <section className="mx-auto max-w-7xl px-5 py-10 md:px-8">

      <div className="mb-7">

        <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand">

          Ready To Order

        </p>



        <h2 className="mt-1 font-display text-2xl font-extrabold uppercase text-brand-deep">

          GameX Ready Builds

        </h2>

      </div>



      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">

        {builds.map(

          (

            build

          ) => {

            const url =

              `${SITE_URL}/build/${build.id}`;



            const whatsapp =

              `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(

                `Hi GameX, I want a quotation for ${build.name}.\n${url}`

              )}`;



            return (

              <article

                key={

                  build.id

                }

                className="overflow-hidden rounded-2xl border border-brand/10 bg-white"

              >

                <div className="aspect-[16/10] bg-[#f7f7f7] p-2">

                  {/* eslint-disable-next-line @next/next/no-img-element */}

                  <img

                    src={

                      build.image

                    }

                    alt={

                      build.name

                    }

                    className="h-full w-full object-contain"

                  />

                </div>



                <div className="p-5">

                  <h3 className="font-display text-xl font-extrabold uppercase text-brand-deep">

                    {

                      build.name

                    }

                  </h3>



                  <p className="mt-3 font-display text-xl font-bold text-brand">

                    {formatPrice(

                      build.price

                    )}

                  </p>



                  <div className="mt-4 space-y-2">

                    {build.specs

                      .slice(

                        0,

                        4

                      )

                      .map(

                        (

                          spec

                        ) => (

                          <div

                            key={

                              spec

                            }

                            className="flex items-start gap-2 text-xs text-slate-500"

                          >

                            <Check className="mt-0.5 h-3.5 w-3.5 text-brand" />



                            {

                              spec

                            }

                          </div>

                        )

                      )}

                  </div>



                  <div className="mt-5 grid gap-2 sm:grid-cols-2">

                    <Link

                      href={`/build/${build.id}`}

                      className="rounded-xl border border-brand/15 px-4 py-3 text-center text-xs font-bold uppercase text-brand"

                    >

                      View Build

                    </Link>



                    <a

                      href={

                        whatsapp

                      }

                      target="_blank"

                      rel="noopener noreferrer"

                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#25D366] px-4 py-3 text-xs font-bold uppercase text-white"

                    >

                      <FaWhatsapp className="h-4 w-4" />



                      Get Quote

                    </a>

                  </div>

                </div>

              </article>

            );

          }

        )}

      </div>

    </section>

  );

}



/* =========================================================

   BUILD SUMMARY

   ========================================================= */



function BuildSummary({

  categories,

  selections,

  extras,

  selectedCount,

  total,

  quoteUrl,

  quoteButtonText,

  onRemove,

}: {

  categories: BuilderCategory[];

  selections: SelectionMap;

  extras: CustomExtra[];

  selectedCount: number;

  total: number;

  quoteUrl: string;

  quoteButtonText: string;

  onRemove: (

    categoryId: number

  ) => void;

}) {

  return (

    <div

      className="

        flex

        min-w-0

        w-full

        flex-1

        flex-col

        overflow-hidden

        rounded-2xl

        border

        border-brand/10

        bg-white

      "

    >

      <div className="shrink-0 bg-brand p-5 text-white">

        <div className="flex items-center gap-3">

          <ShoppingCart className="h-5 w-5" />



          <div>

            <p className="text-[9px] uppercase text-white/60">

              Your Configuration

            </p>



            <h2 className="font-display text-lg font-extrabold uppercase">

              Build Summary

            </h2>

          </div>

        </div>



        <div className="mt-5 grid grid-cols-2 gap-3">

          <div className="rounded-xl bg-white/10 p-3">

            <p className="text-[9px] uppercase text-white/60">

              Selected

            </p>



            <p className="mt-1 break-words font-sans font-bold tabular-nums">

              {selectedCount}/

              {

                categories.length

              }

            </p>

          </div>



          <div className="rounded-xl bg-white/10 p-3">

            <p className="text-[9px] uppercase text-white/60">

              Total

            </p>



            <p className="mt-1 break-words font-sans font-bold tabular-nums">

              {formatPrice(

                total

              )}

            </p>

          </div>

        </div>

      </div>



      <div

        className="

          min-w-0

          flex-1

          space-y-2

          p-4

        "

      >

        {categories.map(

          (

            category

          ) => {

            const selected =

              selections[

                category.id

              ];



            return (

              <div

                key={

                  category.id

                }

                className="rounded-xl border border-black/[0.06] bg-[#fffafa] p-3"

              >

                <div className="flex items-start justify-between gap-3">

                  <div className="min-w-0 flex-1">

                    <p className="text-[9px] font-bold uppercase text-slate-400">

                      {

                        category.name

                      }

                    </p>



                    <p

                      className={`

                        mt-1

                        break-words

                        text-xs

                        font-semibold

                        ${

                          selected

                            ? "text-brand-deep"

                            : "text-slate-400"

                        }

                      `}

                    >

                      {selected

                        ? selected.name

                        : "Not selected"}

                    </p>



                    {selected ? (

                      <p className="mt-1 text-xs font-bold text-brand">

                        {selected.price ===

                        null

                          ? "Price on request"

                          : formatPrice(

                              selected.price

                            )}

                      </p>

                    ) : null}

                  </div>



                  {selected ? (

                    <button

                      type="button"

                      onClick={() =>

                        onRemove(

                          category.id

                        )

                      }

                    >

                      <X className="h-4 w-4 text-slate-400" />

                    </button>

                  ) : null}

                </div>

              </div>

            );

          }

        )}



        {extras.map(

          (

            extra

          ) => (

            <div

              key={

                extra.id

              }

              className="rounded-xl border border-brand/10 bg-[#fffafa] p-3"

            >

              <p className="text-[9px] font-bold uppercase text-brand">

                Extra

              </p>



              <p className="mt-1 break-words text-xs font-semibold text-brand-deep">

                {

                  extra.name

                }

              </p>

            </div>

          )

        )}

      </div>



      <div className="shrink-0 border-t border-brand/10 p-4">

        <div className="flex min-w-0 items-end justify-between gap-3">

          <div>

            <p className="text-[9px] font-bold uppercase text-slate-400">

              Build Total

            </p>



            <p className="break-words font-sans text-2xl font-bold text-brand-deep tabular-nums">

              {formatPrice(

                total

              )}

            </p>

          </div>



          <CircleDollarSign className="h-7 w-7 shrink-0 text-brand/30" />

        </div>



        <a

          href={

            quoteUrl

          }

          target="_blank"

          rel="noopener noreferrer"

          className="

            mt-4

            inline-flex

            w-full

            items-center

            justify-center

            gap-2

            rounded-xl

            bg-[#25D366]

            px-5

            py-3.5

            text-xs

            font-sans

            font-semibold

            leading-6

            tracking-wide

            text-white

          "

        >

          <FaWhatsapp className="h-5 w-5 shrink-0" />



          {

            quoteButtonText

          }

        </a>

      </div>

    </div>

  );

}



/* =========================================================

   ITEM SELECTOR

   ========================================================= */



function ItemSelector({

  category,

  items,

  selectedItem,

  onSelect,

  onSelectCustom,

  onClose,

}: {

  category: BuilderCategory;

  items: SelectableItem[];

  selectedItem:

    | SelectedPart

    | undefined;

  onSelect: (

    categoryId: number,

    item: SelectableItem

  ) => void;

  onSelectCustom: (

    categoryId: number,

    input: CustomPartInput

  ) => void;

  onClose: () => void;

}) {

  const [

    showCustom,

    setShowCustom,

  ] =

    useState(

      items.length ===

        0

    );



  return (

    <div

      className="

        fixed

        inset-0

        z-[100]

        flex

        items-center

        justify-center

        bg-black/55

        p-5

        backdrop-blur-sm

      "

      onMouseDown={(

        event

      ) => {

        if (

          event.target ===

          event.currentTarget

        ) {

          onClose();

        }

      }}

    >

      <div

        className="

          flex

          max-h-[92vh]

          w-full

          max-w-6xl

          flex-col

          overflow-hidden

          rounded-3xl

          bg-white

        "

      >

        <div

          className="

            flex

            shrink-0

            items-start

            justify-between

            border-b

            border-brand/10

            px-6

            py-5

          "

        >

          <div>

            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand">

              Select Component

            </p>



            <h2 className="mt-1 font-display text-2xl font-extrabold uppercase text-brand-deep">

              {

                category.name

              }

            </h2>



            <p className="mt-2 text-sm text-slate-500">

              {

                category.description

              }

            </p>

          </div>



          <button

            type="button"

            onClick={

              onClose

            }

            className="grid h-10 w-10 place-items-center rounded-xl bg-slate-100"

          >

            <X className="h-5 w-5" />

          </button>

        </div>



        <div

          data-lenis-prevent

          data-lenis-prevent-wheel

          className="

            min-h-0

            flex-1

            overflow-y-auto

            overscroll-contain

            bg-[#fff8f8]

            p-6

            [scrollbar-width:thin]

          "

        >

          {items.length >

          0 ? (

            <>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

                {items.map(

                  (

                    item

                  ) => {

                    const selected =

                      selectedItem?.key ===

                      item.key;



                    return (

                      <article

                        key={

                          item.key

                        }

                        className={`

                          flex

                          flex-col

                          overflow-hidden

                          rounded-2xl

                          border

                          bg-white

                          ${

                            selected

                              ? "border-brand"

                              : "border-brand/10"

                          }

                        `}

                      >

                        <div className="relative aspect-[16/10] bg-[#f5f5f5] p-2">

                          {item.image ? (

                            // eslint-disable-next-line @next/next/no-img-element

                            <img

                              src={

                                item.image

                              }

                              alt={

                                item.name

                              }

                              className="h-full w-full object-contain"

                            />

                          ) : (

                            <ImageIcon className="m-auto mt-16 h-10 w-10 text-slate-200" />

                          )}



                          {selected ? (

                            <span className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full bg-brand text-white">

                              <CheckCircle2 className="h-4 w-4" />

                            </span>

                          ) : null}

                        </div>



                        <div className="flex flex-1 flex-col p-4">

                          <h3 className="font-display text-base font-extrabold text-brand-deep">

                            {

                              item.name

                            }

                          </h3>



                          <p className="mt-2 font-display text-xl font-extrabold text-brand">

                            {item.price ===

                            null

                              ? "Price on request"

                              : formatPrice(

                                  item.price

                                )}

                          </p>



                          <div className="mt-3 space-y-1">

                            {item.specs

                              .slice(

                                0,

                                3

                              )

                              .map(

                                (

                                  spec

                                ) => (

                                  <div

                                    key={

                                      spec

                                    }

                                    className="flex gap-2 text-[11px] text-slate-500"

                                  >

                                    <Check className="h-3 w-3 shrink-0 text-brand" />



                                    <span className="line-clamp-1">

                                      {

                                        spec

                                      }

                                    </span>

                                  </div>

                                )

                              )}

                          </div>



                          <Link

                            href={

                              item.productUrl

                            }

                            target="_blank"

                            className="mt-3 inline-flex items-center gap-1 text-[10px] font-bold uppercase text-brand"

                          >

                            Product Details



                            <ExternalLink className="h-3 w-3" />

                          </Link>



                          <button

                            type="button"

                            onClick={() =>

                              onSelect(

                                category.id,

                                item

                              )

                            }

                            className="

                              mt-5

                              rounded-xl

                              bg-brand

                              px-4

                              py-3

                              text-xs

                              font-bold

                              uppercase

                              text-white

                            "

                          >

                            Select

                          </button>

                        </div>

                      </article>

                    );

                  }

                )}

              </div>



              <div className="mt-5 rounded-2xl border border-dashed border-brand/20 bg-white p-5">

                <div className="flex items-center justify-between gap-4">

                  <div>

                    <h3 className="font-display font-extrabold uppercase text-brand-deep">

                      Can&apos;t Find Your Part?

                    </h3>



                    <p className="mt-1 text-xs text-slate-400">

                      Enter a custom component request.

                    </p>

                  </div>



                  <button

                    type="button"

                    onClick={() =>

                      setShowCustom(

                        !showCustom

                      )

                    }

                    className="rounded-xl bg-brand px-4 py-2.5 text-xs font-bold uppercase text-white"

                  >

                    Custom Part

                  </button>

                </div>



                {showCustom ? (

                  <div className="mt-5 border-t border-brand/10 pt-5">

                    <CustomRequestForm

                      buttonText={`Use Custom ${category.name}`}

                      onSubmit={(

                        input

                      ) =>

                        onSelectCustom(

                          category.id,

                          input

                        )

                      }

                    />

                  </div>

                ) : null}

              </div>

            </>

          ) : (

            <div className="rounded-2xl border border-dashed border-brand/20 bg-white p-6">

              <div className="text-center">

                <Package className="mx-auto h-9 w-9 text-brand/30" />



                <h3 className="mt-3 font-display text-lg font-extrabold uppercase text-brand-deep">

                  No Products In This Category

                </h3>



                <p className="mx-auto mt-2 max-w-xl text-sm text-slate-400">

                  Builder category slug is{" "}



                  <strong className="text-brand">

                    {

                      category.slug

                    }

                  </strong>



                  . Only website products saved with this exact

                  category slug will appear here.

                </p>

              </div>



              <div className="mt-6 border-t border-brand/10 pt-6">

                <CustomRequestForm

                  buttonText={`Use Custom ${category.name}`}

                  onSubmit={(

                    input

                  ) =>

                    onSelectCustom(

                      category.id,

                      input

                    )

                  }

                />

              </div>

            </div>

          )}

        </div>

      </div>

    </div>

  );

}



/* =========================================================

   CUSTOM FORM

   ========================================================= */



function CustomRequestForm({

  buttonText,

  onSubmit,

  onCancel,

}: {

  buttonText: string;

  onSubmit: (

    input: CustomPartInput

  ) => void;

  onCancel?: () => void;

}) {

  function handleSubmit(

    event: FormEvent<HTMLFormElement>

  ) {

    event.preventDefault();



    const form =

      event.currentTarget;



    const data =

      new FormData(

        form

      );



    const name =

      String(

        data.get(

          "customName"

        ) ??

          ""

      ).trim();



    if (!name) {

      return;

    }



    onSubmit({

      name,

      price:

        parseOptionalPrice(

          data.get(

            "customPrice"

          )

        ),

      productUrl:

        String(

          data.get(

            "customProductUrl"

          ) ??

            ""

        ).trim(),

      note:

        String(

          data.get(

            "customNote"

          ) ??

            ""

        ).trim(),

    });



    form.reset();

  }



  return (

    <form

      onSubmit={

        handleSubmit

      }

    >

      <div className="grid gap-4 sm:grid-cols-2">

        <div>

          <label className="mb-2 block text-[10px] font-bold uppercase text-slate-500">

            Item / Component Name

          </label>



          <input

            name="customName"

            required

            className="w-full rounded-xl border border-brand/15 px-4 py-3 text-sm outline-none"

          />

        </div>



        <div>

          <label className="mb-2 block text-[10px] font-bold uppercase text-slate-500">

            Expected Price

          </label>



          <input

            name="customPrice"

            type="number"

            min="0"

            step="1"

            className="w-full rounded-xl border border-brand/15 px-4 py-3 text-sm outline-none"

          />

        </div>

      </div>



      <div className="mt-4">

        <label className="mb-2 block text-[10px] font-bold uppercase text-slate-500">

          Product / Reference Link

        </label>



        <input

          name="customProductUrl"

          className="w-full rounded-xl border border-brand/15 px-4 py-3 text-sm outline-none"

        />

      </div>



      <div className="mt-4">

        <label className="mb-2 block text-[10px] font-bold uppercase text-slate-500">

          Requirements / Note

        </label>



        <textarea

          name="customNote"

          rows={

            3

          }

          className="w-full rounded-xl border border-brand/15 px-4 py-3 text-sm outline-none"

        />

      </div>



      <div className="mt-4 flex justify-end gap-2">

        {onCancel ? (

          <button

            type="button"

            onClick={

              onCancel

            }

            className="rounded-xl border border-brand/15 px-4 py-3 text-xs font-bold uppercase text-brand"

          >

            Cancel

          </button>

        ) : null}



        <button

          type="submit"

          className="inline-flex items-center gap-2 rounded-xl bg-brand px-5 py-3 text-xs font-bold uppercase text-white"

        >

          <Plus className="h-4 w-4" />



          {

            buttonText

          }

        </button>

      </div>

    </form>

  );

}
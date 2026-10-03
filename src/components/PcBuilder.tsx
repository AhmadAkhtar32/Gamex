"use client";

import {
  useMemo,
  useState,
} from "react";

import Link from "next/link";

import {
  ArrowRight,
  Check,
  CheckCircle2,
  ChevronRight,
  CircleDollarSign,
  Cpu,
  ExternalLink,
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

/* =========================================================
   CONSTANTS
   ========================================================= */

const SITE_URL =
  "https://gamex.pk";

/* =========================================================
   TYPES
   ========================================================= */

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

type BuilderItem = {
  id: number;

  categoryId: number;

  name: string;

  price: number;

  description: string;

  specs: string[];

  image: string;

  productUrl: string;
};

type ReadyBuild = {
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

type BuilderMode =
  | "scratch"
  | "ready";

type SelectionMap =
  Record<
    number,
    BuilderItem | undefined
  >;

/* =========================================================
   MAIN COMPONENT
   ========================================================= */

export function PcBuilder({
  settings,
  categories,
  items,
  builds,
}: {
  settings: BuilderSettings;

  categories: BuilderCategory[];

  items: BuilderItem[];

  builds: ReadyBuild[];
}) {
  const initialMode:
    BuilderMode =
    settings.showScratchBuilder
      ? "scratch"
      : "ready";

  const [
    mode,
    setMode,
  ] =
    useState<BuilderMode>(
      initialMode
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

  /* =======================================================
     TOTAL
     ======================================================= */

  const total =
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

  /* =======================================================
     SELECTED COUNT
     ======================================================= */

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

  /* =======================================================
     CATEGORY ITEMS
     ======================================================= */

  const activeItems =
    activeCategory
      ? items.filter(
          (
            item
          ) =>
            item.categoryId ===
            activeCategory.id
        )
      : [];

  /* =======================================================
     SELECT ITEM
     ======================================================= */

  function selectItem(
    categoryId: number,
    item: BuilderItem
  ) {
    setSelections(
      (
        current
      ) => ({
        ...current,

        [categoryId]:
          item,
      })
    );

    setActiveCategory(
      null
    );
  }

  /* =======================================================
     REMOVE ITEM
     ======================================================= */

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

  /* =======================================================
     CLEAR BUILD
     ======================================================= */

  function clearBuild() {
    setSelections(
      {}
    );
  }

  /* =======================================================
     WHATSAPP QUOTE
     ======================================================= */

  function createQuoteMessage() {
    const lines: string[] =
      [
        "Hi GameX, I want a quotation for this custom PC build:",
        "",
      ];

    for (
      const category of
      categories
    ) {
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
          formatPrice(
            selected.price
          )
        );

        if (
          selected.productUrl
        ) {
          const link =
            selected.productUrl.startsWith(
              "/"
            )
              ? `${SITE_URL}${selected.productUrl}`
              : selected.productUrl;

          lines.push(
            link
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

    lines.push(
      "--------------------"
    );

    lines.push(
      `*TOTAL: ${formatPrice(
        total
      )}*`
    );

    lines.push(
      ""
    );

    lines.push(
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

  /* =======================================================
     RENDER
     ======================================================= */

  return (
    <main
      className="
        min-h-screen
        bg-[#fff8f8]
        pb-28
        pt-24
        lg:pb-16
      "
    >
      {/* =====================================================
          HERO
          ===================================================== */}

      <section
        className="
          border-b
          border-brand/10
          bg-white
        "
      >
        <div
          className="
            mx-auto
            max-w-7xl
            px-5
            py-10
            text-center
            md:px-8
            md:py-14
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
              leading-tight
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
              mt-4
              max-w-2xl
              text-sm
              leading-7
              text-slate-500
              md:text-base
            "
          >
            {
              settings.subtitle
            }
          </p>

          {/* ===============================================
              MODE TABS
              =============================================== */}

          <div
            className="
              mx-auto
              mt-7
              inline-flex
              max-w-full
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
                  px-4
                  py-3
                  text-xs
                  font-bold
                  uppercase
                  tracking-wider
                  transition-all
                  sm:px-6

                  ${
                    mode ===
                    "ready"
                      ? `
                        bg-brand
                        text-white
                        shadow-sm
                      `
                      : `
                        text-slate-500
                        hover:text-brand
                      `
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
                  px-4
                  py-3
                  text-xs
                  font-bold
                  uppercase
                  tracking-wider
                  transition-all
                  sm:px-6

                  ${
                    mode ===
                    "scratch"
                      ? `
                        bg-brand
                        text-white
                        shadow-sm
                      `
                      : `
                        text-slate-500
                        hover:text-brand
                      `
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

      {/* =====================================================
          READY BUILDS
          ===================================================== */}

      {mode ===
        "ready" &&
      settings.showReadyBuilds ? (
        <ReadyBuilds
          builds={
            builds
          }
          whatsappNumber={
            settings.whatsappNumber
          }
        />
      ) : null}

      {/* =====================================================
          SCRATCH BUILDER
          ===================================================== */}

      {mode ===
        "scratch" &&
      settings.showScratchBuilder ? (
        <section
          className="
            mx-auto
            max-w-7xl
            px-5
            py-8
            md:px-8
            md:py-10
          "
        >
          <div
            className="
              grid
              items-start
              gap-7
              lg:grid-cols-[minmax(0,1fr)_360px]
            "
          >
            {/* ===============================================
                LEFT
                =============================================== */}

            <div>
              <div
                className="
                  mb-5
                  flex
                  flex-wrap
                  items-end
                  justify-between
                  gap-3
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
                      bg-white
                      px-4
                      py-2.5
                      text-xs
                      font-bold
                      uppercase
                      tracking-wider
                      text-brand
                      transition-all
                      hover:border-brand
                    "
                  >
                    <RotateCcw className="h-4 w-4" />

                    Clear Build
                  </button>
                ) : null}
              </div>

              {/* =============================================
                  CATEGORY ROWS
                  ============================================= */}

              <div
                className="
                  space-y-3
                "
              >
                {categories.map(
                  (
                    category,
                    index
                  ) => {
                    const selected =
                      selections[
                        category.id
                      ];

                    const availableCount =
                      items.filter(
                        (
                          item
                        ) =>
                          item.categoryId ===
                          category.id
                      ).length;

                    return (
                      <div
                        key={
                          category.id
                        }
                        className="
                          overflow-hidden
                          rounded-2xl
                          border
                          border-brand/10
                          bg-white
                          shadow-[0_15px_45px_-40px_rgba(0,0,0,0.3)]
                        "
                      >
                        <div
                          className="
                            flex
                            flex-col
                            gap-4
                            p-4
                            sm:flex-row
                            sm:items-center
                            md:p-5
                          "
                        >
                          {/* NUMBER */}

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

                          {/* CATEGORY */}

                          <div
                            className="
                              min-w-0
                              flex-1
                            "
                          >
                            <div
                              className="
                                flex
                                flex-wrap
                                items-center
                                gap-2
                              "
                            >
                              <h3
                                className="
                                  font-display
                                  text-base
                                  font-extrabold
                                  uppercase
                                  text-brand-deep
                                  md:text-lg
                                "
                              >
                                {
                                  category.name
                                }
                              </h3>

                              <span
                                className={`
                                  rounded-full
                                  px-2.5
                                  py-1
                                  text-[9px]
                                  font-extrabold
                                  uppercase
                                  tracking-wider

                                  ${
                                    category.isRequired
                                      ? `
                                        bg-brand/[0.08]
                                        text-brand
                                      `
                                      : `
                                        bg-slate-100
                                        text-slate-500
                                      `
                                  }
                                `}
                              >
                                {category.isRequired
                                  ? "Required"
                                  : "Optional"}
                              </span>
                            </div>

                            {category.helpText ? (
                              <p
                                className="
                                  mt-1
                                  text-xs
                                  leading-relaxed
                                  text-slate-400
                                "
                              >
                                {
                                  category.helpText
                                }
                              </p>
                            ) : null}

                            {!selected ? (
                              <p
                                className="
                                  mt-2
                                  text-xs
                                  font-semibold
                                  text-slate-500
                                "
                              >
                                {availableCount >
                                0
                                  ? `${availableCount} option${
                                      availableCount ===
                                      1
                                        ? ""
                                        : "s"
                                    } available`
                                  : "No options available"}
                              </p>
                            ) : null}
                          </div>

                          {/* SELECTED */}

                          {selected ? (
                            <div
                              className="
                                flex
                                min-w-0
                                flex-1
                                items-center
                                gap-3
                                rounded-xl
                                border
                                border-brand/10
                                bg-[#fff8f8]
                                p-3
                                sm:max-w-[330px]
                              "
                            >
                              <div
                                className="
                                  grid
                                  h-14
                                  w-14
                                  shrink-0
                                  place-items-center
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
                                  <Package className="h-5 w-5 text-slate-300" />
                                )}
                              </div>

                              <div
                                className="
                                  min-w-0
                                  flex-1
                                "
                              >
                                <p
                                  className="
                                    line-clamp-2
                                    text-xs
                                    font-bold
                                    leading-relaxed
                                    text-brand-deep
                                  "
                                >
                                  {
                                    selected.name
                                  }
                                </p>

                                <p
                                  className="
                                    mt-1
                                    text-xs
                                    font-extrabold
                                    text-brand
                                  "
                                >
                                  {formatPrice(
                                    selected.price
                                  )}
                                </p>
                              </div>
                            </div>
                          ) : null}

                          {/* ACTION */}

                          <div
                            className="
                              flex
                              shrink-0
                              gap-2
                            "
                          >
                            {selected ? (
                              <button
                                type="button"
                                onClick={() =>
                                  removeItem(
                                    category.id
                                  )
                                }
                                title="Remove selection"
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
                                  transition-all
                                  hover:bg-red-100
                                "
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            ) : null}

                            <button
                              type="button"
                              disabled={
                                availableCount ===
                                0
                              }
                              onClick={() =>
                                setActiveCategory(
                                  category
                                )
                              }
                              className="
                                inline-flex
                                min-h-11
                                items-center
                                justify-center
                                gap-2
                                rounded-xl
                                bg-brand
                                px-5
                                text-xs
                                font-bold
                                uppercase
                                tracking-wider
                                text-white
                                transition-all
                                hover:bg-brand-soft
                                disabled:cursor-not-allowed
                                disabled:bg-slate-200
                                disabled:text-slate-400
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
            </div>

            {/* ===============================================
                DESKTOP SUMMARY
                =============================================== */}

            <aside
              className="
                hidden
                lg:sticky
                lg:top-24
                lg:block
              "
            >
              <BuildSummary
                categories={
                  categories
                }
                selections={
                  selections
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
      ) : null}

      {/* =====================================================
          MOBILE STICKY QUOTE
          ===================================================== */}

      {mode ===
        "scratch" &&
      settings.showScratchBuilder ? (
        <div
          className="
            fixed
            inset-x-0
            bottom-0
            z-40
            border-t
            border-brand/15
            bg-white/95
            p-3
            shadow-[0_-15px_40px_-30px_rgba(0,0,0,0.4)]
            backdrop-blur-lg
            lg:hidden
          "
        >
          <div
            className="
              mx-auto
              flex
              max-w-7xl
              items-center
              gap-3
            "
          >
            <div
              className="
                min-w-0
                flex-1
              "
            >
              <p
                className="
                  text-[9px]
                  font-bold
                  uppercase
                  tracking-wider
                  text-slate-400
                "
              >
                Build Total
              </p>

              <p
                className="
                  truncate
                  font-display
                  text-lg
                  font-extrabold
                  text-brand-deep
                "
              >
                {formatPrice(
                  total
                )}
              </p>
            </div>

            <a
              href={
                quoteUrl
              }
              target="_blank"
              rel="noopener noreferrer"
              className="
                inline-flex
                items-center
                justify-center
                gap-2
                rounded-xl
                bg-[#25D366]
                px-4
                py-3
                text-xs
                font-bold
                uppercase
                tracking-wider
                text-white
              "
            >
              <FaWhatsapp className="h-4 w-4" />

              Get Quote
            </a>
          </div>
        </div>
      ) : null}

      {/* =====================================================
          ITEM SELECTOR MODAL
          ===================================================== */}

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
            selectItem
          }
          onRemove={
            removeItem
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
    <section
      className="
        mx-auto
        max-w-7xl
        px-5
        py-10
        md:px-8
      "
    >
      <div
        className="
          mb-7
        "
      >
        <p
          className="
            text-xs
            font-bold
            uppercase
            tracking-[0.2em]
            text-brand
          "
        >
          Ready To Order
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
          GameX Ready Builds
        </h2>

        <p
          className="
            mt-2
            max-w-2xl
            text-sm
            text-slate-500
          "
        >
          Prefer a complete setup? Choose one of our existing GameX builds.
        </p>
      </div>

      {builds.length >
      0 ? (
        <div
          className="
            grid
            auto-rows-fr
            gap-5
            md:grid-cols-2
            xl:grid-cols-3
          "
        >
          {builds.map(
            (
              build
            ) => {
              const buildUrl =
                `${SITE_URL}/build/${build.id}`;

              const whatsappUrl =
                `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
                  `Hi GameX, I want a quotation for ${build.name}.\n\nBuild: ${buildUrl}\nPrice: ${formatPrice(
                    build.price
                  )}`
                )}`;

              return (
                <article
                  key={
                    build.id
                  }
                  className="
                    flex
                    h-full
                    flex-col
                    overflow-hidden
                    rounded-2xl
                    border
                    border-brand/10
                    bg-white
                    shadow-[0_20px_55px_-45px_rgba(0,0,0,0.35)]
                  "
                >
                  <div
                    className="
                      relative
                      aspect-[16/10]
                      bg-[#f6f6f6]
                      p-2
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
                      className="
                        h-full
                        w-full
                        object-contain
                      "
                    />

                    <span
                      className="
                        absolute
                        left-3
                        top-3
                        rounded-full
                        border
                        border-brand/15
                        bg-white/95
                        px-3
                        py-1.5
                        text-[9px]
                        font-bold
                        uppercase
                        tracking-wider
                        text-brand
                      "
                    >
                      {
                        build.badge
                      }
                    </span>
                  </div>

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
                        build.role
                      }
                    </p>

                    <h3
                      className="
                        mt-1
                        font-display
                        text-xl
                        font-extrabold
                        uppercase
                        text-brand-deep
                      "
                    >
                      {
                        build.name
                      }
                    </h3>

                    <div
                      className="
                        mt-4
                        rounded-xl
                        bg-brand
                        px-4
                        py-3
                        text-white
                      "
                    >
                      <p
                        className="
                          text-[9px]
                          font-bold
                          uppercase
                          tracking-wider
                          text-white/60
                        "
                      >
                        GameX Price
                      </p>

                      <p
                        className="
                          mt-1
                          font-display
                          text-2xl
                          font-extrabold
                        "
                      >
                        {formatPrice(
                          build.price
                        )}
                      </p>
                    </div>

                    <div
                      className="
                        mt-4
                        space-y-2
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
                            index
                          ) => (
                            <div
                              key={
                                index
                              }
                              className="
                                flex
                                items-start
                                gap-2
                                text-xs
                                text-slate-500
                              "
                            >
                              <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand" />

                              <span>
                                {
                                  spec
                                }
                              </span>
                            </div>
                          )
                        )}
                    </div>

                    <div
                      className="
                        mt-auto
                        grid
                        gap-2
                        pt-5
                        sm:grid-cols-2
                      "
                    >
                      <Link
                        href={`/build/${build.id}`}
                        className="
                          inline-flex
                          items-center
                          justify-center
                          gap-2
                          rounded-xl
                          border
                          border-brand/15
                          bg-[#fff8f8]
                          px-4
                          py-3
                          text-xs
                          font-bold
                          uppercase
                          tracking-wider
                          text-brand
                          transition-all
                          hover:border-brand
                        "
                      >
                        View Build

                        <ExternalLink className="h-4 w-4" />
                      </Link>

                      <a
                        href={
                          whatsappUrl
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="
                          inline-flex
                          items-center
                          justify-center
                          gap-2
                          rounded-xl
                          bg-[#25D366]
                          px-4
                          py-3
                          text-xs
                          font-bold
                          uppercase
                          tracking-wider
                          text-white
                        "
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
      ) : (
        <div
          className="
            rounded-2xl
            border
            border-dashed
            border-brand/20
            bg-white
            px-6
            py-12
            text-center
          "
        >
          <Package
            className="
              mx-auto
              h-8
              w-8
              text-brand/40
            "
          />

          <h3
            className="
              mt-3
              font-display
              text-lg
              font-extrabold
              uppercase
              text-brand-deep
            "
          >
            No Ready Builds
          </h3>
        </div>
      )}
    </section>
  );
}

/* =========================================================
   BUILD SUMMARY
   ========================================================= */

function BuildSummary({
  categories,
  selections,
  selectedCount,
  total,
  quoteUrl,
  quoteButtonText,
  onRemove,
}: {
  categories: BuilderCategory[];

  selections: SelectionMap;

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
        overflow-hidden
        rounded-2xl
        border
        border-brand/10
        bg-white
        shadow-[0_25px_70px_-50px_rgba(0,0,0,0.4)]
      "
    >
      <div
        className="
          bg-brand
          p-5
          text-white
        "
      >
        <div
          className="
            flex
            items-center
            gap-3
          "
        >
          <div
            className="
              grid
              h-10
              w-10
              place-items-center
              rounded-xl
              bg-white/15
            "
          >
            <ShoppingCart className="h-5 w-5" />
          </div>

          <div>
            <p
              className="
                text-[9px]
                font-bold
                uppercase
                tracking-[0.2em]
                text-white/60
              "
            >
              Your Configuration
            </p>

            <h2
              className="
                font-display
                text-lg
                font-extrabold
                uppercase
              "
            >
              Build Summary
            </h2>
          </div>
        </div>

        <div
          className="
            mt-5
            grid
            grid-cols-2
            gap-3
          "
        >
          <div
            className="
              rounded-xl
              bg-white/10
              p-3
            "
          >
            <p
              className="
                text-[9px]
                uppercase
                tracking-wider
                text-white/60
              "
            >
              Selected
            </p>

            <p
              className="
                mt-1
                font-display
                text-lg
                font-extrabold
              "
            >
              {selectedCount}/
              {
                categories.length
              }
            </p>
          </div>

          <div
            className="
              rounded-xl
              bg-white/10
              p-3
            "
          >
            <p
              className="
                text-[9px]
                uppercase
                tracking-wider
                text-white/60
              "
            >
              Total
            </p>

            <p
              className="
                mt-1
                font-display
                text-lg
                font-extrabold
              "
            >
              {formatPrice(
                total
              )}
            </p>
          </div>
        </div>
      </div>

      <div
        className="
          max-h-[50vh]
          space-y-2
          overflow-y-auto
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
                className="
                  rounded-xl
                  border
                  border-black/[0.06]
                  bg-[#fffafa]
                  p-3
                "
              >
                <div
                  className="
                    flex
                    items-start
                    justify-between
                    gap-3
                  "
                >
                  <div
                    className="
                      min-w-0
                    "
                  >
                    <p
                      className="
                        text-[9px]
                        font-bold
                        uppercase
                        tracking-wider
                        text-slate-400
                      "
                    >
                      {
                        category.name
                      }
                    </p>

                    {selected ? (
                      <>
                        <p
                          className="
                            mt-1
                            line-clamp-2
                            text-xs
                            font-bold
                            text-brand-deep
                          "
                        >
                          {
                            selected.name
                          }
                        </p>

                        <p
                          className="
                            mt-1
                            text-xs
                            font-extrabold
                            text-brand
                          "
                        >
                          {formatPrice(
                            selected.price
                          )}
                        </p>
                      </>
                    ) : (
                      <p
                        className="
                          mt-1
                          text-xs
                          font-semibold
                          text-slate-400
                        "
                      >
                        Not selected
                      </p>
                    )}
                  </div>

                  {selected ? (
                    <button
                      type="button"
                      onClick={() =>
                        onRemove(
                          category.id
                        )
                      }
                      className="
                        grid
                        h-7
                        w-7
                        shrink-0
                        place-items-center
                        rounded-lg
                        text-slate-400
                        transition-colors
                        hover:bg-red-50
                        hover:text-red-500
                      "
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  ) : null}
                </div>
              </div>
            );
          }
        )}
      </div>

      <div
        className="
          border-t
          border-brand/10
          p-4
        "
      >
        <div
          className="
            flex
            items-end
            justify-between
            gap-3
          "
        >
          <div>
            <p
              className="
                text-[9px]
                font-bold
                uppercase
                tracking-[0.18em]
                text-slate-400
              "
            >
              Build Total
            </p>

            <p
              className="
                mt-1
                font-display
                text-2xl
                font-extrabold
                text-brand-deep
              "
            >
              {formatPrice(
                total
              )}
            </p>
          </div>

          <CircleDollarSign className="h-7 w-7 text-brand/30" />
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
            text-center
            text-xs
            font-bold
            uppercase
            tracking-wider
            text-white
            transition-all
            hover:-translate-y-0.5
            hover:bg-[#1ebe5d]
          "
        >
          <FaWhatsapp className="h-5 w-5" />

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
  onRemove,
  onClose,
}: {
  category: BuilderCategory;

  items: BuilderItem[];

  selectedItem:
    | BuilderItem
    | undefined;

  onSelect: (
    categoryId: number,
    item: BuilderItem
  ) => void;

  onRemove: (
    categoryId: number
  ) => void;

  onClose: () => void;
}) {
  return (
    <div
      className="
        fixed
        inset-0
        z-[100]
        flex
        items-end
        justify-center
        bg-black/55
        p-0
        backdrop-blur-sm
        sm:items-center
        sm:p-5
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
          max-h-[90vh]
          w-full
          max-w-5xl
          flex-col
          overflow-hidden
          rounded-t-3xl
          bg-white
          shadow-2xl
          sm:rounded-3xl
        "
      >
        {/* HEADER */}

        <div
          className="
            flex
            items-start
            justify-between
            gap-4
            border-b
            border-brand/10
            px-5
            py-5
            sm:px-6
          "
        >
          <div>
            <div
              className="
                flex
                flex-wrap
                items-center
                gap-2
              "
            >
              <p
                className="
                  text-[10px]
                  font-bold
                  uppercase
                  tracking-[0.2em]
                  text-brand
                "
              >
                Select Component
              </p>

              <span
                className="
                  rounded-full
                  bg-brand/[0.07]
                  px-2.5
                  py-1
                  text-[9px]
                  font-bold
                  uppercase
                  tracking-wider
                  text-brand
                "
              >
                {category.isRequired
                  ? "Required"
                  : "Optional"}
              </span>
            </div>

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
              {
                category.name
              }
            </h2>

            {category.description ? (
              <p
                className="
                  mt-2
                  text-sm
                  text-slate-500
                "
              >
                {
                  category.description
                }
              </p>
            ) : null}
          </div>

          <button
            type="button"
            onClick={
              onClose
            }
            className="
              grid
              h-10
              w-10
              shrink-0
              place-items-center
              rounded-xl
              bg-slate-100
              text-slate-500
              transition-colors
              hover:bg-brand
              hover:text-white
            "
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* ITEMS */}

        <div
          className="
            flex-1
            overflow-y-auto
            bg-[#fff8f8]
            p-4
            sm:p-6
          "
        >
          {items.length >
          0 ? (
            <div
              className="
                grid
                auto-rows-fr
                gap-4
                sm:grid-cols-2
                lg:grid-cols-3
              "
            >
              {items.map(
                (
                  item
                ) => {
                  const isSelected =
                    selectedItem?.id ===
                    item.id;

                  return (
                    <article
                      key={
                        item.id
                      }
                      className={`
                        flex
                        h-full
                        flex-col
                        overflow-hidden
                        rounded-2xl
                        border
                        bg-white
                        transition-all

                        ${
                          isSelected
                            ? `
                              border-brand
                              shadow-[0_18px_45px_-35px_rgba(230,0,0,0.65)]
                            `
                            : `
                              border-brand/10
                              hover:border-brand/35
                            `
                        }
                      `}
                    >
                      {/* IMAGE */}

                      <div
                        className="
                          relative
                          aspect-[16/10]
                          bg-[#f5f5f5]
                          p-2
                        "
                      >
                        {item.image ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={
                              item.image
                            }
                            alt={
                              item.name
                            }
                            className="
                              h-full
                              w-full
                              object-contain
                            "
                          />
                        ) : (
                          <div
                            className="
                              grid
                              h-full
                              place-items-center
                            "
                          >
                            <Package className="h-10 w-10 text-slate-200" />
                          </div>
                        )}

                        {isSelected ? (
                          <span
                            className="
                              absolute
                              right-3
                              top-3
                              grid
                              h-8
                              w-8
                              place-items-center
                              rounded-full
                              bg-brand
                              text-white
                            "
                          >
                            <CheckCircle2 className="h-4 w-4" />
                          </span>
                        ) : null}
                      </div>

                      {/* INFO */}

                      <div
                        className="
                          flex
                          flex-1
                          flex-col
                          p-4
                        "
                      >
                        <h3
                          className="
                            line-clamp-2
                            min-h-[2.5rem]
                            font-display
                            text-base
                            font-extrabold
                            leading-tight
                            text-brand-deep
                          "
                        >
                          {
                            item.name
                          }
                        </h3>

                        <p
                          className="
                            mt-2
                            font-display
                            text-xl
                            font-extrabold
                            text-brand
                          "
                        >
                          {formatPrice(
                            item.price
                          )}
                        </p>

                        {item.specs.length >
                        0 ? (
                          <div
                            className="
                              mt-3
                              space-y-1.5
                            "
                          >
                            {item.specs
                              .slice(
                                0,
                                3
                              )
                              .map(
                                (
                                  spec,
                                  index
                                ) => (
                                  <div
                                    key={
                                      index
                                    }
                                    className="
                                      flex
                                      items-start
                                      gap-2
                                      text-[11px]
                                      text-slate-500
                                    "
                                  >
                                    <Check className="mt-0.5 h-3 w-3 shrink-0 text-brand" />

                                    <span
                                      className="
                                        line-clamp-1
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
                        ) : null}

                        {item.productUrl ? (
                          <a
                            href={
                              item.productUrl
                            }
                            target={
                              item.productUrl.startsWith(
                                "http"
                              )
                                ? "_blank"
                                : undefined
                            }
                            rel={
                              item.productUrl.startsWith(
                                "http"
                              )
                                ? "noopener noreferrer"
                                : undefined
                            }
                            onClick={(
                              event
                            ) =>
                              event.stopPropagation()
                            }
                            className="
                              mt-3
                              inline-flex
                              items-center
                              gap-1.5
                              text-[10px]
                              font-bold
                              uppercase
                              tracking-wider
                              text-brand
                              hover:underline
                            "
                          >
                            Product Details

                            <ExternalLink className="h-3 w-3" />
                          </a>
                        ) : null}

                        <button
                          type="button"
                          onClick={() =>
                            onSelect(
                              category.id,
                              item
                            )
                          }
                          className={`
                            mt-auto
                            flex
                            w-full
                            items-center
                            justify-center
                            gap-2
                            rounded-xl
                            px-4
                            py-3
                            pt-3
                            text-xs
                            font-bold
                            uppercase
                            tracking-wider
                            transition-all

                            ${
                              isSelected
                                ? `
                                  bg-brand
                                  text-white
                                `
                                : `
                                  border
                                  border-brand/15
                                  bg-[#fff8f8]
                                  text-brand
                                  hover:border-brand
                                  hover:bg-brand
                                  hover:text-white
                                `
                            }
                          `}
                        >
                          {isSelected ? (
                            <>
                              <Check className="h-4 w-4" />

                              Selected
                            </>
                          ) : (
                            <>
                              <Plus className="h-4 w-4" />

                              Select
                            </>
                          )}
                        </button>
                      </div>
                    </article>
                  );
                }
              )}
            </div>
          ) : (
            <div
              className="
                rounded-2xl
                border
                border-dashed
                border-brand/20
                bg-white
                px-6
                py-12
                text-center
              "
            >
              <Package className="mx-auto h-8 w-8 text-brand/30" />

              <p
                className="
                  mt-3
                  font-display
                  text-lg
                  font-extrabold
                  uppercase
                  text-brand-deep
                "
              >
                No Options Available
              </p>

              <p
                className="
                  mt-2
                  text-sm
                  text-slate-400
                "
              >
                GameX has not added any visible items to this category yet.
              </p>
            </div>
          )}
        </div>

        {/* OPTIONAL SKIP */}

        <div
          className="
            flex
            flex-wrap
            items-center
            justify-between
            gap-3
            border-t
            border-brand/10
            bg-white
            px-5
            py-4
            sm:px-6
          "
        >
          <p
            className="
              text-xs
              text-slate-400
            "
          >
            {category.isRequired
              ? "This category is marked as required by GameX."
              : "This category is optional and can be skipped."}
          </p>

          <div
            className="
              flex
              gap-2
            "
          >
            {selectedItem ? (
              <button
                type="button"
                onClick={() => {
                  onRemove(
                    category.id
                  );

                  onClose();
                }}
                className="
                  rounded-xl
                  border
                  border-red-200
                  bg-red-50
                  px-4
                  py-2.5
                  text-xs
                  font-bold
                  uppercase
                  tracking-wider
                  text-red-600
                "
              >
                Remove
              </button>
            ) : null}

            {!category.isRequired ? (
              <button
                type="button"
                onClick={
                  onClose
                }
                className="
                  rounded-xl
                  border
                  border-brand/15
                  bg-white
                  px-4
                  py-2.5
                  text-xs
                  font-bold
                  uppercase
                  tracking-wider
                  text-brand
                "
              >
                Skip
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
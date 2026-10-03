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

type SelectedPart = {
  key: string;

  source:
    | "catalog"
    | "custom";

  catalogId?:
    number;

  categoryId:
    number;

  name:
    string;

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
   HELPERS
   ========================================================= */

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
      value ?? ""
    ).trim();

  if (!raw) {
    return null;
  }

  const parsed =
    Number(raw);

  if (
    !Number.isFinite(
      parsed
    ) ||
    parsed < 0
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
    useState(false);

  /* =======================================================
     TOTAL
     ======================================================= */

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
     SELECT CATALOG ITEM
     ======================================================= */

  function selectCatalogItem(
    categoryId: number,
    item: BuilderItem
  ) {
    const selected:
      SelectedPart = {
      key:
        `catalog-${item.id}`,

      source:
        "catalog",

      catalogId:
        item.id,

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
    };

    setSelections(
      (
        current
      ) => ({
        ...current,

        [categoryId]:
          selected,
      })
    );

    setActiveCategory(
      null
    );
  }

  /* =======================================================
     SELECT CUSTOM PART
     ======================================================= */

  function selectCustomPart(
    categoryId: number,
    input: CustomPartInput
  ) {
    const selected:
      SelectedPart = {
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
    };

    setSelections(
      (
        current
      ) => ({
        ...current,

        [categoryId]:
          selected,
      })
    );

    setActiveCategory(
      null
    );
  }

  /* =======================================================
     REMOVE COMPONENT
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
     ADD EXTRA
     ======================================================= */

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

  /* =======================================================
     REMOVE EXTRA
     ======================================================= */

  function removeExtra(
    extraId: string
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
            extraId
        )
    );
  }

  /* =======================================================
     CLEAR BUILD
     ======================================================= */

  function clearBuild() {
    setSelections(
      {}
    );

    setExtras(
      []
    );

    setShowExtraForm(
      false
    );
  }

  /* =======================================================
     WHATSAPP QUOTE
     ======================================================= */

  function createQuoteMessage() {
    const lines:
      string[] = [
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

    /* =====================================================
       EXTRAS
       ===================================================== */

    lines.push(
      "*CUSTOM / EXTRA ITEMS*"
    );

    lines.push(
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
        "None"
      );

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
      "Items marked Price on request are not included in the calculated total."
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
        pt-20
        lg:pb-16
      "
    >
      {/* =====================================================
          BUILDER HERO
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
              mt-3
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
              mt-6
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
                        hover:bg-white
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
                        hover:bg-white
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
          BUILD FROM SCRATCH
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
                      hover:bg-brand
                      hover:text-white
                    "
                  >
                    <RotateCcw className="h-4 w-4" />

                    Clear Build
                  </button>
                ) : null}
              </div>

              {/* =============================================
                  COMPONENT ROWS
                  ============================================= */}

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

                          {/* CATEGORY INFO */}

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
                                  : "No listed options — custom selection available"}
                              </p>
                            ) : null}
                          </div>

                          {/* SELECTED PART */}

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
                                  {selected.price ===
                                  null
                                    ? "Price on request"
                                    : formatPrice(
                                        selected.price
                                      )}
                                </p>

                                {selected.source ===
                                "custom" ? (
                                  <p
                                    className="
                                      mt-1
                                      text-[9px]
                                      font-bold
                                      uppercase
                                      tracking-wider
                                      text-slate-400
                                    "
                                  >
                                    Custom Request
                                  </p>
                                ) : null}
                              </div>
                            </div>
                          ) : null}

                          {/* ACTIONS */}

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

                            {/* SELECT IS NEVER DISABLED */}

                            <button
                              type="button"
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
                                hover:-translate-y-0.5
                                hover:bg-brand-soft
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

              {/* =============================================
                  EXTRAS
                  ============================================= */}

              <div
                className="
                  mt-5
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
                    flex-wrap
                    items-center
                    justify-between
                    gap-4
                    border-b
                    border-brand/10
                    px-5
                    py-4
                  "
                >
                  <div>
                    <div
                      className="
                        flex
                        items-center
                        gap-2
                      "
                    >
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

                      <span
                        className="
                          rounded-full
                          bg-slate-100
                          px-2.5
                          py-1
                          text-[9px]
                          font-bold
                          uppercase
                          tracking-wider
                          text-slate-500
                        "
                      >
                        Optional
                      </span>
                    </div>

                    <p
                      className="
                        mt-1
                        text-xs
                        text-slate-400
                      "
                    >
                      Fans, accessories, cables or anything else you want with the build.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      setShowExtraForm(
                        (
                          current
                        ) =>
                          !current
                      )
                    }
                    className="
                      inline-flex
                      items-center
                      gap-2
                      rounded-xl
                      border
                      border-brand/15
                      bg-[#fff8f8]
                      px-4
                      py-2.5
                      text-xs
                      font-bold
                      uppercase
                      tracking-wider
                      text-brand
                      transition-all
                      hover:border-brand
                      hover:bg-brand
                      hover:text-white
                    "
                  >
                    {showExtraForm ? (
                      <X className="h-4 w-4" />
                    ) : (
                      <Plus className="h-4 w-4" />
                    )}

                    {showExtraForm
                      ? "Close"
                      : "Add Extra"}
                  </button>
                </div>

                {/* EXTRA LIST */}

                {extras.length >
                0 ? (
                  <div
                    className="
                      space-y-2
                      p-4
                    "
                  >
                    {extras.map(
                      (
                        extra,
                        index
                      ) => (
                        <div
                          key={
                            extra.id
                          }
                          className="
                            flex
                            items-center
                            gap-3
                            rounded-xl
                            border
                            border-black/[0.06]
                            bg-[#fffafa]
                            p-3
                          "
                        >
                          <div
                            className="
                              grid
                              h-9
                              w-9
                              shrink-0
                              place-items-center
                              rounded-lg
                              bg-brand/[0.08]
                              text-xs
                              font-extrabold
                              text-brand
                            "
                          >
                            {index +
                              1}
                          </div>

                          <div
                            className="
                              min-w-0
                              flex-1
                            "
                          >
                            <p
                              className="
                                text-sm
                                font-bold
                                text-brand-deep
                              "
                            >
                              {
                                extra.name
                              }
                            </p>

                            <p
                              className="
                                mt-0.5
                                text-xs
                                font-bold
                                text-brand
                              "
                            >
                              {extra.price ===
                              null
                                ? "Price on request"
                                : formatPrice(
                                    extra.price
                                  )}
                            </p>

                            {extra.note ? (
                              <p
                                className="
                                  mt-1
                                  line-clamp-1
                                  text-[10px]
                                  text-slate-400
                                "
                              >
                                {
                                  extra.note
                                }
                              </p>
                            ) : null}
                          </div>

                          <button
                            type="button"
                            onClick={() =>
                              removeExtra(
                                extra.id
                              )
                            }
                            className="
                              grid
                              h-9
                              w-9
                              place-items-center
                              rounded-lg
                              text-slate-400
                              transition-colors
                              hover:bg-red-50
                              hover:text-red-500
                            "
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      )
                    )}
                  </div>
                ) : (
                  <div
                    className="
                      px-5
                      py-5
                      text-sm
                      italic
                      text-slate-400
                    "
                  >
                    No extra items added.
                  </div>
                )}

                {/* ADD EXTRA FORM */}

                {showExtraForm ? (
                  <div
                    className="
                      border-t
                      border-brand/10
                      bg-[#fffafa]
                      p-5
                    "
                  >
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

            {/* ===============================================
                DESKTOP BUILD SUMMARY
                =============================================== */}

            <aside
              className="
                hidden
                lg:sticky
                lg:top-24
                lg:block
                lg:self-start
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
                onRemoveExtra={
                  removeExtra
                }
              />
            </aside>
          </div>
        </section>
      ) : null}

      {/* =====================================================
          MOBILE BOTTOM BAR
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
          SELECTOR MODAL
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
          onSelectCatalog={
            selectCatalogItem
          }
          onSelectCustom={
            selectCustomPart
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
      <div className="mb-7">
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
          Choose one of our existing complete gaming PC builds.
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
                          transition-all
                          hover:bg-[#1ebe5d]
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
          <Package className="mx-auto h-8 w-8 text-brand/40" />

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
  extras,
  selectedCount,
  total,
  quoteUrl,
  quoteButtonText,
  onRemove,
  onRemoveExtra,
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

  onRemoveExtra: (
    extraId: string
  ) => void;
}) {
  return (
    <div
      className="
        flex
        h-[calc(100vh-7rem)]
        min-h-0
        flex-col
        overflow-hidden
        rounded-2xl
        border
        border-brand/10
        bg-white
        shadow-[0_25px_70px_-50px_rgba(0,0,0,0.4)]
      "
    >
      {/* ===================================================
          FIXED HEADER
          =================================================== */}

      <div
        className="
          shrink-0
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

      {/* ===================================================
          SCROLLABLE SUMMARY
          =================================================== */}

      <div
        className="
          min-h-0
          flex-1
          space-y-2
          overflow-y-scroll
          overscroll-contain
          p-4
          pr-3
          [scrollbar-width:thin]
        "
        style={{
          scrollbarGutter:
            "stable",
        }}
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
                  <div className="min-w-0">
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
                          {selected.price ===
                          null
                            ? "Price on request"
                            : formatPrice(
                                selected.price
                              )}
                        </p>

                        {selected.source ===
                        "custom" ? (
                          <p
                            className="
                              mt-1
                              text-[8px]
                              font-bold
                              uppercase
                              tracking-wider
                              text-slate-400
                            "
                          >
                            Custom Request
                          </p>
                        ) : null}
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

        {/* ===============================================
            EXTRAS SUMMARY
            =============================================== */}

        {extras.length >
        0 ? (
          <div
            className="
              mt-3
              rounded-xl
              border
              border-brand/10
              bg-brand/[0.025]
              p-3
            "
          >
            <p
              className="
                text-[9px]
                font-bold
                uppercase
                tracking-wider
                text-brand
              "
            >
              Extras
            </p>

            <div
              className="
                mt-2
                space-y-2
              "
            >
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
                      items-start
                      justify-between
                      gap-2
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
                          text-xs
                          font-bold
                          text-brand-deep
                        "
                      >
                        {
                          extra.name
                        }
                      </p>

                      <p
                        className="
                          mt-0.5
                          text-[10px]
                          font-bold
                          text-brand
                        "
                      >
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
                        onRemoveExtra(
                          extra.id
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
                        hover:bg-red-50
                        hover:text-red-500
                      "
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                )
              )}
            </div>
          </div>
        ) : null}
      </div>

      {/* ===================================================
          FIXED FOOTER
          =================================================== */}

      <div
        className="
          shrink-0
          border-t
          border-brand/10
          bg-white
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
   ITEM SELECTOR MODAL
   ========================================================= */

function ItemSelector({
  category,
  items,
  selectedItem,
  onSelectCatalog,
  onSelectCustom,
  onRemove,
  onClose,
}: {
  category: BuilderCategory;

  items: BuilderItem[];

  selectedItem:
    | SelectedPart
    | undefined;

  onSelectCatalog: (
    categoryId: number,
    item: BuilderItem
  ) => void;

  onSelectCustom: (
    categoryId: number,
    input: CustomPartInput
  ) => void;

  onRemove: (
    categoryId: number
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
          max-h-[92vh]
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
        {/* =================================================
            MODAL HEADER
            ================================================= */}

        <div
          className="
            flex
            shrink-0
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
                className={`
                  rounded-full
                  px-2.5
                  py-1
                  text-[9px]
                  font-bold
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

        {/* =================================================
            SCROLLABLE MODAL BODY
            ================================================= */}

        <div
          className="
            min-h-0
            flex-1
            overflow-y-auto
            overscroll-contain
            bg-[#fff8f8]
            p-4
            sm:p-6
          "
        >
          {items.length >
          0 ? (
            <>
              {/* =============================================
                  ADMIN ITEMS
                  ============================================= */}

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
                      selectedItem
                        ?.source ===
                        "catalog" &&
                      selectedItem
                        .catalogId ===
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
                              <ImageIcon className="h-10 w-10 text-slate-200" />
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

                        {/* CONTENT */}

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
                              onSelectCatalog(
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

              {/* =============================================
                  CUSTOM COMPONENT
                  ============================================= */}

              <div
                className="
                  mt-5
                  rounded-2xl
                  border
                  border-dashed
                  border-brand/20
                  bg-white
                  p-5
                "
              >
                <div
                  className="
                    flex
                    flex-wrap
                    items-center
                    justify-between
                    gap-4
                  "
                >
                  <div>
                    <p
                      className="
                        font-display
                        text-base
                        font-extrabold
                        uppercase
                        text-brand-deep
                      "
                    >
                      Can&apos;t Find Your Part?
                    </p>

                    <p
                      className="
                        mt-1
                        text-xs
                        text-slate-400
                      "
                    >
                      Enter your own requested component and GameX will quote it.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      setShowCustom(
                        (
                          current
                        ) =>
                          !current
                      )
                    }
                    className="
                      inline-flex
                      items-center
                      gap-2
                      rounded-xl
                      bg-brand
                      px-4
                      py-2.5
                      text-xs
                      font-bold
                      uppercase
                      tracking-wider
                      text-white
                      transition-all
                      hover:bg-brand-soft
                    "
                  >
                    {showCustom ? (
                      <X className="h-4 w-4" />
                    ) : (
                      <Plus className="h-4 w-4" />
                    )}

                    {showCustom
                      ? "Close"
                      : "Custom Part"}
                  </button>
                </div>

                {showCustom ? (
                  <div
                    className="
                      mt-5
                      border-t
                      border-brand/10
                      pt-5
                    "
                  >
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
            /* ===============================================
               ZERO ADMIN ITEMS
               =============================================== */

            <div
              className="
                rounded-2xl
                border
                border-dashed
                border-brand/20
                bg-white
                p-6
              "
            >
              <div className="text-center">
                <Package className="mx-auto h-9 w-9 text-brand/30" />

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
                  No Listed Options Yet
                </p>

                <p
                  className="
                    mx-auto
                    mt-2
                    max-w-lg
                    text-sm
                    leading-6
                    text-slate-400
                  "
                >
                  GameX has not added any listed item to this category yet.
                  Enter the component you want below.
                </p>
              </div>

              <div
                className="
                  mt-6
                  border-t
                  border-brand/10
                  pt-6
                "
              >
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

        {/* =================================================
            MODAL FOOTER
            ================================================= */}

        <div
          className="
            flex
            shrink-0
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
              ? "This category is marked as required."
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

/* =========================================================
   CUSTOM REQUEST FORM
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

    const formData =
      new FormData(
        form
      );

    const name =
      String(
        formData.get(
          "customName"
        ) ?? ""
      ).trim();

    if (!name) {
      return;
    }

    const productUrl =
      String(
        formData.get(
          "customProductUrl"
        ) ?? ""
      ).trim();

    const note =
      String(
        formData.get(
          "customNote"
        ) ?? ""
      ).trim();

    const price =
      parseOptionalPrice(
        formData.get(
          "customPrice"
        )
      );

    onSubmit({
      name,
      price,
      productUrl,
      note,
    });

    form.reset();
  }

  return (
    <form
      onSubmit={
        handleSubmit
      }
    >
      <div
        className="
          grid
          gap-4
          sm:grid-cols-2
        "
      >
        {/* NAME */}

        <div>
          <label
            className="
              mb-2
              block
              text-[10px]
              font-bold
              uppercase
              tracking-wider
              text-slate-500
            "
          >
            Item / Component Name
          </label>

          <input
            name="customName"
            required
            placeholder="e.g. ASUS RTX 4070 Super"
            className="
              w-full
              rounded-xl
              border
              border-brand/15
              bg-white
              px-4
              py-3
              text-sm
              text-brand-deep
              outline-none
              transition-all
              placeholder:text-slate-400
              focus:border-brand
              focus:shadow-[0_0_0_3px_rgba(230,0,0,0.08)]
            "
          />
        </div>

        {/* PRICE */}

        <div>
          <label
            className="
              mb-2
              block
              text-[10px]
              font-bold
              uppercase
              tracking-wider
              text-slate-500
            "
          >
            Expected Price
          </label>

          <input
            name="customPrice"
            type="number"
            min="0"
            step="1"
            placeholder="Optional"
            className="
              w-full
              rounded-xl
              border
              border-brand/15
              bg-white
              px-4
              py-3
              text-sm
              text-brand-deep
              outline-none
              transition-all
              placeholder:text-slate-400
              focus:border-brand
              focus:shadow-[0_0_0_3px_rgba(230,0,0,0.08)]
            "
          />

          <p
            className="
              mt-1.5
              text-[10px]
              text-slate-400
            "
          >
            Leave empty if GameX should provide the price.
          </p>
        </div>
      </div>

      {/* LINK */}

      <div className="mt-4">
        <label
          className="
            mb-2
            block
            text-[10px]
            font-bold
            uppercase
            tracking-wider
            text-slate-500
          "
        >
          Product / Reference Link
        </label>

        <input
          name="customProductUrl"
          placeholder="Optional product link"
          className="
            w-full
            rounded-xl
            border
            border-brand/15
            bg-white
            px-4
            py-3
            text-sm
            text-brand-deep
            outline-none
            transition-all
            placeholder:text-slate-400
            focus:border-brand
            focus:shadow-[0_0_0_3px_rgba(230,0,0,0.08)]
          "
        />
      </div>

      {/* NOTE */}

      <div className="mt-4">
        <label
          className="
            mb-2
            block
            text-[10px]
            font-bold
            uppercase
            tracking-wider
            text-slate-500
          "
        >
          Requirements / Note
        </label>

        <textarea
          name="customNote"
          rows={
            3
          }
          placeholder="Brand, model, color or any other requirement..."
          className="
            w-full
            resize-y
            rounded-xl
            border
            border-brand/15
            bg-white
            px-4
            py-3
            text-sm
            text-brand-deep
            outline-none
            transition-all
            placeholder:text-slate-400
            focus:border-brand
            focus:shadow-[0_0_0_3px_rgba(230,0,0,0.08)]
          "
        />
      </div>

      {/* ACTIONS */}

      <div
        className="
          mt-4
          flex
          flex-wrap
          justify-end
          gap-2
        "
      >
        {onCancel ? (
          <button
            type="button"
            onClick={
              onCancel
            }
            className="
              rounded-xl
              border
              border-brand/15
              bg-white
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
            Cancel
          </button>
        ) : null}

        <button
          type="submit"
          className="
            inline-flex
            items-center
            gap-2
            rounded-xl
            bg-brand
            px-5
            py-3
            text-xs
            font-bold
            uppercase
            tracking-wider
            text-white
            transition-all
            hover:bg-brand-soft
          "
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
import type {
  ReactNode,
} from "react";

import Link from "next/link";

import {
  and,
  asc,
  eq,
  or,
} from "drizzle-orm";

import {
  ArrowLeft,
  Boxes,
  ExternalLink,
  Save,
  Settings,
  Tags,
} from "lucide-react";

import {
  db,
} from "@/db";

import {
  catalogCategories,
  pcBuilderSettings,
  products,
} from "@/db/schema";

import {
  catalogSubcategories,
  pcBuilderCategorySettings,
} from "@/db/catalog-extensions";

import {
  requireAdmin,
} from "@/lib/admin-auth";

import {
  saveBuilderCategorySettings,
  saveBuilderSettings,
} from "./actions";

import {
  BuilderCategoryOrder,
} from "./BuilderCategoryOrder";

/* =========================================================
   DEFAULT SETTINGS
   ========================================================= */

const DEFAULT_SETTINGS = {
  id:
    "main",

  title:
    "Build Your Gaming PC",

  subtitle:
    "Choose your components, calculate your total, and send your complete build to GameX on WhatsApp.",

  readyBuildsLabel:
    "Ready Builds",

  scratchBuilderLabel:
    "Build From Scratch",

  quoteButtonText:
    "Get Quote on WhatsApp",

  whatsappNumber:
    "923036009123",

  showReadyBuilds:
    true,

  showScratchBuilder:
    true,

  isVisible:
    true,
};

/* =========================================================
   INPUT STYLE
   ========================================================= */

const inputClass = `
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
  focus:border-brand/50
  focus:shadow-[0_0_0_4px_rgba(230,0,0,0.08)]
`;

/* =========================================================
   PAGE
   ========================================================= */

export default async function PcBuilderAdminPage({
  searchParams,
}: {
  searchParams: Promise<{
    error?: string;
    saved?: string;
  }>;
}) {
  await requireAdmin();

  const params =
    await searchParams;

  /* =======================================================
     LOAD DATA
     ======================================================= */

  const [
    settingsRows,
    categories,
    categorySettings,
    productRows,
    subcategories,
  ] =
    await Promise.all([
      /* ---------------------------------------------------
         GLOBAL BUILDER SETTINGS
         --------------------------------------------------- */

      db
        .select()
        .from(
          pcBuilderSettings
        )
        .where(
          eq(
            pcBuilderSettings.id,
            "main"
          )
        )
        .limit(
          1
        ),

      /* ---------------------------------------------------
         REAL PRODUCT CATEGORIES

         IMPORTANT:
         These are the SAME categories used by Products.

         No duplicate Builder category system.
         --------------------------------------------------- */

      db
        .select()
        .from(
          catalogCategories
        )
        .where(
          and(
            eq(
              catalogCategories.isVisible,
              true
            ),

            or(
              eq(
                catalogCategories.appliesTo,
                "product"
              ),

              eq(
                catalogCategories.appliesTo,
                "both"
              )
            )
          )
        )
        .orderBy(
          asc(
            catalogCategories.sortOrder
          ),

          asc(
            catalogCategories.id
          )
        ),

      /* ---------------------------------------------------
         BUILDER-SPECIFIC CATEGORY SETTINGS
         --------------------------------------------------- */

      db
        .select()
        .from(
          pcBuilderCategorySettings
        ),

      /* ---------------------------------------------------
         VISIBLE PRODUCTS
         Used only for count display in Admin.
         --------------------------------------------------- */

      db
        .select({
          category:
            products.category,
        })
        .from(
          products
        )
        .where(
          eq(
            products.isVisible,
            true
          )
        ),

      /* ---------------------------------------------------
         SUBCATEGORIES
         --------------------------------------------------- */

      db
        .select()
        .from(
          catalogSubcategories
        )
        .where(
          eq(
            catalogSubcategories.isVisible,
            true
          )
        )
        .orderBy(
          asc(
            catalogSubcategories.sortOrder
          ),

          asc(
            catalogSubcategories.id
          )
        ),
    ]);

  /* =======================================================
     SETTINGS
     ======================================================= */

  const settings =
    settingsRows[0] ??
    DEFAULT_SETTINGS;

  /* =======================================================
     CATEGORY SETTINGS MAP
     ======================================================= */

  const settingsByCategoryId =
    new Map(
      categorySettings.map(
        (
          row
        ) => [
          row.catalogCategoryId,
          row,
        ]
      )
    );

  /* =======================================================
     PRODUCT COUNTS
     ======================================================= */

  const productCounts =
    new Map<
      string,
      number
    >();

  for (
    const product
    of productRows
  ) {
    productCounts.set(
      product.category,

      (
        productCounts.get(
          product.category
        ) ??
        0
      ) +
        1
    );
  }

  /* =======================================================
     EFFECTIVE BUILDER ORDER

     Builder order takes priority.

     If a category has never been configured in Builder,
     its normal catalogue sort order is used.
     ======================================================= */

  const orderedCategories =
    categories
      .map(
        (
          category
        ) => {
          const saved =
            settingsByCategoryId.get(
              category.id
            );

          return {
            ...category,

            builderSortOrder:
              saved?.sortOrder ??
              category.sortOrder,

            builderVisible:
              saved?.isVisible ??
              true,

            builderRequired:
              saved?.isRequired ??
              false,
          };
        }
      )
      .sort(
        (
          a,
          b
        ) =>
          a.builderSortOrder -
            b.builderSortOrder ||
          a.id -
            b.id
      );

  /* =======================================================
     DRAG ORDER DATA
     ======================================================= */

  const draggableCategories =
    orderedCategories.map(
      (
        category
      ) => {
        const childCount =
          subcategories.filter(
            (
              item
            ) =>
              item.categoryId ===
              category.id
          ).length;

        return {
          id:
            category.id,

          name:
            category.name,

          slug:
            category.slug,

          productCount:
            productCounts.get(
              category.slug
            ) ??
            0,

          subcategoryCount:
            childCount,

          isVisible:
            category.builderVisible,

          isRequired:
            category.builderRequired,
        };
      }
    );

  /* =======================================================
     RENDER
     ======================================================= */

  return (
    <main
      id="top"
      className="min-h-screen bg-[#f7f9fc]"
    >
      {/* =====================================================
          HEADER
          ===================================================== */}

      <header className="border-b border-brand/10 bg-white">
        <div
          className="
            mx-auto
            flex
            max-w-7xl
            flex-col
            gap-4
            px-5
            py-5
            md:flex-row
            md:items-center
            md:justify-between
            md:px-8
          "
        >
          <div>
            <p
              className="
                font-display
                text-xl
                font-extrabold
                uppercase
                tracking-widest
                text-brand-deep
              "
            >
              GameX Admin
            </p>

            <p className="mt-1 text-xs text-slate-500">
              Build Your Rig Settings
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Link
              href="/build-your-rig"
              target="_blank"
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
                transition
                hover:bg-brand/[0.04]
              "
            >
              <ExternalLink className="h-4 w-4" />

              Preview Builder
            </Link>

            <Link
              href="/admin/categories"
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
                transition
                hover:bg-brand/[0.04]
              "
            >
              <Tags className="h-4 w-4" />

              Categories
            </Link>

            <Link
              href="/admin"
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
                transition
                hover:bg-brand
                hover:text-white
              "
            >
              <ArrowLeft className="h-4 w-4" />

              Dashboard
            </Link>
          </div>
        </div>
      </header>

      {/* =====================================================
          MAIN CONTENT
          ===================================================== */}

      <div
        className="
          mx-auto
          max-w-7xl
          px-5
          py-10
          md:px-8
          md:py-14
        "
      >
        {/* ===================================================
            PAGE HEADING
            =================================================== */}

        <div>
          <p
            className="
              text-xs
              font-bold
              uppercase
              tracking-[0.24em]
              text-brand
            "
          >
            PC Builder
          </p>

          <h1
            className="
              mt-2
              font-display
              text-3xl
              font-extrabold
              uppercase
              text-brand-deep
              md:text-4xl
            "
          >
            Build Your Rig
          </h1>

          <p
            className="
              mt-3
              max-w-3xl
              text-sm
              leading-6
              text-slate-500
            "
          >
            Build Your Rig uses the same categories as your
            Product catalogue. Create a Product category once and
            it automatically becomes available here. Drag the
            categories below to control their order.
          </p>
        </div>

        {/* ===================================================
            ERROR
            =================================================== */}

        {params.error ? (
          <div
            className="
              mt-6
              rounded-xl
              border
              border-red-200
              bg-red-50
              px-5
              py-4
              text-sm
              font-semibold
              text-red-700
            "
          >
            {
              params.error
            }
          </div>
        ) : null}

        {/* ===================================================
            SUCCESS
            =================================================== */}

        {params.saved ? (
          <div
            className="
              mt-6
              rounded-xl
              border
              border-emerald-200
              bg-emerald-50
              px-5
              py-4
              text-sm
              font-semibold
              text-emerald-700
            "
          >
            PC Builder settings saved successfully.
          </div>
        ) : null}

        {/* ===================================================
            GLOBAL SETTINGS
            =================================================== */}

        <section
          className="
            mt-8
            rounded-2xl
            border
            border-brand/10
            bg-white
            p-6
            md:p-8
          "
        >
          <div className="flex items-center gap-3">
            <div
              className="
                grid
                h-10
                w-10
                place-items-center
                rounded-xl
                bg-brand/[0.08]
                text-brand
              "
            >
              <Settings className="h-5 w-5" />
            </div>

            <div>
              <h2
                className="
                  font-display
                  text-lg
                  font-extrabold
                  uppercase
                  text-brand-deep
                "
              >
                Builder Settings
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                Main settings for the public Build Your Rig page.
              </p>
            </div>
          </div>

          <form
            action={
              saveBuilderSettings
            }
            className="
              mt-6
              grid
              gap-5
              md:grid-cols-2
            "
          >
            <Field label="Title">
              <input
                name="title"
                required
                defaultValue={
                  settings.title
                }
                className={
                  inputClass
                }
              />
            </Field>

            <Field label="WhatsApp Number">
              <input
                name="whatsappNumber"
                required
                defaultValue={
                  settings.whatsappNumber
                }
                className={
                  inputClass
                }
              />
            </Field>

            <div className="md:col-span-2">
              <Field label="Subtitle">
                <textarea
                  name="subtitle"
                  required
                  rows={
                    3
                  }
                  defaultValue={
                    settings.subtitle
                  }
                  className={`${inputClass} resize-y`}
                />
              </Field>
            </div>

            <Field label="Ready Builds Label">
              <input
                name="readyBuildsLabel"
                required
                defaultValue={
                  settings.readyBuildsLabel
                }
                className={
                  inputClass
                }
              />
            </Field>

            <Field label="Scratch Builder Label">
              <input
                name="scratchBuilderLabel"
                required
                defaultValue={
                  settings.scratchBuilderLabel
                }
                className={
                  inputClass
                }
              />
            </Field>

            <Field label="Quote Button Text">
              <input
                name="quoteButtonText"
                required
                defaultValue={
                  settings.quoteButtonText
                }
                className={
                  inputClass
                }
              />
            </Field>

            <div
              className="
                flex
                flex-wrap
                items-end
                gap-4
              "
            >
              <Toggle
                name="showReadyBuilds"
                label="Ready Builds"
                defaultChecked={
                  settings.showReadyBuilds
                }
              />

              <Toggle
                name="showScratchBuilder"
                label="Build From Scratch"
                defaultChecked={
                  settings.showScratchBuilder
                }
              />

              <Toggle
                name="isVisible"
                label="Page Visible"
                defaultChecked={
                  settings.isVisible
                }
              />
            </div>

            <div
              className="
                flex
                justify-end
                border-t
                border-brand/10
                pt-5
                md:col-span-2
              "
            >
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
                  transition
                  hover:bg-brand-soft
                "
              >
                <Save className="h-4 w-4" />

                Save Builder Settings
              </button>
            </div>
          </form>
        </section>

        {/* ===================================================
            DRAG CATEGORY ORDER
            =================================================== */}

        <section
          id="builder-categories"
          className="mt-10"
        >
          <div
            className="
              flex
              flex-col
              gap-3
              md:flex-row
              md:items-end
              md:justify-between
            "
          >
            <div>
              <p
                className="
                  text-xs
                  font-bold
                  uppercase
                  tracking-[0.24em]
                  text-brand
                "
              >
                Auto-Synced
              </p>

              <h2
                className="
                  mt-2
                  font-display
                  text-2xl
                  font-extrabold
                  uppercase
                  text-brand-deep
                "
              >
                Builder Categories
              </h2>

              <p
                className="
                  mt-2
                  max-w-3xl
                  text-sm
                  leading-6
                  text-slate-500
                "
              >
                These categories are automatically loaded from
                Admin Categories. Drag and drop them to change the
                order shown on Build Your Rig.
              </p>
            </div>

            <Link
              href="/admin/categories"
              className="
                inline-flex
                items-center
                gap-2
                rounded-xl
                bg-brand
                px-4
                py-3
                text-xs
                font-bold
                uppercase
                text-white
                transition
                hover:bg-brand-soft
              "
            >
              <Tags className="h-4 w-4" />

              Manage Categories
            </Link>
          </div>

          {/* =================================================
              DRAG SORTER
              ================================================= */}

          <div className="mt-6">
            <BuilderCategoryOrder
              categories={
                draggableCategories
              }
            />
          </div>

          {/* =================================================
              CATEGORY SETTINGS
              ================================================= */}

          <div
            className="
              mt-8
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
                bg-brand/[0.08]
                text-brand
              "
            >
              <Boxes className="h-5 w-5" />
            </div>

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
                Category Settings
              </h3>

              <p className="mt-1 text-xs text-slate-500">
                Set description, help text, visibility and whether
                each component is required.
              </p>
            </div>
          </div>

          {/* =================================================
              CATEGORY CARDS
              ================================================= */}

          {orderedCategories.length >
          0 ? (
            <div className="mt-5 space-y-4">
              {orderedCategories.map(
                (
                  category
                ) => {
                  const saved =
                    settingsByCategoryId.get(
                      category.id
                    );

                  const childSubcategories =
                    subcategories.filter(
                      (
                        item
                      ) =>
                        item.categoryId ===
                        category.id
                    );

                  return (
                    <form
                      key={
                        category.id
                      }
                      action={
                        saveBuilderCategorySettings
                      }
                      className="
                        rounded-2xl
                        border
                        border-brand/10
                        bg-white
                        p-5
                        md:p-6
                      "
                    >
                      <input
                        type="hidden"
                        name="catalogCategoryId"
                        value={
                          category.id
                        }
                      />

                      <div
                        className="
                          flex
                          flex-col
                          gap-5
                          xl:flex-row
                          xl:items-start
                          xl:justify-between
                        "
                      >
                        {/* ===================================
                            CATEGORY INFO
                            =================================== */}

                        <div className="min-w-0 xl:w-[280px]">
                          <div className="flex items-center gap-3">
                            <div
                              className="
                                grid
                                h-10
                                w-10
                                shrink-0
                                place-items-center
                                rounded-xl
                                bg-brand/[0.08]
                                text-brand
                              "
                            >
                              <Boxes className="h-5 w-5" />
                            </div>

                            <div className="min-w-0">
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

                              <p
                                className="
                                  mt-1
                                  break-all
                                  text-[11px]
                                  font-semibold
                                  text-brand/70
                                "
                              >
                                {
                                  category.slug
                                }
                              </p>
                            </div>
                          </div>

                          <div
                            className="
                              mt-3
                              flex
                              flex-wrap
                              gap-2
                              text-[10px]
                              font-bold
                              uppercase
                              text-slate-500
                            "
                          >
                            <span
                              className="
                                rounded-full
                                bg-slate-100
                                px-2.5
                                py-1.5
                              "
                            >
                              {
                                productCounts.get(
                                  category.slug
                                ) ??
                                0
                              }{" "}
                              products
                            </span>

                            <span
                              className="
                                rounded-full
                                bg-slate-100
                                px-2.5
                                py-1.5
                              "
                            >
                              {
                                childSubcategories.length
                              }{" "}
                              subcategories
                            </span>
                          </div>

                          <p
                            className="
                              mt-3
                              text-[11px]
                              leading-5
                              text-slate-400
                            "
                          >
                            Position is controlled by drag and
                            drop above. You no longer need to type
                            0, 1, 2, 3 manually.
                          </p>
                        </div>

                        {/* ===================================
                            SETTINGS FIELDS
                            =================================== */}

                        <div
                          className="
                            grid
                            flex-1
                            gap-4
                            md:grid-cols-2
                          "
                        >
                          <Field label="Description">
                            <input
                              name="description"
                              defaultValue={
                                saved
                                  ?.description ??
                                ""
                              }
                              placeholder={`Choose your ${category.name.toLowerCase()}.`}
                              className={
                                inputClass
                              }
                            />
                          </Field>

                          <Field label="Help Text">
                            <input
                              name="helpText"
                              defaultValue={
                                saved
                                  ?.helpText ??
                                ""
                              }
                              placeholder="Short compatibility/help message"
                              className={
                                inputClass
                              }
                            />
                          </Field>
                        </div>
                      </div>

                      {/* =====================================
                          SUBCATEGORIES
                          ===================================== */}

                      {childSubcategories.length >
                      0 ? (
                        <div
                          className="
                            mt-4
                            rounded-xl
                            border
                            border-brand/[0.07]
                            bg-[#fff8f8]
                            px-4
                            py-3
                            text-xs
                            leading-5
                            text-slate-500
                          "
                        >
                          <span className="font-bold text-brand-deep">
                            Subcategories:{" "}
                          </span>

                          {childSubcategories
                            .map(
                              (
                                item
                              ) =>
                                item.name
                            )
                            .join(
                              ", "
                            )}
                        </div>
                      ) : null}

                      {/* =====================================
                          CATEGORY FOOTER
                          ===================================== */}

                      <div
                        className="
                          mt-5
                          flex
                          flex-wrap
                          items-center
                          justify-between
                          gap-4
                          border-t
                          border-brand/10
                          pt-4
                        "
                      >
                        <div className="flex flex-wrap gap-5">
                          <Toggle
                            name="isVisible"
                            label="Show in Builder"
                            defaultChecked={
                              saved
                                ?.isVisible ??
                              true
                            }
                          />

                          <Toggle
                            name="isRequired"
                            label="Required"
                            defaultChecked={
                              saved
                                ?.isRequired ??
                              false
                            }
                          />
                        </div>

                        <button
                          type="submit"
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
                            transition
                            hover:bg-brand-soft
                          "
                        >
                          <Save className="h-4 w-4" />

                          Save Category
                        </button>
                      </div>
                    </form>
                  );
                }
              )}
            </div>
          ) : (
            <div
              className="
                mt-6
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
              <Tags className="mx-auto h-8 w-8 text-brand/30" />

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
                No Product Categories
              </p>

              <p
                className="
                  mx-auto
                  mt-2
                  max-w-xl
                  text-sm
                  leading-6
                  text-slate-500
                "
              >
                Create a visible Product category in Admin
                Categories. It will automatically appear here and
                on Build Your Rig.
              </p>

              <Link
                href="/admin/categories"
                className="
                  mt-5
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
                  text-white
                "
              >
                <Tags className="h-4 w-4" />

                Open Categories
              </Link>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

/* =========================================================
   FIELD
   ========================================================= */

function Field({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span
        className="
          mb-2
          block
          text-xs
          font-bold
          uppercase
          tracking-wider
          text-slate-600
        "
      >
        {
          label
        }
      </span>

      {
        children
      }
    </label>
  );
}

/* =========================================================
   TOGGLE
   ========================================================= */

function Toggle({
  name,
  label,
  defaultChecked,
}: {
  name: string;
  label: string;
  defaultChecked: boolean;
}) {
  return (
    <label
      className="
        inline-flex
        cursor-pointer
        items-center
        gap-2
        text-xs
        font-bold
        text-slate-600
      "
    >
      <input
        name={
          name
        }
        type="checkbox"
        defaultChecked={
          defaultChecked
        }
        className="h-4 w-4 accent-[#e60000]"
      />

      {
        label
      }
    </label>
  );
}
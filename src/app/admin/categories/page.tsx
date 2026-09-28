import Link from "next/link";

import type {
  ReactNode,
} from "react";

import {
  ArrowLeft,
  Boxes,
  Eye,
  EyeOff,
  Layers3,
  Package,
  Plus,
  Save,
  Tag,
  Wrench,
} from "lucide-react";

import {
  asc,
} from "drizzle-orm";

import {
  db,
} from "@/db";

import {
  catalogCategories,
  customBuilds,
  products,
} from "@/db/schema";

import {
  requireAdmin,
} from "@/lib/admin-auth";

import {
  DeleteCategoryButton,
} from "./DeleteCategoryButton";

import {
  createCategory,
  toggleCategoryVisibility,
  updateCategory,
} from "./actions";

/* =========================================================
   TYPES
   ========================================================= */

type CategoryPageProps = {
  searchParams: Promise<{
    error?: string;

    created?: string;

    updated?: string;

    deleted?: string;

    visibility?: string;
  }>;
};

/* =========================================================
   INPUT CLASS
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
  placeholder:text-slate-400
  focus:border-brand/50
  focus:shadow-[0_0_0_4px_rgba(230,0,0,0.08)]
`;

/* =========================================================
   PAGE
   ========================================================= */

export default async function CategoriesPage({
  searchParams,
}: CategoryPageProps) {
  await requireAdmin();

  const params =
    await searchParams;

  /* =======================================================
     LOAD CATEGORIES
     ======================================================= */

  const categories =
    await db
      .select()
      .from(
        catalogCategories
      )
      .orderBy(
        asc(
          catalogCategories.sortOrder
        ),

        asc(
          catalogCategories.id
        )
      );

  /* =======================================================
     USAGE
     ======================================================= */

  const [
    productRows,
    buildRows,
  ] =
    await Promise.all([
      db
        .select({
          category:
            products.category,
        })
        .from(
          products
        ),

      db
        .select({
          category:
            customBuilds.category,
        })
        .from(
          customBuilds
        ),
    ]);

  const productCounts =
    new Map<
      string,
      number
    >();

  const buildCounts =
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
      ) + 1
    );
  }

  for (
    const build
    of buildRows
  ) {
    buildCounts.set(
      build.category,

      (
        buildCounts.get(
          build.category
        ) ??
        0
      ) + 1
    );
  }

  /* =======================================================
     STATUS MESSAGE
     ======================================================= */

  let successMessage =
    "";

  if (
    params.created ===
    "1"
  ) {
    successMessage =
      "Category created successfully.";
  } else if (
    params.updated ===
    "1"
  ) {
    successMessage =
      "Category updated successfully.";
  } else if (
    params.deleted ===
    "1"
  ) {
    successMessage =
      "Category deleted successfully.";
  } else if (
    params.visibility ===
    "1"
  ) {
    successMessage =
      "Category visibility updated.";
  }

  return (
    <main
      className="
        min-h-screen
        bg-[#fff8f8]
      "
    >
      {/* =====================================================
          HEADER
          ===================================================== */}

      <header
        className="
          border-b
          border-brand/10
          bg-white
        "
      >
        <div
          className="
            mx-auto
            flex
            max-w-7xl
            items-center
            justify-between
            gap-4
            px-5
            py-4
            md:px-8
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
                bg-brand
                text-white
              "
            >
              <Tag className="h-5 w-5" />
            </div>

            <div>
              <p
                className="
                  font-display
                  text-lg
                  font-extrabold
                  uppercase
                  tracking-widest
                  text-brand-deep
                "
              >
                Categories
              </p>

              <p
                className="
                  mt-0.5
                  text-xs
                  text-slate-500
                "
              >
                Products & Custom Builds
              </p>
            </div>
          </div>

          <Link
            href="/admin"
            className="
              inline-flex
              items-center
              gap-2
              rounded-lg
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
            <ArrowLeft className="h-4 w-4" />

            Dashboard
          </Link>
        </div>
      </header>

      {/* =====================================================
          MAIN
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
        {/* TITLE */}

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
            Catalogue
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
            Manage Categories
          </h1>

          <p
            className="
              mt-3
              max-w-3xl
              text-sm
              leading-relaxed
              text-slate-500
            "
          >
            Add, edit, hide and delete categories used by
            Products and Custom Builds. Categories currently
            assigned to a Product or Build cannot be deleted
            until those items are moved to another category.
          </p>
        </div>

        {/* ===================================================
            MESSAGES
            =================================================== */}

        {params.error ? (
          <div
            className="
              mt-7
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

        {successMessage ? (
          <div
            className="
              mt-7
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
            {
              successMessage
            }
          </div>
        ) : null}

        {/* ===================================================
            ADD CATEGORY
            =================================================== */}

        <section
          className="
            mt-8
            rounded-3xl
            border
            border-brand/10
            bg-white
            p-5
            shadow-[0_30px_80px_-50px_rgba(230,0,0,0.3)]
            sm:p-7
          "
        >
          <div
            className="
              flex
              items-start
              gap-3
              border-b
              border-brand/10
              pb-5
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
                text-brand
              "
            >
              <Plus className="h-5 w-5" />
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
                Add Category
              </h2>

              <p
                className="
                  mt-1
                  text-xs
                  leading-relaxed
                  text-slate-500
                "
              >
                Create a category such as Keyboards, Monitors,
                Budget Builds or Cooling.
              </p>
            </div>
          </div>

          <form
            action={
              createCategory
            }
            className="
              mt-6
              grid
              gap-5
              md:grid-cols-2
              xl:grid-cols-4
            "
          >
            {/* NAME */}

            <FormField
              label="Category Name"
              htmlFor="name"
            >
              <input
                id="name"
                name="name"
                type="text"
                required
                maxLength={
                  120
                }
                placeholder="e.g. Keyboards"
                className={
                  inputClass
                }
              />
            </FormField>

            {/* SLUG */}

            <FormField
              label="Slug"
              htmlFor="slug"
            >
              <input
                id="slug"
                name="slug"
                type="text"
                maxLength={
                  120
                }
                placeholder="Auto: keyboards"
                className={
                  inputClass
                }
              />

              <p
                className="
                  mt-2
                  text-xs
                  text-slate-400
                "
              >
                Leave blank to generate it automatically.
              </p>
            </FormField>

            {/* TARGET */}

            <FormField
              label="Available For"
              htmlFor="appliesTo"
            >
              <select
                id="appliesTo"
                name="appliesTo"
                defaultValue="product"
                className={
                  inputClass
                }
              >
                <option value="product">
                  Products
                </option>

                <option value="build">
                  Custom Builds
                </option>

                <option value="both">
                  Products + Builds
                </option>
              </select>
            </FormField>

            {/* ORDER */}

            <FormField
              label="Display Order"
              htmlFor="sortOrder"
            >
              <input
                id="sortOrder"
                name="sortOrder"
                type="number"
                min={
                  0
                }
                max={
                  9999
                }
                step={
                  1
                }
                defaultValue={
                  0
                }
                className={
                  inputClass
                }
              />
            </FormField>

            {/* VISIBLE */}

            <div
              className="
                md:col-span-2
                xl:col-span-3
              "
            >
              <label
                className="
                  inline-flex
                  cursor-pointer
                  items-center
                  gap-3
                "
              >
                <input
                  type="checkbox"
                  name="isVisible"
                  defaultChecked
                  className="
                    h-4
                    w-4
                    accent-[#e60000]
                  "
                />

                <span
                  className="
                    text-sm
                    font-semibold
                    text-brand-deep
                  "
                >
                  Visible on website
                </span>
              </label>
            </div>

            {/* ADD */}

            <div
              className="
                flex
                items-end
                xl:justify-end
              "
            >
              <button
                type="submit"
                className="
                  inline-flex
                  w-full
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  bg-brand
                  px-5
                  py-3
                  font-display
                  text-xs
                  font-bold
                  uppercase
                  tracking-wider
                  text-white
                  transition-all
                  hover:-translate-y-0.5
                  hover:bg-[#c90000]
                  xl:w-auto
                "
              >
                <Plus className="h-4 w-4" />

                Add Category
              </button>
            </div>
          </form>
        </section>

        {/* ===================================================
            CATEGORY LIST
            =================================================== */}

        <section className="mt-8">
          <div
            className="
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
                  tracking-[0.22em]
                  text-brand
                "
              >
                Existing Categories
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
                {
                  categories.length
                } Categories
              </h2>
            </div>
          </div>

          {/* CATEGORY CARDS */}

          <div
            className="
              mt-5
              space-y-4
            "
          >
            {categories.map(
              (
                category
              ) => {
                const productCount =
                  productCounts.get(
                    category.slug
                  ) ?? 0;

                const buildCount =
                  buildCounts.get(
                    category.slug
                  ) ?? 0;

                const isUsed =
                  productCount >
                    0 ||
                  buildCount >
                    0;

                return (
                  <div
                    key={
                      category.id
                    }
                    className="
                      rounded-2xl
                      border
                      border-black/[0.07]
                      bg-white
                      p-5
                      shadow-[0_18px_50px_-42px_rgba(0,0,0,0.25)]
                      sm:p-6
                    "
                  >
                    {/* TOP */}

                    <div
                      className="
                        flex
                        flex-col
                        gap-4
                        lg:flex-row
                        lg:items-start
                        lg:justify-between
                      "
                    >
                      {/* CATEGORY INFO */}

                      <div
                        className="
                          flex
                          items-start
                          gap-3
                        "
                      >
                        <div
                          className="
                            grid
                            h-11
                            w-11
                            shrink-0
                            place-items-center
                            rounded-xl
                            bg-brand/[0.08]
                            text-brand
                          "
                        >
                          {category.appliesTo ===
                          "product" ? (
                            <Package className="h-5 w-5" />
                          ) : category.appliesTo ===
                            "build" ? (
                            <Wrench className="h-5 w-5" />
                          ) : (
                            <Boxes className="h-5 w-5" />
                          )}
                        </div>

                        <div>
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
                                text-lg
                                font-extrabold
                                text-brand-deep
                              "
                            >
                              {
                                category.name
                              }
                            </h3>

                            {!category.isVisible ? (
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
                                Hidden
                              </span>
                            ) : null}
                          </div>

                          <p
                            className="
                              mt-1
                              text-xs
                              text-slate-400
                            "
                          >
                            Slug:{" "}

                            <span
                              className="
                                font-semibold
                                text-slate-600
                              "
                            >
                              {
                                category.slug
                              }
                            </span>
                          </p>
                        </div>
                      </div>

                      {/* USAGE */}

                      <div
                        className="
                          flex
                          flex-wrap
                          gap-2
                        "
                      >
                        <UsageBadge
                          icon={
                            <Package className="h-3.5 w-3.5" />
                          }
                          text={`${productCount} Products`}
                        />

                        <UsageBadge
                          icon={
                            <Wrench className="h-3.5 w-3.5" />
                          }
                          text={`${buildCount} Builds`}
                        />
                      </div>
                    </div>

                    {/* EDIT */}

                    <form
                      action={
                        updateCategory
                      }
                      className="
                        mt-5
                        grid
                        gap-4
                        border-t
                        border-black/[0.06]
                        pt-5
                        md:grid-cols-2
                        xl:grid-cols-[1.2fr_1.2fr_1fr_130px]
                      "
                    >
                      <input
                        type="hidden"
                        name="categoryId"
                        value={
                          category.id
                        }
                      />

                      {/* NAME */}

                      <FormField
                        label="Name"
                      >
                        <input
                          name="name"
                          defaultValue={
                            category.name
                          }
                          required
                          maxLength={
                            120
                          }
                          className={
                            inputClass
                          }
                        />
                      </FormField>

                      {/* SLUG */}

                      <FormField
                        label="Slug"
                      >
                        <input
                          name="slug"
                          defaultValue={
                            category.slug
                          }
                          required
                          maxLength={
                            120
                          }
                          className={
                            inputClass
                          }
                        />
                      </FormField>

                      {/* TARGET */}

                      <FormField
                        label="Available For"
                      >
                        <select
                          name="appliesTo"
                          defaultValue={
                            category.appliesTo
                          }
                          className={
                            inputClass
                          }
                        >
                          <option value="product">
                            Products
                          </option>

                          <option value="build">
                            Custom Builds
                          </option>

                          <option value="both">
                            Products + Builds
                          </option>
                        </select>
                      </FormField>

                      {/* ORDER */}

                      <FormField
                        label="Order"
                      >
                        <input
                          name="sortOrder"
                          type="number"
                          min={
                            0
                          }
                          max={
                            9999
                          }
                          step={
                            1
                          }
                          defaultValue={
                            category.sortOrder
                          }
                          className={
                            inputClass
                          }
                        />
                      </FormField>

                      {/* VISIBILITY */}

                      <div
                        className="
                          flex
                          items-center
                          md:col-span-2
                          xl:col-span-3
                        "
                      >
                        <label
                          className="
                            inline-flex
                            cursor-pointer
                            items-center
                            gap-3
                          "
                        >
                          <input
                            type="checkbox"
                            name="isVisible"
                            defaultChecked={
                              category.isVisible
                            }
                            className="
                              h-4
                              w-4
                              accent-[#e60000]
                            "
                          />

                          <span
                            className="
                              text-xs
                              font-semibold
                              text-brand-deep
                            "
                          >
                            Visible
                          </span>
                        </label>
                      </div>

                      {/* SAVE */}

                      <div
                        className="
                          flex
                          items-center
                          xl:justify-end
                        "
                      >
                        <button
                          type="submit"
                          className="
                            inline-flex
                            w-full
                            items-center
                            justify-center
                            gap-2
                            rounded-lg
                            bg-brand
                            px-4
                            py-2.5
                            text-[10px]
                            font-bold
                            uppercase
                            tracking-wider
                            text-white
                            transition-all
                            hover:bg-[#c90000]
                            xl:w-auto
                          "
                        >
                          <Save className="h-3.5 w-3.5" />

                          Save
                        </button>
                      </div>
                    </form>

                    {/* ACTIONS */}

                    <div
                      className="
                        mt-4
                        flex
                        flex-wrap
                        gap-2
                      "
                    >
                      <form
                        action={
                          toggleCategoryVisibility
                        }
                      >
                        <input
                          type="hidden"
                          name="categoryId"
                          value={
                            category.id
                          }
                        />

                        <button
                          type="submit"
                          className="
                            inline-flex
                            items-center
                            gap-2
                            rounded-lg
                            border
                            border-brand/15
                            bg-white
                            px-3
                            py-2.5
                            text-[10px]
                            font-bold
                            uppercase
                            tracking-wider
                            text-brand
                            transition-all
                            hover:border-brand
                            hover:bg-brand/[0.04]
                          "
                        >
                          {category.isVisible ? (
                            <EyeOff className="h-3.5 w-3.5" />
                          ) : (
                            <Eye className="h-3.5 w-3.5" />
                          )}

                          {category.isVisible
                            ? "Hide"
                            : "Show"}
                        </button>
                      </form>

                      <DeleteCategoryButton
                        categoryId={
                          category.id
                        }
                        categoryName={
                          category.name
                        }
                        disabled={
                          isUsed
                        }
                      />

                      {isUsed ? (
                        <span
                          className="
                            inline-flex
                            items-center
                            rounded-lg
                            bg-amber-50
                            px-3
                            py-2
                            text-[10px]
                            font-semibold
                            text-amber-700
                          "
                        >
                          Change assigned items before deleting.
                        </span>
                      ) : null}
                    </div>
                  </div>
                );
              }
            )}
          </div>

          {/* EMPTY */}

          {categories.length ===
          0 ? (
            <div
              className="
                mt-5
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
              <Layers3
                className="
                  mx-auto
                  h-8
                  w-8
                  text-brand/50
                "
              />

              <p
                className="
                  mt-3
                  font-display
                  text-lg
                  font-bold
                  uppercase
                  text-brand-deep
                "
              >
                No Categories
              </p>

              <p
                className="
                  mt-2
                  text-sm
                  text-slate-500
                "
              >
                Add your first category above.
              </p>
            </div>
          ) : null}
        </section>
      </div>
    </main>
  );
}

/* =========================================================
   FORM FIELD
   ========================================================= */

function FormField({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label
        htmlFor={
          htmlFor
        }
        className="
          mb-2
          block
          text-[10px]
          font-extrabold
          uppercase
          tracking-[0.15em]
          text-slate-500
        "
      >
        {
          label
        }
      </label>

      {
        children
      }
    </div>
  );
}

/* =========================================================
   USAGE BADGE
   ========================================================= */

function UsageBadge({
  icon,
  text,
}: {
  icon: ReactNode;

  text: string;
}) {
  return (
    <span
      className="
        inline-flex
        items-center
        gap-1.5
        rounded-full
        border
        border-brand/10
        bg-[#fff8f8]
        px-3
        py-1.5
        text-[10px]
        font-bold
        uppercase
        tracking-wider
        text-slate-600
      "
    >
      {
        icon
      }

      {
        text
      }
    </span>
  );
}
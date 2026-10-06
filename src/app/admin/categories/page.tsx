import type {
  ReactNode,
} from "react";

import Link from "next/link";

import {
  asc,
} from "drizzle-orm";

import {
  ArrowLeft,
  Boxes,
  Plus,
} from "lucide-react";

import {
  db,
} from "@/db";

import {
  catalogCategories,
  customBuilds,
  products,
} from "@/db/schema";

import {
  catalogSubcategories,
  productSubcategoryAssignments,
} from "@/db/catalog-extensions";

import {
  requireAdmin,
} from "@/lib/admin-auth";

import {
  createCategory,
  createSubcategory,
} from "./actions";

import CategoryOrderManager from "./CategoryOrderManager";

/* =========================================================
   STYLE
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
   TYPES
   ========================================================= */

type CategoriesPageProps = {
  searchParams: Promise<{
    error?: string;
    created?: string;
    updated?: string;
    deleted?: string;
    visibility?: string;
    subcategoryCreated?: string;
    subcategoryUpdated?: string;
    subcategoryDeleted?: string;
    subcategoryVisibility?: string;
  }>;
};

/* =========================================================
   PAGE
   ========================================================= */

export default async function CategoriesPage({
  searchParams,
}: CategoriesPageProps) {
  await requireAdmin();

  const params =
    await searchParams;

  const [
    categories,
    subcategories,
    productRows,
    buildRows,
    assignmentRows,
  ] =
    await Promise.all([
      db
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
        ),

      db
        .select()
        .from(
          catalogSubcategories
        )
        .orderBy(
          asc(
            catalogSubcategories.categoryId
          ),
          asc(
            catalogSubcategories.sortOrder
          ),
          asc(
            catalogSubcategories.id
          )
        ),

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

      db
        .select({
          subcategoryId:
            productSubcategoryAssignments.subcategoryId,
        })
        .from(
          productSubcategoryAssignments
        ),
    ]);

  /* =======================================================
     COUNTS
     ======================================================= */

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

  const subcategoryCounts =
    new Map<
      number,
      number
    >();

  for (
    const row of
    productRows
  ) {
    productCounts.set(
      row.category,
      (
        productCounts.get(
          row.category
        ) ??
        0
      ) + 1
    );
  }

  for (
    const row of
    buildRows
  ) {
    buildCounts.set(
      row.category,
      (
        buildCounts.get(
          row.category
        ) ??
        0
      ) + 1
    );
  }

  for (
    const row of
    assignmentRows
  ) {
    subcategoryCounts.set(
      row.subcategoryId,
      (
        subcategoryCounts.get(
          row.subcategoryId
        ) ??
        0
      ) + 1
    );
  }

  const productCountObject =
    Object.fromEntries(
      productCounts
    );

  const buildCountObject =
    Object.fromEntries(
      buildCounts
    );

  const subcategoryCountObject =
    Object.fromEntries(
      Array.from(
        subcategoryCounts.entries()
      ).map(
        ([
          id,
          count,
        ]) => [
          String(
            id
          ),
          count,
        ]
      )
    );

  const productCategories =
    categories.filter(
      (category) =>
        category.appliesTo ===
          "product" ||
        category.appliesTo ===
          "both"
    );

  /* =======================================================
     SUCCESS MESSAGE
     ======================================================= */

  const successMessage =
    params.created ===
    "1"
      ? "Category created successfully."
      : params.updated ===
          "1"
        ? "Category updated successfully."
        : params.deleted ===
            "1"
          ? "Category deleted successfully."
          : params.visibility ===
              "1"
            ? "Category visibility updated."
            : params.subcategoryCreated ===
                "1"
              ? "Subcategory created successfully."
              : params.subcategoryUpdated ===
                  "1"
                ? "Subcategory updated successfully."
                : params.subcategoryDeleted ===
                    "1"
                  ? "Subcategory deleted successfully."
                  : params.subcategoryVisibility ===
                      "1"
                    ? "Subcategory visibility updated."
                    : "";

  return (
    <main
      id="top"
      className="min-h-screen bg-[#f7f9fc]"
    >
      {/* HEADER */}

      <header className="border-b border-brand/10 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 md:px-8">
          <div>
            <p className="font-display text-lg font-extrabold uppercase tracking-widest text-brand-deep">
              GameX Admin
            </p>

            <p className="mt-0.5 text-xs text-slate-500">
              Categories & Subcategories
            </p>
          </div>

          <Link
            href="/admin"
            className="inline-flex items-center gap-2 rounded-lg border border-brand/15 bg-white px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-brand hover:bg-brand hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Dashboard
          </Link>
        </div>
      </header>

      {/* CONTENT */}

      <div className="mx-auto max-w-7xl px-5 py-10 md:px-8 md:py-14">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-brand">
              Catalogue Structure
            </p>

            <h1 className="mt-2 font-display text-3xl font-extrabold uppercase text-brand-deep md:text-4xl">
              Categories
            </h1>

            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-500">
              Main categories are the single source of truth for
              Products and Build Your Rig. Drag categories to set
              their order. Subcategories can also be reordered
              inside their parent category.
            </p>
          </div>

          <Link
            href="/admin/pc-builder"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand px-5 py-3 text-xs font-bold uppercase tracking-wider text-white"
          >
            <Boxes className="h-4 w-4" />
            PC Builder Settings
          </Link>
        </div>

        {/* MESSAGES */}

        {params.error ? (
          <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-semibold text-red-700">
            {
              params.error
            }
          </div>
        ) : null}

        {successMessage ? (
          <div className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm font-semibold text-emerald-700">
            {
              successMessage
            }
          </div>
        ) : null}

        {/* ===================================================
            ADD MAIN CATEGORY
            =================================================== */}

        <section className="mt-8 rounded-2xl border border-brand/10 bg-white p-6 md:p-7">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-brand/[0.08] text-brand">
              <Plus className="h-5 w-5" />
            </div>

            <div>
              <h2 className="font-display text-lg font-extrabold uppercase text-brand-deep">
                Add Main Category
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                New categories are added to the bottom
                automatically. Drag them afterwards to change
                their position.
              </p>
            </div>
          </div>

          <form
            action={
              createCategory
            }
            className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-[1fr_1fr_1fr_220px]"
          >
            <Field label="Name">
              <input
                name="name"
                required
                placeholder="Accessories"
                className={
                  inputClass
                }
              />
            </Field>

            <Field label="Slug">
              <input
                name="slug"
                placeholder="accessories"
                className={
                  inputClass
                }
              />
            </Field>

            <Field label="Available For">
              <select
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
            </Field>

            <div className="flex items-end gap-3">
              <label className="flex h-[46px] flex-1 items-center gap-2 rounded-xl border border-brand/10 px-3 text-xs font-bold text-slate-600">
                <input
                  name="isVisible"
                  type="checkbox"
                  defaultChecked
                  className="h-4 w-4 accent-[#e60000]"
                />

                Visible
              </label>

              <button
                type="submit"
                className="grid h-[46px] w-[46px] place-items-center rounded-xl bg-brand text-white"
              >
                <Plus className="h-5 w-5" />
              </button>
            </div>
          </form>
        </section>

        {/* ===================================================
            DRAG CATEGORY MANAGER
            =================================================== */}

        <CategoryOrderManager
          categories={
            categories
          }
          subcategories={
            subcategories
          }
          productCounts={
            productCountObject
          }
          buildCounts={
            buildCountObject
          }
          subcategoryCounts={
            subcategoryCountObject
          }
        />

        {/* ===================================================
            ADD SUBCATEGORY
            =================================================== */}

        <section
          id="subcategories"
          className="mt-12"
        >
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-brand">
              Second Level
            </p>

            <h2 className="mt-2 font-display text-2xl font-extrabold uppercase text-brand-deep">
              Add Subcategory
            </h2>

            <p className="mt-2 max-w-3xl text-sm text-slate-500">
              Example: Accessories → Cooling Fans, Controllers or
              RGB Cables. New subcategories are automatically
              placed at the end of their parent category.
            </p>
          </div>

          <div className="mt-6 rounded-2xl border border-brand/10 bg-white p-6">
            <form
              action={
                createSubcategory
              }
              className="grid gap-4 md:grid-cols-2 xl:grid-cols-[1fr_1fr_1fr_220px]"
            >
              <Field label="Parent Category">
                <select
                  name="categoryId"
                  required
                  defaultValue=""
                  className={
                    inputClass
                  }
                >
                  <option
                    value=""
                    disabled
                  >
                    Select category
                  </option>

                  {productCategories.map(
                    (
                      category
                    ) => (
                      <option
                        key={
                          category.id
                        }
                        value={
                          category.id
                        }
                      >
                        {
                          category.name
                        }
                      </option>
                    )
                  )}
                </select>
              </Field>

              <Field label="Subcategory Name">
                <input
                  name="name"
                  required
                  placeholder="Cooling Fans"
                  className={
                    inputClass
                  }
                />
              </Field>

              <Field label="Slug">
                <input
                  name="slug"
                  placeholder="cooling-fans"
                  className={
                    inputClass
                  }
                />
              </Field>

              <div className="flex items-end gap-3">
                <label className="flex h-[46px] flex-1 items-center gap-2 rounded-xl border border-brand/10 px-3 text-xs font-bold text-slate-600">
                  <input
                    name="isVisible"
                    type="checkbox"
                    defaultChecked
                    className="h-4 w-4 accent-[#e60000]"
                  />

                  Visible
                </label>

                <button
                  type="submit"
                  className="grid h-[46px] w-[46px] place-items-center rounded-xl bg-brand text-white"
                >
                  <Plus className="h-5 w-5" />
                </button>
              </div>
            </form>
          </div>
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
      <span className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-600">
        {label}
      </span>

      {children}
    </label>
  );
}
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
  Eye,
  EyeOff,
  Layers3,
  Plus,
  Save,
  Trash2,
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
  deleteCategory,
  deleteSubcategory,
  toggleCategoryVisibility,
  toggleSubcategoryVisibility,
  updateCategory,
  updateSubcategory,
} from "./actions";

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
    const row
    of productRows
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
    const row
    of buildRows
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
    const row
    of assignmentRows
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

  const categoryById =
    new Map(
      categories.map(
        (
          category
        ) => [
          category.id,
          category,
        ]
      )
    );

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
              Products and Build Your Rig. Subcategories give you
              a second level such as Accessories → Cooling Fans.
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

        {params.error ? (
          <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-semibold text-red-700">
            {params.error}
          </div>
        ) : null}

        {successMessage ? (
          <div className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm font-semibold text-emerald-700">
            {successMessage}
          </div>
        ) : null}

        {/* ADD MAIN CATEGORY */}

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
                New product categories automatically become
                available in Build Your Rig.
              </p>
            </div>
          </div>

          <form
            action={
              createCategory
            }
            className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-5"
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

            <Field label="Order">
              <input
                name="sortOrder"
                type="number"
                min="0"
                defaultValue="0"
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
        </section>

        {/* CATEGORY LIST */}

        <section className="mt-8">
          <div className="flex items-center gap-3">
            <Layers3 className="h-5 w-5 text-brand" />

            <h2 className="font-display text-xl font-extrabold uppercase text-brand-deep">
              Main Categories
            </h2>
          </div>

          <div className="mt-4 space-y-4">
            {categories.map(
              (
                category
              ) => (
                <div
                  key={
                    category.id
                  }
                  className="rounded-2xl border border-brand/10 bg-white p-5"
                >
                  <form
                    action={
                      updateCategory
                    }
                    className="grid gap-4 xl:grid-cols-[1.1fr_1.1fr_1fr_120px_170px]"
                  >
                    <input
                      type="hidden"
                      name="categoryId"
                      value={
                        category.id
                      }
                    />

                    <Field label="Name">
                      <input
                        name="name"
                        required
                        defaultValue={
                          category.name
                        }
                        className={
                          inputClass
                        }
                      />
                    </Field>

                    <Field label="Slug">
                      <input
                        name="slug"
                        required
                        defaultValue={
                          category.slug
                        }
                        disabled={
                          category.isSystem
                        }
                        className={`${inputClass} disabled:bg-slate-100`}
                      />

                      {category.isSystem ? (
                        <input
                          type="hidden"
                          name="slug"
                          value={
                            category.slug
                          }
                        />
                      ) : null}
                    </Field>

                    <Field label="Available For">
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
                    </Field>

                    <Field label="Order">
                      <input
                        name="sortOrder"
                        type="number"
                        min="0"
                        defaultValue={
                          category.sortOrder
                        }
                        className={
                          inputClass
                        }
                      />
                    </Field>

                    <div className="flex items-end gap-2">
                      <label className="flex h-[46px] flex-1 items-center gap-2 rounded-xl border border-brand/10 px-3 text-xs font-bold text-slate-600">
                        <input
                          name="isVisible"
                          type="checkbox"
                          defaultChecked={
                            category.isVisible
                          }
                          disabled={
                            category.isSystem
                          }
                          className="h-4 w-4 accent-[#e60000]"
                        />

                        Visible
                      </label>

                      <button
                        type="submit"
                        className="grid h-[46px] w-[46px] place-items-center rounded-xl bg-brand text-white"
                      >
                        <Save className="h-4 w-4" />
                      </button>
                    </div>
                  </form>

                  <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-brand/10 pt-4">
                    <div className="flex flex-wrap gap-2 text-[11px] font-semibold text-slate-500">
                      <span className="rounded-full bg-slate-100 px-3 py-1.5">
                        Products:{" "}
                        {
                          productCounts.get(
                            category.slug
                          ) ??
                          0
                        }
                      </span>

                      <span className="rounded-full bg-slate-100 px-3 py-1.5">
                        Builds:{" "}
                        {
                          buildCounts.get(
                            category.slug
                          ) ??
                          0
                        }
                      </span>

                      <span className="rounded-full bg-slate-100 px-3 py-1.5">
                        Subcategories:{" "}
                        {
                          subcategories.filter(
                            (
                              item
                            ) =>
                              item.categoryId ===
                              category.id
                          ).length
                        }
                      </span>

                      <span className="rounded-full bg-brand/[0.06] px-3 py-1.5 text-brand">
                        {
                          category.slug
                        }
                      </span>
                    </div>

                    <div className="flex gap-2">
                      {!category.isSystem ? (
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
                            className="inline-flex items-center gap-2 rounded-lg border border-brand/15 px-3 py-2 text-xs font-bold text-brand"
                          >
                            {category.isVisible ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}

                            {category.isVisible
                              ? "Hide"
                              : "Show"}
                          </button>
                        </form>
                      ) : null}

                      {!category.isSystem ? (
                        <form
                          action={
                            deleteCategory
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
                            className="inline-flex items-center gap-2 rounded-lg border border-red-200 px-3 py-2 text-xs font-bold text-red-600"
                          >
                            <Trash2 className="h-4 w-4" />
                            Delete
                          </button>
                        </form>
                      ) : null}
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
        </section>

        {/* SUBCATEGORIES */}

        <section
          id="subcategories"
          className="mt-12"
        >
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-brand">
              Second Level
            </p>

            <h2 className="mt-2 font-display text-2xl font-extrabold uppercase text-brand-deep">
              Subcategories
            </h2>

            <p className="mt-2 max-w-3xl text-sm text-slate-500">
              Example: Accessories → Cooling Fans, Controllers,
              RGB Cables. A product keeps its main category and
              can optionally have one subcategory.
            </p>
          </div>

          <div className="mt-6 rounded-2xl border border-brand/10 bg-white p-6">
            <form
              action={
                createSubcategory
              }
              className="grid gap-4 md:grid-cols-2 xl:grid-cols-5"
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

                  {categories
                    .filter(
                      (
                        category
                      ) =>
                        category.appliesTo ===
                          "product" ||
                        category.appliesTo ===
                          "both"
                    )
                    .map(
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

              <Field label="Order">
                <input
                  name="sortOrder"
                  type="number"
                  min="0"
                  defaultValue="0"
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

          <div className="mt-5 space-y-3">
            {subcategories.length >
            0 ? (
              subcategories.map(
                (
                  subcategory
                ) => {
                  const parent =
                    categoryById.get(
                      subcategory.categoryId
                    );

                  return (
                    <div
                      key={
                        subcategory.id
                      }
                      className="rounded-2xl border border-brand/10 bg-white p-5"
                    >
                      <form
                        action={
                          updateSubcategory
                        }
                        className="grid gap-4 xl:grid-cols-[1.1fr_1.1fr_1.1fr_120px_170px]"
                      >
                        <input
                          type="hidden"
                          name="subcategoryId"
                          value={
                            subcategory.id
                          }
                        />

                        <Field label="Parent Category">
                          <select
                            name="categoryId"
                            defaultValue={
                              subcategory.categoryId
                            }
                            className={
                              inputClass
                            }
                          >
                            {categories
                              .filter(
                                (
                                  category
                                ) =>
                                  category.appliesTo ===
                                    "product" ||
                                  category.appliesTo ===
                                    "both"
                              )
                              .map(
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

                        <Field label="Name">
                          <input
                            name="name"
                            required
                            defaultValue={
                              subcategory.name
                            }
                            className={
                              inputClass
                            }
                          />
                        </Field>

                        <Field label="Slug">
                          <input
                            name="slug"
                            required
                            defaultValue={
                              subcategory.slug
                            }
                            className={
                              inputClass
                            }
                          />
                        </Field>

                        <Field label="Order">
                          <input
                            name="sortOrder"
                            type="number"
                            min="0"
                            defaultValue={
                              subcategory.sortOrder
                            }
                            className={
                              inputClass
                            }
                          />
                        </Field>

                        <div className="flex items-end gap-2">
                          <label className="flex h-[46px] flex-1 items-center gap-2 rounded-xl border border-brand/10 px-3 text-xs font-bold text-slate-600">
                            <input
                              name="isVisible"
                              type="checkbox"
                              defaultChecked={
                                subcategory.isVisible
                              }
                              className="h-4 w-4 accent-[#e60000]"
                            />

                            Visible
                          </label>

                          <button
                            type="submit"
                            className="grid h-[46px] w-[46px] place-items-center rounded-xl bg-brand text-white"
                          >
                            <Save className="h-4 w-4" />
                          </button>
                        </div>
                      </form>

                      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-brand/10 pt-4">
                        <div className="flex flex-wrap gap-2 text-[11px] font-semibold text-slate-500">
                          <span className="rounded-full bg-slate-100 px-3 py-1.5">
                            Parent:{" "}
                            {
                              parent?.name ??
                              "Unknown"
                            }
                          </span>

                          <span className="rounded-full bg-slate-100 px-3 py-1.5">
                            Products:{" "}
                            {
                              subcategoryCounts.get(
                                subcategory.id
                              ) ??
                              0
                            }
                          </span>

                          <span className="rounded-full bg-brand/[0.06] px-3 py-1.5 text-brand">
                            {
                              subcategory.slug
                            }
                          </span>
                        </div>

                        <div className="flex gap-2">
                          <form
                            action={
                              toggleSubcategoryVisibility
                            }
                          >
                            <input
                              type="hidden"
                              name="subcategoryId"
                              value={
                                subcategory.id
                              }
                            />

                            <button
                              type="submit"
                              className="inline-flex items-center gap-2 rounded-lg border border-brand/15 px-3 py-2 text-xs font-bold text-brand"
                            >
                              {subcategory.isVisible ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}

                              {subcategory.isVisible
                                ? "Hide"
                                : "Show"}
                            </button>
                          </form>

                          <form
                            action={
                              deleteSubcategory
                            }
                          >
                            <input
                              type="hidden"
                              name="subcategoryId"
                              value={
                                subcategory.id
                              }
                            />

                            <button
                              type="submit"
                              className="inline-flex items-center gap-2 rounded-lg border border-red-200 px-3 py-2 text-xs font-bold text-red-600"
                            >
                              <Trash2 className="h-4 w-4" />
                              Delete
                            </button>
                          </form>
                        </div>
                      </div>
                    </div>
                  );
                }
              )
            ) : (
              <div className="rounded-2xl border border-dashed border-brand/20 bg-white px-6 py-12 text-center text-sm text-slate-500">
                No subcategories yet.
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

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
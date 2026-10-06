"use client";

import {
  useRef,
  useState,
} from "react";

import {
  useRouter,
} from "next/navigation";

import {
  Eye,
  EyeOff,
  GripVertical,
  Save,
  Trash2,
} from "lucide-react";

import {
  deleteCategory,
  deleteSubcategory,
  reorderCategories,
  reorderSubcategories,
  toggleCategoryVisibility,
  toggleSubcategoryVisibility,
  updateCategory,
  updateSubcategory,
} from "./actions";

/* =========================================================
   TYPES
   ========================================================= */

type CategoryTarget =
  | "product"
  | "build"
  | "both";

export type CategoryRow = {
  id: number;
  name: string;
  slug: string;
  appliesTo: CategoryTarget;
  isVisible: boolean;
  isSystem: boolean;
  sortOrder: number;
};

export type SubcategoryRow = {
  id: number;
  categoryId: number;
  name: string;
  slug: string;
  isVisible: boolean;
  sortOrder: number;
};

type Props = {
  categories: CategoryRow[];
  subcategories: SubcategoryRow[];

  productCounts:
    Record<
      string,
      number
    >;

  buildCounts:
    Record<
      string,
      number
    >;

  subcategoryCounts:
    Record<
      string,
      number
    >;
};

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
   REORDER HELPER
   ========================================================= */

function moveById<
  T extends {
    id: number;
  },
>(
  items: T[],
  draggedId: number,
  overId: number
) {
  if (
    draggedId ===
    overId
  ) {
    return items;
  }

  const fromIndex =
    items.findIndex(
      (item) =>
        item.id ===
        draggedId
    );

  const toIndex =
    items.findIndex(
      (item) =>
        item.id ===
        overId
    );

  if (
    fromIndex === -1 ||
    toIndex === -1
  ) {
    return items;
  }

  const next = [
    ...items,
  ];

  const [
    moved,
  ] =
    next.splice(
      fromIndex,
      1
    );

  next.splice(
    toIndex,
    0,
    moved
  );

  return next;
}

/* =========================================================
   COMPONENT
   ========================================================= */

export default function CategoryOrderManager({
  categories:
    initialCategories,

  subcategories:
    initialSubcategories,

  productCounts,
  buildCounts,
  subcategoryCounts,
}: Props) {
  const router =
    useRouter();

  const [
    categories,
    setCategories,
  ] =
    useState(
      initialCategories
    );

  const [
    subcategories,
    setSubcategories,
  ] =
    useState(
      initialSubcategories
    );

  const categoryRef =
    useRef(
      initialCategories
    );

  const subcategoryRef =
    useRef(
      initialSubcategories
    );

  const [
    draggedCategoryId,
    setDraggedCategoryId,
  ] =
    useState<
      number | null
    >(
      null
    );

  const [
    draggedSubcategory,
    setDraggedSubcategory,
  ] =
    useState<{
      id: number;
      categoryId: number;
    } | null>(
      null
    );

  const [
    status,
    setStatus,
  ] =
    useState(
      ""
    );

  const [
    saving,
    setSaving,
  ] =
    useState(
      false
    );

  /* =======================================================
     MAIN CATEGORY DRAG
     ======================================================= */

  function moveCategory(
    overId: number
  ) {
    if (
      draggedCategoryId ===
      null
    ) {
      return;
    }

    setCategories(
      (current) => {
        const next =
          moveById(
            current,
            draggedCategoryId,
            overId
          );

        categoryRef.current =
          next;

        return next;
      }
    );
  }

  async function saveCategoryOrder() {
    if (
      draggedCategoryId ===
      null
    ) {
      return;
    }

    setDraggedCategoryId(
      null
    );

    setSaving(
      true
    );

    setStatus(
      "Saving category order..."
    );

    try {
      await reorderCategories(
        categoryRef.current.map(
          (category) =>
            category.id
        )
      );

      setStatus(
        "Category order saved."
      );

      router.refresh();
    } catch {
      setStatus(
        "Could not save category order."
      );

      router.refresh();
    } finally {
      setSaving(
        false
      );
    }
  }

  /* =======================================================
     SUBCATEGORY DRAG
     ======================================================= */

  function moveSubcategory(
    overId: number,
    categoryId: number
  ) {
    if (
      !draggedSubcategory ||
      draggedSubcategory.categoryId !==
        categoryId
    ) {
      return;
    }

    setSubcategories(
      (current) => {
        const next =
          moveById(
            current,
            draggedSubcategory.id,
            overId
          );

        subcategoryRef.current =
          next;

        return next;
      }
    );
  }

  async function saveSubcategoryOrder() {
    if (
      !draggedSubcategory
    ) {
      return;
    }

    const parentId =
      draggedSubcategory.categoryId;

    setDraggedSubcategory(
      null
    );

    setSaving(
      true
    );

    setStatus(
      "Saving subcategory order..."
    );

    try {
      const ids =
        subcategoryRef.current
          .filter(
            (item) =>
              item.categoryId ===
              parentId
          )
          .map(
            (item) =>
              item.id
          );

      await reorderSubcategories(
        parentId,
        ids
      );

      setStatus(
        "Subcategory order saved."
      );

      router.refresh();
    } catch {
      setStatus(
        "Could not save subcategory order."
      );

      router.refresh();
    } finally {
      setSaving(
        false
      );
    }
  }

  const productCategories =
    categories.filter(
      (category) =>
        category.appliesTo ===
          "product" ||
        category.appliesTo ===
          "both"
    );

  return (
    <>
      {/* =====================================================
          MAIN CATEGORY ORDER
          ===================================================== */}

      <section className="mt-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-brand">
              Drag & Drop
            </p>

            <h2 className="mt-2 font-display text-xl font-extrabold uppercase text-brand-deep">
              Main Categories
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Hold the drag handle and move a category up or down.
              The order is saved automatically.
            </p>
          </div>

          {status ? (
            <div
              className={`
                rounded-xl
                px-4
                py-2.5
                text-xs
                font-bold
                ${
                  status.includes(
                    "Could not"
                  )
                    ? "bg-red-50 text-red-600"
                    : "bg-emerald-50 text-emerald-700"
                }
              `}
            >
              {saving
                ? "Saving..."
                : status}
            </div>
          ) : null}
        </div>

        <div className="mt-5 space-y-4">
          {categories.map(
            (
              category,
              index
            ) => {
              const childSubcategories =
                subcategories.filter(
                  (item) =>
                    item.categoryId ===
                    category.id
                );

              return (
                <div
                  key={
                    category.id
                  }
                  onDragEnter={() =>
                    moveCategory(
                      category.id
                    )
                  }
                  onDragOver={(
                    event
                  ) =>
                    event.preventDefault()
                  }
                  className={`
                    rounded-2xl
                    border
                    bg-white
                    p-5
                    transition-all
                    ${
                      draggedCategoryId ===
                      category.id
                        ? "border-brand shadow-lg"
                        : "border-brand/10"
                    }
                  `}
                >
                  {/* DRAG HEADER */}

                  <div className="mb-5 flex items-center justify-between gap-3 border-b border-brand/10 pb-4">
                    <div className="flex min-w-0 items-center gap-3">
                      <button
                        type="button"
                        draggable
                        onDragStart={(
                          event
                        ) => {
                          event.dataTransfer.effectAllowed =
                            "move";

                          setDraggedCategoryId(
                            category.id
                          );
                        }}
                        onDragEnd={() =>
                          void saveCategoryOrder()
                        }
                        className="
                          grid
                          h-11
                          w-11
                          shrink-0
                          cursor-grab
                          place-items-center
                          rounded-xl
                          border
                          border-brand/15
                          bg-[#fff8f8]
                          text-brand
                          active:cursor-grabbing
                        "
                        aria-label={`Drag ${category.name}`}
                      >
                        <GripVertical className="h-5 w-5" />
                      </button>

                      <div className="min-w-0">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          Position{" "}
                          {index +
                            1}
                        </p>

                        <h3 className="truncate font-display text-lg font-extrabold uppercase text-brand-deep">
                          {
                            category.name
                          }
                        </h3>
                      </div>
                    </div>

                    <span className="rounded-full bg-brand/[0.07] px-3 py-1.5 text-[10px] font-bold uppercase text-brand">
                      Drag to reorder
                    </span>
                  </div>

                  {/* EDIT */}

                  <form
                    action={
                      updateCategory
                    }
                    className="grid gap-4 lg:grid-cols-3"
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

                    <div className="lg:col-span-3 flex flex-wrap items-center justify-between gap-3">
                      <label className="flex items-center gap-2 rounded-xl border border-brand/10 bg-[#f7f9fc] px-4 py-3 text-xs font-bold text-slate-600">
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
                        className="inline-flex items-center gap-2 rounded-xl bg-brand px-5 py-3 text-xs font-bold uppercase tracking-wider text-white"
                      >
                        <Save className="h-4 w-4" />
                        Save Category
                      </button>
                    </div>
                  </form>

                  {/* INFO + ACTIONS */}

                  <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-brand/10 pt-4">
                    <div className="flex flex-wrap gap-2 text-[11px] font-semibold text-slate-500">
                      <span className="rounded-full bg-slate-100 px-3 py-1.5">
                        Products:{" "}
                        {productCounts[
                          category.slug
                        ] ??
                          0}
                      </span>

                      <span className="rounded-full bg-slate-100 px-3 py-1.5">
                        Builds:{" "}
                        {buildCounts[
                          category.slug
                        ] ??
                          0}
                      </span>

                      <span className="rounded-full bg-slate-100 px-3 py-1.5">
                        Subcategories:{" "}
                        {
                          childSubcategories.length
                        }
                      </span>

                      <span className="rounded-full bg-brand/[0.06] px-3 py-1.5 text-brand">
                        {
                          category.slug
                        }
                      </span>
                    </div>

                    {!category.isSystem ? (
                      <div className="flex gap-2">
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
                      </div>
                    ) : null}
                  </div>

                  {/* CHILD SUBCATEGORY ORDER */}

                  {childSubcategories.length >
                  0 ? (
                    <div className="mt-5 rounded-2xl border border-brand/10 bg-[#fffafa] p-4">
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand">
                          Subcategory Order
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          Drag subcategories to reorder them inside{" "}
                          {
                            category.name
                          }
                          .
                        </p>
                      </div>

                      <div className="mt-4 space-y-2">
                        {childSubcategories.map(
                          (
                            subcategory,
                            subIndex
                          ) => (
                            <div
                              key={
                                subcategory.id
                              }
                              onDragEnter={() =>
                                moveSubcategory(
                                  subcategory.id,
                                  category.id
                                )
                              }
                              onDragOver={(
                                event
                              ) =>
                                event.preventDefault()
                              }
                              className={`
                                flex
                                items-center
                                gap-3
                                rounded-xl
                                border
                                bg-white
                                px-3
                                py-3
                                ${
                                  draggedSubcategory
                                    ?.id ===
                                  subcategory.id
                                    ? "border-brand"
                                    : "border-brand/10"
                                }
                              `}
                            >
                              <button
                                type="button"
                                draggable
                                onDragStart={(
                                  event
                                ) => {
                                  event.dataTransfer.effectAllowed =
                                    "move";

                                  setDraggedSubcategory(
                                    {
                                      id:
                                        subcategory.id,

                                      categoryId:
                                        category.id,
                                    }
                                  );
                                }}
                                onDragEnd={() =>
                                  void saveSubcategoryOrder()
                                }
                                className="grid h-9 w-9 shrink-0 cursor-grab place-items-center rounded-lg bg-brand/[0.07] text-brand active:cursor-grabbing"
                              >
                                <GripVertical className="h-4 w-4" />
                              </button>

                              <span className="w-7 text-center text-xs font-bold text-slate-400">
                                {subIndex +
                                  1}
                              </span>

                              <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-bold text-brand-deep">
                                  {
                                    subcategory.name
                                  }
                                </p>

                                <p className="truncate text-[10px] text-slate-400">
                                  {
                                    subcategory.slug
                                  }
                                </p>
                              </div>

                              <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-bold text-slate-500">
                                {
                                  subcategoryCounts[
                                    String(
                                      subcategory.id
                                    )
                                  ] ??
                                  0
                                }{" "}
                                products
                              </span>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  ) : null}
                </div>
              );
            }
          )}
        </div>
      </section>

      {/* =====================================================
          SUBCATEGORY EDITING
          ===================================================== */}

      <section
        id="subcategory-list"
        className="mt-8"
      >
        <h3 className="font-display text-xl font-extrabold uppercase text-brand-deep">
          Edit Subcategories
        </h3>

        <p className="mt-2 text-sm text-slate-500">
          Parent category, name and visibility can be changed
          here. Ordering is controlled with the drag handles
          above.
        </p>

        <div className="mt-5 space-y-3">
          {subcategories.length >
          0 ? (
            subcategories.map(
              (
                subcategory
              ) => {
                const parent =
                  categories.find(
                    (category) =>
                      category.id ===
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
                      className="grid gap-4 lg:grid-cols-3"
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

                      <div className="lg:col-span-3 flex flex-wrap items-center justify-between gap-3">
                        <label className="flex items-center gap-2 rounded-xl border border-brand/10 bg-[#f7f9fc] px-4 py-3 text-xs font-bold text-slate-600">
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
                          className="inline-flex items-center gap-2 rounded-xl bg-brand px-5 py-3 text-xs font-bold uppercase tracking-wider text-white"
                        >
                          <Save className="h-4 w-4" />
                          Save
                        </button>
                      </div>
                    </form>

                    <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-brand/10 pt-4">
                      <div className="flex flex-wrap gap-2 text-[11px] font-semibold text-slate-500">
                        <span className="rounded-full bg-slate-100 px-3 py-1.5">
                          Parent:{" "}
                          {parent?.name ??
                            "Unknown"}
                        </span>

                        <span className="rounded-full bg-slate-100 px-3 py-1.5">
                          Products:{" "}
                          {subcategoryCounts[
                            String(
                              subcategory.id
                            )
                          ] ??
                            0}
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
    </>
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
  children:
    React.ReactNode;
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
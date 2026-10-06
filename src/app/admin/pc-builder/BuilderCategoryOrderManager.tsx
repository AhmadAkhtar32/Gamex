"use client";

import {
  useRef,
  useState,
} from "react";

import {
  useRouter,
} from "next/navigation";

import {
  Boxes,
  GripVertical,
  Save,
} from "lucide-react";

import {
  reorderBuilderCategories,
  saveBuilderCategorySettings,
} from "./actions";

/* =========================================================
   TYPES
   ========================================================= */

export type BuilderCategoryRow = {
  id: number;

  name: string;

  slug: string;

  description: string;

  helpText: string;

  isRequired: boolean;

  isVisible: boolean;

  sortOrder: number;

  productCount: number;

  subcategories:
    string[];
};

type Props = {
  categories:
    BuilderCategoryRow[];
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
  focus:border-brand/50
  focus:shadow-[0_0_0_4px_rgba(230,0,0,0.08)]
`;

/* =========================================================
   MOVE HELPER
   ========================================================= */

function moveById(
  items:
    BuilderCategoryRow[],

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

export default function BuilderCategoryOrderManager({
  categories:
    initialCategories,
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

  const orderRef =
    useRef(
      initialCategories
    );

  const [
    draggedId,
    setDraggedId,
  ] =
    useState<
      number | null
    >(
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

  function moveCategory(
    overId: number
  ) {
    if (
      draggedId ===
      null
    ) {
      return;
    }

    setCategories(
      (current) => {
        const next =
          moveById(
            current,
            draggedId,
            overId
          );

        orderRef.current =
          next;

        return next;
      }
    );
  }

  async function saveOrder() {
    if (
      draggedId ===
      null
    ) {
      return;
    }

    setDraggedId(
      null
    );

    setSaving(
      true
    );

    setStatus(
      "Saving Builder order..."
    );

    try {
      await reorderBuilderCategories(
        orderRef.current.map(
          (category) =>
            category.id
        )
      );

      setStatus(
        "Builder order saved."
      );

      router.refresh();
    } catch {
      setStatus(
        "Could not save Builder order."
      );

      router.refresh();
    } finally {
      setSaving(
        false
      );
    }
  }

  return (
    <div className="mt-6">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-slate-500">
          Drag categories up or down. This order is used by
          Build Your Rig.
        </p>

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

      <div className="space-y-4">
        {categories.map(
          (
            category,
            index
          ) => (
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
                md:p-6
                ${
                  draggedId ===
                  category.id
                    ? "border-brand shadow-lg"
                    : "border-brand/10"
                }
              `}
            >
              {/* DRAG HEADER */}

              <div className="mb-5 flex flex-col gap-4 border-b border-brand/10 pb-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex min-w-0 items-center gap-3">
                  <button
                    type="button"
                    draggable
                    onDragStart={(
                      event
                    ) => {
                      event.dataTransfer.effectAllowed =
                        "move";

                      setDraggedId(
                        category.id
                      );
                    }}
                    onDragEnd={() =>
                      void saveOrder()
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

                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand/[0.08] text-brand">
                    <Boxes className="h-5 w-5" />
                  </div>

                  <div className="min-w-0">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Builder Position{" "}
                      {index +
                        1}
                    </p>

                    <h3 className="truncate font-display text-lg font-extrabold uppercase text-brand-deep">
                      {
                        category.name
                      }
                    </h3>

                    <p className="mt-1 break-all text-[11px] font-semibold text-brand/70">
                      {
                        category.slug
                      }
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 text-[10px] font-bold uppercase text-slate-500">
                  <span className="rounded-full bg-slate-100 px-3 py-1.5">
                    {
                      category.productCount
                    }{" "}
                    products
                  </span>

                  <span className="rounded-full bg-slate-100 px-3 py-1.5">
                    {
                      category.subcategories.length
                    }{" "}
                    subcategories
                  </span>

                  <span className="rounded-full bg-brand/[0.06] px-3 py-1.5 text-brand">
                    Drag to reorder
                  </span>
                </div>
              </div>

              {/* CATEGORY SETTINGS */}

              <form
                action={
                  saveBuilderCategorySettings
                }
              >
                <input
                  type="hidden"
                  name="catalogCategoryId"
                  value={
                    category.id
                  }
                />

                <div className="grid gap-4 md:grid-cols-2">
                  <Field label="Description">
                    <input
                      name="description"
                      defaultValue={
                        category.description
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
                        category.helpText
                      }
                      placeholder="Short compatibility/help message"
                      className={
                        inputClass
                      }
                    />
                  </Field>
                </div>

                {category.subcategories.length >
                0 ? (
                  <div className="mt-4 rounded-xl bg-[#fff8f8] px-4 py-3 text-xs text-slate-500">
                    <span className="font-bold text-brand-deep">
                      Subcategories:{" "}
                    </span>

                    {
                      category.subcategories.join(
                        ", "
                      )
                    }
                  </div>
                ) : null}

                <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-brand/10 pt-4">
                  <div className="flex flex-wrap gap-4">
                    <Toggle
                      name="isVisible"
                      label="Show in Builder"
                      defaultChecked={
                        category.isVisible
                      }
                    />

                    <Toggle
                      name="isRequired"
                      label="Required"
                      defaultChecked={
                        category.isRequired
                      }
                    />
                  </div>

                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 rounded-xl bg-brand px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-white"
                  >
                    <Save className="h-4 w-4" />
                    Save Category
                  </button>
                </div>
              </form>
            </div>
          )
        )}
      </div>
    </div>
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
    <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-brand/10 bg-[#f7f9fc] px-4 py-3 text-xs font-bold text-slate-600">
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
"use client";

import {
  useEffect,
  useState,
  useTransition,
} from "react";

import {
  useRouter,
} from "next/navigation";

import {
  Check,
  GripVertical,
  Loader2,
} from "lucide-react";

import {
  reorderBuilderCategories,
} from "./actions";

/* =========================================================
   TYPES
   ========================================================= */

type SortableCategory = {
  id: number;

  name: string;

  slug: string;

  productCount: number;

  subcategoryCount: number;

  isVisible: boolean;

  isRequired: boolean;
};

type BuilderCategoryOrderProps = {
  categories: SortableCategory[];
};

/* =========================================================
   COMPONENT
   ========================================================= */

export function BuilderCategoryOrder({
  categories,
}: BuilderCategoryOrderProps) {
  const router =
    useRouter();

  const [
    items,
    setItems,
  ] =
    useState<
      SortableCategory[]
    >(
      categories
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
    overId,
    setOverId,
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
    useState<
      | ""
      | "saved"
      | "error"
    >(
      ""
    );

  const [
    isPending,
    startTransition,
  ] =
    useTransition();

  /* =======================================================
     KEEP CLIENT ORDER IN SYNC AFTER SERVER REFRESH
     ======================================================= */

  useEffect(
    () => {
      setItems(
        categories
      );
    },
    [
      categories,
    ]
  );

  /* =======================================================
     SAVE ORDER
     ======================================================= */

  function saveOrder(
    nextItems: SortableCategory[]
  ) {
    const ids =
      nextItems.map(
        (
          item
        ) =>
          item.id
      );

    setStatus(
      ""
    );

    startTransition(
      async () => {
        try {
          await reorderBuilderCategories(
            ids
          );

          setStatus(
            "saved"
          );

          router.refresh();

          window.setTimeout(
            () => {
              setStatus(
                ""
              );
            },
            1800
          );
        } catch (
          error
        ) {
          console.error(
            error
          );

          setItems(
            categories
          );

          setStatus(
            "error"
          );
        }
      }
    );
  }

  /* =======================================================
     DROP
     ======================================================= */

  function handleDrop(
    targetId: number
  ) {
    if (
      draggedId ===
        null ||
      draggedId ===
        targetId ||
      isPending
    ) {
      setDraggedId(
        null
      );

      setOverId(
        null
      );

      return;
    }

    const fromIndex =
      items.findIndex(
        (
          item
        ) =>
          item.id ===
          draggedId
      );

    const toIndex =
      items.findIndex(
        (
          item
        ) =>
          item.id ===
          targetId
      );

    if (
      fromIndex <
        0 ||
      toIndex <
        0
    ) {
      setDraggedId(
        null
      );

      setOverId(
        null
      );

      return;
    }

    const nextItems = [
      ...items,
    ];

    const [
      movedItem,
    ] =
      nextItems.splice(
        fromIndex,
        1
      );

    nextItems.splice(
      toIndex,
      0,
      movedItem
    );

    setItems(
      nextItems
    );

    setDraggedId(
      null
    );

    setOverId(
      null
    );

    saveOrder(
      nextItems
    );
  }

  /* =======================================================
     EMPTY
     ======================================================= */

  if (
    items.length ===
    0
  ) {
    return null;
  }

  /* =======================================================
     UI
     ======================================================= */

  return (
    <div
      className="
        overflow-hidden
        rounded-2xl
        border
        border-brand/10
        bg-white
      "
    >
      {/* ===================================================
          HEADER
          =================================================== */}

      <div
        className="
          flex
          flex-col
          gap-3
          border-b
          border-brand/10
          bg-[#fffafa]
          px-5
          py-4
          sm:flex-row
          sm:items-center
          sm:justify-between
        "
      >
        <div>
          <p
            className="
              text-xs
              font-bold
              uppercase
              tracking-[0.16em]
              text-brand-deep
            "
          >
            Drag To Reorder
          </p>

          <p
            className="
              mt-1
              text-xs
              leading-5
              text-slate-500
            "
          >
            Hold the grip icon and drag a category up or down.
            Changes are saved automatically.
          </p>
        </div>

        <div
          className="
            flex
            min-h-8
            items-center
            text-xs
            font-bold
          "
        >
          {isPending ? (
            <span
              className="
                inline-flex
                items-center
                gap-2
                text-slate-500
              "
            >
              <Loader2 className="h-4 w-4 animate-spin" />

              Saving order...
            </span>
          ) : null}

          {!isPending &&
          status ===
            "saved" ? (
            <span
              className="
                inline-flex
                items-center
                gap-2
                text-emerald-600
              "
            >
              <Check className="h-4 w-4" />

              Order saved
            </span>
          ) : null}

          {!isPending &&
          status ===
            "error" ? (
            <span className="text-red-600">
              Could not save order.
            </span>
          ) : null}
        </div>
      </div>

      {/* ===================================================
          SORTABLE LIST
          =================================================== */}

      <div className="divide-y divide-brand/[0.07]">
        {items.map(
          (
            category,
            index
          ) => {
            const isDragging =
              draggedId ===
              category.id;

            const isOver =
              overId ===
                category.id &&
              draggedId !==
                category.id;

            return (
              <div
                key={
                  category.id
                }
                draggable={
                  !isPending
                }
                onDragStart={(
                  event
                ) => {
                  setDraggedId(
                    category.id
                  );

                  event.dataTransfer.effectAllowed =
                    "move";

                  event.dataTransfer.setData(
                    "text/plain",
                    String(
                      category.id
                    )
                  );
                }}
                onDragEnter={(
                  event
                ) => {
                  event.preventDefault();

                  if (
                    draggedId !==
                    category.id
                  ) {
                    setOverId(
                      category.id
                    );
                  }
                }}
                onDragOver={(
                  event
                ) => {
                  event.preventDefault();

                  event.dataTransfer.dropEffect =
                    "move";

                  if (
                    draggedId !==
                    category.id
                  ) {
                    setOverId(
                      category.id
                    );
                  }
                }}
                onDrop={(
                  event
                ) => {
                  event.preventDefault();

                  handleDrop(
                    category.id
                  );
                }}
                onDragEnd={() => {
                  setDraggedId(
                    null
                  );

                  setOverId(
                    null
                  );
                }}
                className={`
                  group
                  flex
                  cursor-grab
                  select-none
                  items-center
                  gap-4
                  px-4
                  py-4
                  transition-all
                  active:cursor-grabbing
                  sm:px-5

                  ${
                    isDragging
                      ? "opacity-40"
                      : "opacity-100"
                  }

                  ${
                    isOver
                      ? "bg-brand/[0.06]"
                      : "bg-white"
                  }
                `}
              >
                {/* =========================================
                    POSITION
                    ========================================= */}

                <div
                  className="
                    grid
                    h-9
                    w-9
                    shrink-0
                    place-items-center
                    rounded-lg
                    bg-brand/[0.07]
                    font-display
                    text-xs
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

                {/* =========================================
                    DRAG HANDLE
                    ========================================= */}

                <div
                  className="
                    grid
                    h-10
                    w-8
                    shrink-0
                    place-items-center
                    text-slate-300
                    transition
                    group-hover:text-brand
                  "
                  title="Drag to reorder"
                >
                  <GripVertical className="h-5 w-5" />
                </div>

                {/* =========================================
                    NAME
                    ========================================= */}

                <div className="min-w-0 flex-1">
                  <p
                    className="
                      truncate
                      font-display
                      text-sm
                      font-extrabold
                      uppercase
                      text-brand-deep
                    "
                  >
                    {
                      category.name
                    }
                  </p>

                  <p
                    className="
                      mt-0.5
                      truncate
                      text-[11px]
                      font-semibold
                      text-slate-400
                    "
                  >
                    {
                      category.slug
                    }
                  </p>
                </div>

                {/* =========================================
                    COUNTS
                    ========================================= */}

                <div
                  className="
                    hidden
                    flex-wrap
                    items-center
                    justify-end
                    gap-2
                    md:flex
                  "
                >
                  <span
                    className="
                      rounded-full
                      bg-slate-100
                      px-3
                      py-1.5
                      text-[10px]
                      font-bold
                      uppercase
                      text-slate-500
                    "
                  >
                    {
                      category.productCount
                    }{" "}
                    products
                  </span>

                  {category.subcategoryCount >
                  0 ? (
                    <span
                      className="
                        rounded-full
                        bg-slate-100
                        px-3
                        py-1.5
                        text-[10px]
                        font-bold
                        uppercase
                        text-slate-500
                      "
                    >
                      {
                        category.subcategoryCount
                      }{" "}
                      subcategories
                    </span>
                  ) : null}

                  {category.isRequired ? (
                    <span
                      className="
                        rounded-full
                        bg-brand/[0.08]
                        px-3
                        py-1.5
                        text-[10px]
                        font-bold
                        uppercase
                        text-brand
                      "
                    >
                      Required
                    </span>
                  ) : (
                    <span
                      className="
                        rounded-full
                        bg-slate-100
                        px-3
                        py-1.5
                        text-[10px]
                        font-bold
                        uppercase
                        text-slate-500
                      "
                    >
                      Optional
                    </span>
                  )}

                  {!category.isVisible ? (
                    <span
                      className="
                        rounded-full
                        bg-amber-50
                        px-3
                        py-1.5
                        text-[10px]
                        font-bold
                        uppercase
                        text-amber-700
                      "
                    >
                      Hidden
                    </span>
                  ) : null}
                </div>
              </div>
            );
          }
        )}
      </div>
    </div>
  );
}
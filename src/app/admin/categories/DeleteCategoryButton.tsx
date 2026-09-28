"use client";

import {
  Trash2,
} from "lucide-react";

import {
  deleteCategory,
} from "./actions";

export function DeleteCategoryButton({
  categoryId,
  categoryName,
  disabled = false,
}: {
  categoryId: number;

  categoryName: string;

  disabled?: boolean;
}) {
  return (
    <form
      action={
        deleteCategory
      }
      onSubmit={(
        event
      ) => {
        if (
          disabled
        ) {
          event.preventDefault();

          return;
        }

        const confirmed =
          window.confirm(
            `Delete "${categoryName}"?\n\nThis cannot be undone.`
          );

        if (
          !confirmed
        ) {
          event.preventDefault();
        }
      }}
    >
      <input
        type="hidden"
        name="categoryId"
        value={
          categoryId
        }
      />

      <button
        type="submit"
        disabled={
          disabled
        }
        className="
          inline-flex
          items-center
          justify-center
          gap-2
          rounded-lg
          border
          border-red-200
          bg-white
          px-3
          py-2.5
          text-[10px]
          font-bold
          uppercase
          tracking-wider
          text-red-600
          transition-all
          hover:bg-red-50
          disabled:cursor-not-allowed
          disabled:border-slate-200
          disabled:bg-slate-100
          disabled:text-slate-400
        "
      >
        <Trash2 className="h-3.5 w-3.5" />

        Delete
      </button>
    </form>
  );
}
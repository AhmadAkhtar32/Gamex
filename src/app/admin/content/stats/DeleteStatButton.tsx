"use client";

import { useState } from "react";
import {
  Trash2,
  X,
} from "lucide-react";

import { deleteStat } from "./actions";

type DeleteStatButtonProps = {
  statId: number;
  statLabel: string;
};

export default function DeleteStatButton({
  statId,
  statLabel,
}: DeleteStatButtonProps) {
  const [isOpen, setIsOpen] =
    useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() =>
          setIsOpen(true)
        }
        className="
          inline-flex
          items-center
          gap-1.5
          rounded-lg
          border
          border-red-200
          bg-white
          px-3
          py-2
          text-xs
          font-bold
          text-red-600
          transition-all
          hover:border-red-600
          hover:bg-red-600
          hover:text-white
        "
      >
        <Trash2 className="h-3.5 w-3.5" />

        Delete
      </button>

      {isOpen ? (
        <div
          className="
            fixed
            inset-0
            z-[9999]
            flex
            items-center
            justify-center
            bg-brand-deep/40
            px-5
            backdrop-blur-sm
          "
        >
          <div
            className="
              relative
              w-full
              max-w-md
              rounded-2xl
              border
              border-brand/10
              bg-white
              p-6
              shadow-2xl
            "
          >
            <button
              type="button"
              onClick={() =>
                setIsOpen(false)
              }
              className="
                absolute
                right-4
                top-4
                grid
                h-9
                w-9
                place-items-center
                rounded-lg
                text-slate-400
                transition-all
                hover:bg-slate-100
                hover:text-brand-deep
              "
              aria-label="Close delete confirmation"
            >
              <X className="h-4 w-4" />
            </button>

            <div
              className="
                grid
                h-12
                w-12
                place-items-center
                rounded-xl
                bg-red-50
                text-red-600
              "
            >
              <Trash2 className="h-5 w-5" />
            </div>

            <h2
              className="
                mt-5
                font-display
                text-xl
                font-bold
                uppercase
                text-brand-deep
              "
            >
              Delete Statistic?
            </h2>

            <p className="mt-3 text-sm leading-relaxed text-slate-500">
              You are about to permanently delete{" "}
              <strong className="text-brand-deep">
                {statLabel}
              </strong>
              .
            </p>

            <p className="mt-2 text-sm font-semibold text-red-600">
              This action cannot be undone.
            </p>

            <div
              className="
                mt-7
                flex
                flex-col
                gap-3
                sm:flex-row
                sm:justify-end
              "
            >
              <button
                type="button"
                onClick={() =>
                  setIsOpen(false)
                }
                className="
                  rounded-xl
                  border
                  border-brand/15
                  bg-white
                  px-5
                  py-3
                  text-xs
                  font-bold
                  uppercase
                  tracking-wider
                  text-brand
                  transition-all
                  hover:bg-brand/[0.05]
                "
              >
                Cancel
              </button>

              <form action={deleteStat}>
                <input
                  type="hidden"
                  name="statId"
                  value={statId}
                />

                <button
                  type="submit"
                  className="
                    inline-flex
                    w-full
                    items-center
                    justify-center
                    gap-2
                    rounded-xl
                    bg-red-600
                    px-5
                    py-3
                    text-xs
                    font-bold
                    uppercase
                    tracking-wider
                    text-white
                    transition-all
                    hover:bg-red-700
                  "
                >
                  <Trash2 className="h-4 w-4" />

                  Delete Stat
                </button>
              </form>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
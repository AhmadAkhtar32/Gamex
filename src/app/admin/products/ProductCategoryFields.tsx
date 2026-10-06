"use client";

import {
  useMemo,
  useState,
} from "react";

type CategoryOption = {
  id: number;
  name: string;
  slug: string;
};

type SubcategoryOption = {
  id: number;
  categorySlug: string;
  name: string;
  slug: string;
};

export function ProductCategoryFields({
  categories,
  subcategories,
  defaultCategory = "",
  defaultSubcategory = "",
  inputClass,
}: {
  categories:
    CategoryOption[];

  subcategories:
    SubcategoryOption[];

  defaultCategory?: string;

  defaultSubcategory?: string;

  inputClass: string;
}) {
  const [
    category,
    setCategory,
  ] =
    useState(
      defaultCategory
    );

  const [
    subcategory,
    setSubcategory,
  ] =
    useState(
      defaultSubcategory
    );

  const availableSubcategories =
    useMemo(
      () =>
        subcategories.filter(
          (
            item
          ) =>
            item.categorySlug ===
            category
        ),

      [
        category,
        subcategories,
      ]
    );

  function handleCategoryChange(
    nextCategory: string
  ) {
    setCategory(
      nextCategory
    );

    const currentStillValid =
      subcategories.some(
        (
          item
        ) =>
          item.slug ===
            subcategory &&
          item.categorySlug ===
            nextCategory
      );

    if (
      !currentStillValid
    ) {
      setSubcategory(
        ""
      );
    }
  }

  return (
    <>
      <div>
        <label
          htmlFor="category"
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
          Category
        </label>

        <select
          id="category"
          name="category"
          required
          value={
            category
          }
          onChange={(
            event
          ) =>
            handleCategoryChange(
              event.target.value
            )
          }
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

          {categories.map(
            (
              item
            ) => (
              <option
                key={
                  item.id
                }
                value={
                  item.slug
                }
              >
                {
                  item.name
                }
              </option>
            )
          )}
        </select>

        <p className="mt-2 text-xs leading-relaxed text-slate-400">
          This is the main category used on the website and in
          Build Your Rig.
        </p>
      </div>

      <div>
        <label
          htmlFor="subcategory"
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
          Subcategory
        </label>

        <select
          id="subcategory"
          name="subcategory"
          value={
            subcategory
          }
          onChange={(
            event
          ) =>
            setSubcategory(
              event.target.value
            )
          }
          disabled={
            !category ||
            availableSubcategories.length ===
              0
          }
          className={`${inputClass} disabled:cursor-not-allowed disabled:opacity-60`}
        >
          <option value="">
            {availableSubcategories.length >
            0
              ? "No subcategory"
              : "No subcategories available"}
          </option>

          {availableSubcategories.map(
            (
              item
            ) => (
              <option
                key={
                  item.id
                }
                value={
                  item.slug
                }
              >
                {
                  item.name
                }
              </option>
            )
          )}
        </select>

        <p className="mt-2 text-xs leading-relaxed text-slate-400">
          Optional. Subcategories are managed from Admin →
          Categories.
        </p>
      </div>
    </>
  );
}
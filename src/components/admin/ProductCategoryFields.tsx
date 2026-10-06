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
  categoryId: number;
  name: string;
  slug: string;
};

const inputClass = `
  w-full
  rounded-xl
  border
  border-brand/15
  bg-[#f7f9fc]
  px-4
  py-3.5
  text-sm
  text-brand-deep
  outline-none
  transition-all
  hover:border-brand/25
  focus:border-brand/60
  focus:bg-white
  focus:shadow-[0_0_0_3px_rgba(23,49,96,0.10)]
`;

export function ProductCategoryFields({
  categories,
  subcategories,
  defaultCategory =
    "",
  defaultSubcategoryId =
    null,
}: {
  categories: CategoryOption[];

  subcategories: SubcategoryOption[];

  defaultCategory?: string;

  defaultSubcategoryId?:
    | number
    | null;
}) {
  const initialCategory =
    categories.find(
      (
        category
      ) =>
        category.slug ===
        defaultCategory
    );

  const [
    categorySlug,
    setCategorySlug,
  ] =
    useState(
      defaultCategory
    );

  const [
    subcategoryId,
    setSubcategoryId,
  ] =
    useState(
      defaultSubcategoryId
        ? String(
            defaultSubcategoryId
          )
        : ""
    );

  const selectedCategory =
    categories.find(
      (
        category
      ) =>
        category.slug ===
        categorySlug
    ) ??
    initialCategory;

  const visibleSubcategories =
    useMemo(
      () =>
        selectedCategory
          ? subcategories.filter(
              (
                subcategory
              ) =>
                subcategory.categoryId ===
                selectedCategory.id
            )
          : [],
      [
        selectedCategory,
        subcategories,
      ]
    );

  return (
    <>
      <div>
        <label
          htmlFor="category"
          className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-600"
        >
          Category
        </label>

        <select
          id="category"
          name="category"
          required
          value={
            categorySlug
          }
          onChange={(
            event
          ) => {
            setCategorySlug(
              event.target
                .value
            );

            setSubcategoryId(
              ""
            );
          }}
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
              category
            ) => (
              <option
                key={
                  category.id
                }
                value={
                  category.slug
                }
              >
                {
                  category.name
                }
              </option>
            )
          )}
        </select>

        <p className="mt-2 text-xs text-slate-400">
          Main category controls where the product appears on the
          website and in Build Your Rig.
        </p>
      </div>

      <div>
        <label
          htmlFor="subcategoryId"
          className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-600"
        >
          Subcategory
        </label>

        <select
          id="subcategoryId"
          name="subcategoryId"
          value={
            subcategoryId
          }
          onChange={(
            event
          ) =>
            setSubcategoryId(
              event.target
                .value
            )
          }
          disabled={
            !selectedCategory
          }
          className={`${inputClass} disabled:cursor-not-allowed disabled:bg-slate-100`}
        >
          <option value="">
            No subcategory
          </option>

          {visibleSubcategories.map(
            (
              subcategory
            ) => (
              <option
                key={
                  subcategory.id
                }
                value={
                  subcategory.id
                }
              >
                {
                  subcategory.name
                }
              </option>
            )
          )}
        </select>

        <p className="mt-2 text-xs text-slate-400">
          Optional. Example: Accessories → Cooling Fans.
        </p>
      </div>
    </>
  );
}
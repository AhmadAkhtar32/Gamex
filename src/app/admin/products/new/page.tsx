import Link from "next/link";
import {
  ArrowLeft,
  ImageIcon,
  ListChecks,
  PackagePlus,
  Tag,
} from "lucide-react";

import { requireAdmin } from "@/lib/admin-auth";
import { createProduct } from "../actions";

type NewProductPageProps = {
  searchParams: Promise<{
    error?: string;
  }>;
};

export default async function NewProductPage({
  searchParams,
}: NewProductPageProps) {
  await requireAdmin();

  const params = await searchParams;
  const error = params.error;

  return (
    <main className="min-h-screen bg-[#f7f9fc]">
      {/* =====================================================
          TOP BAR
          ===================================================== */}

      <header className="border-b border-brand/10 bg-white">
        <div
          className="
            mx-auto
            flex
            max-w-5xl
            items-center
            justify-between
            gap-4
            px-5
            py-4
            md:px-8
          "
        >
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
              Gamex Admin
            </p>

            <p className="mt-0.5 text-xs text-slate-500">
              Add New Product
            </p>
          </div>

          <Link
            href="/admin/products"
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

            Products
          </Link>
        </div>
      </header>

      {/* =====================================================
          CONTENT
          ===================================================== */}

      <div
        className="
          mx-auto
          max-w-5xl
          px-5
          py-10
          md:px-8
          md:py-14
        "
      >
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
            Add Product
          </h1>

          <p
            className="
              mt-3
              max-w-2xl
              text-sm
              leading-relaxed
              text-slate-500
            "
          >
            Enter the product information below. After saving,
            the product will be stored in your Neon database.
          </p>
        </div>

        {/* Error */}

        {error ? (
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
            {error}
          </div>
        ) : null}

        {/* ===================================================
            FORM
            =================================================== */}

        <form
          action={createProduct}
          className="
            mt-8
            rounded-2xl
            border
            border-brand/10
            bg-white
            p-6
            shadow-[0_25px_65px_-45px_rgba(23,49,96,0.35)]
            md:p-8
          "
        >
          <div
            className="
              grid
              gap-6
              md:grid-cols-2
            "
          >
            {/* Product Name */}

            <FormField
              label="Product Name"
              htmlFor="name"
            >
              <input
                id="name"
                name="name"
                type="text"
                required
                maxLength={255}
                placeholder="e.g. Gamex Titan X"
                className={inputClass}
              />
            </FormField>

            {/* Category */}

            <FormField
              label="Category"
              htmlFor="category"
            >
              <select
                id="category"
                name="category"
                required
                defaultValue=""
                className={inputClass}
              >
                <option value="" disabled>
                  Select category
                </option>

                <option value="custom-pcs">
                  Custom PCs
                </option>

                <option value="graphics-cards">
                  Graphics Cards
                </option>

                <option value="ram">
                  RAM
                </option>

                <option value="processors">
                  Processors
                </option>

                <option value="accessories">
                  Accessories
                </option>
              </select>
            </FormField>

            {/* Tag */}

            <FormField
              label="Product Tag"
              htmlFor="tag"
            >
              <div className="relative">
                <Tag
                  className="
                    pointer-events-none
                    absolute
                    left-4
                    top-1/2
                    h-4
                    w-4
                    -translate-y-1/2
                    text-slate-400
                  "
                />

                <input
                  id="tag"
                  name="tag"
                  type="text"
                  maxLength={120}
                  placeholder="e.g. NEW"
                  className={`${inputClass} pl-11`}
                />
              </div>

              <p className="mt-2 text-xs text-slate-400">
                Leave empty to use FEATURED.
              </p>
            </FormField>

            {/* Display Order */}

            <FormField
              label="Display Order"
              htmlFor="sortOrder"
            >
              <input
                id="sortOrder"
                name="sortOrder"
                type="number"
                min="0"
                step="1"
                defaultValue="0"
                className={inputClass}
              />

              <p className="mt-2 text-xs text-slate-400">
                Lower numbers appear first.
              </p>
            </FormField>
          </div>

          {/* Description */}

          <div className="mt-6">
            <FormField
              label="Description"
              htmlFor="description"
            >
              <textarea
                id="description"
                name="description"
                required
                rows={5}
                placeholder="Describe the product..."
                className={`${inputClass} resize-y`}
              />
            </FormField>
          </div>

          {/* Specifications */}

          <div className="mt-6">
            <FormField
              label="Specifications"
              htmlFor="specs"
            >
              <div className="relative">
                <ListChecks
                  className="
                    pointer-events-none
                    absolute
                    left-4
                    top-4
                    h-4
                    w-4
                    text-slate-400
                  "
                />

                <textarea
                  id="specs"
                  name="specs"
                  required
                  rows={6}
                  placeholder={`RTX 5090
Ryzen 9 9950X3D
64GB DDR5
4TB NVMe SSD`}
                  className={`${inputClass} resize-y pl-11`}
                />
              </div>

              <p className="mt-2 text-xs text-slate-400">
                Enter one specification per line.
              </p>
            </FormField>
          </div>

          {/* Image */}

          <div className="mt-6">
            <FormField
              label="Image URL"
              htmlFor="image"
            >
              <div className="relative">
                <ImageIcon
                  className="
                    pointer-events-none
                    absolute
                    left-4
                    top-1/2
                    h-4
                    w-4
                    -translate-y-1/2
                    text-slate-400
                  "
                />

                <input
                  id="image"
                  name="image"
                  type="url"
                  required
                  maxLength={1000}
                  placeholder="https://..."
                  className={`${inputClass} pl-11`}
                />
              </div>
            </FormField>
          </div>

          {/* Visibility */}

          <div
            className="
              mt-7
              rounded-xl
              border
              border-brand/10
              bg-[#f7f9fc]
              p-5
            "
          >
            <label
              htmlFor="isVisible"
              className="
                flex
                cursor-pointer
                items-start
                gap-3
              "
            >
              <input
                id="isVisible"
                name="isVisible"
                type="checkbox"
                defaultChecked
                className="
                  mt-1
                  h-4
                  w-4
                  accent-[#173160]
                "
              />

              <span>
                <span
                  className="
                    block
                    text-sm
                    font-bold
                    text-brand-deep
                  "
                >
                  Visible on website
                </span>

                <span
                  className="
                    mt-1
                    block
                    text-xs
                    leading-relaxed
                    text-slate-500
                  "
                >
                  Turn this off if you want to save the product
                  without displaying it publicly.
                </span>
              </span>
            </label>
          </div>

          {/* Buttons */}

          <div
            className="
              mt-8
              flex
              flex-col
              gap-3
              border-t
              border-brand/10
              pt-6
              sm:flex-row
              sm:justify-end
            "
          >
            <Link
              href="/admin/products"
              className="
                inline-flex
                items-center
                justify-center
                rounded-xl
                border
                border-brand/15
                bg-white
                px-6
                py-3.5
                text-xs
                font-bold
                uppercase
                tracking-wider
                text-brand
                transition-all
                hover:border-brand
                hover:bg-brand/[0.05]
              "
            >
              Cancel
            </Link>

            <button
              type="submit"
              className="
                inline-flex
                items-center
                justify-center
                gap-2
                rounded-xl
                bg-brand
                px-6
                py-3.5
                font-display
                text-xs
                font-bold
                uppercase
                tracking-wider
                text-white
                transition-all
                hover:-translate-y-0.5
                hover:bg-brand-soft
              "
            >
              <PackagePlus className="h-4 w-4" />

              Save Product
            </button>
          </div>
        </form>
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
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label
        htmlFor={htmlFor}
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
        {label}
      </label>

      {children}
    </div>
  );
}

/* =========================================================
   SHARED INPUT STYLE
   ========================================================= */

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
  placeholder:text-slate-400
  hover:border-brand/25
  focus:border-brand/60
  focus:bg-white
  focus:shadow-[0_0_0_3px_rgba(23,49,96,0.10)]
`;
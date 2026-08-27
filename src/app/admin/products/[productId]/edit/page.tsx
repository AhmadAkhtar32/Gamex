import type { ReactNode } from "react";

import Link from "next/link";

import {
  ArrowLeft,
  ImageIcon,
  LinkIcon,
  ListChecks,
  Save,
  Tag,
  Upload,
} from "lucide-react";

import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";

import { db } from "@/db";
import { products } from "@/db/schema";
import { requireAdmin } from "@/lib/admin-auth";

import { updateProduct } from "../../../actions";

/* =========================================================
   TYPES
   ========================================================= */

type EditProductPageProps = {
  params: Promise<{
    productId: string;
  }>;

  searchParams: Promise<{
    error?: string;
  }>;
};

/* =========================================================
   PAGE
   ========================================================= */

export default async function EditProductPage({
  params,
  searchParams,
}: EditProductPageProps) {
  /*
   * Only administrators may access this page.
   */
  await requireAdmin();

  const { productId } =
    await params;

  const query =
    await searchParams;

  const error =
    query.error;

  /* =======================================================
     LOAD PRODUCT
     ======================================================= */

  const rows = await db
    .select()
    .from(products)
    .where(
      eq(
        products.id,
        productId
      )
    )
    .limit(1);

  const product =
    rows[0];

  /*
   * Product does not exist anymore.
   */
  if (!product) {
    redirect(
      "/admin/products"
    );
  }

  /*
   * Convert the PostgreSQL array back into
   * one specification per line for the textarea.
   */
  const specifications =
    product.specs.join("\n");

  return (
    <main className="min-h-screen bg-[#f7f9fc]">
      {/* =====================================================
          HEADER
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
              Edit Product
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
        {/* ===================================================
            TITLE
            =================================================== */}

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
            Edit Product
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
            Update the product details below. Changes will be
            saved to Neon and reflected on the public website.
          </p>

          <p
            className="
              mt-2
              text-xs
              text-slate-400
            "
          >
            Product ID: {product.id}
          </p>
        </div>

        {/* ===================================================
            ERROR
            =================================================== */}

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
          action={updateProduct}
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
          {/* Product ID used by updateProduct() */}

          <input
            type="hidden"
            name="productId"
            value={product.id}
          />

          {/* =================================================
              BASIC INFORMATION
              ================================================= */}

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
                defaultValue={
                  product.name
                }
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
                defaultValue={
                  product.category
                }
                className={inputClass}
              >
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

            {/* Product Tag */}

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
                  defaultValue={
                    product.tag
                  }
                  className={`${inputClass} pl-11`}
                />
              </div>
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
                defaultValue={
                  product.sortOrder
                }
                className={inputClass}
              />

              <p className="mt-2 text-xs text-slate-400">
                Lower numbers appear first.
              </p>
            </FormField>
          </div>

          {/* =================================================
              DESCRIPTION
              ================================================= */}

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
                defaultValue={
                  product.description
                }
                className={`${inputClass} resize-y`}
              />
            </FormField>
          </div>

          {/* =================================================
              SPECIFICATIONS
              ================================================= */}

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
                  rows={7}
                  defaultValue={
                    specifications
                  }
                  className={`${inputClass} resize-y pl-11`}
                />
              </div>

              <p className="mt-2 text-xs text-slate-400">
                Enter one specification per line.
              </p>
            </FormField>
          </div>

          {/* =================================================
              CURRENT IMAGE
              ================================================= */}

          <div className="mt-8">
            <div
              className="
                rounded-2xl
                border
                border-brand/10
                bg-[#f7f9fc]
                p-5
                md:p-6
              "
            >
              <div className="flex items-start gap-3">
                <div
                  className="
                    grid
                    h-10
                    w-10
                    shrink-0
                    place-items-center
                    rounded-xl
                    bg-brand/[0.08]
                    text-brand
                  "
                >
                  <ImageIcon className="h-5 w-5" />
                </div>

                <div>
                  <h2
                    className="
                      font-display
                      text-base
                      font-bold
                      uppercase
                      text-brand-deep
                    "
                  >
                    Product Image
                  </h2>

                  <p
                    className="
                      mt-1
                      text-xs
                      leading-relaxed
                      text-slate-500
                    "
                  >
                    Keep the existing image, replace it from your
                    computer, or enter a new image URL.
                  </p>
                </div>
              </div>

              {/* =============================================
                  CURRENT IMAGE PREVIEW
                  ============================================= */}

              <div
                className="
                  mt-6
                  rounded-xl
                  border
                  border-brand/10
                  bg-white
                  p-4
                "
              >
                <p
                  className="
                    text-xs
                    font-bold
                    uppercase
                    tracking-wider
                    text-slate-500
                  "
                >
                  Current Image
                </p>

                <div
                  className="
                    mt-3
                    flex
                    flex-col
                    gap-4
                    sm:flex-row
                    sm:items-center
                  "
                >
                  <div
                    className="
                      h-32
                      w-40
                      shrink-0
                      overflow-hidden
                      rounded-xl
                      border
                      border-brand/10
                      bg-[#f7f9fc]
                    "
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={
                        product.image
                      }
                      alt={
                        product.name
                      }
                      className="
                        h-full
                        w-full
                        object-cover
                      "
                    />
                  </div>

                  <div className="min-w-0">
                    <p
                      className="
                        text-sm
                        font-semibold
                        text-brand-deep
                      "
                    >
                      Existing product image
                    </p>

                    <p
                      className="
                        mt-2
                        break-all
                        text-xs
                        leading-relaxed
                        text-slate-400
                      "
                    >
                      {product.image}
                    </p>
                  </div>
                </div>
              </div>

              {/* =============================================
                  REPLACE FROM PC
                  ============================================= */}

              <div className="mt-6">
                <label
                  htmlFor="imageFile"
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
                  Replace From PC
                </label>

                <label
                  htmlFor="imageFile"
                  className="
                    flex
                    cursor-pointer
                    flex-col
                    items-center
                    justify-center
                    rounded-xl
                    border
                    border-dashed
                    border-brand/25
                    bg-white
                    px-5
                    py-8
                    text-center
                    transition-all
                    hover:border-brand/50
                    hover:bg-brand/[0.02]
                  "
                >
                  <div
                    className="
                      grid
                      h-11
                      w-11
                      place-items-center
                      rounded-xl
                      bg-brand/[0.08]
                      text-brand
                    "
                  >
                    <Upload className="h-5 w-5" />
                  </div>

                  <span
                    className="
                      mt-3
                      text-sm
                      font-bold
                      text-brand-deep
                    "
                  >
                    Choose Replacement Image
                  </span>

                  <span
                    className="
                      mt-1
                      text-xs
                      text-slate-400
                    "
                  >
                    JPG, PNG or WebP — maximum 5 MB
                  </span>

                  <input
                    id="imageFile"
                    name="imageFile"
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="
                      mt-4
                      block
                      max-w-full
                      text-xs
                      text-slate-500

                      file:mr-4
                      file:rounded-lg
                      file:border-0
                      file:bg-brand
                      file:px-4
                      file:py-2.5
                      file:text-xs
                      file:font-bold
                      file:text-white

                      hover:file:bg-brand-soft
                    "
                  />
                </label>
              </div>

              {/* =============================================
                  OR
                  ============================================= */}

              <div className="my-6 flex items-center gap-4">
                <div className="h-px flex-1 bg-brand/10" />

                <span
                  className="
                    text-xs
                    font-bold
                    uppercase
                    tracking-[0.2em]
                    text-slate-400
                  "
                >
                  Or
                </span>

                <div className="h-px flex-1 bg-brand/10" />
              </div>

              {/* =============================================
                  NEW IMAGE URL
                  ============================================= */}

              <FormField
                label="Replace With Image URL"
                htmlFor="imageUrl"
              >
                <div className="relative">
                  <LinkIcon
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
                    id="imageUrl"
                    name="imageUrl"
                    type="url"
                    maxLength={1000}
                    placeholder="https://example.com/new-product-image.jpg"
                    className={`${inputClass} bg-white pl-11`}
                  />
                </div>

                <p
                  className="
                    mt-2
                    text-xs
                    leading-relaxed
                    text-slate-400
                  "
                >
                  Leave this empty and do not upload a file if
                  you want to keep the current image.
                </p>

                <p
                  className="
                    mt-1
                    text-xs
                    leading-relaxed
                    text-slate-400
                  "
                >
                  If both a file and URL are supplied, the
                  uploaded file will be used.
                </p>
              </FormField>
            </div>
          </div>

          {/* =================================================
              VISIBILITY
              ================================================= */}

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
                defaultChecked={
                  product.isVisible
                }
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
                  When disabled, the product remains in the
                  admin panel but disappears from the public
                  website.
                </span>
              </span>
            </label>
          </div>

          {/* =================================================
              BUTTONS
              ================================================= */}

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
              <Save className="h-4 w-4" />

              Save Changes
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
  children: ReactNode;
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
   INPUT STYLE
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
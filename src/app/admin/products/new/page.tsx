import type {
  ReactNode,
} from "react";

import Link from "next/link";

import {
  and,
  asc,
  eq,
  or,
} from "drizzle-orm";

import {
  ArrowLeft,
  ImageIcon,
  LinkIcon,
  ListChecks,
  PackagePlus,
  Tag,
  Upload,
} from "lucide-react";

import {
  db,
} from "@/db";

import {
  catalogCategories,
} from "@/db/schema";

import {
  requireAdmin,
} from "@/lib/admin-auth";

import {
  createProduct,
} from "../actions";

type NewProductPageProps = {
  searchParams: Promise<{
    error?: string;
  }>;
};

export default async function NewProductPage({
  searchParams,
}: NewProductPageProps) {
  await requireAdmin();

  const {
    error,
  } =
    await searchParams;

  const categories =
    await db
      .select({
        name:
          catalogCategories.name,

        slug:
          catalogCategories.slug,
      })
      .from(
        catalogCategories
      )
      .where(
        and(
          eq(
            catalogCategories.isVisible,
            true
          ),
          or(
            eq(
              catalogCategories.appliesTo,
              "product"
            ),
            eq(
              catalogCategories.appliesTo,
              "both"
            )
          )
        )
      )
      .orderBy(
        asc(
          catalogCategories.sortOrder
        ),
        asc(
          catalogCategories.name
        )
      );

  return (
    <main
      className="
        min-h-screen
        bg-[#fff8f8]
      "
    >
      <AdminHeader
        subtitle="Add New Product"
        backHref="/admin/products"
        backLabel="Products"
      />

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
            Add a product to the Gamex catalogue.
            Categories are loaded directly from Admin
            Categories.
          </p>
        </div>

        {error ? (
          <ErrorBox
            message={
              error
            }
          />
        ) : null}

        <form
          action={
            createProduct
          }
          className="
            mt-8
            rounded-2xl
            border
            border-brand/10
            bg-white
            p-6
            shadow-[0_25px_65px_-45px_rgba(230,0,0,0.30)]
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
            <FormField
              label="Product Name"
              htmlFor="name"
            >
              <input
                id="name"
                name="name"
                type="text"
                required
                maxLength={
                  255
                }
                placeholder="e.g. ASUS Dual RTX 3060"
                className={
                  inputClass
                }
              />
            </FormField>

            <FormField
              label="Price (PKR)"
              htmlFor="price"
            >
              <input
                id="price"
                name="price"
                type="number"
                min="0"
                step="1"
                placeholder="e.g. 78500"
                className={
                  inputClass
                }
              />

              <HelpText>
                Optional. Leave empty to show Price on
                request.
              </HelpText>
            </FormField>

            <FormField
              label="Category"
              htmlFor="category"
            >
              <select
                id="category"
                name="category"
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

                {categories.map(
                  (
                    category
                  ) => (
                    <option
                      key={
                        category.slug
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

              <div
                className="
                  mt-2
                  flex
                  flex-wrap
                  items-center
                  justify-between
                  gap-2
                "
              >
                <HelpText>
                  Product and Products + Builds categories
                  appear here.
                </HelpText>

                <Link
                  href="/admin/categories"
                  className="
                    text-xs
                    font-bold
                    text-brand
                    hover:underline
                  "
                >
                  Manage Categories
                </Link>
              </div>
            </FormField>

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
                  maxLength={
                    120
                  }
                  placeholder="e.g. NEW"
                  className={`${inputClass} pl-11`}
                />
              </div>

              <HelpText>
                Leave empty and FEATURED will be used.
              </HelpText>
            </FormField>

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
                className={
                  inputClass
                }
              />

              <HelpText>
                Lower numbers appear first.
              </HelpText>
            </FormField>
          </div>

          <div className="mt-6">
            <FormField
              label="Description"
              htmlFor="description"
            >
              <textarea
                id="description"
                name="description"
                required
                rows={
                  5
                }
                placeholder="Describe this product..."
                className={`${inputClass} resize-y`}
              />
            </FormField>
          </div>

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
                  rows={
                    7
                  }
                  placeholder={`12GB GDDR6
192-bit memory interface
PCIe 4.0
3x DisplayPort + HDMI`}
                  className={`${inputClass} resize-y pl-11`}
                />
              </div>

              <HelpText>
                Enter one specification per line.
              </HelpText>
            </FormField>
          </div>

          <ImageInputs />

          <VisibilityBox
            defaultChecked
          />

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
              className={
                secondaryButtonClass
              }
            >
              Cancel
            </Link>

            <button
              type="submit"
              className={
                primaryButtonClass
              }
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

function AdminHeader({
  subtitle,
  backHref,
  backLabel,
}: {
  subtitle: string;
  backHref: string;
  backLabel: string;
}) {
  return (
    <header
      className="
        border-b
        border-brand/10
        bg-white
      "
    >
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
            {
              subtitle
            }
          </p>
        </div>

        <Link
          href={
            backHref
          }
          className={
            headerButtonClass
          }
        >
          <ArrowLeft className="h-4 w-4" />

          {
            backLabel
          }
        </Link>
      </div>
    </header>
  );
}

function ImageInputs() {
  return (
    <div
      className="
        mt-8
        rounded-2xl
        border
        border-brand/10
        bg-[#fff8f8]
        p-5
        md:p-6
      "
    >
      <div
        className="
          flex
          items-start
          gap-3
        "
      >
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

          <p className="mt-1 text-xs leading-relaxed text-slate-500">
            Upload an image from your PC or use an external
            image URL.
          </p>
        </div>
      </div>

      <div className="mt-6">
        <label
          htmlFor="imageFile"
          className={
            fieldLabelClass
          }
        >
          Upload From PC
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
            Choose Product Image
          </span>

          <span className="mt-1 text-xs text-slate-400">
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

      <FormField
        label="Image URL"
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
            maxLength={
              1000
            }
            placeholder="https://example.com/product.jpg"
            className={`${inputClass} bg-white pl-11`}
          />
        </div>

        <HelpText>
          You only need one image method. If both are
          supplied, the uploaded file is used.
        </HelpText>
      </FormField>
    </div>
  );
}

function VisibilityBox({
  defaultChecked,
}: {
  defaultChecked: boolean;
}) {
  return (
    <div
      className="
        mt-7
        rounded-xl
        border
        border-brand/10
        bg-[#fff8f8]
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
            defaultChecked
          }
          className="
            mt-1
            h-4
            w-4
            accent-[#e60000]
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

          <span className="mt-1 block text-xs leading-relaxed text-slate-500">
            Turn this off to save the product without
            showing it publicly.
          </span>
        </span>
      </label>
    </div>
  );
}

function ErrorBox({
  message,
}: {
  message: string;
}) {
  return (
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
      {
        message
      }
    </div>
  );
}

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
        htmlFor={
          htmlFor
        }
        className={
          fieldLabelClass
        }
      >
        {
          label
        }
      </label>

      {
        children
      }
    </div>
  );
}

function HelpText({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <p className="mt-2 text-xs text-slate-400">
      {
        children
      }
    </p>
  );
}

const fieldLabelClass =
  "mb-2 block text-xs font-bold uppercase tracking-wider text-slate-600";

const inputClass =
  "w-full rounded-xl border border-brand/15 bg-[#fff8f8] px-4 py-3.5 text-sm text-brand-deep outline-none transition-all placeholder:text-slate-400 hover:border-brand/25 focus:border-brand/60 focus:bg-white focus:shadow-[0_0_0_3px_rgba(230,0,0,0.10)]";

const headerButtonClass =
  "inline-flex items-center gap-2 rounded-lg border border-brand/15 bg-white px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-brand transition-all hover:border-brand hover:bg-brand hover:text-white";

const secondaryButtonClass =
  "inline-flex items-center justify-center rounded-xl border border-brand/15 bg-white px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-brand transition-all hover:border-brand hover:bg-brand/[0.05]";

const primaryButtonClass =
  "inline-flex items-center justify-center gap-2 rounded-xl bg-brand px-6 py-3.5 font-display text-xs font-bold uppercase tracking-wider text-white transition-all hover:-translate-y-0.5 hover:bg-brand-soft";
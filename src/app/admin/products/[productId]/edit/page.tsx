import type {
  ReactNode,
} from "react";

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

import {
  asc,
  eq,
  or,
} from "drizzle-orm";

import {
  redirect,
} from "next/navigation";

import {
  db,
} from "@/db";

import {
  catalogCategories,
  products,
} from "@/db/schema";

import {
  requireAdmin,
} from "@/lib/admin-auth";

import {
  updateProduct,
} from "../../actions";

type EditProductPageProps = {
  params: Promise<{
    productId: string;
  }>;

  searchParams: Promise<{
    error?: string;
  }>;
};

export default async function EditProductPage({
  params,
  searchParams,
}: EditProductPageProps) {
  await requireAdmin();

  const {
    productId,
  } =
    await params;

  const query =
    await searchParams;

  const error =
    query.error;

  const productRows =
    await db
      .select()
      .from(
        products
      )
      .where(
        eq(
          products.id,
          productId
        )
      )
      .limit(
        1
      );

  const product =
    productRows[0];

  if (
    !product
  ) {
    redirect(
      "/admin/products"
    );
  }

  const categoryRows =
    await db
      .select({
        id:
          catalogCategories.id,

        name:
          catalogCategories.name,

        slug:
          catalogCategories.slug,

        appliesTo:
          catalogCategories.appliesTo,

        isVisible:
          catalogCategories.isVisible,
      })
      .from(
        catalogCategories
      )
      .where(
        or(
          eq(
            catalogCategories.appliesTo,
            "product"
          ),

          eq(
            catalogCategories.appliesTo,
            "both"
          ),

          eq(
            catalogCategories.slug,
            product.category
          )
        )
      )
      .orderBy(
        asc(
          catalogCategories.sortOrder
        ),
        asc(
          catalogCategories.id
        )
      );

  const actualCurrentCategory =
    categoryRows.find(
      (
        category
      ) =>
        category.slug ===
        product.category
    );

  const selectableCategories =
    categoryRows.filter(
      (
        category
      ) =>
        category.slug ===
          product.category ||
        (
          category.isVisible &&
          (
            category.appliesTo ===
              "product" ||
            category.appliesTo ===
              "both"
          )
        )
    );

  const specifications =
    product.specs.join(
      "\n"
    );

  return (
    <main className="min-h-screen bg-[#f7f9fc]">
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
              GameX Admin
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
            "
          >
            <ArrowLeft className="h-4 w-4" />

            Products
          </Link>
        </div>
      </header>

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
            Edit Product
          </h1>

          <p className="mt-3 text-sm text-slate-500">
            The category selected here is the same category used
            on the website and inside Build Your Rig.
          </p>

          <p className="mt-2 text-xs text-slate-400">
            Product ID:{" "}
            {
              product.id
            }
          </p>
        </div>

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
            {
              error
            }
          </div>
        ) : null}

        {!actualCurrentCategory ? (
          <div
            className="
              mt-7
              rounded-xl
              border
              border-amber-200
              bg-amber-50
              px-5
              py-4
              text-sm
              text-amber-800
            "
          >
            This product currently contains the legacy category
            slug{" "}
            <strong>
              {
                product.category
              }
            </strong>
            . Select the correct category below and save.
          </div>
        ) : null}

        <form
          action={
            updateProduct
          }
          className="
            mt-8
            rounded-2xl
            border
            border-brand/10
            bg-white
            p-6
            md:p-8
          "
        >
          <input
            type="hidden"
            name="productId"
            value={
              product.id
            }
          />

          <div className="grid gap-6 md:grid-cols-2">
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
                defaultValue={
                  product.name
                }
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
                defaultValue={
                  product.price ??
                  ""
                }
                className={
                  inputClass
                }
              />
            </FormField>

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
                className={
                  inputClass
                }
              >
                {!actualCurrentCategory ? (
                  <option
                    value={
                      product.category
                    }
                  >
                    Current:{" "}
                    {
                      product.category
                    }{" "}
                    — please change
                  </option>
                ) : null}

                {selectableCategories.map(
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
                      {!category.isVisible
                        ? " (Hidden)"
                        : ""}
                    </option>
                  )
                )}
              </select>

              <p className="mt-2 text-xs text-slate-400">
                Saved slug:{" "}
                <strong>
                  {
                    product.category
                  }
                </strong>
              </p>
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
                  defaultValue={
                    product.tag
                  }
                  className={`${inputClass} pl-11`}
                />
              </div>
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
                defaultValue={
                  product.sortOrder
                }
                className={
                  inputClass
                }
              />
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
                defaultValue={
                  product.description
                }
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
                  defaultValue={
                    specifications
                  }
                  className={`${inputClass} resize-y pl-11`}
                />
              </div>
            </FormField>
          </div>

          <div className="mt-8 rounded-2xl border border-brand/10 bg-[#f7f9fc] p-5">
            <div className="flex items-start gap-3">
              <div
                className="
                  grid
                  h-10
                  w-10
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
              </div>
            </div>

            <div className="mt-5">
              <div
                className="
                  h-36
                  w-44
                  overflow-hidden
                  rounded-xl
                  border
                  border-brand/10
                  bg-white
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
                    object-contain
                    p-2
                  "
                />
              </div>
            </div>

            <div className="mt-6">
              <label
                htmlFor="imageFile"
                className="
                  mb-2
                  block
                  text-xs
                  font-bold
                  uppercase
                  text-slate-600
                "
              >
                Replace Image
              </label>

              <div className="flex items-center gap-3">
                <Upload className="h-4 w-4 text-brand" />

                <input
                  id="imageFile"
                  name="imageFile"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                />
              </div>
            </div>

            <div className="mt-6">
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
                    placeholder="Optional new image URL"
                    className={`${inputClass} bg-white pl-11`}
                  />
                </div>
              </FormField>
            </div>
          </div>

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
                className="mt-1 h-4 w-4 accent-[#173160]"
              />

              <span>
                <span className="block text-sm font-bold text-brand-deep">
                  Visible on website
                </span>

                <span className="mt-1 block text-xs text-slate-500">
                  Hidden products will also disappear from Build
                  Your Rig.
                </span>
              </span>
            </label>
          </div>

          <div
            className="
              mt-8
              flex
              gap-3
              border-t
              border-brand/10
              pt-6
              sm:justify-end
            "
          >
            <Link
              href="/admin/products"
              className="
                rounded-xl
                border
                border-brand/15
                px-6
                py-3.5
                text-xs
                font-bold
                uppercase
                text-brand
              "
            >
              Cancel
            </Link>

            <button
              type="submit"
              className="
                inline-flex
                items-center
                gap-2
                rounded-xl
                bg-brand
                px-6
                py-3.5
                text-xs
                font-bold
                uppercase
                text-white
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
  focus:border-brand/60
  focus:bg-white
`;
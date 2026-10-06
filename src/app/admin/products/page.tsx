import Link from "next/link";

import {
  asc,
} from "drizzle-orm";

import {
  Eye,
  EyeOff,
  Pencil,
  Plus,
} from "lucide-react";

import {
  db,
} from "@/db";

import {
  catalogCategories,
  products,
} from "@/db/schema";

import {
  catalogSubcategories,
  productSubcategoryAssignments,
} from "@/db/catalog-extensions";

import {
  formatPrice,
} from "@/lib/price";

import {
  requireAdmin,
} from "@/lib/admin-auth";

import {
  toggleProductVisibility,
} from "./actions";

import DeleteProductButton from "./DeleteProductButton";

export const dynamic =
  "force-dynamic";

/* =========================================================
   PRODUCTS ADMIN
   ========================================================= */

export default async function ProductsAdminPage() {
  await requireAdmin();

  const [
    productRows,
    categoryRows,
    subcategoryRows,
    assignmentRows,
  ] =
    await Promise.all([
      db
        .select()
        .from(
          products
        )
        .orderBy(
          asc(
            products.sortOrder
          ),
          asc(
            products.name
          )
        ),

      db
        .select({
          id:
            catalogCategories.id,

          slug:
            catalogCategories.slug,

          name:
            catalogCategories.name,
        })
        .from(
          catalogCategories
        ),

      db
        .select({
          id:
            catalogSubcategories.id,

          name:
            catalogSubcategories.name,
        })
        .from(
          catalogSubcategories
        )
        .orderBy(
          asc(
            catalogSubcategories.sortOrder
          ),
          asc(
            catalogSubcategories.name
          )
        ),

      db
        .select({
          productId:
            productSubcategoryAssignments.productId,

          subcategoryId:
            productSubcategoryAssignments.subcategoryId,
        })
        .from(
          productSubcategoryAssignments
        ),
    ]);

  /* =======================================================
     CATEGORY NAME MAP
     ======================================================= */

  const categoryNames =
    new Map<
      string,
      string
    >();

  for (
    const category of
    categoryRows
  ) {
    categoryNames.set(
      category.slug,
      category.name
    );
  }

  /* =======================================================
     SUBCATEGORY NAME MAP
     ======================================================= */

  const subcategoryNames =
    new Map<
      number,
      string
    >();

  for (
    const subcategory of
    subcategoryRows
  ) {
    subcategoryNames.set(
      subcategory.id,
      subcategory.name
    );
  }

  /* =======================================================
     PRODUCT -> SUBCATEGORIES
     ======================================================= */

  const productSubcategories =
    new Map<
      string,
      string[]
    >();

  for (
    const assignment of
    assignmentRows
  ) {
    const name =
      subcategoryNames.get(
        assignment.subcategoryId
      );

    if (
      !name
    ) {
      continue;
    }

    const existing =
      productSubcategories.get(
        assignment.productId
      ) ?? [];

    existing.push(
      name
    );

    productSubcategories.set(
      assignment.productId,
      existing
    );
  }

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
            max-w-7xl
            items-center
            justify-between
            gap-4
            px-5
            py-5
            md:px-8
          "
        >
          <div>
            <h1
              className="
                font-display
                text-xl
                font-extrabold
                uppercase
                tracking-widest
                text-brand-deep
              "
            >
              GameX Admin
            </h1>

            <p className="mt-1 text-xs text-slate-500">
              Product Management
            </p>
          </div>

          <Link
            href="/admin"
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
              hover:border-brand
              hover:bg-brand/[0.03]
            "
          >
            Dashboard
          </Link>
        </div>
      </header>

      {/* =====================================================
          CONTENT
          ===================================================== */}

      <section
        className="
          mx-auto
          max-w-7xl
          px-5
          py-10
          md:px-8
        "
      >
        {/* ===================================================
            PAGE HEADING
            =================================================== */}

        <div
          className="
            flex
            flex-col
            gap-5
            md:flex-row
            md:items-end
            md:justify-between
          "
        >
          <div>
            <p
              className="
                text-xs
                font-bold
                uppercase
                tracking-[0.22em]
                text-brand
              "
            >
              Catalogue
            </p>

            <h2
              className="
                mt-2
                font-display
                text-3xl
                font-extrabold
                uppercase
                text-brand-deep
              "
            >
              Products
            </h2>

            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-500">
              Products use the same categories and subcategories
              throughout the GameX website and Build Your Rig.
            </p>
          </div>

          <Link
            href="/admin/products/new"
            className="
              inline-flex
              items-center
              justify-center
              gap-2
              rounded-xl
              bg-brand
              px-5
              py-3.5
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
            <Plus className="h-4 w-4" />

            Add Product
          </Link>
        </div>

        {/* ===================================================
            TABLE
            =================================================== */}

        <div
          className="
            mt-8
            overflow-hidden
            rounded-2xl
            border
            border-brand/10
            bg-white
          "
        >
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1180px]">
              <thead className="bg-[#fff8f8]">
                <tr
                  className="
                    text-left
                    text-xs
                    font-bold
                    uppercase
                    tracking-wider
                    text-slate-500
                  "
                >
                  <th className="px-5 py-4">
                    Product
                  </th>

                  <th className="px-5 py-4">
                    Category
                  </th>

                  <th className="px-5 py-4">
                    Subcategories
                  </th>

                  <th className="px-5 py-4">
                    Tag
                  </th>

                  <th className="px-5 py-4">
                    Price
                  </th>

                  <th className="px-5 py-4">
                    Order
                  </th>

                  <th className="px-5 py-4">
                    Status
                  </th>

                  <th className="px-5 py-4">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {productRows.length ===
                0 ? (
                  <tr>
                    <td
                      colSpan={
                        8
                      }
                      className="
                        px-5
                        py-16
                        text-center
                        text-sm
                        text-slate-400
                      "
                    >
                      No products have been added yet.
                    </td>
                  </tr>
                ) : (
                  productRows.map(
                    (
                      product
                    ) => {
                      const categoryName =
                        categoryNames.get(
                          product.category
                        ) ??
                        product.category;

                      const assignedSubcategories =
                        productSubcategories.get(
                          product.id
                        ) ??
                        [];

                      return (
                        <tr
                          key={
                            product.id
                          }
                          className="
                            border-t
                            border-brand/10
                            align-middle
                          "
                        >
                          {/* ===============================
                              PRODUCT
                              =============================== */}

                          <td className="px-5 py-5">
                            <div className="flex items-center gap-4">
                              <div
                                className="
                                  h-16
                                  w-16
                                  shrink-0
                                  overflow-hidden
                                  rounded-xl
                                  border
                                  border-brand/10
                                  bg-[#f7f7f7]
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
                                    p-1
                                  "
                                />
                              </div>

                              <div className="min-w-0">
                                <p
                                  className="
                                    font-bold
                                    text-brand-deep
                                  "
                                >
                                  {
                                    product.name
                                  }
                                </p>

                                <p
                                  className="
                                    mt-1
                                    max-w-[220px]
                                    truncate
                                    text-xs
                                    text-slate-400
                                  "
                                >
                                  {
                                    product.id
                                  }
                                </p>
                              </div>
                            </div>
                          </td>

                          {/* ===============================
                              CATEGORY
                              =============================== */}

                          <td className="px-5 py-5">
                            <p className="text-sm font-semibold text-slate-700">
                              {
                                categoryName
                              }
                            </p>

                            <p className="mt-1 text-[10px] text-slate-400">
                              {
                                product.category
                              }
                            </p>
                          </td>

                          {/* ===============================
                              SUBCATEGORIES
                              =============================== */}

                          <td className="px-5 py-5">
                            {assignedSubcategories.length >
                            0 ? (
                              <div className="flex max-w-[230px] flex-wrap gap-1.5">
                                {assignedSubcategories.map(
                                  (
                                    subcategory
                                  ) => (
                                    <span
                                      key={
                                        subcategory
                                      }
                                      className="
                                        rounded-full
                                        border
                                        border-brand/10
                                        bg-brand/[0.04]
                                        px-2.5
                                        py-1
                                        text-[10px]
                                        font-semibold
                                        text-brand-deep
                                      "
                                    >
                                      {
                                        subcategory
                                      }
                                    </span>
                                  )
                                )}
                              </div>
                            ) : (
                              <span className="text-xs text-slate-300">
                                —
                              </span>
                            )}
                          </td>

                          {/* ===============================
                              TAG
                              =============================== */}

                          <td className="px-5 py-5">
                            <span
                              className="
                                inline-flex
                                rounded-full
                                bg-red-50
                                px-3
                                py-1.5
                                text-[10px]
                                font-bold
                                uppercase
                                text-brand
                              "
                            >
                              {
                                product.tag
                              }
                            </span>
                          </td>

                          {/* ===============================
                              PRICE
                              =============================== */}

                          <td className="px-5 py-5">
                            <span className="text-sm font-extrabold text-brand-deep">
                              {formatPrice(
                                product.price
                              )}
                            </span>
                          </td>

                          {/* ===============================
                              ORDER
                              =============================== */}

                          <td className="px-5 py-5 text-sm text-slate-600">
                            {
                              product.sortOrder
                            }
                          </td>

                          {/* ===============================
                              STATUS
                              =============================== */}

                          <td className="px-5 py-5">
                            <span
                              className={`
                                inline-flex
                                items-center
                                gap-2
                                rounded-full
                                px-3
                                py-1.5
                                text-[10px]
                                font-bold

                                ${
                                  product.isVisible
                                    ? "bg-emerald-50 text-emerald-700"
                                    : "bg-slate-100 text-slate-500"
                                }
                              `}
                            >
                              {product.isVisible ? (
                                <Eye className="h-3.5 w-3.5" />
                              ) : (
                                <EyeOff className="h-3.5 w-3.5" />
                              )}

                              {product.isVisible
                                ? "Visible"
                                : "Hidden"}
                            </span>
                          </td>

                          {/* ===============================
                              ACTIONS
                              =============================== */}

                          <td className="px-5 py-5">
                            <div className="flex flex-wrap gap-2">
                              <Link
                                href={`/admin/products/${product.id}/edit`}
                                className="
                                  inline-flex
                                  items-center
                                  gap-2
                                  rounded-lg
                                  border
                                  border-brand/20
                                  bg-white
                                  px-3
                                  py-2
                                  text-xs
                                  font-bold
                                  text-brand
                                  transition-all
                                  hover:border-brand
                                  hover:bg-brand
                                  hover:text-white
                                "
                              >
                                <Pencil className="h-3.5 w-3.5" />

                                Edit
                              </Link>

                              <form
                                action={
                                  toggleProductVisibility
                                }
                              >
                                <input
                                  type="hidden"
                                  name="productId"
                                  value={
                                    product.id
                                  }
                                />

                                <input
                                  type="hidden"
                                  name="nextVisibility"
                                  value={String(
                                    !product.isVisible
                                  )}
                                />

                                <button
                                  type="submit"
                                  className="
                                    inline-flex
                                    items-center
                                    gap-2
                                    rounded-lg
                                    border
                                    border-brand/20
                                    bg-white
                                    px-3
                                    py-2
                                    text-xs
                                    font-bold
                                    text-brand
                                    transition-all
                                    hover:border-brand
                                    hover:bg-brand/[0.04]
                                  "
                                >
                                  {product.isVisible ? (
                                    <EyeOff className="h-3.5 w-3.5" />
                                  ) : (
                                    <Eye className="h-3.5 w-3.5" />
                                  )}

                                  {product.isVisible
                                    ? "Hide"
                                    : "Show"}
                                </button>
                              </form>

                              <DeleteProductButton
                                productId={
                                  product.id
                                }
                                productName={
                                  product.name
                                }
                              />
                            </div>
                          </td>
                        </tr>
                      );
                    }
                  )
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </main>
  );
}
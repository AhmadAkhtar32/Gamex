import Link from "next/link";

import {
  asc,
} from "drizzle-orm";

import {
  ArrowLeft,
  Eye,
  EyeOff,
  PackagePlus,
  Pencil,
  Trash2,
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
  deleteProduct,
  toggleProductVisibility,
} from "./actions";

export default async function ProductsAdminPage() {
  await requireAdmin();

  const [
    productRows,
    categories,
    subcategories,
    assignments,
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
        .select()
        .from(
          catalogCategories
        ),

      db
        .select()
        .from(
          catalogSubcategories
        ),

      db
        .select()
        .from(
          productSubcategoryAssignments
        ),
    ]);

  const categoryBySlug =
    new Map(
      categories.map(
        (
          category
        ) => [
          category.slug,
          category,
        ]
      )
    );

  const subcategoryById =
    new Map(
      subcategories.map(
        (
          subcategory
        ) => [
          subcategory.id,
          subcategory,
        ]
      )
    );

  const assignmentByProductId =
    new Map(
      assignments.map(
        (
          assignment
        ) => [
          assignment.productId,
          assignment.subcategoryId,
        ]
      )
    );

  return (
    <main className="min-h-screen bg-[#f7f9fc]">
      <header className="border-b border-brand/10 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 md:px-8">
          <div>
            <p className="font-display text-lg font-extrabold uppercase tracking-widest text-brand-deep">
              GameX Admin
            </p>

            <p className="mt-0.5 text-xs text-slate-500">
              Product Management
            </p>
          </div>

          <Link
            href="/admin"
            className="inline-flex items-center gap-2 rounded-lg border border-brand/15 bg-white px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-brand"
          >
            <ArrowLeft className="h-4 w-4" />
            Dashboard
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-5 py-10 md:px-8 md:py-14">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-brand">
              Catalogue
            </p>

            <h1 className="mt-2 font-display text-3xl font-extrabold uppercase text-brand-deep md:text-4xl">
              Products
            </h1>

            <p className="mt-3 max-w-2xl text-sm text-slate-500">
              Main category is the same category used by Build
              Your Rig. Optional subcategory is shown below it.
            </p>
          </div>

          <Link
            href="/admin/products/new"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand px-5 py-3 text-xs font-bold uppercase tracking-wider text-white"
          >
            <PackagePlus className="h-4 w-4" />
            Add Product
          </Link>
        </div>

        <div className="mt-8 overflow-x-auto rounded-2xl border border-brand/10 bg-white">
          <table className="w-full min-w-[1050px] border-collapse text-left">
            <thead className="bg-[#fff8f8] text-xs font-bold uppercase text-slate-500">
              <tr>
                <th className="px-5 py-4">
                  Product
                </th>

                <th className="px-5 py-4">
                  Category
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
              {productRows.map(
                (
                  product
                ) => {
                  const category =
                    categoryBySlug.get(
                      product.category
                    );

                  const subcategoryId =
                    assignmentByProductId.get(
                      product.id
                    );

                  const subcategory =
                    subcategoryId
                      ? subcategoryById.get(
                          subcategoryId
                        )
                      : undefined;

                  return (
                    <tr
                      key={
                        product.id
                      }
                      className="border-t border-brand/10 align-middle"
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-4">
                          <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-brand/10 bg-[#f7f9fc]">
                            {/* eslint-disable-next-line @next/next/no-img-element */}

                            <img
                              src={
                                product.image
                              }
                              alt={
                                product.name
                              }
                              className="h-full w-full object-contain p-1"
                            />
                          </div>

                          <div className="min-w-0">
                            <p className="font-bold text-brand-deep">
                              {
                                product.name
                              }
                            </p>

                            <p className="mt-1 text-xs text-slate-400">
                              {
                                product.id
                              }
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <p className="font-semibold text-brand-deep">
                          {
                            category
                              ?.name ??
                            product.category
                          }
                        </p>

                        <p className="mt-1 text-xs text-slate-400">
                          {
                            product.category
                          }
                        </p>

                        {subcategory ? (
                          <p className="mt-2 inline-flex rounded-full bg-brand/[0.06] px-2.5 py-1 text-[10px] font-bold uppercase text-brand">
                            {
                              subcategory.name
                            }
                          </p>
                        ) : null}
                      </td>

                      <td className="px-5 py-4">
                        <span className="rounded-full bg-red-50 px-3 py-1.5 text-[10px] font-bold uppercase text-brand">
                          {
                            product.tag
                          }
                        </span>
                      </td>

                      <td className="px-5 py-4 font-bold text-brand-deep">
                        {formatPrice(
                          product.price
                        )}
                      </td>

                      <td className="px-5 py-4 text-sm text-slate-600">
                        {
                          product.sortOrder
                        }
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[10px] font-bold ${
                            product.isVisible
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-slate-100 text-slate-500"
                          }`}
                        >
                          <Eye className="h-3.5 w-3.5" />

                          {product.isVisible
                            ? "Visible"
                            : "Hidden"}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex flex-wrap gap-2">
                          <Link
                            href={`/admin/products/${product.id}/edit`}
                            className="inline-flex items-center gap-2 rounded-lg border border-brand/20 px-3 py-2 text-xs font-bold text-brand"
                          >
                            <Pencil className="h-4 w-4" />
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

                            <button
                              type="submit"
                              className="inline-flex items-center gap-2 rounded-lg border border-brand/20 px-3 py-2 text-xs font-bold text-brand"
                            >
                              {product.isVisible ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}

                              {product.isVisible
                                ? "Hide"
                                : "Show"}
                            </button>
                          </form>

                          <form
                            action={
                              deleteProduct
                            }
                          >
                            <input
                              type="hidden"
                              name="productId"
                              value={
                                product.id
                              }
                            />

                            <button
                              type="submit"
                              className="inline-flex items-center gap-2 rounded-lg border border-red-200 px-3 py-2 text-xs font-bold text-red-600"
                            >
                              <Trash2 className="h-4 w-4" />
                              Delete
                            </button>
                          </form>
                        </div>
                      </td>
                    </tr>
                  );
                }
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
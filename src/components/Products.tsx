import Link from "next/link";
import {
  ArrowLeft,
  Eye,
  EyeOff,
  PackagePlus,
} from "lucide-react";
import { asc } from "drizzle-orm";

import { db } from "@/db";
import { products } from "@/db/schema";
import { requireAdmin } from "@/lib/admin-auth";

export default async function AdminProductsPage() {
  /*
   * Protect this page.
   *
   * Anyone without a valid admin session
   * will be redirected to /admin/login.
   */
  await requireAdmin();

  /*
   * Read all products from Neon.
   *
   * Products are ordered using sortOrder.
   */
  const productList = await db
    .select()
    .from(products)
    .orderBy(
      asc(products.sortOrder),
      asc(products.name)
    );

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
            max-w-7xl
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
              Product Management
            </p>
          </div>

          <Link
            href="/admin"
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
            Dashboard
          </Link>
        </div>
      </header>

      {/* =====================================================
          PAGE CONTENT
          ===================================================== */}

      <div
        className="
          mx-auto
          max-w-7xl
          px-5
          py-10
          md:px-8
          md:py-14
        "
      >
        {/* Heading */}

        <div
          className="
            flex
            flex-col
            gap-5
            sm:flex-row
            sm:items-end
            sm:justify-between
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
              Products
            </h1>

            <p className="mt-3 text-sm text-slate-500">
              Manage the products displayed on the Gamex website.
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
            Add Product
          </Link>
        </div>

        {/* ===================================================
            EMPTY STATE
            =================================================== */}

        {productList.length === 0 ? (
          <div
            className="
              mt-10
              rounded-2xl
              border
              border-dashed
              border-brand/20
              bg-white
              px-6
              py-16
              text-center
            "
          >
            <div
              className="
                mx-auto
                grid
                h-14
                w-14
                place-items-center
                rounded-2xl
                bg-brand/[0.07]
                text-brand
              "
            >
              <PackagePlus className="h-6 w-6" />
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
              No products yet
            </h2>

            <p
              className="
                mx-auto
                mt-2
                max-w-md
                text-sm
                leading-relaxed
                text-slate-500
              "
            >
              Your Neon products table is currently empty.
              The next step will let you add products from
              this admin panel.
            </p>
          </div>
        ) : (
          /* =================================================
             PRODUCT TABLE
             ================================================= */

          <div
            className="
              mt-10
              overflow-hidden
              rounded-2xl
              border
              border-brand/10
              bg-white
            "
          >
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px]">
                <thead className="bg-[#f7f9fc]">
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
                      Tag
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
                  {productList.map((product) => (
                    <tr
                      key={product.id}
                      className="
                        border-t
                        border-brand/[0.08]
                      "
                    >
                      {/* Product */}

                      <td className="px-5 py-5">
                        <div className="flex items-center gap-4">
                          <div
                            className="
                              h-14
                              w-14
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
                              src={product.image}
                              alt={product.name}
                              className="
                                h-full
                                w-full
                                object-cover
                              "
                            />
                          </div>

                          <div>
                            <p
                              className="
                                font-semibold
                                text-brand-deep
                              "
                            >
                              {product.name}
                            </p>

                            <p
                              className="
                                mt-1
                                text-xs
                                text-slate-400
                              "
                            >
                              {product.id}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Category */}

                      <td
                        className="
                          px-5
                          py-5
                          text-sm
                          text-slate-600
                        "
                      >
                        {product.category}
                      </td>

                      {/* Tag */}

                      <td className="px-5 py-5">
                        <span
                          className="
                            rounded-full
                            bg-brand/[0.07]
                            px-3
                            py-1.5
                            text-xs
                            font-bold
                            uppercase
                            text-brand
                          "
                        >
                          {product.tag}
                        </span>
                      </td>

                      {/* Order */}

                      <td
                        className="
                          px-5
                          py-5
                          text-sm
                          text-slate-600
                        "
                      >
                        {product.sortOrder}
                      </td>

                      {/* Visibility */}

                      <td className="px-5 py-5">
                        {product.isVisible ? (
                          <span
                            className="
                              inline-flex
                              items-center
                              gap-2
                              rounded-full
                              bg-emerald-50
                              px-3
                              py-1.5
                              text-xs
                              font-bold
                              text-emerald-700
                            "
                          >
                            <Eye className="h-3.5 w-3.5" />
                            Visible
                          </span>
                        ) : (
                          <span
                            className="
                              inline-flex
                              items-center
                              gap-2
                              rounded-full
                              bg-slate-100
                              px-3
                              py-1.5
                              text-xs
                              font-bold
                              text-slate-500
                            "
                          >
                            <EyeOff className="h-3.5 w-3.5" />
                            Hidden
                          </span>
                        )}
                      </td>

                      {/* Actions */}

                      <td className="px-5 py-5">
                        <Link
                          href={`/admin/products/${product.id}/edit`}
                          className="
                            text-sm
                            font-bold
                            text-brand
                            transition-colors
                            hover:text-brand-soft
                          "
                        >
                          Edit
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Count */}

        <p className="mt-4 text-xs text-slate-400">
          {productList.length}{" "}
          {productList.length === 1
            ? "product"
            : "products"}{" "}
          in database
        </p>
      </div>
    </main>
  );
}
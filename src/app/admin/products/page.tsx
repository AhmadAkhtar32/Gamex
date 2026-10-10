import Link from "next/link";



import {

  asc,

} from "drizzle-orm";



import {

  Eye,

  EyeOff,

  Pencil,

  Plus,

  Search,

  SlidersHorizontal,

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



type ProductSearchParams = Record<

  string,

  string | string[] | undefined

>;



function readFilter(

  params: ProductSearchParams,

  key: string

): string {

  const value = params[key];

  return (Array.isArray(value) ? value[0] ?? "" : value ?? "").trim();

}



function parsePriceFilter(value: string): number | null {

  if (!value) return null;

  const amount = Number(value);

  return Number.isFinite(amount) && amount >= 0 ? amount : null;

}



function parseDateFilter(value: string): Date | null {

  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;

  const calendarDate = new Date(`${value}T00:00:00.000Z`);

  if (

    !Number.isFinite(calendarDate.getTime()) ||

    calendarDate.toISOString().slice(0, 10) !== value

  ) return null;

  return new Date(`${value}T00:00:00+05:00`);

}



const addedDateFormatter = new Intl.DateTimeFormat("en-PK", {

  day: "2-digit",

  month: "short",

  year: "numeric",

  timeZone: "Asia/Karachi",

});



export default async function ProductsAdminPage({

  searchParams,

}: {

  searchParams: Promise<ProductSearchParams>;

}) {

  await requireAdmin();



  const params = await searchParams;

  const search = readFilter(params, "q");

  const categoryFilter = readFilter(params, "category");

  const subcategoryFilter = readFilter(params, "subcategory");

  const tagFilter = readFilter(params, "tag");

  const rawPriceMode = readFilter(params, "priceMode");

  const priceMode = ["priced", "request"].includes(rawPriceMode)

    ? rawPriceMode

    : "";

  const rawMinPrice = readFilter(params, "minPrice");

  const rawMaxPrice = readFilter(params, "maxPrice");

  const minPrice = parsePriceFilter(rawMinPrice);

  const maxPrice = parsePriceFilter(rawMaxPrice);

  const rawDateFrom = readFilter(params, "dateFrom");

  const rawDateTo = readFilter(params, "dateTo");

  const dateFrom = parseDateFilter(rawDateFrom);

  const dateTo = parseDateFilter(rawDateTo);

  const rawSort = readFilter(params, "sort");

  const sort = ["order", "name", "date", "price"].includes(rawSort)

    ? rawSort

    : "order";

  const direction = readFilter(params, "direction") === "desc"

    ? "desc"

    : "asc";

  const filterErrors: string[] = [];

  if (rawMinPrice && minPrice === null) {

    filterErrors.push("Minimum price must be a valid non-negative number.");

  }

  if (rawMaxPrice && maxPrice === null) {

    filterErrors.push("Maximum price must be a valid non-negative number.");

  }

  if (minPrice !== null && maxPrice !== null && minPrice > maxPrice) {

    filterErrors.push("Minimum price cannot be greater than maximum price.");

  }

  if (rawDateFrom && !dateFrom) {

    filterErrors.push("Enter a valid start date.");

  }

  if (rawDateTo && !dateTo) {

    filterErrors.push("Enter a valid end date.");

  }

  if (dateFrom && dateTo && dateFrom > dateTo) {

    filterErrors.push("Start date cannot be after end date.");

  }

  if (priceMode === "request" && (minPrice !== null || maxPrice !== null)) {

    filterErrors.push("Clear the price range to filter products with Price on request.");

  }



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



          categoryId:

            catalogSubcategories.categoryId,

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



  /* =======================================================

     FILTER OPTIONS AND SORTED RESULTS

     ======================================================= */



  const categoryOptions = Array.from(

    new Set([

      ...categoryRows.map((category) => category.slug),

      ...productRows.map((product) => product.category),

    ])

  ).sort((left, right) =>

    (categoryNames.get(left) ?? left).localeCompare(

      categoryNames.get(right) ?? right,

      "en",

      { sensitivity: "base", numeric: true }

    )

  );

  const tagOptions = Array.from(

    new Set(productRows.map((product) => product.tag).filter(Boolean))

  ).sort((left, right) => left.localeCompare(right, "en", { sensitivity: "base" }));

  const productSubcategoryIds = new Map<string, Set<number>>();

  for (const assignment of assignmentRows) {

    const ids = productSubcategoryIds.get(assignment.productId) ?? new Set<number>();

    ids.add(assignment.subcategoryId);

    productSubcategoryIds.set(assignment.productId, ids);

  }

  const query = search.toLocaleLowerCase("en");

  const selectedSubcategoryId = Number(subcategoryFilter);

  const dateToExclusive = dateTo

    ? dateTo.getTime() + 24 * 60 * 60 * 1000

    : null;

  const filteredProducts = filterErrors.length > 0

    ? []

    : productRows.filter((product) => {

        if (categoryFilter && product.category !== categoryFilter) return false;

        if (

          subcategoryFilter &&

          !productSubcategoryIds.get(product.id)?.has(selectedSubcategoryId)

        ) return false;

        if (tagFilter && product.tag !== tagFilter) return false;

        if (priceMode === "priced" && product.price === null) return false;

        if (priceMode === "request" && product.price !== null) return false;

        if (

          minPrice !== null &&

          (product.price === null || product.price < minPrice)

        ) return false;

        if (

          maxPrice !== null &&

          (product.price === null || product.price > maxPrice)

        ) return false;

        const createdAt = new Date(product.createdAt).getTime();

        if (dateFrom && createdAt < dateFrom.getTime()) return false;

        if (dateToExclusive !== null && createdAt >= dateToExclusive) return false;

        if (query) {

          const searchableText = [

            product.name,

            product.id,

            product.description,

            product.category,

            categoryNames.get(product.category) ?? "",

            product.tag,

            ...product.specs,

            ...(productSubcategories.get(product.id) ?? []),

          ].join(" ").toLocaleLowerCase("en");

          if (!searchableText.includes(query)) return false;

        }

        return true;

      });

  const sortMultiplier = direction === "desc" ? -1 : 1;

  filteredProducts.sort((left, right) => {

    let comparison = 0;

    if (sort === "price") {

      // Products without a price remain last in either direction.

      if (left.price === null && right.price !== null) return 1;

      if (left.price !== null && right.price === null) return -1;

      comparison = (left.price ?? 0) - (right.price ?? 0);

    } else if (sort === "date") {

      comparison = new Date(left.createdAt).getTime() - new Date(right.createdAt).getTime();

    } else if (sort === "name") {

      comparison = left.name.localeCompare(right.name, "en", {

        sensitivity: "base",

        numeric: true,

      });

    } else {

      comparison = left.sortOrder - right.sortOrder;

    }

    return comparison * sortMultiplier ||

      left.name.localeCompare(right.name, "en", { sensitivity: "base", numeric: true }) ||

      left.id.localeCompare(right.id);

  });

  const filterInputClass =

    "min-h-11 w-full min-w-0 rounded-xl border border-slate-200 bg-white px-3 py-2.5 font-sans text-sm text-slate-700 outline-none transition-colors focus:border-brand focus:ring-2 focus:ring-brand/10";

  const filterLabelClass =

    "mb-2 block font-sans text-xs font-semibold text-slate-600";



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

            SEARCH, FILTERS AND SORTING

            =================================================== */}



        <form

          key={JSON.stringify(params)}

          action="/admin/products"

          method="get"

          className="mt-8 rounded-2xl border border-brand/10 bg-white p-5 sm:p-6"

        >

          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">

            <div className="flex items-center gap-2">

              <SlidersHorizontal aria-hidden="true" className="h-4 w-4 text-brand" />

              <h3 className="font-sans text-sm font-bold text-slate-900">

                Search and filter products

              </h3>

            </div>

            <Link

              href="/admin/products"

              className="font-sans text-xs font-semibold text-brand hover:underline"

            >

              Clear filters

            </Link>

          </div>

          <label htmlFor="product-search" className={filterLabelClass}>

            Search products

          </label>

          <div className="relative">

            <Search aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

            <input

              id="product-search"

              name="q"

              type="search"

              defaultValue={search}

              placeholder="Search by product name, ID, tag, category or specifications..."

              className={`${filterInputClass} pl-10`}

            />

          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

            <div className="min-w-0">

              <label htmlFor="product-category" className={filterLabelClass}>Category</label>

              <select id="product-category" name="category" defaultValue={categoryFilter} className={filterInputClass}>

                <option value="">All categories</option>

                {categoryOptions.map((slug) => (

                  <option key={slug} value={slug}>{categoryNames.get(slug) ?? slug}</option>

                ))}

              </select>

            </div>

            <div className="min-w-0">

              <label htmlFor="product-subcategory" className={filterLabelClass}>Subcategory</label>

              <select id="product-subcategory" name="subcategory" defaultValue={subcategoryFilter} className={filterInputClass}>

                <option value="">All subcategories</option>

                {subcategoryRows.map((subcategory) => (

                  <option key={subcategory.id} value={subcategory.id}>

                    {categoryRows.find((category) => category.id === subcategory.categoryId)?.name ?? "Category"} / {subcategory.name}

                  </option>

                ))}

              </select>

            </div>

            <div className="min-w-0">

              <label htmlFor="product-tag" className={filterLabelClass}>Tag</label>

              <select id="product-tag" name="tag" defaultValue={tagFilter} className={filterInputClass}>

                <option value="">All tags</option>

                {tagOptions.map((tag) => (

                  <option key={tag} value={tag}>{tag}</option>

                ))}

              </select>

            </div>

            <div className="min-w-0">

              <label htmlFor="product-price-mode" className={filterLabelClass}>Price availability</label>

              <select id="product-price-mode" name="priceMode" defaultValue={priceMode} className={filterInputClass}>

                <option value="">All products</option>

                <option value="priced">With a price</option>

                <option value="request">Price on request</option>

              </select>

            </div>

            <div className="min-w-0">

              <label htmlFor="product-min-price" className={filterLabelClass}>Minimum price (Rs.)</label>

              <input id="product-min-price" name="minPrice" type="number" min="0" step="any" defaultValue={rawMinPrice} placeholder="No minimum" className={filterInputClass} />

            </div>

            <div className="min-w-0">

              <label htmlFor="product-max-price" className={filterLabelClass}>Maximum price (Rs.)</label>

              <input id="product-max-price" name="maxPrice" type="number" min="0" step="any" defaultValue={rawMaxPrice} placeholder="No maximum" className={filterInputClass} />

            </div>

            <div className="min-w-0">

              <label htmlFor="product-date-from" className={filterLabelClass}>Date added — from</label>

              <input id="product-date-from" name="dateFrom" type="date" defaultValue={rawDateFrom} className={filterInputClass} />

            </div>

            <div className="min-w-0">

              <label htmlFor="product-date-to" className={filterLabelClass}>Date added — to</label>

              <input id="product-date-to" name="dateTo" type="date" defaultValue={rawDateTo} className={filterInputClass} />

            </div>

            <div className="min-w-0">

              <label htmlFor="product-sort" className={filterLabelClass}>Sort by</label>

              <select id="product-sort" name="sort" defaultValue={sort} className={filterInputClass}>

                <option value="order">Display order</option>

                <option value="name">Product name</option>

                <option value="date">Date added</option>

                <option value="price">Price</option>

              </select>

            </div>

            <div className="min-w-0">

              <label htmlFor="product-direction" className={filterLabelClass}>Sort direction</label>

              <select id="product-direction" name="direction" defaultValue={direction} className={filterInputClass}>

                <option value="asc">Ascending — A–Z / oldest / lowest</option>

                <option value="desc">Descending — Z–A / newest / highest</option>

              </select>

            </div>

          </div>

          {filterErrors.length > 0 && (

            <ul role="alert" className="mt-4 space-y-1 rounded-xl border border-red-100 bg-red-50 p-3 font-sans text-sm text-red-700">

              {filterErrors.map((error) => <li key={error}>{error}</li>)}

            </ul>

          )}

          <div className="mt-5 flex flex-col gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:items-center sm:justify-between">

            <p aria-live="polite" className="font-sans text-sm text-slate-500">

              Showing <strong className="text-slate-900">{filteredProducts.length}</strong> of {productRows.length} products

            </p>

            <button type="submit" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-brand px-5 py-3 font-sans text-sm font-semibold text-white hover:bg-brand-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand">

              <Search aria-hidden="true" className="h-4 w-4 shrink-0" />

              Apply filters

            </button>

          </div>

        </form>



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

            <table className="w-full min-w-[1280px]">

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

                    Date added

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

                {filteredProducts.length ===

                0 ? (

                  <tr>

                    <td

                      colSpan={

                        9

                      }

                      className="

                        px-5

                        py-16

                        text-center

                        text-sm

                        text-slate-400

                      "

                    >

                      {productRows.length === 0

                        ? "No products have been added yet."

                        : filterErrors.length > 0

                          ? "Correct the filter values above to see matching products."

                          : "No products match your search and filters."}

                    </td>

                  </tr>

                ) : (

                  filteredProducts.map(

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

                              DATE ADDED

                              =============================== */}



                          <td className="whitespace-nowrap px-5 py-5 text-xs text-slate-500">

                            {addedDateFormatter.format(new Date(product.createdAt))}

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
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

  ChevronDown,

  ArrowUpDown,

  ArrowUp,

  ArrowDown,

  X,

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



type ProductSearchParams = Record<string, string | string[] | undefined>;



function readFilter(params: ProductSearchParams, key: string): string {

  const value = params[key];

  return (Array.isArray(value) ? value[0] ?? "" : value ?? "").trim();

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

  const rawSort = readFilter(params, "sort");

  const sort = ["order", "name", "date", "price"].includes(rawSort)

    ? rawSort

    : "order";

  const direction = readFilter(params, "direction") === "desc" ? "desc" : "asc";

  const activeFilters = Boolean(search || categoryFilter || subcategoryFilter || tagFilter);

  const currentFilters: Record<string, string> = {

    q: search,

    category: categoryFilter,

    subcategory: subcategoryFilter,

    tag: tagFilter,

    sort,

    direction,

  };



  function sortUrl(field: string): string {

    const nextDirection = sort === field

      ? direction === "asc" ? "desc" : "asc"

      : field === "date" ? "desc" : "asc";

    const query = new URLSearchParams();

    for (const [key, value] of Object.entries(currentFilters)) {

      if (value && key !== "sort" && key !== "direction") query.set(key, value);

    }

    query.set("sort", field);

    query.set("direction", nextDirection);

    return `/admin/products?${query.toString()}`;

  }



  const clearQuery = new URLSearchParams({ sort, direction });

  const clearUrl = `/admin/products?${clearQuery.toString()}`;



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

     SEARCH, HEADER FILTERS AND SORTING

     ======================================================= */



  const categoryOptions = Array.from(

    new Set([

      ...categoryRows.map((category) => category.slug),

      ...productRows.map((product) => product.category),

    ])

  ).map((slug) => ({ value: slug, label: categoryNames.get(slug) ?? slug }))

    .sort((left, right) => left.label.localeCompare(right.label, "en", { sensitivity: "base", numeric: true }));



  const selectedCategoryId = categoryRows.find((category) => category.slug === categoryFilter)?.id;



  const subcategoryOptions = subcategoryRows

    .filter((subcategory) => !categoryFilter || subcategory.categoryId === selectedCategoryId)

    .map((subcategory) => ({

      value: String(subcategory.id),

      label: categoryFilter

        ? subcategory.name

        : `${categoryRows.find((category) => category.id === subcategory.categoryId)?.name ?? "Category"} / ${subcategory.name}`,

    }));



  const tagOptions = Array.from(new Set(productRows.map((product) => product.tag).filter(Boolean)))

    .sort((left, right) => left.localeCompare(right, "en", { sensitivity: "base" }))

    .map((tag) => ({ value: tag, label: tag }));



  const productSubcategoryIds = new Map<string, Set<number>>();

  for (const assignment of assignmentRows) {

    const ids = productSubcategoryIds.get(assignment.productId) ?? new Set<number>();

    ids.add(assignment.subcategoryId);

    productSubcategoryIds.set(assignment.productId, ids);

  }



  const query = search.toLocaleLowerCase("en");



  const filteredProducts = productRows.filter((product) => {

    if (categoryFilter && product.category !== categoryFilter) return false;

    if (subcategoryFilter && !productSubcategoryIds.get(product.id)?.has(Number(subcategoryFilter))) return false;

    if (tagFilter && product.tag !== tagFilter) return false;

    if (!query) return true;

    return [

      product.name,

      product.id,

      product.description,

      product.category,

      categoryNames.get(product.category) ?? "",

      product.tag,

      ...product.specs,

      ...(productSubcategories.get(product.id) ?? []),

    ].join(" ").toLocaleLowerCase("en").includes(query);

  });



  const multiplier = direction === "desc" ? -1 : 1;



  filteredProducts.sort((left, right) => {

    let comparison = 0;

    if (sort === "price") {

      // Keep products without a price last in both directions.

      if (left.price === null && right.price !== null) return 1;

      if (left.price !== null && right.price === null) return -1;

      comparison = (left.price ?? 0) - (right.price ?? 0);

    } else if (sort === "date") {

      comparison = new Date(left.createdAt).getTime() - new Date(right.createdAt).getTime();

    } else if (sort === "name") {

      comparison = left.name.localeCompare(right.name, "en", { sensitivity: "base", numeric: true });

    } else {

      comparison = left.sortOrder - right.sortOrder;

    }

    return comparison * multiplier ||

      left.name.localeCompare(right.name, "en", { sensitivity: "base", numeric: true }) ||

      left.id.localeCompare(right.id);

  });



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

            COMPACT SEARCH

            =================================================== */}



        <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

          <form

            key={JSON.stringify(currentFilters)}

            action="/admin/products"

            method="get"

            className="flex w-full min-w-0 gap-2 sm:max-w-xl"

          >

            {Object.entries(currentFilters).filter(([key, value]) => key !== "q" && value).map(([key, value]) => (

              <input key={key} type="hidden" name={key} value={value} />

            ))}

            <div className="relative min-w-0 flex-1">

              <label htmlFor="product-search" className="sr-only">Search products</label>

              <Search aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

              <input

                id="product-search"

                name="q"

                type="search"

                defaultValue={search}

                placeholder="Search products..."

                className="min-h-11 w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-3 font-sans text-sm text-slate-700 outline-none focus:border-brand focus:ring-2 focus:ring-brand/10"

              />

            </div>

            <button type="submit" className="min-h-11 shrink-0 rounded-xl bg-brand px-4 font-sans text-sm font-semibold text-white hover:bg-brand-soft">

              Search

            </button>

          </form>

          <div className="flex flex-wrap items-center gap-3 font-sans text-xs text-slate-500">

            <span>{filteredProducts.length} of {productRows.length} products</span>

            {activeFilters && (

              <Link href={clearUrl} className="inline-flex items-center gap-1 font-semibold text-brand hover:underline">

                <X aria-hidden="true" className="h-3.5 w-3.5" />

                Clear filters

              </Link>

            )}

          </div>

        </div>



        {/* ===================================================

            TABLE

            =================================================== */}



        <div

          className="

            mt-4

            overflow-hidden

            rounded-2xl

            border

            border-brand/10

            bg-white

          "

        >

          <div className="overflow-x-auto">

            <table className="w-full min-w-[1080px]">

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

                  <th scope="col" aria-sort={sort === "name" ? direction === "asc" ? "ascending" : "descending" : "none"} className="px-4 py-4">

                    <SortHeading label="Product" href={sortUrl("name")} active={sort === "name"} direction={direction} />

                  </th>



                  <th scope="col" className="px-4 py-4">

                    <FilterHeading title="Category" field="category" value={categoryFilter} options={categoryOptions} filters={currentFilters} />

                  </th>



                  <th scope="col" className="px-4 py-4">

                    <FilterHeading title="Subcategories" field="subcategory" value={subcategoryFilter} options={subcategoryOptions} filters={currentFilters} />

                  </th>



                  <th scope="col" className="px-4 py-4">

                    <FilterHeading title="Tag" field="tag" value={tagFilter} options={tagOptions} filters={currentFilters} />

                  </th>



                  <th scope="col" aria-sort={sort === "price" ? direction === "asc" ? "ascending" : "descending" : "none"} className="px-4 py-4">

                    <SortHeading label="Price" href={sortUrl("price")} active={sort === "price"} direction={direction} />

                  </th>



                  <th scope="col" aria-sort={sort === "date" ? direction === "asc" ? "ascending" : "descending" : "none"} className="px-4 py-4">

                    <SortHeading label="Date added" href={sortUrl("date")} active={sort === "date"} direction={direction} />

                  </th>



                  <th scope="col" aria-sort={sort === "order" ? direction === "asc" ? "ascending" : "descending" : "none"} className="px-4 py-4">

                    <SortHeading label="Order" href={sortUrl("order")} active={sort === "order"} direction={direction} />

                  </th>



                  <th scope="col" className="px-4 py-4">Status</th>



                  <th scope="col" className="px-4 py-4">Actions</th>

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



                          <td className="px-4 py-5">

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



                          <td className="px-4 py-5">

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



                          <td className="px-4 py-5">

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



                          <td className="px-4 py-5">

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



                          <td className="px-4 py-5">

                            <span className="whitespace-nowrap text-sm font-extrabold text-brand-deep">

                              {formatPrice(

                                product.price

                              )}

                            </span>

                          </td>



                          {/* ===============================

                              DATE ADDED

                              =============================== */}



                          <td className="whitespace-nowrap px-4 py-5 text-xs text-slate-500">

                            {addedDateFormatter.format(new Date(product.createdAt))}

                          </td>



                          {/* ===============================

                              ORDER

                              =============================== */}



                          <td className="px-4 py-5 text-sm text-slate-600">

                            {

                              product.sortOrder

                            }

                          </td>



                          {/* ===============================

                              STATUS

                              =============================== */}



                          <td className="px-4 py-5">

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



                          <td className="px-4 py-5">

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



/* =========================================================

   TABLE HEADER CONTROLS

   ========================================================= */



function SortHeading({

  label,

  href,

  active,

  direction,

}: {

  label: string;

  href: string;

  active: boolean;

  direction: string;

}) {

  return (

    <Link

      href={href}

      scroll={false}

      title={`Sort by ${label.toLowerCase()} ${active ? direction === "asc" ? "descending" : "ascending" : label === "Date added" ? "descending" : "ascending"}`}

      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-md py-1 font-sans text-[11px] font-semibold uppercase tracking-wide hover:text-brand focus-visible:outline-2 focus-visible:outline-brand ${active ? "text-brand" : "text-slate-500"}`}

    >

      {label}

      {active ? (

        direction === "asc"

          ? <ArrowUp aria-hidden="true" className="h-3.5 w-3.5 shrink-0" />

          : <ArrowDown aria-hidden="true" className="h-3.5 w-3.5 shrink-0" />

      ) : (

        <ArrowUpDown aria-hidden="true" className="h-3.5 w-3.5 shrink-0 opacity-60" />

      )}

    </Link>

  );

}



function FilterHeading({

  title,

  field,

  value,

  options,

  filters,

}: {

  title: string;

  field: string;

  value: string;

  options: { value: string; label: string }[];

  filters: Record<string, string>;

}) {

  const popoverId = `product-filter-${field}`;

  return (

    <>

      <button

        type="button"

        popoverTarget={popoverId}

        aria-label={`Filter ${title.toLowerCase()}`}

        className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-md py-1 font-sans text-[11px] font-semibold uppercase tracking-wide hover:text-brand focus-visible:outline-2 focus-visible:outline-brand ${value ? "text-brand" : "text-slate-500"}`}

      >

        {title}

        <ChevronDown aria-hidden="true" className="h-3.5 w-3.5 shrink-0" />

        {value && <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-brand" />}

      </button>

      <div

        id={popoverId}

        popover="auto"

        className="fixed inset-0 m-auto h-fit w-[min(360px,calc(100vw-2rem))] rounded-2xl border border-brand/15 bg-white p-5 font-sans text-left normal-case tracking-normal text-slate-700 shadow-2xl backdrop:bg-black/10"

      >

        <div className="mb-4 flex items-center justify-between gap-3">

          <p className="text-sm font-bold text-slate-900">Filter by {title.toLowerCase()}</p>

          <button type="button" popoverTarget={popoverId} popoverTargetAction="hide" aria-label={`Close ${title.toLowerCase()} filter`} className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-slate-50 text-slate-500 hover:bg-slate-100">

            <X aria-hidden="true" className="h-4 w-4" />

          </button>

        </div>

        <form key={`${field}:${value}`} action="/admin/products" method="get">

          {Object.entries(filters)

            .filter(([key, entry]) => entry && key !== field && !(field === "category" && key === "subcategory"))

            .map(([key, entry]) => <input key={key} type="hidden" name={key} value={entry} />)}

          <label htmlFor={`${popoverId}-select`} className="sr-only">{title}</label>

          <select id={`${popoverId}-select`} name={field} defaultValue={value} className="min-h-11 w-full min-w-0 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-normal outline-none focus:border-brand focus:ring-2 focus:ring-brand/10">

            <option value="">All {title.toLowerCase()}</option>

            {options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}

          </select>

          <button type="submit" className="mt-4 min-h-11 w-full rounded-xl bg-brand px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-soft">

            Apply

          </button>

        </form>

      </div>

    </>

  );

}
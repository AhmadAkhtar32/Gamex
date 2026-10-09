import type {

  ReactNode,

} from "react";



import Link from "next/link";



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

  and,

  asc,

  eq,

  or,

} from "drizzle-orm";



import {

  db,

} from "@/db";



import {

  catalogCategories,

} from "@/db/schema";



import {

  catalogSubcategories,

} from "@/db/catalog-extensions";



import {

  requireAdmin,

} from "@/lib/admin-auth";



import {

  AdditionalImagesEditor,

} from "@/components/admin/AdditionalImagesEditor";



import {

  createProduct,

} from "../actions";



/* =========================================================

   TYPES

   ========================================================= */



type NewProductPageProps = {

  searchParams: Promise<{

    error?: string;

  }>;

};



/* =========================================================

   PAGE

   ========================================================= */



export default async function NewProductPage({

  searchParams,

}: NewProductPageProps) {

  await requireAdmin();



  const {

    error,

  } =

    await searchParams;



  /* =======================================================

     PRODUCT CATEGORIES

     ======================================================= */



  const productCategories =

    await db

      .select({

        id:

          catalogCategories.id,



        name:

          catalogCategories.name,



        slug:

          catalogCategories.slug,



        sortOrder:

          catalogCategories.sortOrder,

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



  /* =======================================================

     SUBCATEGORIES

     ======================================================= */



  const subcategoryRows =

    await db

      .select({

        id:

          catalogSubcategories.id,



        categoryId:

          catalogSubcategories.categoryId,



        name:

          catalogSubcategories.name,



        slug:

          catalogSubcategories.slug,



        sortOrder:

          catalogSubcategories.sortOrder,



        isVisible:

          catalogSubcategories.isVisible,

      })

      .from(

        catalogSubcategories

      )

      .where(

        eq(

          catalogSubcategories.isVisible,

          true

        )

      )

      .orderBy(

        asc(

          catalogSubcategories.sortOrder

        ),

        asc(

          catalogSubcategories.name

        )

      );



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

              GameX Admin

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

            Add a new GameX product and assign its main category

            and optional subcategories.

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

            {

              error

            }

          </div>

        ) : null}



        {/* ===================================================

            CATEGORY WARNING

            =================================================== */}



        {productCategories.length ===

        0 ? (

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

            No product categories are currently available.



            {" "}



            <Link

              href="/admin/categories"

              className="font-bold underline"

            >

              Create a category first.

            </Link>

          </div>

        ) : null}



        {/* ===================================================

            FORM

            =================================================== */}



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

            shadow-[0_25px_65px_-45px_rgba(23,49,96,0.35)]

            md:p-8

          "

        >

          {/* =================================================

              BASIC

              ================================================= */}



          <div className="grid gap-6 md:grid-cols-2">

            {/* PRODUCT NAME */}



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

                placeholder="e.g. Ryzen 5 5600"

                className={

                  inputClass

                }

              />

            </FormField>



            {/* PRICE */}



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

                placeholder="e.g. 34000"

                className={

                  inputClass

                }

              />



              <p className="mt-2 text-xs text-slate-400">

                Leave empty to show Price on request.

              </p>

            </FormField>



            {/* =================================================

                MAIN CATEGORY

                ================================================= */}



            <FormField

              label="Main Category"

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



                {productCategories.map(

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



              <p className="mt-2 text-xs leading-relaxed text-slate-400">

                This exact category is also used by Build Your Rig.

              </p>

            </FormField>



            {/* PRODUCT TAG */}



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

                  placeholder="e.g. USED"

                  className={`${inputClass} pl-11`}

                />

              </div>



              <p className="mt-2 text-xs text-slate-400">

                If empty, FEATURED will be used.

              </p>

            </FormField>



            {/* DISPLAY ORDER */}



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

                  0

                }

                className={

                  inputClass

                }

              />



              <p className="mt-2 text-xs text-slate-400">

                Lower numbers appear first.

              </p>

            </FormField>

          </div>



          {/* =================================================

              SUBCATEGORIES

              ================================================= */}



          <div className="mt-7">

            <div

              className="

                rounded-2xl

                border

                border-brand/10

                bg-[#fffafa]

                p-5

                md:p-6

              "

            >

              <div>

                <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand">

                  Subcategories

                </p>



                <h2 className="mt-1 font-display text-lg font-extrabold uppercase text-brand-deep">

                  Optional Product Subcategories

                </h2>



                <p className="mt-2 text-xs leading-relaxed text-slate-500">

                  Select any relevant subcategories. For example,

                  Accessories can contain Cooling Fans, Fan

                  Controllers, RGB Accessories, Cables, and more.

                </p>

              </div>



              {subcategoryRows.length >

              0 ? (

                <div className="mt-5 space-y-5">

                  {productCategories.map(

                    (

                      category

                    ) => {

                      const matching =

                        subcategoryRows.filter(

                          (

                            subcategory

                          ) =>

                            subcategory.categoryId ===

                            category.id

                        );



                      if (

                        matching.length ===

                        0

                      ) {

                        return null;

                      }



                      return (

                        <div

                          key={

                            category.id

                          }

                        >

                          <p

                            className="

                              mb-2

                              text-[10px]

                              font-extrabold

                              uppercase

                              tracking-wider

                              text-slate-400

                            "

                          >

                            {

                              category.name

                            }

                          </p>



                          <div

                            className="

                              grid

                              gap-2

                              sm:grid-cols-2

                              lg:grid-cols-3

                            "

                          >

                            {matching.map(

                              (

                                subcategory

                              ) => (

                                <label

                                  key={

                                    subcategory.id

                                  }

                                  className="

                                    flex

                                    cursor-pointer

                                    items-start

                                    gap-3

                                    rounded-xl

                                    border

                                    border-brand/10

                                    bg-white

                                    px-4

                                    py-3

                                    transition-all

                                    hover:border-brand/30

                                  "

                                >

                                  <input

                                    type="checkbox"

                                    name="subcategoryIds"

                                    value={

                                      subcategory.id

                                    }

                                    className="

                                      mt-0.5

                                      h-4

                                      w-4

                                      accent-[#e60000]

                                    "

                                  />



                                  <span>

                                    <span className="block text-sm font-bold text-brand-deep">

                                      {

                                        subcategory.name

                                      }

                                    </span>



                                    <span className="mt-0.5 block text-[10px] text-slate-400">

                                      {

                                        subcategory.slug

                                      }

                                    </span>

                                  </span>

                                </label>

                              )

                            )}

                          </div>

                        </div>

                      );

                    }

                  )}

                </div>

              ) : (

                <div

                  className="

                    mt-5

                    rounded-xl

                    border

                    border-dashed

                    border-brand/15

                    bg-white

                    px-5

                    py-6

                    text-center

                  "

                >

                  <p className="text-sm text-slate-400">

                    No subcategories have been created yet.

                  </p>



                  <Link

                    href="/admin/categories"

                    className="mt-2 inline-block text-xs font-bold text-brand underline"

                  >

                    Manage Categories

                  </Link>

                </div>

              )}

            </div>

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

                rows={

                  5

                }

                placeholder="Describe the product..."

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

                  rows={

                    7

                  }

                  placeholder={`Socket: AM4

Cores: 6

Threads: 12

Base Clock: 3.5 GHz

Boost Clock: 4.4 GHz`}

                  className={`${inputClass} resize-y pl-11`}

                />

              </div>



              <p className="mt-2 text-xs text-slate-400">

                Enter one specification per line.

              </p>

            </FormField>

          </div>



          {/* =================================================

              PRODUCT IMAGE

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



                  <p className="mt-1 text-xs leading-relaxed text-slate-500">

                    Upload an image from your PC or enter an

                    external image URL.

                  </p>

                </div>

              </div>



              {/* FILE */}



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



                  <span className="mt-3 text-sm font-bold text-brand-deep">

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

                      w-full

                      min-w-0

                      max-w-full

                      min-h-12

                      self-stretch

                      rounded-lg

                      leading-6

                      text-xs

                      text-slate-500

                      file:mr-4

                      file:rounded-lg

                      file:border-0

                      file:bg-brand

                      file:px-4

                      file:py-3

                      file:leading-5

                      file:text-xs

                      file:font-bold

                      file:text-white

                      hover:file:bg-brand-soft

                    "

                  />

                </label>

              </div>



              {/* OR */}



              <div className="my-6 flex items-center gap-4">

                <div className="h-px flex-1 bg-brand/10" />



                <span className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">

                  Or

                </span>



                <div className="h-px flex-1 bg-brand/10" />

              </div>



              {/* URL */}



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



                <p className="mt-2 text-xs leading-relaxed text-slate-400">

                  If both methods are provided, the uploaded file

                  will be used.

                </p>

              </FormField>

            </div>

          </div>



          {/* =================================================

              ADDITIONAL PRODUCT IMAGES

              ================================================= */}



          <div className="w-full min-w-0">

            <AdditionalImagesEditor />

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

              className="flex cursor-pointer items-start gap-3"

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

                <span className="block text-sm font-bold text-brand-deep">

                  Visible on website

                </span>



                <span className="mt-1 block text-xs leading-relaxed text-slate-500">

                  Hidden products will also be excluded from Build

                  Your Rig.

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

                min-h-12

                w-full

                whitespace-normal

                text-center

                sm:w-auto

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

              "

            >

              Cancel

            </Link>



            <button

              type="submit"

              disabled={

                productCategories.length ===

                0

              }

              className="

                inline-flex

                min-h-12

                w-full

                whitespace-normal

                text-center

                sm:w-auto

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

                disabled:cursor-not-allowed

                disabled:bg-slate-300

              "

            >

              <PackagePlus className="h-4 w-4 shrink-0" />



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
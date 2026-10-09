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

  redirect,

} from "next/navigation";



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

  ProductCategoryFields,

} from "@/components/admin/ProductCategoryFields";



import {

  AdditionalImagesEditor,

} from "@/components/admin/AdditionalImagesEditor";



import {

  requireAdmin,

} from "@/lib/admin-auth";



import {

  updateProduct,

} from "../../actions";



const inputClass = `

  w-full

  min-w-0

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



  const {

    error,

  } =

    await searchParams;



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



  const [

    categoryRows,

    subcategoryRows,

    assignmentRows,

  ] =

    await Promise.all([

      db

        .select({

          id:

            catalogCategories.id,



          name:

            catalogCategories.name,



          slug:

            catalogCategories.slug,



          isVisible:

            catalogCategories.isVisible,



          appliesTo:

            catalogCategories.appliesTo,

        })

        .from(

          catalogCategories

        )

        .where(

          or(

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

        ),



      db

        .select({

          id:

            catalogSubcategories.id,



          categoryId:

            catalogSubcategories.categoryId,



          name:

            catalogSubcategories.name,



          slug:

            catalogSubcategories.slug,



          isVisible:

            catalogSubcategories.isVisible,

        })

        .from(

          catalogSubcategories

        )

        .orderBy(

          asc(

            catalogSubcategories.sortOrder

          ),



          asc(

            catalogSubcategories.id

          )

        ),



      db

        .select()

        .from(

          productSubcategoryAssignments

        )

        .where(

          eq(

            productSubcategoryAssignments.productId,

            productId

          )

        )

        .limit(

          1

        ),

    ]);



  const currentSubcategoryId =

    assignmentRows[0]

      ?.subcategoryId ??

    null;



  const subcategories =

    subcategoryRows.filter(

      (

        subcategory

      ) =>

        subcategory.isVisible ||

        subcategory.id ===

          currentSubcategoryId

    );



  const additionalImages =

    Array.from(

      new Set(

        (

          product.images ??

          []

        ).filter(

          (url) =>

            Boolean(url) &&

            url !==

              product.image

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

        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-5 py-4 md:px-8">

          <div>

            <p className="font-display text-lg font-extrabold uppercase tracking-widest text-brand-deep">

              GameX Admin

            </p>



            <p className="mt-0.5 text-xs text-slate-500">

              Edit Product

            </p>

          </div>



          <Link

            href="/admin/products"

            className="inline-flex items-center gap-2 rounded-lg border border-brand/15 bg-white px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-brand"

          >

            <ArrowLeft className="h-4 w-4" />

            Products

          </Link>

        </div>

      </header>



      <div className="mx-auto max-w-5xl px-5 py-10 md:px-8 md:py-14">

        <div>

          <p className="text-xs font-bold uppercase tracking-[0.24em] text-brand">

            Catalogue

          </p>



          <h1 className="mt-2 font-display text-3xl font-extrabold uppercase text-brand-deep md:text-4xl">

            Edit Product

          </h1>



          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-500">

            The main category is also the category used by Build

            Your Rig. Subcategory is optional.

          </p>



          <p className="mt-2 break-all text-xs text-slate-400">

            Product ID:{" "}

            {

              product.id

            }

          </p>

        </div>



        {error ? (

          <div className="mt-7 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-semibold text-red-700">

            {error}

          </div>

        ) : null}



        <form

          action={

            updateProduct

          }

          className="mt-8 rounded-2xl border border-brand/10 bg-white p-6 shadow-[0_25px_65px_-45px_rgba(23,49,96,0.35)] md:p-8"

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



            <ProductCategoryFields

              categories={

                categoryRows.map(

                  (

                    category

                  ) => ({

                    id:

                      category.id,



                    name:

                      category.name,



                    slug:

                      category.slug,

                  })

                )

              }

              subcategories={

                subcategories.map(

                  (

                    subcategory

                  ) => ({

                    id:

                      subcategory.id,



                    categoryId:

                      subcategory.categoryId,



                    name:

                      subcategory.name,



                    slug:

                      subcategory.slug,

                  })

                )

              }

              defaultCategory={

                product.category

              }

              defaultSubcategoryId={

                currentSubcategoryId

              }

            />



            <FormField

              label="Product Tag"

              htmlFor="tag"

            >

              <div className="relative">

                <Tag className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />



                <input

                  id="tag"

                  name="tag"

                  maxLength={

                    120

                  }

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

                <ListChecks className="pointer-events-none absolute left-4 top-4 h-4 w-4 text-slate-400" />



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



          <div className="mt-8 rounded-2xl border border-brand/10 bg-[#f7f9fc] p-5 md:p-6">

            <div className="flex items-start gap-3">

              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand/[0.08] text-brand">

                <ImageIcon className="h-5 w-5" />

              </div>



              <div>

                <h2 className="font-display text-base font-bold uppercase text-brand-deep">

                  Product Image

                </h2>



                <p className="mt-1 text-xs text-slate-500">

                  Keep the existing image or replace it.

                </p>

              </div>

            </div>



            <div className="mt-6 rounded-xl border border-brand/10 bg-white p-4">

              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">

                Current Image

              </p>



              <div className="mt-3 flex flex-col gap-4 sm:flex-row sm:items-center">

                <div className="h-32 w-40 max-w-full shrink-0 overflow-hidden rounded-xl border border-brand/10 bg-[#f7f9fc]">

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



                <p className="min-w-0 break-all text-xs text-slate-400">

                  {

                    product.image

                  }

                </p>

              </div>

            </div>



            <div className="mt-6">

              <label

                htmlFor="imageFile"

                className="flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-brand/25 bg-white px-5 py-8 text-center"

              >

                <Upload className="h-6 w-6 text-brand" />



                <span className="mt-3 text-sm font-bold text-brand-deep">

                  Choose Replacement Image

                </span>



                <input

                  id="imageFile"

                  name="imageFile"

                  type="file"

                  accept="image/jpeg,image/png,image/webp"

                  className="mt-4 block min-h-12 w-full min-w-0 max-w-full self-stretch rounded-lg text-xs leading-6 text-slate-500 file:mr-3 file:rounded-lg file:border-0 file:bg-brand file:px-4 file:py-3 file:text-xs file:font-bold file:leading-5 file:text-white"

                />

              </label>

            </div>



            <div className="my-6 flex items-center gap-4">

              <div className="h-px flex-1 bg-brand/10" />



              <span className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">

                Or

              </span>



              <div className="h-px flex-1 bg-brand/10" />

            </div>



            <FormField

              label="Replace With Image URL"

              htmlFor="imageUrl"

            >

              <div className="relative">

                <LinkIcon className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />



                <input

                  id="imageUrl"

                  name="imageUrl"

                  type="url"

                  maxLength={

                    1000

                  }

                  placeholder="https://example.com/new-product-image.jpg"

                  className={`${inputClass} bg-white pl-11`}

                />

              </div>

            </FormField>

          </div>



          <div className="mt-8 min-w-0">

            <AdditionalImagesEditor

              key={

                product.id

              }

              existingImages={

                additionalImages

              }

            />

          </div>



          <div className="mt-7 rounded-xl border border-brand/10 bg-[#f7f9fc] p-5">

            <label className="flex cursor-pointer items-start gap-3">

              <input

                id="isVisible"

                name="isVisible"

                type="checkbox"

                defaultChecked={

                  product.isVisible

                }

                className="mt-1 h-4 w-4 accent-[#e60000]"

              />



              <span>

                <span className="block text-sm font-bold text-brand-deep">

                  Visible on website

                </span>



                <span className="mt-1 block text-xs text-slate-500">

                  Hidden products are also excluded from Build

                  Your Rig.

                </span>

              </span>

            </label>

          </div>



          <div className="mt-8 flex flex-col gap-3 border-t border-brand/10 pt-6 sm:flex-row sm:justify-end">

            <Link

              href="/admin/products"

              className="inline-flex min-h-12 w-full items-center justify-center whitespace-normal rounded-xl border border-brand/15 bg-white px-6 py-3.5 text-center text-xs font-bold uppercase tracking-wider text-brand sm:w-auto"

            >

              Cancel

            </Link>



            <button

              type="submit"

              className="inline-flex min-h-12 w-full items-center justify-center gap-2 whitespace-normal rounded-xl bg-brand px-6 py-3.5 text-center font-display text-xs font-bold uppercase tracking-wider text-white sm:w-auto"

            >

              <Save className="h-4 w-4 shrink-0" />

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

    <div className="min-w-0">

      <label

        htmlFor={

          htmlFor

        }

        className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-600"

      >

        {label}

      </label>



      {children}

    </div>

  );

}
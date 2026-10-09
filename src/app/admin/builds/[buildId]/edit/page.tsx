/* eslint-disable @next/next/no-img-element */



import {

  AdditionalImagesEditor,

} from "@/components/admin/AdditionalImagesEditor";



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

  customBuilds,

} from "@/db/schema";



import {

  requireAdmin,

} from "@/lib/admin-auth";



import {

  updateBuild,

} from "../../actions";



type EditBuildPageProps = {

  params: Promise<{

    buildId: string;

  }>;



  searchParams: Promise<{

    error?: string;

  }>;

};



export default async function EditBuildPage({

  params,

  searchParams,

}: EditBuildPageProps) {

  await requireAdmin();



  const {

    buildId,

  } =

    await params;



  const {

    error,

  } =

    await searchParams;



  const rows =

    await db

      .select()

      .from(

        customBuilds

      )

      .where(

        eq(

          customBuilds.id,

          buildId

        )

      )

      .limit(

        1

      );



  const build =

    rows[0];



  if (

    !build

  ) {

    redirect(

      "/admin/builds"

    );

  }



  const categories =

    await db

      .select({

        name:

          catalogCategories.name,



        slug:

          catalogCategories.slug,



        isVisible:

          catalogCategories.isVisible,

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

                "build"

              ),

              eq(

                catalogCategories.appliesTo,

                "both"

              )

            )

          ),

          eq(

            catalogCategories.slug,

            build.category

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



  const hasCurrentCategory =

    categories.some(

      (

        category

      ) =>

        category.slug ===

        build.category

    );



  return (

    <main

      className="

        min-h-screen

        bg-[#fff8f8]

      "

    >

      <AdminHeader />



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

          <p className="text-xs font-bold uppercase tracking-[0.24em] text-brand">

            Signature Systems

          </p>



          <h1 className="mt-2 font-display text-3xl font-extrabold uppercase text-brand-deep md:text-4xl">

            Edit Custom Build

          </h1>



          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-500">

            Update this build, including its category, image,

            visibility and order.

          </p>



          <p className="mt-2 break-all text-xs text-slate-400">

            Build ID:{" "}

            {

              build.id

            }

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

            updateBuild

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

          <input

            type="hidden"

            name="buildId"

            value={

              build.id

            }

          />



          <div className="grid gap-6 md:grid-cols-2">

            <FormField

              label="Build Name"

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

                  build.name

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

                  build.price ??

                  ""

                }

                placeholder="e.g. 250000"

                className={

                  inputClass

                }

              />



              <HelpText>

                Optional. Leave empty to show Price on request.

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

                defaultValue={

                  build.category

                }

                className={

                  inputClass

                }

              >

                {!hasCurrentCategory ? (

                  <option

                    value={

                      build.category

                    }

                  >

                    {

                      build.category

                    }{" "}

                    (Legacy)

                  </option>

                ) : null}



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



                      {!category.isVisible

                        ? " (Hidden)"

                        : ""}

                    </option>

                  )

                )}

              </select>



              <div className="mt-2 flex flex-wrap items-center justify-between gap-2">

                <HelpText>

                  Category can be changed at any time.

                </HelpText>



                <Link

                  href="/admin/categories"

                  className="text-xs font-bold text-brand hover:underline"

                >

                  Manage Categories

                </Link>

              </div>

            </FormField>



            <FormField

              label="Build Role"

              htmlFor="role"

            >

              <input

                id="role"

                name="role"

                type="text"

                required

                maxLength={

                  255

                }

                defaultValue={

                  build.role

                }

                className={

                  inputClass

                }

              />



              <HelpText>

                This appears directly below the build name.

              </HelpText>

            </FormField>



            <FormField

              label="Badge"

              htmlFor="badge"

            >

              <div className="relative">

                <Tag className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />



                <input

                  id="badge"

                  name="badge"

                  type="text"

                  maxLength={

                    120

                  }

                  defaultValue={

                    build.badge

                  }

                  className={`${inputClass} pl-11`}

                />

              </div>



              <HelpText>

                Leave empty to use CUSTOM BUILD.

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

                defaultValue={

                  build.sortOrder

                }

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

                defaultValue={

                  build.description

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

                    build.specs.join(

                      "\n"

                    )

                  }

                  className={`${inputClass} resize-y pl-11`}

                />

              </div>



              <HelpText>

                Enter one specification per line.

              </HelpText>

            </FormField>

          </div>



          <EditImageSection

            currentImage={

              build.image

            }

          />



          <div className="mt-8 min-w-0">

            <AdditionalImagesEditor

              key={

                build.id

              }

              existingImages={

                Array.from(

                  new Set(

                    (

                      build.images ??

                      []

                    ).filter(

                      (

                        url

                      ) =>

                        Boolean(url) &&

                        url !==

                          build.image

                    )

                  )

                )

              }

            />

          </div>



          <VisibilityBox

            defaultChecked={

              build.isVisible

            }

          />



          <div className="mt-8 flex flex-col gap-3 border-t border-brand/10 pt-6 sm:flex-row sm:justify-end">

            <Link

              href="/admin/builds"

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

              <Save className="h-4 w-4 shrink-0" />



              Save Changes

            </button>

          </div>

        </form>

      </div>

    </main>

  );

}



function AdminHeader() {

  return (

    <header className="border-b border-brand/10 bg-white">

      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-5 py-4 md:px-8">

        <div>

          <p className="font-display text-lg font-extrabold uppercase tracking-widest text-brand-deep">

            Gamex Admin

          </p>



          <p className="mt-0.5 text-xs text-slate-500">

            Edit Custom Build

          </p>

        </div>



        <Link

          href="/admin/builds"

          className={

            headerButtonClass

          }

        >

          <ArrowLeft className="h-4 w-4" />



          Builds

        </Link>

      </div>

    </header>

  );

}



function EditImageSection({

  currentImage,

}: {

  currentImage: string;

}) {

  return (

    <div className="mt-8 rounded-2xl border border-brand/10 bg-[#fff8f8] p-5 md:p-6">

      <div className="flex items-start gap-3">

        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand/[0.08] text-brand">

          <ImageIcon className="h-5 w-5" />

        </div>



        <div>

          <h2 className="font-display text-base font-bold uppercase text-brand-deep">

            Build Image

          </h2>



          <p className="mt-1 text-xs text-slate-500">

            Leave both replacement fields empty to keep the

            current image.

          </p>

        </div>

      </div>



      <div className="mt-5 overflow-hidden rounded-xl border border-brand/10 bg-white p-3">

        <img

          src={

            currentImage

          }

          alt="Current build"

          className="h-52 w-full rounded-lg object-contain"

        />

      </div>



      <div className="mt-6">

        <label

          htmlFor="imageFile"

          className={

            fieldLabelClass

          }

        >

          Replace From PC

        </label>



        <label

          htmlFor="imageFile"

          className="flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-brand/25 bg-white px-5 py-7 text-center hover:border-brand/50"

        >

          <Upload className="h-5 w-5 text-brand" />



          <span className="mt-2 text-sm font-bold text-brand-deep">

            Choose New Image

          </span>



          <span className="mt-1 text-xs text-slate-400">

            JPG, PNG or WebP — maximum 5 MB

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

        label="New Image URL"

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

            placeholder="https://example.com/new-build.jpg"

            className={`${inputClass} bg-white pl-11`}

          />

        </div>

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

    <div className="mt-7 rounded-xl border border-brand/10 bg-[#fff8f8] p-5">

      <label

        htmlFor="isVisible"

        className="flex cursor-pointer items-start gap-3"

      >

        <input

          id="isVisible"

          name="isVisible"

          type="checkbox"

          defaultChecked={

            defaultChecked

          }

          className="mt-1 h-4 w-4 accent-[#e60000]"

        />



        <span>

          <span className="block text-sm font-bold text-brand-deep">

            Visible on website

          </span>



          <span className="mt-1 block text-xs text-slate-500">

            Turn this off to hide the build without deleting

            it.

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

    <div className="mt-7 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-semibold text-red-700">

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

    <div className="min-w-0">

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

  "w-full min-w-0 rounded-xl border border-brand/15 bg-[#fff8f8] px-4 py-3.5 text-sm text-brand-deep outline-none transition-all placeholder:text-slate-400 hover:border-brand/25 focus:border-brand/60 focus:bg-white focus:shadow-[0_0_0_3px_rgba(230,0,0,0.10)]";



const headerButtonClass =

  "inline-flex items-center gap-2 rounded-lg border border-brand/15 bg-white px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-brand transition-all hover:border-brand hover:bg-brand hover:text-white";



const secondaryButtonClass =

  "inline-flex min-h-12 w-full items-center justify-center whitespace-normal rounded-xl border border-brand/15 bg-white px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-brand text-center transition-all hover:border-brand hover:bg-brand/[0.05] sm:w-auto";



const primaryButtonClass =

  "inline-flex min-h-12 w-full items-center justify-center gap-2 whitespace-normal rounded-xl bg-brand px-6 py-3.5 font-display text-xs font-bold uppercase tracking-wider text-white text-center transition-all hover:-translate-y-0.5 hover:bg-brand-soft sm:w-auto";
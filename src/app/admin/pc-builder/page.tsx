/* eslint-disable @next/next/no-img-element */

import Link from "next/link";

import {
  asc,
  eq,
} from "drizzle-orm";

import {
  ArrowLeft,
  Boxes,
  CircleDollarSign,
  Eye,
  EyeOff,
  ImageIcon,
  Layers3,
  LinkIcon,
  ListChecks,
  PackagePlus,
  Save,
  Settings,
  ShieldCheck,
  Trash2,
  Upload,
} from "lucide-react";

import {
  db,
} from "@/db";

import {
  pcBuilderCategories,
  pcBuilderItems,
  pcBuilderSettings,
} from "@/db/schema";

import {
  requireAdmin,
} from "@/lib/admin-auth";

import {
  createBuilderCategory,
  createBuilderItem,
  deleteBuilderCategory,
  deleteBuilderItem,
  saveBuilderSettings,
  updateBuilderCategory,
  updateBuilderItem,
} from "./actions";

/* =========================================================
   DEFAULT SETTINGS
   ========================================================= */

const DEFAULT_SETTINGS = {
  id:
    "main",

  title:
    "Build Your Gaming PC",

  subtitle:
    "Choose your components, calculate your total, and send your complete build to GameX on WhatsApp.",

  readyBuildsLabel:
    "Ready Builds",

  scratchBuilderLabel:
    "Build From Scratch",

  quoteButtonText:
    "Get Quote on WhatsApp",

  whatsappNumber:
    "923036009123",

  showReadyBuilds:
    true,

  showScratchBuilder:
    true,

  isVisible:
    true,
};

/* =========================================================
   PAGE
   ========================================================= */

export default async function PcBuilderAdminPage({
  searchParams,
}: {
  searchParams: Promise<{
    error?: string;
    saved?: string;
  }>;
}) {
  await requireAdmin();

  const params =
    await searchParams;

  const [
    settingsRows,
    categories,
    items,
  ] =
    await Promise.all([
      db
        .select()
        .from(
          pcBuilderSettings
        )
        .where(
          eq(
            pcBuilderSettings.id,
            "main"
          )
        )
        .limit(
          1
        ),

      db
        .select()
        .from(
          pcBuilderCategories
        )
        .orderBy(
          asc(
            pcBuilderCategories.sortOrder
          ),
          asc(
            pcBuilderCategories.id
          )
        ),

      db
        .select()
        .from(
          pcBuilderItems
        )
        .orderBy(
          asc(
            pcBuilderItems.categoryId
          ),
          asc(
            pcBuilderItems.sortOrder
          ),
          asc(
            pcBuilderItems.id
          )
        ),
    ]);

  const settings =
    settingsRows[0] ??
    DEFAULT_SETTINGS;

  const visibleCategories =
    categories.filter(
      (category) =>
        category.isVisible
    ).length;

  const visibleItems =
    items.filter(
      (item) =>
        item.isVisible
    ).length;

  return (
    <main
      id="top"
      className="
        min-h-screen
        bg-[#f7f9fc]
      "
    >
      {/* =====================================================
          HEADER
          ===================================================== */}

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
            max-w-7xl
            flex-col
            gap-4
            px-5
            py-5
            md:flex-row
            md:items-center
            md:justify-between
            md:px-8
          "
        >
          <div>
            <p
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
            </p>

            <p
              className="
                mt-1
                text-sm
                text-slate-500
              "
            >
              PC Builder Management
            </p>
          </div>

          <div
            className="
              flex
              flex-wrap
              gap-2
            "
          >
            <Link
              href="/admin"
              className="
                inline-flex
                items-center
                gap-2
                rounded-xl
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
                hover:bg-brand/[0.05]
              "
            >
              <ArrowLeft className="h-4 w-4" />

              Admin
            </Link>

            <Link
              href="/build-your-rig"
              className="
                inline-flex
                items-center
                gap-2
                rounded-xl
                bg-brand
                px-4
                py-2.5
                text-xs
                font-bold
                uppercase
                tracking-wider
                text-white
                transition-all
                hover:bg-brand-soft
              "
            >
              <Eye className="h-4 w-4" />

              Public Builder
            </Link>
          </div>
        </div>
      </header>

      <div
        className="
          mx-auto
          max-w-7xl
          px-5
          py-8
          md:px-8
          md:py-10
        "
      >
        {/* ===================================================
            PAGE INTRO
            =================================================== */}

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
            Custom PC System
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
            PC Builder
          </h1>

          <p
            className="
              mt-3
              max-w-3xl
              text-sm
              leading-7
              text-slate-500
            "
          >
            Control the public PC builder, component categories,
            required or optional selections, component prices,
            images, links and visibility.
          </p>
        </div>

        {/* ===================================================
            ALERTS
            =================================================== */}

        {params.error ? (
          <div
            className="
              mt-6
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
              params.error
            }
          </div>
        ) : null}

        {params.saved ? (
          <div
            className="
              mt-6
              rounded-xl
              border
              border-green-200
              bg-green-50
              px-5
              py-4
              text-sm
              font-semibold
              text-green-700
            "
          >
            {
              params.saved
            }
          </div>
        ) : null}

        {/* ===================================================
            STATS
            =================================================== */}

        <div
          className="
            mt-8
            grid
            gap-4
            sm:grid-cols-2
            lg:grid-cols-4
          "
        >
          <StatCard
            icon={
              <Layers3 className="h-5 w-5" />
            }
            label="Categories"
            value={
              categories.length
            }
          />

          <StatCard
            icon={
              <Eye className="h-5 w-5" />
            }
            label="Visible Categories"
            value={
              visibleCategories
            }
          />

          <StatCard
            icon={
              <Boxes className="h-5 w-5" />
            }
            label="Builder Items"
            value={
              items.length
            }
          />

          <StatCard
            icon={
              <ShieldCheck className="h-5 w-5" />
            }
            label="Visible Items"
            value={
              visibleItems
            }
          />
        </div>

        {/* ===================================================
            SETTINGS
            =================================================== */}

        <section
          id="settings"
          className="
            mt-10
            rounded-2xl
            border
            border-brand/10
            bg-white
            p-6
            shadow-[0_25px_65px_-45px_rgba(23,49,96,0.35)]
            md:p-8
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
                h-11
                w-11
                shrink-0
                place-items-center
                rounded-xl
                bg-brand/[0.08]
                text-brand
              "
            >
              <Settings className="h-5 w-5" />
            </div>

            <div>
              <h2
                className="
                  font-display
                  text-xl
                  font-extrabold
                  uppercase
                  text-brand-deep
                "
              >
                Builder Settings
              </h2>

              <p
                className="
                  mt-1
                  text-sm
                  text-slate-500
                "
              >
                Main text, WhatsApp number and public visibility.
              </p>
            </div>
          </div>

          <form
            action={
              saveBuilderSettings
            }
            className="
              mt-7
            "
          >
            <div
              className="
                grid
                gap-5
                md:grid-cols-2
              "
            >
              <FormField
                label="Page Title"
                htmlFor="title"
              >
                <input
                  id="title"
                  name="title"
                  required
                  maxLength={
                    255
                  }
                  defaultValue={
                    settings.title
                  }
                  className={
                    inputClass
                  }
                />
              </FormField>

              <FormField
                label="WhatsApp Number"
                htmlFor="whatsappNumber"
              >
                <input
                  id="whatsappNumber"
                  name="whatsappNumber"
                  required
                  defaultValue={
                    settings.whatsappNumber
                  }
                  placeholder="923036009123"
                  className={
                    inputClass
                  }
                />
              </FormField>

              <FormField
                label="Ready Builds Label"
                htmlFor="readyBuildsLabel"
              >
                <input
                  id="readyBuildsLabel"
                  name="readyBuildsLabel"
                  required
                  maxLength={
                    120
                  }
                  defaultValue={
                    settings.readyBuildsLabel
                  }
                  className={
                    inputClass
                  }
                />
              </FormField>

              <FormField
                label="Scratch Builder Label"
                htmlFor="scratchBuilderLabel"
              >
                <input
                  id="scratchBuilderLabel"
                  name="scratchBuilderLabel"
                  required
                  maxLength={
                    120
                  }
                  defaultValue={
                    settings.scratchBuilderLabel
                  }
                  className={
                    inputClass
                  }
                />
              </FormField>

              <FormField
                label="Quote Button Text"
                htmlFor="quoteButtonText"
              >
                <input
                  id="quoteButtonText"
                  name="quoteButtonText"
                  required
                  maxLength={
                    120
                  }
                  defaultValue={
                    settings.quoteButtonText
                  }
                  className={
                    inputClass
                  }
                />
              </FormField>
            </div>

            <div className="mt-5">
              <FormField
                label="Subtitle"
                htmlFor="subtitle"
              >
                <textarea
                  id="subtitle"
                  name="subtitle"
                  required
                  rows={
                    3
                  }
                  defaultValue={
                    settings.subtitle
                  }
                  className={`${inputClass} resize-y`}
                />
              </FormField>
            </div>

            <div
              className="
                mt-6
                grid
                gap-3
                sm:grid-cols-3
              "
            >
              <CheckboxCard
                name="showReadyBuilds"
                label="Show Ready Builds"
                defaultChecked={
                  settings.showReadyBuilds
                }
              />

              <CheckboxCard
                name="showScratchBuilder"
                label="Show Scratch Builder"
                defaultChecked={
                  settings.showScratchBuilder
                }
              />

              <CheckboxCard
                name="isVisible"
                label="Builder Page Visible"
                defaultChecked={
                  settings.isVisible
                }
              />
            </div>

            <div
              className="
                mt-7
                flex
                justify-end
              "
            >
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
                <Save className="h-4 w-4" />

                Save Settings
              </button>
            </div>
          </form>
        </section>

        {/* ===================================================
            CATEGORIES
            =================================================== */}

        <section
          id="categories"
          className="
            mt-10
          "
        >
          <div>
            <p
              className="
                text-xs
                font-bold
                uppercase
                tracking-[0.2em]
                text-brand
              "
            >
              Builder Structure
            </p>

            <h2
              className="
                mt-2
                font-display
                text-2xl
                font-extrabold
                uppercase
                text-brand-deep
              "
            >
              Component Categories
            </h2>
          </div>

          {/* ADD CATEGORY */}

          <div
            className="
              mt-6
              rounded-2xl
              border
              border-brand/10
              bg-white
              p-6
              md:p-7
            "
          >
            <h3
              className="
                font-display
                text-lg
                font-extrabold
                uppercase
                text-brand-deep
              "
            >
              Add Category
            </h3>

            <form
              action={
                createBuilderCategory
              }
              className="
                mt-5
              "
            >
              <div
                className="
                  grid
                  gap-4
                  md:grid-cols-2
                  xl:grid-cols-4
                "
              >
                <FormField
                  label="Name"
                  htmlFor="new-category-name"
                >
                  <input
                    id="new-category-name"
                    name="name"
                    required
                    maxLength={
                      120
                    }
                    placeholder="e.g. Motherboard"
                    className={
                      inputClass
                    }
                  />
                </FormField>

                <FormField
                  label="Slug"
                  htmlFor="new-category-slug"
                >
                  <input
                    id="new-category-slug"
                    name="slug"
                    maxLength={
                      120
                    }
                    placeholder="Auto generated"
                    className={
                      inputClass
                    }
                  />
                </FormField>

                <FormField
                  label="Display Order"
                  htmlFor="new-category-order"
                >
                  <input
                    id="new-category-order"
                    name="sortOrder"
                    type="number"
                    min={
                      0
                    }
                    defaultValue={
                      0
                    }
                    className={
                      inputClass
                    }
                  />
                </FormField>
              </div>

              <div
                className="
                  mt-4
                  grid
                  gap-4
                  md:grid-cols-2
                "
              >
                <FormField
                  label="Description"
                  htmlFor="new-category-description"
                >
                  <textarea
                    id="new-category-description"
                    name="description"
                    rows={
                      3
                    }
                    className={`${inputClass} resize-y`}
                  />
                </FormField>

                <FormField
                  label="Help Text"
                  htmlFor="new-category-help"
                >
                  <textarea
                    id="new-category-help"
                    name="helpText"
                    rows={
                      3
                    }
                    maxLength={
                      500
                    }
                    className={`${inputClass} resize-y`}
                  />
                </FormField>
              </div>

              <div
                className="
                  mt-4
                  grid
                  gap-3
                  sm:grid-cols-2
                "
              >
                <CheckboxCard
                  name="isRequired"
                  label="Required Selection"
                />

                <CheckboxCard
                  name="isVisible"
                  label="Visible on Builder"
                  defaultChecked
                />
              </div>

              <div
                className="
                  mt-5
                  flex
                  justify-end
                "
              >
                <button
                  type="submit"
                  className="
                    inline-flex
                    items-center
                    gap-2
                    rounded-xl
                    bg-brand
                    px-5
                    py-3
                    text-xs
                    font-bold
                    uppercase
                    tracking-wider
                    text-white
                    transition-all
                    hover:bg-brand-soft
                  "
                >
                  <PackagePlus className="h-4 w-4" />

                  Add Category
                </button>
              </div>
            </form>
          </div>

          {/* EXISTING CATEGORIES */}

          <div
            className="
              mt-5
              space-y-4
            "
          >
            {categories.map(
              (
                category
              ) => {
                const categoryItems =
                  items.filter(
                    (
                      item
                    ) =>
                      item.categoryId ===
                      category.id
                  );

                return (
                  <details
                    key={
                      category.id
                    }
                    className="
                      rounded-2xl
                      border
                      border-brand/10
                      bg-white
                    "
                  >
                    <summary
                      className="
                        flex
                        cursor-pointer
                        list-none
                        items-center
                        justify-between
                        gap-4
                        px-5
                        py-4
                        md:px-6
                      "
                    >
                      <div>
                        <div
                          className="
                            flex
                            flex-wrap
                            items-center
                            gap-2
                          "
                        >
                          <span
                            className="
                              font-display
                              text-base
                              font-extrabold
                              uppercase
                              text-brand-deep
                            "
                          >
                            {
                              category.name
                            }
                          </span>

                          {category.isRequired ? (
                            <span
                              className="
                                rounded-full
                                bg-brand/[0.08]
                                px-2.5
                                py-1
                                text-[9px]
                                font-bold
                                uppercase
                                tracking-wider
                                text-brand
                              "
                            >
                              Required
                            </span>
                          ) : (
                            <span
                              className="
                                rounded-full
                                bg-slate-100
                                px-2.5
                                py-1
                                text-[9px]
                                font-bold
                                uppercase
                                tracking-wider
                                text-slate-500
                              "
                            >
                              Optional
                            </span>
                          )}

                          {category.isVisible ? (
                            <Eye className="h-4 w-4 text-green-600" />
                          ) : (
                            <EyeOff className="h-4 w-4 text-slate-400" />
                          )}
                        </div>

                        <p
                          className="
                            mt-1
                            text-xs
                            text-slate-400
                          "
                        >
                          {categoryItems.length} items · Order {category.sortOrder}
                        </p>
                      </div>

                      <span
                        className="
                          text-xs
                          font-bold
                          uppercase
                          text-brand
                        "
                      >
                        Edit
                      </span>
                    </summary>

                    <div
                      className="
                        border-t
                        border-brand/10
                        p-5
                        md:p-6
                      "
                    >
                      <form
                        action={
                          updateBuilderCategory
                        }
                      >
                        <input
                          type="hidden"
                          name="categoryId"
                          value={
                            category.id
                          }
                        />

                        <div
                          className="
                            grid
                            gap-4
                            md:grid-cols-2
                            xl:grid-cols-3
                          "
                        >
                          <FormField
                            label="Name"
                            htmlFor={`category-name-${category.id}`}
                          >
                            <input
                              id={`category-name-${category.id}`}
                              name="name"
                              required
                              defaultValue={
                                category.name
                              }
                              className={
                                inputClass
                              }
                            />
                          </FormField>

                          <FormField
                            label="Slug"
                            htmlFor={`category-slug-${category.id}`}
                          >
                            <input
                              id={`category-slug-${category.id}`}
                              name="slug"
                              required
                              defaultValue={
                                category.slug
                              }
                              className={
                                inputClass
                              }
                            />
                          </FormField>

                          <FormField
                            label="Display Order"
                            htmlFor={`category-order-${category.id}`}
                          >
                            <input
                              id={`category-order-${category.id}`}
                              name="sortOrder"
                              type="number"
                              min={
                                0
                              }
                              defaultValue={
                                category.sortOrder
                              }
                              className={
                                inputClass
                              }
                            />
                          </FormField>
                        </div>

                        <div
                          className="
                            mt-4
                            grid
                            gap-4
                            md:grid-cols-2
                          "
                        >
                          <FormField
                            label="Description"
                            htmlFor={`category-description-${category.id}`}
                          >
                            <textarea
                              id={`category-description-${category.id}`}
                              name="description"
                              rows={
                                3
                              }
                              defaultValue={
                                category.description
                              }
                              className={`${inputClass} resize-y`}
                            />
                          </FormField>

                          <FormField
                            label="Help Text"
                            htmlFor={`category-help-${category.id}`}
                          >
                            <textarea
                              id={`category-help-${category.id}`}
                              name="helpText"
                              rows={
                                3
                              }
                              defaultValue={
                                category.helpText
                              }
                              className={`${inputClass} resize-y`}
                            />
                          </FormField>
                        </div>

                        <div
                          className="
                            mt-4
                            grid
                            gap-3
                            sm:grid-cols-2
                          "
                        >
                          <CheckboxCard
                            name="isRequired"
                            label="Required Selection"
                            defaultChecked={
                              category.isRequired
                            }
                          />

                          <CheckboxCard
                            name="isVisible"
                            label="Visible on Builder"
                            defaultChecked={
                              category.isVisible
                            }
                          />
                        </div>

                        <div
                          className="
                            mt-5
                            flex
                            flex-wrap
                            justify-end
                            gap-2
                          "
                        >
                          <button
                            type="submit"
                            className="
                              inline-flex
                              items-center
                              gap-2
                              rounded-xl
                              bg-brand
                              px-5
                              py-3
                              text-xs
                              font-bold
                              uppercase
                              tracking-wider
                              text-white
                            "
                          >
                            <Save className="h-4 w-4" />

                            Save Category
                          </button>
                        </div>
                      </form>

                      <form
                        action={
                          deleteBuilderCategory
                        }
                        className="
                          mt-3
                          flex
                          justify-end
                        "
                      >
                        <input
                          type="hidden"
                          name="categoryId"
                          value={
                            category.id
                          }
                        />

                        <button
                          type="submit"
                          className="
                            inline-flex
                            items-center
                            gap-2
                            rounded-xl
                            border
                            border-red-200
                            bg-red-50
                            px-4
                            py-2.5
                            text-xs
                            font-bold
                            uppercase
                            tracking-wider
                            text-red-600
                            transition-all
                            hover:bg-red-100
                          "
                        >
                          <Trash2 className="h-4 w-4" />

                          Delete Category
                        </button>
                      </form>
                    </div>
                  </details>
                );
              }
            )}
          </div>
        </section>

        {/* ===================================================
            BUILDER ITEMS
            =================================================== */}

        <section
          id="items"
          className="
            mt-12
          "
        >
          <div>
            <p
              className="
                text-xs
                font-bold
                uppercase
                tracking-[0.2em]
                text-brand
              "
            >
              Parts Catalogue
            </p>

            <h2
              className="
                mt-2
                font-display
                text-2xl
                font-extrabold
                uppercase
                text-brand-deep
              "
            >
              Builder Items
            </h2>
          </div>

          {/* ADD ITEM */}

          <div
            className="
              mt-6
              rounded-2xl
              border
              border-brand/10
              bg-white
              p-6
              md:p-7
            "
          >
            <h3
              className="
                font-display
                text-lg
                font-extrabold
                uppercase
                text-brand-deep
              "
            >
              Add Builder Item
            </h3>

            <form
              action={
                createBuilderItem
              }
              encType="multipart/form-data"
              className="
                mt-5
              "
            >
              <div
                className="
                  grid
                  gap-4
                  md:grid-cols-2
                  xl:grid-cols-4
                "
              >
                <FormField
                  label="Category"
                  htmlFor="new-item-category"
                >
                  <select
                    id="new-item-category"
                    name="categoryId"
                    required
                    className={
                      inputClass
                    }
                  >
                    <option value="">
                      Select Category
                    </option>

                    {categories.map(
                      (
                        category
                      ) => (
                        <option
                          key={
                            category.id
                          }
                          value={
                            category.id
                          }
                        >
                          {
                            category.name
                          }
                        </option>
                      )
                    )}
                  </select>
                </FormField>

                <FormField
                  label="Item Name"
                  htmlFor="new-item-name"
                >
                  <input
                    id="new-item-name"
                    name="name"
                    required
                    placeholder="e.g. Ryzen 5 5600"
                    className={
                      inputClass
                    }
                  />
                </FormField>

                <FormField
                  label="Price (PKR)"
                  htmlFor="new-item-price"
                >
                  <input
                    id="new-item-price"
                    name="price"
                    type="number"
                    min={
                      0
                    }
                    defaultValue={
                      0
                    }
                    required
                    className={
                      inputClass
                    }
                  />
                </FormField>

                <FormField
                  label="Display Order"
                  htmlFor="new-item-order"
                >
                  <input
                    id="new-item-order"
                    name="sortOrder"
                    type="number"
                    min={
                      0
                    }
                    defaultValue={
                      0
                    }
                    className={
                      inputClass
                    }
                  />
                </FormField>
              </div>

              <div
                className="
                  mt-4
                  grid
                  gap-4
                  lg:grid-cols-2
                "
              >
                <FormField
                  label="Description"
                  htmlFor="new-item-description"
                >
                  <textarea
                    id="new-item-description"
                    name="description"
                    rows={
                      4
                    }
                    className={`${inputClass} resize-y`}
                  />
                </FormField>

                <FormField
                  label="Specifications"
                  htmlFor="new-item-specs"
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
                      id="new-item-specs"
                      name="specs"
                      rows={
                        4
                      }
                      placeholder="One specification per line"
                      className={`${inputClass} resize-y pl-11`}
                    />
                  </div>
                </FormField>
              </div>

              <div
                className="
                  mt-4
                  grid
                  gap-4
                  lg:grid-cols-2
                "
              >
                <FormField
                  label="Product Link"
                  htmlFor="new-item-url"
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
                      id="new-item-url"
                      name="productUrl"
                      placeholder="/product/... or https://..."
                      className={`${inputClass} pl-11`}
                    />
                  </div>
                </FormField>

                <FormField
                  label="Image URL"
                  htmlFor="new-item-image-url"
                >
                  <div className="relative">
                    <ImageIcon
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
                      id="new-item-image-url"
                      name="imageUrl"
                      type="url"
                      className={`${inputClass} pl-11`}
                    />
                  </div>
                </FormField>
              </div>

              <div
                className="
                  mt-4
                  rounded-xl
                  border
                  border-dashed
                  border-brand/20
                  bg-[#f7f9fc]
                  p-5
                "
              >
                <label
                  htmlFor="new-item-image"
                  className="
                    flex
                    cursor-pointer
                    items-start
                    gap-3
                  "
                >
                  <Upload className="mt-0.5 h-5 w-5 text-brand" />

                  <span>
                    <span
                      className="
                        block
                        text-sm
                        font-bold
                        text-brand-deep
                      "
                    >
                      Upload Image
                    </span>

                    <span
                      className="
                        mt-1
                        block
                        text-xs
                        text-slate-400
                      "
                    >
                      JPG, PNG or WebP · maximum 5 MB
                    </span>

                    <input
                      id="new-item-image"
                      name="imageFile"
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      className="
                        mt-3
                        block
                        max-w-full
                        text-xs
                        text-slate-500
                      "
                    />
                  </span>
                </label>
              </div>

              <div className="mt-4">
                <CheckboxCard
                  name="isVisible"
                  label="Visible on Builder"
                  defaultChecked
                />
              </div>

              <div
                className="
                  mt-5
                  flex
                  justify-end
                "
              >
                <button
                  type="submit"
                  className="
                    inline-flex
                    items-center
                    gap-2
                    rounded-xl
                    bg-brand
                    px-5
                    py-3
                    text-xs
                    font-bold
                    uppercase
                    tracking-wider
                    text-white
                    hover:bg-brand-soft
                  "
                >
                  <PackagePlus className="h-4 w-4" />

                  Add Item
                </button>
              </div>
            </form>
          </div>

          {/* EXISTING ITEMS */}

          <div
            className="
              mt-6
              space-y-7
            "
          >
            {categories.map(
              (
                category
              ) => {
                const categoryItems =
                  items.filter(
                    (
                      item
                    ) =>
                      item.categoryId ===
                      category.id
                  );

                if (
                  categoryItems.length ===
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
                    <div
                      className="
                        mb-3
                        flex
                        items-center
                        justify-between
                      "
                    >
                      <h3
                        className="
                          font-display
                          text-lg
                          font-extrabold
                          uppercase
                          text-brand-deep
                        "
                      >
                        {
                          category.name
                        }
                      </h3>

                      <span
                        className="
                          text-xs
                          font-bold
                          text-slate-400
                        "
                      >
                        {categoryItems.length} items
                      </span>
                    </div>

                    <div
                      className="
                        grid
                        gap-4
                        lg:grid-cols-2
                      "
                    >
                      {categoryItems.map(
                        (
                          item
                        ) => (
                          <details
                            key={
                              item.id
                            }
                            className="
                              overflow-hidden
                              rounded-2xl
                              border
                              border-brand/10
                              bg-white
                            "
                          >
                            <summary
                              className="
                                flex
                                cursor-pointer
                                list-none
                                items-center
                                gap-4
                                p-4
                              "
                            >
                              <div
                                className="
                                  grid
                                  h-16
                                  w-16
                                  shrink-0
                                  place-items-center
                                  overflow-hidden
                                  rounded-xl
                                  bg-[#f4f4f4]
                                "
                              >
                                {item.image ? (
                                  <img
                                    src={
                                      item.image
                                    }
                                    alt={
                                      item.name
                                    }
                                    className="
                                      h-full
                                      w-full
                                      object-contain
                                      p-1
                                    "
                                  />
                                ) : (
                                  <ImageIcon className="h-5 w-5 text-slate-300" />
                                )}
                              </div>

                              <div
                                className="
                                  min-w-0
                                  flex-1
                                "
                              >
                                <div
                                  className="
                                    flex
                                    items-center
                                    gap-2
                                  "
                                >
                                  <h4
                                    className="
                                      truncate
                                      font-display
                                      text-sm
                                      font-extrabold
                                      uppercase
                                      text-brand-deep
                                    "
                                  >
                                    {
                                      item.name
                                    }
                                  </h4>

                                  {item.isVisible ? (
                                    <Eye className="h-3.5 w-3.5 shrink-0 text-green-600" />
                                  ) : (
                                    <EyeOff className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                                  )}
                                </div>

                                <p
                                  className="
                                    mt-1
                                    text-sm
                                    font-bold
                                    text-brand
                                  "
                                >
                                  Rs.{" "}
                                  {new Intl.NumberFormat(
                                    "en-PK"
                                  ).format(
                                    item.price
                                  )}
                                </p>
                              </div>
                            </summary>

                            <div
                              className="
                                border-t
                                border-brand/10
                                p-5
                              "
                            >
                              <form
                                action={
                                  updateBuilderItem
                                }
                                encType="multipart/form-data"
                              >
                                <input
                                  type="hidden"
                                  name="itemId"
                                  value={
                                    item.id
                                  }
                                />

                                <div
                                  className="
                                    grid
                                    gap-4
                                    sm:grid-cols-2
                                  "
                                >
                                  <FormField
                                    label="Category"
                                    htmlFor={`item-category-${item.id}`}
                                  >
                                    <select
                                      id={`item-category-${item.id}`}
                                      name="categoryId"
                                      defaultValue={
                                        item.categoryId
                                      }
                                      className={
                                        inputClass
                                      }
                                    >
                                      {categories.map(
                                        (
                                          option
                                        ) => (
                                          <option
                                            key={
                                              option.id
                                            }
                                            value={
                                              option.id
                                            }
                                          >
                                            {
                                              option.name
                                            }
                                          </option>
                                        )
                                      )}
                                    </select>
                                  </FormField>

                                  <FormField
                                    label="Name"
                                    htmlFor={`item-name-${item.id}`}
                                  >
                                    <input
                                      id={`item-name-${item.id}`}
                                      name="name"
                                      required
                                      defaultValue={
                                        item.name
                                      }
                                      className={
                                        inputClass
                                      }
                                    />
                                  </FormField>

                                  <FormField
                                    label="Price"
                                    htmlFor={`item-price-${item.id}`}
                                  >
                                    <input
                                      id={`item-price-${item.id}`}
                                      name="price"
                                      type="number"
                                      min={
                                        0
                                      }
                                      defaultValue={
                                        item.price
                                      }
                                      className={
                                        inputClass
                                      }
                                    />
                                  </FormField>

                                  <FormField
                                    label="Display Order"
                                    htmlFor={`item-order-${item.id}`}
                                  >
                                    <input
                                      id={`item-order-${item.id}`}
                                      name="sortOrder"
                                      type="number"
                                      min={
                                        0
                                      }
                                      defaultValue={
                                        item.sortOrder
                                      }
                                      className={
                                        inputClass
                                      }
                                    />
                                  </FormField>
                                </div>

                                <div className="mt-4">
                                  <FormField
                                    label="Description"
                                    htmlFor={`item-description-${item.id}`}
                                  >
                                    <textarea
                                      id={`item-description-${item.id}`}
                                      name="description"
                                      rows={
                                        3
                                      }
                                      defaultValue={
                                        item.description
                                      }
                                      className={`${inputClass} resize-y`}
                                    />
                                  </FormField>
                                </div>

                                <div className="mt-4">
                                  <FormField
                                    label="Specifications"
                                    htmlFor={`item-specs-${item.id}`}
                                  >
                                    <textarea
                                      id={`item-specs-${item.id}`}
                                      name="specs"
                                      rows={
                                        4
                                      }
                                      defaultValue={
                                        item.specs.join(
                                          "\n"
                                        )
                                      }
                                      className={`${inputClass} resize-y`}
                                    />
                                  </FormField>
                                </div>

                                <div
                                  className="
                                    mt-4
                                    grid
                                    gap-4
                                    sm:grid-cols-2
                                  "
                                >
                                  <FormField
                                    label="Product Link"
                                    htmlFor={`item-url-${item.id}`}
                                  >
                                    <input
                                      id={`item-url-${item.id}`}
                                      name="productUrl"
                                      defaultValue={
                                        item.productUrl
                                      }
                                      className={
                                        inputClass
                                      }
                                    />
                                  </FormField>

                                  <FormField
                                    label="Replacement Image URL"
                                    htmlFor={`item-image-${item.id}`}
                                  >
                                    <input
                                      id={`item-image-${item.id}`}
                                      name="imageUrl"
                                      type="url"
                                      className={
                                        inputClass
                                      }
                                    />
                                  </FormField>
                                </div>

                                <div
                                  className="
                                    mt-4
                                    rounded-xl
                                    border
                                    border-dashed
                                    border-brand/15
                                    bg-[#f7f9fc]
                                    p-4
                                  "
                                >
                                  <input
                                    name="imageFile"
                                    type="file"
                                    accept="image/jpeg,image/png,image/webp"
                                    className="
                                      block
                                      max-w-full
                                      text-xs
                                      text-slate-500
                                    "
                                  />
                                </div>

                                <div className="mt-4">
                                  <CheckboxCard
                                    name="isVisible"
                                    label="Visible on Builder"
                                    defaultChecked={
                                      item.isVisible
                                    }
                                  />
                                </div>

                                <div
                                  className="
                                    mt-5
                                    flex
                                    justify-end
                                  "
                                >
                                  <button
                                    type="submit"
                                    className="
                                      inline-flex
                                      items-center
                                      gap-2
                                      rounded-xl
                                      bg-brand
                                      px-5
                                      py-3
                                      text-xs
                                      font-bold
                                      uppercase
                                      tracking-wider
                                      text-white
                                    "
                                  >
                                    <Save className="h-4 w-4" />

                                    Save Item
                                  </button>
                                </div>
                              </form>

                              <form
                                action={
                                  deleteBuilderItem
                                }
                                className="
                                  mt-3
                                  flex
                                  justify-end
                                "
                              >
                                <input
                                  type="hidden"
                                  name="itemId"
                                  value={
                                    item.id
                                  }
                                />

                                <button
                                  type="submit"
                                  className="
                                    inline-flex
                                    items-center
                                    gap-2
                                    rounded-xl
                                    border
                                    border-red-200
                                    bg-red-50
                                    px-4
                                    py-2.5
                                    text-xs
                                    font-bold
                                    uppercase
                                    tracking-wider
                                    text-red-600
                                  "
                                >
                                  <Trash2 className="h-4 w-4" />

                                  Delete Item
                                </button>
                              </form>
                            </div>
                          </details>
                        )
                      )}
                    </div>
                  </div>
                );
              }
            )}
          </div>

          {items.length ===
          0 ? (
            <div
              className="
                mt-6
                rounded-2xl
                border
                border-dashed
                border-brand/20
                bg-white
                px-6
                py-12
                text-center
              "
            >
              <Boxes
                className="
                  mx-auto
                  h-8
                  w-8
                  text-brand/40
                "
              />

              <p
                className="
                  mt-3
                  font-display
                  text-lg
                  font-extrabold
                  uppercase
                  text-brand-deep
                "
              >
                No Builder Items Yet
              </p>

              <p
                className="
                  mt-2
                  text-sm
                  text-slate-400
                "
              >
                Add your first CPU, motherboard, GPU or other component above.
              </p>
            </div>
          ) : null}
        </section>
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
  children: React.ReactNode;
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
   CHECKBOX CARD
   ========================================================= */

function CheckboxCard({
  name,
  label,
  defaultChecked =
    false,
}: {
  name: string;
  label: string;
  defaultChecked?: boolean;
}) {
  return (
    <label
      className="
        flex
        cursor-pointer
        items-center
        gap-3
        rounded-xl
        border
        border-brand/10
        bg-[#f7f9fc]
        px-4
        py-3
      "
    >
      <input
        name={
          name
        }
        type="checkbox"
        defaultChecked={
          defaultChecked
        }
        className="
          h-4
          w-4
          accent-[#e60000]
        "
      />

      <span
        className="
          text-sm
          font-semibold
          text-brand-deep
        "
      >
        {
          label
        }
      </span>
    </label>
  );
}

/* =========================================================
   STAT CARD
   ========================================================= */

function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
}) {
  return (
    <div
      className="
        rounded-2xl
        border
        border-brand/10
        bg-white
        p-5
      "
    >
      <div
        className="
          flex
          items-center
          gap-3
        "
      >
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
          {
            icon
          }
        </div>

        <div>
          <p
            className="
              text-xs
              font-bold
              uppercase
              tracking-wider
              text-slate-400
            "
          >
            {
              label
            }
          </p>

          <p
            className="
              mt-0.5
              font-display
              text-2xl
              font-extrabold
              text-brand-deep
            "
          >
            {
              value
            }
          </p>
        </div>
      </div>
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
  focus:shadow-[0_0_0_3px_rgba(230,0,0,0.08)]
`;
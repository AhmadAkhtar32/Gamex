/* eslint-disable @next/next/no-img-element */

import type {
  Metadata,
} from "next";

import Link from "next/link";

import {
  and,
  asc,
  eq,
  or,
} from "drizzle-orm";

import {
  ArrowLeft,
  Check,
  PackageSearch,
} from "lucide-react";

import {
  notFound,
} from "next/navigation";

import {
  db,
} from "@/db";

import {
  catalogCategories,
  products,
} from "@/db/schema";

import {
  formatPrice,
} from "@/lib/price";

/* =========================================================
   CONSTANTS
   ========================================================= */

const SITE_URL =
  "https://gamex.pk";

/* =========================================================
   TYPES
   ========================================================= */

type CategoryPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

/* =========================================================
   GET CATEGORY
   ========================================================= */

async function getCategory(
  slug: string
) {
  const rows =
    await db
      .select({
        id:
          catalogCategories.id,

        name:
          catalogCategories.name,

        slug:
          catalogCategories.slug,

        updatedAt:
          catalogCategories.updatedAt,
      })
      .from(
        catalogCategories
      )
      .where(
        and(
          eq(
            catalogCategories.slug,
            slug
          ),

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
      .limit(
        1
      );

  return rows[0] ??
    null;
}

/* =========================================================
   METADATA
   ========================================================= */

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const {
    slug,
  } =
    await params;

  const category =
    await getCategory(
      slug
    );

  if (
    !category
  ) {
    return {
      title:
        "Category Not Found",

      robots: {
        index:
          false,

        follow:
          false,
      },
    };
  }

  const title =
    `${category.name} in Pakistan`;

  const description =
    `Shop ${category.name} in Pakistan from GameX. Explore gaming hardware, prices, specifications and performance-focused PC components for your gaming setup.`;

  const canonical =
    `/category/${category.slug}`;

  return {
    title,

    description,

    alternates: {
      canonical,
    },

    openGraph: {
      type:
        "website",

      locale:
        "en_PK",

      url:
        `${SITE_URL}${canonical}`,

      siteName:
        "GameX Pakistan",

      title:
        `${title} | GameX Pakistan`,

      description,

      images: [
        {
          url:
            "/icon.png",

          width:
            512,

          height:
            512,

          alt:
            `${category.name} at GameX Pakistan`,
        },
      ],
    },

    twitter: {
      card:
        "summary_large_image",

      title:
        `${title} | GameX Pakistan`,

      description,

      images: [
        "/icon.png",
      ],
    },

    robots: {
      index:
        true,

      follow:
        true,
    },
  };
}

/* =========================================================
   CATEGORY PAGE
   ========================================================= */

export default async function CategoryPage({
  params,
}: CategoryPageProps) {
  const {
    slug,
  } =
    await params;

  const category =
    await getCategory(
      slug
    );

  if (
    !category
  ) {
    notFound();
  }

  /* =======================================================
     PRODUCTS
     ======================================================= */

  const categoryProducts =
    await db
      .select()
      .from(
        products
      )
      .where(
        and(
          eq(
            products.category,
            category.slug
          ),

          eq(
            products.isVisible,
            true
          )
        )
      )
      .orderBy(
        asc(
          products.sortOrder
        ),

        asc(
          products.name
        )
      );

  /* =======================================================
     STRUCTURED DATA
     ======================================================= */

  const structuredData = {
    "@context":
      "https://schema.org",

    "@type":
      "CollectionPage",

    "@id":
      `${SITE_URL}/category/${category.slug}#collection`,

    url:
      `${SITE_URL}/category/${category.slug}`,

    name:
      `${category.name} in Pakistan`,

    description:
      `Browse ${category.name} from GameX Pakistan.`,

    mainEntity: {
      "@type":
        "ItemList",

      numberOfItems:
        categoryProducts.length,

      itemListElement:
        categoryProducts.map(
          (
            product,
            index
          ) => ({
            "@type":
              "ListItem",

            position:
              index + 1,

            name:
              product.name,

            url:
              `${SITE_URL}/product/${product.id}`,
          })
        ),
    },

    isPartOf: {
      "@type":
        "WebSite",

      "@id":
        `${SITE_URL}/#website`,
    },

    breadcrumb: {
      "@type":
        "BreadcrumbList",

      itemListElement: [
        {
          "@type":
            "ListItem",

          position:
            1,

          name:
            "Home",

          item:
            SITE_URL,
        },

        {
          "@type":
            "ListItem",

          position:
            2,

          name:
            "Products",

          item:
            `${SITE_URL}/#products`,
        },

        {
          "@type":
            "ListItem",

          position:
            3,

          name:
            category.name,

          item:
            `${SITE_URL}/category/${category.slug}`,
        },
      ],
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html:
            JSON.stringify(
              structuredData
            ),
        }}
      />

      <main
        className="
          min-h-screen
          bg-[#fff8f8]
        "
      >
        {/* ===================================================
            HERO
            =================================================== */}

        <section
          className="
            relative
            overflow-hidden
            border-b
            border-brand/10
            bg-white
          "
        >
          <div
            aria-hidden="true"
            className="
              pointer-events-none
              absolute
              inset-0
              bg-[radial-gradient(circle_at_15%_25%,rgba(230,0,0,0.07),transparent_32%),radial-gradient(circle_at_85%_70%,rgba(230,0,0,0.04),transparent_35%)]
            "
          />

          <div
            className="
              relative
              mx-auto
              max-w-7xl
              px-5
              py-12
              md:px-8
              md:py-16
            "
          >
            {/* BREADCRUMB */}

            <nav
              aria-label="Breadcrumb"
              className="
                flex
                flex-wrap
                items-center
                gap-2
                text-xs
                font-semibold
                text-slate-500
              "
            >
              <Link
                href="/"
                className="
                  transition-colors
                  hover:text-brand
                "
              >
                Home
              </Link>

              <span>
                /
              </span>

              <Link
                href="/#products"
                className="
                  transition-colors
                  hover:text-brand
                "
              >
                Products
              </Link>

              <span>
                /
              </span>

              <span
                className="
                  text-brand
                "
              >
                {
                  category.name
                }
              </span>
            </nav>

            <p
              className="
                mt-8
                text-xs
                font-extrabold
                uppercase
                tracking-[0.22em]
                text-brand
              "
            >
              GameX Pakistan
            </p>

            <h1
              className="
                mt-3
                max-w-4xl
                font-display
                text-3xl
                font-extrabold
                uppercase
                leading-tight
                text-brand-deep
                md:text-5xl
              "
            >
              {
                category.name
              }{" "}
              in Pakistan
            </h1>

            <p
              className="
                mt-5
                max-w-3xl
                text-sm
                leading-7
                text-slate-600
                md:text-base
              "
            >
              Browse GameX&apos;s selection of{" "}
              {
                category.name
              }{" "}
              in Pakistan. Compare gaming hardware,
              specifications and prices to find the right
              components for your gaming PC or custom build.
            </p>

            <div
              className="
                mt-7
                flex
                flex-wrap
                items-center
                gap-3
              "
            >
              <Link
                href="/#products"
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
                  hover:-translate-y-0.5
                  hover:bg-brand-soft
                "
              >
                <ArrowLeft className="h-4 w-4" />

                All Products
              </Link>

              <span
                className="
                  rounded-xl
                  border
                  border-brand/10
                  bg-[#fff8f8]
                  px-4
                  py-3
                  text-xs
                  font-bold
                  text-slate-600
                "
              >
                {
                  categoryProducts.length
                }{" "}

                {categoryProducts.length ===
                1
                  ? "Product"
                  : "Products"}
              </span>
            </div>
          </div>
        </section>

        {/* ===================================================
            PRODUCTS
            =================================================== */}

        <section
          className="
            mx-auto
            max-w-7xl
            px-5
            py-12
            md:px-8
            md:py-16
          "
        >
          {categoryProducts.length >
          0 ? (
            <div
              className="
                grid
                gap-5
                sm:grid-cols-2
                lg:grid-cols-3
                xl:grid-cols-4
              "
            >
              {categoryProducts.map(
                (
                  product
                ) => (
                  <article
                    key={
                      product.id
                    }
                    className="
                      group
                      flex
                      h-full
                      flex-col
                      overflow-hidden
                      rounded-2xl
                      border
                      border-black/[0.07]
                      bg-white
                      shadow-[0_18px_50px_-38px_rgba(0,0,0,0.28)]
                      transition-all
                      duration-300
                      hover:-translate-y-1
                      hover:border-brand/25
                      hover:shadow-[0_25px_60px_-38px_rgba(230,0,0,0.34)]
                    "
                  >
                    {/* IMAGE */}

                    <div
                      className="
                        relative
                        aspect-[16/10]
                        overflow-hidden
                        border-b
                        border-black/[0.05]
                        bg-[#f4f4f4]
                      "
                    >
                      <img
                        src={
                          product.image
                        }
                        alt={`${product.name} - ${category.name} at GameX Pakistan`}
                        loading="lazy"
                        className="
                          absolute
                          inset-0
                          h-full
                          w-full
                          object-cover
                          object-center
                          transition-transform
                          duration-500
                          group-hover:scale-[1.04]
                        "
                      />

                      <div
                        className="
                          absolute
                          left-3
                          top-3
                        "
                      >
                        <span
                          className="
                            inline-flex
                            rounded-full
                            border
                            border-brand/20
                            bg-white/95
                            px-3
                            py-1.5
                            text-[10px]
                            font-bold
                            uppercase
                            tracking-wider
                            text-brand
                          "
                        >
                          {
                            product.tag
                          }
                        </span>
                      </div>
                    </div>

                    {/* CONTENT */}

                    <div
                      className="
                        flex
                        flex-1
                        flex-col
                        p-5
                      "
                    >
                      <p
                        className="
                          text-[10px]
                          font-extrabold
                          uppercase
                          tracking-[0.18em]
                          text-brand
                        "
                      >
                        {
                          category.name
                        }
                      </p>

                      <h2
                        className="
                          mt-2
                          font-display
                          text-lg
                          font-extrabold
                          leading-tight
                          text-brand-deep
                        "
                      >
                        {
                          product.name
                        }
                      </h2>

                      {/* PRICE */}

                      <div
                        className="
                          mt-4
                          rounded-xl
                          bg-brand
                          px-4
                          py-3
                        "
                      >
                        <p
                          className="
                            text-[9px]
                            font-bold
                            uppercase
                            tracking-[0.2em]
                            text-white/65
                          "
                        >
                          Price
                        </p>

                        <p
                          className="
                            mt-0.5
                            font-display
                            text-xl
                            font-extrabold
                            text-white
                          "
                        >
                          {formatPrice(
                            product.price
                          )}
                        </p>
                      </div>

                      <p
                        className="
                          mt-4
                          line-clamp-3
                          text-sm
                          leading-relaxed
                          text-slate-600
                        "
                      >
                        {
                          product.description
                        }
                      </p>

                      <div
                        className="
                          mt-4
                          space-y-2
                          border-t
                          border-black/[0.06]
                          pt-4
                        "
                      >
                        {product.specs
                          .slice(
                            0,
                            4
                          )
                          .map(
                            (
                              specification,
                              index
                            ) => (
                              <div
                                key={`${product.id}-${index}`}
                                className="
                                  flex
                                  items-start
                                  gap-2
                                  text-xs
                                  text-slate-600
                                "
                              >
                                <span
                                  className="
                                    mt-0.5
                                    grid
                                    h-4
                                    w-4
                                    shrink-0
                                    place-items-center
                                    rounded-full
                                    bg-brand/[0.08]
                                    text-brand
                                  "
                                >
                                  <Check className="h-2.5 w-2.5" />
                                </span>

                                <span>
                                  {
                                    specification
                                  }
                                </span>
                              </div>
                            )
                          )}
                      </div>

                      <div
                        className="
                          mt-auto
                          grid
                          gap-2
                          pt-5
                        "
                      >
                        <Link
                          href={`/product/${product.id}`}
                          className="
                            flex
                            items-center
                            justify-center
                            rounded-xl
                            bg-brand
                            px-4
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
                          View Product
                        </Link>

                        <Link
                          href="/#contact"
                          className="
                            flex
                            items-center
                            justify-center
                            rounded-xl
                            border
                            border-brand/15
                            bg-[#fff8f8]
                            px-4
                            py-3
                            text-xs
                            font-bold
                            uppercase
                            tracking-wider
                            text-brand
                            transition-all
                            hover:border-brand
                            hover:bg-brand/[0.04]
                          "
                        >
                          Contact GameX
                        </Link>
                      </div>
                    </div>
                  </article>
                )
              )}
            </div>
          ) : (
            <div
              className="
                rounded-2xl
                border
                border-dashed
                border-brand/20
                bg-white
                px-6
                py-14
                text-center
              "
            >
              <PackageSearch
                className="
                  mx-auto
                  h-9
                  w-9
                  text-brand/60
                "
              />

              <h2
                className="
                  mt-4
                  font-display
                  text-xl
                  font-extrabold
                  uppercase
                  text-brand-deep
                "
              >
                Products Coming Soon
              </h2>

              <p
                className="
                  mx-auto
                  mt-3
                  max-w-xl
                  text-sm
                  leading-relaxed
                  text-slate-500
                "
              >
                We are currently updating our{" "}
                {
                  category.name
                }{" "}
                catalogue. Contact GameX for current stock and
                availability.
              </p>
            </div>
          )}

          {/* =================================================
              SEO SUPPORTING TEXT
              ================================================= */}

          <div
            className="
              mt-12
              rounded-2xl
              border
              border-brand/10
              bg-white
              p-6
              md:p-8
            "
          >
            <h2
              className="
                font-display
                text-xl
                font-extrabold
                uppercase
                text-brand-deep
                md:text-2xl
              "
            >
              Shop{" "}
              {
                category.name
              }{" "}
              at GameX Pakistan
            </h2>

            <p
              className="
                mt-4
                max-w-4xl
                text-sm
                leading-7
                text-slate-600
              "
            >
              GameX provides gaming PC hardware, custom gaming
              builds and PC accessories for gamers in Pakistan.
              Browse our{" "}
              {
                category.name
              }{" "}
              range and compare specifications, features and
              pricing before choosing hardware for your next
              gaming PC upgrade or custom build.
            </p>
          </div>
        </section>
      </main>
    </>
  );
}
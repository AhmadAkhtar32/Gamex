/* eslint-disable @next/next/no-img-element */

import type {
  Metadata,
} from "next";

import Link from "next/link";

import {
  and,
  eq,
} from "drizzle-orm";

import {
  ArrowLeft,
  Check,
  MessageCircle,
} from "lucide-react";

import {
  notFound,
} from "next/navigation";

import {
  db,
} from "@/db";

import {
  customBuilds,
} from "@/db/schema";

import {
  formatPrice,
} from "@/lib/price";

/* =========================================================
   SITE
   ========================================================= */

const SITE_URL =
  "https://gamex.pk";

export const dynamic =
  "force-dynamic";

/* =========================================================
   TYPES
   ========================================================= */

type BuildPageProps = {
  params: Promise<{
    buildId: string;
  }>;
};

/* =========================================================
   GET BUILD
   ========================================================= */

async function getBuild(
  buildId: string
) {
  const rows =
    await db
      .select({
        id:
          customBuilds.id,

        name:
          customBuilds.name,

        role:
          customBuilds.role,

        badge:
          customBuilds.badge,

        price:
          customBuilds.price,

        description:
          customBuilds.description,

        specs:
          customBuilds.specs,

        image:
          customBuilds.image,

        updatedAt:
          customBuilds.updatedAt,
      })
      .from(
        customBuilds
      )
      .where(
        and(
          eq(
            customBuilds.id,
            buildId
          ),

          eq(
            customBuilds.isVisible,
            true
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
}: BuildPageProps): Promise<Metadata> {
  const {
    buildId,
  } =
    await params;

  const build =
    await getBuild(
      buildId
    );

  if (
    !build
  ) {
    return {
      title:
        "Gaming PC Build Not Found",

      robots: {
        index:
          false,

        follow:
          false,
      },
    };
  }

  const title =
    `${build.name} Gaming PC Build Price in Pakistan`;

  const description =
    `${build.name} custom gaming PC build from GameX Pakistan. Check price, specifications and configuration details for this ${build.role.toLowerCase()} gaming system.`;

  const canonical =
    `/build/${build.id}`;

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
            build.image,

          alt:
            `${build.name} custom gaming PC build at GameX Pakistan`,
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
        build.image,
      ],
    },

    robots: {
      index:
        true,

      follow:
        true,

      googleBot: {
        index:
          true,

        follow:
          true,

        "max-image-preview":
          "large",
      },
    },
  };
}

/* =========================================================
   PAGE
   ========================================================= */

export default async function BuildPage({
  params,
}: BuildPageProps) {
  const {
    buildId,
  } =
    await params;

  const build =
    await getBuild(
      buildId
    );

  if (
    !build
  ) {
    notFound();
  }

  const buildUrl =
    `${SITE_URL}/build/${build.id}`;

  /* =======================================================
     PRODUCT STRUCTURED DATA
     ======================================================= */

  const productStructuredData: Record<
    string,
    unknown
  > = {
    "@context":
      "https://schema.org",

    "@type":
      "Product",

    "@id":
      `${buildUrl}#product`,

    name:
      build.name,

    url:
      buildUrl,

    image: [
      build.image,
    ],

    description:
      build.description,

    sku:
      build.id,

    category:
      "Custom Gaming PC",

    brand: {
      "@type":
        "Brand",

      name:
        "GameX",
    },
  };

  if (
    build.price !==
    null
  ) {
    productStructuredData.offers = {
      "@type":
        "Offer",

      url:
        buildUrl,

      priceCurrency:
        "PKR",

      price:
        String(
          build.price
        ),

      seller: {
        "@type":
          "Organization",

        name:
          "GameX",

        url:
          SITE_URL,
      },
    };
  }

  /* =======================================================
     BREADCRUMBS
     ======================================================= */

  const breadcrumbStructuredData = {
    "@context":
      "https://schema.org",

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
          "Custom Builds",

        item:
          `${SITE_URL}/#builds`,
      },

      {
        "@type":
          "ListItem",

        position:
          3,

        name:
          build.name,

        item:
          buildUrl,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html:
            JSON.stringify(
              productStructuredData
            ),
        }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html:
            JSON.stringify(
              breadcrumbStructuredData
            ),
        }}
      />

      <main
        className="
          min-h-screen
          bg-[#fff8f8]
        "
      >
        {/* BREADCRUMB */}

        <section
          className="
            border-b
            border-brand/10
            bg-white
          "
        >
          <div
            className="
              mx-auto
              max-w-7xl
              px-5
              py-7
              md:px-8
            "
          >
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
                href="/#builds"
                className="
                  transition-colors
                  hover:text-brand
                "
              >
                Custom Builds
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
                  build.name
                }
              </span>
            </nav>
          </div>
        </section>

        {/* MAIN */}

        <section
          className="
            mx-auto
            max-w-7xl
            px-5
            py-10
            md:px-8
            md:py-16
          "
        >
          <div
            className="
              grid
              gap-8
              lg:grid-cols-2
              lg:gap-12
            "
          >
            {/* IMAGE */}

            <div>
              <div
                className="
                  overflow-hidden
                  rounded-3xl
                  border
                  border-black/[0.07]
                  bg-white
                  p-4
                  shadow-[0_25px_70px_-45px_rgba(0,0,0,0.3)]
                "
              >
                <div
                  className="
                    relative
                    aspect-square
                    overflow-hidden
                    rounded-2xl
                    bg-[#f5f5f5]
                  "
                >
                  <img
                    src={
                      build.image
                    }
                    alt={`${build.name} custom gaming PC build at GameX Pakistan`}
                    className="
                      absolute
                      inset-0
                      h-full
                      w-full
                      object-contain
                      object-center
                    "
                  />

                  <span
                    className="
                      absolute
                      left-4
                      top-4
                      rounded-full
                      border
                      border-brand/20
                      bg-white/95
                      px-3
                      py-1.5
                      text-[10px]
                      font-extrabold
                      uppercase
                      tracking-wider
                      text-brand
                      shadow-sm
                    "
                  >
                    {
                      build.badge
                    }
                  </span>
                </div>
              </div>
            </div>

            {/* INFORMATION */}

            <div
              className="
                flex
                flex-col
                justify-center
              "
            >
              <p
                className="
                  text-xs
                  font-extrabold
                  uppercase
                  tracking-[0.22em]
                  text-brand
                "
              >
                Custom Gaming PC
              </p>

              <h1
                className="
                  mt-3
                  font-display
                  text-3xl
                  font-extrabold
                  leading-tight
                  text-brand-deep
                  md:text-5xl
                "
              >
                {
                  build.name
                }
              </h1>

              <p
                className="
                  mt-3
                  text-sm
                  font-semibold
                  text-slate-500
                "
              >
                {
                  build.role
                }
              </p>

              {/* PRICE */}

              <div
                className="
                  relative
                  mt-6
                  overflow-hidden
                  rounded-2xl
                  bg-brand
                  px-6
                  py-5
                  shadow-[0_18px_40px_-22px_rgba(230,0,0,0.65)]
                "
              >
                <p
                  className="
                    text-[10px]
                    font-extrabold
                    uppercase
                    tracking-[0.22em]
                    text-white/65
                  "
                >
                  Starting Price
                </p>

                <p
                  className="
                    mt-1
                    font-display
                    text-3xl
                    font-extrabold
                    text-white
                  "
                >
                  {formatPrice(
                    build.price
                  )}
                </p>
              </div>

              {/* DESCRIPTION */}

              <div
                className="
                  mt-6
                  border-t
                  border-black/[0.07]
                  pt-6
                "
              >
                <h2
                  className="
                    font-display
                    text-lg
                    font-extrabold
                    uppercase
                    text-brand-deep
                  "
                >
                  Build Description
                </h2>

                <p
                  className="
                    mt-3
                    text-sm
                    leading-7
                    text-slate-600
                  "
                >
                  {
                    build.description
                  }
                </p>
              </div>

              {/* BUTTONS */}

              <div
                className="
                  mt-7
                  flex
                  flex-col
                  gap-3
                  sm:flex-row
                "
              >
                <Link
                  href="/#contact"
                  className="
                    inline-flex
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
                  "
                >
                  <MessageCircle className="h-4 w-4" />

                  Contact GameX
                </Link>

                <Link
                  href="/#builds"
                  className="
                    inline-flex
                    items-center
                    justify-center
                    gap-2
                    rounded-xl
                    border
                    border-brand/20
                    bg-white
                    px-6
                    py-3.5
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
                  <ArrowLeft className="h-4 w-4" />

                  More Builds
                </Link>
              </div>
            </div>
          </div>

          {/* SPECIFICATIONS */}

          <section
            className="
              mt-12
              rounded-3xl
              border
              border-brand/10
              bg-white
              p-6
              shadow-[0_22px_60px_-48px_rgba(0,0,0,0.3)]
              md:p-8
            "
          >
            <p
              className="
                text-xs
                font-bold
                uppercase
                tracking-[0.22em]
                text-brand
              "
            >
              Configuration
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
              {
                build.name
              }{" "}
              Specifications
            </h2>

            <div
              className="
                mt-6
                grid
                gap-3
                sm:grid-cols-2
              "
            >
              {build.specs.map(
                (
                  specification,
                  index
                ) => (
                  <div
                    key={`${build.id}-${index}`}
                    className="
                      flex
                      items-start
                      gap-3
                      rounded-xl
                      border
                      border-black/[0.06]
                      bg-[#fff8f8]
                      p-4
                    "
                  >
                    <span
                      className="
                        mt-0.5
                        grid
                        h-5
                        w-5
                        shrink-0
                        place-items-center
                        rounded-full
                        bg-brand/[0.09]
                        text-brand
                      "
                    >
                      <Check className="h-3 w-3" />
                    </span>

                    <span
                      className="
                        text-sm
                        leading-relaxed
                        text-slate-600
                      "
                    >
                      {
                        specification
                      }
                    </span>
                  </div>
                )
              )}
            </div>
          </section>

          {/* SEO CONTENT */}

          <section
            className="
              mt-8
              rounded-3xl
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
              {
                build.name
              }{" "}
              Gaming PC Build in Pakistan
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
              GameX offers custom gaming PC builds in Pakistan
              for different gaming and performance needs.
              Review the full configuration, specifications
              and starting price of the{" "}
              {
                build.name
              }{" "}
              build above, then contact GameX for current
              availability, component options and
              customization details.
            </p>
          </section>
        </section>
      </main>
    </>
  );
}
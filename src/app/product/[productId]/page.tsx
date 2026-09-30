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
} from "lucide-react";

import {
  FaWhatsapp,
} from "react-icons/fa";

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

const SITE_URL =
  "https://gamex.pk";

type ProductPageProps = {
  params: Promise<{
    productId: string;
  }>;
};

async function getProduct(
  productId: string
) {
  const rows =
    await db
      .select({
        id:
          products.id,

        name:
          products.name,

        category:
          products.category,

        tag:
          products.tag,

        price:
          products.price,

        description:
          products.description,

        specs:
          products.specs,

        image:
          products.image,

        updatedAt:
          products.updatedAt,

        categoryName:
          catalogCategories.name,

        categorySlug:
          catalogCategories.slug,
      })
      .from(
        products
      )
      .leftJoin(
        catalogCategories,
        eq(
          products.category,
          catalogCategories.slug
        )
      )
      .where(
        and(
          eq(
            products.id,
            productId
          ),

          eq(
            products.isVisible,
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

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const {
    productId,
  } =
    await params;

  const product =
    await getProduct(
      productId
    );

  if (
    !product
  ) {
    return {
      title:
        "Product Not Found",

      robots: {
        index:
          false,

        follow:
          false,
      },
    };
  }

  const categoryName =
    product.categoryName ??
    "Gaming Hardware";

  const title =
    `${product.name} Price in Pakistan`;

  const description =
    `${product.name} at GameX Pakistan. Check price, specifications and details for this ${categoryName.toLowerCase()} product and contact GameX for availability.`;

  const canonical =
    `/product/${product.id}`;

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
        `${product.name} Price in Pakistan | GameX`,

      description,

      images: [
        {
          url:
            product.image,

          alt:
            `${product.name} at GameX Pakistan`,
        },
      ],
    },

    twitter: {
      card:
        "summary_large_image",

      title:
        `${product.name} Price in Pakistan | GameX`,

      description,

      images: [
        product.image,
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

export default async function ProductPage({
  params,
}: ProductPageProps) {
  const {
    productId,
  } =
    await params;

  const product =
    await getProduct(
      productId
    );

  if (
    !product
  ) {
    notFound();
  }

  const categoryName =
    product.categoryName ??
    product.category;

  const categoryUrl =
    product.categorySlug
      ? `/category/${product.categorySlug}`
      : "/#products";

  const productUrl =
    `${SITE_URL}/product/${product.id}`;

  const whatsappUrl =
    `https://wa.me/923036009123?text=${encodeURIComponent(
      `Hi GameX, I want to order ${product.name}. Product link: ${productUrl}`
    )}`;

  const productStructuredData: Record<
    string,
    unknown
  > = {
    "@context":
      "https://schema.org",

    "@type":
      "Product",

    "@id":
      `${productUrl}#product`,

    name:
      product.name,

    url:
      productUrl,

    image: [
      product.image,
    ],

    description:
      product.description,

    sku:
      product.id,

    category:
      categoryName,
  };

  if (
    product.price !==
    null
  ) {
    productStructuredData.offers = {
      "@type":
        "Offer",

      url:
        productUrl,

      priceCurrency:
        "PKR",

      price:
        String(
          product.price
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
          categoryName,

        item:
          product.categorySlug
            ? `${SITE_URL}/category/${product.categorySlug}`
            : `${SITE_URL}/#products`,
      },

      {
        "@type":
          "ListItem",

        position:
          3,

        name:
          product.name,

        item:
          productUrl,
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
                href={
                  categoryUrl
                }
                className="
                  transition-colors
                  hover:text-brand
                "
              >
                {
                  categoryName
                }
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
                  product.name
                }
              </span>
            </nav>
          </div>
        </section>

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
                      product.image
                    }
                    alt={`${product.name} - ${categoryName} at GameX Pakistan`}
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
                      product.tag
                    }
                  </span>
                </div>
              </div>
            </div>

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
                {
                  categoryName
                }
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
                  product.name
                }
              </h1>

              <p
                className="
                  mt-3
                  text-xs
                  font-bold
                  uppercase
                  tracking-wider
                  text-slate-400
                "
              >
                Price in Pakistan
              </p>

              <div
                className="
                  relative
                  mt-4
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
                  GameX Price
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
                    product.price
                  )}
                </p>
              </div>

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
                  Product Description
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
                    product.description
                  }
                </p>
              </div>

              <div
                className="
                  mt-7
                  flex
                  flex-col
                  gap-3
                  sm:flex-row
                "
              >
                <a
                  href={
                    whatsappUrl
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="
                    inline-flex
                    items-center
                    justify-center
                    gap-2
                    rounded-xl
                    bg-[#25D366]
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
                    hover:bg-[#1ebe5d]
                    hover:shadow-[0_14px_32px_-18px_rgba(37,211,102,0.8)]
                  "
                >
                  <FaWhatsapp className="h-4 w-4" />

                  Order Now
                </a>

                <Link
                  href={
                    categoryUrl
                  }
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

                  More{" "}
                  {
                    categoryName
                  }
                </Link>
              </div>
            </div>
          </div>

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
              Technical Details
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
                product.name
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
              {product.specs.map(
                (
                  specification,
                  index
                ) => (
                  <div
                    key={`${product.id}-${index}`}
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
              Buy{" "}
              {
                product.name
              }{" "}
              in Pakistan
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
              Looking for{" "}
              {
                product.name
              }{" "}
              in Pakistan? GameX provides gaming PC hardware,
              custom gaming builds and PC accessories for gaming
              setups. Review the specifications and price above,
              then use the Order Now button to contact GameX on
              WhatsApp for current availability and purchase
              information.
            </p>

            <p
              className="
                mt-4
                max-w-4xl
                text-sm
                leading-7
                text-slate-600
              "
            >
              You can also browse more{" "}
              <Link
                href={
                  categoryUrl
                }
                className="
                  font-semibold
                  text-brand
                  hover:underline
                "
              >
                {
                  categoryName
                }
              </Link>{" "}
              products and compare other gaming hardware
              available from GameX Pakistan.
            </p>
          </section>
        </section>
      </main>
    </>
  );
}
import type { Metadata } from "next";
import Link from "next/link";
import { and, asc, eq, or } from "drizzle-orm";
import { ArrowLeft, PackageSearch } from "lucide-react";
import { notFound } from "next/navigation";

import { db } from "@/db";
import { catalogCategories, products } from "@/db/schema";
import {
  catalogSubcategories,
  productSubcategoryAssignments,
} from "@/db/catalog-extensions";
import Products from "@/components/Products";

const SITE_URL = "https://gamex.pk";

export const dynamic = "force-dynamic";

type CategoryPageProps = {
  params: Promise<{ slug: string }>;
};

async function getCategory(slug: string) {
  const rows = await db
    .select({
      id: catalogCategories.id,
      name: catalogCategories.name,
      slug: catalogCategories.slug,
      updatedAt: catalogCategories.updatedAt,
    })
    .from(catalogCategories)
    .where(
      and(
        eq(catalogCategories.slug, slug),
        eq(catalogCategories.isVisible, true),
        or(
          eq(catalogCategories.appliesTo, "product"),
          eq(catalogCategories.appliesTo, "both")
        )
      )
    )
    .limit(1);

  return rows[0] ?? null;
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategory(slug);

  if (!category) {
    return {
      title: "Category Not Found",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const title = `${category.name} in Pakistan`;
  const description =
    `Shop ${category.name} in Pakistan from GameX. Explore gaming hardware, prices, specifications and performance-focused PC components for your gaming setup.`;
  const canonical = `/category/${category.slug}`;

  return {
    title,
    description,
    alternates: {
      canonical,
    },
    openGraph: {
      type: "website",
      locale: "en_PK",
      url: `${SITE_URL}${canonical}`,
      siteName: "GameX Pakistan",
      title: `${title} | GameX Pakistan`,
      description,
      images: [
        {
          url: "/icon.png",
          width: 512,
          height: 512,
          alt: `${category.name} at GameX Pakistan`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | GameX Pakistan`,
      description,
      images: ["/icon.png"],
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function CategoryPage({
  params,
}: CategoryPageProps) {
  const { slug } = await params;
  const category = await getCategory(slug);

  if (!category) notFound();

  const [
    categoryProducts,
    subcategoryRows,
    assignmentRows,
  ] = await Promise.all([
    db
      .select()
      .from(products)
      .where(
        and(
          eq(products.category, category.slug),
          eq(products.isVisible, true)
        )
      )
      .orderBy(
        asc(products.sortOrder),
        asc(products.name)
      ),

    db
      .select({
        id: catalogSubcategories.id,
        label: catalogSubcategories.name,
      })
      .from(catalogSubcategories)
      .where(
        and(
          eq(catalogSubcategories.categoryId, category.id),
          eq(catalogSubcategories.isVisible, true)
        )
      )
      .orderBy(
        asc(catalogSubcategories.sortOrder),
        asc(catalogSubcategories.name),
        asc(catalogSubcategories.id)
      ),

    db
      .select({
        productId: productSubcategoryAssignments.productId,
        subcategoryId:
          productSubcategoryAssignments.subcategoryId,
      })
      .from(productSubcategoryAssignments)
      .innerJoin(
        products,
        eq(
          products.id,
          productSubcategoryAssignments.productId
        )
      )
      .innerJoin(
        catalogSubcategories,
        eq(
          catalogSubcategories.id,
          productSubcategoryAssignments.subcategoryId
        )
      )
      .where(
        and(
          eq(products.category, category.slug),
          eq(products.isVisible, true),
          eq(catalogSubcategories.categoryId, category.id),
          eq(catalogSubcategories.isVisible, true)
        )
      ),
  ]);

  const productSubcategoryIds =
    new Map<string, Set<number>>();

  for (const assignment of assignmentRows) {
    const ids =
      productSubcategoryIds.get(assignment.productId) ??
      new Set<number>();

    ids.add(assignment.subcategoryId);
    productSubcategoryIds.set(assignment.productId, ids);
  }

  const publicProducts = categoryProducts.map((product) => ({
    ...product,
    subcategoryIds: Array.from(
      productSubcategoryIds.get(product.id) ?? []
    ),
  }));

  const publicSubcategories = subcategoryRows.map(
    (subcategory) => ({
      ...subcategory,
      category: category.slug,
    })
  );

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${SITE_URL}/category/${category.slug}#collection`,
    url: `${SITE_URL}/category/${category.slug}`,
    name: `${category.name} in Pakistan`,
    description: `Browse ${category.name} from GameX Pakistan.`,
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: categoryProducts.length,
      itemListElement: categoryProducts.map(
        (product, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: product.name,
          url: `${SITE_URL}/product/${product.id}`,
        })
      ),
    },
    isPartOf: {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
    },
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: SITE_URL,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Products",
          item: `${SITE_URL}/#products`,
        },
        {
          "@type": "ListItem",
          position: 3,
          name: category.name,
          item: `${SITE_URL}/category/${category.slug}`,
        },
      ],
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replace(
            /</g,
            "\\u003c"
          ),
        }}
      />

      <main className="min-h-screen bg-[#fff8f8]">
        <section className="relative overflow-hidden border-b border-brand/10 bg-white">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_25%,rgba(230,0,0,0.07),transparent_32%),radial-gradient(circle_at_85%_70%,rgba(230,0,0,0.04),transparent_35%)]"
          />

          <div className="relative mx-auto max-w-7xl px-5 py-10 md:px-8 md:py-14">
            <nav
              aria-label="Breadcrumb"
              className="flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-500"
            >
              <Link
                href="/"
                className="transition-colors hover:text-brand"
              >
                Home
              </Link>
              <span aria-hidden="true">/</span>
              <Link
                href="/#products"
                className="transition-colors hover:text-brand"
              >
                Products
              </Link>
              <span aria-hidden="true">/</span>
              <span
                aria-current="page"
                className="text-brand"
              >
                {category.name}
              </span>
            </nav>

            <p className="mt-7 text-xs font-extrabold uppercase tracking-[0.22em] text-brand">
              GameX Pakistan
            </p>

            <h1 className="mt-3 max-w-4xl break-words font-display text-3xl font-extrabold uppercase leading-tight text-brand-deep md:text-5xl">
              {category.name} in Pakistan
            </h1>

            <p className="mt-5 max-w-3xl text-sm leading-7 text-slate-600 md:text-base">
              Browse GameX&apos;s selection of {category.name} in
              Pakistan. Compare gaming hardware, specifications and
              prices to find the right components for your gaming PC
              or custom build.
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Link
                href="/#products"
                className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-brand px-5 py-3 text-xs font-bold uppercase tracking-wider text-white transition-all hover:-translate-y-0.5 hover:bg-brand-soft"
              >
                <ArrowLeft className="h-4 w-4" />
                All Products
              </Link>

              <span className="rounded-xl border border-brand/10 bg-[#fff8f8] px-4 py-3 text-xs font-bold text-slate-600">
                {categoryProducts.length}{" "}
                {categoryProducts.length === 1
                  ? "Product"
                  : "Products"}
              </span>
            </div>
          </div>
        </section>

        {categoryProducts.length > 0 ? (
          <div className="py-6 md:py-8">
            <Products
              key={category.slug}
              products={publicProducts}
              categories={[
                {
                  id: category.slug,
                  label: category.name,
                },
              ]}
              subcategories={publicSubcategories}
              initialCategory={category.slug}
              categoryPage
            />
          </div>
        ) : (
          <section className="mx-auto max-w-7xl px-5 py-12 md:px-8">
            <div className="rounded-2xl border border-dashed border-brand/20 bg-white px-6 py-14 text-center">
              <PackageSearch className="mx-auto h-9 w-9 text-brand/60" />

              <h2 className="mt-4 font-display text-xl font-extrabold uppercase text-brand-deep">
                Products Coming Soon
              </h2>

              <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-slate-500">
                We are currently updating our {category.name}{" "}
                catalogue. Contact GameX for current stock and
                availability.
              </p>

              <Link
                href="/#contact"
                className="mt-5 inline-flex min-h-11 items-center justify-center rounded-xl bg-brand px-5 py-3 text-sm font-semibold text-white"
              >
                Contact GameX
              </Link>
            </div>
          </section>
        )}

        <section className="mx-auto max-w-7xl px-5 pb-12 md:px-8 md:pb-16">
          <div className="rounded-2xl border border-brand/10 bg-white p-6 md:p-8">
            <h2 className="font-display text-xl font-extrabold uppercase text-brand-deep md:text-2xl">
              Shop {category.name} at GameX Pakistan
            </h2>

            <p className="mt-4 max-w-4xl text-sm leading-7 text-slate-600">
              GameX provides gaming PC hardware, custom gaming builds
              and PC accessories for gamers in Pakistan. Browse our{" "}
              {category.name} range and compare specifications,
              features and pricing before choosing hardware for your
              next gaming PC upgrade or custom build.
            </p>

            <Link
              href="/#contact"
              className="mt-5 inline-flex min-h-11 items-center justify-center rounded-xl border border-brand/15 bg-[#fff8f8] px-5 py-3 text-xs font-bold uppercase tracking-wider text-brand transition-all hover:border-brand hover:bg-brand/[0.04]"
            >
              Contact GameX
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}
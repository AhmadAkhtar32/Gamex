import type { Metadata } from "next";

import Link from "next/link";

import {
  ArrowLeft,
  Search,
} from "lucide-react";

import {
  and,
  asc,
  eq,
  ilike,
  or,
  sql,
} from "drizzle-orm";

import { db } from "@/db";

import {
  blogPosts,
  catalogCategories,
  customBuilds,
  products,
} from "@/db/schema";

import {
  catalogSubcategories,
  productSubcategoryAssignments,
} from "@/db/catalog-extensions";

import {
  SearchResults,
  type SearchResult,
} from "@/components/SearchResults";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Search",

  description:
    "Search GameX products, custom gaming builds, categories and articles.",

  robots: {
    index: false,
    follow: true,
  },
};

const pages = [
  {
    title: "Products",
    description:
      "Browse gaming hardware, PC components and accessories.",
    href: "/#products",
  },
  {
    title: "Custom Builds",
    description:
      "Explore ready-made gaming PCs and custom computers.",
    href: "/#builds",
  },
  {
    title: "Build Your Rig",
    description:
      "Choose components, configure your PC and request a quote.",
    href: "/build-your-rig",
  },
  {
    title: "Why GameX",
    description:
      "Learn about GameX features and services.",
    href: "/#features",
  },
  {
    title: "Blog",
    description:
      "Gaming news, guides and hardware articles.",
    href: "/blog",
  },
  {
    title: "Contact",
    description:
      "Contact GameX for support, inquiries and WhatsApp orders.",
    href: "/#contact",
  },
];

async function findResults(
  query: string
): Promise<SearchResult[]> {
  if (!query) return [];

  // Escape SQL LIKE wildcards so %, _ and backslashes
  // are searched literally.
  const pattern =
    `%${query.replace(/[\\%_]/g, "\\$&")}%`;

  const [
    productRows,
    buildRows,
    articleRows,
    categoryRows,
  ] = await Promise.all([
    db
      .select()
      .from(products)
      .where(
        and(
          eq(products.isVisible, true),

          or(
            ilike(products.name, pattern),

            ilike(products.description, pattern),

            ilike(products.category, pattern),

            ilike(products.tag, pattern),

            sql`
              array_to_string(${products.specs}, ' ')
              ilike ${pattern}
            `,

            sql`
              exists (
                select 1
                from ${catalogCategories}
                where
                  ${catalogCategories.slug} = ${products.category}
                  and ${catalogCategories.isVisible} = true
                  and ${catalogCategories.name} ilike ${pattern}
              )
            `,

            sql`
              exists (
                select 1
                from ${productSubcategoryAssignments}

                inner join ${catalogSubcategories}
                  on ${catalogSubcategories.id}
                    = ${productSubcategoryAssignments.subcategoryId}

                where
                  ${productSubcategoryAssignments.productId}
                    = ${products.id}

                  and ${catalogSubcategories.isVisible} = true

                  and (
                    ${catalogSubcategories.name} ilike ${pattern}
                    or ${catalogSubcategories.slug} ilike ${pattern}
                  )
              )
            `
          )
        )
      )
      .orderBy(
        asc(products.name),
        asc(products.id)
      )
      .limit(40),

    db
      .select()
      .from(customBuilds)
      .where(
        and(
          eq(customBuilds.isVisible, true),

          or(
            ilike(customBuilds.name, pattern),

            ilike(customBuilds.role, pattern),

            ilike(customBuilds.badge, pattern),

            ilike(customBuilds.description, pattern),

            ilike(customBuilds.category, pattern),

            sql`
              array_to_string(${customBuilds.specs}, ' ')
              ilike ${pattern}
            `
          )
        )
      )
      .orderBy(
        asc(customBuilds.name),
        asc(customBuilds.id)
      )
      .limit(40),

    db
      .select({
        id: blogPosts.id,

        slug: blogPosts.slug,

        title: blogPosts.title,

        excerpt: blogPosts.excerpt,

        image: blogPosts.image,
      })
      .from(blogPosts)
      .where(
        and(
          eq(blogPosts.isVisible, true),

          or(
            ilike(blogPosts.title, pattern),

            ilike(blogPosts.category, pattern),

            ilike(blogPosts.excerpt, pattern),

            ilike(blogPosts.content, pattern)
          )
        )
      )
      .orderBy(
        asc(blogPosts.title),
        asc(blogPosts.id)
      )
      .limit(40),

    db
      .select({
        id: catalogCategories.id,

        name: catalogCategories.name,

        slug: catalogCategories.slug,
      })
      .from(catalogCategories)
      .where(
        and(
          eq(catalogCategories.isVisible, true),

          or(
            ilike(catalogCategories.name, pattern),

            ilike(catalogCategories.slug, pattern)
          )
        )
      )
      .orderBy(
        asc(catalogCategories.name),
        asc(catalogCategories.id)
      )
      .limit(40),
  ]);

  const results: SearchResult[] = [
    ...productRows.map(
      (product): SearchResult => ({
        id: `product:${product.id}`,

        type: "product",

        title: product.name,

        description: product.description,

        image: product.image,

        details: {
          kind: "product",

          name: product.name,

          price: product.price,

          eyebrow:
            product.category.replace(/-/g, " "),

          badge:
            product.tag || undefined,

          description: product.description,

          specs: product.specs,

          image: product.image,

          images: product.images,
        },
      })
    ),

    ...buildRows.map(
      (build): SearchResult => ({
        id: `build:${build.id}`,

        type: "build",

        title: build.name,

        description: build.description,

        image: build.image,

        details: {
          kind: "build",

          name: build.name,

          price: build.price,

          eyebrow: "Custom Build",

          badge: build.badge,

          secondaryLabel: build.role,

          description: build.description,

          specs: build.specs,

          image: build.image,

          images: build.images,
        },
      })
    ),

    ...articleRows.map(
      (article): SearchResult => ({
        id: `article:${article.id}`,

        type: "article",

        title: article.title,

        description: article.excerpt,

        image: article.image,

        href:
          `/blog/${encodeURIComponent(article.slug)}`,
      })
    ),

    ...categoryRows.map(
      (category): SearchResult => ({
        id: `category:${category.id}`,

        type: "category",

        title: category.name,

        description:
          `Browse ${category.name} at GameX.`,

        href:
          `/category/${encodeURIComponent(category.slug)}`,
      })
    ),

    ...pages
      .filter(
        (page) =>
          `${page.title} ${page.description}`
            .toLowerCase()
            .includes(query.toLowerCase())
      )
      .map(
        (page): SearchResult => ({
          id: `page:${page.href}`,

          type: "page",

          ...page,
        })
      ),
  ];

  // Exact titles first, then title matches,
  // then matches in other content.
  const normalized = query.toLowerCase();

  const rank = (result: SearchResult) => {
    const title = result.title.toLowerCase();

    return title === normalized
      ? 0
      : title.startsWith(normalized)
        ? 1
        : title.includes(normalized)
          ? 2
          : 3;
  };

  return results.sort(
    (a, b) =>
      rank(a) - rank(b) ||
      a.title.localeCompare(
        b.title,
        "en",
        {
          numeric: true,
          sensitivity: "base",
        }
      )
  );
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string | string[];
  }>;
}) {
  const params = await searchParams;

  const raw = Array.isArray(params.q)
    ? params.q[0]
    : params.q;

  const query =
    (raw ?? "").trim().slice(0, 100);

  const results = await findResults(query);

  return (
    <main className="min-h-screen bg-slate-50 px-5 py-8 font-sans md:px-8 md:py-12">
      <div className="mx-auto max-w-7xl">
        <Link
          href="/"
          className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-red-600"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to GameX
        </Link>

        <div className="mt-6 rounded-2xl border border-red-100 bg-white p-5 shadow-sm sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-red-600">
            Explore GameX
          </p>

          <h1 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">
            Search our website
          </h1>

          <p className="mt-3 text-sm leading-6 text-slate-500">
            Products, custom builds, categories, articles and website pages.
          </p>

          <form
            key={query}
            action="/search"
            method="get"
            role="search"
            className="mt-5 flex flex-col gap-3 sm:flex-row"
          >
            <div className="relative min-w-0 flex-1">
              <label
                htmlFor="site-search-input"
                className="sr-only"
              >
                Search GameX
              </label>

              <Search className="pointer-events-none absolute left-4 top-4 h-5 w-5 text-slate-400" />

              <input
                id="site-search-input"
                name="q"
                type="search"
                required
                maxLength={100}
                defaultValue={query}
                placeholder="Search by name, brand, component or topic…"
                className="min-h-13 w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-12 pr-4 text-base text-slate-900 outline-none focus:border-red-600 focus:ring-2 focus:ring-red-100"
              />
            </div>

            <button
              type="submit"
              className="min-h-13 rounded-xl bg-red-600 px-7 py-3 text-sm font-semibold text-white hover:bg-red-700"
            >
              Search
            </button>
          </form>
        </div>

        <section
          aria-label="Search results"
          className="mt-8"
        >
          <SearchResults
            key={query}
            results={results}
            query={query}
          />

          {query && results.length > 0 && (
            <p className="mt-6 text-xs leading-5 text-slate-500">
              Up to 40 matches per content type. Use a more specific search to narrow the results.
            </p>
          )}
        </section>
      </div>
    </main>
  );
}
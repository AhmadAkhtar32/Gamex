import { NextResponse } from "next/server";
import { and, asc, eq, ilike, or, sql } from "drizzle-orm";
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
import type { SearchResult } from "@/components/SearchResults";

export const dynamic = "force-dynamic";
const headers = { "Cache-Control": "no-store" };

const pages = [
  {
    title: "Products",
    description: "Browse gaming hardware, PC components and accessories.",
    href: "/#products",
  },
  {
    title: "Custom Builds",
    description: "Explore ready-made gaming PCs and custom computers.",
    href: "/#builds",
  },
  {
    title: "Build Your Rig",
    description: "Choose components, configure your PC and request a quote.",
    href: "/build-your-rig",
  },
  {
    title: "Why GameX",
    description: "Learn about GameX features and services.",
    href: "/#features",
  },
  {
    title: "Blog",
    description: "Gaming news, guides and hardware articles.",
    href: "/blog",
  },
  {
    title: "Contact",
    description: "Contact GameX for support, inquiries and WhatsApp orders.",
    href: "/#contact",
  },
];

async function findResults(query: string): Promise<SearchResult[]> {
  if (!query) return [];

  // Search %, _ and backslashes literally rather than as LIKE wildcards.
  const pattern = `%${query.replace(/[\\%_]/g, "\\$&")}%`;

  const [productRows, buildRows, articleRows, categoryRows] =
    await Promise.all([
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
              sql`array_to_string(${products.specs}, ' ') ilike ${pattern}`,
              sql`exists (
                select 1 from ${catalogCategories}
                where ${catalogCategories.slug} = ${products.category}
                and ${catalogCategories.isVisible} = true
                and ${catalogCategories.name} ilike ${pattern}
              )`,
              sql`exists (
                select 1 from ${productSubcategoryAssignments}
                inner join ${catalogSubcategories}
                on ${catalogSubcategories.id} = ${productSubcategoryAssignments.subcategoryId}
                where ${productSubcategoryAssignments.productId} = ${products.id}
                and ${catalogSubcategories.isVisible} = true
                and (
                  ${catalogSubcategories.name} ilike ${pattern}
                  or ${catalogSubcategories.slug} ilike ${pattern}
                )
              )`
            )
          )
        )
        .orderBy(asc(products.name), asc(products.id))
        .limit(12),

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
              sql`array_to_string(${customBuilds.specs}, ' ') ilike ${pattern}`
            )
          )
        )
        .orderBy(asc(customBuilds.name), asc(customBuilds.id))
        .limit(12),

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
        .orderBy(asc(blogPosts.title), asc(blogPosts.id))
        .limit(12),

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
        .orderBy(asc(catalogCategories.name), asc(catalogCategories.id))
        .limit(12),
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
          eyebrow: product.category.replace(/-/g, " "),
          badge: product.tag || undefined,
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
        href: `/blog/${encodeURIComponent(article.slug)}`,
      })
    ),
    ...categoryRows.map(
      (category): SearchResult => ({
        id: `category:${category.id}`,
        type: "category",
        title: category.name,
        description: `Browse ${category.name} at GameX.`,
        href: `/category/${encodeURIComponent(category.slug)}`,
      })
    ),
    ...pages
      .filter((page) =>
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

  return results
    .sort(
      (a, b) =>
        rank(a) - rank(b) ||
        a.title.localeCompare(b.title, "en", {
          numeric: true,
          sensitivity: "base",
        })
    )
    .slice(0, 24);
}

export async function GET(request: Request) {
  const query = (
    new URL(request.url).searchParams.get("q") ?? ""
  )
    .trim()
    .slice(0, 100);

  if (!query) {
    return NextResponse.json({ results: [] }, { headers });
  }

  try {
    const results = await findResults(query);
    return NextResponse.json({ results }, { headers });
  } catch {
    return NextResponse.json(
      { error: "Search is temporarily unavailable. Please try again." },
      { status: 503, headers }
    );
  }
}
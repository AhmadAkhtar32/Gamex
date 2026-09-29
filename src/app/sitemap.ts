import type {
  MetadataRoute,
} from "next";

import {
  asc,
  eq,
} from "drizzle-orm";

import {
  db,
} from "@/db";

import {
  catalogCategories,
  products,
} from "@/db/schema";

const SITE_URL =
  "https://gamex.pk";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  /* =======================================================
     VISIBLE PRODUCT CATEGORIES
     ======================================================= */

  const categories =
    await db
      .select({
        slug:
          catalogCategories.slug,

        appliesTo:
          catalogCategories.appliesTo,

        updatedAt:
          catalogCategories.updatedAt,
      })
      .from(
        catalogCategories
      )
      .where(
        eq(
          catalogCategories.isVisible,
          true
        )
      )
      .orderBy(
        asc(
          catalogCategories.sortOrder
        ),

        asc(
          catalogCategories.id
        )
      );

  /* =======================================================
     VISIBLE PRODUCTS
     ======================================================= */

  const visibleProducts =
    await db
      .select({
        category:
          products.category,

        updatedAt:
          products.updatedAt,
      })
      .from(
        products
      )
      .where(
        eq(
          products.isVisible,
          true
        )
      );

  const categoriesWithProducts =
    new Set(
      visibleProducts.map(
        (
          product
        ) =>
          product.category
      )
    );

  /* =======================================================
     CATEGORY URLS
     ======================================================= */

  const categoryUrls:
    MetadataRoute.Sitemap =
    categories
      .filter(
        (
          category
        ) =>
          (
            category.appliesTo ===
              "product" ||
            category.appliesTo ===
              "both"
          ) &&
          categoriesWithProducts.has(
            category.slug
          )
      )
      .map(
        (
          category
        ) => ({
          url:
            `${SITE_URL}/category/${category.slug}`,

          lastModified:
            category.updatedAt,

          changeFrequency:
            "weekly" as const,

          priority:
            0.8,
        })
      );

  /* =======================================================
     FINAL SITEMAP
     ======================================================= */

  return [
    {
      url:
        `${SITE_URL}/`,

      changeFrequency:
        "daily",

      priority:
        1,
    },

    ...categoryUrls,
  ];
}
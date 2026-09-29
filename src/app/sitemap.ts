import type {
  MetadataRoute,
} from "next";

import {
  asc,
  desc,
  eq,
} from "drizzle-orm";

import {
  db,
} from "@/db";

import {
  blogPosts,
  catalogCategories,
  customBuilds,
  products,
} from "@/db/schema";

/* =========================================================
   SITE
   ========================================================= */

const SITE_URL =
  "https://gamex.pk";

/* =========================================================
   SITEMAP
   ========================================================= */

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  /* =======================================================
     CATEGORIES
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
     PRODUCTS
     ======================================================= */

  const visibleProducts =
    await db
      .select({
        id:
          products.id,

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
     BUILDS
     ======================================================= */

  const visibleBuilds =
    await db
      .select({
        id:
          customBuilds.id,

        updatedAt:
          customBuilds.updatedAt,
      })
      .from(
        customBuilds
      )
      .where(
        eq(
          customBuilds.isVisible,
          true
        )
      )
      .orderBy(
        asc(
          customBuilds.sortOrder
        ),

        asc(
          customBuilds.name
        )
      );

  /* =======================================================
     BLOG POSTS
     ======================================================= */

  const visibleBlogPosts =
    await db
      .select({
        slug:
          blogPosts.slug,

        publishedAt:
          blogPosts.publishedAt,

        updatedAt:
          blogPosts.updatedAt,
      })
      .from(
        blogPosts
      )
      .where(
        eq(
          blogPosts.isVisible,
          true
        )
      )
      .orderBy(
        desc(
          blogPosts.publishedAt
        )
      );

  /* =======================================================
     CATEGORY USAGE
     ======================================================= */

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
     PRODUCT URLS
     ======================================================= */

  const productUrls:
    MetadataRoute.Sitemap =
    visibleProducts.map(
      (
        product
      ) => ({
        url:
          `${SITE_URL}/product/${product.id}`,

        lastModified:
          product.updatedAt,

        changeFrequency:
          "weekly" as const,

        priority:
          0.9,
      })
    );

  /* =======================================================
     BUILD URLS
     ======================================================= */

  const buildUrls:
    MetadataRoute.Sitemap =
    visibleBuilds.map(
      (
        build
      ) => ({
        url:
          `${SITE_URL}/build/${build.id}`,

        lastModified:
          build.updatedAt,

        changeFrequency:
          "weekly" as const,

        priority:
          0.9,
      })
    );

  /* =======================================================
     BLOG URLS
     ======================================================= */

  const blogUrls:
    MetadataRoute.Sitemap =
    visibleBlogPosts.map(
      (
        post
      ) => ({
        url:
          `${SITE_URL}/blog/${post.slug}`,

        lastModified:
          post.updatedAt,

        changeFrequency:
          "monthly" as const,

        priority:
          0.7,
      })
    );

  /* =======================================================
     FINAL
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

    ...productUrls,

    ...buildUrls,

    ...blogUrls,
  ];
}
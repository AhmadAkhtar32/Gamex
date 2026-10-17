import type { MetadataRoute } from "next";
import { asc, desc, eq } from "drizzle-orm";
import { db } from "@/db";
import {
  blogPosts,
  catalogCategories,
  customBuilds,
  pcBuilderSettings,
  products,
} from "@/db/schema";
import { createProductPaths } from "@/lib/product-paths";
import { createBuildPaths } from "@/lib/build-paths";

const SITE_URL = "https://gamex.pk";
export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const categories = await db
    .select({
      slug: catalogCategories.slug,
      appliesTo: catalogCategories.appliesTo,
      updatedAt: catalogCategories.updatedAt,
    })
    .from(catalogCategories)
    .where(eq(catalogCategories.isVisible, true))
    .orderBy(
      asc(catalogCategories.sortOrder),
      asc(catalogCategories.id)
    );
  const visibleProducts = await db
    .select({
      id: products.id,
      name: products.name,
      category: products.category,
      updatedAt: products.updatedAt,
    })
    .from(products)
    .where(eq(products.isVisible, true))
    .orderBy(asc(products.sortOrder), asc(products.name));
  const visibleBuilds = await db
    .select({
      id: customBuilds.id,
      name: customBuilds.name,
      updatedAt: customBuilds.updatedAt,
    })
    .from(customBuilds)
    .where(eq(customBuilds.isVisible, true))
    .orderBy(asc(customBuilds.sortOrder), asc(customBuilds.name));
  const visibleBlogPosts = await db
    .select({
      slug: blogPosts.slug,
      publishedAt: blogPosts.publishedAt,
      updatedAt: blogPosts.updatedAt,
    })
    .from(blogPosts)
    .where(eq(blogPosts.isVisible, true))
    .orderBy(desc(blogPosts.publishedAt));
  const builderSettingsRows = await db
    .select({
      isVisible: pcBuilderSettings.isVisible,
      updatedAt: pcBuilderSettings.updatedAt,
    })
    .from(pcBuilderSettings)
    .where(eq(pcBuilderSettings.id, "main"))
    .limit(1);
  const builderSettings = builderSettingsRows[0];
  const builderIsVisible = builderSettings?.isVisible ?? true;
  const categoriesWithProducts = new Set(
    visibleProducts.map((product) => product.category)
  );
  const productPaths = createProductPaths(visibleProducts);
  const buildPaths = createBuildPaths(visibleBuilds);
  const categoryUrls: MetadataRoute.Sitemap = categories
    .filter((category) =>
      (category.appliesTo === "product" || category.appliesTo === "both") &&
      categoriesWithProducts.has(category.slug)
    )
    .map((category) => ({
      url: `${SITE_URL}/category/${category.slug}`,
      lastModified: category.updatedAt,
      changeFrequency: "weekly",
      priority: 0.8,
    }));
  const productUrls: MetadataRoute.Sitemap = visibleProducts.map(
    (product) => ({
      url: `${SITE_URL}${productPaths.get(product.id)!}`,
      lastModified: product.updatedAt,
      changeFrequency: "weekly",
      priority: 0.9,
    })
  );
  const buildUrls: MetadataRoute.Sitemap = visibleBuilds.map(
    (build) => ({
      url: `${SITE_URL}${buildPaths.get(build.id)!}`,
      lastModified: build.updatedAt,
      changeFrequency: "weekly",
      priority: 0.9,
    })
  );
  const blogPostUrls: MetadataRoute.Sitemap = visibleBlogPosts.map(
    (post) => ({
      url: `${SITE_URL}/blog/${post.slug}`,
      lastModified: post.updatedAt,
      changeFrequency: "monthly",
      priority: 0.7,
    })
  );
  const builderUrls: MetadataRoute.Sitemap = builderIsVisible
    ? [{
        url: `${SITE_URL}/build-your-rig`,
        ...(builderSettings
          ? { lastModified: builderSettings.updatedAt }
          : {}),
        changeFrequency: "weekly",
        priority: 0.9,
      }]
    : [];
  return [
    {
      url: `${SITE_URL}/`,
      changeFrequency: "daily",
      priority: 1,
    },
    ...builderUrls,
    {
      url: `${SITE_URL}/blog`,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    ...categoryUrls,
    ...productUrls,
    ...buildUrls,
    ...blogPostUrls,
  ];
}
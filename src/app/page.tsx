import { asc, eq } from "drizzle-orm";

import { db } from "@/db";
import { products as productsTable } from "@/db/schema";

import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import {
  Marquee,
  ScrollProgress,
} from "@/components/ui";
import { Stats } from "@/components/Stats";
import Products from "@/components/Products";
import { Builds } from "@/components/Builds";
import { Features } from "@/components/Features";
import { Blog } from "@/components/Blog";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";

import { getBlogPosts } from "@/lib/blog";

/*
 * Always fetch fresh database content.
 *
 * This is useful for the admin system because
 * newly added products should appear on the
 * public website without requiring a rebuild.
 */
export const dynamic = "force-dynamic";

export default async function HomePage() {
  /* =========================================================
     BLOG POSTS
     ========================================================= */

  const posts = await getBlogPosts();

  /* =========================================================
     PUBLIC PRODUCTS
     ========================================================= */

  /*
   * Only products marked as visible in the admin panel
   * are loaded onto the public website.
   *
   * Products are ordered first by sortOrder and then
   * alphabetically by name.
   */
  const databaseProducts = await db
    .select({
      id: productsTable.id,
      name: productsTable.name,
      category: productsTable.category,
      tag: productsTable.tag,
      description: productsTable.description,
      specs: productsTable.specs,
      image: productsTable.image,
    })
    .from(productsTable)
    .where(
      eq(
        productsTable.isVisible,
        true
      )
    )
    .orderBy(
      asc(productsTable.sortOrder),
      asc(productsTable.name)
    );

  /* =========================================================
     PAGE
     ========================================================= */

  return (
    <>
      <ScrollProgress />

      <Navbar />

      <main className="relative bg-white">
        <Hero />

        <Marquee />

        <Stats />

        <Products
          products={databaseProducts}
        />

        <Builds />

        <Features />

        <Marquee reverse />

        <Blog posts={posts} />

        <Contact />
      </main>

      <Footer />
    </>
  );
}
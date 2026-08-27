import {
  asc,
  eq,
} from "drizzle-orm";

import { db } from "@/db";

import {
  customBuilds as buildsTable,
  products as productsTable,
} from "@/db/schema";

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

export const dynamic =
  "force-dynamic";

export default async function HomePage() {
  /* =========================================================
     BLOG POSTS
     ========================================================= */

  const posts =
    await getBlogPosts();

  /* =========================================================
     PRODUCTS
     ========================================================= */

  const databaseProducts =
    await db
      .select({
        id: productsTable.id,
        name: productsTable.name,
        category:
          productsTable.category,
        tag: productsTable.tag,
        description:
          productsTable.description,
        specs:
          productsTable.specs,
        image:
          productsTable.image,
      })
      .from(productsTable)
      .where(
        eq(
          productsTable.isVisible,
          true
        )
      )
      .orderBy(
        asc(
          productsTable.sortOrder
        ),
        asc(productsTable.name)
      );

  /* =========================================================
     CUSTOM BUILDS
     ========================================================= */

  const databaseBuilds =
    await db
      .select({
        id: buildsTable.id,
        name: buildsTable.name,
        role: buildsTable.role,
        badge: buildsTable.badge,
        description:
          buildsTable.description,
        specs:
          buildsTable.specs,
        image:
          buildsTable.image,
      })
      .from(buildsTable)
      .where(
        eq(
          buildsTable.isVisible,
          true
        )
      )
      .orderBy(
        asc(
          buildsTable.sortOrder
        ),
        asc(buildsTable.name)
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
          products={
            databaseProducts
          }
        />

        <Builds
          builds={
            databaseBuilds
          }
        />

        <Features />

        <Marquee reverse />

        <Blog
          posts={posts}
        />

        <Contact />
      </main>

      <Footer />
    </>
  );
}
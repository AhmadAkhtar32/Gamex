import {
  asc,
  eq,
} from "drizzle-orm";

import { db } from "@/db";

import {
  customBuilds as buildsTable,
  featuresSettings as featuresSettingsTable,
  heroSettings as heroSettingsTable,
  homepageFeatures as featuresTable,
  homepageStats as statsTable,
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

import {
  DEFAULT_HERO_CONTENT,
  type HeroContent,
} from "@/lib/hero-content";

/* =========================================================
   PAGE SETTINGS
   ========================================================= */

export const dynamic =
  "force-dynamic";

/* =========================================================
   DEFAULT FEATURES SETTINGS
   ========================================================= */

/*
 * These are only used if the features_settings
 * table does not yet contain the "main" row.
 */

const DEFAULT_FEATURES_SETTINGS = {
  eyebrow: "Why Gamex",

  title: "Built Different.",

  subtitle:
    "Everything we do is focused on delivering reliable, high-performance gaming hardware with the support to match.",

  isVisible: true,
};

/* =========================================================
   HOMEPAGE
   ========================================================= */

export default async function HomePage() {
  /* =========================================================
     HERO SETTINGS
     ========================================================= */

  const heroRows =
    await db
      .select({
        id:
          heroSettingsTable.id,

        eyebrow:
          heroSettingsTable.eyebrow,

        headingLine1:
          heroSettingsTable.headingLine1,

        headingLine2:
          heroSettingsTable.headingLine2,

        rotatingWords:
          heroSettingsTable.rotatingWords,

        description:
          heroSettingsTable.description,

        primaryButtonText:
          heroSettingsTable.primaryButtonText,

        primaryButtonLink:
          heroSettingsTable.primaryButtonLink,

        secondaryButtonText:
          heroSettingsTable.secondaryButtonText,

        secondaryButtonLink:
          heroSettingsTable.secondaryButtonLink,

        trustPoint1:
          heroSettingsTable.trustPoint1,

        trustPoint2:
          heroSettingsTable.trustPoint2,

        trustPoint3:
          heroSettingsTable.trustPoint3,

        image:
          heroSettingsTable.image,

        imageAlt:
          heroSettingsTable.imageAlt,

        imageTitle:
          heroSettingsTable.imageTitle,

        imageSubtitle:
          heroSettingsTable.imageSubtitle,

        imageBadge:
          heroSettingsTable.imageBadge,

        chip1Title:
          heroSettingsTable.chip1Title,

        chip1Subtitle:
          heroSettingsTable.chip1Subtitle,

        chip2Title:
          heroSettingsTable.chip2Title,

        chip2Subtitle:
          heroSettingsTable.chip2Subtitle,

        chip3Title:
          heroSettingsTable.chip3Title,

        chip3Subtitle:
          heroSettingsTable.chip3Subtitle,

        isVisible:
          heroSettingsTable.isVisible,
      })
      .from(
        heroSettingsTable
      )
      .where(
        eq(
          heroSettingsTable.id,
          "main"
        )
      )
      .limit(1);

  const heroContent: HeroContent =
    heroRows[0] ??
    DEFAULT_HERO_CONTENT;

  /* =========================================================
     HOMEPAGE STATISTICS
     ========================================================= */

  const databaseStats =
    await db
      .select({
        id:
          statsTable.id,

        value:
          statsTable.value,

        label:
          statsTable.label,
      })
      .from(
        statsTable
      )
      .where(
        eq(
          statsTable.isVisible,
          true
        )
      )
      .orderBy(
        asc(
          statsTable.sortOrder
        ),
        asc(
          statsTable.id
        )
      );

  /* =========================================================
     FEATURES SECTION SETTINGS
     ========================================================= */

  const featuresSettingsRows =
    await db
      .select({
        eyebrow:
          featuresSettingsTable.eyebrow,

        title:
          featuresSettingsTable.title,

        subtitle:
          featuresSettingsTable.subtitle,

        isVisible:
          featuresSettingsTable.isVisible,
      })
      .from(
        featuresSettingsTable
      )
      .where(
        eq(
          featuresSettingsTable.id,
          "main"
        )
      )
      .limit(1);

  /*
   * If you have not yet pressed "Save Section"
   * inside Admin, use the default values.
   */

  const featuresContent =
    featuresSettingsRows[0] ??
    DEFAULT_FEATURES_SETTINGS;

  /* =========================================================
     FEATURE CARDS
     ========================================================= */

  const databaseFeatures =
    await db
      .select({
        id:
          featuresTable.id,

        icon:
          featuresTable.icon,

        title:
          featuresTable.title,

        description:
          featuresTable.description,
      })
      .from(
        featuresTable
      )
      .where(
        eq(
          featuresTable.isVisible,
          true
        )
      )
      .orderBy(
        asc(
          featuresTable.sortOrder
        ),
        asc(
          featuresTable.id
        )
      );

  /* =========================================================
     BLOG
     ========================================================= */

  const posts =
    await getBlogPosts();

  /* =========================================================
     PRODUCTS
     ========================================================= */

  const databaseProducts =
    await db
      .select({
        id:
          productsTable.id,

        name:
          productsTable.name,

        category:
          productsTable.category,

        tag:
          productsTable.tag,

        description:
          productsTable.description,

        specs:
          productsTable.specs,

        image:
          productsTable.image,
      })
      .from(
        productsTable
      )
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
        asc(
          productsTable.name
        )
      );

  /* =========================================================
     CUSTOM BUILDS
     ========================================================= */

  const databaseBuilds =
    await db
      .select({
        id:
          buildsTable.id,

        name:
          buildsTable.name,

        role:
          buildsTable.role,

        badge:
          buildsTable.badge,

        description:
          buildsTable.description,

        specs:
          buildsTable.specs,

        image:
          buildsTable.image,
      })
      .from(
        buildsTable
      )
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
        asc(
          buildsTable.name
        )
      );

  /* =========================================================
     PAGE
     ========================================================= */

  return (
    <>
      <ScrollProgress />

      <Navbar />

      <main className="relative bg-white">
        {/* ===================================================
            HERO
            =================================================== */}

        <Hero
          content={
            heroContent
          }
        />

        {/* ===================================================
            MARQUEE
            =================================================== */}

        <Marquee />

        {/* ===================================================
            STATS
            =================================================== */}

        <Stats
          stats={
            databaseStats
          }
        />

        {/* ===================================================
            PRODUCTS
            =================================================== */}

        <Products
          products={
            databaseProducts
          }
        />

        {/* ===================================================
            CUSTOM BUILDS
            =================================================== */}

        <Builds
          builds={
            databaseBuilds
          }
        />

        {/* ===================================================
            FEATURES / WHY GAMEX
            =================================================== */}

        <Features
          settings={
            featuresContent
          }
          features={
            databaseFeatures
          }
        />

        {/* ===================================================
            SECOND MARQUEE
            =================================================== */}

        <Marquee reverse />

        {/* ===================================================
            BLOG
            =================================================== */}

        <Blog
          posts={posts}
        />

        {/* ===================================================
            CONTACT
            =================================================== */}

        <Contact />
      </main>

      {/* =====================================================
          FOOTER
          ===================================================== */}

      <Footer />
    </>
  );
}
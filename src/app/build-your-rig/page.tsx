import type { Metadata } from "next";

import {
  asc,
  eq,
} from "drizzle-orm";

import {
  notFound,
} from "next/navigation";

import {
  db,
} from "@/db";

import {
  customBuilds,
  navbarLinks as navbarLinksTable,
  navbarSettings as navbarSettingsTable,
  pcBuilderCategories,
  pcBuilderItems,
  pcBuilderSettings,
  products,
} from "@/db/schema";

import {
  Navbar,
  DEFAULT_NAVBAR_LINKS,
  DEFAULT_NAVBAR_SETTINGS,
} from "@/components/Navbar";

import {
  ScrollProgress,
} from "@/components/ui";

import {
  PcBuilder,
} from "@/components/PcBuilder";

/* =========================================================
   CONSTANTS
   ========================================================= */

const SITE_URL =
  "https://gamex.pk";

/* =========================================================
   DYNAMIC
   ========================================================= */

export const dynamic =
  "force-dynamic";

/* =========================================================
   METADATA
   ========================================================= */

export const metadata: Metadata = {
  title:
    "Build Your Gaming PC in Pakistan | GameX",

  description:
    "Build your custom gaming PC with GameX Pakistan. Choose components, calculate your total and request a quotation on WhatsApp.",

  alternates: {
    canonical:
      "/build-your-rig",
  },
};

/* =========================================================
   DEFAULT BUILDER SETTINGS
   ========================================================= */

const DEFAULT_SETTINGS = {
  title:
    "Build Your Gaming PC",

  subtitle:
    "Choose your components, calculate your total, and send your complete build to GameX on WhatsApp.",

  readyBuildsLabel:
    "Ready Builds",

  scratchBuilderLabel:
    "Build From Scratch",

  quoteButtonText:
    "Get Quote on WhatsApp",

  whatsappNumber:
    "923036009123",

  showReadyBuilds:
    true,

  showScratchBuilder:
    true,

  isVisible:
    true,
};

/* =========================================================
   HOMEPAGE LINK
   ========================================================= */

function homepageHref(
  href: string
) {
  if (
    href.startsWith(
      "#"
    )
  ) {
    return `/${href}`;
  }

  return href;
}

/* =========================================================
   PAGE
   ========================================================= */

export default async function BuildYourRigPage() {
  const [
    navbarSettingsRows,
    databaseNavbarLinks,
    settingsRows,
    categories,
    builderItems,
    catalogProducts,
    builds,
  ] =
    await Promise.all([
      /* NAVBAR SETTINGS */

      db
        .select({
          brandText:
            navbarSettingsTable.brandText,

          brandHref:
            navbarSettingsTable.brandHref,

          logoImage:
            navbarSettingsTable.logoImage,

          logoAlt:
            navbarSettingsTable.logoAlt,

          ctaText:
            navbarSettingsTable.ctaText,

          ctaHref:
            navbarSettingsTable.ctaHref,

          ctaVisible:
            navbarSettingsTable.ctaVisible,

          isVisible:
            navbarSettingsTable.isVisible,
        })
        .from(
          navbarSettingsTable
        )
        .where(
          eq(
            navbarSettingsTable.id,
            "main"
          )
        )
        .limit(
          1
        ),

      /* NAVBAR LINKS */

      db
        .select({
          id:
            navbarLinksTable.id,

          label:
            navbarLinksTable.label,

          href:
            navbarLinksTable.href,
        })
        .from(
          navbarLinksTable
        )
        .where(
          eq(
            navbarLinksTable.isVisible,
            true
          )
        )
        .orderBy(
          asc(
            navbarLinksTable.sortOrder
          ),
          asc(
            navbarLinksTable.id
          )
        ),

      /* BUILDER SETTINGS */

      db
        .select()
        .from(
          pcBuilderSettings
        )
        .where(
          eq(
            pcBuilderSettings.id,
            "main"
          )
        )
        .limit(
          1
        ),

      /* BUILDER CATEGORIES */

      db
        .select()
        .from(
          pcBuilderCategories
        )
        .where(
          eq(
            pcBuilderCategories.isVisible,
            true
          )
        )
        .orderBy(
          asc(
            pcBuilderCategories.sortOrder
          ),
          asc(
            pcBuilderCategories.id
          )
        ),

      /* MANUALLY ADDED BUILDER ITEMS */

      db
        .select()
        .from(
          pcBuilderItems
        )
        .where(
          eq(
            pcBuilderItems.isVisible,
            true
          )
        )
        .orderBy(
          asc(
            pcBuilderItems.categoryId
          ),
          asc(
            pcBuilderItems.sortOrder
          ),
          asc(
            pcBuilderItems.id
          )
        ),

      /* NORMAL WEBSITE PRODUCTS */

      db
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
        ),

      /* READY BUILDS */

      db
        .select({
          id:
            customBuilds.id,

          name:
            customBuilds.name,

          role:
            customBuilds.role,

          badge:
            customBuilds.badge,

          price:
            customBuilds.price,

          description:
            customBuilds.description,

          specs:
            customBuilds.specs,

          image:
            customBuilds.image,
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
        ),
    ]);

  const settings =
    settingsRows[0] ??
    DEFAULT_SETTINGS;

  if (
    !settings.isVisible
  ) {
    notFound();
  }

  /* =======================================================
     NAVBAR
     ======================================================= */

  const navbarHasDatabaseSettings =
    Boolean(
      navbarSettingsRows[0]
    );

  const rawNavbarContent =
    navbarSettingsRows[0] ??
    DEFAULT_NAVBAR_SETTINGS;

  const navbarContent = {
    ...rawNavbarContent,

    brandHref:
      homepageHref(
        rawNavbarContent.brandHref
      ),

    ctaHref:
      rawNavbarContent.ctaHref ||
      "/build-your-rig",
  };

  const rawNavbarLinks =
    navbarHasDatabaseSettings
      ? databaseNavbarLinks
      : databaseNavbarLinks.length >
          0
        ? databaseNavbarLinks
        : DEFAULT_NAVBAR_LINKS;

  const publicNavbarLinks =
    rawNavbarLinks.map(
      (
        link
      ) => ({
        ...link,

        href:
          homepageHref(
            link.href
          ),
      })
    );

  /* =======================================================
     RENDER
     ======================================================= */

  return (
    <>
      <ScrollProgress />

      <Navbar
        settings={
          navbarContent
        }
        links={
          publicNavbarLinks
        }
      />

      <PcBuilder
        settings={{
          title:
            settings.title,

          subtitle:
            settings.subtitle,

          readyBuildsLabel:
            settings.readyBuildsLabel,

          scratchBuilderLabel:
            settings.scratchBuilderLabel,

          quoteButtonText:
            settings.quoteButtonText,

          whatsappNumber:
            settings.whatsappNumber,

          showReadyBuilds:
            settings.showReadyBuilds,

          showScratchBuilder:
            settings.showScratchBuilder,
        }}
        categories={
          categories.map(
            (
              category
            ) => ({
              id:
                category.id,

              name:
                category.name,

              slug:
                category.slug,

              description:
                category.description,

              helpText:
                category.helpText,

              isRequired:
                category.isRequired,
            })
          )
        }
        items={
          builderItems.map(
            (
              item
            ) => ({
              id:
                item.id,

              categoryId:
                item.categoryId,

              name:
                item.name,

              price:
                item.price,

              description:
                item.description,

              specs:
                item.specs,

              image:
                item.image,

              productUrl:
                item.productUrl,
            })
          )
        }
        products={
          catalogProducts
        }
        builds={
          builds
        }
      />
    </>
  );
}
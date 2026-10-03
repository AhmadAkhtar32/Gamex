import type {
  Metadata,
} from "next";

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
  pcBuilderCategories,
  pcBuilderItems,
  pcBuilderSettings,
} from "@/db/schema";

import {
  PcBuilder,
} from "@/components/PcBuilder";

/* =========================================================
   CONSTANTS
   ========================================================= */

const SITE_URL =
  "https://gamex.pk";

/* =========================================================
   DYNAMIC PAGE
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
    "Build your custom gaming PC with GameX Pakistan. Choose your motherboard, processor, RAM, graphics card, storage, power supply, case and accessories, see the live total and request a quotation on WhatsApp.",

  alternates: {
    canonical:
      "/build-your-rig",
  },

  openGraph: {
    type:
      "website",

    locale:
      "en_PK",

    url:
      `${SITE_URL}/build-your-rig`,

    siteName:
      "GameX Pakistan",

    title:
      "Build Your Gaming PC in Pakistan | GameX",

    description:
      "Choose your gaming PC components, calculate your build total and send the complete configuration to GameX on WhatsApp.",
  },

  twitter: {
    card:
      "summary",

    title:
      "Build Your Gaming PC in Pakistan | GameX",

    description:
      "Choose your gaming PC components, calculate your build total and request a quotation from GameX.",
  },

  robots: {
    index:
      true,

    follow:
      true,

    googleBot: {
      index:
        true,

      follow:
        true,

      "max-image-preview":
        "large",
    },
  },
};

/* =========================================================
   DEFAULT SETTINGS
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
   PAGE
   ========================================================= */

export default async function BuildYourRigPage() {
  const [
    settingsRows,
    categories,
    items,
    builds,
  ] =
    await Promise.all([
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

  return (
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
        items.map(
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
      builds={
        builds
      }
    />
  );
}
import type {
  Metadata,
} from "next";

import {
  and,
  asc,
  eq,
  or,
} from "drizzle-orm";

import {
  notFound,
} from "next/navigation";

import {
  db,
} from "@/db";

import {
  catalogCategories,
  customBuilds,
  navbarLinks as navbarLinksTable,
  navbarSettings as navbarSettingsTable,
  pcBuilderSettings,
  products,
} from "@/db/schema";

import {
  catalogSubcategories,
  pcBuilderCategorySettings,
  productSubcategoryAssignments,
} from "@/db/catalog-extensions";

import {
  Navbar,
  DEFAULT_NAVBAR_LINKS,
  DEFAULT_NAVBAR_SETTINGS,
} from "@/components/Navbar";

import {
  PcBuilder,
} from "@/components/PcBuilder";

import {
  ScrollProgress,
} from "@/components/ui";

export const dynamic =
  "force-dynamic";

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

function homepageHref(
  href: string
) {
  return href.startsWith(
    "#"
  )
    ? `/${href}`
    : href;
}

export default async function BuildYourRigPage() {
  const [
    navbarSettingsRows,
    databaseNavbarLinks,
    settingsRows,
    catalogCategoryRows,
    builderCategoryRows,
    subcategoryRows,
    assignmentRows,
    catalogProducts,
    builds,
  ] =
    await Promise.all([
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

      /*
       * IMPORTANT:
       *
       * Builder categories now come from
       * catalog_categories.
       *
       * No more pcBuilderCategories slug mismatch.
       */
      db
        .select()
        .from(
          catalogCategories
        )
        .where(
          and(
            eq(
              catalogCategories.isVisible,
              true
            ),

            or(
              eq(
                catalogCategories.appliesTo,
                "product"
              ),

              eq(
                catalogCategories.appliesTo,
                "both"
              )
            )
          )
        )
        .orderBy(
          asc(
            catalogCategories.sortOrder
          ),

          asc(
            catalogCategories.id
          )
        ),

      db
        .select()
        .from(
          pcBuilderCategorySettings
        ),

      db
        .select()
        .from(
          catalogSubcategories
        )
        .where(
          eq(
            catalogSubcategories.isVisible,
            true
          )
        )
        .orderBy(
          asc(
            catalogSubcategories.sortOrder
          ),

          asc(
            catalogSubcategories.id
          )
        ),

      db
        .select()
        .from(
          productSubcategoryAssignments
        ),

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

          sortOrder:
            products.sortOrder,
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

  const builderSettingsByCategoryId =
    new Map(
      builderCategoryRows.map(
        (
          row
        ) => [
          row.catalogCategoryId,
          row,
        ]
      )
    );

  /*
   * Main Builder categories.
   *
   * Every visible PRODUCT category automatically exists.
   *
   * Builder-specific settings are optional.
   */
  const publicCategories =
    catalogCategoryRows
      .map(
        (
          category
        ) => {
          const builderSettings =
            builderSettingsByCategoryId.get(
              category.id
            );

          return {
            id:
              category.id,

            name:
              category.name,

            slug:
              category.slug,

            description:
              builderSettings
                ?.description ||
              `Choose your ${category.name.toLowerCase()}.`,

            helpText:
              builderSettings
                ?.helpText ||
              "",

            isRequired:
              builderSettings
                ?.isRequired ??
              false,

            isVisible:
              builderSettings
                ?.isVisible ??
              true,

            sortOrder:
              builderSettings
                ?.sortOrder ??
              category.sortOrder,
          };
        }
      )
      .filter(
        (
          category
        ) =>
          category.isVisible
      )
      .sort(
        (
          a,
          b
        ) =>
          a.sortOrder -
            b.sortOrder ||
          a.id -
            b.id
      )
      .map(
        ({
          isVisible:
            _isVisible,

          sortOrder:
            _sortOrder,

          ...category
        }) =>
          category
      );

  const subcategoryById =
    new Map(
      subcategoryRows.map(
        (
          row
        ) => [
          row.id,
          row,
        ]
      )
    );

  const assignmentByProductId =
    new Map(
      assignmentRows.map(
        (
          row
        ) => [
          row.productId,
          row.subcategoryId,
        ]
      )
    );

  const publicProducts =
    catalogProducts.map(
      (
        product
      ) => {
        const subcategoryId =
          assignmentByProductId.get(
            product.id
          );

        const subcategory =
          subcategoryId
            ? subcategoryById.get(
                subcategoryId
              )
            : undefined;

        return {
          id:
            product.id,

          name:
            product.name,

          category:
            product.category,

          tag:
            product.tag,

          price:
            product.price,

          description:
            product.description,

          specs:
            product.specs,

          image:
            product.image,

          subcategoryId:
            subcategory
              ?.id ??
            null,

          subcategoryName:
            subcategory
              ?.name ??
            "",
        };
      }
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
    navbarSettingsRows[0]
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
          publicCategories
        }
        products={
          publicProducts
        }
        builds={
          builds
        }
      />
    </>
  );
}
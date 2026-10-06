"use server";

import {
  and,
  eq,
  inArray,
  or,
} from "drizzle-orm";

import {
  revalidatePath,
} from "next/cache";

import {
  redirect,
} from "next/navigation";

import {
  db,
} from "@/db";

import {
  catalogCategories,
  pcBuilderSettings,
} from "@/db/schema";

import {
  pcBuilderCategorySettings,
} from "@/db/catalog-extensions";

import {
  requireAdmin,
} from "@/lib/admin-auth";

/* =========================================================
   CONSTANTS
   ========================================================= */

const SETTINGS_ID =
  "main";

/* =========================================================
   HELPERS
   ========================================================= */

function getText(
  formData: FormData,
  name: string
) {
  return String(
    formData.get(
      name
    ) ?? ""
  ).trim();
}

function parseCategoryId(
  formData: FormData
) {
  const id =
    Number.parseInt(
      getText(
        formData,
        "catalogCategoryId"
      ),
      10
    );

  if (
    !Number.isInteger(
      id
    ) ||
    id <= 0
  ) {
    redirectBuilderError(
      "Invalid product category.",
      "builder-categories"
    );
  }

  return id;
}

function redirectBuilderError(
  message: string,
  anchor =
    "top"
): never {
  redirect(
    `/admin/pc-builder?error=${encodeURIComponent(
      message
    )}#${anchor}`
  );
}

function redirectBuilderSuccess(
  value: string,
  anchor =
    "top"
): never {
  redirect(
    `/admin/pc-builder?saved=${encodeURIComponent(
      value
    )}#${anchor}`
  );
}

function refreshBuilder() {
  revalidatePath(
    "/admin"
  );

  revalidatePath(
    "/admin/pc-builder"
  );

  revalidatePath(
    "/admin/categories"
  );

  revalidatePath(
    "/build-your-rig"
  );

  revalidatePath(
    "/"
  );
}

function normalizeWhatsAppNumber(
  value: string
) {
  return value.replace(
    /[^0-9]/g,
    ""
  );
}

/* =========================================================
   GLOBAL BUILDER SETTINGS
   ========================================================= */

export async function saveBuilderSettings(
  formData: FormData
) {
  await requireAdmin();

  const title =
    getText(
      formData,
      "title"
    );

  const subtitle =
    getText(
      formData,
      "subtitle"
    );

  const readyBuildsLabel =
    getText(
      formData,
      "readyBuildsLabel"
    );

  const scratchBuilderLabel =
    getText(
      formData,
      "scratchBuilderLabel"
    );

  const quoteButtonText =
    getText(
      formData,
      "quoteButtonText"
    );

  const whatsappNumber =
    normalizeWhatsAppNumber(
      getText(
        formData,
        "whatsappNumber"
      )
    );

  const showReadyBuilds =
    formData.get(
      "showReadyBuilds"
    ) === "on";

  const showScratchBuilder =
    formData.get(
      "showScratchBuilder"
    ) === "on";

  const isVisible =
    formData.get(
      "isVisible"
    ) === "on";

  if (!title) {
    redirectBuilderError(
      "Builder title is required."
    );
  }

  if (!subtitle) {
    redirectBuilderError(
      "Builder subtitle is required."
    );
  }

  if (
    !readyBuildsLabel ||
    !scratchBuilderLabel ||
    !quoteButtonText
  ) {
    redirectBuilderError(
      "Builder button labels are required."
    );
  }

  if (
    whatsappNumber.length <
      10 ||
    whatsappNumber.length >
      20
  ) {
    redirectBuilderError(
      "Enter a valid WhatsApp number including country code."
    );
  }

  if (
    !showReadyBuilds &&
    !showScratchBuilder
  ) {
    redirectBuilderError(
      "At least one builder mode must be enabled."
    );
  }

  await db
    .insert(
      pcBuilderSettings
    )
    .values({
      id:
        SETTINGS_ID,

      title,
      subtitle,
      readyBuildsLabel,
      scratchBuilderLabel,
      quoteButtonText,
      whatsappNumber,
      showReadyBuilds,
      showScratchBuilder,
      isVisible,
    })
    .onConflictDoUpdate({
      target:
        pcBuilderSettings.id,

      set: {
        title,
        subtitle,
        readyBuildsLabel,
        scratchBuilderLabel,
        quoteButtonText,
        whatsappNumber,
        showReadyBuilds,
        showScratchBuilder,
        isVisible,

        updatedAt:
          new Date(),
      },
    });

  refreshBuilder();

  redirectBuilderSuccess(
    "settings"
  );
}

/* =========================================================
   CATEGORY BUILDER SETTINGS

   sortOrder is NOT submitted manually anymore.
   Existing order is preserved.
   ========================================================= */

export async function saveBuilderCategorySettings(
  formData: FormData
) {
  await requireAdmin();

  const catalogCategoryId =
    parseCategoryId(
      formData
    );

  const categoryRows =
    await db
      .select({
        id:
          catalogCategories.id,

        name:
          catalogCategories.name,

        slug:
          catalogCategories.slug,

        sortOrder:
          catalogCategories.sortOrder,
      })
      .from(
        catalogCategories
      )
      .where(
        and(
          eq(
            catalogCategories.id,
            catalogCategoryId
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
      .limit(
        1
      );

  const category =
    categoryRows[0];

  if (!category) {
    redirectBuilderError(
      "This category is not available for products.",
      "builder-categories"
    );
  }

  const existingRows =
    await db
      .select({
        sortOrder:
          pcBuilderCategorySettings.sortOrder,
      })
      .from(
        pcBuilderCategorySettings
      )
      .where(
        eq(
          pcBuilderCategorySettings.catalogCategoryId,
          catalogCategoryId
        )
      )
      .limit(
        1
      );

  const existing =
    existingRows[0];

  const description =
    getText(
      formData,
      "description"
    );

  const helpText =
    getText(
      formData,
      "helpText"
    );

  const isRequired =
    formData.get(
      "isRequired"
    ) === "on";

  const isVisible =
    formData.get(
      "isVisible"
    ) === "on";

  if (
    description.length >
    3000
  ) {
    redirectBuilderError(
      "Description is too long.",
      "builder-categories"
    );
  }

  if (
    helpText.length >
    500
  ) {
    redirectBuilderError(
      "Help text is too long.",
      "builder-categories"
    );
  }

  const sortOrder =
    existing
      ?.sortOrder ??
    category.sortOrder;

  await db
    .insert(
      pcBuilderCategorySettings
    )
    .values({
      catalogCategoryId,
      description,
      helpText,
      isRequired,
      isVisible,
      sortOrder,
    })
    .onConflictDoUpdate({
      target:
        pcBuilderCategorySettings.catalogCategoryId,

      set: {
        description,
        helpText,
        isRequired,
        isVisible,

        updatedAt:
          new Date(),
      },
    });

  refreshBuilder();

  redirectBuilderSuccess(
    "category",
    "builder-categories"
  );
}

/* =========================================================
   DRAG REORDER BUILDER CATEGORIES
   ========================================================= */

export async function reorderBuilderCategories(
  categoryIds: number[]
) {
  await requireAdmin();

  if (
    !Array.isArray(
      categoryIds
    ) ||
    categoryIds.length ===
      0
  ) {
    return {
      success:
        true,
    };
  }

  const uniqueIds =
    Array.from(
      new Set(
        categoryIds
      )
    );

  if (
    uniqueIds.length !==
      categoryIds.length ||
    uniqueIds.some(
      (id) =>
        !Number.isInteger(
          id
        ) ||
        id <= 0
    )
  ) {
    throw new Error(
      "Invalid Builder category order."
    );
  }

  const validCategories =
    await db
      .select({
        id:
          catalogCategories.id,
      })
      .from(
        catalogCategories
      )
      .where(
        and(
          inArray(
            catalogCategories.id,
            uniqueIds
          ),

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
      );

  if (
    validCategories.length !==
    uniqueIds.length
  ) {
    throw new Error(
      "One or more Builder categories are invalid."
    );
  }

  await db.transaction(
    async (tx) => {
      for (
        let index = 0;
        index <
        categoryIds.length;
        index += 1
      ) {
        const categoryId =
          categoryIds[
            index
          ];

        await tx
          .insert(
            pcBuilderCategorySettings
          )
          .values({
            catalogCategoryId:
              categoryId,

            sortOrder:
              index,
          })
          .onConflictDoUpdate({
            target:
              pcBuilderCategorySettings.catalogCategoryId,

            set: {
              sortOrder:
                index,

              updatedAt:
                new Date(),
            },
          });
      }
    }
  );

  refreshBuilder();

  return {
    success:
      true,
  };
}
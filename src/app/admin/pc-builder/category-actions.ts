"use server";

import {
  eq,
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
} from "@/db/schema";

import {
  builderCategorySettings,
} from "@/db/builder-schema";

import {
  requireAdmin,
} from "@/lib/admin-auth";

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

function redirectError(
  message: string
): never {
  redirect(
    `/admin/pc-builder?error=${encodeURIComponent(
      message
    )}#builder-categories`
  );
}

export async function saveBuilderCategorySettings(
  formData: FormData
) {
  await requireAdmin();

  const categorySlug =
    getText(
      formData,
      "categorySlug"
    );

  const helpText =
    getText(
      formData,
      "helpText"
    );

  const isVisible =
    formData.get(
      "isVisible"
    ) === "on";

  const isRequired =
    formData.get(
      "isRequired"
    ) === "on";

  if (
    !categorySlug
  ) {
    redirectError(
      "Category is required."
    );
  }

  if (
    helpText.length >
    500
  ) {
    redirectError(
      "Builder help text must be 500 characters or less."
    );
  }

  const categoryRows =
    await db
      .select({
        slug:
          catalogCategories.slug,

        appliesTo:
          catalogCategories.appliesTo,
      })
      .from(
        catalogCategories
      )
      .where(
        eq(
          catalogCategories.slug,
          categorySlug
        )
      )
      .limit(
        1
      );

  const category =
    categoryRows[0];

  if (
    !category ||
    (
      category.appliesTo !==
        "product" &&
      category.appliesTo !==
        "both"
    )
  ) {
    redirectError(
      "This category is not available for Products."
    );
  }

  await db
    .insert(
      builderCategorySettings
    )
    .values({
      categorySlug,

      isVisible,

      isRequired,

      helpText,
    })
    .onConflictDoUpdate({
      target:
        builderCategorySettings.categorySlug,

      set: {
        isVisible,

        isRequired,

        helpText,

        updatedAt:
          new Date(),
      },
    });

  revalidatePath(
    "/admin/pc-builder"
  );

  revalidatePath(
    "/build-your-rig"
  );

  redirect(
    "/admin/pc-builder?saved=Category%20settings%20saved.#builder-categories"
  );
}
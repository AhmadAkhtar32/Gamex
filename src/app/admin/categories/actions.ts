"use server";

import {
  count,
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
  customBuilds,
  products,
} from "@/db/schema";

import {
  requireAdmin,
} from "@/lib/admin-auth";

/* =========================================================
   TYPES
   ========================================================= */

type CategoryTarget =
  | "product"
  | "build"
  | "both";

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

/* =========================================================
   REDIRECT ERROR
   ========================================================= */

function redirectCategoryError(
  message: string
): never {
  redirect(
    `/admin/categories?error=${encodeURIComponent(
      message
    )}`
  );
}

/* =========================================================
   SLUGIFY
   ========================================================= */

function slugify(
  value: string
) {
  return value
    .trim()
    .toLowerCase()
    .replace(
      /[^a-z0-9]+/g,
      "-"
    )
    .replace(
      /^-+|-+$/g,
      ""
    );
}

/* =========================================================
   VALID TARGET
   ========================================================= */

function isValidTarget(
  value: string
): value is CategoryTarget {
  return (
    value ===
      "product" ||
    value ===
      "build" ||
    value ===
      "both"
  );
}

/* =========================================================
   PARSE ID
   ========================================================= */

function parseCategoryId(
  formData: FormData
) {
  const raw =
    getText(
      formData,
      "categoryId"
    );

  const id =
    Number.parseInt(
      raw,
      10
    );

  if (
    !Number.isInteger(
      id
    ) ||
    id <= 0
  ) {
    redirectCategoryError(
      "Invalid category."
    );
  }

  return id;
}

/* =========================================================
   PARSE SORT ORDER
   ========================================================= */

function parseSortOrder(
  formData: FormData
) {
  const raw =
    getText(
      formData,
      "sortOrder"
    ) || "0";

  const value =
    Number.parseInt(
      raw,
      10
    );

  if (
    !Number.isInteger(
      value
    ) ||
    value < 0 ||
    value > 9999
  ) {
    redirectCategoryError(
      "Display order must be between 0 and 9999."
    );
  }

  return value;
}

/* =========================================================
   REFRESH
   ========================================================= */

function refreshCategories() {
  revalidatePath(
    "/admin"
  );

  revalidatePath(
    "/admin/categories"
  );

  revalidatePath(
    "/admin/products"
  );

  revalidatePath(
    "/admin/products/new"
  );

  revalidatePath(
    "/admin/builds"
  );

  revalidatePath(
    "/admin/builds/new"
  );

  revalidatePath(
    "/"
  );
}

/* =========================================================
   CHECK CATEGORY USAGE
   ========================================================= */

async function getCategoryUsage(
  slug: string
) {
  const [
    productResult,
    buildResult,
  ] =
    await Promise.all([
      db
        .select({
          total:
            count(),
        })
        .from(
          products
        )
        .where(
          eq(
            products.category,
            slug
          )
        ),

      db
        .select({
          total:
            count(),
        })
        .from(
          customBuilds
        )
        .where(
          eq(
            customBuilds.category,
            slug
          )
        ),
    ]);

  return {
    products:
      Number(
        productResult[0]
          ?.total ??
          0
      ),

    builds:
      Number(
        buildResult[0]
          ?.total ??
          0
      ),
  };
}

/* =========================================================
   CREATE CATEGORY
   ========================================================= */

export async function createCategory(
  formData: FormData
) {
  await requireAdmin();

  const name =
    getText(
      formData,
      "name"
    );

  const rawSlug =
    getText(
      formData,
      "slug"
    );

  const slug =
    slugify(
      rawSlug ||
        name
    );

  const appliesTo =
    getText(
      formData,
      "appliesTo"
    );

  const sortOrder =
    parseSortOrder(
      formData
    );

  const isVisible =
    formData.get(
      "isVisible"
    ) === "on";

  /* =======================================================
     VALIDATION
     ======================================================= */

  if (
    !name
  ) {
    redirectCategoryError(
      "Category name is required."
    );
  }

  if (
    name.length >
    120
  ) {
    redirectCategoryError(
      "Category name is too long."
    );
  }

  if (
    !slug
  ) {
    redirectCategoryError(
      "Category slug is required."
    );
  }

  if (
    slug.length >
    120
  ) {
    redirectCategoryError(
      "Category slug is too long."
    );
  }

  if (
    !isValidTarget(
      appliesTo
    )
  ) {
    redirectCategoryError(
      "Choose where this category should be available."
    );
  }

  /* =======================================================
     UNIQUE SLUG
     ======================================================= */

  const existing =
    await db
      .select({
        id:
          catalogCategories.id,
      })
      .from(
        catalogCategories
      )
      .where(
        eq(
          catalogCategories.slug,
          slug
        )
      )
      .limit(
        1
      );

  if (
    existing.length >
    0
  ) {
    redirectCategoryError(
      `A category with the slug "${slug}" already exists.`
    );
  }

  /* =======================================================
     SAVE
     ======================================================= */

  await db
    .insert(
      catalogCategories
    )
    .values({
      name,

      slug,

      appliesTo,

      sortOrder,

      isVisible,

      isSystem:
        false,
    });

  refreshCategories();

  redirect(
    "/admin/categories?created=1"
  );
}

/* =========================================================
   UPDATE CATEGORY
   ========================================================= */

export async function updateCategory(
  formData: FormData
) {
  await requireAdmin();

  const categoryId =
    parseCategoryId(
      formData
    );

  /* =======================================================
     CURRENT CATEGORY
     ======================================================= */

  const currentRows =
    await db
      .select()
      .from(
        catalogCategories
      )
      .where(
        eq(
          catalogCategories.id,
          categoryId
        )
      )
      .limit(
        1
      );

  const current =
    currentRows[0];

  if (
    !current
  ) {
    redirectCategoryError(
      "Category could not be found."
    );
  }

  /* =======================================================
     READ FORM
     ======================================================= */

  const name =
    getText(
      formData,
      "name"
    );

  const rawSlug =
    getText(
      formData,
      "slug"
    );

  const slug =
    slugify(
      rawSlug ||
        name
    );

  const appliesTo =
    getText(
      formData,
      "appliesTo"
    );

  const sortOrder =
    parseSortOrder(
      formData
    );

  const isVisible =
    formData.get(
      "isVisible"
    ) === "on";

  /* =======================================================
     VALIDATION
     ======================================================= */

  if (
    !name
  ) {
    redirectCategoryError(
      "Category name is required."
    );
  }

  if (
    name.length >
    120
  ) {
    redirectCategoryError(
      "Category name is too long."
    );
  }

  if (
    !slug ||
    slug.length >
      120
  ) {
    redirectCategoryError(
      "Please enter a valid category slug."
    );
  }

  if (
    !isValidTarget(
      appliesTo
    )
  ) {
    redirectCategoryError(
      "Choose where this category should be available."
    );
  }

  /* =======================================================
     DUPLICATE SLUG
     ======================================================= */

  const duplicateRows =
    await db
      .select({
        id:
          catalogCategories.id,
      })
      .from(
        catalogCategories
      )
      .where(
        eq(
          catalogCategories.slug,
          slug
        )
      )
      .limit(
        1
      );

  const duplicate =
    duplicateRows[0];

  if (
    duplicate &&
    duplicate.id !==
      categoryId
  ) {
    redirectCategoryError(
      `Another category already uses the slug "${slug}".`
    );
  }

  /* =======================================================
     CHECK CURRENT USAGE
     ======================================================= */

  const usage =
    await getCategoryUsage(
      current.slug
    );

  if (
    appliesTo ===
      "build" &&
    usage.products >
      0
  ) {
    redirectCategoryError(
      `This category is currently used by ${usage.products} product(s). Change those products first before making it Build-only.`
    );
  }

  if (
    appliesTo ===
      "product" &&
    usage.builds >
      0
  ) {
    redirectCategoryError(
      `This category is currently used by ${usage.builds} build(s). Change those builds first before making it Product-only.`
    );
  }

  /* =======================================================
     UPDATE

     If slug changes, update Products and Builds too.
     ======================================================= */

  await db.transaction(
    async (
      tx
    ) => {
      if (
        slug !==
        current.slug
      ) {
        await tx
          .update(
            products
          )
          .set({
            category:
              slug,

            updatedAt:
              new Date(),
          })
          .where(
            eq(
              products.category,
              current.slug
            )
          );

        await tx
          .update(
            customBuilds
          )
          .set({
            category:
              slug,

            updatedAt:
              new Date(),
          })
          .where(
            eq(
              customBuilds.category,
              current.slug
            )
          );
      }

      await tx
        .update(
          catalogCategories
        )
        .set({
          name,

          slug,

          appliesTo,

          sortOrder,

          isVisible,

          updatedAt:
            new Date(),
        })
        .where(
          eq(
            catalogCategories.id,
            categoryId
          )
        );
    }
  );

  refreshCategories();

  redirect(
    "/admin/categories?updated=1"
  );
}

/* =========================================================
   TOGGLE CATEGORY VISIBILITY
   ========================================================= */

export async function toggleCategoryVisibility(
  formData: FormData
) {
  await requireAdmin();

  const categoryId =
    parseCategoryId(
      formData
    );

  const rows =
    await db
      .select()
      .from(
        catalogCategories
      )
      .where(
        eq(
          catalogCategories.id,
          categoryId
        )
      )
      .limit(
        1
      );

  const category =
    rows[0];

  if (
    !category
  ) {
    redirectCategoryError(
      "Category could not be found."
    );
  }

  await db
    .update(
      catalogCategories
    )
    .set({
      isVisible:
        !category.isVisible,

      updatedAt:
        new Date(),
    })
    .where(
      eq(
        catalogCategories.id,
        categoryId
      )
    );

  refreshCategories();

  redirect(
    "/admin/categories?visibility=1"
  );
}

/* =========================================================
   DELETE CATEGORY
   ========================================================= */

export async function deleteCategory(
  formData: FormData
) {
  await requireAdmin();

  const categoryId =
    parseCategoryId(
      formData
    );

  const rows =
    await db
      .select()
      .from(
        catalogCategories
      )
      .where(
        eq(
          catalogCategories.id,
          categoryId
        )
      )
      .limit(
        1
      );

  const category =
    rows[0];

  if (
    !category
  ) {
    redirectCategoryError(
      "Category could not be found."
    );
  }

  /* =======================================================
     PREVENT DELETING USED CATEGORY
     ======================================================= */

  const usage =
    await getCategoryUsage(
      category.slug
    );

  if (
    usage.products >
      0 ||
    usage.builds >
      0
  ) {
    redirectCategoryError(
      `"${category.name}" cannot be deleted because it is currently used by ${usage.products} product(s) and ${usage.builds} build(s). Change those items to another category first.`
    );
  }

  await db
    .delete(
      catalogCategories
    )
    .where(
      eq(
        catalogCategories.id,
        categoryId
      )
    );

  refreshCategories();

  redirect(
    "/admin/categories?deleted=1"
  );
}
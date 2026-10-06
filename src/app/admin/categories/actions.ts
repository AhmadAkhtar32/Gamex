"use server";

import {
  count,
  eq,
  inArray,
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
  catalogSubcategories,
  productSubcategoryAssignments,
} from "@/db/catalog-extensions";

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
   BASIC HELPERS
   ========================================================= */

function getText(
  formData: FormData,
  name: string
) {
  return String(
    formData.get(name) ?? ""
  ).trim();
}

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
    )
    .slice(
      0,
      120
    );
}

function isValidTarget(
  value: string
): value is CategoryTarget {
  return (
    value === "product" ||
    value === "build" ||
    value === "both"
  );
}

function parseId(
  formData: FormData,
  field: string,
  label: string
) {
  const value =
    Number.parseInt(
      getText(
        formData,
        field
      ),
      10
    );

  if (
    !Number.isInteger(
      value
    ) ||
    value <= 0
  ) {
    redirectCategoryError(
      `Invalid ${label}.`
    );
  }

  return value;
}

/* =========================================================
   REDIRECT HELPERS
   ========================================================= */

function redirectCategoryError(
  message: string,
  anchor = "top"
): never {
  redirect(
    `/admin/categories?error=${encodeURIComponent(
      message
    )}#${anchor}`
  );
}

function redirectCategorySuccess(
  value: string,
  anchor = "top"
): never {
  redirect(
    `/admin/categories?${value}=1#${anchor}`
  );
}

/* =========================================================
   REVALIDATION
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
    "/admin/pc-builder"
  );

  revalidatePath(
    "/build-your-rig"
  );

  revalidatePath(
    "/"
  );
}

/* =========================================================
   ORDER HELPERS
   ========================================================= */

async function getNextCategoryOrder() {
  const rows =
    await db
      .select({
        sortOrder:
          catalogCategories.sortOrder,
      })
      .from(
        catalogCategories
      );

  if (
    rows.length === 0
  ) {
    return 0;
  }

  return (
    Math.max(
      ...rows.map(
        (row) =>
          row.sortOrder
      )
    ) + 1
  );
}

async function getNextSubcategoryOrder(
  categoryId: number
) {
  const rows =
    await db
      .select({
        sortOrder:
          catalogSubcategories.sortOrder,
      })
      .from(
        catalogSubcategories
      )
      .where(
        eq(
          catalogSubcategories.categoryId,
          categoryId
        )
      );

  if (
    rows.length === 0
  ) {
    return 0;
  }

  return (
    Math.max(
      ...rows.map(
        (row) =>
          row.sortOrder
      )
    ) + 1
  );
}

/* =========================================================
   CATEGORY USAGE
   ========================================================= */

async function categoryUsage(
  slug: string
) {
  const [
    productRows,
    buildRows,
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
        productRows[0]
          ?.total ??
          0
      ),

    builds:
      Number(
        buildRows[0]
          ?.total ??
          0
      ),
  };
}

/* =========================================================
   CATEGORY HELPERS
   ========================================================= */

async function findCategoryById(
  id: number
) {
  const rows =
    await db
      .select()
      .from(
        catalogCategories
      )
      .where(
        eq(
          catalogCategories.id,
          id
        )
      )
      .limit(
        1
      );

  return rows[0];
}

async function ensureUniqueCategorySlug(
  slug: string,
  currentId?: number
) {
  const rows =
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
    rows[0] &&
    rows[0].id !==
      currentId
  ) {
    redirectCategoryError(
      "Another category already uses this slug."
    );
  }
}

async function validateCategoryTargetChange({
  currentSlug,
  nextTarget,
}: {
  currentSlug: string;
  nextTarget: CategoryTarget;
}) {
  const usage =
    await categoryUsage(
      currentSlug
    );

  if (
    usage.products >
      0 &&
    nextTarget ===
      "build"
  ) {
    redirectCategoryError(
      "This category is used by products, so it cannot be changed to Builds only."
    );
  }

  if (
    usage.builds >
      0 &&
    nextTarget ===
      "product"
  ) {
    redirectCategoryError(
      "This category is used by custom builds, so it cannot be changed to Products only."
    );
  }
}

/* =========================================================
   CREATE CATEGORY

   New categories are automatically appended to the end.
   No manual order number is required.
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

  const appliesTo =
    getText(
      formData,
      "appliesTo"
    );

  const isVisible =
    formData.get(
      "isVisible"
    ) === "on";

  if (!name) {
    redirectCategoryError(
      "Category name is required."
    );
  }

  if (
    !isValidTarget(
      appliesTo
    )
  ) {
    redirectCategoryError(
      "Please choose where this category is available."
    );
  }

  const slug =
    slugify(
      rawSlug ||
        name
    );

  if (!slug) {
    redirectCategoryError(
      "Category slug is invalid."
    );
  }

  await ensureUniqueCategorySlug(
    slug
  );

  const sortOrder =
    await getNextCategoryOrder();

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

  redirectCategorySuccess(
    "created"
  );
}

/* =========================================================
   UPDATE CATEGORY

   sortOrder is intentionally NOT changed here.
   Drag-and-drop controls the order.
   ========================================================= */

export async function updateCategory(
  formData: FormData
) {
  await requireAdmin();

  const categoryId =
    parseId(
      formData,
      "categoryId",
      "category"
    );

  const category =
    await findCategoryById(
      categoryId
    );

  if (!category) {
    redirectCategoryError(
      "Category could not be found."
    );
  }

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

  const appliesTo =
    getText(
      formData,
      "appliesTo"
    );

  const isVisible =
    formData.get(
      "isVisible"
    ) === "on";

  if (!name) {
    redirectCategoryError(
      "Category name is required."
    );
  }

  if (
    !isValidTarget(
      appliesTo
    )
  ) {
    redirectCategoryError(
      "Please choose where this category is available."
    );
  }

  const slug =
    slugify(
      rawSlug ||
        name
    );

  if (!slug) {
    redirectCategoryError(
      "Category slug is invalid."
    );
  }

  if (
    category.isSystem &&
    slug !==
      category.slug
  ) {
    redirectCategoryError(
      "The system category slug cannot be changed."
    );
  }

  await ensureUniqueCategorySlug(
    slug,
    categoryId
  );

  await validateCategoryTargetChange({
    currentSlug:
      category.slug,

    nextTarget:
      appliesTo,
  });

  await db.transaction(
    async (tx) => {
      if (
        slug !==
        category.slug
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
              category.slug
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
              category.slug
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

          isVisible:
            category.isSystem
              ? true
              : isVisible,

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

  redirectCategorySuccess(
    "updated"
  );
}

/* =========================================================
   DRAG REORDER MAIN CATEGORIES
   ========================================================= */

export async function reorderCategories(
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
      "Invalid category order."
    );
  }

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
        inArray(
          catalogCategories.id,
          uniqueIds
        )
      );

  if (
    existing.length !==
    uniqueIds.length
  ) {
    throw new Error(
      "One or more categories could not be found."
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
        await tx
          .update(
            catalogCategories
          )
          .set({
            sortOrder:
              index,

            updatedAt:
              new Date(),
          })
          .where(
            eq(
              catalogCategories.id,
              categoryIds[
                index
              ]
            )
          );
      }
    }
  );

  refreshCategories();

  return {
    success:
      true,
  };
}

/* =========================================================
   TOGGLE CATEGORY
   ========================================================= */

export async function toggleCategoryVisibility(
  formData: FormData
) {
  await requireAdmin();

  const categoryId =
    parseId(
      formData,
      "categoryId",
      "category"
    );

  const category =
    await findCategoryById(
      categoryId
    );

  if (!category) {
    redirectCategoryError(
      "Category could not be found."
    );
  }

  if (
    category.isSystem
  ) {
    redirectCategoryError(
      "The system category must remain visible."
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

  redirectCategorySuccess(
    "visibility"
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
    parseId(
      formData,
      "categoryId",
      "category"
    );

  const category =
    await findCategoryById(
      categoryId
    );

  if (!category) {
    redirectCategoryError(
      "Category could not be found."
    );
  }

  if (
    category.isSystem
  ) {
    redirectCategoryError(
      "The system category cannot be deleted."
    );
  }

  const usage =
    await categoryUsage(
      category.slug
    );

  if (
    usage.products >
      0 ||
    usage.builds >
      0
  ) {
    redirectCategoryError(
      `This category is still used by ${usage.products} product(s) and ${usage.builds} build(s). Move those records first.`
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

  redirectCategorySuccess(
    "deleted"
  );
}

/* =========================================================
   SUBCATEGORY HELPERS
   ========================================================= */

async function findSubcategoryById(
  id: number
) {
  const rows =
    await db
      .select()
      .from(
        catalogSubcategories
      )
      .where(
        eq(
          catalogSubcategories.id,
          id
        )
      )
      .limit(
        1
      );

  return rows[0];
}

async function ensureUniqueSubcategorySlug({
  categoryId,
  slug,
  currentId,
}: {
  categoryId: number;
  slug: string;
  currentId?: number;
}) {
  const rows =
    await db
      .select({
        id:
          catalogSubcategories.id,

        categoryId:
          catalogSubcategories.categoryId,

        slug:
          catalogSubcategories.slug,
      })
      .from(
        catalogSubcategories
      );

  const duplicate =
    rows.find(
      (row) =>
        row.categoryId ===
          categoryId &&
        row.slug ===
          slug &&
        row.id !==
          currentId
    );

  if (duplicate) {
    redirectCategoryError(
      "This category already has a subcategory with that slug.",
      "subcategories"
    );
  }
}

/* =========================================================
   CREATE SUBCATEGORY

   Automatically appended to the end of its parent.
   ========================================================= */

export async function createSubcategory(
  formData: FormData
) {
  await requireAdmin();

  const categoryId =
    parseId(
      formData,
      "categoryId",
      "parent category"
    );

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

  const isVisible =
    formData.get(
      "isVisible"
    ) === "on";

  const parent =
    await findCategoryById(
      categoryId
    );

  if (!parent) {
    redirectCategoryError(
      "Parent category could not be found.",
      "subcategories"
    );
  }

  if (
    parent.appliesTo !==
      "product" &&
    parent.appliesTo !==
      "both"
  ) {
    redirectCategoryError(
      "Subcategories can only be added under a Product or Products + Builds category.",
      "subcategories"
    );
  }

  if (!name) {
    redirectCategoryError(
      "Subcategory name is required.",
      "subcategories"
    );
  }

  const slug =
    slugify(
      rawSlug ||
        name
    );

  if (!slug) {
    redirectCategoryError(
      "Subcategory slug is invalid.",
      "subcategories"
    );
  }

  await ensureUniqueSubcategorySlug({
    categoryId,
    slug,
  });

  const sortOrder =
    await getNextSubcategoryOrder(
      categoryId
    );

  await db
    .insert(
      catalogSubcategories
    )
    .values({
      categoryId,
      name,
      slug,
      sortOrder,
      isVisible,
    });

  refreshCategories();

  redirectCategorySuccess(
    "subcategoryCreated",
    "subcategories"
  );
}

/* =========================================================
   UPDATE SUBCATEGORY

   Existing order is preserved.
   Moving to another parent places it at the end.
   ========================================================= */

export async function updateSubcategory(
  formData: FormData
) {
  await requireAdmin();

  const subcategoryId =
    parseId(
      formData,
      "subcategoryId",
      "subcategory"
    );

  const categoryId =
    parseId(
      formData,
      "categoryId",
      "parent category"
    );

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

  const isVisible =
    formData.get(
      "isVisible"
    ) === "on";

  const [
    subcategory,
    parent,
  ] =
    await Promise.all([
      findSubcategoryById(
        subcategoryId
      ),

      findCategoryById(
        categoryId
      ),
    ]);

  if (
    !subcategory ||
    !parent
  ) {
    redirectCategoryError(
      "Subcategory or parent category could not be found.",
      "subcategories"
    );
  }

  if (
    parent.appliesTo !==
      "product" &&
    parent.appliesTo !==
      "both"
  ) {
    redirectCategoryError(
      "Subcategories can only be placed under a Product or Products + Builds category.",
      "subcategories"
    );
  }

  if (!name) {
    redirectCategoryError(
      "Subcategory name is required.",
      "subcategories"
    );
  }

  const slug =
    slugify(
      rawSlug ||
        name
    );

  if (!slug) {
    redirectCategoryError(
      "Subcategory slug is invalid.",
      "subcategories"
    );
  }

  await ensureUniqueSubcategorySlug({
    categoryId,
    slug,

    currentId:
      subcategoryId,
  });

  const movingParent =
    subcategory.categoryId !==
    categoryId;

  const sortOrder =
    movingParent
      ? await getNextSubcategoryOrder(
          categoryId
        )
      : subcategory.sortOrder;

  await db.transaction(
    async (tx) => {
      if (
        movingParent
      ) {
        const assignedProducts =
          await tx
            .select({
              productId:
                productSubcategoryAssignments.productId,
            })
            .from(
              productSubcategoryAssignments
            )
            .where(
              eq(
                productSubcategoryAssignments.subcategoryId,
                subcategoryId
              )
            );

        const productIds =
          assignedProducts.map(
            (row) =>
              row.productId
          );

        if (
          productIds.length >
          0
        ) {
          await tx
            .update(
              products
            )
            .set({
              category:
                parent.slug,

              updatedAt:
                new Date(),
            })
            .where(
              inArray(
                products.id,
                productIds
              )
            );
        }
      }

      await tx
        .update(
          catalogSubcategories
        )
        .set({
          categoryId,
          name,
          slug,
          sortOrder,
          isVisible,

          updatedAt:
            new Date(),
        })
        .where(
          eq(
            catalogSubcategories.id,
            subcategoryId
          )
        );
    }
  );

  refreshCategories();

  redirectCategorySuccess(
    "subcategoryUpdated",
    "subcategories"
  );
}

/* =========================================================
   DRAG REORDER SUBCATEGORIES

   Reordering is restricted to one parent category.
   ========================================================= */

export async function reorderSubcategories(
  categoryId: number,
  subcategoryIds: number[]
) {
  await requireAdmin();

  if (
    !Number.isInteger(
      categoryId
    ) ||
    categoryId <=
      0
  ) {
    throw new Error(
      "Invalid parent category."
    );
  }

  if (
    !Array.isArray(
      subcategoryIds
    ) ||
    subcategoryIds.length ===
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
        subcategoryIds
      )
    );

  if (
    uniqueIds.length !==
      subcategoryIds.length ||
    uniqueIds.some(
      (id) =>
        !Number.isInteger(
          id
        ) ||
        id <= 0
    )
  ) {
    throw new Error(
      "Invalid subcategory order."
    );
  }

  const rows =
    await db
      .select({
        id:
          catalogSubcategories.id,

        categoryId:
          catalogSubcategories.categoryId,
      })
      .from(
        catalogSubcategories
      )
      .where(
        inArray(
          catalogSubcategories.id,
          uniqueIds
        )
      );

  if (
    rows.length !==
    uniqueIds.length ||
    rows.some(
      (row) =>
        row.categoryId !==
        categoryId
    )
  ) {
    throw new Error(
      "One or more subcategories do not belong to this category."
    );
  }

  await db.transaction(
    async (tx) => {
      for (
        let index = 0;
        index <
        subcategoryIds.length;
        index += 1
      ) {
        await tx
          .update(
            catalogSubcategories
          )
          .set({
            sortOrder:
              index,

            updatedAt:
              new Date(),
          })
          .where(
            eq(
              catalogSubcategories.id,
              subcategoryIds[
                index
              ]
            )
          );
      }
    }
  );

  refreshCategories();

  return {
    success:
      true,
  };
}

/* =========================================================
   TOGGLE SUBCATEGORY
   ========================================================= */

export async function toggleSubcategoryVisibility(
  formData: FormData
) {
  await requireAdmin();

  const subcategoryId =
    parseId(
      formData,
      "subcategoryId",
      "subcategory"
    );

  const subcategory =
    await findSubcategoryById(
      subcategoryId
    );

  if (!subcategory) {
    redirectCategoryError(
      "Subcategory could not be found.",
      "subcategories"
    );
  }

  await db
    .update(
      catalogSubcategories
    )
    .set({
      isVisible:
        !subcategory.isVisible,

      updatedAt:
        new Date(),
    })
    .where(
      eq(
        catalogSubcategories.id,
        subcategoryId
      )
    );

  refreshCategories();

  redirectCategorySuccess(
    "subcategoryVisibility",
    "subcategories"
  );
}

/* =========================================================
   DELETE SUBCATEGORY
   ========================================================= */

export async function deleteSubcategory(
  formData: FormData
) {
  await requireAdmin();

  const subcategoryId =
    parseId(
      formData,
      "subcategoryId",
      "subcategory"
    );

  const usageRows =
    await db
      .select({
        total:
          count(),
      })
      .from(
        productSubcategoryAssignments
      )
      .where(
        eq(
          productSubcategoryAssignments.subcategoryId,
          subcategoryId
        )
      );

  const usage =
    Number(
      usageRows[0]
        ?.total ??
        0
    );

  if (
    usage >
    0
  ) {
    redirectCategoryError(
      `This subcategory is used by ${usage} product(s). Remove those assignments first.`,
      "subcategories"
    );
  }

  await db
    .delete(
      catalogSubcategories
    )
    .where(
      eq(
        catalogSubcategories.id,
        subcategoryId
      )
    );

  refreshCategories();

  redirectCategorySuccess(
    "subcategoryDeleted",
    "subcategories"
  );
}
"use server";

import {
  createHash,
} from "node:crypto";

import {
  asc,
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
  pcBuilderCategories,
  pcBuilderItems,
  pcBuilderSettings,
} from "@/db/schema";

import {
  requireAdmin,
} from "@/lib/admin-auth";

/* =========================================================
   CONSTANTS
   ========================================================= */

const SETTINGS_ID =
  "main";

const MAX_IMAGE_SIZE =
  5 * 1024 * 1024;

const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

/* =========================================================
   HELPERS
   ========================================================= */

function getText(
  formData: FormData,
  name: string
) {
  return String(
    formData.get(name) ?? ""
  ).trim();
}

function makeSlug(
  value: string
) {
  return value
    .toLowerCase()
    .trim()
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

function parsePositiveInteger(
  value: string,
  label: string,
  allowZero = true
) {
  const parsed =
    Number.parseInt(
      value,
      10
    );

  if (
    !Number.isInteger(
      parsed
    ) ||
    parsed <
      (allowZero
        ? 0
        : 1)
  ) {
    redirectBuilderError(
      `${label} must be a valid whole number.`
    );
  }

  return parsed;
}

function parseSpecs(
  formData: FormData
) {
  return getText(
    formData,
    "specs"
  )
    .split(
      "\n"
    )
    .map(
      (value) =>
        value.trim()
    )
    .filter(
      Boolean
    );
}

function isValidOptionalUrl(
  value: string
) {
  if (
    !value
  ) {
    return true;
  }

  if (
    value.startsWith(
      "/"
    )
  ) {
    return true;
  }

  try {
    const url =
      new URL(
        value
      );

    return (
      url.protocol ===
        "http:" ||
      url.protocol ===
        "https:"
    );
  } catch {
    return false;
  }
}

/* =========================================================
   REDIRECTS
   ========================================================= */

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

/* =========================================================
   REVALIDATE
   ========================================================= */

function refreshBuilder() {
  revalidatePath(
    "/admin"
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
   CLOUDINARY
   ========================================================= */

function createCloudinarySignature({
  timestamp,
  folder,
  apiSecret,
}: {
  timestamp: number;
  folder: string;
  apiSecret: string;
}) {
  return createHash(
    "sha1"
  )
    .update(
      `folder=${folder}&timestamp=${timestamp}${apiSecret}`
    )
    .digest(
      "hex"
    );
}

async function uploadBuilderImage(
  imageFile: File
) {
  const cloudName =
    process.env
      .CLOUDINARY_CLOUD_NAME;

  const apiKey =
    process.env
      .CLOUDINARY_API_KEY;

  const apiSecret =
    process.env
      .CLOUDINARY_API_SECRET;

  if (
    !cloudName ||
    !apiKey ||
    !apiSecret
  ) {
    throw new Error(
      "Image upload is not configured."
    );
  }

  if (
    imageFile.size >
    MAX_IMAGE_SIZE
  ) {
    throw new Error(
      "Image must be smaller than 5 MB."
    );
  }

  if (
    !ALLOWED_IMAGE_TYPES.includes(
      imageFile.type
    )
  ) {
    throw new Error(
      "Only JPG, PNG and WebP images are allowed."
    );
  }

  const folder =
    "gamex/pc-builder";

  const timestamp =
    Math.floor(
      Date.now() /
        1000
    );

  const signature =
    createCloudinarySignature({
      timestamp,
      folder,
      apiSecret,
    });

  const uploadForm =
    new FormData();

  uploadForm.append(
    "file",
    imageFile
  );

  uploadForm.append(
    "api_key",
    apiKey
  );

  uploadForm.append(
    "timestamp",
    String(
      timestamp
    )
  );

  uploadForm.append(
    "folder",
    folder
  );

  uploadForm.append(
    "signature",
    signature
  );

  const response =
    await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method:
          "POST",

        body:
          uploadForm,
      }
    );

  const result =
    (await response.json()) as {
      secure_url?: string;

      error?: {
        message?: string;
      };
    };

  if (
    !response.ok ||
    !result.secure_url
  ) {
    throw new Error(
      result.error
        ?.message ||
        "Image upload failed."
    );
  }

  return result.secure_url;
}

/* =========================================================
   SAVE SETTINGS
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

  const whatsappRaw =
    getText(
      formData,
      "whatsappNumber"
    );

  const whatsappNumber =
    whatsappRaw.replace(
      /\D/g,
      ""
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

  if (
    !title
  ) {
    redirectBuilderError(
      "Builder title is required.",
      "settings"
    );
  }

  if (
    title.length >
    255
  ) {
    redirectBuilderError(
      "Builder title is too long.",
      "settings"
    );
  }

  if (
    !subtitle
  ) {
    redirectBuilderError(
      "Builder subtitle is required.",
      "settings"
    );
  }

  if (
    !readyBuildsLabel ||
    readyBuildsLabel.length >
      120
  ) {
    redirectBuilderError(
      "Ready Builds label is invalid.",
      "settings"
    );
  }

  if (
    !scratchBuilderLabel ||
    scratchBuilderLabel.length >
      120
  ) {
    redirectBuilderError(
      "Scratch Builder label is invalid.",
      "settings"
    );
  }

  if (
    !quoteButtonText ||
    quoteButtonText.length >
      120
  ) {
    redirectBuilderError(
      "Quote button text is invalid.",
      "settings"
    );
  }

  if (
    whatsappNumber.length <
      8 ||
    whatsappNumber.length >
      20
  ) {
    redirectBuilderError(
      "Enter a valid WhatsApp number including country code.",
      "settings"
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
    "Settings saved.",
    "settings"
  );
}

/* =========================================================
   CREATE CATEGORY
   ========================================================= */

export async function createBuilderCategory(
  formData: FormData
) {
  await requireAdmin();

  const name =
    getText(
      formData,
      "name"
    );

  const requestedSlug =
    getText(
      formData,
      "slug"
    );

  const slug =
    makeSlug(
      requestedSlug ||
        name
    );

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

  const sortOrder =
    parsePositiveInteger(
      getText(
        formData,
        "sortOrder"
      ) || "0",
      "Display order"
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
    !name
  ) {
    redirectBuilderError(
      "Category name is required.",
      "categories"
    );
  }

  if (
    name.length >
    120
  ) {
    redirectBuilderError(
      "Category name is too long.",
      "categories"
    );
  }

  if (
    !slug
  ) {
    redirectBuilderError(
      "Category slug is required.",
      "categories"
    );
  }

  if (
    helpText.length >
    500
  ) {
    redirectBuilderError(
      "Help text is too long.",
      "categories"
    );
  }

  const existing =
    await db
      .select({
        id:
          pcBuilderCategories.id,
      })
      .from(
        pcBuilderCategories
      )
      .where(
        eq(
          pcBuilderCategories.slug,
          slug
        )
      )
      .limit(
        1
      );

  if (
    existing[0]
  ) {
    redirectBuilderError(
      "A builder category with this slug already exists.",
      "categories"
    );
  }

  await db
    .insert(
      pcBuilderCategories
    )
    .values({
      name,

      slug,

      description,

      helpText,

      isRequired,

      isVisible,

      sortOrder,
    });

  refreshBuilder();

  redirectBuilderSuccess(
    "Category created.",
    "categories"
  );
}

/* =========================================================
   UPDATE CATEGORY
   ========================================================= */

export async function updateBuilderCategory(
  formData: FormData
) {
  await requireAdmin();

  const categoryId =
    parsePositiveInteger(
      getText(
        formData,
        "categoryId"
      ),
      "Category ID",
      false
    );

  const name =
    getText(
      formData,
      "name"
    );

  const slug =
    makeSlug(
      getText(
        formData,
        "slug"
      ) ||
        name
    );

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

  const sortOrder =
    parsePositiveInteger(
      getText(
        formData,
        "sortOrder"
      ) || "0",
      "Display order"
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
    !name ||
    name.length >
      120
  ) {
    redirectBuilderError(
      "Category name is invalid.",
      "categories"
    );
  }

  if (
    !slug
  ) {
    redirectBuilderError(
      "Category slug is required.",
      "categories"
    );
  }

  if (
    helpText.length >
    500
  ) {
    redirectBuilderError(
      "Help text is too long.",
      "categories"
    );
  }

  const duplicate =
    await db
      .select({
        id:
          pcBuilderCategories.id,
      })
      .from(
        pcBuilderCategories
      )
      .where(
        eq(
          pcBuilderCategories.slug,
          slug
        )
      )
      .limit(
        1
      );

  if (
    duplicate[0] &&
    duplicate[0].id !==
      categoryId
  ) {
    redirectBuilderError(
      "Another category already uses this slug.",
      "categories"
    );
  }

  await db
    .update(
      pcBuilderCategories
    )
    .set({
      name,

      slug,

      description,

      helpText,

      isRequired,

      isVisible,

      sortOrder,

      updatedAt:
        new Date(),
    })
    .where(
      eq(
        pcBuilderCategories.id,
        categoryId
      )
    );

  refreshBuilder();

  redirectBuilderSuccess(
    "Category updated.",
    "categories"
  );
}

/* =========================================================
   DELETE CATEGORY
   ========================================================= */

export async function deleteBuilderCategory(
  formData: FormData
) {
  await requireAdmin();

  const categoryId =
    parsePositiveInteger(
      getText(
        formData,
        "categoryId"
      ),
      "Category ID",
      false
    );

  await db
    .delete(
      pcBuilderCategories
    )
    .where(
      eq(
        pcBuilderCategories.id,
        categoryId
      )
    );

  refreshBuilder();

  redirectBuilderSuccess(
    "Category deleted.",
    "categories"
  );
}

/* =========================================================
   CREATE ITEM
   ========================================================= */

export async function createBuilderItem(
  formData: FormData
) {
  await requireAdmin();

  const categoryId =
    parsePositiveInteger(
      getText(
        formData,
        "categoryId"
      ),
      "Category",
      false
    );

  const name =
    getText(
      formData,
      "name"
    );

  const price =
    parsePositiveInteger(
      getText(
        formData,
        "price"
      ) || "0",
      "Price"
    );

  const description =
    getText(
      formData,
      "description"
    );

  const specs =
    parseSpecs(
      formData
    );

  const imageUrl =
    getText(
      formData,
      "imageUrl"
    );

  const productUrl =
    getText(
      formData,
      "productUrl"
    );

  const sortOrder =
    parsePositiveInteger(
      getText(
        formData,
        "sortOrder"
      ) || "0",
      "Display order"
    );

  const isVisible =
    formData.get(
      "isVisible"
    ) === "on";

  const possibleFile =
    formData.get(
      "imageFile"
    );

  const imageFile =
    possibleFile instanceof
    File
      ? possibleFile
      : null;

  if (
    !name
  ) {
    redirectBuilderError(
      "Item name is required.",
      "items"
    );
  }

  if (
    name.length >
    255
  ) {
    redirectBuilderError(
      "Item name is too long.",
      "items"
    );
  }

  const category =
    await db
      .select({
        id:
          pcBuilderCategories.id,
      })
      .from(
        pcBuilderCategories
      )
      .where(
        eq(
          pcBuilderCategories.id,
          categoryId
        )
      )
      .limit(
        1
      );

  if (
    !category[0]
  ) {
    redirectBuilderError(
      "Selected builder category does not exist.",
      "items"
    );
  }

  if (
    !isValidOptionalUrl(
      imageUrl
    )
  ) {
    redirectBuilderError(
      "Enter a valid image URL.",
      "items"
    );
  }

  if (
    !isValidOptionalUrl(
      productUrl
    )
  ) {
    redirectBuilderError(
      "Enter a valid product link.",
      "items"
    );
  }

  let finalImage =
    imageUrl;

  if (
    imageFile &&
    imageFile.size >
      0
  ) {
    try {
      finalImage =
        await uploadBuilderImage(
          imageFile
        );
    } catch (
      error
    ) {
      redirectBuilderError(
        error instanceof
          Error
          ? error.message
          : "Image upload failed.",
        "items"
      );
    }
  }

  await db
    .insert(
      pcBuilderItems
    )
    .values({
      categoryId,

      name,

      price,

      description,

      specs,

      image:
        finalImage,

      productUrl,

      isVisible,

      sortOrder,
    });

  refreshBuilder();

  redirectBuilderSuccess(
    "Builder item created.",
    "items"
  );
}

/* =========================================================
   UPDATE ITEM
   ========================================================= */

export async function updateBuilderItem(
  formData: FormData
) {
  await requireAdmin();

  const itemId =
    parsePositiveInteger(
      getText(
        formData,
        "itemId"
      ),
      "Item ID",
      false
    );

  const categoryId =
    parsePositiveInteger(
      getText(
        formData,
        "categoryId"
      ),
      "Category",
      false
    );

  const existingRows =
    await db
      .select()
      .from(
        pcBuilderItems
      )
      .where(
        eq(
          pcBuilderItems.id,
          itemId
        )
      )
      .limit(
        1
      );

  const existing =
    existingRows[0];

  if (
    !existing
  ) {
    redirectBuilderError(
      "Builder item could not be found.",
      "items"
    );
  }

  const name =
    getText(
      formData,
      "name"
    );

  const price =
    parsePositiveInteger(
      getText(
        formData,
        "price"
      ) || "0",
      "Price"
    );

  const description =
    getText(
      formData,
      "description"
    );

  const specs =
    parseSpecs(
      formData
    );

  const imageUrl =
    getText(
      formData,
      "imageUrl"
    );

  const productUrl =
    getText(
      formData,
      "productUrl"
    );

  const sortOrder =
    parsePositiveInteger(
      getText(
        formData,
        "sortOrder"
      ) || "0",
      "Display order"
    );

  const isVisible =
    formData.get(
      "isVisible"
    ) === "on";

  const possibleFile =
    formData.get(
      "imageFile"
    );

  const imageFile =
    possibleFile instanceof
    File
      ? possibleFile
      : null;

  if (
    !name ||
    name.length >
      255
  ) {
    redirectBuilderError(
      "Item name is invalid.",
      "items"
    );
  }

  const category =
    await db
      .select({
        id:
          pcBuilderCategories.id,
      })
      .from(
        pcBuilderCategories
      )
      .where(
        eq(
          pcBuilderCategories.id,
          categoryId
        )
      )
      .limit(
        1
      );

  if (
    !category[0]
  ) {
    redirectBuilderError(
      "Selected category does not exist.",
      "items"
    );
  }

  if (
    !isValidOptionalUrl(
      imageUrl
    )
  ) {
    redirectBuilderError(
      "Enter a valid image URL.",
      "items"
    );
  }

  if (
    !isValidOptionalUrl(
      productUrl
    )
  ) {
    redirectBuilderError(
      "Enter a valid product link.",
      "items"
    );
  }

  let finalImage =
    existing.image;

  if (
    imageUrl
  ) {
    finalImage =
      imageUrl;
  }

  if (
    imageFile &&
    imageFile.size >
      0
  ) {
    try {
      finalImage =
        await uploadBuilderImage(
          imageFile
        );
    } catch (
      error
    ) {
      redirectBuilderError(
        error instanceof
          Error
          ? error.message
          : "Image upload failed.",
        "items"
      );
    }
  }

  await db
    .update(
      pcBuilderItems
    )
    .set({
      categoryId,

      name,

      price,

      description,

      specs,

      image:
        finalImage,

      productUrl,

      isVisible,

      sortOrder,

      updatedAt:
        new Date(),
    })
    .where(
      eq(
        pcBuilderItems.id,
        itemId
      )
    );

  refreshBuilder();

  redirectBuilderSuccess(
    "Builder item updated.",
    "items"
  );
}

/* =========================================================
   DELETE ITEM
   ========================================================= */

export async function deleteBuilderItem(
  formData: FormData
) {
  await requireAdmin();

  const itemId =
    parsePositiveInteger(
      getText(
        formData,
        "itemId"
      ),
      "Item ID",
      false
    );

  await db
    .delete(
      pcBuilderItems
    )
    .where(
      eq(
        pcBuilderItems.id,
        itemId
      )
    );

  refreshBuilder();

  redirectBuilderSuccess(
    "Builder item deleted.",
    "items"
  );
}
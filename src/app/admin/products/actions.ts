"use server";

import {
  createHash,
  randomUUID,
} from "node:crypto";

import { eq } from "drizzle-orm";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { db } from "@/db";
import { products } from "@/db/schema";
import { requireAdmin } from "@/lib/admin-auth";

/* =========================================================
   SETTINGS
   ========================================================= */

const MAX_IMAGE_SIZE =
  5 * 1024 * 1024;

const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

/* =========================================================
   ERROR REDIRECTS
   ========================================================= */

function redirectNewProductError(
  message: string
): never {
  redirect(
    `/admin/products/new?error=${encodeURIComponent(
      message
    )}`
  );
}

function redirectEditProductError(
  productId: string,
  message: string
): never {
  redirect(
    `/admin/products/${encodeURIComponent(
      productId
    )}/edit?error=${encodeURIComponent(
      message
    )}`
  );
}

/* =========================================================
   CREATE PRODUCT ID
   ========================================================= */

function makeProductId(
  name: string
) {
  const slug = name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);

  const suffix =
    randomUUID().slice(0, 8);

  return `${
    slug || "product"
  }-${suffix}`;
}

/* =========================================================
   CHECK IMAGE URL
   ========================================================= */

function isValidImageUrl(
  value: string
) {
  try {
    const url = new URL(value);

    return (
      url.protocol === "http:" ||
      url.protocol === "https:"
    );
  } catch {
    return false;
  }
}

/* =========================================================
   CLOUDINARY SIGNATURE
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
  const stringToSign =
    `folder=${folder}&timestamp=${timestamp}${apiSecret}`;

  return createHash("sha1")
    .update(stringToSign)
    .digest("hex");
}

/* =========================================================
   UPLOAD PRODUCT IMAGE
   ========================================================= */

async function uploadProductImage(
  imageFile: File
) {
  const cloudName =
    process.env.CLOUDINARY_CLOUD_NAME;

  const apiKey =
    process.env.CLOUDINARY_API_KEY;

  const apiSecret =
    process.env.CLOUDINARY_API_SECRET;

  if (
    !cloudName ||
    !apiKey ||
    !apiSecret
  ) {
    throw new Error(
      "Image upload is not configured."
    );
  }

  /* =======================================================
     FILE SIZE
     ======================================================= */

  if (
    imageFile.size >
    MAX_IMAGE_SIZE
  ) {
    throw new Error(
      "Image must be smaller than 5 MB."
    );
  }

  /* =======================================================
     FILE TYPE
     ======================================================= */

  if (
    !ALLOWED_IMAGE_TYPES.includes(
      imageFile.type
    )
  ) {
    throw new Error(
      "Only JPG, PNG and WebP images are allowed."
    );
  }

  /* =======================================================
     CLOUDINARY REQUEST
     ======================================================= */

  const folder =
    "gamex/products";

  const timestamp =
    Math.floor(Date.now() / 1000);

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
    String(timestamp)
  );

  uploadForm.append(
    "folder",
    folder
  );

  uploadForm.append(
    "signature",
    signature
  );

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    {
      method: "POST",
      body: uploadForm,
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
      result.error?.message ||
        "Image upload failed."
    );
  }

  return result.secure_url;
}

/* =========================================================
   CREATE PRODUCT
   ========================================================= */

export async function createProduct(
  formData: FormData
) {
  await requireAdmin();

  /* =======================================================
     BASIC INFORMATION
     ======================================================= */

  const name = String(
    formData.get("name") ?? ""
  ).trim();

  const category = String(
    formData.get("category") ?? ""
  ).trim();

  const tag = String(
    formData.get("tag") ?? ""
  ).trim();

  const description = String(
    formData.get(
      "description"
    ) ?? ""
  ).trim();

  const specsText = String(
    formData.get("specs") ?? ""
  ).trim();

  const sortOrderRaw = String(
    formData.get(
      "sortOrder"
    ) ?? "0"
  ).trim();

  /* =======================================================
     IMAGE INPUTS
     ======================================================= */

  const imageUrl = String(
    formData.get(
      "imageUrl"
    ) ?? ""
  ).trim();

  const possibleImageFile =
    formData.get("imageFile");

  const imageFile =
    possibleImageFile instanceof File
      ? possibleImageFile
      : null;

  const hasImageFile =
    imageFile !== null &&
    imageFile.size > 0;

  const hasImageUrl =
    imageUrl.length > 0;

  /* =======================================================
     VISIBILITY
     ======================================================= */

  const isVisible =
    formData.get(
      "isVisible"
    ) === "on";

  /* =======================================================
     VALIDATION
     ======================================================= */

  if (!name) {
    redirectNewProductError(
      "Product name is required."
    );
  }

  if (!category) {
    redirectNewProductError(
      "Category is required."
    );
  }

  if (!description) {
    redirectNewProductError(
      "Description is required."
    );
  }

  if (name.length > 255) {
    redirectNewProductError(
      "Product name is too long."
    );
  }

  if (
    category.length > 100
  ) {
    redirectNewProductError(
      "Category is too long."
    );
  }

  if (tag.length > 120) {
    redirectNewProductError(
      "Product tag is too long."
    );
  }

  if (
    imageUrl.length > 1000
  ) {
    redirectNewProductError(
      "Image URL is too long."
    );
  }

  /* =======================================================
     IMAGE VALIDATION
     ======================================================= */

  if (
    !hasImageFile &&
    !hasImageUrl
  ) {
    redirectNewProductError(
      "Please upload an image or enter an image URL."
    );
  }

  if (
    !hasImageFile &&
    hasImageUrl &&
    !isValidImageUrl(imageUrl)
  ) {
    redirectNewProductError(
      "Please enter a valid image URL."
    );
  }

  /* =======================================================
     SPECIFICATIONS
     ======================================================= */

  const specs = specsText
    .split("\n")
    .map((spec) =>
      spec.trim()
    )
    .filter(Boolean);

  if (
    specs.length === 0
  ) {
    redirectNewProductError(
      "Add at least one specification."
    );
  }

  /* =======================================================
     DISPLAY ORDER
     ======================================================= */

  const sortOrder =
    Number.parseInt(
      sortOrderRaw,
      10
    );

  if (
    !Number.isFinite(
      sortOrder
    ) ||
    sortOrder < 0
  ) {
    redirectNewProductError(
      "Display order must be 0 or greater."
    );
  }

  /* =======================================================
     FINAL IMAGE
     ======================================================= */

  let finalImageUrl =
    imageUrl;

  if (
    hasImageFile &&
    imageFile
  ) {
    try {
      finalImageUrl =
        await uploadProductImage(
          imageFile
        );
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Image upload failed.";

      redirectNewProductError(
        message
      );
    }
  }

  if (!finalImageUrl) {
    redirectNewProductError(
      "Product image could not be processed."
    );
  }

  /* =======================================================
     INSERT
     ======================================================= */

  const id =
    makeProductId(name);

  await db
    .insert(products)
    .values({
      id,
      name,
      category,

      tag:
        tag ||
        "FEATURED",

      description,
      specs,

      image:
        finalImageUrl,

      isVisible,
      sortOrder,
    });

  revalidatePath(
    "/admin/products"
  );

  revalidatePath("/");

  redirect(
    "/admin/products"
  );
}

/* =========================================================
   UPDATE PRODUCT
   ========================================================= */

export async function updateProduct(
  formData: FormData
) {
  await requireAdmin();

  /* =======================================================
     PRODUCT ID
     ======================================================= */

  const productId = String(
    formData.get(
      "productId"
    ) ?? ""
  ).trim();

  if (!productId) {
    redirect(
      "/admin/products"
    );
  }

  /* =======================================================
     GET EXISTING PRODUCT
     ======================================================= */

  const existingRows =
    await db
      .select()
      .from(products)
      .where(
        eq(
          products.id,
          productId
        )
      )
      .limit(1);

  const existingProduct =
    existingRows[0];

  if (!existingProduct) {
    redirect(
      "/admin/products"
    );
  }

  /* =======================================================
     READ FORM
     ======================================================= */

  const name = String(
    formData.get("name") ?? ""
  ).trim();

  const category = String(
    formData.get("category") ?? ""
  ).trim();

  const tag = String(
    formData.get("tag") ?? ""
  ).trim();

  const description = String(
    formData.get(
      "description"
    ) ?? ""
  ).trim();

  const specsText = String(
    formData.get("specs") ?? ""
  ).trim();

  const sortOrderRaw = String(
    formData.get(
      "sortOrder"
    ) ?? "0"
  ).trim();

  const imageUrl = String(
    formData.get(
      "imageUrl"
    ) ?? ""
  ).trim();

  const possibleImageFile =
    formData.get("imageFile");

  const imageFile =
    possibleImageFile instanceof File
      ? possibleImageFile
      : null;

  const hasImageFile =
    imageFile !== null &&
    imageFile.size > 0;

  const hasImageUrl =
    imageUrl.length > 0;

  const isVisible =
    formData.get(
      "isVisible"
    ) === "on";

  /* =======================================================
     VALIDATION
     ======================================================= */

  if (!name) {
    redirectEditProductError(
      productId,
      "Product name is required."
    );
  }

  if (!category) {
    redirectEditProductError(
      productId,
      "Category is required."
    );
  }

  if (!description) {
    redirectEditProductError(
      productId,
      "Description is required."
    );
  }

  if (name.length > 255) {
    redirectEditProductError(
      productId,
      "Product name is too long."
    );
  }

  if (
    category.length > 100
  ) {
    redirectEditProductError(
      productId,
      "Category is too long."
    );
  }

  if (tag.length > 120) {
    redirectEditProductError(
      productId,
      "Product tag is too long."
    );
  }

  if (
    imageUrl.length > 1000
  ) {
    redirectEditProductError(
      productId,
      "Image URL is too long."
    );
  }

  if (
    hasImageUrl &&
    !isValidImageUrl(imageUrl)
  ) {
    redirectEditProductError(
      productId,
      "Please enter a valid image URL."
    );
  }

  /* =======================================================
     SPECIFICATIONS
     ======================================================= */

  const specs = specsText
    .split("\n")
    .map((spec) =>
      spec.trim()
    )
    .filter(Boolean);

  if (
    specs.length === 0
  ) {
    redirectEditProductError(
      productId,
      "Add at least one specification."
    );
  }

  /* =======================================================
     DISPLAY ORDER
     ======================================================= */

  const sortOrder =
    Number.parseInt(
      sortOrderRaw,
      10
    );

  if (
    !Number.isFinite(
      sortOrder
    ) ||
    sortOrder < 0
  ) {
    redirectEditProductError(
      productId,
      "Display order must be 0 or greater."
    );
  }

  /* =======================================================
     DETERMINE IMAGE
     ======================================================= */

  /*
   * Default:
   * keep the image already stored in Neon.
   */
  let finalImageUrl =
    existingProduct.image;

  /*
   * If the administrator entered a new URL,
   * use the new URL.
   */
  if (hasImageUrl) {
    finalImageUrl =
      imageUrl;
  }

  /*
   * If a file was uploaded from the PC,
   * that takes priority over the URL.
   */
  if (
    hasImageFile &&
    imageFile
  ) {
    try {
      finalImageUrl =
        await uploadProductImage(
          imageFile
        );
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Image upload failed.";

      redirectEditProductError(
        productId,
        message
      );
    }
  }

  /* =======================================================
     UPDATE NEON
     ======================================================= */

  await db
    .update(products)
    .set({
      name,
      category,

      tag:
        tag ||
        "FEATURED",

      description,
      specs,

      image:
        finalImageUrl,

      isVisible,
      sortOrder,

      updatedAt:
        new Date(),
    })
    .where(
      eq(
        products.id,
        productId
      )
    );

  /* =======================================================
     REFRESH
     ======================================================= */

  revalidatePath(
    "/admin/products"
  );

  revalidatePath(
    `/admin/products/${productId}/edit`
  );

  revalidatePath("/");

  redirect(
    "/admin/products"
  );
}

/* =========================================================
   TOGGLE PRODUCT VISIBILITY
   ========================================================= */

export async function toggleProductVisibility(
  formData: FormData
) {
  await requireAdmin();

  const productId = String(
    formData.get(
      "productId"
    ) ?? ""
  ).trim();

  const nextVisibility =
    String(
      formData.get(
        "nextVisibility"
      ) ?? ""
    ) === "true";

  if (!productId) {
    return;
  }

  await db
    .update(products)
    .set({
      isVisible:
        nextVisibility,

      updatedAt:
        new Date(),
    })
    .where(
      eq(
        products.id,
        productId
      )
    );

  revalidatePath(
    "/admin/products"
  );

  revalidatePath("/");
}

/* =========================================================
   DELETE PRODUCT
   ========================================================= */

export async function deleteProduct(
  formData: FormData
) {
  await requireAdmin();

  const productId = String(
    formData.get(
      "productId"
    ) ?? ""
  ).trim();

  if (!productId) {
    return;
  }

  await db
    .delete(products)
    .where(
      eq(
        products.id,
        productId
      )
    );

  revalidatePath(
    "/admin/products"
  );

  revalidatePath("/");
}
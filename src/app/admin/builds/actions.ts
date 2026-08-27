"use server";

import {
  createHash,
  randomUUID,
} from "node:crypto";

import { eq } from "drizzle-orm";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { db } from "@/db";
import { customBuilds } from "@/db/schema";
import { requireAdmin } from "@/lib/admin-auth";

/* =========================================================
   SETTINGS
   ========================================================= */

const MAX_IMAGE_SIZE =
  5 * 1024 * 1024; // 5 MB

const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

/* =========================================================
   ERROR REDIRECT
   ========================================================= */

function redirectWithError(
  message: string
): never {
  redirect(
    `/admin/builds/new?error=${encodeURIComponent(
      message
    )}`
  );
}

/* =========================================================
   CREATE BUILD ID
   ========================================================= */

function makeBuildId(
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
    slug || "build"
  }-${suffix}`;
}

/* =========================================================
   VALIDATE IMAGE URL
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
   UPLOAD BUILD IMAGE TO CLOUDINARY
   ========================================================= */

async function uploadBuildImage(
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
     CLOUDINARY SETTINGS
     ======================================================= */

  const folder =
    "gamex/builds";

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

  /* =======================================================
     UPLOAD
     ======================================================= */

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
   CREATE CUSTOM BUILD
   ========================================================= */

export async function createBuild(
  formData: FormData
) {
  /*
   * Only logged-in administrators
   * can create custom builds.
   */
  await requireAdmin();

  /* =======================================================
     READ BASIC DATA
     ======================================================= */

  const name = String(
    formData.get("name") ?? ""
  ).trim();

  const role = String(
    formData.get("role") ?? ""
  ).trim();

  const badge = String(
    formData.get("badge") ?? ""
  ).trim();

  const description = String(
    formData.get("description") ?? ""
  ).trim();

  const specsText = String(
    formData.get("specs") ?? ""
  ).trim();

  const sortOrderRaw = String(
    formData.get("sortOrder") ?? "0"
  ).trim();

  /* =======================================================
     IMAGE INPUTS
     ======================================================= */

  const imageUrl = String(
    formData.get("imageUrl") ?? ""
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
    formData.get("isVisible") ===
    "on";

  /* =======================================================
     REQUIRED FIELDS
     ======================================================= */

  if (!name) {
    redirectWithError(
      "Build name is required."
    );
  }

  if (!role) {
    redirectWithError(
      "Build role is required."
    );
  }

  if (!description) {
    redirectWithError(
      "Description is required."
    );
  }

  /* =======================================================
     LENGTH VALIDATION
     ======================================================= */

  if (name.length > 255) {
    redirectWithError(
      "Build name is too long."
    );
  }

  if (role.length > 255) {
    redirectWithError(
      "Build role is too long."
    );
  }

  if (badge.length > 120) {
    redirectWithError(
      "Badge is too long."
    );
  }

  if (imageUrl.length > 1000) {
    redirectWithError(
      "Image URL is too long."
    );
  }

  /* =======================================================
     SPECS
     ======================================================= */

  const specs = specsText
    .split("\n")
    .map((spec) =>
      spec.trim()
    )
    .filter(Boolean);

  if (specs.length === 0) {
    redirectWithError(
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
    redirectWithError(
      "Display order must be 0 or greater."
    );
  }

  /* =======================================================
     IMAGE VALIDATION
     ======================================================= */

  if (
    !hasImageFile &&
    !hasImageUrl
  ) {
    redirectWithError(
      "Please upload an image or enter an image URL."
    );
  }

  if (
    !hasImageFile &&
    hasImageUrl &&
    !isValidImageUrl(
      imageUrl
    )
  ) {
    redirectWithError(
      "Please enter a valid image URL."
    );
  }

  /* =======================================================
     DETERMINE FINAL IMAGE
     ======================================================= */

  let finalImageUrl =
    imageUrl;

  /*
   * PC upload takes priority if both
   * a file and URL are supplied.
   */
  if (
    hasImageFile &&
    imageFile
  ) {
    try {
      finalImageUrl =
        await uploadBuildImage(
          imageFile
        );
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Image upload failed.";

      redirectWithError(
        message
      );
    }
  }

  if (!finalImageUrl) {
    redirectWithError(
      "Build image could not be processed."
    );
  }

  /* =======================================================
     CREATE BUILD ID
     ======================================================= */

  const id =
    makeBuildId(name);

  /* =======================================================
     INSERT INTO NEON
     ======================================================= */

  await db
    .insert(customBuilds)
    .values({
      id,
      name,
      role,

      badge:
        badge ||
        "CUSTOM BUILD",

      description,
      specs,

      image:
        finalImageUrl,

      isVisible,
      sortOrder,
    });

  /* =======================================================
     REFRESH
     ======================================================= */

  revalidatePath(
    "/admin/builds"
  );

  revalidatePath("/");

  /* =======================================================
     REDIRECT
     ======================================================= */

  redirect(
    "/admin/builds"
  );
}

/* =========================================================
   TOGGLE BUILD VISIBILITY
   ========================================================= */

export async function toggleBuildVisibility(
  formData: FormData
) {
  await requireAdmin();

  const buildId = String(
    formData.get("buildId") ?? ""
  ).trim();

  const nextVisibility =
    String(
      formData.get(
        "nextVisibility"
      ) ?? ""
    ) === "true";

  if (!buildId) {
    return;
  }

  await db
    .update(customBuilds)
    .set({
      isVisible:
        nextVisibility,

      updatedAt:
        new Date(),
    })
    .where(
      eq(
        customBuilds.id,
        buildId
      )
    );

  revalidatePath(
    "/admin/builds"
  );

  revalidatePath("/");
}

/* =========================================================
   DELETE BUILD
   ========================================================= */

export async function deleteBuild(
  formData: FormData
) {
  await requireAdmin();

  const buildId = String(
    formData.get("buildId") ?? ""
  ).trim();

  if (!buildId) {
    return;
  }

  await db
    .delete(customBuilds)
    .where(
      eq(
        customBuilds.id,
        buildId
      )
    );

  revalidatePath(
    "/admin/builds"
  );

  revalidatePath("/");
}
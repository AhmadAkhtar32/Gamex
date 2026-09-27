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

const MAX_IMAGE_SIZE =
  5 * 1024 * 1024;

const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

function redirectNewBuildError(
  message: string
): never {
  redirect(
    `/admin/builds/new?error=${encodeURIComponent(
      message
    )}`
  );
}

function redirectEditBuildError(
  buildId: string,
  message: string
): never {
  redirect(
    `/admin/builds/${encodeURIComponent(
      buildId
    )}/edit?error=${encodeURIComponent(
      message
    )}`
  );
}

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
    randomUUID().slice(
      0,
      8
    );

  return `${
    slug || "build"
  }-${suffix}`;
}

function isValidImageUrl(
  value: string
) {
  try {
    const url =
      new URL(value);

    return (
      url.protocol === "http:" ||
      url.protocol === "https:"
    );
  } catch {
    return false;
  }
}

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

async function uploadBuildImage(
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
    "gamex/builds";

  const timestamp =
    Math.floor(
      Date.now() / 1000
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

  const response =
    await fetch(
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

export async function createBuild(
  formData: FormData
) {
  await requireAdmin();

  const name = String(
    formData.get("name") ?? ""
  ).trim();

  const role = String(
    formData.get("role") ?? ""
  ).trim();

  const badge = String(
    formData.get("badge") ?? ""
  ).trim();

  const priceRaw = String(
    formData.get("price") ?? ""
  ).trim();

  const price =
    priceRaw === ""
      ? null
      : Number(priceRaw);

  const description = String(
    formData.get(
      "description"
    ) ?? ""
  ).trim();

  const specsText = String(
    formData.get(
      "specs"
    ) ?? ""
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
    formData.get(
      "imageFile"
    );

  const imageFile =
    possibleImageFile instanceof
    File
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

  if (!name) {
    redirectNewBuildError(
      "Build name is required."
    );
  }

  if (!role) {
    redirectNewBuildError(
      "Build role is required."
    );
  }

  if (!description) {
    redirectNewBuildError(
      "Description is required."
    );
  }

  if (
    name.length > 255
  ) {
    redirectNewBuildError(
      "Build name is too long."
    );
  }

  if (
    role.length > 255
  ) {
    redirectNewBuildError(
      "Build role is too long."
    );
  }

  if (
    badge.length > 120
  ) {
    redirectNewBuildError(
      "Badge is too long."
    );
  }

  if (
    price !== null &&
    (
      !Number.isSafeInteger(
        price
      ) ||
      price < 0
    )
  ) {
    redirectNewBuildError(
      "Price must be a whole number of 0 or greater, or left blank."
    );
  }

  if (
    imageUrl.length > 1000
  ) {
    redirectNewBuildError(
      "Image URL is too long."
    );
  }

  const specs =
    specsText
      .split("\n")
      .map((spec) =>
        spec.trim()
      )
      .filter(Boolean);

  if (
    specs.length === 0
  ) {
    redirectNewBuildError(
      "Add at least one specification."
    );
  }

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
    redirectNewBuildError(
      "Display order must be 0 or greater."
    );
  }

  if (
    !hasImageFile &&
    !hasImageUrl
  ) {
    redirectNewBuildError(
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
    redirectNewBuildError(
      "Please enter a valid image URL."
    );
  }

  let finalImageUrl =
    imageUrl;

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
      redirectNewBuildError(
        error instanceof Error
          ? error.message
          : "Image upload failed."
      );
    }
  }

  if (!finalImageUrl) {
    redirectNewBuildError(
      "Build image could not be processed."
    );
  }

  const id =
    makeBuildId(name);

  await db
    .insert(customBuilds)
    .values({
      id,
      name,
      role,

      badge:
        badge ||
        "CUSTOM BUILD",

      price,

      description,
      specs,

      image:
        finalImageUrl,

      isVisible,
      sortOrder,
    });

  revalidatePath(
    "/admin/builds"
  );

  revalidatePath("/");

  redirect(
    "/admin/builds"
  );
}

export async function updateBuild(
  formData: FormData
) {
  await requireAdmin();

  const buildId = String(
    formData.get(
      "buildId"
    ) ?? ""
  ).trim();

  if (!buildId) {
    redirect(
      "/admin/builds"
    );
  }

  const existingRows =
    await db
      .select()
      .from(customBuilds)
      .where(
        eq(
          customBuilds.id,
          buildId
        )
      )
      .limit(1);

  const existingBuild =
    existingRows[0];

  if (!existingBuild) {
    redirect(
      "/admin/builds"
    );
  }

  const name = String(
    formData.get("name") ?? ""
  ).trim();

  const role = String(
    formData.get("role") ?? ""
  ).trim();

  const badge = String(
    formData.get("badge") ?? ""
  ).trim();

  const priceRaw = String(
    formData.get("price") ?? ""
  ).trim();

  const price =
    priceRaw === ""
      ? null
      : Number(priceRaw);

  const description = String(
    formData.get(
      "description"
    ) ?? ""
  ).trim();

  const specsText = String(
    formData.get(
      "specs"
    ) ?? ""
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
    formData.get(
      "imageFile"
    );

  const imageFile =
    possibleImageFile instanceof
    File
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

  if (!name) {
    redirectEditBuildError(
      buildId,
      "Build name is required."
    );
  }

  if (!role) {
    redirectEditBuildError(
      buildId,
      "Build role is required."
    );
  }

  if (!description) {
    redirectEditBuildError(
      buildId,
      "Description is required."
    );
  }

  if (
    name.length > 255
  ) {
    redirectEditBuildError(
      buildId,
      "Build name is too long."
    );
  }

  if (
    role.length > 255
  ) {
    redirectEditBuildError(
      buildId,
      "Build role is too long."
    );
  }

  if (
    badge.length > 120
  ) {
    redirectEditBuildError(
      buildId,
      "Badge is too long."
    );
  }

  if (
    price !== null &&
    (
      !Number.isSafeInteger(
        price
      ) ||
      price < 0
    )
  ) {
    redirectEditBuildError(
      buildId,
      "Price must be a whole number of 0 or greater, or left blank."
    );
  }

  if (
    imageUrl.length > 1000
  ) {
    redirectEditBuildError(
      buildId,
      "Image URL is too long."
    );
  }

  if (
    hasImageUrl &&
    !isValidImageUrl(
      imageUrl
    )
  ) {
    redirectEditBuildError(
      buildId,
      "Please enter a valid image URL."
    );
  }

  const specs =
    specsText
      .split("\n")
      .map((spec) =>
        spec.trim()
      )
      .filter(Boolean);

  if (
    specs.length === 0
  ) {
    redirectEditBuildError(
      buildId,
      "Add at least one specification."
    );
  }

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
    redirectEditBuildError(
      buildId,
      "Display order must be 0 or greater."
    );
  }

  let finalImageUrl =
    existingBuild.image;

  if (hasImageUrl) {
    finalImageUrl =
      imageUrl;
  }

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
      redirectEditBuildError(
        buildId,
        error instanceof Error
          ? error.message
          : "Image upload failed."
      );
    }
  }

  await db
    .update(customBuilds)
    .set({
      name,
      role,

      badge:
        badge ||
        "CUSTOM BUILD",

      price,

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
        customBuilds.id,
        buildId
      )
    );

  revalidatePath(
    "/admin/builds"
  );

  revalidatePath(
    `/admin/builds/${buildId}/edit`
  );

  revalidatePath("/");

  redirect(
    "/admin/builds"
  );
}

export async function toggleBuildVisibility(
  formData: FormData
) {
  await requireAdmin();

  const buildId = String(
    formData.get(
      "buildId"
    ) ?? ""
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

export async function deleteBuild(
  formData: FormData
) {
  await requireAdmin();

  const buildId = String(
    formData.get(
      "buildId"
    ) ?? ""
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
"use server";

import { createHash } from "node:crypto";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { db } from "@/db";
import { heroSettings } from "@/db/schema";
import { requireAdmin } from "@/lib/admin-auth";

/* =========================================================
   SETTINGS
   ========================================================= */

const HERO_ID = "main";

const MAX_IMAGE_SIZE =
  5 * 1024 * 1024;

const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

/* =========================================================
   ERROR REDIRECT
   ========================================================= */

function redirectHeroError(
  message: string
): never {
  redirect(
    `/admin/content/hero?error=${encodeURIComponent(
      message
    )}`
  );
}

/* =========================================================
   IMAGE URL VALIDATION
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
   BUTTON LINK VALIDATION
   ========================================================= */

/*
 * We want to allow:
 *
 * #builds
 * #products
 * /products
 * /contact
 * https://example.com
 *
 * but reject dangerous values such as:
 *
 * javascript:...
 */

function isValidButtonLink(
  value: string
) {
  if (
    value.startsWith("#") ||
    value.startsWith("/")
  ) {
    return true;
  }

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
   UPLOAD HERO IMAGE
   ========================================================= */

async function uploadHeroImage(
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
      "Cloudinary image upload is not configured."
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
      "Hero image must be smaller than 5 MB."
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
    "gamex/hero";

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
        "Hero image upload failed."
    );
  }

  return result.secure_url;
}

/* =========================================================
   SAVE HERO SETTINGS
   ========================================================= */

export async function saveHeroSettings(
  formData: FormData
) {
  /* =======================================================
     SECURITY
     ======================================================= */

  await requireAdmin();

  /* =======================================================
     BASIC TEXT
     ======================================================= */

  const eyebrow = String(
    formData.get("eyebrow") ?? ""
  ).trim();

  const headingLine1 = String(
    formData.get("headingLine1") ?? ""
  ).trim();

  const headingLine2 = String(
    formData.get("headingLine2") ?? ""
  ).trim();

  const rotatingWordsText = String(
    formData.get("rotatingWords") ?? ""
  ).trim();

  const description = String(
    formData.get("description") ?? ""
  ).trim();

  /* =======================================================
     BUTTONS
     ======================================================= */

  const primaryButtonText = String(
    formData.get(
      "primaryButtonText"
    ) ?? ""
  ).trim();

  const primaryButtonLink = String(
    formData.get(
      "primaryButtonLink"
    ) ?? ""
  ).trim();

  const secondaryButtonText = String(
    formData.get(
      "secondaryButtonText"
    ) ?? ""
  ).trim();

  const secondaryButtonLink = String(
    formData.get(
      "secondaryButtonLink"
    ) ?? ""
  ).trim();

  /* =======================================================
     TRUST POINTS
     ======================================================= */

  const trustPoint1 = String(
    formData.get("trustPoint1") ?? ""
  ).trim();

  const trustPoint2 = String(
    formData.get("trustPoint2") ?? ""
  ).trim();

  const trustPoint3 = String(
    formData.get("trustPoint3") ?? ""
  ).trim();

  /* =======================================================
     IMAGE TEXT
     ======================================================= */

  const imageAlt = String(
    formData.get("imageAlt") ?? ""
  ).trim();

  const imageTitle = String(
    formData.get("imageTitle") ?? ""
  ).trim();

  const imageSubtitle = String(
    formData.get(
      "imageSubtitle"
    ) ?? ""
  ).trim();

  const imageBadge = String(
    formData.get("imageBadge") ?? ""
  ).trim();

  /* =======================================================
     FLOATING CHIP 1
     ======================================================= */

  const chip1Title = String(
    formData.get("chip1Title") ?? ""
  ).trim();

  const chip1Subtitle = String(
    formData.get(
      "chip1Subtitle"
    ) ?? ""
  ).trim();

  /* =======================================================
     FLOATING CHIP 2
     ======================================================= */

  const chip2Title = String(
    formData.get("chip2Title") ?? ""
  ).trim();

  const chip2Subtitle = String(
    formData.get(
      "chip2Subtitle"
    ) ?? ""
  ).trim();

  /* =======================================================
     FLOATING CHIP 3
     ======================================================= */

  const chip3Title = String(
    formData.get("chip3Title") ?? ""
  ).trim();

  const chip3Subtitle = String(
    formData.get(
      "chip3Subtitle"
    ) ?? ""
  ).trim();

  /* =======================================================
     VISIBILITY
     ======================================================= */

  const isVisible =
    formData.get("isVisible") ===
    "on";

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
     ROTATING WORDS
     ======================================================= */

  /*
   * The admin form will contain one rotating
   * Hero word per line.
   */

  const rotatingWords =
    rotatingWordsText
      .split("\n")
      .map((word) =>
        word.trim()
      )
      .filter(Boolean);

  /* =======================================================
     REQUIRED FIELD VALIDATION
     ======================================================= */

  if (!eyebrow) {
    redirectHeroError(
      "Hero eyebrow text is required."
    );
  }

  if (!headingLine1) {
    redirectHeroError(
      "Heading line 1 is required."
    );
  }

  if (!headingLine2) {
    redirectHeroError(
      "Heading line 2 is required."
    );
  }

  if (
    rotatingWords.length === 0
  ) {
    redirectHeroError(
      "Add at least one rotating word."
    );
  }

  if (!description) {
    redirectHeroError(
      "Hero description is required."
    );
  }

  if (!primaryButtonText) {
    redirectHeroError(
      "Primary button text is required."
    );
  }

  if (!primaryButtonLink) {
    redirectHeroError(
      "Primary button link is required."
    );
  }

  if (!secondaryButtonText) {
    redirectHeroError(
      "Secondary button text is required."
    );
  }

  if (!secondaryButtonLink) {
    redirectHeroError(
      "Secondary button link is required."
    );
  }

  if (!trustPoint1) {
    redirectHeroError(
      "Trust point 1 is required."
    );
  }

  if (!trustPoint2) {
    redirectHeroError(
      "Trust point 2 is required."
    );
  }

  if (!trustPoint3) {
    redirectHeroError(
      "Trust point 3 is required."
    );
  }

  if (!imageAlt) {
    redirectHeroError(
      "Hero image alt text is required."
    );
  }

  if (!imageTitle) {
    redirectHeroError(
      "Image title is required."
    );
  }

  if (!imageSubtitle) {
    redirectHeroError(
      "Image subtitle is required."
    );
  }

  if (!imageBadge) {
    redirectHeroError(
      "Image badge is required."
    );
  }

  if (!chip1Title) {
    redirectHeroError(
      "Floating chip 1 title is required."
    );
  }

  if (!chip1Subtitle) {
    redirectHeroError(
      "Floating chip 1 subtitle is required."
    );
  }

  if (!chip2Title) {
    redirectHeroError(
      "Floating chip 2 title is required."
    );
  }

  if (!chip2Subtitle) {
    redirectHeroError(
      "Floating chip 2 subtitle is required."
    );
  }

  if (!chip3Title) {
    redirectHeroError(
      "Floating chip 3 title is required."
    );
  }

  if (!chip3Subtitle) {
    redirectHeroError(
      "Floating chip 3 subtitle is required."
    );
  }

  /* =======================================================
     LENGTH VALIDATION
     ======================================================= */

  if (eyebrow.length > 255) {
    redirectHeroError(
      "Eyebrow text is too long."
    );
  }

  if (
    headingLine1.length > 255 ||
    headingLine2.length > 255
  ) {
    redirectHeroError(
      "Hero heading is too long."
    );
  }

  if (
    primaryButtonText.length >
      120 ||
    secondaryButtonText.length >
      120
  ) {
    redirectHeroError(
      "Button text is too long."
    );
  }

  if (
    primaryButtonLink.length >
      500 ||
    secondaryButtonLink.length >
      500
  ) {
    redirectHeroError(
      "Button link is too long."
    );
  }

  if (
    trustPoint1.length > 255 ||
    trustPoint2.length > 255 ||
    trustPoint3.length > 255
  ) {
    redirectHeroError(
      "A trust point is too long."
    );
  }

  if (imageUrl.length > 1000) {
    redirectHeroError(
      "Image URL is too long."
    );
  }

  if (imageAlt.length > 500) {
    redirectHeroError(
      "Image alt text is too long."
    );
  }

  if (
    imageTitle.length > 255 ||
    imageSubtitle.length > 255
  ) {
    redirectHeroError(
      "Hero image text is too long."
    );
  }

  if (imageBadge.length > 120) {
    redirectHeroError(
      "Image badge is too long."
    );
  }

  if (
    chip1Title.length > 255 ||
    chip1Subtitle.length > 255 ||
    chip2Title.length > 255 ||
    chip2Subtitle.length > 255 ||
    chip3Title.length > 255 ||
    chip3Subtitle.length > 255
  ) {
    redirectHeroError(
      "Floating chip text is too long."
    );
  }

  /* =======================================================
     ROTATING WORD VALIDATION
     ======================================================= */

  if (
    rotatingWords.some(
      (word) => word.length > 100
    )
  ) {
    redirectHeroError(
      "Each rotating word must be 100 characters or fewer."
    );
  }

  /* =======================================================
     LINK VALIDATION
     ======================================================= */

  if (
    !isValidButtonLink(
      primaryButtonLink
    )
  ) {
    redirectHeroError(
      "Primary button link is invalid."
    );
  }

  if (
    !isValidButtonLink(
      secondaryButtonLink
    )
  ) {
    redirectHeroError(
      "Secondary button link is invalid."
    );
  }

  /* =======================================================
     IMAGE URL VALIDATION
     ======================================================= */

  if (
    hasImageUrl &&
    !isValidImageUrl(imageUrl)
  ) {
    redirectHeroError(
      "Please enter a valid Hero image URL."
    );
  }

  /* =======================================================
     LOAD CURRENT HERO
     ======================================================= */

  const currentRows =
    await db
      .select()
      .from(heroSettings)
      .where(
        eq(
          heroSettings.id,
          HERO_ID
        )
      )
      .limit(1);

  const currentHero =
    currentRows[0];

  /* =======================================================
     DETERMINE FINAL IMAGE
     ======================================================= */

  /*
   * If the Hero already exists, keep the
   * current image by default.
   */

  let finalImage =
    currentHero?.image ?? "";

  /*
   * A new URL replaces the current image.
   */

  if (hasImageUrl) {
    finalImage =
      imageUrl;
  }

  /*
   * A PC upload takes priority over both
   * the old image and a newly supplied URL.
   */

  if (
    hasImageFile &&
    imageFile
  ) {
    try {
      finalImage =
        await uploadHeroImage(
          imageFile
        );
    } catch (error) {
      redirectHeroError(
        error instanceof Error
          ? error.message
          : "Hero image upload failed."
      );
    }
  }

  /* =======================================================
     FIRST SAVE NEEDS AN IMAGE
     ======================================================= */

  if (!finalImage) {
    redirectHeroError(
      "Please upload a Hero image or enter an image URL."
    );
  }

  /* =======================================================
     SAVE TO NEON
     ======================================================= */

  const now =
    new Date();

  await db
    .insert(heroSettings)
    .values({
      id: HERO_ID,

      eyebrow,

      headingLine1,
      headingLine2,
      rotatingWords,

      description,

      primaryButtonText,
      primaryButtonLink,

      secondaryButtonText,
      secondaryButtonLink,

      trustPoint1,
      trustPoint2,
      trustPoint3,

      image: finalImage,
      imageAlt,

      imageTitle,
      imageSubtitle,
      imageBadge,

      chip1Title,
      chip1Subtitle,

      chip2Title,
      chip2Subtitle,

      chip3Title,
      chip3Subtitle,

      isVisible,

      updatedAt: now,
    })
    .onConflictDoUpdate({
      target:
        heroSettings.id,

      set: {
        eyebrow,

        headingLine1,
        headingLine2,
        rotatingWords,

        description,

        primaryButtonText,
        primaryButtonLink,

        secondaryButtonText,
        secondaryButtonLink,

        trustPoint1,
        trustPoint2,
        trustPoint3,

        image: finalImage,
        imageAlt,

        imageTitle,
        imageSubtitle,
        imageBadge,

        chip1Title,
        chip1Subtitle,

        chip2Title,
        chip2Subtitle,

        chip3Title,
        chip3Subtitle,

        isVisible,

        updatedAt: now,
      },
    });

  /* =======================================================
     REFRESH WEBSITE
     ======================================================= */

  revalidatePath("/");
  revalidatePath(
    "/admin/content/hero"
  );

  /* =======================================================
     SUCCESS
     ======================================================= */

  redirect(
    "/admin/content/hero?saved=1"
  );
}
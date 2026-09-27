"use server";

import {
  createHash,
} from "node:crypto";

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
  heroMedia,
  heroSettings,
} from "@/db/schema";

import {
  requireAdmin,
} from "@/lib/admin-auth";

/* =========================================================
   CONSTANTS
   ========================================================= */

const HERO_ID =
  "main";

const MAX_HERO_MEDIA =
  10;

const HERO_MEDIA_FOLDER =
  "gamex/hero-media";

/*
 * The old columns still exist in hero_settings.
 *
 * We preserve them for database compatibility,
 * but Hero.tsx no longer displays the floating cards.
 */
const LEGACY_HERO_DEFAULTS = {
  image:
    "https://images.pexels.com/photos/34301924/pexels-photo-34301924.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",

  imageAlt:
    "Gamex gaming hardware",

  imageTitle:
    "Gamex",

  imageSubtitle:
    "Gaming Hardware",

  imageBadge:
    "Live",

  chip1Title:
    "Performance",

  chip1Subtitle:
    "Gaming Hardware",

  chip2Title:
    "Gamex",

  chip2Subtitle:
    "Custom Gaming",

  chip3Title:
    "Ready",

  chip3Subtitle:
    "Built to Win",
};

export type HeroMediaType =
  | "image"
  | "video";

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
   BUTTON LINK VALIDATION
   ========================================================= */

function isValidButtonLink(
  value: string
) {
  if (
    value.startsWith(
      "#"
    ) ||
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
   MEDIA URL VALIDATION
   ========================================================= */

function isValidMediaUrl(
  value: string
) {
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
   MEDIA TYPE VALIDATION
   ========================================================= */

function isHeroMediaType(
  value: string
): value is HeroMediaType {
  return (
    value ===
      "image" ||
    value ===
      "video"
  );
}

/* =========================================================
   ID VALIDATION
   ========================================================= */

function parseId(
  value: number
) {
  if (
    !Number.isInteger(
      value
    ) ||
    value <= 0
  ) {
    throw new Error(
      "Invalid Hero media item."
    );
  }

  return value;
}

/* =========================================================
   SORT ORDER VALIDATION
   ========================================================= */

function parseSortOrder(
  value: number
) {
  if (
    !Number.isInteger(
      value
    ) ||
    value < 0 ||
    value > 9999
  ) {
    throw new Error(
      "Display order must be between 0 and 9999."
    );
  }

  return value;
}

/* =========================================================
   REVALIDATE
   ========================================================= */

function refreshHero() {
  revalidatePath(
    "/"
  );

  revalidatePath(
    "/admin/content/hero"
  );
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

  return createHash(
    "sha1"
  )
    .update(
      stringToSign
    )
    .digest(
      "hex"
    );
}

/* =========================================================
   SAVE HERO TEXT SETTINGS
   ========================================================= */

export async function saveHeroSettings(
  formData: FormData
) {
  await requireAdmin();

  /* =======================================================
     BASIC TEXT
     ======================================================= */

  const eyebrow =
    getText(
      formData,
      "eyebrow"
    );

  const headingLine1 =
    getText(
      formData,
      "headingLine1"
    );

  const headingLine2 =
    getText(
      formData,
      "headingLine2"
    );

  const rotatingWords =
    getText(
      formData,
      "rotatingWords"
    )
      .split(
        "\n"
      )
      .map(
        (
          word
        ) =>
          word.trim()
      )
      .filter(
        Boolean
      );

  const description =
    getText(
      formData,
      "description"
    );

  /* =======================================================
     BUTTONS
     ======================================================= */

  const primaryButtonText =
    getText(
      formData,
      "primaryButtonText"
    );

  const primaryButtonLink =
    getText(
      formData,
      "primaryButtonLink"
    );

  const secondaryButtonText =
    getText(
      formData,
      "secondaryButtonText"
    );

  const secondaryButtonLink =
    getText(
      formData,
      "secondaryButtonLink"
    );

  /* =======================================================
     TRUST POINTS
     ======================================================= */

  const trustPoint1 =
    getText(
      formData,
      "trustPoint1"
    );

  const trustPoint2 =
    getText(
      formData,
      "trustPoint2"
    );

  const trustPoint3 =
    getText(
      formData,
      "trustPoint3"
    );

  const isVisible =
    formData.get(
      "isVisible"
    ) === "on";

  /* =======================================================
     REQUIRED VALIDATION
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
    rotatingWords.length ===
    0
  ) {
    redirectHeroError(
      "Add at least one rotating word."
    );
  }

  if (
    rotatingWords.length >
    12
  ) {
    redirectHeroError(
      "Use no more than 12 rotating words."
    );
  }

  if (
    rotatingWords.some(
      (
        word
      ) =>
        word.length >
        100
    )
  ) {
    redirectHeroError(
      "Each rotating word must be 100 characters or fewer."
    );
  }

  if (!description) {
    redirectHeroError(
      "Hero description is required."
    );
  }

  if (
    !primaryButtonText ||
    !primaryButtonLink ||
    !secondaryButtonText ||
    !secondaryButtonLink
  ) {
    redirectHeroError(
      "Both Hero buttons need text and a link."
    );
  }

  if (
    !isValidButtonLink(
      primaryButtonLink
    ) ||
    !isValidButtonLink(
      secondaryButtonLink
    )
  ) {
    redirectHeroError(
      "One of the Hero button links is invalid."
    );
  }

  if (
    !trustPoint1 ||
    !trustPoint2 ||
    !trustPoint3
  ) {
    redirectHeroError(
      "All three trust points are required."
    );
  }

  /* =======================================================
     LENGTH VALIDATION
     ======================================================= */

  if (
    eyebrow.length >
      255 ||
    headingLine1.length >
      255 ||
    headingLine2.length >
      255
  ) {
    redirectHeroError(
      "A Hero heading field is too long."
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
    trustPoint1.length >
      255 ||
    trustPoint2.length >
      255 ||
    trustPoint3.length >
      255
  ) {
    redirectHeroError(
      "A trust point is too long."
    );
  }

  /* =======================================================
     LOAD CURRENT HERO
     ======================================================= */

  const currentRows =
    await db
      .select()
      .from(
        heroSettings
      )
      .where(
        eq(
          heroSettings.id,
          HERO_ID
        )
      )
      .limit(
        1
      );

  const current =
    currentRows[0];

  const now =
    new Date();

  /*
   * These old image/chip values are preserved because
   * their existing database columns are NOT NULL.
   *
   * They are no longer rendered publicly.
   */
  const updateValues = {
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

    image:
      current?.image ??
      LEGACY_HERO_DEFAULTS.image,

    imageAlt:
      current?.imageAlt ??
      LEGACY_HERO_DEFAULTS.imageAlt,

    imageTitle:
      current?.imageTitle ??
      LEGACY_HERO_DEFAULTS.imageTitle,

    imageSubtitle:
      current?.imageSubtitle ??
      LEGACY_HERO_DEFAULTS.imageSubtitle,

    imageBadge:
      current?.imageBadge ??
      LEGACY_HERO_DEFAULTS.imageBadge,

    chip1Title:
      current?.chip1Title ??
      LEGACY_HERO_DEFAULTS.chip1Title,

    chip1Subtitle:
      current?.chip1Subtitle ??
      LEGACY_HERO_DEFAULTS.chip1Subtitle,

    chip2Title:
      current?.chip2Title ??
      LEGACY_HERO_DEFAULTS.chip2Title,

    chip2Subtitle:
      current?.chip2Subtitle ??
      LEGACY_HERO_DEFAULTS.chip2Subtitle,

    chip3Title:
      current?.chip3Title ??
      LEGACY_HERO_DEFAULTS.chip3Title,

    chip3Subtitle:
      current?.chip3Subtitle ??
      LEGACY_HERO_DEFAULTS.chip3Subtitle,

    isVisible,

    updatedAt:
      now,
  };

  /* =======================================================
     SAVE
     ======================================================= */

  await db
    .insert(
      heroSettings
    )
    .values({
      id:
        HERO_ID,

      ...updateValues,
    })
    .onConflictDoUpdate({
      target:
        heroSettings.id,

      set:
        updateValues,
    });

  refreshHero();

  redirect(
    "/admin/content/hero?saved=1"
  );
}

/* =========================================================
   DIRECT CLOUDINARY UPLOAD SIGNATURE

   The browser uploads the media directly to Cloudinary.

   This means large videos do NOT pass through Vercel.
   ========================================================= */

export async function getHeroMediaUploadSignature(
  mediaType: HeroMediaType
) {
  await requireAdmin();

  if (
    !isHeroMediaType(
      mediaType
    )
  ) {
    throw new Error(
      "Unsupported Hero media type."
    );
  }

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
      "Cloudinary is not configured."
    );
  }

  const timestamp =
    Math.floor(
      Date.now() /
        1000
    );

  const signature =
    createCloudinarySignature({
      timestamp,

      folder:
        HERO_MEDIA_FOLDER,

      apiSecret,
    });

  return {
    cloudName,

    apiKey,

    timestamp,

    folder:
      HERO_MEDIA_FOLDER,

    signature,

    /*
     * Cloudinary endpoint becomes:
     *
     * /image/upload
     * or
     * /video/upload
     */
    resourceType:
      mediaType,
  };
}

/* =========================================================
   CREATE HERO MEDIA
   ========================================================= */

export async function createHeroMedia(
  input: {
    mediaType: HeroMediaType;

    url: string;

    alt: string;

    sortOrder: number;
  }
) {
  await requireAdmin();

  const mediaType =
    input.mediaType;

  const url =
    input.url.trim();

  const alt =
    input.alt.trim();

  const sortOrder =
    parseSortOrder(
      input.sortOrder
    );

  if (
    !isHeroMediaType(
      mediaType
    )
  ) {
    throw new Error(
      "Choose Image or Video."
    );
  }

  if (
    !url ||
    !isValidMediaUrl(
      url
    )
  ) {
    throw new Error(
      "Please enter a valid media URL."
    );
  }

  if (
    url.length >
    2000
  ) {
    throw new Error(
      "Media URL is too long."
    );
  }

  if (
    alt.length >
    500
  ) {
    throw new Error(
      "Media description is too long."
    );
  }

  /* =======================================================
     MAXIMUM 10
     ======================================================= */

  const existing =
    await db
      .select({
        id:
          heroMedia.id,
      })
      .from(
        heroMedia
      );

  if (
    existing.length >=
    MAX_HERO_MEDIA
  ) {
    throw new Error(
      "The Hero slider supports a maximum of 10 media items."
    );
  }

  await db
    .insert(
      heroMedia
    )
    .values({
      mediaType,

      url,

      alt,

      sortOrder,

      isVisible:
        true,
    });

  refreshHero();

  return {
    success:
      true,
  };
}

/* =========================================================
   UPDATE HERO MEDIA
   ========================================================= */

export async function updateHeroMedia(
  input: {
    id: number;

    alt: string;

    sortOrder: number;

    isVisible: boolean;
  }
) {
  await requireAdmin();

  const id =
    parseId(
      input.id
    );

  const alt =
    input.alt.trim();

  const sortOrder =
    parseSortOrder(
      input.sortOrder
    );

  if (
    alt.length >
    500
  ) {
    throw new Error(
      "Media description is too long."
    );
  }

  await db
    .update(
      heroMedia
    )
    .set({
      alt,

      sortOrder,

      isVisible:
        input.isVisible,

      updatedAt:
        new Date(),
    })
    .where(
      eq(
        heroMedia.id,
        id
      )
    );

  refreshHero();

  return {
    success:
      true,
  };
}

/* =========================================================
   TOGGLE HERO MEDIA
   ========================================================= */

export async function toggleHeroMediaVisibility(
  idValue: number
) {
  await requireAdmin();

  const id =
    parseId(
      idValue
    );

  const rows =
    await db
      .select({
        isVisible:
          heroMedia.isVisible,
      })
      .from(
        heroMedia
      )
      .where(
        eq(
          heroMedia.id,
          id
        )
      )
      .limit(
        1
      );

  const item =
    rows[0];

  if (!item) {
    throw new Error(
      "Hero media item not found."
    );
  }

  await db
    .update(
      heroMedia
    )
    .set({
      isVisible:
        !item.isVisible,

      updatedAt:
        new Date(),
    })
    .where(
      eq(
        heroMedia.id,
        id
      )
    );

  refreshHero();

  return {
    success:
      true,
  };
}

/* =========================================================
   DELETE HERO MEDIA
   ========================================================= */

export async function deleteHeroMedia(
  idValue: number
) {
  await requireAdmin();

  const id =
    parseId(
      idValue
    );

  await db
    .delete(
      heroMedia
    )
    .where(
      eq(
        heroMedia.id,
        id
      )
    );

  refreshHero();

  return {
    success:
      true,
  };
}
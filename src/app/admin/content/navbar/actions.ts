"use server";

import { createHash } from "crypto";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { db } from "@/db";

import {
  navbarLinks,
  navbarSettings,
} from "@/db/schema";

import { requireAdmin } from "@/lib/admin-auth";

/* =========================================================
   CONSTANTS
   ========================================================= */

const NAVBAR_SETTINGS_ID = "main";

const MAX_IMAGE_SIZE =
  5 * 1024 * 1024;

const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

/* =========================================================
   DEFAULT NAVIGATION
   ========================================================= */

const DEFAULT_NAV_LINKS = [
  {
    label: "Home",
    href: "#home",
    sortOrder: 0,
  },
  {
    label: "Products",
    href: "#products",
    sortOrder: 1,
  },
  {
    label: "Custom Builds",
    href: "#builds",
    sortOrder: 2,
  },
  {
    label: "Why Gamex",
    href: "#features",
    sortOrder: 3,
  },
  {
    label: "Blog",
    href: "#blog",
    sortOrder: 4,
  },
  {
    label: "Contact",
    href: "#contact",
    sortOrder: 5,
  },
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

/* =========================================================
   REDIRECT WITH ERROR
   ========================================================= */

function redirectNavbarError(
  message: string
): never {
  redirect(
    `/admin/content/navbar?error=${encodeURIComponent(
      message
    )}`
  );
}

/* =========================================================
   LINK ERROR
   ========================================================= */

function redirectLinkError(
  message: string
): never {
  redirect(
    `/admin/content/navbar?error=${encodeURIComponent(
      message
    )}#navbar-links`
  );
}

/* =========================================================
   VALID HREF
   ========================================================= */

/*
 * Navbar links may be:
 *
 * #products
 * /shop
 * https://example.com
 * http://example.com
 *
 * We reject unsafe schemes such as javascript:
 */

function isValidHref(
  value: string
) {
  const href =
    value.trim();

  if (!href) {
    return false;
  }

  if (
    href.startsWith("#") ||
    href.startsWith("/")
  ) {
    return true;
  }

  try {
    const url =
      new URL(href);

    return (
      url.protocol === "https:" ||
      url.protocol === "http:"
    );
  } catch {
    return false;
  }
}

/* =========================================================
   OPTIONAL IMAGE URL
   ========================================================= */

function isValidOptionalImageUrl(
  value: string
) {
  if (!value) {
    return true;
  }

  try {
    const url =
      new URL(value);

    return (
      url.protocol === "https:" ||
      url.protocol === "http:"
    );
  } catch {
    return false;
  }
}

/* =========================================================
   SORT ORDER
   ========================================================= */

function parseSortOrder(
  formData: FormData
) {
  const raw =
    getText(
      formData,
      "sortOrder"
    );

  if (!raw) {
    return 0;
  }

  const value =
    Number.parseInt(
      raw,
      10
    );

  if (
    !Number.isFinite(value) ||
    value < 0
  ) {
    redirectLinkError(
      "Display order must be zero or greater."
    );
  }

  return value;
}

/* =========================================================
   LINK ID
   ========================================================= */

function parseLinkId(
  formData: FormData
) {
  const raw =
    getText(
      formData,
      "linkId"
    );

  const id =
    Number.parseInt(
      raw,
      10
    );

  if (
    !Number.isFinite(id) ||
    id <= 0
  ) {
    redirectLinkError(
      "Invalid navigation link."
    );
  }

  return id;
}

/* =========================================================
   CLOUDINARY SIGNATURE
   ========================================================= */

function createCloudinarySignature(
  timestamp: number,
  folder: string,
  apiSecret: string
) {
  const signatureString =
    `folder=${folder}&timestamp=${timestamp}${apiSecret}`;

  return createHash("sha1")
    .update(signatureString)
    .digest("hex");
}

/* =========================================================
   UPLOAD NAVBAR LOGO
   ========================================================= */

async function uploadNavbarLogo(
  file: File
) {
  /* =======================================================
     FILE VALIDATION
     ======================================================= */

  if (
    !ALLOWED_IMAGE_TYPES.includes(
      file.type
    )
  ) {
    redirectNavbarError(
      "Logo must be JPG, PNG, or WebP."
    );
  }

  if (
    file.size >
    MAX_IMAGE_SIZE
  ) {
    redirectNavbarError(
      "Logo image must be 5 MB or smaller."
    );
  }

  /* =======================================================
     CLOUDINARY CONFIG
     ======================================================= */

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
    redirectNavbarError(
      "Cloudinary is not configured."
    );
  }

  /* =======================================================
     SIGNED UPLOAD
     ======================================================= */

  const timestamp =
    Math.floor(
      Date.now() / 1000
    );

  const folder =
    "gamex/navbar";

  const signature =
    createCloudinarySignature(
      timestamp,
      folder,
      apiSecret
    );

  const uploadData =
    new FormData();

  uploadData.append(
    "file",
    file
  );

  uploadData.append(
    "api_key",
    apiKey
  );

  uploadData.append(
    "timestamp",
    String(timestamp)
  );

  uploadData.append(
    "folder",
    folder
  );

  uploadData.append(
    "signature",
    signature
  );

  const response =
    await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: "POST",
        body: uploadData,
      }
    );

  if (!response.ok) {
    redirectNavbarError(
      "Logo upload failed. Please try again."
    );
  }

  const result =
    (await response.json()) as {
      secure_url?: string;
    };

  if (!result.secure_url) {
    redirectNavbarError(
      "Cloudinary did not return a logo URL."
    );
  }

  return result.secure_url;
}

/* =========================================================
   REFRESH
   ========================================================= */

function refreshNavbarPages() {
  revalidatePath(
    "/admin/content/navbar"
  );

  revalidatePath("/");
}

/* =========================================================
   SAVE NAVBAR SETTINGS
   ========================================================= */

export async function saveNavbarSettings(
  formData: FormData
) {
  await requireAdmin();

  /* =======================================================
     BRAND
     ======================================================= */

  const brandText =
    getText(
      formData,
      "brandText"
    );

  const brandHref =
    getText(
      formData,
      "brandHref"
    );

  const logoAlt =
    getText(
      formData,
      "logoAlt"
    );

  /* =======================================================
     CTA
     ======================================================= */

  const ctaText =
    getText(
      formData,
      "ctaText"
    );

  const ctaHref =
    getText(
      formData,
      "ctaHref"
    );

  const ctaVisible =
    formData.get(
      "ctaVisible"
    ) === "on";

  const isVisible =
    formData.get(
      "isVisible"
    ) === "on";

  /* =======================================================
     REQUIRED VALIDATION
     ======================================================= */

  if (!brandText) {
    redirectNavbarError(
      "Brand text is required."
    );
  }

  if (
    brandText.length >
    120
  ) {
    redirectNavbarError(
      "Brand text is too long."
    );
  }

  if (!brandHref) {
    redirectNavbarError(
      "Brand link is required."
    );
  }

  if (
    brandHref.length >
    500 ||
    !isValidHref(
      brandHref
    )
  ) {
    redirectNavbarError(
      "Please enter a valid brand link."
    );
  }

  if (!logoAlt) {
    redirectNavbarError(
      "Logo alt text is required."
    );
  }

  if (
    logoAlt.length >
    255
  ) {
    redirectNavbarError(
      "Logo alt text is too long."
    );
  }

  if (!ctaText) {
    redirectNavbarError(
      "CTA button text is required."
    );
  }

  if (
    ctaText.length >
    120
  ) {
    redirectNavbarError(
      "CTA button text is too long."
    );
  }

  if (!ctaHref) {
    redirectNavbarError(
      "CTA button link is required."
    );
  }

  if (
    ctaHref.length >
    500 ||
    !isValidHref(
      ctaHref
    )
  ) {
    redirectNavbarError(
      "Please enter a valid CTA link."
    );
  }

  /* =======================================================
     LOGO

     Priority:

     1. uploaded file
     2. entered image URL
     3. existing logo
     4. empty → default Gamepad icon
     ======================================================= */

  const currentLogoImage =
    getText(
      formData,
      "currentLogoImage"
    );

  const logoImageUrl =
    getText(
      formData,
      "logoImageUrl"
    );

  const removeLogo =
    formData.get(
      "removeLogo"
    ) === "on";

  if (
    logoImageUrl.length >
    1000
  ) {
    redirectNavbarError(
      "Logo image URL is too long."
    );
  }

  if (
    !isValidOptionalImageUrl(
      logoImageUrl
    )
  ) {
    redirectNavbarError(
      "Please enter a valid logo image URL."
    );
  }

  const logoFileValue =
    formData.get(
      "logoFile"
    );

  let logoImage =
    currentLogoImage;

  /*
   * Explicit remove checkbox.
   */

  if (removeLogo) {
    logoImage = "";
  }

  /*
   * URL replaces current image.
   */

  if (logoImageUrl) {
    logoImage =
      logoImageUrl;
  }

  /*
   * Uploaded file has highest priority.
   */

  if (
    logoFileValue instanceof
      File &&
    logoFileValue.size > 0
  ) {
    logoImage =
      await uploadNavbarLogo(
        logoFileValue
      );
  }

  /* =======================================================
     SAVE
     ======================================================= */

  await db
    .insert(
      navbarSettings
    )
    .values({
      id:
        NAVBAR_SETTINGS_ID,

      brandText,
      brandHref,

      logoImage,
      logoAlt,

      ctaText,
      ctaHref,
      ctaVisible,

      isVisible,
    })
    .onConflictDoUpdate({
      target:
        navbarSettings.id,

      set: {
        brandText,
        brandHref,

        logoImage,
        logoAlt,

        ctaText,
        ctaHref,
        ctaVisible,

        isVisible,

        updatedAt:
          new Date(),
      },
    });

  refreshNavbarPages();

  redirect(
    "/admin/content/navbar?saved=1"
  );
}

/* =========================================================
   CREATE NAV LINK
   ========================================================= */

export async function createNavbarLink(
  formData: FormData
) {
  await requireAdmin();

  const label =
    getText(
      formData,
      "label"
    );

  const href =
    getText(
      formData,
      "href"
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
     VALIDATE
     ======================================================= */

  if (!label) {
    redirectLinkError(
      "Navigation label is required."
    );
  }

  if (
    label.length >
    120
  ) {
    redirectLinkError(
      "Navigation label is too long."
    );
  }

  if (!href) {
    redirectLinkError(
      "Navigation link is required."
    );
  }

  if (
    href.length >
    500 ||
    !isValidHref(href)
  ) {
    redirectLinkError(
      "Please enter a valid navigation link."
    );
  }

  /* =======================================================
     INSERT
     ======================================================= */

  await db
    .insert(
      navbarLinks
    )
    .values({
      label,
      href,
      sortOrder,
      isVisible,
    });

  refreshNavbarPages();

  redirect(
    "/admin/content/navbar?linkCreated=1#navbar-links"
  );
}

/* =========================================================
   UPDATE NAV LINK
   ========================================================= */

export async function updateNavbarLink(
  formData: FormData
) {
  await requireAdmin();

  const id =
    parseLinkId(
      formData
    );

  const existing =
    await db
      .select({
        id:
          navbarLinks.id,
      })
      .from(
        navbarLinks
      )
      .where(
        eq(
          navbarLinks.id,
          id
        )
      )
      .limit(1);

  if (!existing[0]) {
    redirectLinkError(
      "Navigation link could not be found."
    );
  }

  const label =
    getText(
      formData,
      "label"
    );

  const href =
    getText(
      formData,
      "href"
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
     VALIDATE
     ======================================================= */

  if (!label) {
    redirectLinkError(
      "Navigation label is required."
    );
  }

  if (
    label.length >
    120
  ) {
    redirectLinkError(
      "Navigation label is too long."
    );
  }

  if (!href) {
    redirectLinkError(
      "Navigation link is required."
    );
  }

  if (
    href.length >
    500 ||
    !isValidHref(href)
  ) {
    redirectLinkError(
      "Please enter a valid navigation link."
    );
  }

  /* =======================================================
     UPDATE
     ======================================================= */

  await db
    .update(
      navbarLinks
    )
    .set({
      label,
      href,
      sortOrder,
      isVisible,

      updatedAt:
        new Date(),
    })
    .where(
      eq(
        navbarLinks.id,
        id
      )
    );

  refreshNavbarPages();

  redirect(
    "/admin/content/navbar?linkUpdated=1#navbar-links"
  );
}

/* =========================================================
   TOGGLE NAV LINK VISIBILITY
   ========================================================= */

export async function toggleNavbarLinkVisibility(
  formData: FormData
) {
  await requireAdmin();

  const id =
    parseLinkId(
      formData
    );

  const rows =
    await db
      .select({
        isVisible:
          navbarLinks.isVisible,
      })
      .from(
        navbarLinks
      )
      .where(
        eq(
          navbarLinks.id,
          id
        )
      )
      .limit(1);

  const link =
    rows[0];

  if (!link) {
    redirectLinkError(
      "Navigation link could not be found."
    );
  }

  await db
    .update(
      navbarLinks
    )
    .set({
      isVisible:
        !link.isVisible,

      updatedAt:
        new Date(),
    })
    .where(
      eq(
        navbarLinks.id,
        id
      )
    );

  refreshNavbarPages();

  redirect(
    "/admin/content/navbar?visibilityUpdated=1#navbar-links"
  );
}

/* =========================================================
   DELETE NAV LINK
   ========================================================= */

export async function deleteNavbarLink(
  formData: FormData
) {
  await requireAdmin();

  const id =
    parseLinkId(
      formData
    );

  const existing =
    await db
      .select({
        id:
          navbarLinks.id,
      })
      .from(
        navbarLinks
      )
      .where(
        eq(
          navbarLinks.id,
          id
        )
      )
      .limit(1);

  if (!existing[0]) {
    redirectLinkError(
      "Navigation link could not be found."
    );
  }

  await db
    .delete(
      navbarLinks
    )
    .where(
      eq(
        navbarLinks.id,
        id
      )
    );

  refreshNavbarPages();

  redirect(
    "/admin/content/navbar?linkDeleted=1#navbar-links"
  );
}

/* =========================================================
   IMPORT DEFAULT NAVBAR LINKS
   ========================================================= */

export async function createDefaultNavbarLinks() {
  await requireAdmin();

  /* =======================================================
     DO NOT DUPLICATE EXISTING LINKS
     ======================================================= */

  const existing =
    await db
      .select({
        id:
          navbarLinks.id,
      })
      .from(
        navbarLinks
      )
      .limit(1);

  if (existing.length > 0) {
    redirectLinkError(
      "Navigation links already exist. Delete them first if you want to import the defaults."
    );
  }

  /* =======================================================
     INSERT ORIGINAL GAME X LINKS
     ======================================================= */

  await db
    .insert(
      navbarLinks
    )
    .values(
      DEFAULT_NAV_LINKS.map(
        (link) => ({
          ...link,
          isVisible: true,
        })
      )
    );

  refreshNavbarPages();

  redirect(
    "/admin/content/navbar?defaultsCreated=1#navbar-links"
  );
}
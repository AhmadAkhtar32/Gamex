"use server";

import { createHash } from "crypto";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { db } from "@/db";

import {
  footerLinks,
  footerSettings,
  footerSocialLinks,
} from "@/db/schema";

import { requireAdmin } from "@/lib/admin-auth";

/* =========================================================
   CONSTANTS
   ========================================================= */

const FOOTER_SETTINGS_ID = "main";

const MAX_IMAGE_SIZE =
  5 * 1024 * 1024;

const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

/* =========================================================
   SOCIAL PLATFORMS
   ========================================================= */

const SOCIAL_PLATFORMS = [
  "instagram",
  "tiktok",
  "facebook",
  "youtube",
  "x",
  "twitch",
  "discord",
  "whatsapp",
  "linkedin",
] as const;

type SocialPlatform =
  (typeof SOCIAL_PLATFORMS)[number];

/* =========================================================
   DEFAULT FOOTER LINKS
   ========================================================= */

const DEFAULT_FOOTER_LINKS = [
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
   REDIRECT HELPERS
   ========================================================= */

function redirectFooterError(
  message: string
): never {
  redirect(
    `/admin/content/footer?error=${encodeURIComponent(
      message
    )}`
  );
}

function redirectLinkError(
  message: string
): never {
  redirect(
    `/admin/content/footer?error=${encodeURIComponent(
      message
    )}#footer-links`
  );
}

function redirectSocialError(
  message: string
): never {
  redirect(
    `/admin/content/footer?error=${encodeURIComponent(
      message
    )}#footer-social-links`
  );
}

/* =========================================================
   SAFE LINK VALIDATION
   ========================================================= */

function isValidHref(
  value: string
) {
  const href =
    value.trim();

  if (!href) {
    return false;
  }

  /*
   * Homepage anchor.
   */
  if (
    href.startsWith("#")
  ) {
    return true;
  }

  /*
   * Internal route.
   */
  if (
    href.startsWith("/")
  ) {
    return true;
  }

  /*
   * External link.
   */
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
   EMAIL VALIDATION
   ========================================================= */

function isValidEmail(
  value: string
) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
    value
  );
}

/* =========================================================
   OPTIONAL IMAGE URL VALIDATION
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
   SOCIAL URL NORMALIZATION
   ========================================================= */

function normalizeSocialUrl(
  value: string
) {
  const url =
    value.trim();

  if (!url) {
    return "";
  }

  /*
   * Allow WhatsApp-style tel links later if needed,
   * but for now Admin social profiles should use
   * http/https URLs.
   */

  if (
    /^https?:\/\//i.test(
      url
    )
  ) {
    return url;
  }

  return `https://${url}`;
}

/* =========================================================
   SOCIAL URL VALIDATION
   ========================================================= */

function isValidSocialUrl(
  value: string
) {
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
   SOCIAL PLATFORM VALIDATION
   ========================================================= */

function isSocialPlatform(
  value: string
): value is SocialPlatform {
  return SOCIAL_PLATFORMS.includes(
    value as SocialPlatform
  );
}

/* =========================================================
   SORT ORDER
   ========================================================= */

function parseSortOrder(
  formData: FormData,
  redirectError:
    (
      message: string
    ) => never
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
    !Number.isFinite(
      value
    ) ||
    value < 0
  ) {
    redirectError(
      "Display order must be zero or greater."
    );
  }

  return value;
}

/* =========================================================
   FOOTER LINK ID
   ========================================================= */

function parseFooterLinkId(
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
      "Invalid Footer link."
    );
  }

  return id;
}

/* =========================================================
   SOCIAL LINK ID
   ========================================================= */

function parseSocialId(
  formData: FormData
) {
  const raw =
    getText(
      formData,
      "socialId"
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
    redirectSocialError(
      "Invalid social profile."
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
    .update(
      signatureString
    )
    .digest("hex");
}

/* =========================================================
   UPLOAD FOOTER LOGO
   ========================================================= */

async function uploadFooterLogo(
  file: File
) {
  /* =======================================================
     VALIDATE FILE
     ======================================================= */

  if (
    !ALLOWED_IMAGE_TYPES.includes(
      file.type
    )
  ) {
    redirectFooterError(
      "Logo must be JPG, PNG, or WebP."
    );
  }

  if (
    file.size >
    MAX_IMAGE_SIZE
  ) {
    redirectFooterError(
      "Logo image must be 5 MB or smaller."
    );
  }

  /* =======================================================
     CLOUDINARY CONFIGURATION
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
    redirectFooterError(
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
    "gamex/footer";

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
        method:
          "POST",

        body:
          uploadData,
      }
    );

  if (
    !response.ok
  ) {
    redirectFooterError(
      "Footer logo upload failed."
    );
  }

  const result =
    (await response.json()) as {
      secure_url?: string;
    };

  if (
    !result.secure_url
  ) {
    redirectFooterError(
      "Cloudinary did not return an image URL."
    );
  }

  return result.secure_url;
}

/* =========================================================
   REVALIDATE
   ========================================================= */

function refreshFooterPages() {
  revalidatePath(
    "/admin/content/footer"
  );

  revalidatePath("/");
}

/* =========================================================
   SAVE FOOTER SETTINGS
   ========================================================= */

export async function saveFooterSettings(
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

  const description =
    getText(
      formData,
      "description"
    );

  /* =======================================================
     HEADINGS
     ======================================================= */

  const navigationHeading =
    getText(
      formData,
      "navigationHeading"
    );

  const contactHeading =
    getText(
      formData,
      "contactHeading"
    );

  /* =======================================================
     CONTACT
     ======================================================= */

  const email =
    getText(
      formData,
      "email"
    );

  const phone =
    getText(
      formData,
      "phone"
    );

  const address =
    getText(
      formData,
      "address"
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

  /* =======================================================
     BOTTOM BAR
     ======================================================= */

  const copyrightText =
    getText(
      formData,
      "copyrightText"
    );

  const backToTopText =
    getText(
      formData,
      "backToTopText"
    );

  const backToTopHref =
    getText(
      formData,
      "backToTopHref"
    );

  const isVisible =
    formData.get(
      "isVisible"
    ) === "on";

  /* =======================================================
     REQUIRED VALIDATION
     ======================================================= */

  if (!brandText) {
    redirectFooterError(
      "Brand text is required."
    );
  }

  if (
    brandText.length >
    120
  ) {
    redirectFooterError(
      "Brand text is too long."
    );
  }

  if (
    !brandHref ||
    brandHref.length >
      500 ||
    !isValidHref(
      brandHref
    )
  ) {
    redirectFooterError(
      "Please enter a valid brand link."
    );
  }

  if (
    !logoAlt
  ) {
    redirectFooterError(
      "Logo alt text is required."
    );
  }

  if (
    logoAlt.length >
    255
  ) {
    redirectFooterError(
      "Logo alt text is too long."
    );
  }

  if (
    !description
  ) {
    redirectFooterError(
      "Footer description is required."
    );
  }

  if (
    !navigationHeading
  ) {
    redirectFooterError(
      "Navigation heading is required."
    );
  }

  if (
    navigationHeading.length >
    120
  ) {
    redirectFooterError(
      "Navigation heading is too long."
    );
  }

  if (
    !contactHeading
  ) {
    redirectFooterError(
      "Contact heading is required."
    );
  }

  if (
    contactHeading.length >
    120
  ) {
    redirectFooterError(
      "Contact heading is too long."
    );
  }

  if (
    !email ||
    !isValidEmail(
      email
    )
  ) {
    redirectFooterError(
      "Please enter a valid Footer email address."
    );
  }

  if (!phone) {
    redirectFooterError(
      "Footer phone number is required."
    );
  }

  if (
    phone.length >
    120
  ) {
    redirectFooterError(
      "Footer phone number is too long."
    );
  }

  if (!address) {
    redirectFooterError(
      "Footer address is required."
    );
  }

  if (!ctaText) {
    redirectFooterError(
      "CTA text is required."
    );
  }

  if (
    ctaText.length >
    120
  ) {
    redirectFooterError(
      "CTA text is too long."
    );
  }

  if (
    !ctaHref ||
    ctaHref.length >
      500 ||
    !isValidHref(
      ctaHref
    )
  ) {
    redirectFooterError(
      "Please enter a valid CTA link."
    );
  }

  if (
    !copyrightText
  ) {
    redirectFooterError(
      "Copyright text is required."
    );
  }

  if (
    copyrightText.length >
    500
  ) {
    redirectFooterError(
      "Copyright text is too long."
    );
  }

  if (
    !backToTopText
  ) {
    redirectFooterError(
      "Back-to-top text is required."
    );
  }

  if (
    backToTopText.length >
    120
  ) {
    redirectFooterError(
      "Back-to-top text is too long."
    );
  }

  if (
    !backToTopHref ||
    backToTopHref.length >
      500 ||
    !isValidHref(
      backToTopHref
    )
  ) {
    redirectFooterError(
      "Please enter a valid back-to-top link."
    );
  }

  /* =======================================================
     LOGO

     Priority:
     1. uploaded image
     2. image URL
     3. current image
     4. default icon
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
    redirectFooterError(
      "Logo image URL is too long."
    );
  }

  if (
    !isValidOptionalImageUrl(
      logoImageUrl
    )
  ) {
    redirectFooterError(
      "Please enter a valid logo image URL."
    );
  }

  const logoFile =
    formData.get(
      "logoFile"
    );

  let logoImage =
    currentLogoImage;

  if (
    removeLogo
  ) {
    logoImage = "";
  }

  if (
    logoImageUrl
  ) {
    logoImage =
      logoImageUrl;
  }

  if (
    logoFile instanceof
      File &&
    logoFile.size >
      0
  ) {
    logoImage =
      await uploadFooterLogo(
        logoFile
      );
  }

  /* =======================================================
     SAVE
     ======================================================= */

  await db
    .insert(
      footerSettings
    )
    .values({
      id:
        FOOTER_SETTINGS_ID,

      brandText,
      brandHref,

      logoImage,
      logoAlt,

      description,

      navigationHeading,
      contactHeading,

      email,
      phone,
      address,

      ctaText,
      ctaHref,
      ctaVisible,

      copyrightText,

      backToTopText,
      backToTopHref,

      isVisible,
    })
    .onConflictDoUpdate({
      target:
        footerSettings.id,

      set: {
        brandText,
        brandHref,

        logoImage,
        logoAlt,

        description,

        navigationHeading,
        contactHeading,

        email,
        phone,
        address,

        ctaText,
        ctaHref,
        ctaVisible,

        copyrightText,

        backToTopText,
        backToTopHref,

        isVisible,

        updatedAt:
          new Date(),
      },
    });

  refreshFooterPages();

  redirect(
    "/admin/content/footer?saved=1"
  );
}

/* =========================================================
   CREATE FOOTER LINK
   ========================================================= */

export async function createFooterLink(
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
      formData,
      redirectLinkError
    );

  const isVisible =
    formData.get(
      "isVisible"
    ) === "on";

  if (!label) {
    redirectLinkError(
      "Footer link label is required."
    );
  }

  if (
    label.length >
    120
  ) {
    redirectLinkError(
      "Footer link label is too long."
    );
  }

  if (
    !href ||
    href.length >
      500 ||
    !isValidHref(href)
  ) {
    redirectLinkError(
      "Please enter a valid Footer link."
    );
  }

  await db
    .insert(
      footerLinks
    )
    .values({
      label,
      href,
      sortOrder,
      isVisible,
    });

  refreshFooterPages();

  redirect(
    "/admin/content/footer?linkCreated=1#footer-links"
  );
}

/* =========================================================
   UPDATE FOOTER LINK
   ========================================================= */

export async function updateFooterLink(
  formData: FormData
) {
  await requireAdmin();

  const id =
    parseFooterLinkId(
      formData
    );

  const rows =
    await db
      .select({
        id:
          footerLinks.id,
      })
      .from(
        footerLinks
      )
      .where(
        eq(
          footerLinks.id,
          id
        )
      )
      .limit(1);

  if (!rows[0]) {
    redirectLinkError(
      "Footer link could not be found."
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
      formData,
      redirectLinkError
    );

  const isVisible =
    formData.get(
      "isVisible"
    ) === "on";

  if (!label) {
    redirectLinkError(
      "Footer link label is required."
    );
  }

  if (
    label.length >
    120
  ) {
    redirectLinkError(
      "Footer link label is too long."
    );
  }

  if (
    !href ||
    href.length >
      500 ||
    !isValidHref(href)
  ) {
    redirectLinkError(
      "Please enter a valid Footer link."
    );
  }

  await db
    .update(
      footerLinks
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
        footerLinks.id,
        id
      )
    );

  refreshFooterPages();

  redirect(
    "/admin/content/footer?linkUpdated=1#footer-links"
  );
}

/* =========================================================
   TOGGLE FOOTER LINK
   ========================================================= */

export async function toggleFooterLinkVisibility(
  formData: FormData
) {
  await requireAdmin();

  const id =
    parseFooterLinkId(
      formData
    );

  const rows =
    await db
      .select({
        isVisible:
          footerLinks.isVisible,
      })
      .from(
        footerLinks
      )
      .where(
        eq(
          footerLinks.id,
          id
        )
      )
      .limit(1);

  const link =
    rows[0];

  if (!link) {
    redirectLinkError(
      "Footer link could not be found."
    );
  }

  await db
    .update(
      footerLinks
    )
    .set({
      isVisible:
        !link.isVisible,

      updatedAt:
        new Date(),
    })
    .where(
      eq(
        footerLinks.id,
        id
      )
    );

  refreshFooterPages();

  redirect(
    "/admin/content/footer?linkVisibilityUpdated=1#footer-links"
  );
}

/* =========================================================
   DELETE FOOTER LINK
   ========================================================= */

export async function deleteFooterLink(
  formData: FormData
) {
  await requireAdmin();

  const id =
    parseFooterLinkId(
      formData
    );

  await db
    .delete(
      footerLinks
    )
    .where(
      eq(
        footerLinks.id,
        id
      )
    );

  refreshFooterPages();

  redirect(
    "/admin/content/footer?linkDeleted=1#footer-links"
  );
}

/* =========================================================
   IMPORT DEFAULT FOOTER LINKS
   ========================================================= */

export async function createDefaultFooterLinks() {
  await requireAdmin();

  const existing =
    await db
      .select({
        id:
          footerLinks.id,
      })
      .from(
        footerLinks
      )
      .limit(1);

  if (
    existing.length >
    0
  ) {
    redirectLinkError(
      "Footer links already exist. Delete them first if you want to restore the defaults."
    );
  }

  await db
    .insert(
      footerLinks
    )
    .values(
      DEFAULT_FOOTER_LINKS.map(
        (link) => ({
          ...link,
          isVisible:
            true,
        })
      )
    );

  refreshFooterPages();

  redirect(
    "/admin/content/footer?defaultLinksCreated=1#footer-links"
  );
}

/* =========================================================
   CREATE SOCIAL PROFILE
   ========================================================= */

export async function createFooterSocialLink(
  formData: FormData
) {
  await requireAdmin();

  const platform =
    getText(
      formData,
      "platform"
    ).toLowerCase();

  const rawUrl =
    getText(
      formData,
      "url"
    );

  const sortOrder =
    parseSortOrder(
      formData,
      redirectSocialError
    );

  const isVisible =
    formData.get(
      "isVisible"
    ) === "on";

  if (
    !isSocialPlatform(
      platform
    )
  ) {
    redirectSocialError(
      "Please select a supported social platform."
    );
  }

  if (!rawUrl) {
    redirectSocialError(
      "Social profile URL is required."
    );
  }

  const url =
    normalizeSocialUrl(
      rawUrl
    );

  if (
    url.length >
    1000 ||
    !isValidSocialUrl(
      url
    )
  ) {
    redirectSocialError(
      "Please enter a valid social profile URL."
    );
  }

  await db
    .insert(
      footerSocialLinks
    )
    .values({
      platform,
      url,
      sortOrder,
      isVisible,
    });

  refreshFooterPages();

  redirect(
    "/admin/content/footer?socialCreated=1#footer-social-links"
  );
}

/* =========================================================
   UPDATE SOCIAL PROFILE
   ========================================================= */

export async function updateFooterSocialLink(
  formData: FormData
) {
  await requireAdmin();

  const id =
    parseSocialId(
      formData
    );

  const platform =
    getText(
      formData,
      "platform"
    ).toLowerCase();

  const rawUrl =
    getText(
      formData,
      "url"
    );

  const sortOrder =
    parseSortOrder(
      formData,
      redirectSocialError
    );

  const isVisible =
    formData.get(
      "isVisible"
    ) === "on";

  const existing =
    await db
      .select({
        id:
          footerSocialLinks.id,
      })
      .from(
        footerSocialLinks
      )
      .where(
        eq(
          footerSocialLinks.id,
          id
        )
      )
      .limit(1);

  if (!existing[0]) {
    redirectSocialError(
      "Social profile could not be found."
    );
  }

  if (
    !isSocialPlatform(
      platform
    )
  ) {
    redirectSocialError(
      "Please select a supported social platform."
    );
  }

  if (!rawUrl) {
    redirectSocialError(
      "Social profile URL is required."
    );
  }

  const url =
    normalizeSocialUrl(
      rawUrl
    );

  if (
    url.length >
    1000 ||
    !isValidSocialUrl(
      url
    )
  ) {
    redirectSocialError(
      "Please enter a valid social profile URL."
    );
  }

  await db
    .update(
      footerSocialLinks
    )
    .set({
      platform,
      url,
      sortOrder,
      isVisible,

      updatedAt:
        new Date(),
    })
    .where(
      eq(
        footerSocialLinks.id,
        id
      )
    );

  refreshFooterPages();

  redirect(
    "/admin/content/footer?socialUpdated=1#footer-social-links"
  );
}

/* =========================================================
   TOGGLE SOCIAL PROFILE
   ========================================================= */

export async function toggleFooterSocialLinkVisibility(
  formData: FormData
) {
  await requireAdmin();

  const id =
    parseSocialId(
      formData
    );

  const rows =
    await db
      .select({
        isVisible:
          footerSocialLinks.isVisible,
      })
      .from(
        footerSocialLinks
      )
      .where(
        eq(
          footerSocialLinks.id,
          id
        )
      )
      .limit(1);

  const social =
    rows[0];

  if (!social) {
    redirectSocialError(
      "Social profile could not be found."
    );
  }

  await db
    .update(
      footerSocialLinks
    )
    .set({
      isVisible:
        !social.isVisible,

      updatedAt:
        new Date(),
    })
    .where(
      eq(
        footerSocialLinks.id,
        id
      )
    );

  refreshFooterPages();

  redirect(
    "/admin/content/footer?socialVisibilityUpdated=1#footer-social-links"
  );
}

/* =========================================================
   DELETE SOCIAL PROFILE
   ========================================================= */

export async function deleteFooterSocialLink(
  formData: FormData
) {
  await requireAdmin();

  const id =
    parseSocialId(
      formData
    );

  await db
    .delete(
      footerSocialLinks
    )
    .where(
      eq(
        footerSocialLinks.id,
        id
      )
    );

  refreshFooterPages();

  redirect(
    "/admin/content/footer?socialDeleted=1#footer-social-links"
  );
}
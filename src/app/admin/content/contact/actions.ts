"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { db } from "@/db";

import {
  contactSettings,
  contactSocialLinks,
} from "@/db/schema";

import { requireAdmin } from "@/lib/admin-auth";

/* =========================================================
   CONSTANTS
   ========================================================= */

const CONTACT_SETTINGS_ID =
  "main";

/* =========================================================
   SUPPORTED SOCIAL PLATFORMS
   ========================================================= */

/*
 * The value saved here is what we will later use
 * to automatically choose the correct brand icon.
 */

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
   CONTACT ERROR REDIRECT
   ========================================================= */

function redirectContactError(
  message: string
): never {
  redirect(
    `/admin/content/contact?error=${encodeURIComponent(
      message
    )}`
  );
}

/* =========================================================
   SOCIAL ERROR REDIRECT
   ========================================================= */

function redirectSocialError(
  message: string
): never {
  redirect(
    `/admin/content/contact?error=${encodeURIComponent(
      message
    )}#social-links`
  );
}

/* =========================================================
   EMAIL VALIDATION
   ========================================================= */

function isValidEmail(
  email: string
) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
    email
  );
}

/* =========================================================
   URL NORMALIZATION
   ========================================================= */

/*
 * Admin can enter:
 *
 * instagram.com/gamex
 *
 * or:
 *
 * https://instagram.com/gamex
 *
 * We automatically add https:// when necessary.
 */

function normalizeUrl(
  value: string
) {
  const trimmed =
    value.trim();

  if (!trimmed) {
    return "";
  }

  if (
    trimmed.startsWith(
      "https://"
    ) ||
    trimmed.startsWith(
      "http://"
    )
  ) {
    return trimmed;
  }

  return `https://${trimmed}`;
}

/* =========================================================
   URL VALIDATION
   ========================================================= */

function isValidUrl(
  value: string
) {
  try {
    const url =
      new URL(value);

    return (
      url.protocol ===
        "https:" ||
      url.protocol ===
        "http:"
    );
  } catch {
    return false;
  }
}

/* =========================================================
   OPTIONAL URL VALIDATION
   ========================================================= */

function isValidOptionalUrl(
  value: string
) {
  if (!value) {
    return true;
  }

  return isValidUrl(
    value
  );
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
   SOCIAL ID PARSER
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
      "Invalid social link."
    );
  }

  return id;
}

/* =========================================================
   SORT ORDER PARSER
   ========================================================= */

function parseSortOrder(
  formData: FormData
) {
  const raw =
    getText(
      formData,
      "sortOrder"
    );

  /*
   * Empty order defaults to zero.
   */

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
    redirectSocialError(
      "Display order must be zero or greater."
    );
  }

  return value;
}

/* =========================================================
   REFRESH CONTACT
   ========================================================= */

function refreshContactPages() {
  revalidatePath(
    "/admin/content/contact"
  );

  revalidatePath("/");
}

/* =========================================================
   SAVE CONTACT SETTINGS
   ========================================================= */

export async function saveContactSettings(
  formData: FormData
) {
  await requireAdmin();

  /* =======================================================
     SECTION
     ======================================================= */

  const eyebrow =
    getText(
      formData,
      "eyebrow"
    );

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

  /* =======================================================
     CONTACT INFORMATION
     ======================================================= */

  const emailLabel =
    getText(
      formData,
      "emailLabel"
    );

  const email =
    getText(
      formData,
      "email"
    );

  const phoneLabel =
    getText(
      formData,
      "phoneLabel"
    );

  const phone =
    getText(
      formData,
      "phone"
    );

  const addressLabel =
    getText(
      formData,
      "addressLabel"
    );

  const address =
    getText(
      formData,
      "address"
    );

  const hoursLabel =
    getText(
      formData,
      "hoursLabel"
    );

  const hours =
    getText(
      formData,
      "hours"
    );

  /* =======================================================
     SOCIAL HEADING
     ======================================================= */

  const socialHeading =
    getText(
      formData,
      "socialHeading"
    );

  /*
   * These four legacy fields are temporarily retained
   * because they already exist in contact_settings.
   *
   * Once the dynamic social manager is fully connected,
   * they will no longer be used by the public website.
   */

  const xUrl =
    normalizeUrl(
      getText(
        formData,
        "xUrl"
      )
    );

  const instagramUrl =
    normalizeUrl(
      getText(
        formData,
        "instagramUrl"
      )
    );

  const youtubeUrl =
    normalizeUrl(
      getText(
        formData,
        "youtubeUrl"
      )
    );

  const twitchUrl =
    normalizeUrl(
      getText(
        formData,
        "twitchUrl"
      )
    );

  /* =======================================================
     CONTACT FORM
     ======================================================= */

  const nameLabel =
    getText(
      formData,
      "nameLabel"
    );

  const namePlaceholder =
    getText(
      formData,
      "namePlaceholder"
    );

  const formEmailLabel =
    getText(
      formData,
      "formEmailLabel"
    );

  const formEmailPlaceholder =
    getText(
      formData,
      "formEmailPlaceholder"
    );

  const subjectLabel =
    getText(
      formData,
      "subjectLabel"
    );

  const subjectPlaceholder =
    getText(
      formData,
      "subjectPlaceholder"
    );

  const messageLabel =
    getText(
      formData,
      "messageLabel"
    );

  const messagePlaceholder =
    getText(
      formData,
      "messagePlaceholder"
    );

  const submitButtonText =
    getText(
      formData,
      "submitButtonText"
    );

  /* =======================================================
     VISIBILITY
     ======================================================= */

  const isVisible =
    formData.get(
      "isVisible"
    ) === "on";

  /* =======================================================
     REQUIRED VALIDATION
     ======================================================= */

  if (!eyebrow) {
    redirectContactError(
      "Section eyebrow is required."
    );
  }

  if (!title) {
    redirectContactError(
      "Section title is required."
    );
  }

  if (!subtitle) {
    redirectContactError(
      "Section subtitle is required."
    );
  }

  if (!emailLabel) {
    redirectContactError(
      "Email label is required."
    );
  }

  if (!email) {
    redirectContactError(
      "Contact email is required."
    );
  }

  if (
    !isValidEmail(email)
  ) {
    redirectContactError(
      "Please enter a valid contact email address."
    );
  }

  if (!phoneLabel) {
    redirectContactError(
      "Phone label is required."
    );
  }

  if (!phone) {
    redirectContactError(
      "Phone number is required."
    );
  }

  if (!addressLabel) {
    redirectContactError(
      "Address label is required."
    );
  }

  if (!address) {
    redirectContactError(
      "Address is required."
    );
  }

  if (!hoursLabel) {
    redirectContactError(
      "Hours label is required."
    );
  }

  if (!hours) {
    redirectContactError(
      "Business hours are required."
    );
  }

  if (!socialHeading) {
    redirectContactError(
      "Social heading is required."
    );
  }

  if (!nameLabel) {
    redirectContactError(
      "Name field label is required."
    );
  }

  if (!namePlaceholder) {
    redirectContactError(
      "Name placeholder is required."
    );
  }

  if (!formEmailLabel) {
    redirectContactError(
      "Form email label is required."
    );
  }

  if (
    !formEmailPlaceholder
  ) {
    redirectContactError(
      "Form email placeholder is required."
    );
  }

  if (!subjectLabel) {
    redirectContactError(
      "Subject label is required."
    );
  }

  if (!subjectPlaceholder) {
    redirectContactError(
      "Subject placeholder is required."
    );
  }

  if (!messageLabel) {
    redirectContactError(
      "Message label is required."
    );
  }

  if (!messagePlaceholder) {
    redirectContactError(
      "Message placeholder is required."
    );
  }

  if (!submitButtonText) {
    redirectContactError(
      "Submit button text is required."
    );
  }

  /* =======================================================
     LENGTH VALIDATION
     ======================================================= */

  if (
    eyebrow.length >
    255
  ) {
    redirectContactError(
      "Section eyebrow is too long."
    );
  }

  if (
    title.length >
    255
  ) {
    redirectContactError(
      "Section title is too long."
    );
  }

  if (
    emailLabel.length >
    100
  ) {
    redirectContactError(
      "Email label is too long."
    );
  }

  if (
    email.length >
    255
  ) {
    redirectContactError(
      "Email address is too long."
    );
  }

  if (
    phoneLabel.length >
    100
  ) {
    redirectContactError(
      "Phone label is too long."
    );
  }

  if (
    phone.length >
    100
  ) {
    redirectContactError(
      "Phone number is too long."
    );
  }

  if (
    addressLabel.length >
    100
  ) {
    redirectContactError(
      "Address label is too long."
    );
  }

  if (
    hoursLabel.length >
    100
  ) {
    redirectContactError(
      "Hours label is too long."
    );
  }

  if (
    hours.length >
    255
  ) {
    redirectContactError(
      "Business hours text is too long."
    );
  }

  if (
    socialHeading.length >
    255
  ) {
    redirectContactError(
      "Social heading is too long."
    );
  }

  if (
    nameLabel.length >
    100
  ) {
    redirectContactError(
      "Name label is too long."
    );
  }

  if (
    namePlaceholder.length >
    255
  ) {
    redirectContactError(
      "Name placeholder is too long."
    );
  }

  if (
    formEmailLabel.length >
    100
  ) {
    redirectContactError(
      "Form email label is too long."
    );
  }

  if (
    formEmailPlaceholder.length >
    255
  ) {
    redirectContactError(
      "Form email placeholder is too long."
    );
  }

  if (
    subjectLabel.length >
    100
  ) {
    redirectContactError(
      "Subject label is too long."
    );
  }

  if (
    subjectPlaceholder.length >
    500
  ) {
    redirectContactError(
      "Subject placeholder is too long."
    );
  }

  if (
    messageLabel.length >
    100
  ) {
    redirectContactError(
      "Message label is too long."
    );
  }

  if (
    submitButtonText.length >
    120
  ) {
    redirectContactError(
      "Submit button text is too long."
    );
  }

  /* =======================================================
     LEGACY SOCIAL URL VALIDATION
     ======================================================= */

  if (
    !isValidOptionalUrl(
      xUrl
    )
  ) {
    redirectContactError(
      "X / Twitter link is invalid."
    );
  }

  if (
    !isValidOptionalUrl(
      instagramUrl
    )
  ) {
    redirectContactError(
      "Instagram link is invalid."
    );
  }

  if (
    !isValidOptionalUrl(
      youtubeUrl
    )
  ) {
    redirectContactError(
      "YouTube link is invalid."
    );
  }

  if (
    !isValidOptionalUrl(
      twitchUrl
    )
  ) {
    redirectContactError(
      "Twitch link is invalid."
    );
  }

  /* =======================================================
     SAVE SETTINGS
     ======================================================= */

  await db
    .insert(
      contactSettings
    )
    .values({
      id:
        CONTACT_SETTINGS_ID,

      eyebrow,
      title,
      subtitle,

      emailLabel,
      email,

      phoneLabel,
      phone,

      addressLabel,
      address,

      hoursLabel,
      hours,

      socialHeading,

      xUrl,
      instagramUrl,
      youtubeUrl,
      twitchUrl,

      nameLabel,
      namePlaceholder,

      formEmailLabel,
      formEmailPlaceholder,

      subjectLabel,
      subjectPlaceholder,

      messageLabel,
      messagePlaceholder,

      submitButtonText,

      isVisible,
    })
    .onConflictDoUpdate({
      target:
        contactSettings.id,

      set: {
        eyebrow,
        title,
        subtitle,

        emailLabel,
        email,

        phoneLabel,
        phone,

        addressLabel,
        address,

        hoursLabel,
        hours,

        socialHeading,

        xUrl,
        instagramUrl,
        youtubeUrl,
        twitchUrl,

        nameLabel,
        namePlaceholder,

        formEmailLabel,
        formEmailPlaceholder,

        subjectLabel,
        subjectPlaceholder,

        messageLabel,
        messagePlaceholder,

        submitButtonText,

        isVisible,

        updatedAt:
          new Date(),
      },
    });

  refreshContactPages();

  redirect(
    "/admin/content/contact?saved=1"
  );
}

/* =========================================================
   CREATE SOCIAL LINK
   ========================================================= */

export async function createSocialLink(
  formData: FormData
) {
  await requireAdmin();

  /* =======================================================
     PLATFORM
     ======================================================= */

  const platform =
    getText(
      formData,
      "platform"
    ).toLowerCase();

  if (!platform) {
    redirectSocialError(
      "Please choose a social platform."
    );
  }

  if (
    !isSocialPlatform(
      platform
    )
  ) {
    redirectSocialError(
      "Unsupported social platform."
    );
  }

  /* =======================================================
     URL
     ======================================================= */

  const url =
    normalizeUrl(
      getText(
        formData,
        "url"
      )
    );

  if (!url) {
    redirectSocialError(
      "Social profile URL is required."
    );
  }

  if (
    url.length >
    1000
  ) {
    redirectSocialError(
      "Social profile URL is too long."
    );
  }

  if (
    !isValidUrl(url)
  ) {
    redirectSocialError(
      "Please enter a valid social profile URL."
    );
  }

  /* =======================================================
     ORDER
     ======================================================= */

  const sortOrder =
    parseSortOrder(
      formData
    );

  /* =======================================================
     VISIBILITY
     ======================================================= */

  const isVisible =
    formData.get(
      "isVisible"
    ) === "on";

  /* =======================================================
     INSERT
     ======================================================= */

  await db
    .insert(
      contactSocialLinks
    )
    .values({
      platform,
      url,
      sortOrder,
      isVisible,
    });

  refreshContactPages();

  redirect(
    "/admin/content/contact?socialCreated=1#social-links"
  );
}

/* =========================================================
   UPDATE SOCIAL LINK
   ========================================================= */

export async function updateSocialLink(
  formData: FormData
) {
  await requireAdmin();

  const id =
    parseSocialId(
      formData
    );

  /* =======================================================
     CHECK EXISTENCE
     ======================================================= */

  const existing =
    await db
      .select({
        id:
          contactSocialLinks.id,
      })
      .from(
        contactSocialLinks
      )
      .where(
        eq(
          contactSocialLinks.id,
          id
        )
      )
      .limit(1);

  if (!existing[0]) {
    redirectSocialError(
      "Social link could not be found."
    );
  }

  /* =======================================================
     PLATFORM
     ======================================================= */

  const platform =
    getText(
      formData,
      "platform"
    ).toLowerCase();

  if (
    !isSocialPlatform(
      platform
    )
  ) {
    redirectSocialError(
      "Please choose a supported social platform."
    );
  }

  /* =======================================================
     URL
     ======================================================= */

  const url =
    normalizeUrl(
      getText(
        formData,
        "url"
      )
    );

  if (!url) {
    redirectSocialError(
      "Social profile URL is required."
    );
  }

  if (
    url.length >
    1000
  ) {
    redirectSocialError(
      "Social profile URL is too long."
    );
  }

  if (
    !isValidUrl(url)
  ) {
    redirectSocialError(
      "Please enter a valid social profile URL."
    );
  }

  /* =======================================================
     ORDER
     ======================================================= */

  const sortOrder =
    parseSortOrder(
      formData
    );

  /* =======================================================
     VISIBILITY
     ======================================================= */

  const isVisible =
    formData.get(
      "isVisible"
    ) === "on";

  /* =======================================================
     UPDATE
     ======================================================= */

  await db
    .update(
      contactSocialLinks
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
        contactSocialLinks.id,
        id
      )
    );

  refreshContactPages();

  redirect(
    "/admin/content/contact?socialUpdated=1#social-links"
  );
}

/* =========================================================
   SHOW / HIDE SOCIAL LINK
   ========================================================= */

export async function toggleSocialLinkVisibility(
  formData: FormData
) {
  await requireAdmin();

  const id =
    parseSocialId(
      formData
    );

  /* =======================================================
     LOAD CURRENT VALUE
     ======================================================= */

  const rows =
    await db
      .select({
        isVisible:
          contactSocialLinks.isVisible,
      })
      .from(
        contactSocialLinks
      )
      .where(
        eq(
          contactSocialLinks.id,
          id
        )
      )
      .limit(1);

  const social =
    rows[0];

  if (!social) {
    redirectSocialError(
      "Social link could not be found."
    );
  }

  /* =======================================================
     TOGGLE
     ======================================================= */

  await db
    .update(
      contactSocialLinks
    )
    .set({
      isVisible:
        !social.isVisible,

      updatedAt:
        new Date(),
    })
    .where(
      eq(
        contactSocialLinks.id,
        id
      )
    );

  refreshContactPages();

  redirect(
    "/admin/content/contact?socialVisibility=1#social-links"
  );
}

/* =========================================================
   DELETE SOCIAL LINK
   ========================================================= */

export async function deleteSocialLink(
  formData: FormData
) {
  await requireAdmin();

  const id =
    parseSocialId(
      formData
    );

  /* =======================================================
     CHECK EXISTENCE
     ======================================================= */

  const existing =
    await db
      .select({
        id:
          contactSocialLinks.id,
      })
      .from(
        contactSocialLinks
      )
      .where(
        eq(
          contactSocialLinks.id,
          id
        )
      )
      .limit(1);

  if (!existing[0]) {
    redirectSocialError(
      "Social link could not be found."
    );
  }

  /* =======================================================
     DELETE
     ======================================================= */

  await db
    .delete(
      contactSocialLinks
    )
    .where(
      eq(
        contactSocialLinks.id,
        id
      )
    );

  refreshContactPages();

  redirect(
    "/admin/content/contact?socialDeleted=1#social-links"
  );
}
"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { db } from "@/db";
import { contactSettings } from "@/db/schema";
import { requireAdmin } from "@/lib/admin-auth";

/* =========================================================
   CONSTANTS
   ========================================================= */

const CONTACT_SETTINGS_ID = "main";

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
   URL VALIDATION
   ========================================================= */

/*
 * Social links may be left blank.
 *
 * When provided, they must use:
 *
 * https://...
 * http://...
 */

function isValidOptionalUrl(
  value: string
) {
  if (!value) {
    return true;
  }

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
     CONTACT DETAILS
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
     SOCIAL LINKS
     ======================================================= */

  const socialHeading =
    getText(
      formData,
      "socialHeading"
    );

  const xUrl =
    getText(
      formData,
      "xUrl"
    );

  const instagramUrl =
    getText(
      formData,
      "instagramUrl"
    );

  const youtubeUrl =
    getText(
      formData,
      "youtubeUrl"
    );

  const twitchUrl =
    getText(
      formData,
      "twitchUrl"
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
     REQUIRED FIELD VALIDATION
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

  /* =======================================================
     CONTACT FORM VALIDATION
     ======================================================= */

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

  if (!formEmailPlaceholder) {
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

  if (eyebrow.length > 255) {
    redirectContactError(
      "Section eyebrow is too long."
    );
  }

  if (title.length > 255) {
    redirectContactError(
      "Section title is too long."
    );
  }

  if (emailLabel.length > 100) {
    redirectContactError(
      "Email label is too long."
    );
  }

  if (email.length > 255) {
    redirectContactError(
      "Email address is too long."
    );
  }

  if (phoneLabel.length > 100) {
    redirectContactError(
      "Phone label is too long."
    );
  }

  if (phone.length > 100) {
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

  if (hoursLabel.length > 100) {
    redirectContactError(
      "Hours label is too long."
    );
  }

  if (hours.length > 255) {
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

  if (nameLabel.length > 100) {
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
     SOCIAL URL VALIDATION
     ======================================================= */

  if (
    !isValidOptionalUrl(
      xUrl
    )
  ) {
    redirectContactError(
      "X / Twitter link must be a valid http or https URL."
    );
  }

  if (
    !isValidOptionalUrl(
      instagramUrl
    )
  ) {
    redirectContactError(
      "Instagram link must be a valid http or https URL."
    );
  }

  if (
    !isValidOptionalUrl(
      youtubeUrl
    )
  ) {
    redirectContactError(
      "YouTube link must be a valid http or https URL."
    );
  }

  if (
    !isValidOptionalUrl(
      twitchUrl
    )
  ) {
    redirectContactError(
      "Twitch link must be a valid http or https URL."
    );
  }

  /* =======================================================
     SAVE TO DATABASE
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

  /* =======================================================
     REFRESH PAGES
     ======================================================= */

  revalidatePath(
    "/admin/content/contact"
  );

  revalidatePath("/");

  /* =======================================================
     REDIRECT
     ======================================================= */

  redirect(
    "/admin/content/contact?saved=1"
  );
}
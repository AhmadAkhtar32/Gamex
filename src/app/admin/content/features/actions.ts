"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { db } from "@/db";

import {
  featuresSettings,
  homepageFeatures,
} from "@/db/schema";

import { requireAdmin } from "@/lib/admin-auth";

/* =========================================================
   CONSTANTS
   ========================================================= */

const FEATURES_SETTINGS_ID = "main";

const ALLOWED_ICONS = [
  "wrench",
  "shield",
  "gauge",
  "badge",
  "zap",
  "refresh",
] as const;

/* =========================================================
   HELPERS
   ========================================================= */

function isAllowedIcon(
  icon: string
) {
  return ALLOWED_ICONS.includes(
    icon as (typeof ALLOWED_ICONS)[number]
  );
}

function redirectFeaturesError(
  message: string
): never {
  redirect(
    `/admin/content/features?error=${encodeURIComponent(
      message
    )}`
  );
}

function redirectNewFeatureError(
  message: string
): never {
  redirect(
    `/admin/content/features/new?error=${encodeURIComponent(
      message
    )}`
  );
}

function redirectEditFeatureError(
  featureId: number,
  message: string
): never {
  redirect(
    `/admin/content/features/${featureId}/edit?error=${encodeURIComponent(
      message
    )}`
  );
}

/* =========================================================
   SAVE SECTION SETTINGS
   ========================================================= */

export async function saveFeaturesSettings(
  formData: FormData
) {
  await requireAdmin();

  /* =======================================================
     READ FORM
     ======================================================= */

  const eyebrow = String(
    formData.get("eyebrow") ?? ""
  ).trim();

  const title = String(
    formData.get("title") ?? ""
  ).trim();

  const subtitle = String(
    formData.get("subtitle") ?? ""
  ).trim();

  const isVisible =
    formData.get("isVisible") === "on";

  /* =======================================================
     VALIDATION
     ======================================================= */

  if (!eyebrow) {
    redirectFeaturesError(
      "Section eyebrow is required."
    );
  }

  if (!title) {
    redirectFeaturesError(
      "Section title is required."
    );
  }

  if (!subtitle) {
    redirectFeaturesError(
      "Section subtitle is required."
    );
  }

  if (eyebrow.length > 255) {
    redirectFeaturesError(
      "Section eyebrow is too long."
    );
  }

  if (title.length > 255) {
    redirectFeaturesError(
      "Section title is too long."
    );
  }

  /* =======================================================
     INSERT / UPDATE
     ======================================================= */

  await db
    .insert(featuresSettings)
    .values({
      id:
        FEATURES_SETTINGS_ID,

      eyebrow,

      title,

      subtitle,

      isVisible,
    })
    .onConflictDoUpdate({
      target:
        featuresSettings.id,

      set: {
        eyebrow,

        title,

        subtitle,

        isVisible,

        updatedAt:
          new Date(),
      },
    });

  /* =======================================================
     REFRESH
     ======================================================= */

  revalidatePath(
    "/admin/content/features"
  );

  revalidatePath("/");

  /* =======================================================
     REDIRECT
     ======================================================= */

  redirect(
    "/admin/content/features?saved=1"
  );
}

/* =========================================================
   CREATE FEATURE
   ========================================================= */

export async function createFeature(
  formData: FormData
) {
  await requireAdmin();

  /* =======================================================
     READ FORM
     ======================================================= */

  const icon = String(
    formData.get("icon") ?? ""
  ).trim();

  const title = String(
    formData.get("title") ?? ""
  ).trim();

  const description = String(
    formData.get("description") ?? ""
  ).trim();

  const sortOrderRaw = String(
    formData.get("sortOrder") ?? "0"
  ).trim();

  const isVisible =
    formData.get("isVisible") === "on";

  /* =======================================================
     VALIDATION
     ======================================================= */

  if (!icon) {
    redirectNewFeatureError(
      "Feature icon is required."
    );
  }

  if (!isAllowedIcon(icon)) {
    redirectNewFeatureError(
      "Please select a valid feature icon."
    );
  }

  if (!title) {
    redirectNewFeatureError(
      "Feature title is required."
    );
  }

  if (!description) {
    redirectNewFeatureError(
      "Feature description is required."
    );
  }

  if (icon.length > 100) {
    redirectNewFeatureError(
      "Feature icon value is too long."
    );
  }

  if (title.length > 255) {
    redirectNewFeatureError(
      "Feature title is too long."
    );
  }

  const sortOrder =
    Number.parseInt(
      sortOrderRaw,
      10
    );

  if (
    !Number.isFinite(sortOrder) ||
    sortOrder < 0
  ) {
    redirectNewFeatureError(
      "Display order must be 0 or greater."
    );
  }

  /* =======================================================
     INSERT
     ======================================================= */

  await db
    .insert(homepageFeatures)
    .values({
      icon,

      title,

      description,

      sortOrder,

      isVisible,
    });

  /* =======================================================
     REFRESH
     ======================================================= */

  revalidatePath(
    "/admin/content/features"
  );

  revalidatePath("/");

  redirect(
    "/admin/content/features?created=1"
  );
}

/* =========================================================
   UPDATE FEATURE
   ========================================================= */

export async function updateFeature(
  formData: FormData
) {
  await requireAdmin();

  /* =======================================================
     FEATURE ID
     ======================================================= */

  const featureIdRaw = String(
    formData.get("featureId") ?? ""
  ).trim();

  const featureId =
    Number.parseInt(
      featureIdRaw,
      10
    );

  if (
    !Number.isFinite(featureId) ||
    featureId <= 0
  ) {
    redirect(
      "/admin/content/features"
    );
  }

  /* =======================================================
     CHECK FEATURE
     ======================================================= */

  const existingRows =
    await db
      .select()
      .from(homepageFeatures)
      .where(
        eq(
          homepageFeatures.id,
          featureId
        )
      )
      .limit(1);

  const existingFeature =
    existingRows[0];

  if (!existingFeature) {
    redirect(
      "/admin/content/features"
    );
  }

  /* =======================================================
     READ FORM
     ======================================================= */

  const icon = String(
    formData.get("icon") ?? ""
  ).trim();

  const title = String(
    formData.get("title") ?? ""
  ).trim();

  const description = String(
    formData.get("description") ?? ""
  ).trim();

  const sortOrderRaw = String(
    formData.get("sortOrder") ?? "0"
  ).trim();

  const isVisible =
    formData.get("isVisible") === "on";

  /* =======================================================
     VALIDATION
     ======================================================= */

  if (!icon) {
    redirectEditFeatureError(
      featureId,
      "Feature icon is required."
    );
  }

  if (!isAllowedIcon(icon)) {
    redirectEditFeatureError(
      featureId,
      "Please select a valid feature icon."
    );
  }

  if (!title) {
    redirectEditFeatureError(
      featureId,
      "Feature title is required."
    );
  }

  if (!description) {
    redirectEditFeatureError(
      featureId,
      "Feature description is required."
    );
  }

  if (title.length > 255) {
    redirectEditFeatureError(
      featureId,
      "Feature title is too long."
    );
  }

  const sortOrder =
    Number.parseInt(
      sortOrderRaw,
      10
    );

  if (
    !Number.isFinite(sortOrder) ||
    sortOrder < 0
  ) {
    redirectEditFeatureError(
      featureId,
      "Display order must be 0 or greater."
    );
  }

  /* =======================================================
     UPDATE
     ======================================================= */

  await db
    .update(homepageFeatures)
    .set({
      icon,

      title,

      description,

      sortOrder,

      isVisible,

      updatedAt:
        new Date(),
    })
    .where(
      eq(
        homepageFeatures.id,
        featureId
      )
    );

  /* =======================================================
     REFRESH
     ======================================================= */

  revalidatePath(
    "/admin/content/features"
  );

  revalidatePath(
    `/admin/content/features/${featureId}/edit`
  );

  revalidatePath("/");

  redirect(
    "/admin/content/features?updated=1"
  );
}

/* =========================================================
   SHOW / HIDE FEATURE
   ========================================================= */

export async function toggleFeatureVisibility(
  formData: FormData
) {
  await requireAdmin();

  const featureIdRaw =
    String(
      formData.get(
        "featureId"
      ) ?? ""
    ).trim();

  const featureId =
    Number.parseInt(
      featureIdRaw,
      10
    );

  const nextVisibility =
    String(
      formData.get(
        "nextVisibility"
      ) ?? ""
    ) === "true";

  if (
    !Number.isFinite(featureId) ||
    featureId <= 0
  ) {
    return;
  }

  await db
    .update(homepageFeatures)
    .set({
      isVisible:
        nextVisibility,

      updatedAt:
        new Date(),
    })
    .where(
      eq(
        homepageFeatures.id,
        featureId
      )
    );

  revalidatePath(
    "/admin/content/features"
  );

  revalidatePath("/");
}

/* =========================================================
   DELETE FEATURE
   ========================================================= */

export async function deleteFeature(
  formData: FormData
) {
  await requireAdmin();

  const featureIdRaw =
    String(
      formData.get(
        "featureId"
      ) ?? ""
    ).trim();

  const featureId =
    Number.parseInt(
      featureIdRaw,
      10
    );

  if (
    !Number.isFinite(featureId) ||
    featureId <= 0
  ) {
    return;
  }

  await db
    .delete(homepageFeatures)
    .where(
      eq(
        homepageFeatures.id,
        featureId
      )
    );

  revalidatePath(
    "/admin/content/features"
  );

  revalidatePath("/");
}

/* =========================================================
   IMPORT CURRENT WEBSITE FEATURES
   ========================================================= */

export async function createDefaultFeatures() {
  await requireAdmin();

  /* =======================================================
     PREVENT DUPLICATES
     ======================================================= */

  const existingFeatures =
    await db
      .select({
        id:
          homepageFeatures.id,
      })
      .from(
        homepageFeatures
      )
      .limit(1);

  if (
    existingFeatures.length > 0
  ) {
    redirect(
      "/admin/content/features"
    );
  }

  /* =======================================================
     INSERT CURRENT GAMEX FEATURES
     ======================================================= */

  await db
    .insert(homepageFeatures)
    .values([
      {
        icon: "wrench",

        title:
          "Custom-Built To Win",

        description:
          "Every rig is hand-assembled, cable-managed and stress-tested for 12+ hours before it ships.",

        sortOrder: 0,

        isVisible: true,
      },

      {
        icon: "shield",

        title:
          "Certified Components",

        description:
          "We only stock authentic, warrantied hardware from the world's leading silicon makers.",

        sortOrder: 1,

        isVisible: true,
      },

      {
        icon: "gauge",

        title:
          "Performance Tuning",

        description:
          "Optimized settings, memory profiles and GPU tuning dialed in before your machine leaves the bench.",

        sortOrder: 2,

        isVisible: true,
      },

      {
        icon: "badge",

        title:
          "Up To 3-Year Warranty",

        description:
          "Lifetime tech support and a no-quibble warranty so you can game without the worry.",

        sortOrder: 3,

        isVisible: true,
      },

      {
        icon: "zap",

        title:
          "48hr Express Build",

        description:
          "Our benchmark-tested build pipeline turns around most custom rigs in just two days.",

        sortOrder: 4,

        isVisible: true,
      },

      {
        icon: "refresh",

        title:
          "Trade-In Program",

        description:
          "Swap your old graphics card, processor or full tower for credit toward your next upgrade.",

        sortOrder: 5,

        isVisible: true,
      },
    ]);

  /* =======================================================
     REFRESH
     ======================================================= */

  revalidatePath(
    "/admin/content/features"
  );

  revalidatePath("/");

  redirect(
    "/admin/content/features?initialized=1"
  );
}
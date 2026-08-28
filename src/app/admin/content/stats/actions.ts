"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { db } from "@/db";
import { homepageStats } from "@/db/schema";
import { requireAdmin } from "@/lib/admin-auth";

/* =========================================================
   ERROR REDIRECTS
   ========================================================= */

function redirectNewStatError(
  message: string
): never {
  redirect(
    `/admin/content/stats/new?error=${encodeURIComponent(
      message
    )}`
  );
}

function redirectEditStatError(
  statId: number,
  message: string
): never {
  redirect(
    `/admin/content/stats/${statId}/edit?error=${encodeURIComponent(
      message
    )}`
  );
}

/* =========================================================
   CREATE STAT
   ========================================================= */

export async function createStat(
  formData: FormData
) {
  await requireAdmin();

  /* =======================================================
     READ FORM
     ======================================================= */

  const value = String(
    formData.get("value") ?? ""
  ).trim();

  const label = String(
    formData.get("label") ?? ""
  ).trim();

  const sortOrderRaw = String(
    formData.get("sortOrder") ?? "0"
  ).trim();

  const isVisible =
    formData.get("isVisible") === "on";

  /* =======================================================
     VALIDATION
     ======================================================= */

  if (!value) {
    redirectNewStatError(
      "Stat value is required."
    );
  }

  if (!label) {
    redirectNewStatError(
      "Stat label is required."
    );
  }

  if (value.length > 100) {
    redirectNewStatError(
      "Stat value is too long."
    );
  }

  if (label.length > 255) {
    redirectNewStatError(
      "Stat label is too long."
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
    redirectNewStatError(
      "Display order must be 0 or greater."
    );
  }

  /* =======================================================
     INSERT
     ======================================================= */

  await db
    .insert(homepageStats)
    .values({
      value,
      label,
      sortOrder,
      isVisible,
    });

  /* =======================================================
     REFRESH
     ======================================================= */

  revalidatePath(
    "/admin/content/stats"
  );

  revalidatePath("/");

  /* =======================================================
     REDIRECT
     ======================================================= */

  redirect(
    "/admin/content/stats"
  );
}

/* =========================================================
   UPDATE STAT
   ========================================================= */

export async function updateStat(
  formData: FormData
) {
  await requireAdmin();

  /* =======================================================
     STAT ID
     ======================================================= */

  const statIdRaw = String(
    formData.get("statId") ?? ""
  ).trim();

  const statId =
    Number.parseInt(
      statIdRaw,
      10
    );

  if (
    !Number.isFinite(statId) ||
    statId <= 0
  ) {
    redirect(
      "/admin/content/stats"
    );
  }

  /* =======================================================
     CHECK STAT EXISTS
     ======================================================= */

  const rows = await db
    .select()
    .from(homepageStats)
    .where(
      eq(
        homepageStats.id,
        statId
      )
    )
    .limit(1);

  const existingStat =
    rows[0];

  if (!existingStat) {
    redirect(
      "/admin/content/stats"
    );
  }

  /* =======================================================
     READ FORM
     ======================================================= */

  const value = String(
    formData.get("value") ?? ""
  ).trim();

  const label = String(
    formData.get("label") ?? ""
  ).trim();

  const sortOrderRaw = String(
    formData.get("sortOrder") ?? "0"
  ).trim();

  const isVisible =
    formData.get("isVisible") === "on";

  /* =======================================================
     VALIDATION
     ======================================================= */

  if (!value) {
    redirectEditStatError(
      statId,
      "Stat value is required."
    );
  }

  if (!label) {
    redirectEditStatError(
      statId,
      "Stat label is required."
    );
  }

  if (value.length > 100) {
    redirectEditStatError(
      statId,
      "Stat value is too long."
    );
  }

  if (label.length > 255) {
    redirectEditStatError(
      statId,
      "Stat label is too long."
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
    redirectEditStatError(
      statId,
      "Display order must be 0 or greater."
    );
  }

  /* =======================================================
     UPDATE
     ======================================================= */

  await db
    .update(homepageStats)
    .set({
      value,
      label,
      sortOrder,
      isVisible,
      updatedAt:
        new Date(),
    })
    .where(
      eq(
        homepageStats.id,
        statId
      )
    );

  /* =======================================================
     REFRESH
     ======================================================= */

  revalidatePath(
    "/admin/content/stats"
  );

  revalidatePath(
    `/admin/content/stats/${statId}/edit`
  );

  revalidatePath("/");

  redirect(
    "/admin/content/stats"
  );
}

/* =========================================================
   SHOW / HIDE STAT
   ========================================================= */

export async function toggleStatVisibility(
  formData: FormData
) {
  await requireAdmin();

  const statIdRaw = String(
    formData.get("statId") ?? ""
  ).trim();

  const statId =
    Number.parseInt(
      statIdRaw,
      10
    );

  const nextVisibility =
    String(
      formData.get(
        "nextVisibility"
      ) ?? ""
    ) === "true";

  if (
    !Number.isFinite(statId) ||
    statId <= 0
  ) {
    return;
  }

  await db
    .update(homepageStats)
    .set({
      isVisible:
        nextVisibility,

      updatedAt:
        new Date(),
    })
    .where(
      eq(
        homepageStats.id,
        statId
      )
    );

  revalidatePath(
    "/admin/content/stats"
  );

  revalidatePath("/");
}

/* =========================================================
   DELETE STAT
   ========================================================= */

export async function deleteStat(
  formData: FormData
) {
  await requireAdmin();

  const statIdRaw = String(
    formData.get("statId") ?? ""
  ).trim();

  const statId =
    Number.parseInt(
      statIdRaw,
      10
    );

  if (
    !Number.isFinite(statId) ||
    statId <= 0
  ) {
    return;
  }

  await db
    .delete(homepageStats)
    .where(
      eq(
        homepageStats.id,
        statId
      )
    );

  revalidatePath(
    "/admin/content/stats"
  );

  revalidatePath("/");
}

/* =========================================================
   ADD ORIGINAL GAMEX STATS
   ========================================================= */

/*
 * This action is useful when the homepage_stats
 * table is completely empty.
 *
 * It inserts the four statistics currently used
 * by the Gamex homepage.
 */

export async function createDefaultStats() {
  await requireAdmin();

  /* =======================================================
     CHECK EXISTING ROWS
     ======================================================= */

  const existingStats =
    await db
      .select({
        id: homepageStats.id,
      })
      .from(homepageStats)
      .limit(1);

  /*
   * Do not accidentally duplicate the defaults
   * if the table already contains statistics.
   */
  if (
    existingStats.length > 0
  ) {
    redirect(
      "/admin/content/stats"
    );
  }

  /* =======================================================
     INSERT ORIGINAL STATS
     ======================================================= */

  await db
    .insert(homepageStats)
    .values([
      {
        value: "12K+",
        label:
          "Gamers Equipped",
        sortOrder: 0,
        isVisible: true,
      },

      {
        value: "3.5K+",
        label:
          "Custom Builds",
        sortOrder: 1,
        isVisible: true,
      },

      {
        value: "48h",
        label:
          "Avg Build Time",
        sortOrder: 2,
        isVisible: true,
      },

      {
        value: "24/7",
        label:
          "Tech Support",
        sortOrder: 3,
        isVisible: true,
      },
    ]);

  /* =======================================================
     REFRESH
     ======================================================= */

  revalidatePath(
    "/admin/content/stats"
  );

  revalidatePath("/");

  redirect(
    "/admin/content/stats?initialized=1"
  );
}
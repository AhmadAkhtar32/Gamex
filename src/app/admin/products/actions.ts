"use server";

import { randomUUID } from "node:crypto";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { db } from "@/db";
import { products } from "@/db/schema";
import { requireAdmin } from "@/lib/admin-auth";

/* =========================================================
   HELPER — CREATE SAFE PRODUCT ID
   ========================================================= */

function makeProductId(name: string) {
  const slug = name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);

  const suffix = randomUUID().slice(0, 8);

  return `${slug || "product"}-${suffix}`;
}

/* =========================================================
   CREATE PRODUCT
   ========================================================= */

export async function createProduct(formData: FormData) {
  /*
   * Only a logged-in administrator may create products.
   */
  await requireAdmin();

  /* =======================================================
     READ FORM DATA
     ======================================================= */

  const name = String(
    formData.get("name") ?? ""
  ).trim();

  const category = String(
    formData.get("category") ?? ""
  ).trim();

  const tag = String(
    formData.get("tag") ?? ""
  ).trim();

  const description = String(
    formData.get("description") ?? ""
  ).trim();

  const image = String(
    formData.get("image") ?? ""
  ).trim();

  const specsText = String(
    formData.get("specs") ?? ""
  ).trim();

  const sortOrderRaw = String(
    formData.get("sortOrder") ?? "0"
  ).trim();

  const isVisible =
    formData.get("isVisible") === "on";

  /* =======================================================
     VALIDATION
     ======================================================= */

  if (!name) {
    redirect(
      "/admin/products/new?error=Product name is required"
    );
  }

  if (!category) {
    redirect(
      "/admin/products/new?error=Category is required"
    );
  }

  if (!description) {
    redirect(
      "/admin/products/new?error=Description is required"
    );
  }

  if (!image) {
    redirect(
      "/admin/products/new?error=Image URL is required"
    );
  }

  if (name.length > 255) {
    redirect(
      "/admin/products/new?error=Product name is too long"
    );
  }

  if (category.length > 100) {
    redirect(
      "/admin/products/new?error=Category is too long"
    );
  }

  if (tag.length > 120) {
    redirect(
      "/admin/products/new?error=Tag is too long"
    );
  }

  if (image.length > 1000) {
    redirect(
      "/admin/products/new?error=Image URL is too long"
    );
  }

  /* =======================================================
     CONVERT SPECS
     ======================================================= */

  /*
   * The admin form will let you write:
   *
   * RTX 5090
   * 32GB DDR5 RAM
   * 2TB NVMe SSD
   *
   * We convert those lines into:
   *
   * [
   *   "RTX 5090",
   *   "32GB DDR5 RAM",
   *   "2TB NVMe SSD"
   * ]
   */
  const specs = specsText
    .split("\n")
    .map((spec) => spec.trim())
    .filter(Boolean);

  if (specs.length === 0) {
    redirect(
      "/admin/products/new?error=Add at least one specification"
    );
  }

  /* =======================================================
     SORT ORDER
     ======================================================= */

  const sortOrder = Number.parseInt(
    sortOrderRaw,
    10
  );

  if (
    !Number.isFinite(sortOrder) ||
    sortOrder < 0
  ) {
    redirect(
      "/admin/products/new?error=Display order must be 0 or greater"
    );
  }

  /* =======================================================
     INSERT INTO NEON
     ======================================================= */

  const id = makeProductId(name);

  await db.insert(products).values({
    id,
    name,
    category,
    tag: tag || "FEATURED",
    description,
    specs,
    image,
    sortOrder,
    isVisible,
  });

  /* =======================================================
     REFRESH ADMIN PRODUCTS PAGE
     ======================================================= */

  revalidatePath("/admin/products");

  /* =======================================================
     GO BACK TO PRODUCTS
     ======================================================= */

  redirect("/admin/products");
}
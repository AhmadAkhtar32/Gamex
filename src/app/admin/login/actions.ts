"use server";

import { compare } from "bcryptjs";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";

import { db } from "@/db";
import { admins } from "@/db/schema";
import { createAdminSession } from "@/lib/admin-auth";

export async function loginAdmin(
  _previousState: {
    error: string;
  },
  formData: FormData
): Promise<{
  error: string;
}> {
  /* =========================================================
     READ FORM VALUES
     ========================================================= */

  const rawEmail = formData.get("email");
  const rawPassword = formData.get("password");

  const email =
    typeof rawEmail === "string"
      ? rawEmail.trim().toLowerCase()
      : "";

  const password =
    typeof rawPassword === "string"
      ? rawPassword
      : "";

  /* =========================================================
     BASIC VALIDATION
     ========================================================= */

  if (!email || !password) {
    return {
      error: "Please enter your email and password.",
    };
  }

  /*
   * Don't allow absurdly large input values.
   * This also avoids wasting work on obviously invalid data.
   */
  if (email.length > 255 || password.length > 200) {
    return {
      error: "Invalid email or password.",
    };
  }

  /* =========================================================
     FIND ADMIN
     ========================================================= */

  const result = await db
    .select({
      id: admins.id,
      email: admins.email,
      passwordHash: admins.passwordHash,
    })
    .from(admins)
    .where(eq(admins.email, email))
    .limit(1);

  const admin = result[0];

  /*
   * Keep the error generic.
   *
   * We do NOT tell an attacker:
   *
   * "This email exists"
   * or
   * "Your password is wrong"
   *
   * Both cases return the same message.
   */
  if (!admin) {
    return {
      error: "Invalid email or password.",
    };
  }

  /* =========================================================
     VERIFY PASSWORD
     ========================================================= */

  const passwordMatches = await compare(
    password,
    admin.passwordHash
  );

  if (!passwordMatches) {
    return {
      error: "Invalid email or password.",
    };
  }

  /* =========================================================
     CREATE SECURE LOGIN SESSION
     ========================================================= */

  await createAdminSession(admin.id);

  /* =========================================================
     REDIRECT TO ADMIN DASHBOARD
     ========================================================= */

  redirect("/admin");
}
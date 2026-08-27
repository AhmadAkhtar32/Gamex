import {
  createHash,
  randomBytes,
} from "node:crypto";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import {
  and,
  eq,
  gt,
} from "drizzle-orm";

import { db } from "@/db";
import {
  admins,
  adminSessions,
} from "@/db/schema";


/* =========================================================
   SETTINGS
   ========================================================= */

const SESSION_COOKIE_NAME =
  "gamex_admin_session";

const SESSION_DURATION_MS =
  7 * 24 * 60 * 60 * 1000;


/* =========================================================
   TOKEN HASHING
   ========================================================= */

/*
 * The browser receives the real random token.
 *
 * PostgreSQL receives only the SHA-256 hash.
 */
function hashSessionToken(
  token: string
) {
  return createHash("sha256")
    .update(token)
    .digest("hex");
}


/* =========================================================
   CREATE ADMIN SESSION
   ========================================================= */

export async function createAdminSession(
  adminId: number
) {
  /*
   * Generate 32 cryptographically secure random bytes.
   *
   * Converting them to hexadecimal gives us a long
   * unpredictable session token.
   */
  const token =
    randomBytes(32).toString("hex");

  const tokenHash =
    hashSessionToken(token);

  const expiresAt =
    new Date(
      Date.now() +
        SESSION_DURATION_MS
    );

  /*
   * Save only the HASH in Neon.
   */
  await db
    .insert(adminSessions)
    .values({
      adminId,
      tokenHash,
      expiresAt,
    });

  /*
   * Put the real token in a secure browser cookie.
   */
  const cookieStore =
    await cookies();

  cookieStore.set(
    SESSION_COOKIE_NAME,
    token,
    {
      httpOnly: true,
      secure:
        process.env.NODE_ENV ===
        "production",
      sameSite: "lax",
      path: "/",
      expires: expiresAt,
    }
  );
}


/* =========================================================
   GET CURRENT ADMIN
   ========================================================= */

export async function getCurrentAdmin() {
  const cookieStore =
    await cookies();

  const token =
    cookieStore.get(
      SESSION_COOKIE_NAME
    )?.value;

  /*
   * No cookie means the user is not logged in.
   */
  if (!token) {
    return null;
  }

  const tokenHash =
    hashSessionToken(token);

  /*
   * Find:
   *
   * 1. this particular session
   * 2. only if it has NOT expired
   * 3. and retrieve the admin who owns it
   */
  const rows = await db
    .select({
      id: admins.id,
      name: admins.name,
      email: admins.email,
      sessionId:
        adminSessions.id,
    })
    .from(adminSessions)
    .innerJoin(
      admins,
      eq(
        adminSessions.adminId,
        admins.id
      )
    )
    .where(
      and(
        eq(
          adminSessions.tokenHash,
          tokenHash
        ),
        gt(
          adminSessions.expiresAt,
          new Date()
        )
      )
    )
    .limit(1);

  if (rows.length === 0) {
    /*
     * Invalid or expired cookie.
     *
     * We simply treat the visitor as logged out.
     */
    return null;
  }

  return {
    id: rows[0].id,
    name: rows[0].name,
    email: rows[0].email,
  };
}


/* =========================================================
   REQUIRE ADMIN
   ========================================================= */

/*
 * Protected admin pages will call this.
 *
 * If the visitor is not authenticated,
 * Next.js sends them to /admin/login.
 */
export async function requireAdmin() {
  const admin =
    await getCurrentAdmin();

  if (!admin) {
    redirect("/admin/login");
  }

  return admin;
}


/* =========================================================
   LOG OUT
   ========================================================= */

export async function destroyAdminSession() {
  const cookieStore =
    await cookies();

  const token =
    cookieStore.get(
      SESSION_COOKIE_NAME
    )?.value;

  if (token) {
    const tokenHash =
      hashSessionToken(token);

    /*
     * Delete the server-side session from Neon.
     */
    await db
      .delete(adminSessions)
      .where(
        eq(
          adminSessions.tokenHash,
          tokenHash
        )
      );
  }

  /*
   * Remove the browser cookie too.
   */
  cookieStore.delete(
    SESSION_COOKIE_NAME
  );
}
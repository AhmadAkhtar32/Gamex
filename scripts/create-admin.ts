import { config } from "dotenv";
import { hash } from "bcryptjs";
import { eq } from "drizzle-orm";

/*
 * Load .env.local BEFORE importing the database connection.
 *
 * This is important because src/db/index.ts expects DATABASE_URL
 * to already exist in process.env when it is imported.
 */
config({ path: ".env.local" });

async function createAdmin() {
  const name = process.env.ADMIN_NAME?.trim();
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;

  /* =========================================================
     VALIDATION
     ========================================================= */

  if (!name) {
    throw new Error(
      "ADMIN_NAME is missing from .env.local"
    );
  }

  if (!email) {
    throw new Error(
      "ADMIN_EMAIL is missing from .env.local"
    );
  }

  if (!password) {
    throw new Error(
      "ADMIN_PASSWORD is missing from .env.local"
    );
  }

  if (password.length < 12) {
    throw new Error(
      "ADMIN_PASSWORD must be at least 12 characters long."
    );
  }

  /*
   * Import the database only AFTER .env.local has been loaded.
   */
  const [{ db, pool }, { admins }] = await Promise.all([
    import("../src/db"),
    import("../src/db/schema"),
  ]);

  try {
    /* =======================================================
       CHECK IF ADMIN ALREADY EXISTS
       ======================================================= */

    const existingAdmin = await db
      .select({
        id: admins.id,
        email: admins.email,
      })
      .from(admins)
      .where(eq(admins.email, email))
      .limit(1);

    if (existingAdmin.length > 0) {
      console.log(
        `Admin with email ${email} already exists.`
      );

      return;
    }

    /* =======================================================
       HASH PASSWORD
       ======================================================= */

    const passwordHash = await hash(
      password,
      12
    );

    /* =======================================================
       CREATE ADMIN
       ======================================================= */

    await db.insert(admins).values({
      name,
      email,
      passwordHash,
    });

    console.log(
      `Admin created successfully: ${email}`
    );
  } finally {
    /*
     * Close the database connection cleanly because this is
     * a one-time command-line script.
     */
    await pool.end();
  }
}

createAdmin().catch((error) => {
  console.error(
    "Failed to create admin:",
    error instanceof Error
      ? error.message
      : error
  );

  process.exitCode = 1;
});
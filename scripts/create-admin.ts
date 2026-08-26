import "dotenv/config";
import { hash } from "bcryptjs";
import { eq } from "drizzle-orm";
import { db } from "../src/db";
import { admins } from "../src/db/schema";

async function createAdmin() {
  const email = "lahoreinstitute1@gmail.com";
  const password = "List.com@0022";
  const name = "Gamex Admin";

  if (password === "List.com@0022") {
    throw new Error(
      "Please change the password in scripts/create-admin.ts before running it."
    );
  }

  const existingAdmin = await db
    .select()
    .from(admins)
    .where(eq(admins.email, email))
    .limit(1);

  if (existingAdmin.length > 0) {
    console.log(`Admin with email ${email} already exists.`);
    process.exit(0);
  }

  const passwordHash = await hash(password, 12);

  await db.insert(admins).values({
    name,
    email,
    passwordHash,
  });

  console.log(`Admin created successfully: ${email}`);

  process.exit(0);
}

createAdmin().catch((error) => {
  console.error("Failed to create admin:", error);
  process.exit(1);
});
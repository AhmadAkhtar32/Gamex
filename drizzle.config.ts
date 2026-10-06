import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";

config({ path: ".env.local" });

export default defineConfig({
  dialect: "postgresql",

  schema: [
    "./src/db/schema.ts",
    "./src/db/catalog-extensions.ts",
  ],

  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
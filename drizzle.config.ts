import { defineConfig } from "drizzle-kit";
import * as dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config({ path: ".env.local" });

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/lib/db/schema.ts",
  dbCredentials: {
    url: process.env.DATABASE_URL || "default_url_if_not_set", // Ensure this is set correctly
  },
});

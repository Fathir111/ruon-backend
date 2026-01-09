import "dotenv/config";
import { defineConfig } from "@prisma/config";

// Kita pastikan dulu URL-nya ada
const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is not ditemukan di file .env");
}

export default defineConfig({
  schema: "./prisma/schema.prisma",
  datasource: {
    // Tanda ! di akhir untuk meyakinkan TypeScript bahwa ini string
    url: databaseUrl!,
  },
});
import path from "path";
import fs from "fs";
import type { SignOptions } from "jsonwebtoken";

function safeLoadDotenv() {
  // ✅ production trên cPanel dùng Environment Variables -> không cần .env
  if (process.env.NODE_ENV === "production") return;

  const envPath =
    process.env.DOTENV_CONFIG_PATH ?? path.resolve(process.cwd(), ".env");

  if (!fs.existsSync(envPath)) return;

  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const dotenv = require("dotenv");
    dotenv.config({ path: envPath });
  } catch {
    console.warn("⚠️ dotenv not available, skip loading .env");
  }
}

safeLoadDotenv();

function req(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env: ${name}`);
  return v;
}

export const env = {
  NODE_ENV: process.env.NODE_ENV ?? "development",
  PORT: Number(process.env.PORT ?? 5000),

  MONGODB_URI: req("MONGODB_URI"),

  CORS_ORIGIN: req("CORS_ORIGIN"),
  COOKIE_DOMAIN: process.env.COOKIE_DOMAIN, // optional

  ADMIN_EMAIL: req("ADMIN_EMAIL"),
  ADMIN_PASSWORD: req("ADMIN_PASSWORD"),

  JWT_ACCESS_SECRET: req("JWT_ACCESS_SECRET"),
  JWT_REFRESH_SECRET: req("JWT_REFRESH_SECRET"),

  JWT_ACCESS_EXPIRES_IN: (process.env.JWT_ACCESS_EXPIRES_IN ?? "15m") as SignOptions["expiresIn"],
  JWT_REFRESH_EXPIRES_IN: (process.env.JWT_REFRESH_EXPIRES_IN ?? "7d") as SignOptions["expiresIn"],

  CLOUDINARY_CLOUD_NAME: req("CLOUDINARY_CLOUD_NAME"),
  CLOUDINARY_API_KEY: req("CLOUDINARY_API_KEY"),
  CLOUDINARY_API_SECRET: req("CLOUDINARY_API_SECRET"),

  GEMINI_API_KEY: req("GEMINI_API_KEY"),
  GEMINI_MODEL: process.env.GEMINI_MODEL ?? "gemini-2.5-pro",
  GEMINI_TEMPERATURE: Number(process.env.GEMINI_TEMPERATURE ?? 0.7),
} as const;

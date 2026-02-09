/**
 * Strapi Configuration
 *
 * Shared configuration for all Strapi scripts.
 */

import { config } from "dotenv";

config({ path: ".env.local" });

export const STRAPI_URL =
  process.env.NEXT_PUBLIC_STRAPI_URL || "https://strapi.saint6.studio";

export const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN;

if (!STRAPI_API_TOKEN) {
  console.error("STRAPI_API_TOKEN is required. Set it in .env.local");
  process.exit(1);
}

export const headers = {
  Authorization: `Bearer ${STRAPI_API_TOKEN}`,
  "Content-Type": "application/json",
};

export const authHeaders = {
  Authorization: `Bearer ${STRAPI_API_TOKEN}`,
};

// Collections to work with
export const COLLECTIONS = [
  "brand-logos",
  "testimonial-items",
  "service-items",
  "studio-rooms",
  "equipment-items",
  "faq-items",
  "portfolio-items",
  "key-projects",
] as const;

// Single types (pages) to work with
export const PAGES = [
  "homepage",
  "studio-rental-page",
  "about-page",
  "contact-page",
  "creative-page",
  "production-page",
  "set-design-page",
  "event-planning-page",
  "decor-page",
] as const;

export type CollectionType = (typeof COLLECTIONS)[number];
export type PageType = (typeof PAGES)[number];

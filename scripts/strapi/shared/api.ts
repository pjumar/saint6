/**
 * Strapi API Utilities
 *
 * Shared API functions for all Strapi scripts.
 */

import { Blob } from "node:buffer";
import * as fs from "node:fs";
import * as path from "node:path";
import { STRAPI_URL, STRAPI_API_TOKEN, headers, authHeaders } from "./config";

// Image cache to avoid re-uploading
const imageCache: Record<string, number> = {};

// ============================================================================
// API Request Utilities
// ============================================================================

export async function apiRequest(
  endpoint: string,
  options: RequestInit = {}
): Promise<unknown> {
  const url = `${STRAPI_URL}/api/${endpoint}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      ...headers,
      ...options.headers,
    },
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`API Error ${response.status}: ${text}`);
  }

  return response.json();
}

// ============================================================================
// Image Utilities
// ============================================================================

function getMimeType(filePath: string): string {
  const ext = path.extname(filePath).toLowerCase();
  const mimeTypes: Record<string, string> = {
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png": "image/png",
    ".gif": "image/gif",
    ".webp": "image/webp",
    ".svg": "image/svg+xml",
  };
  return mimeTypes[ext] || "application/octet-stream";
}

export async function findExistingImage(
  fileName: string
): Promise<number | null> {
  try {
    const response = await fetch(`${STRAPI_URL}/api/upload/files`, {
      headers: authHeaders,
    });

    if (!response.ok) return null;

    const files = await response.json();
    const matches = files
      .filter((f: { name: string }) => f.name === fileName)
      .sort((a: { id: number }, b: { id: number }) => b.id - a.id);

    if (matches.length > 0) {
      console.log(`  Found existing: ${fileName} (ID: ${matches[0].id})`);
      return matches[0].id;
    }
    return null;
  } catch {
    return null;
  }
}

export async function uploadImage(imagePath: string): Promise<number | null> {
  const fileName = path.basename(imagePath);

  // Check cache first
  if (imageCache[imagePath]) {
    return imageCache[imagePath];
  }

  // Check if image already exists in Strapi
  const existingId = await findExistingImage(fileName);
  if (existingId) {
    imageCache[imagePath] = existingId;
    return existingId;
  }

  // Upload new image
  const fullPath = path.join(process.cwd(), "public", imagePath);

  if (!fs.existsSync(fullPath)) {
    console.warn(`  Image not found: ${imagePath}`);
    return null;
  }

  const fileBuffer = fs.readFileSync(fullPath);
  const mimeType = getMimeType(fullPath);

  const formData = new FormData();
  const blob = new Blob([fileBuffer], {
    type: mimeType,
  }) as unknown as globalThis.Blob;
  formData.append("files", blob, fileName);

  try {
    const response = await fetch(`${STRAPI_URL}/api/upload`, {
      method: "POST",
      headers: authHeaders,
      body: formData,
    });

    if (!response.ok) {
      const text = await response.text();
      console.error(`  Upload failed for ${imagePath}: ${text}`);
      return null;
    }

    const data = await response.json();
    const imageId = data[0]?.id;

    if (imageId) {
      imageCache[imagePath] = imageId;
      console.log(`  Uploaded: ${imagePath} (ID: ${imageId})`);
    }

    return imageId;
  } catch (error) {
    console.error(`  Upload error for ${imagePath}:`, error);
    return null;
  }
}

// ============================================================================
// Collection Entry Utilities
// ============================================================================

export async function createEntry(
  contentType: string,
  data: Record<string, unknown>
): Promise<{ id: number; documentId: string } | null> {
  try {
    const result = (await apiRequest(contentType, {
      method: "POST",
      body: JSON.stringify({ data }),
    })) as { data: { id: number; documentId: string } };
    console.log(
      `  Created ${contentType}: ${data.title || data.name || "entry"}`
    );
    return result.data;
  } catch (error) {
    console.error(`  Failed to create ${contentType}:`, error);
    return null;
  }
}

export async function createLocalization(
  contentType: string,
  documentId: string,
  locale: string,
  data: Record<string, unknown>
): Promise<{ id: number; documentId: string } | null> {
  try {
    const result = (await apiRequest(
      `${contentType}/${documentId}?locale=${locale}`,
      {
        method: "PUT",
        body: JSON.stringify({ data }),
      }
    )) as { data: { id: number; documentId: string } };
    console.log(`  Created ${locale} localization for ${contentType}`);
    return result.data;
  } catch (error) {
    console.error(
      `  Failed to create ${locale} localization for ${contentType}:`,
      error
    );
    return null;
  }
}

export async function getCollectionEntries(
  contentType: string
): Promise<{ id: number; documentId: string }[]> {
  const allEntries: { id: number; documentId: string }[] = [];
  const seenDocumentIds = new Set<string>();

  // First query without locale (for non-i18n content types like brand-logos)
  // Then query with locales (for i18n content types)
  const queries = [
    `${contentType}?pagination[pageSize]=100`,
    `${contentType}?locale=en&pagination[pageSize]=100`,
    `${contentType}?locale=vi&pagination[pageSize]=100`,
  ];

  for (const query of queries) {
    try {
      const result = (await apiRequest(query)) as {
        data: { id: number; documentId: string }[];
      };

      for (const entry of result.data || []) {
        if (!seenDocumentIds.has(entry.documentId)) {
          seenDocumentIds.add(entry.documentId);
          allEntries.push({
            id: entry.id,
            documentId: entry.documentId,
          });
        }
      }
    } catch {
      // Silently continue - some queries may fail for non-i18n types
    }
  }

  return allEntries;
}

export async function deleteEntry(
  contentType: string,
  documentId: string
): Promise<boolean> {
  // Delete from both locales to handle entries that only exist in one locale
  for (const locale of ["en", "vi"]) {
    try {
      const url = `${STRAPI_URL}/api/${contentType}/${documentId}?locale=${locale}`;
      await fetch(url, {
        method: "DELETE",
        headers,
      });
    } catch {
      // Ignore errors for individual locales
    }
  }
  return true;
}

// ============================================================================
// Single Type (Page) Utilities
// ============================================================================

export async function updateSingleType(
  contentType: string,
  data: Record<string, unknown>,
  locale: string = "en"
): Promise<{ id: number; documentId: string } | null> {
  try {
    const url =
      locale === "en" ? contentType : `${contentType}?locale=${locale}`;
    const result = (await apiRequest(url, {
      method: "PUT",
      body: JSON.stringify({ data }),
    })) as { data: { id: number; documentId: string } };
    console.log(`  Updated ${contentType} (${locale})`);
    return result.data;
  } catch (error) {
    console.error(`  Failed to update ${contentType} (${locale}):`, error);
    return null;
  }
}

export async function resetSingleType(
  contentType: string,
  resetData: Record<string, unknown>
): Promise<boolean> {
  const locales = ["en", "vi"];
  let success = true;

  for (const locale of locales) {
    try {
      const endpoint =
        locale === "en" ? contentType : `${contentType}?locale=${locale}`;

      // Check if locale exists
      const result = await apiRequest(endpoint).catch(() => null);

      if (!(result as { data?: unknown })?.data) {
        console.log(`  ${contentType} (${locale}) is already empty`);
        continue;
      }

      await apiRequest(endpoint, {
        method: "PUT",
        body: JSON.stringify({ data: resetData }),
      });

      console.log(`  Reset ${contentType} (${locale})`);
    } catch (error) {
      console.log(`  Could not reset ${contentType} (${locale}): ${error}`);
      success = false;
    }
  }

  return success;
}

// ============================================================================
// ID Resolution Utilities
// ============================================================================

export async function getCollectionIds(
  contentType: string
): Promise<number[]> {
  const entries = await getCollectionEntries(contentType);
  return entries.map((e) => e.id);
}

export async function getCollectionDocumentIds(
  contentType: string
): Promise<string[]> {
  const entries = await getCollectionEntries(contentType);
  return entries.map((e) => e.documentId);
}

// Get service item IDs filtered by page and section
export async function getServiceItemIds(
  page: string,
  section: string
): Promise<number[]> {
  try {
    const result = (await apiRequest(
      `service-items?filters[page][$eq]=${page}&filters[section][$eq]=${section}&pagination[pageSize]=100`
    )) as { data: { id: number }[] };
    return result.data?.map((entry) => entry.id) || [];
  } catch {
    return [];
  }
}

// Get service item documentIds filtered by page and section
export async function getServiceItemDocumentIds(
  page: string,
  section: string
): Promise<string[]> {
  try {
    const result = (await apiRequest(
      `service-items?filters[page][$eq]=${page}&filters[section][$eq]=${section}&pagination[pageSize]=100`
    )) as { data: { documentId: string }[] };
    return result.data?.map((entry) => entry.documentId) || [];
  } catch {
    return [];
  }
}

// Get portfolio item IDs filtered by page
export async function getPortfolioItemIds(page: string): Promise<number[]> {
  try {
    const result = (await apiRequest(
      `portfolio-items?filters[page][$eq]=${page}&pagination[pageSize]=100`
    )) as { data: { id: number }[] };
    return result.data?.map((entry) => entry.id) || [];
  } catch {
    return [];
  }
}

// Get portfolio item documentIds filtered by page
export async function getPortfolioItemDocumentIds(
  page: string
): Promise<string[]> {
  try {
    const result = (await apiRequest(
      `portfolio-items?filters[page][$eq]=${page}&pagination[pageSize]=100`
    )) as { data: { documentId: string }[] };
    return result.data?.map((entry) => entry.documentId) || [];
  } catch {
    return [];
  }
}

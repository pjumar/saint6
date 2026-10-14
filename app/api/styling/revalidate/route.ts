import { revalidatePath, revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`)
    return new Response("Unauthorized", { status: 401 });

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return new Response("Invalid JSON", { status: 400 });
  }
  const slugs =
    body && typeof body === "object" && "slugs" in body
      ? (body as { slugs: unknown }).slugs
      : null;
  if (
    !Array.isArray(slugs) ||
    slugs.length > 24 ||
    !slugs.every(
      (slug) =>
        typeof slug === "string" && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug),
    )
  )
    return new Response("Invalid project slugs", { status: 400 });

  // Clear the CMS fetch data, then regenerate only the pages that show it.
  revalidateTag("styling", { expire: 0 });
  for (const locale of ["en", "vi"]) {
    revalidatePath(`/${locale}/portfolio`);
    revalidatePath(`/${locale}/styling`);
    for (const slug of new Set(slugs))
      revalidatePath(`/${locale}/styling/${slug}`);
  }
  return NextResponse.json({ revalidated: true, projects: slugs.length });
}

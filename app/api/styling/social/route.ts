import { stylingEnabled } from "@/app/lib/styling/content";

// Keep image URLs already cached by sharing services working.
export async function GET(request: Request) {
  if (!stylingEnabled) return new Response(null, { status: 404 });
  const url = new URL(request.url);
  const locale = url.searchParams.get("locale") || "en";
  const slug = url.searchParams.get("slug");
  if (
    (locale !== "en" && locale !== "vi") ||
    (slug && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug))
  )
    return new Response(null, { status: 404 });
  const target = new URL(
    `/api/styling/social/${locale}/${slug || "_service"}.png`,
    url.origin,
  );
  const version = url.searchParams.get("v");
  if (version) target.searchParams.set("v", version);
  return Response.redirect(target, 307);
}

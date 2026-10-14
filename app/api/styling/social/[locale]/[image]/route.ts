import { stylingEnabled } from "@/app/lib/styling/content";
import { renderStylingSocialImage } from "@/app/lib/styling/social-image";

export const runtime = "nodejs";
export const dynamic = "force-static";
export const revalidate = 3600;

// Generate and cache social images on first request instead of rendering every
// project image during each preview and production build.
export async function generateStaticParams() {
  return [];
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ locale: string; image: string }> },
) {
  const { locale, image } = await params;
  if (
    !stylingEnabled ||
    (locale !== "en" && locale !== "vi") ||
    !/^(?:_service|[a-z0-9]+(?:-[a-z0-9]+)*)\.png$/.test(image)
  )
    return new Response(null, { status: 404 });
  return renderStylingSocialImage(
    locale,
    image === "_service.png" ? null : image.slice(0, -4),
  );
}

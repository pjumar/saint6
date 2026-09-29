import {
  getStylingProjectSummaries,
  stylingEnabled,
} from "@/app/lib/styling/content";
import { renderStylingSocialImage } from "@/app/lib/styling/social-image";

export const runtime = "nodejs";
export const dynamic = "force-static";
export const revalidate = 300;

// Existing projects are rendered before deployment, not during a crawler request.
// New CMS projects can generate on their first request and are then cached too.
export async function generateStaticParams() {
  if (!stylingEnabled) return [];
  const locales = await Promise.all(
    (["en", "vi"] as const).map(async (locale) => [
      { locale, image: "_service.png" },
      ...(await getStylingProjectSummaries(locale)).map(({ slug }) => ({
        locale,
        image: `${slug}.png`,
      })),
    ]),
  );
  return locales.flat();
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

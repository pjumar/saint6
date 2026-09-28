import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";
import sharp from "sharp";
import {
  getStylingPage,
  getStylingProject,
  stylingEnabled,
} from "@/app/lib/styling/content";

export const runtime = "nodejs";

export async function GET(request: Request) {
  if (!stylingEnabled) return new Response(null, { status: 404 });
  const query = new URL(request.url).searchParams;
  const locale = query.get("locale") || "en";
  const slug = query.get("slug");
  if (locale !== "en" && locale !== "vi")
    return new Response(null, { status: 404 });
  const project = slug ? await getStylingProject(locale, slug) : null;
  if (slug && !project) return new Response(null, { status: 404 });
  const page = project ? null : await getStylingPage(locale);
  const photo = project?.cover || page?.hero_image;
  if (!photo) return new Response(null, { status: 404 });
  const title = project?.title || "Styling";
  const category =
    project?.category ||
    (locale === "vi"
      ? "Mỗi hình ảnh, một câu chuyện."
      : "Every image, a different story.");
  const font = await readFile(
    path.join(
      process.cwd(),
      "public/fonts/saira-condensed/SairaCondensed-Regular.ttf",
    ),
  );
  // Only approved content supplies image URLs; the request cannot choose a fetch target.
  let bytes: Buffer;
  if (photo.url.startsWith("/images/")) {
    bytes = await readFile(path.join(process.cwd(), "public", photo.url));
  } else {
    const url = new URL(photo.url);
    const local =
      process.env.NODE_ENV === "development" && url.hostname === "127.0.0.1";
    if (
      !local &&
      (url.protocol !== "https:" ||
        !/(^|\.)(strapiapp\.com|saint6\.studio|b-cdn\.net)$/.test(url.hostname))
    )
      return new Response(null, { status: 422 });
    const response = await fetch(url, {
      redirect: "error",
      signal: AbortSignal.timeout(8000),
      next: { revalidate: 300, tags: ["styling"] },
    });
    if (!response.ok) return new Response(null, { status: 502 });
    bytes = Buffer.from(await response.arrayBuffer());
    if (bytes.length > 20 * 1024 * 1024)
      return new Response(null, { status: 422 });
  }
  // ImageResponse accepts PNG/JPEG; CMS and preview originals can be WebP.
  const photoPng = await sharp(bytes)
    .rotate()
    .resize(780, 630, { fit: "inside", withoutEnlargement: true })
    .png()
    .toBuffer({ resolveWithObject: true });
  const photoUrl = `data:image/png;base64,${photoPng.data.toString("base64")}`;
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        background: "#860e00",
        color: "white",
        fontFamily: "Saira",
      }}
    >
      <div
        style={{
          width: 420,
          padding: "44px 40px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", fontSize: 36, letterSpacing: 5 }}>
          SAINT 6 STUDIOS
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{ fontSize: title.length > 55 ? 38 : 52, lineHeight: 1.08 }}
          >
            {title.slice(0, 150)}
          </div>
          <div style={{ fontSize: 25, marginTop: 22, opacity: 0.9 }}>
            {category}
          </div>
        </div>
        <div style={{ display: "flex", fontSize: 24 }}>
          saint6.studio / styling
        </div>
      </div>
      <div
        style={{
          width: 780,
          height: 630,
          display: "flex",
          background: "#191717",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {/* Full artwork is retained, including portrait photographs. */}
        {/* biome-ignore lint/performance/noImgElement: ImageResponse renders to PNG, outside the browser. */}
        <img
          src={photoUrl}
          alt=""
          width={photoPng.info.width}
          height={photoPng.info.height}
          style={{ objectFit: "contain" }}
        />
      </div>
    </div>,
    {
      width: 1200,
      height: 630,
      fonts: [{ name: "Saira", data: font, style: "normal", weight: 400 }],
      headers: { "Cache-Control": "public, max-age=300, s-maxage=300" },
    },
  );
}

import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";
import sharp from "sharp";
import { getStylingPage, getStylingProject } from "@/app/lib/styling/content";

// Used by the static image route during the build and background revalidation.
export async function renderStylingSocialImage(
  locale: "en" | "vi",
  slug: string | null,
) {
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
  const logo = await sharp(
    await readFile(path.join(process.cwd(), "public/assets/saint6-logo.svg")),
    { density: 144 },
  )
    .resize(285, 60)
    .png()
    .toBuffer();
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
    if (!response.ok)
      throw new Error(`Social image fetch failed (${response.status})`);
    bytes = Buffer.from(await response.arrayBuffer());
    if (bytes.length > 20 * 1024 * 1024)
      return new Response(null, { status: 422 });
  }
  // ImageResponse accepts PNG/JPEG; CMS and preview originals can be WebP.
  const photoPng = await sharp(bytes)
    .rotate()
    .resize(720, 630, { fit: "inside", withoutEnlargement: true })
    .png()
    .toBuffer({ resolveWithObject: true });
  const photoUrl = `data:image/png;base64,${photoPng.data.toString("base64")}`;
  // Give unused portrait-image space to the red text panel, retaining the full photo.
  const photoWidth = photoPng.info.width;
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
          width: 1200 - photoWidth,
          height: 630,
          position: "relative",
          flexShrink: 0,
          display: "flex",
        }}
      >
        {/* biome-ignore lint/performance/noImgElement: ImageResponse renders the brand logo into the sharing image. */}
        <img
          src={`data:image/png;base64,${logo.toString("base64")}`}
          alt="Saint 6 Studios"
          width={285}
          height={60}
          style={{ position: "absolute", top: 48, left: 48 }}
        />
        <div
          style={{
            position: "absolute",
            top: 154,
            left: 48,
            width: 1200 - photoWidth - 96,
            height: 340,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <div
            style={{ fontSize: title.length > 55 ? 42 : 60, lineHeight: 1.08 }}
          >
            {title.slice(0, 150)}
          </div>
          <div style={{ fontSize: 25, marginTop: 22, opacity: 0.9 }}>
            {category}
          </div>
        </div>
        <div
          style={{
            position: "absolute",
            left: 48,
            bottom: 48,
            display: "flex",
            fontSize: 24,
            color: "white",
            width: 300,
            height: 32,
          }}
        >
          saint6.studio / styling
        </div>
      </div>
      <div
        style={{
          width: photoWidth,
          height: 630,
          flexShrink: 0,
          display: "flex",
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

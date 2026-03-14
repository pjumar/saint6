import { NextResponse } from "next/server";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://www.saint6.studio";

const LOCALES = ["en", "vi"];
const PAGES = [
  "",
  "/about",
  "/contact",
  "/creative",
  "/decor",
  "/event-planning",
  "/production",
  "/set-design",
  "/studio-rental",
];

export async function GET(request: Request) {
  if (
    request.headers.get("authorization") !==
    `Bearer ${process.env.CRON_SECRET}`
  ) {
    return new Response("Unauthorized", { status: 401 });
  }

  const urls = LOCALES.flatMap((locale) =>
    PAGES.map((page) => `${SITE_URL}/${locale}${page}`),
  );

  const results = await Promise.allSettled(
    urls.map(async (url) => {
      const start = Date.now();
      const res = await fetch(url, { cache: "no-store" });
      return { url, status: res.status, ms: Date.now() - start };
    }),
  );

  const summary = results.map((r) =>
    r.status === "fulfilled" ? r.value : { error: String(r.reason) },
  );

  return NextResponse.json({ warmed: urls.length, results: summary });
}

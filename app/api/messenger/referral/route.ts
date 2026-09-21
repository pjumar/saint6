import {
  messengerStore,
  readLimitedBody,
  trackingMode,
} from "@/app/lib/messenger/server";
import { sanitizeAttribution } from "@/strapi/src/api/messenger/lib/attribution";
import { REF_PATTERN } from "@/strapi/src/api/messenger/lib/protocol";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const mode = trackingMode();
  if (mode === "off") return new Response(null, { status: 404 });
  const origin = request.headers.get("origin");
  const site = new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://www.saint6.studio",
  ).origin;
  if (
    origin !== site &&
    !(
      process.env.NODE_ENV === "development" &&
      origin === new URL(request.url).origin
    )
  ) {
    return new Response(null, { status: 403 });
  }
  let body: { test?: boolean; attribution?: unknown };
  try {
    body = JSON.parse(
      Buffer.from(await readLimitedBody(request, 8192)).toString("utf8"),
    );
    if (!body || typeof body !== "object" || Array.isArray(body))
      throw new Error("Invalid body");
  } catch {
    return new Response(null, { status: 400 });
  }
  if (mode === "test" && body.test !== true)
    return new Response(null, { status: 404 });
  try {
    const stored = await messengerStore("referrals", {
      attribution: sanitizeAttribution(body.attribution),
    });
    if (
      typeof stored.ref !== "string" ||
      !REF_PATTERN.test(stored.ref) ||
      !Number.isFinite(Date.parse(stored.expiresAt))
    ) {
      throw new Error("Invalid store response");
    }
    return Response.json(
      { ref: stored.ref, expiresAt: stored.expiresAt },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch {
    return new Response(null, { status: 503 });
  }
}

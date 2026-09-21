import {
  messengerStore,
  readLimitedBody,
  trackingMode,
} from "@/app/lib/messenger/server";
import {
  constantTimeEqual,
  extractSignals,
  verifyMetaSignature,
} from "@/strapi/src/api/messenger/lib/protocol";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const secret = process.env.META_MESSENGER_VERIFY_TOKEN;
  if (trackingMode() === "off" || !secret || secret.length < 32)
    return new Response(null, { status: 503 });
  const params = new URL(request.url).searchParams;
  const challenge = params.get("hub.challenge");
  if (
    params.get("hub.mode") !== "subscribe" ||
    !challenge ||
    !/^\d{1,100}$/.test(challenge) ||
    !constantTimeEqual(params.get("hub.verify_token") || "", secret)
  ) {
    return new Response(null, { status: 403 });
  }
  return new Response(challenge, {
    headers: { "Content-Type": "text/plain", "Cache-Control": "no-store" },
  });
}

export async function POST(request: Request) {
  const appSecret = process.env.META_MESSENGER_APP_SECRET;
  const hashSecret = process.env.MESSENGER_HASH_SECRET;
  const pageId = process.env.META_MESSENGER_PAGE_ID;
  if (
    trackingMode() === "off" ||
    !appSecret ||
    !pageId ||
    !hashSecret ||
    hashSecret.length < 32
  ) {
    return new Response(null, { status: 503 });
  }
  let raw: Uint8Array;
  try {
    raw = await readLimitedBody(request, 1024 * 1024);
  } catch {
    return new Response(null, { status: 413 });
  }
  if (
    !verifyMetaSignature(
      raw,
      request.headers.get("x-hub-signature-256"),
      appSecret,
    )
  ) {
    return new Response(null, { status: 403 });
  }
  let signals: ReturnType<typeof extractSignals>;
  try {
    signals = extractSignals(
      JSON.parse(Buffer.from(raw).toString("utf8")),
      pageId,
      hashSecret,
    );
  } catch {
    return new Response(null, { status: 400 });
  }
  try {
    // Acknowledge only after durable storage. Meta can retry failures safely.
    for (let start = 0; start < signals.length; start += 500) {
      await messengerStore("signals", {
        signals: signals.slice(start, start + 500),
      });
    }
    return new Response("EVENT_RECEIVED", {
      headers: { "Cache-Control": "no-store" },
    });
  } catch {
    return new Response(null, { status: 503 });
  }
}

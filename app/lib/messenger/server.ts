export async function readLimitedBody(
  request: Request,
  limit: number,
): Promise<Uint8Array> {
  if (Number(request.headers.get("content-length")) > limit)
    throw new Error("Body too large");
  const reader = request.body?.getReader();
  if (!reader) return new Uint8Array();
  const chunks: Uint8Array[] = [];
  let length = 0;
  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      length += value.length;
      if (length > limit) {
        await reader.cancel();
        throw new Error("Body too large");
      }
      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }
  return Buffer.concat(chunks);
}

export function trackingMode() {
  const mode = process.env.MESSENGER_TRACKING_MODE;
  return mode === "test" || mode === "live" ? mode : "off";
}

export async function messengerStore(
  path: "referrals" | "signals",
  body: unknown,
) {
  const base = process.env.NEXT_PUBLIC_STRAPI_URL;
  const secret = process.env.MESSENGER_BRIDGE_SECRET;
  if (!base || !secret || secret.length < 32)
    throw new Error("Messenger store is not configured");
  const response = await fetch(new URL(`/api/messenger/${path}`, base), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${secret}`,
    },
    body: JSON.stringify(body),
    cache: "no-store",
    signal: AbortSignal.timeout(4000),
  });
  if (!response.ok) throw new Error("Messenger store unavailable");
  return response.json();
}

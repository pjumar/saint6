import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import { after, test } from "node:test";
import { POST as createReferral } from "../app/api/messenger/referral/route";
import { GET, POST } from "../app/api/messenger/webhook/route";
import {
  campaignLabel,
  sanitizeAttribution,
} from "../strapi/src/api/messenger/lib/attribution";

const savedEnv = { ...process.env };
const originalFetch = globalThis.fetch;
const secret = "test-secret-with-at-least-thirty-two-characters";
Object.assign(process.env, {
  MESSENGER_TRACKING_MODE: "test",
  META_MESSENGER_VERIFY_TOKEN: secret,
  META_MESSENGER_APP_SECRET: secret,
  MESSENGER_HASH_SECRET: secret,
  META_MESSENGER_PAGE_ID: "123",
  MESSENGER_BRIDGE_SECRET: secret,
  NEXT_PUBLIC_STRAPI_URL: "https://cms.example.test",
  NEXT_PUBLIC_SITE_URL: "https://www.saint6.studio",
});
after(() => {
  process.env = savedEnv;
  globalThis.fetch = originalFetch;
});

test("verification requires the configured token and returns only the challenge", async () => {
  assert.equal(
    (
      await GET(
        new Request(
          "https://www.saint6.studio/api/messenger/webhook?hub.mode=subscribe&hub.challenge=1&hub.verify_token=wrong",
        ),
      )
    ).status,
    403,
  );
  const result = await GET(
    new Request(
      `https://www.saint6.studio/api/messenger/webhook?hub.mode=subscribe&hub.challenge=12345&hub.verify_token=${secret}`,
    ),
  );
  assert.equal(result.status, 200);
  assert.equal(await result.text(), "12345");
});

test("rejects forged webhook notifications before any database call", async () => {
  globalThis.fetch = async () => {
    throw new Error("must not be called");
  };
  const result = await POST(
    new Request("https://www.saint6.studio/api/messenger/webhook", {
      method: "POST",
      body: "{}",
    }),
  );
  assert.equal(result.status, 403);
});

test("a valid webhook is acknowledged only after sanitized data is stored", async () => {
  const body = JSON.stringify({
    object: "page",
    entry: [
      {
        id: "123",
        messaging: [
          {
            sender: { id: "456" },
            recipient: { id: "123" },
            timestamp: Date.now(),
            message: { mid: "private-mid", text: "private message" },
          },
        ],
      },
    ],
  });
  const signature = `sha256=${createHmac("sha256", secret).update(body).digest("hex")}`;
  const request = () =>
    new Request("https://www.saint6.studio/api/messenger/webhook", {
      method: "POST",
      body,
      headers: { "x-hub-signature-256": signature },
    });
  let stored = false;
  globalThis.fetch = async (_input, init) => {
    assert.equal(String(init?.body).includes("private"), false);
    assert.equal(JSON.parse(String(init?.body)).signals[0].kind, "message");
    stored = true;
    return Response.json({ accepted: 1 });
  };
  assert.equal((await POST(request())).status, 200);
  assert.equal(stored, true);
  globalThis.fetch = async () => new Response(null, { status: 503 });
  assert.equal((await POST(request())).status, 503);
});

test("referral creation rejects other origins and is limited to test visits", async () => {
  const request = (origin: string, testMode = false) =>
    new Request("https://www.saint6.studio/api/messenger/referral", {
      method: "POST",
      headers: { origin },
      body: JSON.stringify({
        test: testMode,
        attribution: { utm_campaign: "studio", email: "private@example.test" },
      }),
    });
  assert.equal(
    (await createReferral(request("https://unrelated.test", true))).status,
    403,
  );
  assert.equal(
    (await createReferral(request("https://www.saint6.studio"))).status,
    404,
  );
  globalThis.fetch = async (_input, init) => {
    assert.deepEqual(JSON.parse(String(init?.body)), {
      attribution: { utm_campaign: "studio" },
    });
    return Response.json({
      ref: `s6_${"a".repeat(32)}`,
      expiresAt: new Date(Date.now() + 10000).toISOString(),
    });
  };
  assert.equal(
    (await createReferral(request("https://www.saint6.studio", true))).status,
    200,
  );
});

test("the disabled integration does not accept notifications or new references", async () => {
  process.env.MESSENGER_TRACKING_MODE = "off";
  try {
    assert.equal(
      (
        await POST(
          new Request("https://www.saint6.studio/api/messenger/webhook", {
            method: "POST",
            body: "{}",
          }),
        )
      ).status,
      503,
    );
    assert.equal(
      (
        await createReferral(
          new Request("https://www.saint6.studio/api/messenger/referral", {
            method: "POST",
            body: "{}",
          }),
        )
      ).status,
      404,
    );
  } finally {
    process.env.MESSENGER_TRACKING_MODE = "test";
  }
});

test("attribution allowlist removes arbitrary data and URL queries", () => {
  assert.deepEqual(
    sanitizeAttribution({
      email: "private@example.test",
      message: "secret",
      landing_path: "/en?email=private#fragment",
      utm_campaign: "studio",
      utm_source: "bad\nvalue",
    }),
    {
      utm_campaign: "studio",
      landing_path: "/en",
    },
  );
  // fbclid also appears on organic Facebook links; it does not prove an ad click.
  assert.equal(campaignLabel({ fbclid: "abc" }).medium, "unknown");
  assert.equal(campaignLabel({ gclid: "abc" }).campaign, "unknown");
});

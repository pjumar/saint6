import assert from "node:assert/strict";
import { randomBytes } from "node:crypto";
import { mkdtemp } from "node:fs/promises";
import { createRequire } from "node:module";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const project = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../strapi",
);
const directory = await mkdtemp(path.join(tmpdir(), "saint6-messenger-test-"));
const secret = randomBytes(32).toString("hex");
Object.assign(process.env, {
  NODE_ENV: "test",
  HOST: "127.0.0.1",
  PORT: "0",
  DATABASE_CLIENT: "sqlite",
  DATABASE_FILENAME: path.relative(project, path.join(directory, "test.db")),
  APP_KEYS: `${randomBytes(32).toString("hex")},${randomBytes(32).toString("hex")}`,
  API_TOKEN_SALT: secret,
  ADMIN_JWT_SECRET: secret,
  TRANSFER_TOKEN_SALT: secret,
  JWT_SECRET: secret,
  ENCRYPTION_KEY: secret,
  STRAPI_TELEMETRY_DISABLED: "true",
  MESSENGER_TRACKING_ENABLED: "true",
  MESSENGER_BRIDGE_SECRET: secret,
});
const { createStrapi } = require("../strapi/node_modules/@strapi/strapi");
let app;
let base;
async function start() {
  app = createStrapi({ appDir: project, distDir: path.join(project, "dist") });
  await app.load();
  await new Promise((resolve, reject) => {
    app.server.httpServer.once("error", reject);
    app.server.listen(0, "127.0.0.1", resolve);
  });
  base = `http://127.0.0.1:${app.server.httpServer.address().port}/api/messenger`;
}
async function post(route, body, authenticated = true) {
  return fetch(`${base}/${route}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(authenticated ? { Authorization: `Bearer ${secret}` } : {}),
    },
    body: JSON.stringify(body),
  });
}

try {
  await start();
  assert.equal(
    (await post("referrals", { attribution: {} }, false)).status,
    403,
  );
  // Collection types have no public CRUD endpoint, even for an authenticated bridge.
  assert.equal(
    (await fetch(`${base.replace("/messenger", "")}/messenger-signals`)).status,
    404,
  );
  const response = await post("referrals", {
    attribution: {
      utm_source: "google",
      utm_medium: "cpc",
      utm_campaign: "integration-test",
      email: "must-not-store@example.test",
    },
  });
  assert.equal(response.status, 200);
  const { ref } = await response.json();
  assert.match(ref, /^s6_[a-f0-9]{32}$/);
  const now = Date.now();
  const senderKey = "1".repeat(64);
  const referral = {
    eventKey: "2".repeat(64),
    senderKey,
    kind: "referral",
    ref,
    occurredAt: now,
  };
  const message = {
    eventKey: "3".repeat(64),
    senderKey,
    kind: "message",
    occurredAt: now + 1,
  };
  // The message reaches storage before its referral. Parallel retries still create one row.
  const responses = await Promise.all([
    post("signals", { signals: [message] }),
    post("signals", { signals: [message] }),
  ]);
  for (const item of responses) assert.equal(item.status, 200);
  assert.equal((await post("signals", { signals: [referral] })).status, 200);
  assert.equal(
    (
      await post("signals", {
        signals: [
          { ...message, eventKey: "4".repeat(64), occurredAt: now + 2 },
        ],
      })
    ).status,
    200,
  );
  assert.equal(
    await app.db.query("api::messenger.messenger-signal").count(),
    3,
  );
  const savedVisit = await app.db
    .query("api::messenger.messenger-referral")
    .findOne({ where: { ref } });
  assert.equal(savedVisit.attribution.email, undefined);
  const reportPath = `/report?from=${encodeURIComponent(new Date(now - 1000).toISOString())}&to=${encodeURIComponent(new Date(now + 10000).toISOString())}`;
  async function report() {
    const result = await fetch(`${base}${reportPath}`, {
      headers: { Authorization: `Bearer ${secret}` },
    });
    assert.equal(result.status, 200);
    return result.json();
  }
  const before = await report();
  assert.equal(before.confirmedLeads, 1);
  assert.equal(before.uniquePeople, 1);
  assert.equal(before.campaigns[0].campaign, "integration-test");
  await app.destroy();
  app = undefined;
  await start();
  assert.deepEqual(await report(), before);
  console.log(
    "PASS: protected routes, durable storage, concurrent duplicate delivery, out-of-order matching, private campaign report, persistence after restart.",
  );
} finally {
  if (app) await app.destroy();
  // Leave the isolated fixture DB in the system temporary directory for inspection.
}

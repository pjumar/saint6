import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import test from "node:test";
import {
  attributeMessages,
  extractSignals,
  type MessengerSignal,
  type Referral,
  verifyMetaSignature,
} from "../strapi/src/api/messenger/lib/protocol";

const now = 1_790_000_000_000;
const pageId = "103955275891976";
const ref = `s6_${"a".repeat(32)}`;
const ref2 = `s6_${"b".repeat(32)}`;
const secret = "local-test-secret-not-a-real-credential";
const envelope = (events: unknown[]) => ({
  object: "page",
  entry: [{ id: pageId, messaging: events }],
});
const event = (body: object, time = now) => ({
  sender: { id: "12345" },
  recipient: { id: pageId },
  timestamp: time,
  ...body,
});
const referral = { ref, source: "SHORTLINK", type: "OPEN_THREAD" };
const visit: Referral = {
  ref,
  createdAt: now - 1000,
  expiresAt: now + 10000,
  attribution: { utm_campaign: "studio" },
};
const signals = (events: unknown[]) =>
  extractSignals(envelope(events), pageId, secret, now);

test("authenticates original bytes and rejects tampering or missing signatures", () => {
  const raw = Buffer.from('{"text":"\\u00e4 hello"}');
  const signature = `sha256=${createHmac("sha256", secret).update(raw).digest("hex")}`;
  assert.equal(verifyMetaSignature(raw, signature, secret), true);
  assert.equal(
    verifyMetaSignature(Buffer.from('{"text":"ä hello"}'), signature, secret),
    false,
  );
  assert.equal(verifyMetaSignature(raw, null, secret), false);
  assert.equal(verifyMetaSignature(raw, "sha256=short", secret), false);
  assert.equal(verifyMetaSignature(raw, signature, ""), false);
});

test("opening Messenger and Get Started never count as messages", () => {
  const result = signals([
    event({ referral }),
    event({ postback: { payload: "GET_STARTED", referral } }),
  ]);
  assert.equal(result.length, 1);
  assert.equal(result[0].kind, "referral");
  assert.deepEqual(attributeMessages([visit], result), []);
});

test("ignores echoes, handoff context, reads, deliveries and unrelated Pages", () => {
  assert.deepEqual(
    signals([
      event({ message: { mid: "echo", text: "reply", is_echo: true } }),
      event({
        message: { mid: "admin", text: "handoff", admin_text: "context" },
      }),
      event({ read: { watermark: now } }),
      event({ delivery: { mids: ["1"] } }),
      {
        ...event({ message: { mid: "wrong", text: "hello" } }),
        recipient: { id: "999" },
      },
    ]),
    [],
  );
  assert.deepEqual(
    extractSignals(
      {
        object: "page",
        entry: [{ id: "999", messaging: [event({ referral })] }],
      },
      pageId,
      secret,
      now,
    ),
    [],
  );
});

test("discards message contents, raw person IDs and attachment URLs", () => {
  const result = signals([
    event({
      message: {
        mid: "private-id",
        text: "secret enquiry",
        attachments: [
          { type: "image", payload: { url: "https://private.test/image" } },
        ],
      },
    }),
  ]);
  assert.equal(result.length, 1);
  for (const sensitive of [
    "12345",
    "private-id",
    "secret enquiry",
    "private.test",
  ]) {
    assert.equal(JSON.stringify(result).includes(sensitive), false);
  }
});

test("an attachment is an incoming message; duplicate delivery is one lead", () => {
  const message = event(
    { message: { mid: "photo", attachments: [{ type: "image" }] } },
    now + 1,
  );
  const result = attributeMessages(
    [visit],
    signals([message, event({ referral }), message]),
  );
  assert.equal(result.length, 1);
  assert.equal(result[0].ref, ref);
});

test("uses event timestamps despite out-of-order delivery and counts first message once", () => {
  const result = attributeMessages(
    [visit],
    signals([
      event({ message: { mid: "second", text: "hello again" } }, now + 2),
      event({ message: { mid: "first", text: "hello" } }, now + 1),
      event({ referral }),
    ]),
  );
  assert.equal(result.length, 1);
  assert.equal(result[0].occurredAt, now + 1);
});

test("messages before a referral or after expiry remain unattributed", () => {
  assert.deepEqual(
    attributeMessages(
      [visit],
      signals([
        event({ message: { mid: "before", text: "hello" } }, now - 1),
        event({ referral }),
        event({ message: { mid: "expired", text: "hello" } }, now + 10001),
      ]),
    ),
    [],
  );
});

test("attributes to the latest valid referral without counting one message twice", () => {
  const result = attributeMessages(
    [visit, { ...visit, ref: ref2 }],
    signals([
      event({ referral }),
      event({ referral: { ...referral, ref: ref2 } }, now + 1),
      event({ message: { mid: "one", text: "hello" } }, now + 2),
    ]),
  );
  assert.equal(result.length, 1);
  assert.equal(result[0].ref, ref2);
});

test("a shared reference binds only the first person", () => {
  const original: MessengerSignal = {
    eventKey: "r1",
    senderKey: "person1",
    kind: "referral",
    ref,
    occurredAt: now,
  };
  const result = attributeMessages(
    [visit],
    [
      original,
      {
        ...original,
        eventKey: "r2",
        senderKey: "person2",
        occurredAt: now + 1,
      },
      {
        eventKey: "m2",
        senderKey: "person2",
        kind: "message",
        occurredAt: now + 2,
      },
    ],
  );
  assert.deepEqual(result, []);
});

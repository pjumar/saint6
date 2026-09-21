import { createHmac, timingSafeEqual } from "node:crypto";

export const REF_PATTERN = /^s6_[a-f0-9]{32}$/;
export const RETENTION_MS = 30 * 24 * 60 * 60 * 1000;
export const ATTRIBUTION_MS = 7 * 24 * 60 * 60 * 1000;

export type MessengerSignal = {
  eventKey: string;
  senderKey: string;
  kind: "referral" | "message";
  occurredAt: number;
  ref?: string;
};

export type Referral = {
  ref: string;
  createdAt: number;
  expiresAt: number;
  attribution: Record<string, string>;
};

type RecordValue = Record<string, unknown>;
function record(value: unknown): RecordValue {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as RecordValue)
    : {};
}

export function constantTimeEqual(left: string, right: string): boolean {
  const a = Buffer.from(left);
  const b = Buffer.from(right);
  return a.length === b.length && timingSafeEqual(a, b);
}

/** Verify the original request bytes, before JSON decoding or reserialization. */
export function verifyMetaSignature(
  raw: Uint8Array,
  signature: string | null,
  appSecret: string,
): boolean {
  if (!appSecret || !signature || !/^sha256=[a-f0-9]{64}$/.test(signature)) {
    return false;
  }
  const expected = createHmac("sha256", appSecret).update(raw).digest("hex");
  return constantTimeEqual(signature.slice(7), expected);
}

/** Retain matching identifiers only; never return text, attachments, names or PSIDs. */
export function extractSignals(
  payload: unknown,
  pageId: string,
  hashSecret: string,
  now = Date.now(),
): MessengerSignal[] {
  if (!hashSecret || !pageId)
    throw new Error("Messenger configuration missing");
  const root = record(payload);
  if (root.object !== "page" || !Array.isArray(root.entry)) {
    throw new Error("Invalid Messenger envelope");
  }
  const hash = (value: string) =>
    createHmac("sha256", hashSecret).update(value).digest("hex");
  const signals = new Map<string, MessengerSignal>();
  for (const item of root.entry) {
    const entry = record(item);
    if (entry.id !== pageId || !Array.isArray(entry.messaging)) continue;
    for (const item of entry.messaging) {
      const event = record(item);
      const sender = record(event.sender).id;
      const recipient = record(event.recipient).id;
      const time = event.timestamp;
      if (
        typeof sender !== "string" ||
        !/^\d{1,40}$/.test(sender) ||
        sender === pageId ||
        recipient !== pageId ||
        typeof time !== "number" ||
        !Number.isSafeInteger(time) ||
        time < now - RETENTION_MS ||
        time > now + 5 * 60 * 1000
      )
        continue;
      const senderKey = hash(`sender:${pageId}:${sender}`);
      const referral = record(
        event.referral ?? record(event.postback).referral,
      );
      if (
        referral.source === "SHORTLINK" &&
        referral.type === "OPEN_THREAD" &&
        typeof referral.ref === "string" &&
        REF_PATTERN.test(referral.ref)
      ) {
        const eventKey = hash(`referral:${senderKey}:${time}:${referral.ref}`);
        signals.set(eventKey, {
          eventKey,
          senderKey,
          kind: "referral",
          occurredAt: time,
          ref: referral.ref,
        });
      }
      const message = record(event.message);
      const hasText =
        typeof message.text === "string" && message.text.trim().length > 0;
      const hasAttachment =
        Array.isArray(message.attachments) &&
        message.attachments.some(
          (attachment) => typeof record(attachment).type === "string",
        );
      if (
        typeof message.mid === "string" &&
        message.mid.length > 0 &&
        message.mid.length <= 1000 &&
        !message.is_echo &&
        !message.is_deleted &&
        !message.is_unsupported &&
        !message.admin_text &&
        (hasText || hasAttachment)
      ) {
        const eventKey = hash(`message:${pageId}:${sender}:${message.mid}`);
        signals.set(eventKey, {
          eventKey,
          senderKey,
          kind: "message",
          occurredAt: time,
        });
      }
    }
  }
  return [...signals.values()];
}

/** Last website referral before the first real message, one lead per reference. */
export function attributeMessages(
  referrals: Referral[],
  signals: MessengerSignal[],
) {
  const byRef = new Map(referrals.map((referral) => [referral.ref, referral]));
  const ordered = [
    ...new Map(signals.map((signal) => [signal.eventKey, signal])).values(),
  ].sort(
    (a, b) =>
      a.occurredAt - b.occurredAt ||
      (a.kind === b.kind
        ? a.eventKey.localeCompare(b.eventKey)
        : a.kind === "referral"
          ? -1
          : 1),
  );
  const owners = new Map<string, string>();
  const current = new Map<string, { referral: Referral; openedAt: number }>();
  const conversions = new Map<
    string,
    {
      ref: string;
      senderKey: string;
      messageKey: string;
      occurredAt: number;
      attribution: Record<string, string>;
    }
  >();
  for (const signal of ordered) {
    if (signal.kind === "referral" && signal.ref) {
      const referral = byRef.get(signal.ref);
      if (
        !referral ||
        signal.occurredAt < referral.createdAt ||
        signal.occurredAt > referral.expiresAt
      )
        continue;
      const owner = owners.get(referral.ref);
      // A shared/reforwarded link cannot attribute multiple people to one visit.
      if (owner && owner !== signal.senderKey) continue;
      owners.set(referral.ref, signal.senderKey);
      current.set(signal.senderKey, { referral, openedAt: signal.occurredAt });
    } else if (signal.kind === "message") {
      const visit = current.get(signal.senderKey);
      if (
        !visit ||
        signal.occurredAt > visit.referral.expiresAt ||
        signal.occurredAt - visit.openedAt > ATTRIBUTION_MS ||
        conversions.has(visit.referral.ref)
      )
        continue;
      conversions.set(visit.referral.ref, {
        ref: visit.referral.ref,
        senderKey: signal.senderKey,
        messageKey: signal.eventKey,
        occurredAt: signal.occurredAt,
        attribution: visit.referral.attribution,
      });
    }
  }
  return [...conversions.values()];
}

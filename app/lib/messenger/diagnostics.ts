import {
  REF_PATTERN,
  RETENTION_MS,
} from "@/strapi/src/api/messenger/lib/protocol";

type Value = Record<string, unknown>;
const object = (value: unknown): Value =>
  value && typeof value === "object" && !Array.isArray(value)
    ? (value as Value)
    : {};

/** Operational counts only. Page IDs are public; person IDs and content never leave this function. */
export function summarizeMessengerEnvelope(
  payload: unknown,
  pageId: string,
  now = Date.now(),
) {
  const root = object(payload);
  const entries = Array.isArray(root.entry) ? root.entry : [];
  const pageIds = new Set<string>();
  const counts = {
    entries: entries.length,
    matchingPages: 0,
    messaging: 0,
    standby: 0,
    changes: 0,
    changedMessages: 0,
    changedReferrals: 0,
    changedPostbacks: 0,
    validSenders: 0,
    selfSenders: 0,
    matchingRecipients: 0,
    validTimes: 0,
    invalidTimes: 0,
    expiredTimes: 0,
    futureTimes: 0,
    zeroTimes: 0,
    currentSecondsTimes: 0,
    validEntryTimes: 0,
    messages: 0,
    messageIds: 0,
    textMessages: 0,
    attachmentMessages: 0,
    echoes: 0,
    deletedMessages: 0,
    unsupportedMessages: 0,
    adminContext: 0,
    postbacks: 0,
    referrals: 0,
    shortlinks: 0,
    openThreads: 0,
    validReferences: 0,
  };
  for (const item of entries) {
    const entry = object(item);
    if (
      typeof entry.id === "string" &&
      /^\d{1,40}$/.test(entry.id) &&
      pageIds.size < 10
    )
      pageIds.add(entry.id);
    if (entry.id === pageId) counts.matchingPages++;
    if (
      typeof entry.time === "number" &&
      Number.isSafeInteger(entry.time) &&
      entry.time >= now - RETENTION_MS &&
      entry.time <= now + 300000
    )
      counts.validEntryTimes++;
    const messaging = Array.isArray(entry.messaging) ? entry.messaging : [];
    const standby = Array.isArray(entry.standby) ? entry.standby : [];
    const changes = Array.isArray(entry.changes) ? entry.changes : [];
    counts.changes += changes.length;
    for (const item of changes) {
      const change = object(item);
      if (change.field === "messages") counts.changedMessages++;
      if (change.field === "messaging_referrals") counts.changedReferrals++;
      if (change.field === "messaging_postbacks") counts.changedPostbacks++;
    }
    counts.messaging += messaging.length;
    counts.standby += standby.length;
    for (const item of [...messaging, ...standby]) {
      const event = object(item);
      const sender = object(event.sender).id;
      if (typeof sender === "string" && /^\d{1,40}$/.test(sender))
        counts.validSenders++;
      if (sender === pageId) counts.selfSenders++;
      if (object(event.recipient).id === pageId) counts.matchingRecipients++;
      const time = event.timestamp;
      if (time === 0) counts.zeroTimes++;
      if (
        typeof time === "number" &&
        Number.isSafeInteger(time) &&
        time * 1000 >= now - RETENTION_MS &&
        time * 1000 <= now + 300000
      )
        counts.currentSecondsTimes++;
      if (typeof time !== "number" || !Number.isSafeInteger(time))
        counts.invalidTimes++;
      else if (time < now - RETENTION_MS) counts.expiredTimes++;
      else if (time > now + 300000) counts.futureTimes++;
      else counts.validTimes++;
      if (event.message) {
        counts.messages++;
        const message = object(event.message);
        if (
          typeof message.mid === "string" &&
          message.mid.length > 0 &&
          message.mid.length <= 1000
        )
          counts.messageIds++;
        if (typeof message.text === "string" && message.text.trim().length > 0)
          counts.textMessages++;
        if (
          Array.isArray(message.attachments) &&
          message.attachments.some(
            (item) => typeof object(item).type === "string",
          )
        )
          counts.attachmentMessages++;
        if (message.is_echo) counts.echoes++;
        if (message.is_deleted) counts.deletedMessages++;
        if (message.is_unsupported) counts.unsupportedMessages++;
        if (message.admin_text) counts.adminContext++;
      }
      if (event.postback) counts.postbacks++;
      const value = event.referral ?? object(event.postback).referral;
      if (value) {
        counts.referrals++;
        const referral = object(value);
        if (referral.source === "SHORTLINK") counts.shortlinks++;
        if (referral.type === "OPEN_THREAD") counts.openThreads++;
        if (typeof referral.ref === "string" && REF_PATTERN.test(referral.ref))
          counts.validReferences++;
      }
    }
  }
  return {
    configuredPageIdValid: /^\d{1,40}$/.test(pageId),
    observedPageIds: [...pageIds],
    ...counts,
  };
}

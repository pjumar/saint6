import { randomBytes } from "node:crypto";
import type { Core } from "@strapi/strapi";
import { campaignLabel, sanitizeAttribution } from "../lib/attribution";
import {
  ATTRIBUTION_MS,
  attributeMessages,
  type MessengerSignal,
  REF_PATTERN,
  RETENTION_MS,
} from "../lib/protocol";

export default ({ strapi }: { strapi: Core.Strapi }) => {
  const referrals = () => strapi.db.query("api::messenger.messenger-referral");
  const signals = () => strapi.db.query("api::messenger.messenger-signal");

  async function readAll(query, where) {
    const result = [];
    for (let offset = 0; offset < 25000; offset += 1000) {
      const rows = await query.findMany({
        where,
        orderBy: { id: "asc" },
        offset,
        limit: 1000,
      });
      result.push(...rows);
      if (rows.length < 1000) return result;
    }
    throw new Error(
      "Messenger report limit reached; narrow the reporting period",
    );
  }

  return {
    async referral(ctx) {
      const attribution = sanitizeAttribution(ctx.request.body?.attribution);
      const ref = `s6_${randomBytes(16).toString("hex")}`;
      const expiresAt = new Date(Date.now() + ATTRIBUTION_MS).toISOString();
      await referrals().create({ data: { ref, attribution, expiresAt } });
      ctx.body = { ref, expiresAt };
    },

    async signals(ctx) {
      const input = ctx.request.body?.signals;
      if (!Array.isArray(input) || input.length > 500)
        return ctx.badRequest("Invalid signals");
      const now = Date.now();
      for (const signal of input) {
        if (
          !signal ||
          !/^[a-f0-9]{64}$/.test(signal.eventKey) ||
          !/^[a-f0-9]{64}$/.test(signal.senderKey) ||
          !["referral", "message"].includes(signal.kind) ||
          !Number.isSafeInteger(signal.occurredAt) ||
          signal.occurredAt < now - RETENTION_MS ||
          signal.occurredAt > now + 300000 ||
          (signal.kind === "referral" && !REF_PATTERN.test(signal.ref))
        ) {
          return ctx.badRequest("Invalid signal");
        }
      }
      for (const signal of input as MessengerSignal[]) {
        const where = { eventKey: signal.eventKey };
        if (await signals().findOne({ where, select: ["id"] })) continue;
        try {
          await signals().create({
            data: {
              eventKey: signal.eventKey,
              senderKey: signal.senderKey,
              kind: signal.kind,
              occurredAt: new Date(signal.occurredAt).toISOString(),
              ref: signal.kind === "referral" ? signal.ref : null,
            },
          });
        } catch (error) {
          // Concurrent retries are harmless only if the unique event really exists.
          if (!(await signals().findOne({ where, select: ["id"] })))
            throw error;
        }
      }
      ctx.body = { accepted: input.length };
    },

    async report(ctx) {
      const from = Date.parse(String(ctx.query.from || ""));
      const to = Date.parse(String(ctx.query.to || ""));
      const now = Date.now();
      if (
        !Number.isFinite(from) ||
        !Number.isFinite(to) ||
        from >= to ||
        from < now - (RETENTION_MS - ATTRIBUTION_MS) ||
        to > now + 300000
      ) {
        return ctx.badRequest("Use a valid date range within the last 23 days");
      }
      const start = new Date(from - ATTRIBUTION_MS).toISOString();
      const end = new Date(to).toISOString();
      const [visits, events] = await Promise.all([
        readAll(referrals(), { createdAt: { $gte: start, $lt: end } }),
        readAll(signals(), { occurredAt: { $gte: start, $lt: end } }),
      ]);
      const conversions = attributeMessages(
        visits.map((visit) => ({
          ...visit,
          createdAt: Date.parse(visit.createdAt),
          expiresAt: Date.parse(visit.expiresAt),
        })),
        events.map((event) => ({
          ...event,
          occurredAt: Date.parse(event.occurredAt),
        })),
      ).filter(
        (conversion) =>
          conversion.occurredAt >= from && conversion.occurredAt < to,
      );
      const campaigns = new Map<
        string,
        {
          source: string;
          medium: string;
          campaign: string;
          campaignId: string;
          leads: number;
          people: Set<string>;
        }
      >();
      for (const conversion of conversions) {
        const label = campaignLabel(conversion.attribution);
        const key = JSON.stringify(label);
        const row = campaigns.get(key) || {
          ...label,
          leads: 0,
          people: new Set<string>(),
        };
        row.leads += 1;
        row.people.add(conversion.senderKey);
        campaigns.set(key, row);
      }
      ctx.set("Cache-Control", "no-store");
      ctx.body = {
        from: new Date(from).toISOString(),
        to: end,
        confirmedLeads: conversions.length,
        uniquePeople: new Set(
          conversions.map((conversion) => conversion.senderKey),
        ).size,
        campaigns: [...campaigns.values()].map(({ people, ...row }) => ({
          ...row,
          uniquePeople: people.size,
        })),
        note: "Website referrals confirmed by an incoming message. Unmatched Messenger messages are not assigned a campaign. Unique people across campaigns are not additive.",
      };
    },
  };
};

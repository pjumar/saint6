import { RETENTION_MS } from "../src/api/messenger/lib/protocol";

export default {
  messengerRetention: {
    task: async ({ strapi }) => {
      const cutoff = new Date(Date.now() - RETENTION_MS).toISOString();
      await strapi.db
        .query("api::messenger.messenger-signal")
        .deleteMany({ where: { occurredAt: { $lt: cutoff } } });
      await strapi.db
        .query("api::messenger.messenger-referral")
        .deleteMany({ where: { createdAt: { $lt: cutoff } } });
    },
    options: { rule: "0 20 3 * * *", tz: "UTC" },
  },
};

const config = { auth: false, policies: ["global::messenger-bridge"] };

export default {
  routes: [
    {
      method: "POST",
      path: "/messenger/referrals",
      handler: "messenger.referral",
      config,
    },
    {
      method: "POST",
      path: "/messenger/signals",
      handler: "messenger.signals",
      config,
    },
    {
      method: "GET",
      path: "/messenger/report",
      handler: "messenger.report",
      config,
    },
  ],
};

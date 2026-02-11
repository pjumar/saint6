export default {
  routes: [
    {
      method: "POST",
      path: "/booking-submissions",
      handler: "booking-submission.create",
      config: {
        auth: false,
      },
    },
  ],
};

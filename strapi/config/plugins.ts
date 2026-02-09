export default ({ env }) => ({
  email: {
    config: {
      settings: {
        defaultFrom: env("EMAIL_FROM", "noreply@saint6.studio"),
        defaultReplyTo: env("EMAIL_REPLY_TO", "saint6studios@gmail.com"),
      },
    },
  },
});

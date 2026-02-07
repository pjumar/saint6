export default ({ env }) => ({
  email: {
    config: {
      provider: "@strapi/provider-email-nodemailer",
      providerOptions: {
        host: env("SMTP_HOST", "smtp.resend.com"),
        port: env.int("SMTP_PORT", 465),
        secure: true,
        auth: {
          user: env("SMTP_USER", "resend"),
          pass: env("SMTP_PASSWORD"), // Resend API key
        },
      },
      settings: {
        defaultFrom: env("SMTP_FROM", "Saint 6 Studios <noreply@saint6.com>"),
        defaultReplyTo: env("SMTP_REPLY_TO", "saint6studios@gmail.com"),
      },
    },
  },
});

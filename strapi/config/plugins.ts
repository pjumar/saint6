import { MAX_MEDIA_UPLOAD_SIZE_BYTES } from "../src/constants";

export default ({ env }) => ({
  upload: {
    config: {
      sizeLimit: MAX_MEDIA_UPLOAD_SIZE_BYTES,
    },
  },
  email: {
    config: {
      settings: {
        defaultFrom: env("EMAIL_FROM", "noreply@saint6.studio"),
        defaultReplyTo: env("EMAIL_REPLY_TO", "saint6studios@gmail.com"),
      },
    },
  },
});

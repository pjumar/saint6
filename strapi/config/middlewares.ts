import { MAX_UPLOAD_SIZE_MB, MAX_UPLOAD_SIZE_BYTES } from "../src/constants";

export default [
  "strapi::logger",
  "strapi::errors",
  {
    name: "strapi::security",
    config: {
      crossOriginEmbedderPolicy: false,
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          "connect-src": ["'self'", "https:"],
          "img-src": [
            "'self'",
            "data:",
            "blob:",
            "market-assets.strapi.io",
            "*.strapiapp.com",
            "*.media.strapiapp.com",
            "strapi.saint6.studio",
          ],
          "media-src": [
            "'self'",
            "data:",
            "blob:",
            "market-assets.strapi.io",
            "*.strapiapp.com",
            "*.media.strapiapp.com",
            "strapi.saint6.studio",
          ],
        },
      },
    },
  },
  "strapi::cors",
  "strapi::poweredBy",
  "strapi::query",
  "global::upload-size-limit",
  {
    name: "strapi::body",
    config: {
      formLimit: `${MAX_UPLOAD_SIZE_MB}mb`,
      jsonLimit: `${MAX_UPLOAD_SIZE_MB}mb`,
      textLimit: `${MAX_UPLOAD_SIZE_MB}mb`,
      formidable: {
        maxFileSize: MAX_UPLOAD_SIZE_BYTES,
      },
    },
  },
  "strapi::session",
  "strapi::favicon",
  "strapi::public",
];

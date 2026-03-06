import type { Core } from "@strapi/strapi";
import { MAX_UPLOAD_SIZE_MB, MAX_UPLOAD_SIZE_BYTES } from "../constants";

const uploadSizeLimit: Core.MiddlewareFactory = () => {
  return async (ctx, next) => {
    if (ctx.path === "/upload" && ctx.method === "POST") {
      const contentLength = Number(ctx.request.headers["content-length"]);
      if (contentLength && contentLength > MAX_UPLOAD_SIZE_BYTES) {
        ctx.status = 413;
        ctx.body = {
          error: {
            status: 413,
            name: "PayloadTooLargeError",
            message: `The file you are trying to upload is too large. Please upload a file smaller than ${MAX_UPLOAD_SIZE_MB}MB.`,
          },
        };
        return;
      }
    }

    await next();
  };
};

export default uploadSizeLimit;

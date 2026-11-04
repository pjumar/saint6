import type { Core } from "@strapi/strapi";
import { MAX_MEDIA_UPLOAD_SIZE_MB } from "../constants";

const uploadSizeLimit: Core.MiddlewareFactory = () => {
  return async (ctx, next) => {
    const isUpload =
      ctx.method === "POST" &&
      (ctx.path === "/upload" || ctx.path === "/api/upload");
    try {
      // Let the multipart parser measure file bytes, excluding form overhead.
      await next();
    } catch (error) {
      const uploadError = error as { status?: number; httpCode?: number };
      if (
        isUpload &&
        (uploadError.status === 413 || uploadError.httpCode === 413)
      ) {
        ctx.status = 413;
        ctx.body = {
          data: null,
          error: {
            status: 413,
            name: "PayloadTooLargeError",
            message: `The file you are trying to upload is too large. Please upload a file smaller than ${MAX_MEDIA_UPLOAD_SIZE_MB}MB.`,
            details: {},
          },
        };
        return;
      }
      throw error;
    }
  };
};

export default uploadSizeLimit;

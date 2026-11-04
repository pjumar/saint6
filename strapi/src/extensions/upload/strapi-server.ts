import { createRequire } from "node:module";

// Use the same native Sharp instance as Strapi's upload service.
const uploadRequire = createRequire(
  require.resolve("@strapi/upload/package.json"),
);
const sharp = uploadRequire("sharp");

export default (plugin) => {
  const images = plugin.services["image-manipulation"];
  const originalIsImage = images.isImage;
  const originalIsFaultyImage = images.isFaultyImage;
  const originalOptimize = images.optimize;

  // A malformed WebP must reach validation instead of being stored as a file.
  images.isImage = async (file) =>
    file.mime === "image/webp" || originalIsImage(file);

  images.isFaultyImage = async (file) => {
    if (!file.filepath || file.mime !== "image/webp") {
      return originalIsFaultyImage(file);
    }
    try {
      // stats() builds full-resolution histograms that can exhaust Cloud memory.
      // Decode the image into a tiny raw output to check integrity instead.
      await sharp(file.filepath).resize(1, 1).raw().toBuffer();
      return false;
    } catch {
      return true;
    }
  };

  images.optimize = async (file) => {
    if (file.filepath && file.mime === "image/webp") {
      const { orientation } = await sharp(file.filepath).metadata();
      const { autoOrientation = false } =
        (await strapi.plugin("upload").service("upload").getSettings()) ?? {};
      // Keep an already compressed WebP original. Re-encoding a large original
      // can increase both its size and peak memory without improving quality.
      if (!autoOrientation || !orientation || orientation === 1) return file;
    }
    return originalOptimize(file);
  };

  return plugin;
};

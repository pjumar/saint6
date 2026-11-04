import assert from "node:assert/strict";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import test from "node:test";
import configureVite from "../strapi/src/admin/vite.config";
import extendUpload from "../strapi/src/extensions/upload/strapi-server";
import uploadSizeLimit from "../strapi/src/middlewares/upload-size-limit";

const requireStrapi = createRequire(resolve("strapi/package.json"));
const sharp = createRequire(
  requireStrapi.resolve("@strapi/upload/package.json"),
)("sharp");

test("JSON editor extensions share one CodeMirror runtime", () => {
  const config = configureVite({
    optimizeDeps: { exclude: ["@uiw/react-codemirror", "unrelated-plugin"] },
  });
  assert.ok(!config.optimizeDeps.exclude.includes("@uiw/react-codemirror"));
  assert.ok(config.optimizeDeps.exclude.includes("unrelated-plugin"));
  const modulePath = (name: string) =>
    config.resolve.alias.find((alias: { find: string }) => alias.find === name)
      .replacement;
  const { EditorState } = requireStrapi(modulePath("@codemirror/state"));
  const { json } = requireStrapi(modulePath("@codemirror/lang-json"));
  const state = EditorState.create({
    doc: '["Production"]',
    extensions: [json()],
  });
  assert.equal(state.doc.toString(), '["Production"]');
});

test("large WebPs decode safely and retain originals; invalid WebPs are rejected", async () => {
  const folder = await mkdtemp(join(tmpdir(), "saint6-webp-test-"));
  const originalGlobal = globalThis.strapi;
  let fallbackValidation = 0;
  let fallbackOptimization = 0;
  const services = {
    isImage: async () => false,
    isFaultyImage: async () => {
      fallbackValidation++;
      return false;
    },
    optimize: async (file: object) => {
      fallbackOptimization++;
      return { ...file, optimized: true };
    },
  };
  Object.assign(globalThis, {
    strapi: {
      plugin: () => ({
        service: () => ({
          getSettings: async () => ({ autoOrientation: true }),
        }),
      }),
    },
  });
  try {
    const images = extendUpload({
      services: { "image-manipulation": services },
    }).services["image-manipulation"];
    const filepath = join(folder, "large.webp");
    await sharp({
      create: { width: 4000, height: 6000, channels: 3, background: "#666" },
    })
      .webp()
      .toFile(filepath);
    const file = { filepath, mime: "image/webp" };
    assert.equal(await images.isImage(file), true);
    assert.equal(await images.isFaultyImage(file), false);
    assert.equal(await images.optimize(file), file);
    assert.equal(fallbackValidation, 0);
    assert.equal(fallbackOptimization, 0);

    const bytes = await readFile(filepath);
    for (const [name, content] of [
      ["corrupt", Buffer.from("RIFFbrokenWEBP")],
      ["truncated", bytes.subarray(0, 50)],
    ] as const) {
      const badPath = join(folder, `${name}.webp`);
      await writeFile(badPath, content);
      const badFile = { ...file, filepath: badPath };
      assert.equal(await images.isImage(badFile), true);
      assert.equal(await images.isFaultyImage(badFile), true);
    }

    const oriented = join(folder, "oriented.webp");
    await sharp({
      create: { width: 24, height: 12, channels: 3, background: "red" },
    })
      .withMetadata({ orientation: 6 })
      .webp()
      .toFile(oriented);
    assert.equal(
      (await images.optimize({ ...file, filepath: oriented })).optimized,
      true,
    );
    await images.isFaultyImage({ ...file, mime: "image/jpeg" });
    await images.optimize({ ...file, mime: "image/jpeg" });
    assert.equal(fallbackValidation, 1);
    assert.equal(fallbackOptimization, 2);
  } finally {
    Object.assign(globalThis, { strapi: originalGlobal });
    await rm(folder, { recursive: true, force: true });
  }
});

test("upload limits return JSON on both endpoints and exclude multipart overhead", async () => {
  const middleware = uploadSizeLimit({}, {} as never);
  for (const path of ["/upload", "/api/upload"]) {
    const ctx = {
      path,
      method: "POST",
      request: {
        headers: { "content-length": String(10 * 1024 * 1024 + 500) },
      },
      status: 200,
      body: undefined as unknown,
    };
    let called = false;
    await middleware(ctx as never, async () => {
      called = true;
    });
    assert.ok(called, "multipart headers must not count as file bytes");
    await middleware(ctx as never, async () => {
      throw Object.assign(new Error("maxFileSize exceeded"), { httpCode: 413 });
    });
    assert.equal(ctx.status, 413);
    assert.match(JSON.stringify(ctx.body), /10MB/);
    await assert.rejects(
      middleware(ctx as never, async () => {
        throw new Error("storage unavailable");
      }),
      /storage unavailable/,
    );
  }
});

import { existsSync, readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { mergeConfig, type UserConfig } from "vite";

// Resolve from the consumer's dependency tree, including pnpm's isolated layout.
// JSON fields otherwise mix CodeMirror instances and fail instanceof checks.
const adminRequire = createRequire(
  require.resolve("@strapi/admin/package.json"),
);
const designSystemRequire = createRequire(
  adminRequire.resolve("@strapi/design-system"),
);
const singletons = [
  "@codemirror/state",
  "@codemirror/view",
  "@codemirror/language",
  "@codemirror/lang-json",
  "@codemirror/commands",
  "@codemirror/lint",
  "@uiw/react-codemirror",
];

const aliases = singletons.map((name) => {
  let directory = dirname(designSystemRequire.resolve(name));
  while (!existsSync(join(directory, "package.json"))) {
    const parent = dirname(directory);
    if (parent === directory) throw new Error(`Cannot resolve ${name}`);
    directory = parent;
  }
  // Pin the ESM entry, not just its directory: import/require conditions can
  // otherwise include both builds of the same version in a fresh npm install.
  const pkg = JSON.parse(readFileSync(join(directory, "package.json"), "utf8"));
  return { find: name, replacement: join(directory, pkg.module) };
});

export default (config: UserConfig) => {
  const merged = mergeConfig(config, {
    resolve: { alias: aliases, dedupe: singletons },
    optimizeDeps: {
      include: singletons,
    },
  });
  // Vite concatenates arrays during merging, so remove exclusions afterwards.
  merged.optimizeDeps.exclude = (merged.optimizeDeps.exclude ?? []).filter(
    (name: string) => !singletons.includes(name),
  );
  return merged;
};

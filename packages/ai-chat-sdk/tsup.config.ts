import { defineConfig } from "tsup";

export default defineConfig({
  entry: {
    index: "src/index.ts",
    telemetry: "src/telemetry/index.ts",
    context: "src/context/index.ts",
    history: "src/history/index.ts",
    types: "src/types.ts",
  },
  format: ["esm", "cjs"],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  treeshake: true,
  minify: true,
  external: [
    "@upstash/vector",
    "@upstash/redis",
    "ai",
    "nanoid",
    "cheerio",
    "papaparse",
    "pdf-parse",
  ],
  noExternal: [
    "class-variance-authority",
    "clsx",
    "tailwind-merge",
    "tw-animate-css",
  ],
  outDir: "dist",
  target: "es2020",
  platform: "browser",
});

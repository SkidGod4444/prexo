import { defineConfig } from "@trigger.dev/sdk/v3";
import {
  additionalFiles,
  additionalPackages,
} from "@trigger.dev/build/extensions/core";
import { puppeteer } from "@trigger.dev/build/extensions/puppeteer";

export default defineConfig({
  project: "proj_zqfxzidlrnyrsvmyknsn",
  build: {
    extensions: [
      additionalPackages({
        packages: ["papaparse", "fs", "path", "@upstash/redis", "resend"],
      }),
      additionalFiles({
        files: [
          "triggers/lib/extract-text.ts",
          "triggers/lib/templates/welcome.tsx",
        ],
      }),
      puppeteer(),
    ],
  },
  runtime: "node",
  logLevel: "log",
  // The max compute seconds a task is allowed to run. If the task run exceeds this duration, it will be stopped.
  // You can override this on an individual task.
  // See https://trigger.dev/docs/runs/max-duration
  maxDuration: 300,
  retries: {
    enabledInDev: true,
    default: {
      maxAttempts: 3,
      minTimeoutInMs: 1000,
      maxTimeoutInMs: 10000,
      factor: 2,
      randomize: true,
    },
  },
  dirs: ["./triggers"],
});

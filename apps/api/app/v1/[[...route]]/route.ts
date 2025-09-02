import { Hono } from "hono";
import { cors } from "hono/cors";
// import { logger } from "hono/logger";
import { handle } from "hono/vercel";
import health from "../routes/alive";
import ai from "../routes/ai";
import auth from "../routes/auth";
import user from "../routes/user";
import project from "../routes/project";
import api from "../routes/api";
import configs from "../routes/sdk/configs";
import aiSdk from "../routes/sdk/ai";
import extractor from "../routes/sdk/extractor";
import context from "../routes/sdk/context";
import cntxt from "../routes/context";
import playgroundAi from "../routes/playground/ai";
import notifications from "../routes/notifications";
import domain from "../routes/domain";
import envs from "../routes/environments";
import file from "../routes/file";
import containers from "../routes/containers";
import telementryEvents from "../routes/telemetry";
import auditLogs from "../routes/logger";
import { rateLimitHandler } from "@/middleware/ratelimit";
import mailer from "../routes/webhooks/mailer";

export const runtime = "edge";
const app = new Hono().basePath("/v1");

const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3002",
  "https://console.prexoai.xyz",
  "https://prexoai.xyz",
  "https://www.prexoai.xyz",
];

app.use(
  "*",
  cors({
    origin: allowedOrigins,
    allowMethods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS", "PUT"],
    allowHeaders: [
      "Content-Type",
      "Authorization",
      "x-ingest-key",
      "x-telemetry-key",
      "x-model-id",
      "x-project-id",
      "x-polling-req",
    ],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
    credentials: true,
  }),
);

// app.use(logger());
app.use(rateLimitHandler);

// Import routes
app.route("/health", health);
app.route("/auth", auth);
app.route("/ai", ai);
app.route("/user", user);
app.route("/project", project);
app.route("/domain", domain);
app.route("/envs", envs);
app.route("/notification", notifications);
app.route("/api", api);
app.route("/context", cntxt);
app.route("/container", containers);
app.route("/file", file);
app.route("/telementry", telementryEvents);
app.route("/logger", auditLogs);

// SDK Routes
app.route("/sdk/configs", configs);
app.route("/sdk/ai", aiSdk);
app.route("/sdk/extractor", extractor);
app.route("/sdk/context", context);

// Webhook Routes
app.route("/webhook/mailer", mailer);

// Playground Routes
app.route("/playground/ai", playgroundAi);

const GET = handle(app);
const POST = handle(app);
const PATCH = handle(app);
const DELETE = handle(app);
const OPTIONS = handle(app);
const PUT = handle(app);

export { GET, PUT, PATCH, POST, DELETE, OPTIONS };

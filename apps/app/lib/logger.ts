import * as Sentry from "@sentry/nextjs";

export type LogLevel = "debug" | "info" | "trace" | "warn" | "error";

export type LogParams<
  T extends Record<string, unknown> = Record<string, unknown>,
> = T;

export function logSentry<T extends Record<string, unknown>>(
  message: string,
  type: LogLevel,
  params?: LogParams<T>,
) {
  switch (type) {
    case "debug":
      Sentry.logger.debug(message, params);
      break;
    case "info":
      Sentry.logger.info(message, params);
      break;
    case "trace":
      Sentry.logger.trace(message, params);
      break;
    case "warn":
      Sentry.logger.warn(message, params);
      break;
    case "error":
      Sentry.logger.error(message, params);
      break;
    default:
      Sentry.logger.debug(message, params);
  }
}

import * as Sentry from "@sentry/nextjs";
import { logSentry } from "./lib/logger";

Sentry.init({
  dsn: "https://3b2939275de3154fd80045f66543684c@o4510188601606145.ingest.de.sentry.io/4510188607766608",

  // Add optional integrations for additional features
  integrations: [
    Sentry.replayIntegration(),
    Sentry.launchDarklyIntegration(),
    Sentry.feedbackIntegration({
      colorScheme: "dark",
      isNameRequired: true,
      isEmailRequired: true,
      onSubmitSuccess: () => {
        logSentry("Sentry feedback form submitted", "info");
      },
      onSubmitError: (error: Error) => {
        logSentry("Sentry feedback form submission error", "error", { error });
      },
    }),
  ],

  // Define how likely traces are sampled. Adjust this value in production, or use tracesSampler for greater control.
  tracesSampleRate: 1,
  // Enable logs to be sent to Sentry
  enableLogs: true,

  // Define how likely Replay events are sampled.
  // This sets the sample rate to be 10%. You may want this to be 100% while
  // in development and sample at a lower rate in production
  replaysSessionSampleRate: 0.1,

  // Define how likely Replay events are sampled when an error occurs.
  replaysOnErrorSampleRate: 1.0,

  // Enable sending user PII (Personally Identifiable Information)
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/configuration/options/#sendDefaultPii
  sendDefaultPii: true,
});

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;

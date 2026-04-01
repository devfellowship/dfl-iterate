import * as Sentry from "@sentry/react";

export interface SentryConfig {
  dsn: string;
  serviceName: string;
  serviceVersion: string;
  environment: string;
}

let _initialized = false;

export function initSentry(config: SentryConfig): void {
  if (_initialized) return;

  Sentry.init({
    dsn: config.dsn,
    environment: config.environment,
    release: `${config.serviceName}@${config.serviceVersion}`,
    integrations: [
      Sentry.browserTracingIntegration(),
      Sentry.replayIntegration({ maskAllText: false, blockAllMedia: false }),
    ],
    tracesSampleRate: 0.2,
    replaysSessionSampleRate: 0.0,
    replaysOnErrorSampleRate: 1.0,
    beforeSend(event) {
      event.tags = {
        ...event.tags,
        "service.name": config.serviceName,
      };
      return event;
    },
  });

  Sentry.setTag("service.name", config.serviceName);
  _initialized = true;
}

export function captureError(error: Error, context?: Record<string, string>): void {
  if (!_initialized) return;
  Sentry.withScope((scope) => {
    if (context) {
      for (const [key, value] of Object.entries(context)) {
        scope.setExtra(key, value);
      }
    }
    Sentry.captureException(error);
  });
}

export function setSentryUser(id: string, role?: string): void {
  if (!_initialized) return;
  Sentry.setUser({ id, ...(role ? { role } : {}) });
}

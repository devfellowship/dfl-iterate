import React, { useEffect, useRef, ReactNode } from "react";
import { trace, SpanStatusCode } from "@opentelemetry/api";
import {
  initOtelBrowser,
  shutdownOtel,
  type OtelProviders,
} from "./lib/otel-init";
import {
  instrumentFetch,
  uninstrumentFetch,
} from "./lib/fetch-instrumentation";
import { getDynamicAttributes } from "./lib/resource-attributes";
import { useWebVitals } from "./hooks/useWebVitals";
import { useQueryErrorReporter } from "./hooks/useQueryErrorReporter";
import { ErrorBoundary } from "./ErrorBoundary";

export interface ObservabilityConfig {
  /** Service name reported to the collector. Default: VITE_APP_NAME or "unknown" */
  serviceName?: string;
  /** Service version. Default: VITE_APP_VERSION or "0.0.0" */
  serviceVersion?: string;
  /** OTel collector base URL. Default: "https://otel.devfellowship.com" */
  collectorUrl?: string;
  /** API key sent as x-api-key header. Default: VITE_OTEL_API_KEY */
  apiKey?: string;
  /** Master kill-switch. Default: true in production (import.meta.env.PROD) */
  enabled?: boolean;
  /** Capture Core Web Vitals. Default: true */
  enableWebVitals?: boolean;
  /** Report React Query errors as spans. Default: true */
  enableQueryTracking?: boolean;
  /** Auto-trace all fetch() calls. Default: true */
  enableFetchTracing?: boolean;
}

interface ObservabilityProviderProps extends ObservabilityConfig {
  children: ReactNode;
}

// ---- Internal active-instrumentation wrapper ----

function ActiveInstrumentation({
  enableWebVitals,
  enableQueryTracking,
  children,
}: {
  enableWebVitals: boolean;
  enableQueryTracking: boolean;
  children: ReactNode;
}) {
  if (enableWebVitals) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useWebVitals();
  }

  if (enableQueryTracking) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useQueryErrorReporter();
  }

  return <>{children}</>;
}

// ---- Main provider ----

export function ObservabilityProvider({
  serviceName,
  serviceVersion,
  collectorUrl,
  apiKey,
  enabled,
  enableWebVitals = true,
  enableQueryTracking = true,
  enableFetchTracing = true,
  children,
}: ObservabilityProviderProps) {
  const env = (
    import.meta as ImportMeta & { env: Record<string, string | boolean> }
  ).env;

  const isEnabled =
    enabled ?? (env?.VITE_OTEL_ENABLED === "true" || env?.PROD === true);

  const providersRef = useRef<OtelProviders | null>(null);

  const resolvedServiceName =
    serviceName ?? (env?.VITE_APP_NAME as string) ?? "unknown";
  const resolvedServiceVersion =
    serviceVersion ?? (env?.VITE_APP_VERSION as string) ?? "0.0.0";
  const resolvedCollectorUrl =
    collectorUrl ?? "https://otel.devfellowship.com";
  const resolvedApiKey = apiKey ?? (env?.VITE_OTEL_API_KEY as string);

  useEffect(() => {
    if (!isEnabled) return;

    // Initialize OTel SDK
    const providers = initOtelBrowser({
      serviceName: resolvedServiceName,
      serviceVersion: resolvedServiceVersion,
      collectorUrl: resolvedCollectorUrl,
      apiKey: resolvedApiKey,
    });
    providersRef.current = providers;

    // Fetch instrumentation
    if (enableFetchTracing) {
      const tracer = trace.getTracer("@dfl/observability");
      instrumentFetch(tracer);
    }

    // Global error handlers
    const tracer = trace.getTracer("@dfl/observability");

    const handleWindowError = (event: ErrorEvent) => {
      tracer.startActiveSpan("window.onerror", (span) => {
        const dynamicAttrs = getDynamicAttributes();
        for (const [key, value] of Object.entries(dynamicAttrs)) {
          span.setAttribute(key, value);
        }

        span.setAttribute("error.message", event.message);
        span.setAttribute("error.source", event.filename ?? "");
        span.setAttribute("error.lineno", event.lineno ?? 0);
        span.setAttribute("error.colno", event.colno ?? 0);

        span.setStatus({
          code: SpanStatusCode.ERROR,
          message: event.message,
        });

        if (event.error instanceof Error) {
          span.recordException(event.error);
        }

        span.end();
      });
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      tracer.startActiveSpan("unhandled-rejection", (span) => {
        const dynamicAttrs = getDynamicAttributes();
        for (const [key, value] of Object.entries(dynamicAttrs)) {
          span.setAttribute(key, value);
        }

        const reason = event.reason;
        const message =
          reason instanceof Error ? reason.message : String(reason);

        span.setAttribute("error.message", message);
        span.setAttribute("error.type", "unhandled_promise_rejection");

        span.setStatus({ code: SpanStatusCode.ERROR, message });

        if (reason instanceof Error) {
          span.recordException(reason);
        }

        span.end();
      });
    };

    window.addEventListener("error", handleWindowError);
    window.addEventListener("unhandledrejection", handleUnhandledRejection);

    return () => {
      window.removeEventListener("error", handleWindowError);
      window.removeEventListener("unhandledrejection", handleUnhandledRejection);

      if (enableFetchTracing) {
        uninstrumentFetch();
      }

      if (providersRef.current) {
        shutdownOtel(providersRef.current);
        providersRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEnabled]);

  // No-op mode: just render children without any instrumentation
  if (!isEnabled) {
    return <>{children}</>;
  }

  return (
    <ErrorBoundary>
      <ActiveInstrumentation
        enableWebVitals={enableWebVitals}
        enableQueryTracking={enableQueryTracking}
      >
        {children}
      </ActiveInstrumentation>
    </ErrorBoundary>
  );
}

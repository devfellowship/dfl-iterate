// @dfl/observability — Browser observability SDK for React apps
// Distributed via the dfl-components-cli registry.

export { ObservabilityProvider } from "./ObservabilityProvider";
export type { ObservabilityConfig } from "./ObservabilityProvider";

export { ErrorBoundary } from "./ErrorBoundary";

export { trackEvent } from "./lib/track-event";

export { setUserId, setUserRole } from "./lib/resource-attributes";

export { captureError, setSentryUser } from "./lib/sentry-init";

export { useWebVitals } from "./hooks/useWebVitals";
export { useQueryErrorReporter } from "./hooks/useQueryErrorReporter";

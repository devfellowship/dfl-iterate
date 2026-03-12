import { trace, SpanStatusCode } from "@opentelemetry/api";
import { getDynamicAttributes } from "./resource-attributes";

/**
 * Emit a custom observability event as an OTel span.
 *
 * Uses the global tracer registered by the ObservabilityProvider,
 * so it can be called from anywhere in the app without prop-drilling.
 *
 * @example
 * ```ts
 * trackEvent("button_click", { "button.id": "checkout", "page": "/cart" });
 * ```
 */
export function trackEvent(
  name: string,
  attributes?: Record<string, string | number | boolean>,
): void {
  const tracer = trace.getTracer("@dfl/observability");

  tracer.startActiveSpan(name, (span) => {
    const dynamicAttrs = getDynamicAttributes();

    span.setAttribute("event.name", name);

    // Attach dynamic resource attributes (viewport, user, route, etc.)
    for (const [key, value] of Object.entries(dynamicAttrs)) {
      span.setAttribute(key, value);
    }

    // Attach caller-provided attributes
    if (attributes) {
      for (const [key, value] of Object.entries(attributes)) {
        span.setAttribute(key, value);
      }
    }

    span.setStatus({ code: SpanStatusCode.OK });
    span.end();
  });
}

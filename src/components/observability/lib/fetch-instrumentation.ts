import { Tracer, SpanKind, SpanStatusCode } from "@opentelemetry/api";
import { getDynamicAttributes } from "./resource-attributes";

type NativeFetch = typeof globalThis.fetch;

let _originalFetch: NativeFetch | null = null;

/**
 * Monkey-patches `window.fetch` to automatically create OTel spans for
 * every outgoing HTTP request.
 *
 * Collector URLs are filtered out to prevent infinite export loops.
 */
export function instrumentFetch(tracer: Tracer): void {
  if (_originalFetch) {
    // Already instrumented — avoid double-wrapping.
    return;
  }

  _originalFetch = window.fetch.bind(window);

  window.fetch = async (
    input: RequestInfo | URL,
    init?: RequestInit,
  ): Promise<Response> => {
    const url =
      input instanceof Request ? input.url : input instanceof URL ? input.href : input;
    const method = init?.method ?? (input instanceof Request ? input.method : "GET");

    // Filter out OTel collector traffic to avoid infinite loops.
    const collectorUrl = (globalThis as Record<string, unknown>).__otelCollectorUrl;
    if (typeof collectorUrl === "string" && url.startsWith(collectorUrl)) {
      return _originalFetch!(input, init);
    }

    const dynamicAttrs = getDynamicAttributes();

    return tracer.startActiveSpan(
      `HTTP ${method.toUpperCase()}`,
      {
        kind: SpanKind.CLIENT,
        attributes: {
          "http.method": method.toUpperCase(),
          "http.url": url,
          ...dynamicAttrs,
        },
      },
      async (span) => {
        try {
          const response = await _originalFetch!(input, init);

          span.setAttribute("http.status_code", response.status);

          const contentLength = response.headers.get("content-length");
          if (contentLength) {
            span.setAttribute(
              "http.response_content_length",
              parseInt(contentLength, 10),
            );
          }

          if (response.status >= 400) {
            span.setStatus({
              code: SpanStatusCode.ERROR,
              message: `HTTP ${response.status}`,
            });
          }

          return response;
        } catch (error) {
          const message =
            error instanceof Error ? error.message : "Network request failed";
          span.setStatus({ code: SpanStatusCode.ERROR, message });
          span.recordException(error instanceof Error ? error : new Error(message));
          throw error;
        } finally {
          span.end();
        }
      },
    );
  };
}

/**
 * Restores the original `window.fetch`, removing instrumentation.
 */
export function uninstrumentFetch(): void {
  if (_originalFetch) {
    window.fetch = _originalFetch;
    _originalFetch = null;
  }
}

import { useEffect } from "react";
import { useQueryClient, type QueryClient } from "@tanstack/react-query";
import { trace, SpanStatusCode } from "@opentelemetry/api";
import { getDynamicAttributes } from "../lib/resource-attributes";

/**
 * Subscribes to the React Query cache and creates OTel error spans
 * whenever a query transitions to the `error` state.
 *
 * Safe to use outside QueryClientProvider — gracefully no-ops.
 */
export function useQueryErrorReporter(): void {
  let queryClient: QueryClient | null = null;
  try {
    // useQueryClient internally calls useContext (preserving hook order)
    // then throws if no provider — the try-catch is safe here.
    // eslint-disable-next-line react-hooks/rules-of-hooks
    queryClient = useQueryClient();
  } catch {
    // Not inside a QueryClientProvider — query error reporting disabled
  }

  useEffect(() => {
    if (!queryClient) return;

    const tracer = trace.getTracer("@dfl/observability");

    const unsubscribe = queryClient.getQueryCache().subscribe((event) => {
      if (event.type === "updated" && event.action.type === "error") {
        const query = event.query;
        const error = query.state.error;

        tracer.startActiveSpan("react-query-error", (span) => {
          const dynamicAttrs = getDynamicAttributes();
          for (const [key, value] of Object.entries(dynamicAttrs)) {
            span.setAttribute(key, value);
          }

          span.setAttribute("query.key", JSON.stringify(query.queryKey));
          span.setAttribute(
            "error.message",
            error instanceof Error ? error.message : String(error),
          );
          span.setAttribute(
            "error.type",
            error instanceof Error ? error.constructor.name : typeof error,
          );

          span.setStatus({
            code: SpanStatusCode.ERROR,
            message:
              error instanceof Error ? error.message : "React Query error",
          });

          if (error instanceof Error) {
            span.recordException(error);
          }

          span.end();
        });
      }
    });

    return () => {
      unsubscribe();
    };
  }, [queryClient]);
}

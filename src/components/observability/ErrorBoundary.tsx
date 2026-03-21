import React, { Component, ErrorInfo, ReactNode } from "react";
import { trace, SpanStatusCode } from "@opentelemetry/api";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * React error boundary that reports uncaught component errors to OTel
 * as error spans before rendering a fallback UI.
 */
export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    const tracer = trace.getTracer("@dfl/observability");

    tracer.startActiveSpan("react-error-boundary", (span) => {
      span.setAttribute("error.message", error.message);
      span.setAttribute("error.stack", error.stack ?? "");
      span.setAttribute(
        "error.component_stack",
        errorInfo.componentStack ?? "",
      );

      span.setStatus({
        code: SpanStatusCode.ERROR,
        message: error.message,
      });

      span.recordException(error);
      span.end();
    });
  }

  private handleReload = (): void => {
    window.location.reload();
  };

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex min-h-[200px] flex-col items-center justify-center gap-4 rounded-lg border border-red-200 bg-red-50 p-8 text-center dark:border-red-900 dark:bg-red-950">
          <h2 className="text-lg font-semibold text-red-800 dark:text-red-200">
            Something went wrong
          </h2>
          <p className="max-w-md text-sm text-red-600 dark:text-red-400">
            An unexpected error occurred. Please try reloading the page.
          </p>
          <button
            onClick={this.handleReload}
            className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:bg-red-700 dark:hover:bg-red-600"
          >
            Reload page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

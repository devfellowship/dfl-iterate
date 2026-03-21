import { useEffect, useRef } from "react";
import { metrics } from "@opentelemetry/api";
import type { Metric } from "web-vitals";

/**
 * Captures Core Web Vitals (LCP, FID, CLS, INP, TTFB) and reports them
 * as OTel histogram metrics via the global MeterProvider.
 *
 * Runs once on mount. The `web-vitals` callbacks fire at most once per
 * metric per page load, so no debouncing is needed.
 */
export function useWebVitals(): void {
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    const meter = metrics.getMeter("web-vitals");

    const lcpHistogram = meter.createHistogram("web_vital.lcp", {
      description: "Largest Contentful Paint (ms)",
      unit: "ms",
    });
    const clsHistogram = meter.createHistogram("web_vital.cls", {
      description: "Cumulative Layout Shift",
      unit: "",
    });
    const inpHistogram = meter.createHistogram("web_vital.inp", {
      description: "Interaction to Next Paint (ms)",
      unit: "ms",
    });
    const ttfbHistogram = meter.createHistogram("web_vital.ttfb", {
      description: "Time to First Byte (ms)",
      unit: "ms",
    });

    const report = (
      histogram: ReturnType<typeof meter.createHistogram>,
      metric: Metric,
    ) => {
      histogram.record(metric.value, {
        "metric.id": metric.id,
        "metric.rating": metric.rating,
      });
    };

    // Dynamic import so tree-shaking can drop web-vitals entirely when unused.
    import("web-vitals").then(({ onLCP, onCLS, onINP, onTTFB }) => {
      onLCP((m) => report(lcpHistogram, m));
      onCLS((m) => report(clsHistogram, m));
      onINP((m) => report(inpHistogram, m));
      onTTFB((m) => report(ttfbHistogram, m));
    });
  }, []);
}

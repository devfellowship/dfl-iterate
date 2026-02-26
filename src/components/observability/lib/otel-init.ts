import { resourceFromAttributes } from "@opentelemetry/resources";
import {
  WebTracerProvider,
  BatchSpanProcessor,
} from "@opentelemetry/sdk-trace-web";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http";
import {
  MeterProvider,
  PeriodicExportingMetricReader,
} from "@opentelemetry/sdk-metrics";
import { OTLPMetricExporter } from "@opentelemetry/exporter-metrics-otlp-http";
import { trace, metrics } from "@opentelemetry/api";
import { getStaticAttributes } from "./resource-attributes";

export interface OtelBrowserConfig {
  serviceName: string;
  serviceVersion: string;
  collectorUrl: string;
  apiKey?: string;
}

export interface OtelProviders {
  tracerProvider: WebTracerProvider;
  meterProvider: MeterProvider;
}

export function initOtelBrowser(config: OtelBrowserConfig): OtelProviders {
  const { serviceName, serviceVersion, collectorUrl, apiKey } = config;

  const headers: Record<string, string> = {};
  if (apiKey) {
    headers["x-api-key"] = apiKey;
  }

  const staticAttributes = getStaticAttributes();

  const resource = resourceFromAttributes({
    "service.name": serviceName,
    "service.version": serviceVersion,
    ...staticAttributes,
  });

  // --- Traces ---
  const traceExporter = new OTLPTraceExporter({
    url: `${collectorUrl}/v1/traces`,
    headers,
  });

  const tracerProvider = new WebTracerProvider({
    resource,
    spanProcessors: [new BatchSpanProcessor(traceExporter)],
  });

  tracerProvider.register();

  // --- Metrics ---
  const metricExporter = new OTLPMetricExporter({
    url: `${collectorUrl}/v1/metrics`,
    headers,
  });

  const metricReader = new PeriodicExportingMetricReader({
    exporter: metricExporter,
    exportIntervalMillis: 60_000,
  });

  const meterProvider = new MeterProvider({
    resource,
    readers: [metricReader],
  });

  metrics.setGlobalMeterProvider(meterProvider);

  // Store the collector URL globally so the fetch instrumentation can filter it
  (globalThis as Record<string, unknown>).__otelCollectorUrl = collectorUrl;

  return { tracerProvider, meterProvider };
}

export function shutdownOtel(providers: OtelProviders): void {
  const { tracerProvider, meterProvider } = providers;

  trace.disable();
  metrics.disable();

  tracerProvider.shutdown().catch((err) => {
    console.warn("[observability] tracer shutdown error:", err);
  });

  meterProvider.shutdown().catch((err) => {
    console.warn("[observability] meter shutdown error:", err);
  });
}

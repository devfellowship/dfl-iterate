/**
 * Auto-collected resource attributes for browser observability.
 *
 * Static attributes are gathered once at init time.
 * Dynamic attributes change during the session (e.g. route, viewport).
 * User attributes are set after authentication completes.
 */

// ---- Module-level mutable state for post-auth enrichment ----
let _userId: string | undefined;
let _userRole: string | undefined;

export function setUserId(id: string): void {
  _userId = id;
}

export function setUserRole(role: string): void {
  _userRole = role;
}

// ---- Session ID (stable per tab session) ----
function getSessionId(): string {
  const key = "__otel_session_id";
  let id = sessionStorage.getItem(key);
  if (!id) {
    id = crypto.randomUUID();
    sessionStorage.setItem(key, id);
  }
  return id;
}

// ---- Browser detection (lightweight, no external lib) ----
interface BrowserInfo {
  name: string;
  version: string;
}

function detectBrowser(): BrowserInfo {
  const ua = navigator.userAgent;

  if (ua.includes("Firefox/")) {
    const match = ua.match(/Firefox\/([\d.]+)/);
    return { name: "Firefox", version: match?.[1] ?? "unknown" };
  }
  if (ua.includes("Edg/")) {
    const match = ua.match(/Edg\/([\d.]+)/);
    return { name: "Edge", version: match?.[1] ?? "unknown" };
  }
  if (ua.includes("Chrome/") && !ua.includes("Edg/")) {
    const match = ua.match(/Chrome\/([\d.]+)/);
    return { name: "Chrome", version: match?.[1] ?? "unknown" };
  }
  if (ua.includes("Safari/") && !ua.includes("Chrome/")) {
    const match = ua.match(/Version\/([\d.]+)/);
    return { name: "Safari", version: match?.[1] ?? "unknown" };
  }

  return { name: "unknown", version: "unknown" };
}

// ---- OS detection ----
function detectOS(): string {
  const ua = navigator.userAgent;
  if (ua.includes("Win")) return "Windows";
  if (ua.includes("Mac")) return "macOS";
  if (ua.includes("Linux")) return "Linux";
  if (ua.includes("Android")) return "Android";
  if (/iPhone|iPad|iPod/.test(ua)) return "iOS";
  return "unknown";
}

// ---- Device type via viewport heuristic ----
function detectDeviceType(): string {
  const width = window.innerWidth;
  if (width < 768) return "mobile";
  if (width < 1024) return "tablet";
  return "desktop";
}

// ---- Connection info ----
function getEffectiveConnectionType(): string | undefined {
  const nav = navigator as Navigator & {
    connection?: { effectiveType?: string };
  };
  return nav.connection?.effectiveType;
}

// ---- Public API ----

/**
 * Attributes that are stable for the lifetime of the page.
 * Collected once during OTel SDK initialization.
 */
export function getStaticAttributes(): Record<string, string> {
  const browser = detectBrowser();
  const attrs: Record<string, string> = {
    "browser.name": browser.name,
    "browser.version": browser.version,
    "os.type": detectOS(),
    "device.type": detectDeviceType(),
    "session.id": getSessionId(),
  };

  // Vite env-based app metadata
  const appName = (import.meta as ImportMeta & { env: Record<string, string> })
    .env?.VITE_APP_NAME;
  const appVersion = (
    import.meta as ImportMeta & { env: Record<string, string> }
  ).env?.VITE_APP_VERSION;

  if (appName) attrs["app.name"] = appName;
  if (appVersion) attrs["app.version"] = appVersion;

  return attrs;
}

/**
 * Attributes that may change between spans (viewport, route, user, connection).
 * Called per-span or at strategic points.
 */
export function getDynamicAttributes(): Record<string, string | number> {
  const attrs: Record<string, string | number> = {
    "viewport.width": window.innerWidth,
    "viewport.height": window.innerHeight,
  };

  if (_userId) attrs["user.id"] = _userId;
  if (_userRole) attrs["user.role"] = _userRole;

  const connType = getEffectiveConnectionType();
  if (connType) attrs["connection.effectiveType"] = connType;

  // page.route is typically set by the ObservabilityProvider via React Router
  const route = (globalThis as Record<string, unknown>).__otelCurrentRoute;
  if (typeof route === "string") attrs["page.route"] = route;

  return attrs;
}

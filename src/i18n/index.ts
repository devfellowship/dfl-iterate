// ─────────────────────────────────────────────────────────────────
// i18n helpers — locale resolution + translation factory + URL locale.
// Mirrors apps/revera's src/i18n/index.ts (makeT + localizePath +
// parseLocalePath), adapted to dfl-iterate's routes. PT is the default and
// serves at the bare root; EN lives under /en and ES under /es. Adding a
// locale is a matter of extending LOCALES + the dict.
// ─────────────────────────────────────────────────────────────────
import { I18N, LOCALES, DEFAULT_LOCALE, type Locale } from "./dict";

export { I18N, LOCALES, DEFAULT_LOCALE };
export type { Locale };

export function isLocale(x: string | undefined): x is Locale {
  return !!x && (LOCALES as string[]).includes(x);
}

/** Translation function for a given locale; default-locale fallback then raw key. */
export function makeT(lang: Locale) {
  const dict = I18N;
  return (key: string): string =>
    (dict[lang] && dict[lang][key]) ||
    (dict[DEFAULT_LOCALE] && dict[DEFAULT_LOCALE][key]) ||
    key;
}

/**
 * Build a locale-aware href for an in-app path.
 * Default locale (pt) is unprefixed: localizePath("/", "pt") === "/".
 * Others are prefixed: localizePath("/lesson/x", "en") === "/en/lesson/x".
 * Hash, mailto and external links are returned untouched.
 */
export function localizePath(path: string, lang: Locale): string {
  if (path.startsWith("#") || /^https?:\/\//.test(path) || path.startsWith("mailto:")) {
    return path;
  }
  const clean = path.startsWith("/") ? path : `/${path}`;
  if (lang === DEFAULT_LOCALE) return clean;
  return clean === "/" ? `/${lang}` : `/${lang}${clean}`;
}

/**
 * Split a full pathname into its active locale + the locale-agnostic route.
 * "/"               → { lang: "pt", route: "/" }
 * "/lesson/x"       → { lang: "pt", route: "/lesson/x" }
 * "/en"             → { lang: "en", route: "/" }
 * "/es/lesson/x"    → { lang: "es", route: "/lesson/x" }
 */
export function parseLocalePath(pathname: string): { lang: Locale; route: string } {
  const segs = pathname.split("/").filter(Boolean);
  if (segs.length && isLocale(segs[0])) {
    const rest = segs.slice(1).join("/");
    return { lang: segs[0], route: rest ? `/${rest}` : "/" };
  }
  return { lang: DEFAULT_LOCALE, route: pathname && pathname !== "/" ? pathname : "/" };
}

export const htmlLang: Record<Locale, string> = { pt: "pt-BR", en: "en", es: "es" };
export const ogLocale: Record<Locale, string> = { pt: "pt_BR", en: "en_US", es: "es_ES" };

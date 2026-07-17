// ─────────────────────────────────────────────────────────────────
// Runtime <head> manager for the locale currently rendered. dfl-iterate is a
// Vite SPA, so the per-locale <title>, meta description, <html lang>,
// canonical, og:* and hreflang alternates are applied here imperatively on
// every route/locale change. Mirrors apps/revera's LocalizedHead.
//
// Routes: "/" (home) and "/lesson/:id". The home + lesson pages get their
// per-locale title/description here; the lesson route reuses the lesson
// meta strings (the lesson's own content title is data-driven).
// ─────────────────────────────────────────────────────────────────
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useT } from "./LangContext";
import {
  LOCALES,
  localizePath,
  parseLocalePath,
  htmlLang,
  ogLocale,
  type Locale,
} from "./index";

const ORIGIN = "https://iterahq.dev";

function upsertMeta(attr: "name" | "property", key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function upsertLink(rel: string, href: string, hreflang?: string) {
  const selector = hreflang
    ? `link[rel="${rel}"][hreflang="${hreflang}"]`
    : `link[rel="${rel}"]:not([hreflang])`;
  let el = document.head.querySelector<HTMLLinkElement>(selector);
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    if (hreflang) el.setAttribute("hreflang", hreflang);
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

const hreflangCode: Record<Locale, string> = { pt: "pt-BR", en: "en", es: "es" };

export default function LocalizedHead() {
  const { lang, t } = useT();
  const { pathname } = useLocation();

  useEffect(() => {
    const { route } = parseLocalePath(pathname);
    const isLesson = /^\/lesson(\/|$)/.test(route);

    // <html lang>
    document.documentElement.lang = htmlLang[lang];

    // Canonical + og:url for THIS route/locale
    const canonical = ORIGIN + localizePath(route, lang);
    upsertLink("canonical", canonical);
    upsertMeta("property", "og:url", canonical);
    upsertMeta("property", "og:locale", ogLocale[lang]);

    // hreflang alternates (pt-BR, en, es) + x-default → pt (bare root)
    LOCALES.forEach((l) => {
      upsertLink("alternate", ORIGIN + localizePath(route, l), hreflangCode[l]);
    });
    upsertLink("alternate", ORIGIN + localizePath(route, "pt"), "x-default");

    // Title + description per locale.
    const title = isLesson ? t("meta.lesson.title") : t("meta.home.title");
    const description = isLesson
      ? t("meta.lesson.description")
      : t("meta.home.description");
    document.title = title;
    upsertMeta("name", "description", description);
    upsertMeta("property", "og:title", title);
    upsertMeta("property", "og:description", description);
    upsertMeta("name", "twitter:title", title);
    upsertMeta("name", "twitter:description", description);
  }, [pathname, lang, t]);

  return null;
}

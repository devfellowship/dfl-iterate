// ─────────────────────────────────────────────────────────────────
// React i18n context. The active locale is driven by the URL (react-router
// renders the app under a "/" tree for PT, an "/en" tree for EN and an "/es"
// tree for ES), so each locale is a real, deep-linkable route. `t` translates;
// `lp` localizes an in-app path to the active locale (for <Link> / navigate).
// Mirrors apps/revera's src/i18n/LangContext.tsx.
// ─────────────────────────────────────────────────────────────────
import { createContext, useContext, useMemo, type ReactNode } from "react";
import { makeT, localizePath, DEFAULT_LOCALE, type Locale } from "./index";

interface LangCtxValue {
  lang: Locale;
  t: (key: string) => string;
  /** Localize an in-app path to the active locale (bound localizePath). */
  lp: (path: string) => string;
}

export const LangCtx = createContext<LangCtxValue>({
  lang: DEFAULT_LOCALE,
  t: (k) => k,
  lp: (p) => p,
});

export function useT() {
  return useContext(LangCtx);
}

export function LangProvider({ lang, children }: { lang: Locale; children: ReactNode }) {
  const value = useMemo<LangCtxValue>(
    () => ({
      lang,
      t: makeT(lang),
      lp: (path: string) => localizePath(path, lang),
    }),
    [lang],
  );
  return <LangCtx.Provider value={value}>{children}</LangCtx.Provider>;
}

// ─────────────────────────────────────────────────────────────────
// Navbar language selector (PT / EN / ES). Mirrors apps/revera's
// LanguageSelector (compact button + listbox, aria-pressed/aria-selected),
// restyled to fit dfl-iterate's design tokens (primary accent, Inter). It
// iterates LOCALES, so adding a locale to the dict wires it up here
// automatically.
//
// Switching locale navigates (client-side) to the same page under the target
// locale — /lesson/x ⇄ /en/lesson/x ⇄ /es/lesson/x — via localizePath, so the
// URL always mirrors the current route. PT is the bare root; EN is /en; ES
// is /es.
// ─────────────────────────────────────────────────────────────────
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useT } from "@/i18n/LangContext";
import { LOCALES, localizePath, parseLocalePath, type Locale } from "@/i18n";

interface Props {
  /** "nav" = compact dropdown (desktop); "mobile" = inline segmented toggle. */
  variant?: "nav" | "mobile";
  onSwitch?: () => void;
}

const LanguageSelector = ({ variant = "nav", onSwitch }: Props) => {
  const { lang, t } = useT();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const switchTo = (l: Locale) => {
    if (l !== lang) {
      const { route } = parseLocalePath(location.pathname);
      navigate(localizePath(route, l));
    }
    setOpen(false);
    onSwitch?.();
  };

  const label = (l: Locale) => t(`lang.${l}`);
  const endonym: Record<Locale, string> = {
    pt: "Português",
    en: "English",
    es: "Español",
  };

  // Inline segmented toggle for the mobile menu.
  if (variant === "mobile") {
    return (
      <div
        className="flex items-center gap-2 py-3"
        role="group"
        aria-label={t("lang.aria")}
      >
        {LOCALES.map((l) => (
          <button
            key={l}
            type="button"
            onClick={() => switchTo(l)}
            aria-pressed={lang === l}
            className={`px-3 py-1.5 text-xs tracking-[0.15em] uppercase rounded-lg border transition-colors duration-300 ${
              lang === l
                ? "border-primary text-primary"
                : "border-border text-muted-foreground hover:text-primary hover:border-primary/50"
            }`}
          >
            {label(l)}
          </button>
        ))}
      </div>
    );
  }

  // Compact dropdown for the desktop navbar.
  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={t("lang.aria")}
        className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs tracking-[0.15em] uppercase rounded-lg border border-border text-muted-foreground hover:text-primary hover:border-primary/50 transition-colors duration-300"
      >
        {label(lang)}
        <span aria-hidden="true" className="text-[9px] leading-none opacity-70">
          ▾
        </span>
      </button>
      {open && (
        <ul
          role="listbox"
          aria-label={t("lang.aria")}
          className="absolute right-0 mt-2 min-w-[9rem] rounded-xl border border-border bg-card shadow-lg overflow-hidden z-50"
        >
          {LOCALES.map((l) => (
            <li key={l}>
              <button
                type="button"
                role="option"
                aria-selected={lang === l}
                onClick={() => switchTo(l)}
                className={`w-full text-left px-3 py-2 text-xs tracking-[0.12em] uppercase transition-colors duration-200 ${
                  lang === l
                    ? "text-primary bg-primary/10"
                    : "text-muted-foreground hover:text-primary hover:bg-primary/5"
                }`}
              >
                {label(l)} · {endonym[l]}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default LanguageSelector;

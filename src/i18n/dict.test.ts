import { describe, it, expect } from "vitest";
import { I18N, LOCALES, DEFAULT_LOCALE } from "./dict";

// Guards the i18n contract: every locale must expose the exact same key set as
// the default (PT) source of truth — so a translated page never falls through
// to a raw dotted key. Mirrors apps/revera's expectation that pt/en/es stay
// symmetric.
describe("i18n dictionary", () => {
  const ptKeys = Object.keys(I18N[DEFAULT_LOCALE]).sort();

  it("has the three expected locales", () => {
    expect(LOCALES).toEqual(["pt", "en", "es"]);
  });

  it("every locale has an identical key set (no missing / extra keys)", () => {
    for (const locale of LOCALES) {
      const keys = Object.keys(I18N[locale]).sort();
      expect(keys, `locale "${locale}" key set differs from "${DEFAULT_LOCALE}"`).toEqual(ptKeys);
    }
  });

  it("every value is a non-empty string", () => {
    for (const locale of LOCALES) {
      for (const [key, value] of Object.entries(I18N[locale])) {
        expect(typeof value, `${locale}.${key} must be a string`).toBe("string");
        expect(value.trim().length, `${locale}.${key} must be non-empty`).toBeGreaterThan(0);
      }
    }
  });
});

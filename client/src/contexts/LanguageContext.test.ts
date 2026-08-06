import { describe, expect, it, beforeEach } from "vitest";
import { applyLocaleDocumentSettings } from "./LanguageContext";

describe("applyLocaleDocumentSettings", () => {
  beforeEach(() => {
    (globalThis as { document?: { documentElement: { lang: string; dir: string } } }).document = { documentElement: { lang: "", dir: "" } };
  });

  it("sets RTL for Arabic", () => {
    applyLocaleDocumentSettings("ar");
    expect(document.documentElement.lang).toBe("ar");
    expect(document.documentElement.dir).toBe("rtl");
  });

  it.each(["fr", "en"] as const)("sets LTR for %s", (locale) => {
    applyLocaleDocumentSettings(locale);
    expect(document.documentElement.lang).toBe(locale);
    expect(document.documentElement.dir).toBe("ltr");
  });
});

export {};

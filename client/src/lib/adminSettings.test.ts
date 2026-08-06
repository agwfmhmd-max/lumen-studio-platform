import { describe, expect, it } from "vitest";
import { settingsToFooter, toSettingsPayload } from "./adminSettings";

describe("admin settings", () => {
  it("maps admin contact fields to database columns and removes blank links", () => {
    expect(toSettingsPayload({ siteName: " إنتاج ", email: " admin@example.com ", instagramUrl: "https://instagram.com/brand", linkedinUrl: "", behanceUrl: "  ", tagline: " إبداع " })).toEqual({ site_name: "إنتاج", email: "admin@example.com", instagram_url: "https://instagram.com/brand", linkedin_url: null, behance_url: null, tagline: "إبداع" });
  });
  it("exposes only configured footer contact channels", () => {
    expect(settingsToFooter({ email: "", instagramUrl: "https://instagram.com/brand" })).toEqual({ email: null, instagramUrl: "https://instagram.com/brand", linkedinUrl: null, behanceUrl: null });
  });
});

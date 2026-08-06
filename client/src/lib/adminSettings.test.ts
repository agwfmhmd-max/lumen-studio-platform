import { describe, expect, it } from "vitest";
import { settingsToFooter, toSettingsPayload } from "./adminSettings";

describe("admin settings", () => {
  it("maps admin contact fields to database columns and removes blank links", () => {
    expect(toSettingsPayload({ siteName: " إنتاج ", email: " admin@example.com ", instagramUrl: "https://instagram.com/brand", linkedinUrl: "", behanceUrl: "  ", tagline: " إبداع " })).toEqual({ site_name: "إنتاج", email: "admin@example.com", whatsapp: null, instagram_url: "https://instagram.com/brand", linkedin_url: null, behance_url: null, tagline: "إبداع", announcement_text: null, announcement_url: null, announcement_image_url: null, announcement_active: false });
  });
  it("maps WhatsApp and announcement fields including the active flag", () => {
    expect(toSettingsPayload({ siteName: "إنتاج", email: "", whatsapp: " +212 600 ", instagramUrl: "", linkedinUrl: "", behanceUrl: "", tagline: "", announcementText: "عرض جديد", announcementUrl: "https://example.com", announcementImageUrl: "https://res.cloudinary.com/demo/image/upload/ad.jpg", announcementActive: true })).toMatchObject({ whatsapp: "+212 600", announcement_text: "عرض جديد", announcement_url: "https://example.com", announcement_image_url: "https://res.cloudinary.com/demo/image/upload/ad.jpg", announcement_active: true });
  });
  it("exposes only configured footer contact channels", () => {
    expect(settingsToFooter({ email: "", instagramUrl: "https://instagram.com/brand" })).toEqual({ email: null, instagramUrl: "https://instagram.com/brand", linkedinUrl: null, behanceUrl: null });
  });
});

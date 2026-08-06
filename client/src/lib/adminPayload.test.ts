import { describe, expect, it } from "vitest";
import { buildDeletePlan, buildEntityPayload, buildProjectPayload, buildReplacementPlan, extractEditFields } from "./adminPayload";

const draft = {
  title: "  Aurora  ", slug: "aurora", content: "Quote", excerpt: "Role", description: " Film production ", categoryId: "cat-1", clientId: "client-1", executionDate: "2026-08-06", servicesUsed: "Direction, Edit", gallery: "https://one\n https://two ", videoUrl: "https://video", videoPublicId: "video-id", metaTitle: "Meta", metaDescription: "Description", ogImage: "https://og", media: { url: "https://cover", publicId: "cover-id", resourceType: "image" as const },
};

describe("admin payloads", () => {
  it("preserves the complete project fields", () => {
    expect(buildProjectPayload(draft)).toMatchObject({ title: "Aurora", description: "Film production", category_id: "cat-1", client_id: "client-1", execution_date: "2026-08-06", gallery: ["https://one", "https://two"], services_used: ["Direction", "Edit"], video_url: "https://video", video_public_id: "video-id" });
  });

  it("builds client, testimonial, and setting CRUD payloads", () => {
    expect(buildEntityPayload("clients", draft)).toEqual({ name: "Aurora", website: "Role", logo_url: "https://cover", logo_public_id: "cover-id" });
    expect(buildEntityPayload("testimonials", draft)).toEqual({ client_name: "Aurora", quote: "Quote", role: "Role" });
    expect(buildEntityPayload("settings", draft)).toEqual({ key: "Aurora", value: "Quote" });
  });

  it("replaces only the asset field that changed", () => {
    expect(buildReplacementPlan({ cover_public_id: "old-cover", cover_resource_type: "image", video_public_id: "keep-video" }, { publicId: "new-cover", resourceType: "image", videoPublicId: "keep-video" })).toEqual([["old-cover", "image"]]);
    expect(buildReplacementPlan({ cover_public_id: "keep-cover", video_public_id: "old-video" }, { publicId: "keep-cover", videoPublicId: "new-video" })).toEqual([["old-video", "video"]]);
    expect(buildReplacementPlan({ logo_public_id: "old-logo" }, { publicId: "new-logo", resourceType: "image" })).toEqual([["old-logo", "image"]]);
  });

  it("builds deletion plans for client logos, project covers, and videos", () => {
    expect(buildDeletePlan({ logo_public_id: "logo-id" })).toEqual([["logo-id", "image"]]);
    expect(buildDeletePlan({ cover_public_id: "cover-id", cover_resource_type: "image", video_public_id: "video-id" })).toEqual([["cover-id", "image"], ["video-id", "video"]]);
    expect(buildDeletePlan({})).toEqual([]);
  });

  it("extracts entity-specific edit fields", () => {
    expect(extractEditFields({ name: "Client", website: "https://client", logo_url: "logo", logo_public_id: "logo-id" })).toMatchObject({ title: "Client", excerpt: "https://client", mediaUrl: "logo", mediaPublicId: "logo-id" });
    expect(extractEditFields({ client_name: "Client", quote: "Great", role: "Director" })).toMatchObject({ title: "Client", content: "Great", excerpt: "Director" });
    expect(extractEditFields({ key: "site_name", value: "Lumen" })).toMatchObject({ title: "site_name", content: "Lumen" });
  });
});

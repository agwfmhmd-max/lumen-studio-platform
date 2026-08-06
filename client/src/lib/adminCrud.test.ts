import { describe, expect, it } from "vitest";
import { emptyAdminDraft, shouldReplaceCloudinaryAsset, slugifyAdminTitle } from "@/pages/Admin";

describe("admin CRUD workflow helpers", () => {
  it("creates stable slugs from titles", () => {
    expect(slugifyAdminTitle("  Motion / Identity 2026  ")).toBe("motion-identity-2026");
  });

  it("starts a new draft without an editing record", () => {
    const draft = emptyAdminDraft();
    expect(draft.title).toBe("");
    expect(draft.slug).toBe("");
    expect(draft.media.publicId).toBe("");
    expect(draft.media.resourceType).toBe("image");
  });

  it("only requests Cloudinary cleanup when an asset is replaced", () => {
    expect(shouldReplaceCloudinaryAsset("old/public-id", "new/public-id")).toBe(true);
    expect(shouldReplaceCloudinaryAsset("same/public-id", "same/public-id")).toBe(false);
    expect(shouldReplaceCloudinaryAsset(undefined, "new/public-id")).toBe(false);
  });
});

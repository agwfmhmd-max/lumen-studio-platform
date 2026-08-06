export type AdminSettingsDraft = { siteName: string; email: string; instagramUrl: string; linkedinUrl: string; behanceUrl: string; tagline: string };

export function toSettingsPayload(draft: AdminSettingsDraft) {
  return {
    site_name: draft.siteName.trim(),
    email: draft.email.trim() || null,
    instagram_url: draft.instagramUrl.trim() || null,
    linkedin_url: draft.linkedinUrl.trim() || null,
    behance_url: draft.behanceUrl.trim() || null,
    tagline: draft.tagline.trim() || null,
  };
}

export function settingsToFooter(settings: Partial<AdminSettingsDraft> | null | undefined) {
  return {
    email: settings?.email?.trim() || null,
    instagramUrl: settings?.instagramUrl?.trim() || null,
    linkedinUrl: settings?.linkedinUrl?.trim() || null,
    behanceUrl: settings?.behanceUrl?.trim() || null,
  };
}

export type AdminSettingsDraft = { siteName: string; email: string; whatsapp?: string; instagramUrl: string; linkedinUrl: string; behanceUrl: string; tagline: string; announcementText?: string; announcementUrl?: string; announcementImageUrl?: string; announcementActive?: boolean };

export function toSettingsPayload(draft: AdminSettingsDraft) {
  return {
    site_name: draft.siteName.trim(),
    email: draft.email.trim() || null,
    whatsapp: draft.whatsapp?.trim() || null,
    instagram_url: draft.instagramUrl.trim() || null,
    linkedin_url: draft.linkedinUrl.trim() || null,
    behance_url: draft.behanceUrl.trim() || null,
    tagline: draft.tagline.trim() || null,
    announcement_text: draft.announcementText?.trim() || null,
    announcement_url: draft.announcementUrl?.trim() || null,
    announcement_image_url: draft.announcementImageUrl?.trim() || null,
    announcement_active: Boolean(draft.announcementActive),
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

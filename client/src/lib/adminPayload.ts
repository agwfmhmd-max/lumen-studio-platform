export type AdminMedia = { url: string; publicId: string; resourceType: "image" | "video" | "raw" };

export type AdminDraftFields = {
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  description: string;
  categoryId: string;
  clientId: string;
  executionDate: string;
  servicesUsed: string;
  gallery: string;
  videoUrl: string;
  videoPublicId: string;
  metaTitle: string;
  metaDescription: string;
  ogImage: string;
  media: AdminMedia;
};

const list = (value: string, separator: string) => value.split(separator).map(item => item.trim()).filter(Boolean);

export function buildProjectPayload(draft: AdminDraftFields) {
  return {
    title: draft.title.trim(),
    slug: draft.slug.trim(),
    description: draft.description.trim(),
    category_id: draft.categoryId || null,
    client_id: draft.clientId || null,
    execution_date: draft.executionDate || null,
    cover_url: draft.media.url || null,
    cover_public_id: draft.media.publicId || null,
    cover_resource_type: draft.media.resourceType === "video" ? "video" : "image",
    gallery: list(draft.gallery, "\n"),
    video_url: draft.videoUrl.trim() || null,
    video_public_id: draft.videoPublicId.trim() || null,
    services_used: list(draft.servicesUsed, ","),
    is_published: true,
  };
}

export function extractEditFields(item: any) {
  return {
    title: item.title || item.name || item.client_name || item.key || "",
    content: item.content || item.quote || item.value || "",
    excerpt: item.excerpt || item.website || item.role || "",
    mediaUrl: item.cover_url || item.logo_url || "",
    mediaPublicId: item.cover_public_id || item.logo_public_id || "",
  };
}

export function buildReplacementPlan(old: any, next: { publicId?: string; resourceType?: "image" | "video" | "raw"; videoPublicId?: string }) {
  const plan: [string, "image" | "video"][] = [];
  if (next.publicId && old?.cover_public_id && old.cover_public_id !== next.publicId) plan.push([old.cover_public_id, old.cover_resource_type === "video" ? "video" : "image"]);
  if (next.publicId && old?.logo_public_id && old.logo_public_id !== next.publicId) plan.push([old.logo_public_id, "image"]);
  if (next.videoPublicId && old?.video_public_id && old.video_public_id !== next.videoPublicId) plan.push([old.video_public_id, "video"]);
  return plan;
}

export function buildDeletePlan(row: any) {
  return [[row?.cover_public_id, row?.cover_resource_type === "video" ? "video" : "image"], [row?.logo_public_id, "image"], [row?.video_public_id, "video"]].filter(([publicId]) => Boolean(publicId)) as [string, "image" | "video"][];
}

export function buildEntityPayload(table: "clients" | "testimonials" | "settings", draft: AdminDraftFields) {
  if (table === "clients") return { name: draft.title.trim(), website: draft.excerpt.trim() || null, logo_url: draft.media.url || null, logo_public_id: draft.media.publicId || null };
  if (table === "testimonials") return { client_name: draft.title.trim(), quote: draft.content.trim(), role: draft.excerpt.trim() || null };
  return { key: draft.title.trim(), value: draft.content.trim() };
}

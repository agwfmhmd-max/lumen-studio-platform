import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL || import.meta.env.SUPABASE_URL || "",
  import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.SUPABASE_ANON_KEY || "",
  { auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true } },
);

export type MediaAsset = { url: string; publicId?: string; type?: "image" | "video" };

export type Service = {
  id: string; title: string; slug: string; excerpt?: string; description?: string;
  icon?: string; accent?: string; sort_order?: number; is_published?: boolean;
};
export type Project = {
  id: string; title: string; slug: string; description?: string; cover_url?: string;
  gallery?: MediaAsset[]; video_url?: string; execution_date?: string; services_used?: string[];
  is_featured?: boolean; category?: { name: string; slug: string } | null; client?: { name: string } | null;
};
export type BlogPost = {
  id: string; title: string; slug: string; excerpt?: string; content: string; cover_url?: string;
  meta_title?: string; meta_description?: string; og_image_url?: string; published_at?: string;
};

export async function getSettings() {
  const { data } = await supabase.from("settings").select("*").eq("id", 1).maybeSingle();
  return data;
}

export async function getServices() {
  const { data, error } = await supabase.from("services").select("*").eq("is_published", true).order("sort_order");
  if (error) throw error;
  return (data || []) as Service[];
}

export async function getProjects() {
  const { data, error } = await supabase.from("projects").select("*, category:categories(name,slug), client:clients(name)").eq("is_published", true).order("created_at", { ascending: false });
  if (error) throw error;
  return (data || []) as Project[];
}

export async function getProject(slug: string) {
  const { data, error } = await supabase.from("projects").select("*, category:categories(name,slug), client:clients(name)").eq("slug", slug).maybeSingle();
  if (error) throw error;
  return data as Project | null;
}

export async function getPosts() {
  const { data, error } = await supabase.from("blog_posts").select("*").eq("is_published", true).order("published_at", { ascending: false });
  if (error) throw error;
  return (data || []) as BlogPost[];
}

export async function getPost(slug: string) {
  const { data, error } = await supabase.from("blog_posts").select("*").eq("slug", slug).maybeSingle();
  if (error) throw error;
  return data as BlogPost | null;
}

export async function createContact(payload: { name: string; email: string; phone?: string; message: string }) {
  const { error } = await supabase.from("contacts").insert(payload);
  if (error) throw error;
}

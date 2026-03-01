import { supabase } from "./supabase";
import type { Package, ItineraryDay } from "./types";

// Helper to map Supabase row to our Package type
function mapRow(row: Record<string, unknown>): Package {
  return {
    id: row.id as string,
    slug: row.slug as string,
    title: row.title as string,
    area: row.area as string,
    duration_days: row.duration_days as number,
    max_persons: row.max_persons as number,
    price_from: Number(row.price_from),
    currency: (row.currency as string) || "EUR",
    perex: (row.perex as string) || "",
    description: (row.description as string) || "",
    itinerary: (row.itinerary as ItineraryDay[]) || [],
    included: (row.included as string[]) || [],
    excluded: (row.excluded as string[]) || [],
    highlights: (row.highlights as string[]) || [],
    badge: row.badge as string | undefined,
    cover_url: (row.cover_url as string) || "",
    gallery_urls: (row.gallery_urls as string[]) || [],
    active: row.active as boolean,
    featured: (row.featured as boolean) || false,
  };
}

export async function getFeaturedPackages(): Promise<Package[]> {
  const { data, error } = await supabase
    .from("packages")
    .select("*")
    .eq("active", true)
    .eq("featured", true)
    .order("created_at", { ascending: true });

  // If error or no featured packages, fall back to first 3 active packages
  if (error || !data || data.length === 0) {
    if (error) console.warn("getFeaturedPackages fallback:", error.message);
    const { data: fallback } = await supabase
      .from("packages")
      .select("*")
      .eq("active", true)
      .order("created_at", { ascending: true })
      .limit(3);
    return (fallback || []).map(mapRow);
  }

  return data.map(mapRow);
}

export async function getActivePackages(): Promise<Package[]> {
  const { data, error } = await supabase
    .from("packages")
    .select("*")
    .eq("active", true)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Error fetching packages:", error);
    return [];
  }

  return (data || []).map(mapRow);
}

export async function getAllPackages(): Promise<Package[]> {
  const { data, error } = await supabase
    .from("packages")
    .select("*")
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Error fetching all packages:", error);
    return [];
  }

  return (data || []).map(mapRow);
}

export async function getPackageBySlug(
  slug: string
): Promise<Package | null> {
  const { data, error } = await supabase
    .from("packages")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error || !data) {
    return null;
  }

  return mapRow(data);
}

export async function getAreas(): Promise<string[]> {
  const { data, error } = await supabase
    .from("packages")
    .select("area")
    .eq("active", true);

  if (error || !data) return [];

  return [...new Set(data.map((r: { area: string }) => r.area))];
}

export async function createPackage(
  pkg: Omit<Package, "id">
): Promise<Package | null> {
  const { data, error } = await supabase
    .from("packages")
    .insert({
      slug: pkg.slug,
      title: pkg.title,
      area: pkg.area,
      duration_days: pkg.duration_days,
      max_persons: pkg.max_persons,
      price_from: pkg.price_from,
      currency: pkg.currency,
      perex: pkg.perex,
      description: pkg.description,
      itinerary: pkg.itinerary,
      included: pkg.included,
      excluded: pkg.excluded,
      highlights: pkg.highlights,
      badge: pkg.badge || null,
      cover_url: pkg.cover_url,
      gallery_urls: pkg.gallery_urls,
      active: pkg.active,
      featured: pkg.featured ?? false,
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating package:", error);
    return null;
  }

  return mapRow(data);
}

export async function updatePackage(
  id: string,
  updates: Partial<Package>
): Promise<Package | null> {
  const { data, error } = await supabase
    .from("packages")
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error updating package:", error);
    return null;
  }

  return mapRow(data);
}

export async function deletePackage(id: string): Promise<boolean> {
  const { error } = await supabase.from("packages").delete().eq("id", id);

  if (error) {
    console.error("Error deleting package:", error);
    return false;
  }

  return true;
}

// Storage helpers
export async function uploadImage(
  file: File,
  path: string
): Promise<string | null> {
  const { error } = await supabase.storage
    .from("package-images")
    .upload(path, file, { upsert: true });

  if (error) {
    console.error("Error uploading image:", error);
    return null;
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from("package-images").getPublicUrl(path);

  return publicUrl;
}

export async function deleteImage(path: string): Promise<boolean> {
  const { error } = await supabase.storage
    .from("package-images")
    .remove([path]);

  if (error) {
    console.error("Error deleting image:", error);
    return false;
  }

  return true;
}

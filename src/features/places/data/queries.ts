import { supabase } from "@/lib/supabase/client";

export type PlaceListItem = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  category_id: number | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export async function fetchPlaces(limit = 20): Promise<PlaceListItem[]> {
  const { data, error } = await supabase
    .from("places")
    .select(
      "id, name, slug, description, category_id, is_active, created_at, updated_at"
    )
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw error;
  return (data || []) as PlaceListItem[];
}

export async function fetchPlacesPaged(params: {
  pageIndex: number;
  pageSize: number;
  search?: string;
  categoryId?: number | null;
  active?: "all" | "active" | "inactive";
}): Promise<{ rows: PlaceListItem[]; total: number }> {
  const { pageIndex, pageSize } = params;
  const from = pageIndex * pageSize;
  const to = from + pageSize - 1;

  let query = supabase
    .from("places")
    .select(
      "id, name, slug, description, category_id, is_active, created_at, updated_at",
      { count: "exact" }
    )
    .order("created_at", { ascending: false })
    .range(from, to);

  if (params.search && params.search.trim().length > 0) {
    const s = params.search.trim();
    query = query.or(`name.ilike.%${s}%,description.ilike.%${s}%`);
  }
  if (typeof params.categoryId === "number") {
    query = query.eq("category_id", params.categoryId);
  }
  if (params.active === "active") {
    query = query.eq("is_active", true);
  } else if (params.active === "inactive") {
    query = query.eq("is_active", false);
  }

  const { data, count, error } = await query;
  if (error) throw error;
  return { rows: (data || []) as PlaceListItem[], total: count || 0 };
}

export type CategoryLite = { id: number; name: string };
export async function fetchCategoriesLite(): Promise<CategoryLite[]> {
  const { data, error } = await supabase
    .from("categories")
    .select("id, name")
    .order("name");
  if (error) throw error;
  return (data || []) as CategoryLite[];
}

import { supabase } from "@/lib/supabase/client";
import type {
  PlaceItem as PlaceListItem,
  PlacesPagedResult,
  PlacesQueryParams,
} from "@/features/places/types";

export async function fetchPlacesPaged(
  params: PlacesQueryParams
): Promise<PlacesPagedResult> {
  console.log("[places] fetchPlacesPaged params", params);
  const { pageIndex, pageSize } = params;
  const from = pageIndex * pageSize;
  const to = from + pageSize - 1;

  // Fetch from places with joined profiles (owner) and categories
  let query = supabase
    .from("places")
    .select(
      `
      id, name, slug, description, category_id, tags, owner_id, is_active, created_at, updated_at,
      profiles:owner_id ( full_name, username ),
      categories ( name )
    `,
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
  if (error) {
    console.error("[places] fetchPlacesPaged error", error);
  } else {
    console.log("[places] fetchPlacesPaged result", {
      count,
      length: data?.length ?? 0,
      range: { from, to },
      rows: data,
    });
  }
  if (error) throw error;
  type Row = {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    category_id: number | null;
    tags: string[] | null;
    owner_id: string | null;
    is_active: boolean | null;
    created_at: string;
    updated_at: string;
    categories: { name: string }[] | null;
    profiles: { full_name: string | null; username: string | null }[] | null;
  };
  let rows: PlaceListItem[] = (data || []).map((r: Row) => ({
    id: r.id,
    name: r.name,
    slug: r.slug,
    description: r.description,
    category_id: r.category_id ?? null,
    tags: r.tags ?? null,
    owner_id: r.owner_id ?? null,
    is_active: r.is_active ?? true,
    created_at: r.created_at,
    updated_at: r.updated_at,
    category_name:
      r.categories && r.categories[0]?.name ? r.categories[0].name : null,
    owner_name:
      r.profiles && (r.profiles[0]?.full_name || r.profiles[0]?.username)
        ? r.profiles[0]?.full_name ?? r.profiles[0]?.username ?? null
        : null,
  }));
  // Enrich with branch counts for the current page
  const ids = rows.map((r) => r.id);
  if (ids.length > 0) {
    const { data: branchRows, error: branchErr } = await supabase
      .from("branches")
      .select("place_id")
      .in("place_id", ids);
    if (!branchErr && branchRows) {
      const countMap = new Map<string, number>();
      for (const b of branchRows as { place_id: string }[]) {
        countMap.set(b.place_id, (countMap.get(b.place_id) ?? 0) + 1);
      }
      rows = rows.map((r) => ({ ...r, branch_count: countMap.get(r.id) ?? 0 }));
    }
  }
  return { rows, total: count || 0 };
}

export type CategoryLite = { id: number; name: string };
export async function fetchCategoriesLite(): Promise<CategoryLite[]> {
  const { data, error } = await supabase
    .from("categories")
    .select("id, name")
    .order("name");
  if (error) {
    console.error("[places] fetchCategoriesLite error", error);
  } else {
    console.log("[places] fetchCategoriesLite result", data?.length ?? 0);
  }
  if (error) throw error;
  return (data || []) as CategoryLite[];
}

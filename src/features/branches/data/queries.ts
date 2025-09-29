import { supabase } from "@/lib/supabase/client";
import type {
  BranchesPagedResult,
  BranchesQueryParams,
  BranchItem,
  PlaceLite,
} from "@/features/branches/types";

export async function fetchPlacesLite(): Promise<PlaceLite[]> {
  const { data, error } = await supabase
    .from("places")
    .select("id, name")
    .order("name");
  if (error) throw error;
  return (data || []) as PlaceLite[];
}

export async function fetchBranchesPaged(
  params: BranchesQueryParams
): Promise<BranchesPagedResult> {
  const { pageIndex, pageSize } = params;
  const from = pageIndex * pageSize;
  const to = from + pageSize - 1;

  let query = supabase
    .from("branches")
    .select(
      `id, place_id, name, slug, description,
       phone, website_url,
       address_line1, address_line2, city, state, postal_code, country,
       latitude, longitude, price_range,
       is_main_branch, is_active, created_at, updated_at,
       places:place_id(name)`,
      { count: "exact" }
    )
    .order("created_at", { ascending: false })
    .range(from, to);

  if (params.search && params.search.trim().length > 0) {
    const s = params.search.trim();
    query = query.or(
      `name.ilike.%${s}%,slug.ilike.%${s}%,city.ilike.%${s}%,country.ilike.%${s}%`
    );
  }
  if (params.placeId) {
    query = query.eq("place_id", params.placeId);
  }
  if (params.main === "main") query = query.eq("is_main_branch", true);
  else if (params.main === "non_main")
    query = query.eq("is_main_branch", false);
  if (params.active === "active") query = query.eq("is_active", true);
  else if (params.active === "inactive") query = query.eq("is_active", false);

  const { data, count, error } = await query;
  if (error) throw error;
  type Row = {
    id: string;
    place_id: string;
    name: string;
    slug: string;
    description: string | null;
    phone: string | null;
    website_url: string | null;
    address_line1: string | null;
    address_line2: string | null;
    city: string | null;
    state: string | null;
    postal_code: string | null;
    country: string | null;
    latitude: number | null;
    longitude: number | null;
    price_range: number | null;
    is_main_branch: boolean | null;
    is_active: boolean | null;
    created_at: string;
    updated_at: string;
    places: { name: string }[] | { name: string } | null;
  };
  const rows: BranchItem[] = (data || []).map((r: Row) => ({
    id: r.id,
    place_id: r.place_id,
    place_name: Array.isArray(r.places)
      ? r.places[0]?.name ?? null
      : r.places?.name ?? null,
    name: r.name,
    slug: r.slug,
    description: r.description,
    phone: r.phone,
    website_url: r.website_url,
    address_line1: r.address_line1,
    address_line2: r.address_line2,
    city: r.city,
    state: r.state,
    postal_code: r.postal_code,
    country: r.country,
    latitude: r.latitude,
    longitude: r.longitude,
    price_range: r.price_range,
    is_main_branch: r.is_main_branch ?? false,
    is_active: r.is_active ?? true,
    created_at: r.created_at,
    updated_at: r.updated_at,
  }));
  return { rows, total: count || 0 };
}

import { supabase } from "@/lib/supabase/client";
import type {
  CuisinesPagedResult,
  CuisinesQueryParams,
  CuisineItem,
} from "@/features/cuisines/types";

export async function fetchCuisinesPaged(
  params: CuisinesQueryParams
): Promise<CuisinesPagedResult> {
  const { pageIndex, pageSize } = params;
  const from = pageIndex * pageSize;
  const to = from + pageSize - 1;

  let query = supabase
    .from("cuisine_types")
    .select("id, name, description, created_at", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(from, to);

  if (params.search && params.search.trim().length > 0) {
    const s = params.search.trim();
    query = query.or(`name.ilike.%${s}%,description.ilike.%${s}%`);
  }

  const { data, count, error } = await query;
  if (error) throw error;
  return { rows: (data || []) as CuisineItem[], total: count || 0 };
}

export type CreateCuisineInput = {
  name: string;
  description?: string | null;
};

export type UpdateCuisineInput = {
  id: number;
  name?: string;
  description?: string | null;
};

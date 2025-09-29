import { supabase } from "@/lib/supabase/client";
import type {
  CategoriesPagedResult,
  CategoriesQueryParams,
  CategoryItem,
} from "@/features/categories/types";

export async function fetchCategoriesPaged(
  params: CategoriesQueryParams
): Promise<CategoriesPagedResult> {
  const { pageIndex, pageSize } = params;
  const from = pageIndex * pageSize;
  const to = from + pageSize - 1;

  let query = supabase
    .from("categories")
    .select("id, name, slug, description, icon_name, created_at", {
      count: "exact",
    })
    .order("created_at", { ascending: false })
    .range(from, to);

  if (params.search && params.search.trim().length > 0) {
    const s = params.search.trim();
    query = query.or(
      `name.ilike.%${s}%,slug.ilike.%${s}%,description.ilike.%${s}%`
    );
  }

  const { data, count, error } = await query;
  if (error) throw error;
  return { rows: (data || []) as CategoryItem[], total: count || 0 };
}

export type CreateCategoryInput = {
  name: string;
  description?: string | null;
  icon_name?: string | null;
};

export type UpdateCategoryInput = {
  id: number;
  name?: string;
  description?: string | null;
  icon_name?: string | null;
};

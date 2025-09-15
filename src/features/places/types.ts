export type PlacesQueryParams = {
  pageIndex: number;
  pageSize: number;
  search?: string;
  categoryId?: number | null;
  active?: "all" | "active" | "inactive";
};

export type PlaceItem = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  category_id: number | null;
  tags: string[] | null;
  owner_id: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  category_name?: string | null;
  owner_name?: string | null;
  branch_count?: number;
};

export type PlacesPagedResult = {
  rows: PlaceItem[];
  total: number;
};

export type BranchesQueryParams = {
  pageIndex: number;
  pageSize: number;
  search?: string;
  placeId?: string | null;
  main?: "all" | "main" | "non_main";
  active?: "all" | "active" | "inactive";
};

export type BranchItem = {
  id: string;
  place_id: string;
  place_name?: string | null;
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
  is_main_branch: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type BranchesPagedResult = {
  rows: BranchItem[];
  total: number;
};

export type PlaceLite = { id: string; name: string };

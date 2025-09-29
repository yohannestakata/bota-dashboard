export type CuisinesQueryParams = {
  pageIndex: number;
  pageSize: number;
  search?: string;
};

export type CuisineItem = {
  id: number;
  name: string;
  description: string | null;
  created_at: string;
};

export type CuisinesPagedResult = {
  rows: CuisineItem[];
  total: number;
};

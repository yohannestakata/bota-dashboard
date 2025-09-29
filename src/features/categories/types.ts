export type CategoriesQueryParams = {
  pageIndex: number;
  pageSize: number;
  search?: string;
};

export type CategoryItem = {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  icon_name: string | null;
  created_at: string;
};

export type CategoriesPagedResult = {
  rows: CategoryItem[];
  total: number;
};

"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { DataTable } from "@/components/ui/data-table";
import {
  categoryColumns,
  type CategoryRow,
} from "@/features/categories/list/columns";
import { AddCategoryDialog } from "@/features/categories/list/add-category-dialog";
import { useCategoriesPaged } from "@/features/categories/data/hooks";

function toRows(api: CategoryRow[]): CategoryRow[] {
  return api;
}

export default function CategoriesPage() {
  const [rows, setRows] = React.useState<CategoryRow[] | null>(null);
  const [total, setTotal] = React.useState(0);
  const [search, setSearch] = React.useState("");
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const query = useCategoriesPaged({
    pageIndex: pagination.pageIndex,
    pageSize: pagination.pageSize,
    search,
  });

  React.useEffect(() => {
    if (query.data) {
      setRows(toRows(query.data.rows));
      setTotal(query.data.total);
    }
    if (query.isError) {
      setRows([]);
      setTotal(0);
    }
  }, [query.data, query.isError]);

  const loadingText = query.isPending
    ? "Loading categories..."
    : query.isFetching
    ? "Loading more categories..."
    : "";
  const pageCount = Math.max(1, Math.ceil(total / pagination.pageSize));

  return (
    <div className="p-4 md:p-6">
      <DataTable
        columns={categoryColumns}
        data={rows ?? []}
        manualPagination
        pageCount={pageCount}
        pagination={pagination}
        onPaginationChange={setPagination}
        initialColumnVisibility={{
          description: true,
          icon_name: true,
          slug: true,
          created_at: false,
        }}
        leftControls={
          <Input
            placeholder="Search categories…"
            className="h-8 w-64"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        }
        rightControls={<AddCategoryDialog />}
        loading={query.isPending || query.isFetching}
        loadingMessage={loadingText}
      />
    </div>
  );
}

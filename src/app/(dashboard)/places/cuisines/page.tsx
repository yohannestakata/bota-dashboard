"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { DataTable } from "@/components/ui/data-table";
import {
  cuisineColumns,
  type CuisineRow,
} from "@/features/cuisines/list/columns";
import { useCuisinesPaged } from "@/features/cuisines/data/hooks";
import { AddCuisineDialog } from "@/features/cuisines/list/add-cuisine-dialog";

export default function CuisinesPage() {
  const [rows, setRows] = React.useState<CuisineRow[] | null>(null);
  const [total, setTotal] = React.useState(0);
  const [search, setSearch] = React.useState("");
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const query = useCuisinesPaged({
    pageIndex: pagination.pageIndex,
    pageSize: pagination.pageSize,
    search,
  });

  React.useEffect(() => {
    if (query.data) {
      setRows(query.data.rows);
      setTotal(query.data.total);
    }
    if (query.isError) {
      setRows([]);
      setTotal(0);
    }
  }, [query.data, query.isError]);

  const loadingText = query.isPending
    ? "Loading cuisines..."
    : query.isFetching
    ? "Loading more cuisines..."
    : "";
  const pageCount = Math.max(1, Math.ceil(total / pagination.pageSize));

  return (
    <div className="p-4 md:p-6">
      <DataTable
        columns={cuisineColumns}
        data={rows ?? []}
        manualPagination
        pageCount={pageCount}
        pagination={pagination}
        onPaginationChange={setPagination}
        initialColumnVisibility={{ description: true, created_at: false }}
        leftControls={
          <Input
            placeholder="Search cuisines…"
            className="h-8 w-64"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        }
        rightControls={<AddCuisineDialog />}
        loading={query.isPending || query.isFetching}
        loadingMessage={loadingText}
      />
    </div>
  );
}

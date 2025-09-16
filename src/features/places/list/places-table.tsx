"use client";

import * as React from "react";
import { IconPlus } from "@tabler/icons-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTable } from "@/components/ui/data-table";
import { placeColumns, type PlaceRow } from "./columns";
import { fetchPlacesPaged } from "@/features/places/data/queries";
import {
  useCategoriesLite,
  usePlacesPaged,
} from "@/features/places/data/hooks";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function toRows(
  api: Awaited<ReturnType<typeof fetchPlacesPaged>>["rows"]
): PlaceRow[] {
  return api.map((p, idx) => ({
    id: idx + 1,
    header: p.name,
    type: "Place",
    status: p.is_active ? "Active" : "Inactive",
    description: p.description,
    slug: p.slug,
    category:
      p.category_name ?? categoriesCache.get(p.category_id ?? -1) ?? "—",
    tags: p.tags ?? undefined,
    owner_id: p.owner_id ?? null,
    owner_name: p.owner_name ?? undefined,
    created_at: p.created_at,
    updated_at: p.updated_at,
    branch_count: p.branch_count ?? 0,
  }));
}

const categoriesCache = new Map<number, string>();

export function PlacesTable() {
  const [rows, setRows] = React.useState<PlaceRow[] | null>(null);
  const [total, setTotal] = React.useState(0);
  const [search, setSearch] = React.useState("");
  const [active, setActive] = React.useState<"all" | "active" | "inactive">(
    "all"
  );
  const [categoryId, setCategoryId] = React.useState<number | null>(null);
  const { data: categories = [] } = useCategoriesLite();
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  });

  React.useEffect(() => {
    categoriesCache.clear();
    for (const c of categories) categoriesCache.set(c.id, c.name);
  }, [categories]);

  const placesQuery = usePlacesPaged({
    pageIndex: pagination.pageIndex,
    pageSize: pagination.pageSize,
    search,
    categoryId,
    active,
  });

  React.useEffect(() => {
    if (placesQuery.data) {
      console.log("[places] received", {
        rows: placesQuery.data.rows.length,
        total: placesQuery.data.total,
        data: placesQuery.data.rows,
      });
      setRows(toRows(placesQuery.data.rows));
      setTotal(placesQuery.data.total);
    }
    if (placesQuery.isError) {
      setRows([]);
      setTotal(0);
    }
  }, [placesQuery.data, placesQuery.isError]);

  const loadingText = placesQuery.isPending
    ? "Loading places..."
    : placesQuery.isFetching
    ? "Loading more places..."
    : "";

  const pageCount = Math.max(1, Math.ceil(total / pagination.pageSize));

  return (
    <DataTable
      columns={placeColumns}
      data={rows ?? []}
      manualPagination
      pageCount={pageCount}
      pagination={pagination}
      onPaginationChange={setPagination}
      initialColumnVisibility={{
        description: true,
        tags: false,
        slug: true,
        category: true,
        created_at: false,
        updated_at: false,
        review_count: false,
        average_rating: false,
      }}
      leftControls={
        <div className="flex w-full items-center gap-2">
          <Input
            placeholder="Search places…"
            className="h-8 w-64"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Select
            value={active}
            onValueChange={(v) => setActive(v as typeof active)}
          >
            <SelectTrigger className="h-8 w-32">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={categoryId?.toString() ?? "all"}
            onValueChange={(v) => setCategoryId(v === "all" ? null : Number(v))}
          >
            <SelectTrigger className="h-8 w-48">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All categories</SelectItem>
              {categories.map((c) => (
                <SelectItem key={c.id} value={c.id.toString()}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      }
      rightControls={
        <div className="">
          <Button size="sm">
            <IconPlus />
            Add Place
          </Button>
        </div>
      }
      loading={placesQuery.isPending || placesQuery.isFetching}
      loadingMessage={loadingText}
    />
  );
}

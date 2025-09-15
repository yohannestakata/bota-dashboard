"use client";

import * as React from "react";
import { z } from "zod";
import { IconPlus } from "@tabler/icons-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { DataTable } from "@/components/data-table";
import {
  fetchCategoriesLite,
  fetchPlacesPaged,
  type CategoryLite,
} from "@/features/places/data/queries";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const placeSchema = z.object({
  id: z.number(),
  header: z.string(),
  type: z.string(),
  status: z.string(),
  target: z.string(),
  limit: z.string(),
  reviewer: z.string(),
});

export type PlaceRow = z.infer<typeof placeSchema>;

function toRows(
  api: Awaited<ReturnType<typeof fetchPlacesPaged>>["rows"]
): PlaceRow[] {
  return api.map((p, idx) => ({
    id: idx + 1,
    header: p.name,
    type: "Place",
    status: p.is_active ? "Done" : "Not Started",
    target: "—",
    limit: "—",
    reviewer: "Assign reviewer",
  }));
}

export function PlacesTable() {
  const [rows, setRows] = React.useState<PlaceRow[] | null>(null);
  const [total, setTotal] = React.useState(0);
  const [search, setSearch] = React.useState("");
  const [active, setActive] = React.useState<"all" | "active" | "inactive">(
    "all"
  );
  const [categoryId, setCategoryId] = React.useState<number | null>(null);
  const [categories, setCategories] = React.useState<CategoryLite[]>([]);
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  });

  React.useEffect(() => {
    fetchCategoriesLite()
      .then(setCategories)
      .catch(() => setCategories([]));
  }, []);

  React.useEffect(() => {
    fetchPlacesPaged({
      pageIndex: pagination.pageIndex,
      pageSize: pagination.pageSize,
      search,
      categoryId,
      active,
    })
      .then((res) => {
        setRows(toRows(res.rows));
        setTotal(res.total);
      })
      .catch(() => {
        setRows([]);
        setTotal(0);
      });
  }, [pagination.pageIndex, pagination.pageSize, search, active, categoryId]);

  const pageCount = Math.max(1, Math.ceil(total / pagination.pageSize));

  return (
    <div className="flex flex-1 flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-2 px-4 lg:px-6">
        <div className="flex items-center gap-2">
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
        <Button size="sm">
          <IconPlus />
          Add Place
        </Button>
      </div>
      <Separator />
      <div className="px-0">
        <DataTable
          data={rows ?? []}
          manualPagination
          pageCount={pageCount}
          pagination={pagination}
          onPaginationChange={setPagination}
        />
      </div>
    </div>
  );
}

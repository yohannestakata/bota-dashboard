"use client";

import * as React from "react";
import { DataTable } from "@/components/ui/data-table";
import { AddBranchDialog } from "@/features/branches/list/add-branch-dialog";
import {
  branchColumns,
  type BranchRow,
} from "@/features/branches/list/columns";
import {
  useBranchesPaged,
  usePlacesLite,
} from "@/features/branches/data/hooks";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function BranchesPage() {
  const [rows, setRows] = React.useState<BranchRow[] | null>(null);
  const [total, setTotal] = React.useState(0);
  const [search] = React.useState("");
  const [placeId, setPlaceId] = React.useState<string | null>(null);
  const [main, setMain] = React.useState<"all" | "main" | "non_main">("all");
  const [active, setActive] = React.useState<"all" | "active" | "inactive">(
    "all"
  );
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const places = usePlacesLite();

  const query = useBranchesPaged({
    pageIndex: pagination.pageIndex,
    pageSize: pagination.pageSize,
    search,
    placeId,
    main,
    active,
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
    ? "Loading branches..."
    : query.isFetching
    ? "Loading more branches..."
    : "";
  const pageCount = Math.max(1, Math.ceil(total / pagination.pageSize));

  return (
    <div className="p-4 md:p-6">
      <DataTable
        columns={branchColumns}
        data={rows ?? []}
        manualPagination
        pageCount={pageCount}
        pagination={pagination}
        onPaginationChange={setPagination}
        initialColumnVisibility={{
          // Important visible by default
          name: true,
          description: true,
          place_name: true,
          address_line1: true,
          city: true,
          country: true,
          is_active: true,
          // Less important hidden by default
          slug: false,
          phone: false,
          website_url: false,
          address_line2: false,
          state: false,
          postal_code: false,
          price_range: false,
          created_at: false,
        }}
        leftControls={
          <div className="flex w-full items-center gap-2">
            <Select
              value={placeId ?? "all"}
              onValueChange={(v) => setPlaceId(v === "all" ? null : v)}
            >
              <SelectTrigger className="h-8 w-56">
                <SelectValue placeholder="Place" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All places</SelectItem>
                {(places.data ?? []).map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={main}
              onValueChange={(v) => setMain(v as typeof main)}
            >
              <SelectTrigger className="h-8 w-40">
                <SelectValue placeholder="Main" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="main">Main</SelectItem>
                <SelectItem value="non_main">Non-main</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={active}
              onValueChange={(v) => setActive(v as typeof active)}
            >
              <SelectTrigger className="h-8 w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        }
        rightControls={<AddBranchDialog />}
        loading={query.isPending || query.isFetching}
        loadingMessage={loadingText}
      />
    </div>
  );
}

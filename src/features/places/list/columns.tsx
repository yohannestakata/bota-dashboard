"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { IconDotsVertical } from "@tabler/icons-react";
import { SortableColumnHeader } from "./column-header";

export type PlaceRow = {
  id: number;
  header: string; // Name
  type: string;
  status: string;
  slug?: string;
  category?: string;
  tags?: string[];
  owner_id?: string | null;
  owner_name?: string | null;
  description?: string | null;
  created_at?: string;
  updated_at?: string;
  review_count?: number;
  average_rating?: number;
  branch_count?: number;
};

export const placeColumns: ColumnDef<PlaceRow>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "header",
    header: ({ column }) => (
      <SortableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => (
      <span className="font-medium">{row.original.header ?? "—"}</span>
    ),
  },
  {
    accessorKey: "slug",
    header: ({ column }) => (
      <SortableColumnHeader column={column} title="Slug" />
    ),
    cell: ({ row }) => (
      <span className="text-muted-foreground">{row.original.slug ?? "—"}</span>
    ),
  },
  {
    accessorKey: "category",
    header: ({ column }) => (
      <SortableColumnHeader column={column} title="Category" />
    ),
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => (
      <div className="max-w-60">
        <p className="text-muted-foreground line-clamp-1 w-full">
          {row.original.description ?? "—"}
        </p>
      </div>
    ),
  },
  {
    accessorKey: "branch_count",
    header: "Branches",
    cell: ({ row }) => <span>{row.original.branch_count ?? 0}</span>,
  },
  {
    accessorKey: "tags",
    header: "Tags",
    cell: ({ row }) => (
      <div className="flex max-w-[240px] flex-wrap gap-1">
        {(row.original.tags ?? []).length > 0 ? (
          (row.original.tags ?? []).map((t) => (
            <Badge key={t} variant="outline" className="px-1.5">
              {t}
            </Badge>
          ))
        ) : (
          <span className="text-muted-foreground">—</span>
        )}
      </div>
    ),
  },
  {
    accessorKey: "owner_name",
    header: "Owner",
    cell: ({ row }) => (
      <span className="text-muted-foreground">
        {row.original.owner_name ?? "—"}
      </span>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <Badge variant="outline" className="px-1.5">
        {row.original.status}
      </Badge>
    ),
  },
  {
    accessorKey: "created_at",
    header: "Created",
    enableHiding: false,
    cell: ({ row }) => (
      <span className="text-muted-foreground">
        {row.original.created_at
          ? new Date(row.original.created_at).toLocaleDateString()
          : "—"}
      </span>
    ),
  },
  {
    id: "actions",
    header: "Actions",
    enableHiding: false,
    cell: () => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <IconDotsVertical />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem>View</DropdownMenuItem>
          <DropdownMenuItem>Edit</DropdownMenuItem>
          <DropdownMenuItem>View Branches</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Deactivate</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
  {
    accessorKey: "updated_at",
    header: "Updated",
    enableHiding: false,
    cell: ({ row }) => (
      <span className="text-muted-foreground">
        {row.original.updated_at
          ? new Date(row.original.updated_at).toLocaleDateString()
          : "—"}
      </span>
    ),
  },
  {
    accessorKey: "review_count",
    header: "Reviews",
    enableHiding: false,
  },
  {
    accessorKey: "average_rating",
    header: "Avg Rating",
    enableHiding: false,
    cell: ({ row }) => (
      <span>
        {typeof row.original.average_rating === "number"
          ? row.original.average_rating.toFixed(1)
          : "—"}
      </span>
    ),
  },
];

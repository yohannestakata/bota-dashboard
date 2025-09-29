"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import type { CuisineItem } from "@/features/cuisines/types";
import { SortableColumnHeader } from "@/features/places/list/column-header";
import { CuisineActionsMenu } from "@/features/cuisines/list/cuisine-actions-menu";

export type CuisineRow = Pick<
  CuisineItem,
  "id" | "name" | "description" | "created_at"
>;

export const cuisineColumns: ColumnDef<CuisineRow>[] = [
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
    accessorKey: "name",
    header: ({ column }) => (
      <SortableColumnHeader column={column} title="Name" />
    ),
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => (
      <div className="max-w-96">
        <p className="text-muted-foreground line-clamp-1">
          {row.original.description ?? "—"}
        </p>
      </div>
    ),
  },
  {
    accessorKey: "created_at",
    header: ({ column }) => (
      <SortableColumnHeader column={column} title="Created" />
    ),
    cell: ({ row }) => (
      <span className="text-muted-foreground">
        {new Date(row.original.created_at).toLocaleDateString()}
      </span>
    ),
  },
  {
    id: "actions",
    header: "Actions",
    enableHiding: false,
    cell: ({ row }) => (
      <CuisineActionsMenu
        id={row.original.id}
        name={row.original.name}
        description={row.original.description}
      />
    ),
  },
];

"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import type { CategoryItem } from "@/features/categories/types";
import { CategoryActionsMenu } from "@/features/categories/list/category-actions-menu";
import { SortableColumnHeader } from "@/features/places/list/column-header";
import * as Lucide from "lucide-react";
import type { LucideIcon } from "lucide-react";
import * as React from "react";

export type CategoryRow = Pick<
  CategoryItem,
  "id" | "name" | "slug" | "description" | "icon_name" | "created_at"
>;

export const categoryColumns: ColumnDef<CategoryRow>[] = [
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
    cell: ({ row }) => <span className="font-medium">{row.original.name}</span>,
  },
  {
    accessorKey: "slug",
    header: ({ column }) => (
      <SortableColumnHeader column={column} title="Slug" />
    ),
    cell: ({ row }) => (
      <span className="text-muted-foreground">{row.original.slug}</span>
    ),
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => (
      <div className="max-w-80">
        <p className="text-muted-foreground line-clamp-1">
          {row.original.description ?? "—"}
        </p>
      </div>
    ),
  },
  {
    accessorKey: "icon_name",
    header: "Icon",
    cell: ({ row }) => {
      const name = row.original.icon_name;
      if (!name) return <span className="text-muted-foreground">—</span>;
      const Icons = Lucide as unknown as Record<string, LucideIcon>;
      const iconKey = toIconComponentKey(name);
      const IconComp = iconKey === "Icon" ? undefined : Icons[iconKey];
      return (
        <Badge
          variant="outline"
          className="px-1.5 inline-flex items-center gap-1.5"
        >
          {IconComp ? <IconComp className="size-3.5" /> : null}
          <span>{iconKey}</span>
        </Badge>
      );
    },
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
    id: "spacer",
    header: "",
    cell: () => null,
    enableHiding: true,
  },
  {
    id: "actions",
    header: "Actions",
    enableHiding: false,
    cell: ({ row }) => (
      <CategoryActionsMenu
        id={row.original.id}
        name={row.original.name}
        description={row.original.description ?? null}
        icon_name={row.original.icon_name ?? null}
      />
    ),
  },
];

function toIconComponentKey(input: string): string {
  // Convert kebab_case or snake_case or lowercase to PascalCase matching lucide export keys
  // e.g. "utensils-crossed" => "UtensilsCrossed"
  // e.g. "utensils" => "Utensils"
  // If already PascalCase, return as-is
  if (/^[A-Z][A-Za-z0-9]*$/.test(input)) return input;
  return input
    .split(/[^a-zA-Z0-9]+/)
    .filter(Boolean)
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join("");
}

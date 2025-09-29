"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import type { BranchItem } from "@/features/branches/types";
import { SortableColumnHeader } from "@/features/places/list/column-header";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { IconDotsVertical } from "@tabler/icons-react";
import { MapPicker } from "@/components/ui/map-picker";
import { EditBranchDialog } from "@/features/branches/list/edit-branch-dialog";

const rowNameCache = new Map<string, string>();
const rowDescCache = new Map<string, string | null>();
const rowPhoneCache = new Map<string, string | null>();
const rowWebCache = new Map<string, string | null>();
const rowA1Cache = new Map<string, string | null>();
const rowA2Cache = new Map<string, string | null>();
const rowCityCache = new Map<string, string | null>();
const rowStateCache = new Map<string, string | null>();
const rowPostalCache = new Map<string, string | null>();
const rowCountryCache = new Map<string, string | null>();
const rowPriceCache = new Map<string, number | null>();
import { Button } from "@/components/ui/button";
import {
  useToggleBranchActive,
  useDeleteBranch,
} from "@/features/branches/data/hooks";
import { WarningDialog } from "@/components/warning-dialog";
import {
  Loader2Icon,
  BanIcon,
  CheckIcon,
  TrashIcon,
  MapPinIcon,
  PencilIcon,
} from "lucide-react";
import * as React from "react";

export type BranchRow = BranchItem & {};

export const branchColumns: ColumnDef<BranchRow>[] = [
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
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <span className="font-medium">{row.original.name}</span>
        {row.original.is_main_branch && (
          <Badge variant="secondary" className="px-1.5">
            Main
          </Badge>
        )}
      </div>
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
    accessorKey: "place_name",
    header: ({ column }) => (
      <SortableColumnHeader column={column} title="Place" />
    ),
    cell: ({ row }) => (
      <span className="text-muted-foreground">
        {row.original.place_name ?? "—"}
      </span>
    ),
  },
  {
    accessorKey: "slug",
    header: ({ column }) => (
      <SortableColumnHeader column={column} title="Slug" />
    ),
  },
  {
    accessorKey: "phone",
    header: ({ column }) => (
      <SortableColumnHeader column={column} title="Phone" />
    ),
    cell: ({ row }) => (
      <span className="text-muted-foreground">{row.original.phone ?? "—"}</span>
    ),
  },
  {
    accessorKey: "website_url",
    header: ({ column }) => (
      <SortableColumnHeader column={column} title="Website" />
    ),
    cell: ({ row }) => (
      <a
        className="text-blue-600 hover:underline"
        href={row.original.website_url ?? undefined}
        target="_blank"
        rel="noopener noreferrer"
      >
        {row.original.website_url ?? "—"}
      </a>
    ),
  },
  {
    accessorKey: "city",
    header: ({ column }) => (
      <SortableColumnHeader column={column} title="City" />
    ),
    cell: ({ row }) => (
      <span className="text-muted-foreground">{row.original.city ?? "—"}</span>
    ),
  },
  {
    accessorKey: "state",
    header: ({ column }) => (
      <SortableColumnHeader column={column} title="State" />
    ),
    cell: ({ row }) => (
      <span className="text-muted-foreground">{row.original.state ?? "—"}</span>
    ),
  },
  {
    accessorKey: "postal_code",
    header: ({ column }) => (
      <SortableColumnHeader column={column} title="Postal" />
    ),
    cell: ({ row }) => (
      <span className="text-muted-foreground">
        {row.original.postal_code ?? "—"}
      </span>
    ),
  },
  {
    accessorKey: "country",
    header: ({ column }) => (
      <SortableColumnHeader column={column} title="Country" />
    ),
    cell: ({ row }) => (
      <span className="text-muted-foreground">
        {row.original.country ?? "—"}
      </span>
    ),
  },
  {
    accessorKey: "address_line1",
    header: ({ column }) => (
      <SortableColumnHeader column={column} title="Address 1" />
    ),
    cell: ({ row }) => (
      <span className="text-muted-foreground">
        {row.original.address_line1 ?? "—"}
      </span>
    ),
  },
  {
    accessorKey: "address_line2",
    header: ({ column }) => (
      <SortableColumnHeader column={column} title="Address 2" />
    ),
    cell: ({ row }) => (
      <span className="text-muted-foreground">
        {row.original.address_line2 ?? "—"}
      </span>
    ),
  },
  {
    accessorKey: "price_range",
    header: ({ column }) => (
      <SortableColumnHeader column={column} title="Price" />
    ),
    cell: ({ row }) => (
      <span className="text-muted-foreground">
        {row.original.price_range ?? "—"}
      </span>
    ),
  },
  {
    accessorKey: "is_active",
    header: "Status",
    cell: ({ row }) => (
      <Badge variant="outline" className="px-1.5">
        {row.original.is_active ? (
          <CheckIcon className="text-green-600" />
        ) : (
          <BanIcon className="text-red-600" />
        )}{" "}
        {row.original.is_active ? "Active" : "Inactive"}
      </Badge>
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
    cell: ({ row }) => {
      const b = row.original;
      rowNameCache.set(b.id, b.name);
      rowDescCache.set(b.id, b.description ?? null);
      rowPhoneCache.set(b.id, b.phone ?? null);
      rowWebCache.set(b.id, b.website_url ?? null);
      rowA1Cache.set(b.id, b.address_line1 ?? null);
      rowA2Cache.set(b.id, b.address_line2 ?? null);
      rowCityCache.set(b.id, b.city ?? null);
      rowStateCache.set(b.id, b.state ?? null);
      rowPostalCache.set(b.id, b.postal_code ?? null);
      rowCountryCache.set(b.id, b.country ?? null);
      rowPriceCache.set(b.id, b.price_range ?? null);
      return (
        <BranchActions
          id={b.id}
          isActive={b.is_active}
          latitude={b.latitude}
          longitude={b.longitude}
        />
      );
    },
  },
];

function BranchActions({
  id,
  isActive,
  latitude,
  longitude,
}: {
  id: string;
  isActive: boolean;
  latitude: number | null;
  longitude: number | null;
}) {
  const toggle = useToggleBranchActive();
  const del = useDeleteBranch();
  const toggling = toggle.isPending;
  const [mapOpen, setMapOpen] = React.useState(false);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <IconDotsVertical />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onSelect={(e) => {
            e.preventDefault();
            setMapOpen(true);
          }}
        >
          <MapPinIcon /> See in Map
        </DropdownMenuItem>
        <DropdownMenuItem
          onSelect={(e) => {
            e.preventDefault();
            // open edit dialog through hidden trigger below
            const btn = document.getElementById(
              `edit-branch-${id}`
            ) as HTMLButtonElement | null;
            btn?.click();
          }}
        >
          <PencilIcon /> Edit
        </DropdownMenuItem>
        <EditBranchDialog
          id={id}
          name={rowNameCache.get(id) || ""}
          description={rowDescCache.get(id) || null}
          phone={rowPhoneCache.get(id) || null}
          website_url={rowWebCache.get(id) || null}
          address_line1={rowA1Cache.get(id) || null}
          address_line2={rowA2Cache.get(id) || null}
          city={rowCityCache.get(id) || null}
          state={rowStateCache.get(id) || null}
          postal_code={rowPostalCache.get(id) || null}
          country={rowCountryCache.get(id) || null}
          latitude={latitude}
          longitude={longitude}
          price_range={rowPriceCache.get(id) ?? null}
          is_main_branch={isActive /* placeholder, not used here */}
          is_active={isActive}
          hideTrigger
        />
        <WarningDialog
          title={`${isActive ? "Deactivate" : "Activate"} branch?`}
          description={
            isActive
              ? "This will hide the branch from public view."
              : "This will make the branch visible to the public."
          }
          confirmText={isActive ? "Deactivate" : "Activate"}
          loading={toggling}
          onConfirm={async () => {
            await toggle.mutateAsync({ id, is_active: !isActive });
          }}
        >
          <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
            {toggling ? (
              <Loader2Icon className="animate-spin" />
            ) : isActive ? (
              <BanIcon />
            ) : (
              <CheckIcon />
            )}
            {toggling
              ? isActive
                ? "Deactivating..."
                : "Activating..."
              : isActive
              ? "Deactivate"
              : "Activate"}
          </DropdownMenuItem>
        </WarningDialog>
        <WarningDialog
          title="Delete branch?"
          description="This action cannot be undone."
          confirmText="Delete"
          loading={del.isPending}
          onConfirm={async () => {
            await del.mutateAsync(id);
          }}
        >
          <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
            {del.isPending ? (
              <Loader2Icon className="animate-spin" />
            ) : (
              <TrashIcon />
            )}
            {del.isPending ? "Deleting..." : "Delete"}
          </DropdownMenuItem>
        </WarningDialog>
      </DropdownMenuContent>
      {mapOpen && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/40">
          <div className="bg-background w-full max-w-2xl rounded-md border p-4 shadow-lg">
            <div className="mb-3">
              <div className="text-lg font-semibold">Branch location</div>
              <div className="text-muted-foreground text-sm">
                Click on the map to change the pin.
              </div>
            </div>
            <MapPicker
              latitude={latitude}
              longitude={longitude}
              onChange={() => {}}
            />
            <div className="mt-4 flex justify-end">
              <Button variant="outline" onClick={() => setMapOpen(false)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </DropdownMenu>
  );
}

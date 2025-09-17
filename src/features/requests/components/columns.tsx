"use client";

import * as React from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { LeafletMap } from "@/features/requests/components/leaflet-map";
import { timeAgo } from "@/lib/utils";

export type RequestRow = {
  id: string;
  created_at: string;
  status: string;
  proposed_place?: { name?: string; category_id?: number | null } | null;
  proposed_branch?: {
    name?: string | null;
    phone?: string | null;
    address_line1?: string | null;
    address_line2?: string | null;
    city?: string | null;
    country?: string | null;
    latitude?: number | null;
    longitude?: number | null;
    is_main_branch?: boolean | null;
  } | null;
  profiles?: { full_name?: string | null; username?: string | null } | null;
};

export function buildRequestColumns(
  kind: "place" | "branch",
  onApprove: (id: string) => void,
  onReject: (id: string) => void
): ColumnDef<RequestRow, unknown>[] {
  const detailsCell = ({ row }: { row: { original: RequestRow } }) => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          View
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>
            {kind === "place" ? "Place Add Request" : "Branch Add Request"}
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-6">
          {kind === "place" ? (
            <div className="grid gap-4">
              <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                <div>
                  <div className="text-xs uppercase text-muted-foreground">
                    Place Name
                  </div>
                  <div className="font-medium">
                    {row.original.proposed_place?.name || "—"}
                  </div>
                </div>
                <div>
                  <div className="text-xs uppercase text-muted-foreground">
                    Category ID
                  </div>
                  <div className="font-medium">
                    {row.original.proposed_place?.category_id ?? "—"}
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                <div>
                  <div className="text-xs uppercase text-muted-foreground">
                    Branch Name
                  </div>
                  <div className="font-medium">
                    {row.original.proposed_branch?.name ||
                      row.original.proposed_place?.name ||
                      "—"}
                  </div>
                </div>
                <div>
                  <div className="text-xs uppercase text-muted-foreground">
                    Phone
                  </div>
                  <div className="font-medium">
                    {row.original.proposed_branch?.phone || "—"}
                  </div>
                </div>
                <div>
                  <div className="text-xs uppercase text-muted-foreground">
                    City
                  </div>
                  <div className="font-medium">
                    {row.original.proposed_branch?.city || "—"}
                  </div>
                </div>
                <div>
                  <div className="text-xs uppercase text-muted-foreground">
                    Address
                  </div>
                  <div className="font-medium">
                    {row.original.proposed_branch?.address_line1 || "—"}
                  </div>
                  <div className="text-muted-foreground">
                    {row.original.proposed_branch?.address_line2 || ""}
                  </div>
                </div>
                <div>
                  <div className="text-xs uppercase text-muted-foreground">
                    Main Branch
                  </div>
                  <div className="font-medium">
                    {row.original.proposed_branch?.is_main_branch
                      ? "Yes"
                      : "No"}
                  </div>
                </div>
              </div>
              <LeafletMap
                latitude={row.original.proposed_branch?.latitude ?? null}
                longitude={row.original.proposed_branch?.longitude ?? null}
                height={256}
              />
            </div>
          ) : (
            <div className="grid gap-4">
              <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                <div>
                  <div className="text-xs uppercase text-muted-foreground">
                    Branch Name
                  </div>
                  <div className="font-medium">
                    {row.original.proposed_branch?.name || "—"}
                  </div>
                </div>
                <div>
                  <div className="text-xs uppercase text-muted-foreground">
                    Phone
                  </div>
                  <div className="font-medium">
                    {row.original.proposed_branch?.phone || "—"}
                  </div>
                </div>
                <div>
                  <div className="text-xs uppercase text-muted-foreground">
                    City
                  </div>
                  <div className="font-medium">
                    {row.original.proposed_branch?.city || "—"}
                  </div>
                </div>
                <div>
                  <div className="text-xs uppercase text-muted-foreground">
                    Address
                  </div>
                  <div className="font-medium">
                    {row.original.proposed_branch?.address_line1 || "—"}
                  </div>
                  <div className="text-muted-foreground">
                    {row.original.proposed_branch?.address_line2 || ""}
                  </div>
                </div>
                <div>
                  <div className="text-xs uppercase text-muted-foreground">
                    Main Branch
                  </div>
                  <div className="font-medium">
                    {row.original.proposed_branch?.is_main_branch
                      ? "Yes"
                      : "No"}
                  </div>
                </div>
              </div>
              <LeafletMap
                latitude={row.original.proposed_branch?.latitude ?? null}
                longitude={row.original.proposed_branch?.longitude ?? null}
                height={256}
              />
            </div>
          )}
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onReject(row.original.id)}>
            Reject
          </Button>
          <Button onClick={() => onApprove(row.original.id)}>Approve</Button>
        </div>
      </DialogContent>
    </Dialog>
  );

  const nameCol: ColumnDef<RequestRow> =
    kind === "place"
      ? {
          header: "Place Name",
          cell: ({ row }) => (
            <span className="font-medium">
              {row.original.proposed_place?.name || "—"}
            </span>
          ),
          enableHiding: false,
        }
      : {
          header: "Branch Name",
          cell: ({ row }) => (
            <span className="font-medium">
              {row.original.proposed_branch?.name || "—"}
            </span>
          ),
          enableHiding: false,
        };

  const base: ColumnDef<RequestRow, unknown>[] = [
    nameCol,
    {
      header: "Created",
      cell: ({ row }) => (
        <span className="text-muted-foreground">
          {timeAgo(row.original.created_at)}
        </span>
      ),
      enableHiding: false,
    },
    {
      header: "Status",
      cell: ({ row }) => row.original.status,
      enableHiding: false,
    },
  ];

  const extended: ColumnDef<RequestRow, unknown>[] = [
    ...(kind === "place"
      ? [
          {
            header: "Category",
            cell: ({ row }) => (
              <span className="text-muted-foreground">
                {row.original.proposed_place?.category_id ?? "—"}
              </span>
            ),
            enableHiding: true,
          },
        ]
      : []),
    {
      header: "City",
      cell: ({ row }) => (
        <span className="text-muted-foreground">
          {row.original.proposed_branch?.city || "—"}
        </span>
      ),
      enableHiding: true,
    },
    {
      header: "Phone",
      cell: ({ row }) => (
        <span className="text-muted-foreground">
          {row.original.proposed_branch?.phone || "—"}
        </span>
      ),
      enableHiding: true,
    },
    {
      header: "Address 1",
      cell: ({ row }) => (
        <span className="text-muted-foreground">
          {row.original.proposed_branch?.address_line1 || "—"}
        </span>
      ),
      enableHiding: true,
    },
    {
      header: "Address 2",
      cell: ({ row }) => (
        <span className="text-muted-foreground">
          {row.original.proposed_branch?.address_line2 || "—"}
        </span>
      ),
      enableHiding: true,
    },
    {
      header: "Main Branch",
      cell: ({ row }) => (
        <span className="text-muted-foreground">
          {row.original.proposed_branch?.is_main_branch ? "Yes" : "No"}
        </span>
      ),
      enableHiding: true,
    },
    {
      header: "Submitted By",
      cell: ({ row }) => (
        <span className="text-muted-foreground">
          {row.original.profiles?.full_name ||
            row.original.profiles?.username ||
            "—"}
        </span>
      ),
      enableHiding: true,
    },
    {
      header: "Actions",
      cell: ({ row }) => detailsCell({ row }),
      enableHiding: false,
    },
  ];

  return [...base, ...extended];
}

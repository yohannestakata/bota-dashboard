"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { RequestActionsMenu } from "@/features/requests/components/request-actions-menu";
import { timeAgo } from "@/lib/utils";
import type { RequestRow, ProposedPlace, ProposedBranch } from "./types";
import { CheckIcon, XIcon, LoaderIcon } from "lucide-react";

export type AddRequestRow = RequestRow;

export function buildAddRequestColumns(
  kind: "place" | "branch",
  {
    onApprove,
    onReject,
    onViewDetails,
  }: {
    onApprove: (id: string) => void;
    onReject: (id: string) => void;
    onViewDetails: (id: string) => void;
  }
): ColumnDef<AddRequestRow, unknown>[] {
  return [
    kind === "place"
      ? {
          id: "place_name",
          accessorKey: "proposed_place.name",
          header: "Place Name",
          cell: ({ row }: { row: { original: AddRequestRow } }) => (
            <span className="font-medium">
              {(row.original.proposed_place as ProposedPlace)?.name || "—"}
            </span>
          ),
        }
      : {
          id: "branch_name",
          accessorKey: "proposed_branch.name",
          header: "Branch Name",
          cell: ({ row }) => (
            <span className="font-medium">
              {(row.original.proposed_branch as ProposedBranch)?.name || "—"}
            </span>
          ),
        },
    {
      id: "created",
      accessorKey: "created_at",
      header: "Created",
      cell: ({ row }: { row: { original: AddRequestRow } }) =>
        timeAgo(row.original.created_at),
    },
    {
      id: "status",
      accessorKey: "status",
      header: "Status",
      cell: ({ row }: { row: { original: AddRequestRow } }) => (
        <Badge variant="outline">
          {row.original.status === "approved" ? (
            <CheckIcon className="text-green-500" />
          ) : row.original.status === "rejected" ? (
            <XIcon className="text-destructive" />
          ) : (
            <LoaderIcon className="text-muted-foreground" />
          )}{" "}
          {row.original.status}
        </Badge>
      ),
    },
    ...(kind === "place"
      ? [
          {
            id: "category",
            accessorKey: "proposed_place.category_id",
            header: "Category",
            cell: ({ row }: { row: { original: AddRequestRow } }) => (
              <span className="text-muted-foreground">
                {(row.original.proposed_place as ProposedPlace)?.category_id ??
                  "—"}
              </span>
            ),
          },
        ]
      : []),
    {
      id: "city",
      accessorKey: "proposed_branch.city",
      header: "City",
      cell: ({ row }: { row: { original: AddRequestRow } }) => (
        <span className="text-muted-foreground">
          {(row.original.proposed_branch as ProposedBranch)?.city || "—"}
        </span>
      ),
    },
    {
      id: "phone",
      accessorKey: "proposed_branch.phone",
      header: "Phone",
      cell: ({ row }: { row: { original: AddRequestRow } }) => (
        <span className="text-muted-foreground">
          {(row.original.proposed_branch as ProposedBranch)?.phone || "—"}
        </span>
      ),
    },
    {
      id: "address1",
      accessorKey: "proposed_branch.address_line1",
      header: "Address 1",
      cell: ({ row }: { row: { original: AddRequestRow } }) => (
        <span className="text-muted-foreground">
          {(row.original.proposed_branch as ProposedBranch)?.address_line1 ||
            "—"}
        </span>
      ),
    },
    {
      id: "address2",
      accessorKey: "proposed_branch.address_line2",
      header: "Address 2",
      cell: ({ row }) => (
        <span className="text-muted-foreground">
          {(row.original.proposed_branch as ProposedBranch)?.address_line2 ||
            "—"}
        </span>
      ),
    },
    {
      id: "main_branch",
      accessorKey: "proposed_branch.is_main_branch",
      header: "Main Branch",
      cell: ({ row }: { row: { original: AddRequestRow } }) => {
        const isMain = (row.original.proposed_branch as ProposedBranch)
          ?.is_main_branch;
        return <Badge variant="outline">{isMain ? "Main" : "Secondary"}</Badge>;
      },
    },
    {
      id: "submitted_by",
      accessorKey: "profiles.full_name",
      header: "Submitted By",
      cell: ({ row }: { row: { original: AddRequestRow } }) => (
        <span className="text-muted-foreground">
          {row.original.profiles?.full_name ||
            row.original.profiles?.username ||
            "—"}
        </span>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      enableHiding: false,
      cell: ({ row }: { row: { original: AddRequestRow } }) => (
        <RequestActionsMenu
          id={row.original.id}
          status={row.original.status}
          onApprove={onApprove}
          onReject={onReject}
          onViewDetails={onViewDetails}
        />
      ),
    },
  ];
}

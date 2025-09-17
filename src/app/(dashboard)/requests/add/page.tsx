"use client";

import * as React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import {
  useBranchAddRequests,
  usePlaceAddRequests,
  useReviewBranchAddRequest,
  useReviewPlaceAddRequest,
} from "@/features/requests/data/hooks";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  RequestsFilters,
  RequestsRightControls,
} from "@/features/requests/components/controls";
import type { ColumnDef } from "@tanstack/react-table";
import { LeafletMap } from "@/features/requests/components/leaflet-map";
import { RequestActionsMenu } from "@/features/requests/components/request-actions-menu";
import { timeAgo } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { CheckIcon, XIcon, LoaderIcon } from "lucide-react";

function MapView({
  latitude,
  longitude,
}: {
  latitude?: number | null;
  longitude?: number | null;
}) {
  return (
    <LeafletMap
      latitude={latitude ?? null}
      longitude={longitude ?? null}
      height={256}
    />
  );
}

type ProposedPlace = {
  name?: string | null;
  description?: string | null;
  category_id?: number | null;
};
type ProposedBranch = {
  name?: string | null;
  phone?: string | null;
  address_line1?: string | null;
  address_line2?: string | null;
  city?: string | null;
  country?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  is_main_branch?: boolean | null;
};

function DetailsView({
  kind,
  row,
}: {
  kind: "place" | "branch";
  row: RequestRow;
}) {
  const place = (row.proposed_place as ProposedPlace) || {};
  const branch = (row.proposed_branch as ProposedBranch) || {};
  return (
    <div className="grid gap-6">
      {kind === "place" ? (
        <div className="grid gap-4">
          <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
            <div>
              <div className="text-xs uppercase text-muted-foreground">
                Place Name
              </div>
              <div className="font-medium">{place.name || "—"}</div>
            </div>
            <div>
              <div className="text-xs uppercase text-muted-foreground">
                Category ID
              </div>
              <div className="font-medium">{place.category_id ?? "—"}</div>
            </div>
          </div>
          <div>
            <div className="text-xs uppercase text-muted-foreground">
              Description
            </div>
            <div className="text-sm">{place.description || "—"}</div>
          </div>
          <div className="grid gap-2">
            <div className="text-xs uppercase text-muted-foreground">
              Proposed Branch
            </div>
            <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
              <div>
                <div className="text-xs uppercase text-muted-foreground">
                  Name
                </div>
                <div className="font-medium">
                  {branch.name || place.name || "—"}
                </div>
              </div>
              <div>
                <div className="text-xs uppercase text-muted-foreground">
                  Phone
                </div>
                <div className="font-medium">{branch.phone || "—"}</div>
              </div>
              <div>
                <div className="text-xs uppercase text-muted-foreground">
                  City
                </div>
                <div className="font-medium">{branch.city || "—"}</div>
              </div>
              <div>
                <div className="text-xs uppercase text-muted-foreground">
                  Address
                </div>
                <div className="font-medium">{branch.address_line1 || "—"}</div>
                <div className="text-muted-foreground">
                  {branch.address_line2 || ""}
                </div>
              </div>
              <div>
                <div className="text-xs uppercase text-muted-foreground">
                  Main Branch
                </div>
                <div className="font-medium">
                  {branch.is_main_branch ? "Yes" : "No"}
                </div>
              </div>
            </div>
            <MapView
              latitude={branch.latitude ?? null}
              longitude={branch.longitude ?? null}
            />
          </div>
        </div>
      ) : (
        <div className="grid gap-4">
          <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
            <div>
              <div className="text-xs uppercase text-muted-foreground">
                Branch Name
              </div>
              <div className="font-medium">{branch.name || "—"}</div>
            </div>
            <div>
              <div className="text-xs uppercase text-muted-foreground">
                Phone
              </div>
              <div className="font-medium">{branch.phone || "—"}</div>
            </div>
            <div>
              <div className="text-xs uppercase text-muted-foreground">
                City
              </div>
              <div className="font-medium">{branch.city || "—"}</div>
            </div>
            <div>
              <div className="text-xs uppercase text-muted-foreground">
                Address
              </div>
              <div className="font-medium">{branch.address_line1 || "—"}</div>
              <div className="text-muted-foreground">
                {branch.address_line2 || ""}
              </div>
            </div>
            <div>
              <div className="text-xs uppercase text-muted-foreground">
                Main Branch
              </div>
              <div className="font-medium">
                {branch.is_main_branch ? "Yes" : "No"}
              </div>
            </div>
          </div>
          <MapView
            latitude={branch.latitude ?? null}
            longitude={branch.longitude ?? null}
          />
        </div>
      )}
    </div>
  );
}

export default function RequestsAddPage() {
  const [tab, setTab] = React.useState("place");
  const [status, setStatus] = React.useState<
    "pending" | "approved" | "rejected" | "all"
  >("pending");
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [search, setSearch] = React.useState("");
  const [selectedRequest, setSelectedRequest] =
    React.useState<RequestRow | null>(null);
  const [detailsOpen, setDetailsOpen] = React.useState(false);

  const placeReqs = usePlaceAddRequests(
    pagination.pageIndex,
    pagination.pageSize,
    status
  );
  const branchReqs = useBranchAddRequests(
    pagination.pageIndex,
    pagination.pageSize,
    status
  );
  const reviewPlace = useReviewPlaceAddRequest();
  const reviewBranch = useReviewBranchAddRequest();

  const handleViewDetails = (id: string) => {
    const request = [
      ...(placeReqs.data?.rows ?? []),
      ...(branchReqs.data?.rows ?? []),
    ].find((r) => r.id === id);
    if (request) {
      setSelectedRequest(request);
      setDetailsOpen(true);
    }
  };

  return (
    <div className="p-4 md:p-6">
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="place">Place</TabsTrigger>
          <TabsTrigger value="branch">Branch</TabsTrigger>
        </TabsList>
        <TabsContent value="place" className="mt-4">
          <RequestsTable
            kind="place"
            rows={placeReqs.data?.rows ?? []}
            total={placeReqs.data?.total ?? 0}
            loading={placeReqs.isPending || placeReqs.isFetching}
            pagination={pagination}
            onPaginationChange={setPagination}
            onApprove={(id) => reviewPlace.mutate({ id, action: "approve" })}
            onReject={(id) => reviewPlace.mutate({ id, action: "reject" })}
            onViewDetails={handleViewDetails}
            leftControls={
              <RequestsFilters
                status={status}
                onStatusChange={setStatus}
                search={search}
                onSearchChange={setSearch}
              />
            }
            rightControls={<RequestsRightControls />}
          />
        </TabsContent>
        <TabsContent value="branch" className="mt-4">
          <RequestsTable
            kind="branch"
            rows={branchReqs.data?.rows ?? []}
            total={branchReqs.data?.total ?? 0}
            loading={branchReqs.isPending || branchReqs.isFetching}
            pagination={pagination}
            onPaginationChange={setPagination}
            onApprove={(id) => reviewBranch.mutate({ id, action: "approve" })}
            onReject={(id) => reviewBranch.mutate({ id, action: "reject" })}
            onViewDetails={handleViewDetails}
            leftControls={
              <RequestsFilters
                status={status}
                onStatusChange={setStatus}
                search={search}
                onSearchChange={setSearch}
              />
            }
            rightControls={<RequestsRightControls />}
          />
        </TabsContent>
      </Tabs>

      {/* Details Dialog */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>
              {selectedRequest && (
                <>
                  {tab === "place" ? "Place Add Request" : "Branch Add Request"}
                </>
              )}
            </DialogTitle>
          </DialogHeader>
          {selectedRequest && (
            <>
              <DetailsView
                kind={tab as "place" | "branch"}
                row={selectedRequest}
              />
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    if (tab === "place") {
                      reviewPlace.mutate({
                        id: selectedRequest.id,
                        action: "reject",
                      });
                    } else {
                      reviewBranch.mutate({
                        id: selectedRequest.id,
                        action: "reject",
                      });
                    }
                    setDetailsOpen(false);
                  }}
                >
                  Reject
                </Button>
                <Button
                  onClick={() => {
                    if (tab === "place") {
                      reviewPlace.mutate({
                        id: selectedRequest.id,
                        action: "approve",
                      });
                    } else {
                      reviewBranch.mutate({
                        id: selectedRequest.id,
                        action: "approve",
                      });
                    }
                    setDetailsOpen(false);
                  }}
                >
                  Approve
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

type RequestRow = {
  id: string;
  created_at: string;
  status: string;
  proposed_place?: unknown;
  proposed_branch?: unknown;
  profiles?: { full_name?: string | null; username?: string | null } | null;
};

function RequestsTable({
  kind,
  rows,
  total,
  loading,
  pagination,
  onPaginationChange,
  onApprove,
  onReject,
  onViewDetails,
  leftControls,
  rightControls,
}: {
  kind: "place" | "branch";
  rows: RequestRow[];
  total: number;
  loading: boolean;
  pagination: { pageIndex: number; pageSize: number };
  onPaginationChange: (p: { pageIndex: number; pageSize: number }) => void;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onViewDetails: (id: string) => void;
  leftControls?: React.ReactNode;
  rightControls?: React.ReactNode;
}) {
  const cols = React.useMemo(
    () => [
      kind === "place"
        ? {
            id: "place_name",
            accessorKey: "proposed_place.name",
            header: "Place Name",
            cell: ({ row }: { row: { original: RequestRow } }) => (
              <span className="font-medium">
                {(row.original.proposed_place as ProposedPlace)?.name || "—"}
              </span>
            ),
          }
        : {
            id: "branch_name",
            accessorKey: "proposed_branch.name",
            header: "Branch Name",
            cell: ({ row }: { row: { original: RequestRow } }) => (
              <span className="font-medium">
                {(row.original.proposed_branch as ProposedBranch)?.name || "—"}
              </span>
            ),
          },
      {
        id: "created",
        accessorKey: "created_at",
        header: "Created",
        cell: ({ row }: { row: { original: RequestRow } }) =>
          timeAgo(row.original.created_at),
      },
      {
        id: "status",
        accessorKey: "status",
        header: "Status",
        cell: ({ row }: { row: { original: RequestRow } }) => (
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
              cell: ({ row }: { row: { original: RequestRow } }) => (
                <span className="text-muted-foreground">
                  {(row.original.proposed_place as ProposedPlace)
                    ?.category_id ?? "—"}
                </span>
              ),
            },
          ]
        : []),
      {
        id: "city",
        accessorKey: "proposed_branch.city",
        header: "City",
        cell: ({ row }: { row: { original: RequestRow } }) => (
          <span className="text-muted-foreground">
            {(row.original.proposed_branch as ProposedBranch)?.city || "—"}
          </span>
        ),
      },
      {
        id: "phone",
        accessorKey: "proposed_branch.phone",
        header: "Phone",
        cell: ({ row }: { row: { original: RequestRow } }) => (
          <span className="text-muted-foreground">
            {(row.original.proposed_branch as ProposedBranch)?.phone || "—"}
          </span>
        ),
      },
      {
        id: "address1",
        accessorKey: "proposed_branch.address_line1",
        header: "Address 1",
        cell: ({ row }: { row: { original: RequestRow } }) => (
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
        cell: ({ row }: { row: { original: RequestRow } }) => (
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
        cell: ({ row }: { row: { original: RequestRow } }) => {
          const isMain = (row.original.proposed_branch as ProposedBranch)
            ?.is_main_branch;
          return (
            <Badge variant="outline">{isMain ? "Main" : "Secondary"}</Badge>
          );
        },
      },
      {
        id: "submitted_by",
        accessorKey: "profiles.full_name",
        header: "Submitted By",
        cell: ({ row }: { row: { original: RequestRow } }) => (
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
        cell: ({ row }: { row: { original: RequestRow } }) => (
          <RequestActionsMenu
            id={row.original.id}
            status={row.original.status}
            onApprove={onApprove}
            onReject={onReject}
            onViewDetails={onViewDetails}
          />
        ),
      },
    ],
    [kind, onApprove, onReject, onViewDetails]
  ) as unknown as ColumnDef<RequestRow, unknown>[];

  return (
    <DataTable
      columns={cols}
      data={rows}
      manualPagination
      pageCount={Math.max(1, Math.ceil(total / pagination.pageSize))}
      pagination={pagination}
      onPaginationChange={onPaginationChange}
      loading={loading}
      leftControls={leftControls}
      rightControls={rightControls}
      initialColumnVisibility={{
        address1: false,
        address2: false,
      }}
    />
  );
}

"use client";

import * as React from "react";
import { DataTable } from "@/components/ui/data-table";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { buildAddRequestColumns } from "./columns";
import { DetailsView } from "./details-view";
import type { RequestRow } from "./types";
import {
  useBranchAddRequests,
  usePlaceAddRequests,
  useReviewBranchAddRequest,
  useReviewPlaceAddRequest,
} from "@/features/requests/data/hooks";

export function AddRequestsTable() {
  const [tab, setTab] = React.useState<"place" | "branch">("place");
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

  const rows: RequestRow[] =
    tab === "place"
      ? (placeReqs.data?.rows as unknown as RequestRow[]) ?? []
      : (branchReqs.data?.rows as unknown as RequestRow[]) ?? [];
  const total =
    tab === "place" ? placeReqs.data?.total ?? 0 : branchReqs.data?.total ?? 0;
  const loading =
    tab === "place"
      ? placeReqs.isPending || placeReqs.isFetching
      : branchReqs.isPending || branchReqs.isFetching;

  const columns = React.useMemo(
    () =>
      buildAddRequestColumns(tab, {
        onApprove: (id) =>
          tab === "place"
            ? reviewPlace.mutate({ id, action: "approve" })
            : reviewBranch.mutate({ id, action: "approve" }),
        onReject: (id) =>
          tab === "place"
            ? reviewPlace.mutate({ id, action: "reject" })
            : reviewBranch.mutate({ id, action: "reject" }),
        onViewDetails: (id) => {
          const request = rows.find((r) => r.id === id);
          if (request) {
            setSelectedRequest(request as RequestRow);
            setDetailsOpen(true);
          }
        },
      }),
    [tab, reviewPlace, reviewBranch, rows]
  );

  return (
    <div className="p-4 md:p-6">
      <Tabs value={tab} onValueChange={(v) => setTab(v as typeof tab)}>
        <TabsList>
          <TabsTrigger value="place">Place</TabsTrigger>
          <TabsTrigger value="branch">Branch</TabsTrigger>
        </TabsList>
        <TabsContent value="place" className="mt-4">
          <DataTable
            columns={columns}
            data={rows}
            manualPagination
            pageCount={Math.max(1, Math.ceil(total / pagination.pageSize))}
            pagination={pagination}
            onPaginationChange={setPagination}
            loading={loading}
            leftControls={
              <RequestsFilters
                status={status}
                onStatusChange={setStatus}
                search={search}
                onSearchChange={setSearch}
              />
            }
            rightControls={<RequestsRightControls />}
            initialColumnVisibility={{ address1: false, address2: false }}
          />
        </TabsContent>
        <TabsContent value="branch" className="mt-4">
          <DataTable
            columns={columns}
            data={rows}
            manualPagination
            pageCount={Math.max(1, Math.ceil(total / pagination.pageSize))}
            pagination={pagination}
            onPaginationChange={setPagination}
            loading={loading}
            leftControls={
              <RequestsFilters
                status={status}
                onStatusChange={setStatus}
                search={search}
                onSearchChange={setSearch}
              />
            }
            rightControls={<RequestsRightControls />}
            initialColumnVisibility={{ address1: false, address2: false }}
          />
        </TabsContent>
      </Tabs>

      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>
              {selectedRequest &&
                (tab === "place" ? "Place Add Request" : "Branch Add Request")}
            </DialogTitle>
          </DialogHeader>
          {selectedRequest && (
            <>
              <DetailsView kind={tab} row={selectedRequest} />
              <div className="flex justify-end gap-2">
                <button
                  className="btn btn-outline"
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
                </button>
                <button
                  className="btn"
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
                </button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

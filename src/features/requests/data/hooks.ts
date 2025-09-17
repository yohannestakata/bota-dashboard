"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export type RequestStatusFilter = "pending" | "approved" | "rejected" | "all";

export type PlaceAddRequest = {
  id: string;
  author_id: string;
  proposed_place: Record<string, unknown>;
  proposed_branch: Record<string, unknown>;
  status: string;
  reviewed_by: string | null;
  reviewed_at: string | null;
  created_at: string;
};

export type BranchAddRequest = {
  id: string;
  place_id: string;
  author_id: string;
  proposed_branch: Record<string, unknown>;
  status: string;
  reviewed_by: string | null;
  reviewed_at: string | null;
  created_at: string;
};

export function usePlaceAddRequests(
  pageIndex: number,
  pageSize: number,
  status: RequestStatusFilter
) {
  return useQuery({
    queryKey: ["requests", "place-add", { pageIndex, pageSize, status }],
    queryFn: async () => {
      const url = new URL(`/api/requests/place-add`, window.location.origin);
      url.searchParams.set("pageIndex", String(pageIndex));
      url.searchParams.set("pageSize", String(pageSize));
      url.searchParams.set("status", status);
      const res = await fetch(url.toString(), { cache: "no-store" });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || "Failed to load requests");
      return json as { rows: PlaceAddRequest[]; total: number };
    },
  });
}

export function useBranchAddRequests(
  pageIndex: number,
  pageSize: number,
  status: RequestStatusFilter
) {
  return useQuery({
    queryKey: ["requests", "branch-add", { pageIndex, pageSize, status }],
    queryFn: async () => {
      const url = new URL(`/api/requests/branch-add`, window.location.origin);
      url.searchParams.set("pageIndex", String(pageIndex));
      url.searchParams.set("pageSize", String(pageSize));
      url.searchParams.set("status", status);
      const res = await fetch(url.toString(), { cache: "no-store" });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || "Failed to load requests");
      return json as { rows: BranchAddRequest[]; total: number };
    },
  });
}

export function useReviewPlaceAddRequest() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: {
      id: string;
      action: "approve" | "reject";
      reason?: string;
    }) => {
      const res = await fetch(`/api/requests/place-add`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json?.error || "Failed to review request");
      return json;
    },
    onSuccess: async () => {
      await qc.invalidateQueries({
        queryKey: ["requests", "place-add"],
        exact: false,
      });
    },
  });
}

export function useReviewBranchAddRequest() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: {
      id: string;
      action: "approve" | "reject";
      reason?: string;
    }) => {
      const res = await fetch(`/api/requests/branch-add`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json?.error || "Failed to review request");
      return json;
    },
    onSuccess: async () => {
      await Promise.all([
        qc.invalidateQueries({
          queryKey: ["requests", "branch-add"],
          exact: false,
        }),
      ]);
    },
  });
}

"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchBranchesPaged,
  fetchPlacesLite,
} from "@/features/branches/data/queries";
import type {
  BranchesPagedResult,
  BranchesQueryParams,
  PlaceLite,
} from "@/features/branches/types";
import { toast } from "sonner";

export function usePlacesLite() {
  return useQuery({
    queryKey: ["places", "lite"],
    queryFn: () => fetchPlacesLite(),
    staleTime: 5 * 60 * 1000,
  });
}

export function useBranchesPaged(
  params: BranchesQueryParams
): ReturnType<typeof useQuery<BranchesPagedResult>> {
  return useQuery({
    queryKey: [
      "branches",
      {
        pageIndex: params.pageIndex,
        pageSize: params.pageSize,
        search: params.search ?? "",
        placeId: params.placeId ?? null,
        main: params.main ?? "all",
        active: params.active ?? "all",
      },
    ],
    queryFn: () => fetchBranchesPaged(params),
  });
}

export function useToggleBranchActive() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      is_active,
    }: {
      id: string;
      is_active: boolean;
    }) => {
      const res = await fetch(
        `/api/branches/${encodeURIComponent(id)}/active`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ is_active }),
        }
      );
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json?.error || "Failed to update branch");
      return true;
    },
    onSuccess: async () => {
      toast.success("Branch updated");
      await qc.invalidateQueries({ queryKey: ["branches"], exact: false });
    },
    onError: (err: unknown) => {
      toast.error(
        err instanceof Error ? err.message : "Failed to update branch"
      );
    },
  });
}

export function useDeleteBranch() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/branches/${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json?.error || "Failed to delete branch");
      return true;
    },
    onSuccess: async () => {
      toast.success("Branch deleted");
      await qc.invalidateQueries({ queryKey: ["branches"], exact: false });
    },
    onError: (err: unknown) => {
      toast.error(
        err instanceof Error ? err.message : "Failed to delete branch"
      );
    },
  });
}

export type CreateBranchInput = {
  place_id: string;
  name: string;
  description?: string | null;
  phone?: string | null;
  website_url?: string | null;
  address_line1?: string | null;
  address_line2?: string | null;
  city?: string | null;
  state?: string | null;
  postal_code?: string | null;
  country?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  price_range?: number | null;
  is_main_branch?: boolean;
  is_active?: boolean;
};

export type UpdateBranchInput = Partial<CreateBranchInput> & { id: string };

export function useCreateBranch() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: CreateBranchInput) => {
      const res = await fetch(`/api/branches`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json?.error || "Failed to create branch");
      return json as { id: string };
    },
    onSuccess: async () => {
      toast.success("Branch created");
      await qc.invalidateQueries({ queryKey: ["branches"], exact: false });
    },
    onError: (err: unknown) => {
      toast.error(
        err instanceof Error ? err.message : "Failed to create branch"
      );
    },
  });
}

export function useUpdateBranch() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: UpdateBranchInput) => {
      const { id, ...rest } = input;
      const res = await fetch(`/api/branches/${encodeURIComponent(id)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(rest),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json?.error || "Failed to update branch");
      return true;
    },
    onSuccess: async () => {
      toast.success("Branch updated");
      await qc.invalidateQueries({ queryKey: ["branches"], exact: false });
    },
    onError: (err: unknown) => {
      toast.error(
        err instanceof Error ? err.message : "Failed to update branch"
      );
    },
  });
}

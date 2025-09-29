"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchCuisinesPaged,
  type CreateCuisineInput,
  type UpdateCuisineInput,
} from "@/features/cuisines/data/queries";
import type {
  CuisinesPagedResult,
  CuisinesQueryParams,
} from "@/features/cuisines/types";
import { toast } from "sonner";

export function useCuisinesPaged(
  params: CuisinesQueryParams
): ReturnType<typeof useQuery<CuisinesPagedResult>> {
  return useQuery({
    queryKey: ["cuisines", { ...params }],
    queryFn: () => fetchCuisinesPaged(params),
  });
}

export function useCreateCuisine() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: CreateCuisineInput) => {
      const res = await fetch("/api/cuisines", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json?.error || "Failed to create cuisine");
      return json as { id: number };
    },
    onSuccess: async () => {
      toast.success("Cuisine created");
      await qc.invalidateQueries({ queryKey: ["cuisines"], exact: false });
    },
    onError: (err: unknown) => {
      toast.error(
        err instanceof Error ? err.message : "Failed to create cuisine"
      );
    },
  });
}

export function useUpdateCuisine() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: UpdateCuisineInput) => {
      const { id, ...rest } = input;
      const res = await fetch(`/api/cuisines/${encodeURIComponent(id)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(rest),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json?.error || "Failed to update cuisine");
      return true;
    },
    onSuccess: async () => {
      toast.success("Cuisine updated");
      await qc.invalidateQueries({ queryKey: ["cuisines"], exact: false });
    },
    onError: (err: unknown) => {
      toast.error(
        err instanceof Error ? err.message : "Failed to update cuisine"
      );
    },
  });
}

export function useDeleteCuisine() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`/api/cuisines/${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json?.error || "Failed to delete cuisine");
      return true;
    },
    onSuccess: async () => {
      toast.success("Cuisine deleted");
      await qc.invalidateQueries({ queryKey: ["cuisines"], exact: false });
    },
    onError: (err: unknown) => {
      toast.error(
        err instanceof Error ? err.message : "Failed to delete cuisine"
      );
    },
  });
}

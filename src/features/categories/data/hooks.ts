"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchCategoriesPaged,
  type CreateCategoryInput,
  type UpdateCategoryInput,
} from "@/features/categories/data/queries";
import type {
  CategoriesPagedResult,
  CategoriesQueryParams,
} from "@/features/categories/types";
import { toast } from "sonner";

export function useCategoriesPaged(
  params: CategoriesQueryParams
): ReturnType<typeof useQuery<CategoriesPagedResult>> {
  return useQuery({
    queryKey: ["categories", { ...params }],
    queryFn: () => fetchCategoriesPaged(params),
  });
}

export function useCreateCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: CreateCategoryInput) => {
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json?.error || "Failed to create category");
      return json as { id: number };
    },
    onSuccess: async () => {
      toast.success("Category created");
      await qc.invalidateQueries({ queryKey: ["categories"], exact: false });
    },
    onError: (err: unknown) => {
      toast.error(
        err instanceof Error ? err.message : "Failed to create category"
      );
    },
  });
}

export function useUpdateCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: UpdateCategoryInput) => {
      const { id, ...rest } = input;
      const res = await fetch(`/api/categories/${encodeURIComponent(id)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(rest),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json?.error || "Failed to update category");
      return true;
    },
    onSuccess: async () => {
      toast.success("Category updated");
      await qc.invalidateQueries({ queryKey: ["categories"], exact: false });
    },
    onError: (err: unknown) => {
      toast.error(
        err instanceof Error ? err.message : "Failed to update category"
      );
    },
  });
}

export function useDeleteCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`/api/categories/${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json?.error || "Failed to delete category");
      return true;
    },
    onSuccess: async () => {
      toast.success("Category deleted");
      await qc.invalidateQueries({ queryKey: ["categories"], exact: false });
    },
    onError: (err: unknown) => {
      toast.error(
        err instanceof Error ? err.message : "Failed to delete category"
      );
    },
  });
}

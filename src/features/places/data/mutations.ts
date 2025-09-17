"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export type CreatePlaceInput = {
  name: string;
  categoryId: number | null;
  description?: string | null;
  tagIds?: number[];
};

export function useCreatePlace() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (input: CreatePlaceInput) => {
      const { name, categoryId, description, tagIds = [] } = input;
      const res = await fetch(`/api/places`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, categoryId, description, tagIds }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(json?.error || "Failed to create place");
      }
      return json as { id: string };
    },
    onSuccess: async () => {
      toast.success("Place created");
      await queryClient.invalidateQueries({
        queryKey: ["places"],
        exact: false,
      });
    },
    onError: (err: unknown) => {
      const msg = err instanceof Error ? err.message : "Failed to create place";
      toast.error(msg);
    },
  });

  return {
    mutate: mutation.mutate,
    mutateAsync: mutation.mutateAsync,
    isLoading: mutation.isPending,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
    error: mutation.error,
  };
}

export function useDeactivatePlace() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (id: string) => {
      if (!id) throw new Error("Id is required");
      const res = await fetch(`/api/places/${encodeURIComponent(id)}/active`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_active: false }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j?.error || "Failed to deactivate");
      }
      return true;
    },
    onSuccess: async () => {
      toast.success("Place deactivated");
      await queryClient.invalidateQueries({
        queryKey: ["places"],
        exact: false,
      });
    },
    onError: (err: unknown) => {
      const msg = err instanceof Error ? err.message : "Failed to deactivate";
      toast.error(msg);
    },
  });

  return {
    mutate: mutation.mutate,
    mutateAsync: mutation.mutateAsync,
    isLoading: mutation.isPending,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
    error: mutation.error,
  };
}

export function useActivatePlace() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (id: string) => {
      if (!id) throw new Error("Id is required");
      const res = await fetch(`/api/places/${encodeURIComponent(id)}/active`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_active: true }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j?.error || "Failed to activate");
      }
      return true;
    },
    onSuccess: async () => {
      toast.success("Place activated");
      await queryClient.invalidateQueries({
        queryKey: ["places"],
        exact: false,
      });
    },
    onError: (err: unknown) => {
      const msg = err instanceof Error ? err.message : "Failed to activate";
      toast.error(msg);
    },
  });

  return {
    mutate: mutation.mutate,
    mutateAsync: mutation.mutateAsync,
    isLoading: mutation.isPending,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
    error: mutation.error,
  };
}

export function useDeletePlace() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (id: string) => {
      if (!id) throw new Error("Id is required");
      const res = await fetch(`/api/places/${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j?.error || "Failed to delete");
      }
      return true;
    },
    onSuccess: async () => {
      toast.success("Place deleted");
      await queryClient.invalidateQueries({
        queryKey: ["places"],
        exact: false,
      });
    },
    onError: (err: unknown) => {
      const msg = err instanceof Error ? err.message : "Failed to delete";
      toast.error(msg);
    },
  });

  return {
    mutate: mutation.mutate,
    mutateAsync: mutation.mutateAsync,
    isLoading: mutation.isPending,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
    error: mutation.error,
  };
}

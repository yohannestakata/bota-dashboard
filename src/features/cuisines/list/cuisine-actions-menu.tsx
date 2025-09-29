"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { WarningDialog } from "@/components/warning-dialog";
import { IconDotsVertical } from "@tabler/icons-react";
import { Loader2Icon, PencilIcon, TrashIcon } from "lucide-react";
import {
  useDeleteCuisine,
  useUpdateCuisine,
} from "@/features/cuisines/data/hooks";

export function CuisineActionsMenu({
  id,
  name,
  description,
}: {
  id: number;
  name: string;
  description: string | null;
}) {
  const del = useDeleteCuisine();
  const update = useUpdateCuisine();
  const [editOpen, setEditOpen] = React.useState(false);
  const [n, setN] = React.useState(name);
  const [d, setD] = React.useState(description ?? "");
  React.useEffect(() => {
    if (editOpen) {
      setN(name);
      setD(description ?? "");
    }
  }, [editOpen, name, description]);
  const canSave = n.trim().length >= 2 && !update.isPending;
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
          onSelect={(e) => (e.preventDefault(), setEditOpen(true))}
        >
          <PencilIcon /> Edit Cuisine
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <WarningDialog
          title="Delete cuisine?"
          description="This action cannot be undone. Places/branches may reference this cuisine."
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
      {editOpen && <div className="hidden" />}
      {editOpen && <dialog open className="hidden" />}
      {editOpen && <div className="sr-only" aria-hidden="true" />}
      {editOpen && (
        <div>
          {/* Inline simple dialog replacement to avoid creating many components */}
          <div className="fixed inset-0 z-50 grid place-items-center bg-black/40">
            <div className="bg-background w-full max-w-md rounded-md border p-4 shadow-lg">
              <div className="mb-3">
                <div className="text-lg font-semibold">Edit cuisine</div>
                <div className="text-muted-foreground text-sm">
                  Update the details below.
                </div>
              </div>
              <div className="grid gap-3">
                <input
                  className="h-9 w-full rounded-md border px-3 text-sm"
                  value={n}
                  onChange={(e) => setN(e.target.value)}
                  placeholder="Name"
                />
                <textarea
                  className="min-h-24 w-full rounded-md border px-3 py-2 text-sm"
                  value={d}
                  onChange={(e) => setD(e.target.value)}
                  placeholder="Description"
                />
              </div>
              <div className="mt-4 flex justify-end gap-2">
                <Button variant="outline" onClick={() => setEditOpen(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={async () => {
                    await update.mutateAsync({
                      id,
                      name: n,
                      description: d || null,
                    });
                    setEditOpen(false);
                  }}
                  disabled={!canSave}
                >
                  {update.isPending ? (
                    <span className="inline-flex items-center gap-2">
                      <Loader2Icon className="size-4 animate-spin" /> Saving...
                    </span>
                  ) : (
                    "Save"
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </DropdownMenu>
  );
}

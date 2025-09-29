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
import { useDeleteCategory } from "@/features/categories/data/hooks";
import { EditCategoryDialog } from "@/features/categories/list/edit-category-dialog";

export function CategoryActionsMenu({
  id,
  name,
  description,
  icon_name,
}: {
  id: number;
  name: string;
  description: string | null;
  icon_name: string | null;
}) {
  const del = useDeleteCategory();
  const [editOpen, setEditOpen] = React.useState(false);
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
          onSelect={(e) => {
            e.preventDefault();
            setEditOpen(true);
          }}
        >
          <PencilIcon /> Edit Category
        </DropdownMenuItem>
        <WarningDialog
          title="Delete category?"
          description="This action cannot be undone. Places using this category may block deletion."
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
      {editOpen && (
        <EditCategoryDialog
          id={id}
          name={name}
          description={description}
          icon_name={icon_name}
          open={editOpen}
          onOpenChange={setEditOpen}
          hideTrigger
        />
      )}
    </DropdownMenu>
  );
}

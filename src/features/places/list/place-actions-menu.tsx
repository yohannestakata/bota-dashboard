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
import {
  MessageSquareIcon,
  GlobeIcon,
  MapPinIcon,
  ListTreeIcon,
  PencilIcon,
  BanIcon,
  TrashIcon,
  Loader2Icon,
  CheckIcon,
} from "lucide-react";
import { IconDotsVertical } from "@tabler/icons-react";
import {
  useDeactivatePlace,
  useDeletePlace,
  useActivatePlace,
} from "@/features/places/data/mutations";

type Props = {
  id?: string;
  slug?: string;
  isActive?: boolean;
};

export function PlaceActionsMenu({ id, slug, isActive }: Props) {
  const deactivate = useDeactivatePlace();
  const activate = useActivatePlace();
  const deletingMutation = useDeletePlace();

  const toggling = isActive ? deactivate.isLoading : activate.isLoading;
  const toggleLabel = isActive ? "Deactivate" : "Activate";
  const toggleInProgressLabel = isActive ? "Deactivating..." : "Activating...";

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
          onClick={() =>
            slug &&
            window.open(`https://botareview.com/place/${slug}`, "_blank")
          }
          disabled={!slug}
        >
          <GlobeIcon />
          View on Website
        </DropdownMenuItem>
        <DropdownMenuItem>
          <MapPinIcon />
          View Branches
        </DropdownMenuItem>
        <DropdownMenuItem>
          <MessageSquareIcon />
          View Reviews
        </DropdownMenuItem>
        <DropdownMenuItem>
          <ListTreeIcon />
          View Requests
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <PencilIcon />
          Edit Place
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <WarningDialog
          title={`${isActive ? "Deactivate" : "Activate"} place?`}
          description={
            isActive
              ? "This will hide the place from public view. You can reactivate later."
              : "This will make the place visible to the public."
          }
          confirmText={toggleLabel}
          loading={toggling}
          onConfirm={async () => {
            if (!id) throw new Error("Missing id");
            console.log("[ui.places] toggle active", { id, isActive });
            if (isActive) {
              await deactivate.mutateAsync(id);
            } else {
              await activate.mutateAsync(id);
            }
          }}
        >
          <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
            {toggling ? (
              <Loader2Icon className="animate-spin" />
            ) : isActive ? (
              <BanIcon />
            ) : (
              <CheckIcon />
            )}
            {toggling ? toggleInProgressLabel : toggleLabel}
          </DropdownMenuItem>
        </WarningDialog>
        <WarningDialog
          title="Delete place?"
          description="This action cannot be undone. Place branches and reviews will be deleted."
          confirmText="Delete"
          loading={deletingMutation.isLoading}
          onConfirm={async () => {
            if (!id) throw new Error("Missing id");
            console.log("[ui.places] delete", { id });
            await deletingMutation.mutateAsync(id);
          }}
        >
          <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
            {deletingMutation.isLoading ? (
              <Loader2Icon className="animate-spin" />
            ) : (
              <TrashIcon />
            )}
            {deletingMutation.isLoading ? "Deleting..." : "Delete"}
          </DropdownMenuItem>
        </WarningDialog>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

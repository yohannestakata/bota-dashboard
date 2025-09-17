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
import { EyeIcon, CheckIcon, XIcon, Loader2Icon } from "lucide-react";
import { IconDotsVertical } from "@tabler/icons-react";

type Props = {
  id: string;
  status: string;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onViewDetails: (id: string) => void;
};

export function RequestActionsMenu({
  id,
  status,
  onApprove,
  onReject,
  onViewDetails,
}: Props) {
  const [isApproving, setIsApproving] = React.useState(false);
  const [isRejecting, setIsRejecting] = React.useState(false);

  const handleApprove = async () => {
    setIsApproving(true);
    try {
      onApprove(id);
    } finally {
      setIsApproving(false);
    }
  };

  const handleReject = async () => {
    setIsRejecting(true);
    try {
      onReject(id);
    } finally {
      setIsRejecting(false);
    }
  };

  const isPending = status === "pending";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <IconDotsVertical />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => onViewDetails(id)}>
          <EyeIcon />
          View Details
        </DropdownMenuItem>
        {isPending && (
          <>
            <DropdownMenuSeparator />
            <WarningDialog
              title="Approve request?"
              description="This will approve the request and make it live on the website."
              confirmText="Approve"
              loading={isApproving}
              onConfirm={handleApprove}
            >
              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                {isApproving ? (
                  <Loader2Icon className="animate-spin" />
                ) : (
                  <CheckIcon />
                )}
                {isApproving ? "Approving..." : "Approve"}
              </DropdownMenuItem>
            </WarningDialog>
            <WarningDialog
              title="Reject request?"
              description="This will reject the request. The user will be notified."
              confirmText="Reject"
              loading={isRejecting}
              onConfirm={handleReject}
            >
              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                {isRejecting ? (
                  <Loader2Icon className="animate-spin" />
                ) : (
                  <XIcon />
                )}
                {isRejecting ? "Rejecting..." : "Reject"}
              </DropdownMenuItem>
            </WarningDialog>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
// Icons intentionally not imported here; parent can pass any trigger children

type WarningDialogProps = {
  open?: boolean;
  title: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void | Promise<void>;
  onOpenChange?: (open: boolean) => void;
  loading?: boolean;
  children?: React.ReactNode;
};

export function WarningDialog({
  open,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onOpenChange,
  loading,
  children,
}: WarningDialogProps) {
  const [internalOpen, setInternalOpen] = React.useState(false);
  const [internalLoading, setInternalLoading] = React.useState(false);
  const isControlled = typeof open === "boolean";
  const dialogOpen = isControlled ? !!open : internalOpen;
  const handleOpenChange = (v: boolean) => {
    if (!isControlled) setInternalOpen(v);
    onOpenChange?.(v);
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={handleOpenChange}>
      {children ? <DialogTrigger asChild>{children}</DialogTrigger> : null}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description ? (
            <DialogDescription>{description}</DialogDescription>
          ) : null}
        </DialogHeader>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => handleOpenChange(false)}
            disabled={!!(loading ?? internalLoading)}
          >
            {cancelText}
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={async () => {
              try {
                if (loading === undefined) setInternalLoading(true);
                await Promise.resolve(onConfirm());
                handleOpenChange(false);
              } finally {
                if (loading === undefined) setInternalLoading(false);
              }
            }}
            disabled={!!(loading ?? internalLoading)}
          >
            {loading ?? internalLoading ? "Working..." : confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

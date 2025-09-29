"use client";

import * as React from "react";
import { Loader2, PencilIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { IconPicker } from "@/components/ui/icon-picker";
import { useUpdateCategory } from "@/features/categories/data/hooks";

type Props = {
  id: number;
  name: string;
  description: string | null;
  icon_name: string | null;
  open?: boolean;
  onOpenChange?: (v: boolean) => void;
  hideTrigger?: boolean;
};

export function EditCategoryDialog({
  id,
  name,
  description,
  icon_name,
  open: controlledOpen,
  onOpenChange,
  hideTrigger,
}: Props) {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(false);
  const open =
    typeof controlledOpen === "boolean" ? controlledOpen : uncontrolledOpen;
  const setOpen = (v: boolean) =>
    onOpenChange ? onOpenChange(v) : setUncontrolledOpen(v);
  const [n, setN] = React.useState(name);
  const [d, setD] = React.useState(description ?? "");
  const [icon, setIcon] = React.useState(icon_name ?? "");

  React.useEffect(() => {
    if (open) {
      setN(name);
      setD(description ?? "");
      setIcon(icon_name ?? "");
    }
  }, [open, name, description, icon_name]);

  const { mutate: update, isPending } = useUpdateCategory();
  const canSave = n.trim().length >= 2 && !isPending;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {!hideTrigger && (
        <DialogTrigger asChild>
          <Button variant="ghost" size="sm">
            <PencilIcon className="mr-2 size-4" /> Edit
          </Button>
        </DialogTrigger>
      )}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit category</DialogTitle>
          <DialogDescription>Update the details below.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="edit-category-name">Name</Label>
            <Input
              id="edit-category-name"
              value={n}
              onChange={(e) => setN(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label>Icon (optional)</Label>
            <IconPicker value={icon} onChange={setIcon} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="edit-category-description">Description</Label>
            <Textarea
              id="edit-category-description"
              value={d}
              onChange={(e) => setD(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            type="button"
            onClick={() =>
              update(
                {
                  id,
                  name: n,
                  description: d || null,
                  icon_name: icon || null,
                },
                { onSuccess: () => setOpen(false) }
              )
            }
            disabled={!canSave}
          >
            {isPending ? (
              <span className="inline-flex items-center gap-2">
                <Loader2 className="size-4 animate-spin" /> Saving...
              </span>
            ) : (
              "Save"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

"use client";

import * as React from "react";
import { IconPlus } from "@tabler/icons-react";
import { Loader2 } from "lucide-react";
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
import { useCreateCategory } from "@/features/categories/data/hooks";
import { IconPicker } from "@/components/ui/icon-picker";

export function AddCategoryDialog() {
  const [open, setOpen] = React.useState(false);
  const [name, setName] = React.useState("");
  const [icon, setIcon] = React.useState("");
  const [description, setDescription] = React.useState("");

  const reset = React.useCallback(() => {
    setName("");
    setIcon("");
    setDescription("");
  }, []);

  const { mutate: create, isPending } = useCreateCategory();
  const canSave = name.trim().length >= 2 && !isPending;

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => (v ? setOpen(true) : (setOpen(false), reset()))}
    >
      <DialogTrigger asChild>
        <Button size="sm">
          <IconPlus />
          Add Category
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a new category</DialogTitle>
          <DialogDescription>
            Provide basic details for the category.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="category-name">Name</Label>
            <Input
              id="category-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Ethiopian"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="category-icon">Icon (optional)</Label>
            <IconPicker value={icon} onChange={setIcon} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="category-description">Description</Label>
            <Textarea
              id="category-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Short description"
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => reset()}
            disabled={isPending}
          >
            Reset
          </Button>
          <Button
            type="button"
            disabled={!canSave}
            onClick={() =>
              create(
                {
                  name,
                  description: description || null,
                  icon_name: icon || null,
                },
                { onSuccess: () => (reset(), setOpen(false)) }
              )
            }
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

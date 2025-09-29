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
import { useCreateCuisine } from "@/features/cuisines/data/hooks";

export function AddCuisineDialog() {
  const [open, setOpen] = React.useState(false);
  const [name, setName] = React.useState("");
  const [description, setDescription] = React.useState("");

  const reset = React.useCallback(() => {
    setName("");
    setDescription("");
  }, []);

  const { mutate: create, isLoading } = useCreateCuisine();
  const canSave = name.trim().length >= 2 && !isLoading;

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => (v ? setOpen(true) : (setOpen(false), reset()))}
    >
      <DialogTrigger asChild>
        <Button size="sm">
          <IconPlus />
          Add Cuisine
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a new cuisine</DialogTitle>
          <DialogDescription>
            Provide basic details for the cuisine.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="cuisine-name">Name</Label>
            <Input
              id="cuisine-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="cuisine-description">Description</Label>
            <Textarea
              id="cuisine-description"
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
            disabled={isLoading}
          >
            Reset
          </Button>
          <Button
            type="button"
            disabled={!canSave}
            onClick={() =>
              create(
                { name, description: description || null },
                { onSuccess: () => (reset(), setOpen(false)) }
              )
            }
          >
            {isLoading ? (
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

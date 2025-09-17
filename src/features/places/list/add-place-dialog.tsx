"use client";

import * as React from "react";
import { IconPlus } from "@tabler/icons-react";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCategoriesLite, useTagsLite } from "@/features/places/data/hooks";
import { useCreatePlace } from "@/features/places/data/mutations";

export function AddPlaceDialog() {
  const [open, setOpen] = React.useState(false);
  const [name, setName] = React.useState("");
  const [categoryId, setCategoryId] = React.useState<string>("all");
  const [description, setDescription] = React.useState("");
  const [selectedTagIds, setSelectedTagIds] = React.useState<number[]>([]);

  const { data: categories = [] } = useCategoriesLite();
  const { data: tags = [] } = useTagsLite();

  const resetForm = React.useCallback(() => {
    setName("");
    setCategoryId("all");
    setDescription("");
    setSelectedTagIds([]);
  }, []);

  const { mutate: createPlace, isLoading } = useCreatePlace();

  const canSave = name.trim().length > 0 && !isLoading;

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => (v ? setOpen(true) : (setOpen(false), resetForm()))}
    >
      <DialogTrigger asChild>
        <Button size="sm">
          <IconPlus />
          Add Place
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a new place</DialogTitle>
          <DialogDescription>
            Provide basic details for the place.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="place-name">Name</Label>
            <Input
              id="place-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Habesha Restaurant"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="place-category">Category</Label>
            <Select value={categoryId} onValueChange={(v) => setCategoryId(v)}>
              <SelectTrigger id="place-category" className="w-full">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Select a category</SelectItem>
                {categories.map((c) => (
                  <SelectItem key={c.id} value={String(c.id)}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="place-description">Description</Label>
            <Textarea
              id="place-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Short description"
            />
          </div>
          <div className="grid gap-2">
            <Label>Tags</Label>
            <div className="flex flex-wrap gap-2">
              {tags.map((t) => {
                const active = selectedTagIds.includes(t.id);
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() =>
                      setSelectedTagIds((prev) =>
                        prev.includes(t.id)
                          ? prev.filter((id) => id !== t.id)
                          : [...prev, t.id]
                      )
                    }
                    className="cursor-pointer"
                  >
                    <Badge variant={active ? "default" : "outline"}>
                      {t.name}
                    </Badge>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => resetForm()}
            disabled={isLoading}
          >
            Reset
          </Button>
          <Button
            type="button"
            onClick={() =>
              createPlace(
                {
                  name,
                  categoryId: categoryId === "all" ? null : Number(categoryId),
                  description: description || null,
                  tagIds: selectedTagIds,
                },
                {
                  onSuccess: () => {
                    resetForm();
                    setOpen(false);
                  },
                }
              )
            }
            disabled={!canSave}
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

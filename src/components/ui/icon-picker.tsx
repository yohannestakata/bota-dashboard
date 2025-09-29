"use client";

import * as React from "react";
import * as Lucide from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export type IconPickerProps = {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  className?: string;
  buttonClassName?: string;
};

export function IconPicker({
  value,
  onChange,
  placeholder = "Select icon",
  className,
  buttonClassName,
}: IconPickerProps) {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const [debouncedQuery, setDebouncedQuery] = React.useState("");

  const Icons = Lucide as unknown as Record<string, LucideIcon>;
  const allKeys = React.useMemo(() => {
    const keys = Object.keys(Icons)
      .filter((k) => /^[A-Z]/.test(k))
      .sort();
    // Filter out generic Icon component only; lucide icons are forwardRef components (typeof === 'object')
    return keys.filter((k) => k !== "Icon");
  }, []);

  React.useEffect(() => {
    const t = window.setTimeout(() => setDebouncedQuery(query), 150);
    return () => window.clearTimeout(t);
  }, [query]);

  const MAX_DEFAULT = 120;
  const filtered = React.useMemo(() => {
    const q = debouncedQuery.trim().toLowerCase();
    if (!q) return allKeys.slice(0, MAX_DEFAULT);
    return allKeys.filter((k) => toIconNameFromKey(k).includes(q));
  }, [allKeys, debouncedQuery]);

  const selectedKey = toIconComponentKey(value);
  const Selected = Icons[selectedKey];
  const selectedLabel = selectedKey || value || "";

  return (
    <div className={cn("w-full", className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            className={cn(
              "justify-between w-full",
              !value && "text-muted-foreground",
              buttonClassName
            )}
          >
            {Selected ? (
              <span className="inline-flex items-center gap-2">
                <Selected className="size-4" /> {selectedLabel}
              </span>
            ) : value ? (
              selectedLabel
            ) : (
              placeholder
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-3 w-[360px]">
          <div className="flex flex-col gap-2">
            <Input
              placeholder="Search icons..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="h-8"
            />
            <div className="max-h-64 overflow-auto">
              <ul className="grid grid-cols-2 gap-1">
                {filtered.map((key) => {
                  const IconComp = Icons[key];
                  const label = toIconNameFromKey(key);
                  return (
                    <li key={key}>
                      <button
                        type="button"
                        className="hover:bg-muted/60 w-full rounded-md px-2 py-1 text-left"
                        onClick={() => {
                          onChange(key);
                          setOpen(false);
                        }}
                      >
                        <span className="inline-flex items-center gap-2">
                          <IconComp className="size-4" />
                          <span className="truncate">{label}</span>
                        </span>
                      </button>
                    </li>
                  );
                })}
                {filtered.length === 0 && (
                  <li className="text-muted-foreground px-2 py-1">
                    No icons found.
                  </li>
                )}
              </ul>
              {!debouncedQuery && allKeys.length > MAX_DEFAULT && (
                <div className="text-muted-foreground px-2 py-1 text-xs">
                  Showing first {MAX_DEFAULT} icons. Type to search more.
                </div>
              )}
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}

export function toIconComponentKey(input: string): string {
  if (!input) return "";
  if (/^[A-Z][A-Za-z0-9]*$/.test(input)) return input;
  return input
    .split(/[^a-zA-Z0-9]+/)
    .filter(Boolean)
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join("");
}

export function toIconNameFromKey(key: string): string {
  return key.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
}

"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function RequestsFilters({
  status,
  onStatusChange,
  search,
  onSearchChange,
}: {
  status: "pending" | "approved" | "rejected" | "all";
  onStatusChange: (s: "pending" | "approved" | "rejected" | "all") => void;
  search: string;
  onSearchChange: (s: string) => void;
}) {
  return (
    <div className="flex w-full items-center gap-2">
      <Input
        placeholder="Search by name…"
        className="h-8 w-64"
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
      />
      <Select
        value={status}
        onValueChange={(v: "pending" | "approved" | "rejected" | "all") =>
          onStatusChange(v)
        }
      >
        <SelectTrigger className="h-8 w-40">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="pending">Pending</SelectItem>
          <SelectItem value="approved">Approved</SelectItem>
          <SelectItem value="rejected">Rejected</SelectItem>
          <SelectItem value="all">All</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}

export function RequestsRightControls({
  children,
}: {
  children?: React.ReactNode;
}) {
  return <div className="flex items-center gap-2">{children}</div>;
}

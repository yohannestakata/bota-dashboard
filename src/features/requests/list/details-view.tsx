"use client";

import * as React from "react";
import { LeafletMap } from "@/features/requests/components/leaflet-map";
import type { RequestRow, ProposedPlace, ProposedBranch } from "./types";

export function DetailsView({
  kind,
  row,
}: {
  kind: "place" | "branch";
  row: RequestRow;
}) {
  const place = (row.proposed_place as ProposedPlace) || {};
  const branch = (row.proposed_branch as ProposedBranch) || {};
  return (
    <div className="grid gap-6">
      {kind === "place" ? (
        <div className="grid gap-4">
          <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
            <div>
              <div className="text-xs uppercase text-muted-foreground">
                Place Name
              </div>
              <div className="font-medium">{place.name || "—"}</div>
            </div>
            <div>
              <div className="text-xs uppercase text-muted-foreground">
                Category ID
              </div>
              <div className="font-medium">{place.category_id ?? "—"}</div>
            </div>
          </div>
          <div>
            <div className="text-xs uppercase text-muted-foreground">
              Description
            </div>
            <div className="text-sm">{place.description || "—"}</div>
          </div>
          <div className="grid gap-2">
            <div className="text-xs uppercase text-muted-foreground">
              Proposed Branch
            </div>
            <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
              <div>
                <div className="text-xs uppercase text-muted-foreground">
                  Name
                </div>
                <div className="font-medium">
                  {branch.name || place.name || "—"}
                </div>
              </div>
              <div>
                <div className="text-xs uppercase text-muted-foreground">
                  Phone
                </div>
                <div className="font-medium">{branch.phone || "—"}</div>
              </div>
              <div>
                <div className="text-xs uppercase text-muted-foreground">
                  City
                </div>
                <div className="font-medium">{branch.city || "—"}</div>
              </div>
              <div>
                <div className="text-xs uppercase text-muted-foreground">
                  Address
                </div>
                <div className="font-medium">{branch.address_line1 || "—"}</div>
                <div className="text-muted-foreground">
                  {branch.address_line2 || ""}
                </div>
              </div>
              <div>
                <div className="text-xs uppercase text-muted-foreground">
                  Main Branch
                </div>
                <div className="font-medium">
                  {branch.is_main_branch ? "Yes" : "No"}
                </div>
              </div>
            </div>
            <LeafletMap
              latitude={branch.latitude ?? null}
              longitude={branch.longitude ?? null}
              height={256}
            />
          </div>
        </div>
      ) : (
        <div className="grid gap-4">
          <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
            <div>
              <div className="text-xs uppercase text-muted-foreground">
                Branch Name
              </div>
              <div className="font-medium">{branch.name || "—"}</div>
            </div>
            <div>
              <div className="text-xs uppercase text-muted-foreground">
                Phone
              </div>
              <div className="font-medium">{branch.phone || "—"}</div>
            </div>
            <div>
              <div className="text-xs uppercase text-muted-foreground">
                City
              </div>
              <div className="font-medium">{branch.city || "—"}</div>
            </div>
            <div>
              <div className="text-xs uppercase text-muted-foreground">
                Address
              </div>
              <div className="font-medium">{branch.address_line1 || "—"}</div>
              <div className="text-muted-foreground">
                {branch.address_line2 || ""}
              </div>
            </div>
            <div>
              <div className="text-xs uppercase text-muted-foreground">
                Main Branch
              </div>
              <div className="font-medium">
                {branch.is_main_branch ? "Yes" : "No"}
              </div>
            </div>
          </div>
          <LeafletMap
            latitude={branch.latitude ?? null}
            longitude={branch.longitude ?? null}
            height={256}
          />
        </div>
      )}
    </div>
  );
}

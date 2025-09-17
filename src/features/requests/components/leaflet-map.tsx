"use client";

import * as React from "react";
import dynamic from "next/dynamic";

type Props = {
  latitude?: number | null;
  longitude?: number | null;
  height?: number;
  zoom?: number;
};

function ensureLeafletCss() {
  if (typeof document === "undefined") return;
  const id = "leaflet-css";
  if (document.getElementById(id)) return;
  const link = document.createElement("link");
  link.id = id;
  link.rel = "stylesheet";
  link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
  document.head.appendChild(link);
}

const ClientMap = dynamic(() => import("./leaflet-map.client"), {
  ssr: false,
  loading: () => (
    <div className="text-muted-foreground flex h-full w-full items-center justify-center text-sm">
      Loading map…
    </div>
  ),
});

export function LeafletMap({
  latitude,
  longitude,
  height = 256,
  zoom = 15,
}: Props) {
  React.useEffect(() => ensureLeafletCss(), []);
  const hasCoords =
    typeof latitude === "number" && typeof longitude === "number";
  if (!hasCoords) {
    return (
      <div className="text-muted-foreground text-sm">No location provided.</div>
    );
  }
  return (
    <div
      style={{ height, width: "100%" }}
      className="overflow-hidden rounded-md"
    >
      <ClientMap
        latitude={latitude as number}
        longitude={longitude as number}
        zoom={zoom}
      />
    </div>
  );
}

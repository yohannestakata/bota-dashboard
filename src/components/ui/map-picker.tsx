"use client";

import * as React from "react";
import dynamic from "next/dynamic";

type Props = {
  latitude: number | null;
  longitude: number | null;
  onChange: (lat: number, lng: number) => void;
  heightClass?: string;
};

const LeafletMap = dynamic(() => import("@/components/ui/map-picker.leaflet"), {
  ssr: false,
});

export function MapPicker({
  latitude,
  longitude,
  onChange,
  heightClass,
}: Props) {
  return (
    <LeafletMap
      latitude={latitude}
      longitude={longitude}
      onChange={onChange}
      heightClass={heightClass}
    />
  );
}

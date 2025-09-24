"use client";

import { MapContainer, TileLayer, Marker } from "react-leaflet";
import type { LatLngExpression } from "leaflet";
import * as React from "react";

export default function LeafletMapClient({
  latitude,
  longitude,
  zoom,
}: {
  latitude: number;
  longitude: number;
  zoom: number;
}) {
  const center: LatLngExpression = [latitude, longitude];
  type AnyProps = {
    center: LatLngExpression;
    zoom: number;
    style: React.CSSProperties;
    children?: React.ReactNode;
  };
  const AnyMap = MapContainer as unknown as React.ComponentType<AnyProps>;
  return (
    <AnyMap
      center={center}
      zoom={zoom}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <Marker position={center} />
    </AnyMap>
  );
}

"use client";

import * as React from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";

type Props = {
  latitude: number | null;
  longitude: number | null;
  onChange: (lat: number, lng: number) => void;
  heightClass?: string;
};

function ClickHandler({
  onClick,
}: {
  onClick: (lat: number, lng: number) => void;
}) {
  useMapEvents({
    click(e) {
      onClick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

export default function MapPickerLeaflet({
  latitude,
  longitude,
  onChange,
  heightClass,
}: Props) {
  const center: [number, number] = [latitude ?? 9.0108, longitude ?? 38.7613];
  return (
    <div
      className={`${
        heightClass ?? "h-64"
      } w-full overflow-hidden rounded-md border`}
    >
      <MapContainer
        center={center}
        zoom={13}
        scrollWheelZoom={true}
        className="h-full w-full"
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <ClickHandler onClick={onChange} />
        {latitude != null && longitude != null && (
          <Marker position={[latitude, longitude]} />
        )}
      </MapContainer>
    </div>
  );
}

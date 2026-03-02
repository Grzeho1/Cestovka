"use client";

import { useRef, useEffect, useState } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import type { RoutePoint } from "@/lib/types";
import {
  INDONESIA_DEFAULT_VIEW,
  getMapTilerStyleUrl,
} from "@/lib/map-config";

interface LocationPickerProps {
  value?: RoutePoint;
  onChange: (point: RoutePoint) => void;
  className?: string;
}

const MAPTILER_KEY = process.env.NEXT_PUBLIC_MAPTILER_KEY || "";

export default function LocationPicker({
  value,
  onChange,
  className = "",
}: LocationPickerProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const marker = useRef<maplibregl.Marker | null>(null);
  const [locationName, setLocationName] = useState(value?.name || "");

  useEffect(() => {
    if (!mapContainer.current || !MAPTILER_KEY) return;

    const initialCenter = value
      ? ([value.lng, value.lat] as [number, number])
      : INDONESIA_DEFAULT_VIEW.center;

    const m = new maplibregl.Map({
      container: mapContainer.current,
      style: getMapTilerStyleUrl(MAPTILER_KEY),
      center: initialCenter,
      zoom: value ? 12 : 5,
      pitch: 0,
    });

    m.addControl(new maplibregl.NavigationControl(), "top-right");

    // Add marker if value exists
    if (value) {
      marker.current = new maplibregl.Marker({ color: "#c8521a" })
        .setLngLat([value.lng, value.lat])
        .addTo(m);
    }

    // Click handler to set location
    m.on("click", async (e) => {
      const { lng, lat } = e.lngLat;

      // Update or create marker
      if (marker.current) {
        marker.current.setLngLat([lng, lat]);
      } else {
        marker.current = new maplibregl.Marker({ color: "#c8521a" })
          .setLngLat([lng, lat])
          .addTo(m);
      }

      // Reverse geocode for place name
      let name = "";
      try {
        const res = await fetch(
          `https://api.maptiler.com/geocoding/${lng},${lat}.json?key=${MAPTILER_KEY}`
        );
        const data = await res.json();
        if (data.features?.length > 0) {
          name = data.features[0].place_name || data.features[0].text || "";
        }
      } catch {
        // Geocoding failed, use coords as name
      }

      setLocationName(name);
      onChange({ lat, lng, name: name || undefined });
    });

    map.current = m;

    return () => {
      m.remove();
      map.current = null;
      marker.current = null;
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className={className}>
      <div
        ref={mapContainer}
        className="w-full h-48 rounded-[0.4rem] overflow-hidden border border-sand"
      />
      {(value || locationName) && (
        <div className="mt-1.5 flex items-center gap-2 text-xs text-mist">
          <span className="text-forest">&#10003;</span>
          <span>
            {locationName ||
              (value ? `${value.lat.toFixed(4)}, ${value.lng.toFixed(4)}` : "")}
          </span>
        </div>
      )}
      {!MAPTILER_KEY && (
        <p className="mt-1 text-xs text-ember">
          MapTiler API key missing
        </p>
      )}
    </div>
  );
}

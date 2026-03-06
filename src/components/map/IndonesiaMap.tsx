"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { useLocale, useTranslations } from "next-intl";
import { AREAS, type Area } from "@/lib/areas";
import {
  AREA_COORDS,
  INDONESIA_DEFAULT_VIEW,
  TERRAIN_EXAGGERATION,
  getMapTilerStyleUrl,
} from "@/lib/map-config";
import type { Package } from "@/lib/types";

interface IndonesiaMapProps {
  className?: string;
  packages?: Package[];
  selectedPackage?: Package | null;
  onAreaClick?: (area: Area) => void;
  mode?: "overview" | "detail";
}

const MAPTILER_KEY = process.env.NEXT_PUBLIC_MAPTILER_KEY || "";

export default function IndonesiaMap({
  className = "",
  packages = [],
  selectedPackage = null,
  onAreaClick,
  mode = "overview",
}: IndonesiaMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<maplibregl.Marker[]>([]);
  const popupRef = useRef<maplibregl.Popup | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const locale = useLocale();
  const t = useTranslations("map");

  const getPackageCountForArea = useCallback(
    (area: string) => {
      return packages.filter((p) => p.area === area && p.active).length;
    },
    [packages]
  );

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || !MAPTILER_KEY) return;

    const initialView =
      mode === "detail" && selectedPackage?.route_points?.length
        ? {
            center: [
              selectedPackage.route_points[0].lng,
              selectedPackage.route_points[0].lat,
            ] as [number, number],
            zoom: 9,
            pitch: 50,
            bearing: 0,
          }
        : INDONESIA_DEFAULT_VIEW;

    const mapStyle = "hybrid" as const;

    const m = new maplibregl.Map({
      container: mapContainer.current,
      style: getMapTilerStyleUrl(MAPTILER_KEY, mapStyle),
      center: initialView.center,
      zoom: initialView.zoom,
      pitch: initialView.pitch,
      bearing: initialView.bearing,
      maxBounds: [
        [90, -15],
        [155, 10],
      ],
    });

    m.addControl(new maplibregl.NavigationControl(), "top-right");

    m.on("load", () => {
      // Add 3D terrain
      m.addSource("terrain", {
        type: "raster-dem",
        url: `https://api.maptiler.com/tiles/terrain-rgb-v2/tiles.json?key=${MAPTILER_KEY}`,
      });

      m.setTerrain({
        source: "terrain",
        exaggeration: TERRAIN_EXAGGERATION,
      });

      setMapLoaded(true);
    });

    map.current = m;

    return () => {
      markersRef.current.forEach((marker) => marker.remove());
      markersRef.current = [];
      m.remove();
      map.current = null;
    };
  }, [mode, selectedPackage?.route_points]);

  // Add area markers in overview mode
  useEffect(() => {
    if (!mapLoaded || !map.current || mode !== "overview") return;

    // Clear existing markers
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    AREAS.forEach((area) => {
      const coords = AREA_COORDS[area];
      if (!coords) return;

      const count = getPackageCountForArea(area);

      // Create custom marker element
      const el = document.createElement("div");
      el.className = "indonesia-map-marker";
      el.innerHTML = `
        <div class="marker-dot"></div>
        <div class="marker-label">${area}</div>
      `;

      const marker = new maplibregl.Marker({ element: el })
        .setLngLat(coords.center)
        .addTo(map.current!);

      el.addEventListener("click", () => {
        // Close existing popup
        if (popupRef.current) {
          popupRef.current.remove();
          popupRef.current = null;
        }

        // Fly to area
        map.current?.flyTo({
          center: coords.center,
          zoom: coords.zoom,
          pitch: 50,
          duration: 1500,
        });

        // Create popup
        const popupHtml = `
          <div class="area-popup">
            <h3 class="area-popup-title">${area}</h3>
            ${
              count > 0
                ? `<p class="area-popup-count">${count} ${t("packages")} ↓</p>`
                : `<p class="area-popup-empty">${t("noPackagesYet")}</p>`
            }
          </div>
        `;

        const popup = new maplibregl.Popup({
          offset: 25,
          closeButton: true,
          maxWidth: "220px",
        })
          .setLngLat(coords.center)
          .setHTML(popupHtml)
          .addTo(map.current!);

        popupRef.current = popup;

        if (onAreaClick) {
          onAreaClick(area);
        }
      });

      markersRef.current.push(marker);
    });
  }, [mapLoaded, mode, packages, locale, t, getPackageCountForArea, onAreaClick]);

  // Fetch real road route from OSRM (free, no API key needed)
  useEffect(() => {
    if (!mapLoaded || !map.current) return;

    const m = map.current;

    // Clean up previous route layers
    if (m.getLayer("route-line")) m.removeLayer("route-line");
    if (m.getLayer("route-line-outline")) m.removeLayer("route-line-outline");
    if (m.getSource("route")) m.removeSource("route");

    // Remove existing route markers
    document.querySelectorAll(".route-day-marker").forEach((el) => el.remove());

    const pkg = selectedPackage;
    if (!pkg?.route_points?.length) return;

    const waypoints = pkg.route_points;

    // Add numbered day markers with clickable popups
    const itinerary = pkg.itinerary || [];

    waypoints.forEach((point, index) => {
      const el = document.createElement("div");
      el.className = "route-day-marker";
      el.innerHTML = `<span>${index + 1}</span>`;
      if (point.name) el.title = point.name;

      const marker = new maplibregl.Marker({ element: el })
        .setLngLat([point.lng, point.lat])
        .addTo(m);

      // Build popup content from itinerary day data
      const day = itinerary[index];
      const dayTitle = day?.title || point.name || `Day ${index + 1}`;
      const dayText = day?.text || "";
      const imageUrl = day?.image_url || (index === 0 ? pkg.cover_url : "") || "";

      const popupHtml = `
        <div class="route-popup">
          ${imageUrl ? `<img src="${imageUrl}" alt="${dayTitle}" class="route-popup-img" />` : ""}
          <div class="route-popup-body">
            <div class="route-popup-day">Den ${index + 1}</div>
            <div class="route-popup-title">${dayTitle}</div>
            ${dayText ? `<div class="route-popup-text">${dayText.length > 150 ? dayText.slice(0, 150) + "…" : dayText}</div>` : ""}
            ${point.name ? `<div class="route-popup-location">${point.name}</div>` : ""}
          </div>
        </div>
      `;

      const popup = new maplibregl.Popup({
        offset: 20,
        closeButton: true,
        maxWidth: "280px",
      }).setHTML(popupHtml);

      marker.setPopup(popup);
    });

    // Fit bounds to waypoints
    const bounds = new maplibregl.LngLatBounds();
    waypoints.forEach((p) => bounds.extend([p.lng, p.lat]));
    m.fitBounds(bounds, { padding: 60, pitch: 50, duration: 1500 });

    // Fetch actual road route from OSRM
    if (waypoints.length >= 2) {
      const coordsStr = waypoints
        .map((p) => `${p.lng},${p.lat}`)
        .join(";");

      fetch(
        `https://router.project-osrm.org/route/v1/driving/${coordsStr}?overview=full&geometries=geojson`
      )
        .then((res) => res.json())
        .then((data) => {
          if (!map.current || data.code !== "Ok" || !data.routes?.[0]) return;

          const routeGeometry = data.routes[0].geometry;

          m.addSource("route", {
            type: "geojson",
            data: {
              type: "Feature",
              properties: {},
              geometry: routeGeometry,
            },
          });

          // Route outline (wider, darker)
          m.addLayer({
            id: "route-line-outline",
            type: "line",
            source: "route",
            layout: { "line-join": "round", "line-cap": "round" },
            paint: {
              "line-color": "#1a1208",
              "line-width": 6,
              "line-opacity": 0.25,
            },
          });

          // Route line (inner, colored)
          m.addLayer({
            id: "route-line",
            type: "line",
            source: "route",
            layout: { "line-join": "round", "line-cap": "round" },
            paint: {
              "line-color": "#c8521a",
              "line-width": 3.5,
              "line-opacity": 0.9,
            },
          });

          // Re-fit bounds to the actual road route
          const routeBounds = new maplibregl.LngLatBounds();
          routeGeometry.coordinates.forEach((coord: [number, number]) =>
            routeBounds.extend(coord)
          );
          m.fitBounds(routeBounds, {
            padding: 60,
            pitch: 50,
            duration: 1200,
          });
        })
        .catch(() => {
          // Fallback: draw straight lines if OSRM fails
          if (!map.current) return;
          const fallbackCoords = waypoints.map((p) => [p.lng, p.lat]);

          m.addSource("route", {
            type: "geojson",
            data: {
              type: "Feature",
              properties: {},
              geometry: {
                type: "LineString",
                coordinates: fallbackCoords,
              },
            },
          });

          m.addLayer({
            id: "route-line-outline",
            type: "line",
            source: "route",
            layout: { "line-join": "round", "line-cap": "round" },
            paint: {
              "line-color": "#1a1208",
              "line-width": 5,
              "line-opacity": 0.3,
              "line-dasharray": [2, 2],
            },
          });

          m.addLayer({
            id: "route-line",
            type: "line",
            source: "route",
            layout: { "line-join": "round", "line-cap": "round" },
            paint: {
              "line-color": "#c8521a",
              "line-width": 3,
              "line-opacity": 0.9,
              "line-dasharray": [2, 2],
            },
          });
        });
    }
  }, [mapLoaded, selectedPackage]);

  // Reset view button handler
  const handleResetView = () => {
    map.current?.flyTo({
      ...INDONESIA_DEFAULT_VIEW,
      duration: 1500,
    });
    if (popupRef.current) {
      popupRef.current.remove();
      popupRef.current = null;
    }
  };

  return (
    <div className={`relative ${className}`}>
      <div ref={mapContainer} className="w-full h-full rounded-[1.2rem] overflow-hidden" />

      {!mapLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-sand rounded-[1.2rem]">
          <div className="text-center">
            <div className="w-8 h-8 border-3 border-ember border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-mist text-sm">{t("loading")}</p>
          </div>
        </div>
      )}

      {mapLoaded && mode === "overview" && (
        <button
          onClick={handleResetView}
          className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-deep text-xs font-medium px-3 py-1.5 rounded-full shadow-sm hover:bg-white transition-colors"
        >
          {t("resetView")}
        </button>
      )}

      {!MAPTILER_KEY && (
        <div className="absolute inset-0 flex items-center justify-center bg-sand rounded-[1.2rem]">
          <p className="text-ember text-sm font-medium">
            MapTiler API key missing. Set NEXT_PUBLIC_MAPTILER_KEY in .env.local
          </p>
        </div>
      )}
    </div>
  );
}

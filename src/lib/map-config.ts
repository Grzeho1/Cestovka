import type { Area } from "./areas";

export interface AreaMapConfig {
  center: [number, number]; // [lng, lat]
  zoom: number;
}

export const AREA_COORDS: Record<Area, AreaMapConfig> = {
  Bali: { center: [115.19, -8.41], zoom: 10 },
  "East Java": { center: [112.75, -7.97], zoom: 9 },
  "West Java": { center: [107.6, -6.91], zoom: 9 },
  Flores: { center: [121.5, -8.65], zoom: 9 },
  Komodo: { center: [119.49, -8.55], zoom: 11 },
  Lombok: { center: [116.35, -8.65], zoom: 10 },
  "Gili Islands": { center: [116.04, -8.35], zoom: 13 },
  "Nusa Penida": { center: [115.54, -8.73], zoom: 12 },
  "Raja Ampat": { center: [130.52, -0.55], zoom: 9 },
  Sulawesi: { center: [121.45, -1.43], zoom: 7 },
  Sumatra: { center: [101.45, -0.95], zoom: 6 },
  Borneo: { center: [116.07, 1.13], zoom: 7 },
  Papua: { center: [138.53, -4.27], zoom: 7 },
};

export const INDONESIA_DEFAULT_VIEW = {
  center: [118.0, -2.5] as [number, number],
  zoom: 4.5,
  pitch: 45,
  bearing: 0,
};

export const TERRAIN_EXAGGERATION = 1.5;

export type MapStyleId = "hybrid" | "satellite" | "outdoor-v2" | "topo-v2";

export function getMapTilerStyleUrl(key: string, style: MapStyleId = "hybrid"): string {
  return `https://api.maptiler.com/maps/${style}/style.json?key=${key}`;
}

export function getTerrainUrl(key: string): string {
  return `https://api.maptiler.com/tiles/terrain-rgb-v2/{z}/{x}/{y}.webp?key=${key}`;
}

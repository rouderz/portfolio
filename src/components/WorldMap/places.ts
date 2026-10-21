import { HALL, HOUSE, TOWER, size } from "@/lib/pixel/sprites";

export const MAP_WIDTH = 240;
export const MAP_HEIGHT = 160;

/** Center of the plaza where the explorer starts. */
export const HUB = { x: 120, y: 82 } as const;

/** Lake in the bottom-right corner (ellipse), where the explorer cannot walk. */
export const LAKE = { x: 210, y: 150, rx: 46, ry: 30 } as const;

export type PlaceKind = "project" | "blog" | "about";

export interface PlaceInput {
  label: string;
  href: string;
  kind: PlaceKind;
}

export interface Place extends PlaceInput {
  /** Ground point (bottom center of the building) in map pixels. */
  x: number;
  y: number;
  w: number;
  h: number;
  /** Alternates the roof color between buildings. */
  variant: number;
  rows: readonly string[];
}

/** Where project buildings can stand, in order. */
const PROJECT_SLOTS = [
  { x: 58, y: 56 },
  { x: 112, y: 42 },
  { x: 172, y: 56 },
  { x: 52, y: 108 },
  { x: 112, y: 120 },
  { x: 172, y: 100 },
] as const;

const BLOG_SLOT = { x: 216, y: 58 } as const;
const ABOUT_SLOT = { x: 24, y: 42 } as const;

export const MAX_PROJECTS_ON_MAP = PROJECT_SLOTS.length;

export function layoutPlaces(inputs: PlaceInput[]): Place[] {
  let projectIndex = 0;
  const places: Place[] = [];
  for (const input of inputs) {
    const rows = input.kind === "blog" ? TOWER : input.kind === "about" ? HALL : HOUSE;
    const slot =
      input.kind === "blog"
        ? BLOG_SLOT
        : input.kind === "about"
          ? ABOUT_SLOT
          : PROJECT_SLOTS[projectIndex];
    if (!slot) continue; // more projects than slots: the rest are only listed under the map
    if (input.kind === "project") projectIndex++;
    places.push({ ...input, ...slot, ...size(rows), variant: projectIndex, rows });
  }
  return places;
}

export function isWater(x: number, y: number): boolean {
  return ((x - LAKE.x) / LAKE.rx) ** 2 + ((y - LAKE.y) / LAKE.ry) ** 2 < 1;
}

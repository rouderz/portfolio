import type { Palette } from "@/lib/pixel/palette";
import { disc, ellipse, mulberry32, rect, sprite, type Ctx } from "@/lib/pixel/draw";
import { HUB, LAKE, MAP_HEIGHT, MAP_WIDTH, isWater, type Place } from "./places";

/** Renders the static terrain, paths, forest and buildings once into an offscreen canvas. */
export function buildMap(p: Palette, places: Place[]): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = MAP_WIDTH;
  canvas.height = MAP_HEIGHT;
  const ctx = canvas.getContext("2d")!;
  const random = mulberry32(11);
  const blocked = new Uint8Array(MAP_WIDTH * MAP_HEIGHT);

  const block = (cx: number, cy: number, r: number) => {
    for (let y = Math.max(0, cy - r); y <= Math.min(MAP_HEIGHT - 1, cy + r); y++) {
      for (let x = Math.max(0, cx - r); x <= Math.min(MAP_WIDTH - 1, cx + r); x++) {
        if ((x - cx) ** 2 + (y - cy) ** 2 <= r * r) blocked[y * MAP_WIDTH + x] = 1;
      }
    }
  };
  const isBlocked = (x: number, y: number) => blocked[y * MAP_WIDTH + x] === 1;

  paintGrass(ctx, p, random);
  paintCliffs(ctx, p, random);
  paintLake(ctx, p, random);
  paintFields(ctx, p);

  // Paths from the plaza to every building door.
  const plaza = (ctx: Ctx) => {
    ellipse(ctx, p.cliffDark, HUB.x, HUB.y, 11, 6);
    ellipse(ctx, p.cliff, HUB.x, HUB.y, 10, 5);
    ellipse(ctx, p.path, HUB.x, HUB.y, 6, 3);
  };
  for (const place of places) {
    const steps = Math.ceil(Math.hypot(place.x - HUB.x, place.y - HUB.y));
    for (let i = 0; i <= steps; i++) {
      const x = Math.round(HUB.x + ((place.x - HUB.x) * i) / steps);
      const y = Math.round(HUB.y + ((place.y + 1 - HUB.y) * i) / steps);
      disc(ctx, p.path, x, y, 1);
      block(x, y, 7);
    }
  }
  plaza(ctx);
  block(HUB.x, HUB.y, 14);
  for (const place of places) block(place.x, place.y - 4, 14);

  // Forest, denser in two zones.
  const dense = (x: number, y: number) =>
    ((x - 40) / 42) ** 2 + ((y - 82) / 36) ** 2 < 1 ||
    ((x - 150) / 44) ** 2 + ((y - 128) / 24) ** 2 < 1;
  const trees: { x: number; y: number; r: number }[] = [];
  for (let attempt = 0; attempt < 900 && trees.length < 150; attempt++) {
    const x = 4 + Math.floor(random() * (MAP_WIDTH - 8));
    const y = 20 + Math.floor(random() * (MAP_HEIGHT - 24));
    if (isBlocked(x, y) || isWater(x, y) || isWater(x + 5, y + 5)) continue;
    if (random() > (dense(x, y) ? 0.9 : 0.1)) continue;
    if (trees.some((t) => (t.x - x) ** 2 + (t.y - y) ** 2 < 36)) continue;
    trees.push({ x, y, r: 4 + Math.floor(random() * 2) });
  }
  trees.sort((a, b) => a.y - b.y);

  // Painter's order: trees and buildings sorted by their ground line.
  type Drawable = { y: number; paint: () => void };
  const drawables: Drawable[] = trees.map((t) => ({
    y: t.y + t.r,
    paint: () => paintTree(ctx, p, t.x, t.y, t.r),
  }));
  for (const place of places) {
    drawables.push({
      y: place.y,
      paint: () => {
        ellipse(ctx, p.grassDark, place.x, place.y, Math.round(place.w / 2) + 1, 2);
        const colors = {
          r: place.variant % 2 === 0 ? p.roofAlt : p.roof,
          s: place.variant % 2 === 0 ? p.cliffDark : p.accent,
          w: p.wall,
          v: p.wallShade,
          d: p.ink,
          k: p.roofAlt,
        };
        sprite(ctx, place.rows, colors, place.x - Math.floor(place.w / 2), place.y - place.h);
      },
    });
  }
  drawables.sort((a, b) => a.y - b.y).forEach((d) => d.paint());

  return canvas;
}

function paintGrass(ctx: Ctx, p: Palette, random: () => number) {
  rect(ctx, p.grass, 0, 0, MAP_WIDTH, MAP_HEIGHT);
  for (let y = 0; y < MAP_HEIGHT; y += 2) {
    for (let x = 0; x < MAP_WIDTH; x += 2) {
      const r = random();
      if (r > 0.82) rect(ctx, p.grassLight, x, y, 2, 2);
      else if (r < 0.14) rect(ctx, p.grassDark, x, y, 2, 2);
    }
  }
  for (let i = 0; i < 40; i++) {
    const x = Math.floor(random() * MAP_WIDTH);
    const y = 20 + Math.floor(random() * (MAP_HEIGHT - 20));
    rect(ctx, p.flower, x, y);
  }
}

function paintCliffs(ctx: Ctx, p: Palette, random: () => number) {
  for (let x = 0; x < MAP_WIDTH; x++) {
    const h = Math.round(11 + Math.sin(x * 0.12) * 3 + Math.sin(x * 0.31) * 2);
    rect(ctx, p.cliff, x, 0, 1, h);
    rect(ctx, p.cliffDark, x, h - 3, 1, 3);
    rect(ctx, p.grassDark, x, h, 1, 2);
    if (random() > 0.8) rect(ctx, p.cloud, x, Math.floor(random() * (h - 4)), 2, 1);
  }
}

function paintLake(ctx: Ctx, p: Palette, random: () => number) {
  for (let y = 0; y < MAP_HEIGHT; y++) {
    for (let x = 0; x < MAP_WIDTH; x++) {
      const d = ((x - LAKE.x) / LAKE.rx) ** 2 + ((y - LAKE.y) / LAKE.ry) ** 2;
      if (d < 1) rect(ctx, d < 0.55 ? p.waterDeep : p.water, x, y);
      else if (d < 1.12) rect(ctx, p.path, x, y);
    }
  }
  for (let i = 0; i < 40; i++) {
    const x = LAKE.x + Math.round((random() - 0.5) * LAKE.rx * 1.6);
    const y = LAKE.y + Math.round((random() - 0.5) * LAKE.ry * 1.6);
    if (isWater(x, y)) rect(ctx, p.waterLight, x, y, 3, 1);
  }
}

function paintFields(ctx: Ctx, p: Palette) {
  const field = (x: number, y: number, w: number, h: number, a: string, b: string) => {
    for (let row = 0; row < h; row += 3)
      rect(ctx, (row / 3) % 2 === 0 ? a : b, x, y + row, w, Math.min(3, h - row));
  };
  field(20, 122, 38, 24, p.field, p.fieldAlt);
  field(78, 138, 30, 16, p.fieldAlt, p.field);
}

function paintTree(ctx: Ctx, p: Palette, x: number, y: number, r: number) {
  rect(ctx, p.grassDark, x - r + 1, y + r - 1, r * 2 - 1, 2);
  rect(ctx, p.trunk, x, y + r - 1, 1, 3);
  disc(ctx, p.forestDark, x + 1, y + 1, r);
  disc(ctx, p.forestMid, x, y, r);
  disc(ctx, p.forestLight, x - 1, y - 1, Math.max(1, r - 2));
}

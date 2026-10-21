import type { Palette } from "@/lib/pixel/palette";
import { clamp, line, mix, mulberry32, rect, sprite, type Ctx } from "@/lib/pixel/draw";
import { CAT } from "@/lib/pixel/sprites";

/** Logical height of the scene in pixels; the width follows the container's aspect ratio. */
export const LOGICAL_HEIGHT = 180;

/** Extra pixels drawn around each layer so parallax shifts never reveal an edge. */
const MARGIN = 32;

/** How strongly each layer reacts to scrolling and to the pointer (0 = far, 1 = near). */
const DEPTH = { clouds: 0.12, hills: 0.25, trees: 0.45, ground: 0.7 } as const;

export interface Scene {
  /** Draws one frame. `pointer` goes from -1 to 1, `scroll` from 0 to 1. */
  draw(timeMs: number, pointer: number, scroll: number): void;
}

function geometry(width: number, height: number) {
  const waterTop = height - 22;
  return {
    waterTop,
    platformTop: waterTop - 10,
    leftEnd: Math.round(width * 0.44),
    rightStart: Math.round(width * 0.66),
  };
}

function makeLayer(width: number, height: number, paint: (ctx: Ctx) => void) {
  const canvas = document.createElement("canvas");
  canvas.width = width + MARGIN * 2;
  canvas.height = height + MARGIN * 2;
  const ctx = canvas.getContext("2d")!;
  ctx.translate(MARGIN, MARGIN);
  paint(ctx);
  return canvas;
}

function paintSky(ctx: Ctx, width: number, height: number, p: Palette) {
  const bands = 14;
  for (let i = 0; i < bands; i++) {
    const t = i / (bands - 1);
    const color =
      t < 0.55 ? mix(p.skyTop, p.skyMid, t / 0.55) : mix(p.skyMid, p.skyBottom, (t - 0.55) / 0.45);
    const y = Math.round((i * height) / bands);
    const next = Math.round(((i + 1) * height) / bands);
    rect(
      ctx,
      color,
      -MARGIN,
      i === 0 ? -MARGIN : y,
      width + MARGIN * 2,
      next - y + (i === 0 ? MARGIN : 0) + (i === bands - 1 ? MARGIN : 0),
    );
  }
  if (p.star === "transparent") return;
  const random = mulberry32(7);
  for (let i = 0; i < Math.round(width / 5); i++) {
    const x = Math.floor(random() * width);
    const y = Math.floor(random() * height * 0.55);
    rect(ctx, p.star, x, y);
    if (random() > 0.85) {
      rect(ctx, p.star, x - 1, y);
      rect(ctx, p.star, x + 1, y);
      rect(ctx, p.star, x, y - 1);
      rect(ctx, p.star, x, y + 1);
    }
  }
}

function paintHills(ctx: Ctx, width: number, height: number, p: Palette, ground: number) {
  for (let x = -MARGIN; x < width + MARGIN; x++) {
    const far = ground - 44 + Math.sin(x * 0.028) * 9 + Math.sin(x * 0.09 + 1) * 4;
    const near = ground - 26 + Math.sin(x * 0.04 + 2) * 7 + Math.sin(x * 0.13) * 3;
    rect(ctx, p.hillFar, x, Math.round(far), 1, height);
    rect(ctx, p.hillNear, x, Math.round(near), 1, height);
  }
}

function paintPine(ctx: Ctx, p: Palette, cx: number, baseY: number, h: number) {
  const trunkH = Math.max(4, Math.round(h * 0.12));
  const top = baseY - h;
  const bottom = baseY - trunkH;
  const tiers = Math.max(3, Math.round(h / 15));
  const maxHalf = Math.round(h * 0.3);
  rect(ctx, p.trunk, cx - 1, bottom, 3, trunkH);
  for (let y = top; y < bottom; y++) {
    const rel = (y - top) / (bottom - top);
    const tier = Math.floor(rel * tiers);
    const within = rel * tiers - tier;
    const half = Math.max(0, Math.floor(((tier + within * 0.9 + 0.35) / tiers) * maxHalf));
    for (let x = -half; x <= half; x++) {
      const side = half === 0 ? 0 : x / half;
      let color = side < -0.3 ? p.leafLight : side > 0.3 ? p.leafDark : p.leafMid;
      if (within > 0.82 || Math.abs(x) === half) color = p.leafDark;
      rect(ctx, color, cx + x, y);
    }
  }
}

function paintTrees(ctx: Ctx, width: number, p: Palette, g: ReturnType<typeof geometry>) {
  const random = mulberry32(21);
  const cluster = (from: number, to: number) => {
    for (let x = from; x < to; x += 15 + random() * 10) {
      paintPine(ctx, p, Math.round(x), g.platformTop + 6, Math.round(48 + random() * 40));
    }
  };
  cluster(-MARGIN + 6, g.leftEnd - 34);
  cluster(g.rightStart + 18, width + MARGIN);
}

function paintGround(ctx: Ctx, width: number, p: Palette, g: ReturnType<typeof geometry>) {
  const random = mulberry32(5);
  const platform = (from: number, to: number) => {
    rect(ctx, p.trunk, from, g.platformTop + 2, to - from, 14);
    rect(ctx, p.grass, from, g.platformTop, to - from, 3);
    rect(ctx, p.grassLight, from, g.platformTop, to - from, 1);
    for (let x = from; x < to; x += 3) {
      rect(
        ctx,
        p.path,
        x + Math.floor(random() * 3),
        g.platformTop + 5 + Math.floor(random() * 6),
        2,
        1,
      );
    }
    for (let x = from; x < to; x += 2) {
      if (random() > 0.45)
        rect(
          ctx,
          p.grassDark,
          x,
          g.platformTop - 1 - Math.floor(random() * 3),
          1,
          2 + Math.floor(random() * 3),
        );
    }
    for (let x = from + 6; x < to - 6; x += 18 + Math.floor(random() * 14)) {
      rect(ctx, p.grassDark, x, g.platformTop - 4, 1, 4);
      rect(ctx, p.flower, x - 1, g.platformTop - 6, 3, 2);
      rect(ctx, p.cloud, x, g.platformTop - 7, 1, 1);
    }
  };
  platform(-MARGIN, g.leftEnd);
  platform(g.rightStart, width + MARGIN);
}

function paintCloud(ctx: Ctx, p: Palette, x: number, y: number, unit: number) {
  const rows = [6, 10, 14, 16];
  rows.forEach((w, i) =>
    rect(ctx, p.cloud, x + ((16 - w) / 2) * unit, y + i * unit, w * unit, unit),
  );
  rect(ctx, p.cloudShade, x + 2 * unit, y + rows.length * unit, 12 * unit, unit);
}

const CLOUDS = [
  { x: 0.1, y: 0.2, unit: 3, speed: 3 },
  { x: 0.55, y: 0.08, unit: 2, speed: 2 },
  { x: 0.8, y: 0.34, unit: 3, speed: 4 },
  { x: 0.32, y: 0.4, unit: 2, speed: 2.5 },
] as const;

export function createScene(
  canvas: HTMLCanvasElement,
  p: Palette,
  width: number,
  height: number,
): Scene {
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d")!;
  const g = geometry(width, height);

  const sky = makeLayer(width, height, (c) => paintSky(c, width, height, p));
  const hills = makeLayer(width, height, (c) => paintHills(c, width, height, p, g.platformTop));
  const trees = makeLayer(width, height, (c) => paintTrees(c, width, p, g));
  const ground = makeLayer(width, height, (c) => paintGround(c, width, p, g));

  const catX = g.leftEnd - 20;
  const catY = g.platformTop - CAT.length + 1;
  const catColors = { k: p.ink, f: p.cloud, a: p.accent };

  return {
    draw(timeMs, pointer, scroll) {
      const shift = (depth: number) => ({
        x: Math.round(-pointer * depth * 6),
        y: Math.round(scroll * (1 - depth) * 28),
      });
      const blit = (layer: HTMLCanvasElement, depth: number) => {
        const s = shift(depth);
        ctx.drawImage(layer, -MARGIN + s.x, -MARGIN + s.y);
      };

      ctx.clearRect(0, 0, width, height);
      blit(sky, 0);

      const cs = shift(DEPTH.clouds);
      const span = width + 90;
      for (const cloud of CLOUDS) {
        const x = ((cloud.x * span + (timeMs / 1000) * cloud.speed) % span) - 45;
        paintCloud(
          ctx,
          p,
          Math.round(x) + cs.x,
          Math.round(cloud.y * height * 0.6) + cs.y,
          cloud.unit,
        );
      }

      blit(hills, DEPTH.hills);
      blit(trees, DEPTH.trees);

      const gs = shift(DEPTH.ground);
      ctx.save();
      ctx.translate(gs.x, gs.y);
      // water
      rect(ctx, p.water, -MARGIN, g.waterTop, width + MARGIN * 2, height - g.waterTop + MARGIN);
      rect(ctx, p.waterDeep, -MARGIN, g.waterTop + 14, width + MARGIN * 2, height);
      for (let i = 0; i < Math.round(width / 6); i++) {
        const row = g.waterTop + 3 + (i % 5) * 3;
        const x =
          (((i * 37) % width) +
            (timeMs / 1000) * (6 + (i % 3) * 3) * (i % 2 ? 1 : -1) +
            width * 4) %
          width;
        rect(ctx, p.waterLight, Math.round(x), row, 4 + (i % 3) * 3, 1);
      }
      ctx.restore();
      blit(ground, DEPTH.ground);

      // cat, rod and bobber
      ctx.save();
      ctx.translate(gs.x, gs.y);
      const breathe = Math.floor(timeMs / 700) % 2;
      sprite(ctx, CAT, catColors, catX, catY + breathe);
      const tipX = catX + 12 + 26;
      const tipY = catY - 14;
      line(ctx, p.ink, catX + 11, catY + 9 + breathe, tipX, tipY);
      const bob = Math.round(Math.sin(timeMs / 450));
      const bobberX = clamp(tipX + 2, g.leftEnd + 4, g.rightStart - 4);
      line(ctx, p.ink, tipX, tipY, bobberX, g.waterTop + 3 + bob);
      rect(ctx, p.accent, bobberX - 1, g.waterTop + 3 + bob, 3, 2);
      rect(ctx, p.cloud, bobberX, g.waterTop + 3 + bob, 1, 1);
      ctx.restore();
    },
  };
}

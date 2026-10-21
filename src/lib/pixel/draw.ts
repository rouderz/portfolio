/** Small helpers to draw crisp pixel art on a low-resolution canvas. */
export type Ctx = CanvasRenderingContext2D;

export function mulberry32(seed: number): () => number {
  let a = seed;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

export function rect(ctx: Ctx, color: string, x: number, y: number, w = 1, h = 1) {
  ctx.fillStyle = color;
  ctx.fillRect(Math.round(x), Math.round(y), w, h);
}

export function disc(ctx: Ctx, color: string, cx: number, cy: number, r: number) {
  for (let dy = -r; dy <= r; dy++) {
    const half = Math.floor(Math.sqrt(r * r - dy * dy + 0.5));
    rect(ctx, color, cx - half, cy + dy, half * 2 + 1, 1);
  }
}

export function ellipse(ctx: Ctx, color: string, cx: number, cy: number, rx: number, ry: number) {
  for (let dy = -ry; dy <= ry; dy++) {
    const half = Math.floor(rx * Math.sqrt(Math.max(0, 1 - (dy * dy) / (ry * ry))) + 0.5);
    rect(ctx, color, cx - half, cy + dy, half * 2 + 1, 1);
  }
}

/** Bresenham line, one pixel wide. */
export function line(ctx: Ctx, color: string, x0: number, y0: number, x1: number, y1: number) {
  let x = Math.round(x0);
  let y = Math.round(y0);
  const dx = Math.abs(Math.round(x1) - x);
  const dy = -Math.abs(Math.round(y1) - y);
  const sx = x < x1 ? 1 : -1;
  const sy = y < y1 ? 1 : -1;
  let err = dx + dy;
  for (;;) {
    rect(ctx, color, x, y);
    if (x === Math.round(x1) && y === Math.round(y1)) return;
    const e2 = 2 * err;
    if (e2 >= dy) {
      err += dy;
      x += sx;
    }
    if (e2 <= dx) {
      err += dx;
      y += sy;
    }
  }
}

/** Draws a sprite described by text rows; "." is transparent. */
export function sprite(
  ctx: Ctx,
  rows: readonly string[],
  colors: Record<string, string>,
  x: number,
  y: number,
  flip = false,
) {
  rows.forEach((row, ry) => {
    for (let rx = 0; rx < row.length; rx++) {
      const color = colors[row.charAt(flip ? row.length - 1 - rx : rx)];
      if (color) rect(ctx, color, x + rx, y + ry);
    }
  });
}

const channels = (hex: string) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));

/** Linear mix of two #rrggbb colors. */
export function mix(a: string, b: string, t: number): string {
  const ca = channels(a);
  const cb = channels(b);
  const out = ca.map((v, i) => Math.round(v + ((cb[i] ?? v) - v) * t));
  return `#${out.map((v) => v.toString(16).padStart(2, "0")).join("")}`;
}

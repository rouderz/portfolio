import { clamp } from "@/lib/pixel/draw";
import { MAP_HEIGHT, MAP_WIDTH, isWater, type Place } from "./places";

export const SPEED = 70; // map pixels per second
export const NEAR_DISTANCE = 16;

export interface Player {
  x: number;
  y: number;
  facingLeft: boolean;
  moving: boolean;
}

export interface Controls {
  /** Keys currently held, as unit directions. */
  dx: number;
  dy: number;
  /** Click-to-walk destination, in map pixels. */
  target: { x: number; y: number } | null;
}

/** Moves the player for `dt` seconds. Mutates `player` and clears `controls.target` on arrival. */
export function step(player: Player, controls: Controls, dt: number) {
  let dx = controls.dx;
  let dy = controls.dy;
  if (dx === 0 && dy === 0 && controls.target) {
    const toX = controls.target.x - player.x;
    const toY = controls.target.y - player.y;
    const distance = Math.hypot(toX, toY);
    if (distance < 1.5) controls.target = null;
    else {
      dx = toX / distance;
      dy = toY / distance;
    }
  } else if (dx !== 0 || dy !== 0) {
    controls.target = null;
  }

  player.moving = dx !== 0 || dy !== 0;
  if (!player.moving) return;
  const length = Math.hypot(dx, dy);
  const move = SPEED * dt;
  const nextX = clamp(player.x + (dx / length) * move, 4, MAP_WIDTH - 4);
  const nextY = clamp(player.y + (dy / length) * move, 20, MAP_HEIGHT - 3);
  if (!isWater(nextX, player.y)) player.x = nextX;
  if (!isWater(player.x, nextY)) player.y = nextY;
  if (dx !== 0) player.facingLeft = dx < 0;
}

export function nearestPlace(player: Player, places: Place[]): Place | null {
  let best: Place | null = null;
  let bestDistance = NEAR_DISTANCE;
  for (const place of places) {
    const distance = Math.hypot(place.x - player.x, place.y - player.y);
    if (distance < bestDistance) {
      best = place;
      bestDistance = distance;
    }
  }
  return best;
}

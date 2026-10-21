"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import { useInView } from "@/hooks/useInView";
import { usePalette } from "@/hooks/usePalette";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { ellipse, rect, sprite } from "@/lib/pixel/draw";
import { EXPLORER } from "@/lib/pixel/sprites";
import { buildMap } from "./map";
import { HUB, MAP_HEIGHT, MAP_WIDTH, layoutPlaces, type PlaceInput } from "./places";
import { nearestPlace, step, type Controls, type Player } from "./player";
import styles from "./WorldMap.module.css";

const KEY_DIRECTIONS: Record<string, [number, number]> = {
  ArrowUp: [0, -1],
  w: [0, -1],
  ArrowDown: [0, 1],
  s: [0, 1],
  ArrowLeft: [-1, 0],
  a: [-1, 0],
  ArrowRight: [1, 0],
  d: [1, 0],
};

const pct = (value: number, total: number) => `${(value / total) * 100}%`;

interface WorldMapProps {
  places: PlaceInput[];
}

/** Pixel-art world map. Every building is a real link; you can also walk to it and press Enter. */
export function WorldMap({ places: inputs }: WorldMapProps) {
  const router = useRouter();
  const places = useMemo(() => layoutPlaces(inputs), [inputs]);

  const wrapper = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const terrain = useRef<HTMLCanvasElement | null>(null);
  const player = useRef<Player>({ x: HUB.x, y: HUB.y + 10, facingLeft: false, moving: false });
  const controls = useRef<Controls>({ dx: 0, dy: 0, target: null });
  const held = useRef(new Set<string>());
  const nearId = useRef<string | null>(null);
  const [nearLabel, setNearLabel] = useState<string | null>(null);

  const palette = usePalette();
  const reducedMotion = useReducedMotion();
  const visible = useInView(wrapper);

  // The animation loop only runs while the map is on screen. With reduced motion it only
  // runs while the explorer is walking.
  const [walking, setWalking] = useState(false);
  const run = visible && (!reducedMotion || walking);

  useEffect(() => {
    if (!palette) return;
    terrain.current = buildMap(palette, places);
    drawFrame(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [palette, places]);

  useEffect(() => {
    if (!run) return;
    let frame = 0;
    let previous = performance.now();
    const tick = (time: number) => {
      frame = requestAnimationFrame(tick);
      // Fixed sub-steps keep the walking speed correct even if frames are dropped.
      let remaining = Math.min(0.5, (time - previous) / 1000);
      previous = time;
      while (remaining > 0) {
        step(player.current, controls.current, Math.min(1 / 60, remaining));
        remaining -= 1 / 60;
      }
      if (reducedMotion && !player.current.moving) setWalking(false);
      const near = nearestPlace(player.current, places);
      if ((near?.href ?? null) !== nearId.current) {
        nearId.current = near?.href ?? null;
        setNearLabel(near?.label ?? null);
      }
      drawFrame(time);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [run, places, reducedMotion]);

  function drawFrame(time: number) {
    const target = canvas.current;
    const base = terrain.current;
    if (!target || !base || !palette) return;
    target.width = MAP_WIDTH;
    target.height = MAP_HEIGHT;
    const ctx = target.getContext("2d")!;
    ctx.drawImage(base, 0, 0);

    // airships drifting over the land
    if (!reducedMotion) {
      const seconds = time / 1000;
      for (const ship of [
        { y: 30, speed: 5, offset: 0 },
        { y: 92, speed: -3, offset: 120 },
      ]) {
        const x =
          ((((ship.offset + seconds * ship.speed) % (MAP_WIDTH + 40)) + MAP_WIDTH + 40) %
            (MAP_WIDTH + 40)) -
          20;
        ellipse(ctx, palette.grassDark, Math.round(x) + 3, ship.y + 26, 8, 2);
        ellipse(ctx, palette.cloudShade, Math.round(x), ship.y, 9, 4);
        ellipse(ctx, palette.cloud, Math.round(x), ship.y - 1, 8, 3);
        rect(ctx, palette.ink, Math.round(x) - 2, ship.y + 5, 5, 2);
        rect(ctx, palette.accent, Math.round(x) + (ship.speed > 0 ? -10 : 9), ship.y - 1, 2, 3);
      }
    }

    const me = player.current;
    const bob = me.moving ? Math.floor(performance.now() / 140) % 2 : 0;
    ellipse(ctx, palette.grassDark, Math.round(me.x), Math.round(me.y), 4, 1);
    sprite(
      ctx,
      EXPLORER,
      { k: palette.ink, f: palette.cloud, a: palette.accent },
      Math.round(me.x) - 4,
      Math.round(me.y) - EXPLORER.length - bob + 1,
      me.facingLeft,
    );
  }

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const key = event.key.length === 1 ? event.key.toLowerCase() : event.key;
    if ((key === "Enter" || key === "e") && nearId.current) {
      event.preventDefault();
      router.push(nearId.current);
      return;
    }
    if (!(key in KEY_DIRECTIONS)) return;
    event.preventDefault();
    held.current.add(key);
    updateDirection();
    setWalking(true);
  }

  function onKeyUp(event: KeyboardEvent<HTMLDivElement>) {
    held.current.delete(event.key.length === 1 ? event.key.toLowerCase() : event.key);
    updateDirection();
  }

  function updateDirection() {
    let dx = 0;
    let dy = 0;
    for (const key of held.current) {
      const direction = KEY_DIRECTIONS[key];
      if (direction) {
        dx += direction[0];
        dy += direction[1];
      }
    }
    controls.current.dx = Math.sign(dx);
    controls.current.dy = Math.sign(dy);
  }

  function onPointerDown(event: PointerEvent<HTMLDivElement>) {
    if ((event.target as HTMLElement).closest("a")) return; // buildings navigate by themselves
    const box = event.currentTarget.getBoundingClientRect();
    controls.current.target = {
      x: ((event.clientX - box.left) / box.width) * MAP_WIDTH,
      y: ((event.clientY - box.top) / box.height) * MAP_HEIGHT,
    };
    setWalking(true);
  }

  return (
    <div className={styles.root}>
      <div
        ref={wrapper}
        className={styles.map}
        tabIndex={0}
        role="group"
        aria-label="Interactive map of projects. Use the arrow keys or WASD to walk and Enter to visit a place, or just follow the links."
        onKeyDown={onKeyDown}
        onKeyUp={onKeyUp}
        onBlur={() => {
          held.current.clear();
          updateDirection();
        }}
        onPointerDown={onPointerDown}
      >
        <canvas ref={canvas} className={styles.canvas} aria-hidden="true" />
        {places.map((place) => (
          <Link
            key={place.href}
            href={place.href}
            className={`${styles.place} ${nearLabel === place.label ? styles.near : ""}`}
            style={{
              left: pct(place.x - place.w / 2 - 4, MAP_WIDTH),
              top: pct(place.y - place.h - 4, MAP_HEIGHT),
              width: pct(place.w + 8, MAP_WIDTH),
              height: pct(place.h + 8, MAP_HEIGHT),
            }}
          >
            <span className={styles.label}>{place.label}</span>
          </Link>
        ))}
      </div>
      <p className={styles.hint} aria-live="polite">
        {nearLabel ? (
          <>
            <kbd>Enter</kbd> to visit <strong>{nearLabel}</strong>
          </>
        ) : (
          <>
            <kbd>←</kbd> <kbd>↑</kbd> <kbd>↓</kbd> <kbd>→</kbd> or <kbd>WASD</kbd> to walk · click
            the map to go there
          </>
        )}
      </p>
    </div>
  );
}

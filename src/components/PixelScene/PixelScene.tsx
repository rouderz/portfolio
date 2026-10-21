"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "@/hooks/useInView";
import { usePalette } from "@/hooks/usePalette";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { clamp } from "@/lib/pixel/draw";
import { createScene, LOGICAL_HEIGHT, type Scene } from "./scene";
import styles from "./PixelScene.module.css";

/** Decorative pixel-art landscape with parallax. It fills its positioned parent. */
export function PixelScene() {
  const wrapper = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const scene = useRef<Scene | null>(null);
  const input = useRef({ pointer: 0, scroll: 0 });
  const [width, setWidth] = useState<number | null>(null);

  const palette = usePalette();
  const reducedMotion = useReducedMotion();
  const visible = useInView(wrapper);

  // The logical width follows the container's aspect ratio, so pixels stay square.
  useEffect(() => {
    const element = wrapper.current;
    if (!element) return;
    const observer = new ResizeObserver(([entry]) => {
      const box = entry?.contentRect;
      if (box && box.width > 0 && box.height > 0) {
        setWidth(Math.ceil((LOGICAL_HEIGHT * box.width) / box.height));
      }
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  // Rebuild the layers when the size or the theme changes.
  useEffect(() => {
    if (!palette || !width || !canvas.current) return;
    scene.current = createScene(canvas.current, palette, width, LOGICAL_HEIGHT);
    scene.current.draw(performance.now(), input.current.pointer, input.current.scroll);
  }, [palette, width]);

  // Animate only while visible, and not at all with reduced motion.
  useEffect(() => {
    if (!visible || reducedMotion) return;
    let frame = 0;
    let last = 0;
    const tick = (time: number) => {
      frame = requestAnimationFrame(tick);
      if (time - last < 33) return;
      last = time;
      scene.current?.draw(time, input.current.pointer, input.current.scroll);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [visible, reducedMotion]);

  // Parallax inputs: pointer position and scroll progress.
  useEffect(() => {
    if (reducedMotion) return;
    const onPointer = (event: PointerEvent) => {
      input.current.pointer = (event.clientX / window.innerWidth) * 2 - 1;
    };
    const onScroll = () => {
      const box = wrapper.current?.getBoundingClientRect();
      if (box) input.current.scroll = clamp(-box.top / box.height, 0, 1);
    };
    window.addEventListener("pointermove", onPointer, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("scroll", onScroll);
    };
  }, [reducedMotion]);

  return (
    <div ref={wrapper} className={styles.wrapper} aria-hidden="true">
      <canvas ref={canvas} className={styles.canvas} />
    </div>
  );
}

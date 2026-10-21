import { useMemo, useSyncExternalStore } from "react";
import { readPalette, type Palette } from "@/lib/pixel/palette";

function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  return () => observer.disconnect();
}

/** Palette of the current theme, or null until the page is hydrated. Updates when the theme changes. */
export function usePalette(): Palette | null {
  const theme = useSyncExternalStore(
    subscribe,
    () => document.documentElement.dataset.theme ?? "light",
    () => null,
  );
  return useMemo(() => (theme ? readPalette() : null), [theme]);
}

/** Colors of the pixel-art scenes. Values live in globals.css (--px-*) so they follow the theme. */
const KEYS = [
  "skyTop",
  "skyMid",
  "skyBottom",
  "cloud",
  "cloudShade",
  "star",
  "hillFar",
  "hillNear",
  "leafDark",
  "leafMid",
  "leafLight",
  "trunk",
  "forestDark",
  "forestMid",
  "forestLight",
  "water",
  "waterLight",
  "waterDeep",
  "grass",
  "grassDark",
  "grassLight",
  "path",
  "roof",
  "roofAlt",
  "wall",
  "wallShade",
  "cliff",
  "cliffDark",
  "flower",
  "field",
  "fieldAlt",
  "ink",
  "accent",
] as const;

export type Palette = Record<(typeof KEYS)[number], string>;

const toKebab = (key: string) => key.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`);

export function readPalette(): Palette {
  const styles = getComputedStyle(document.documentElement);
  const entries = KEYS.map((key) => [key, styles.getPropertyValue(`--px-${toKebab(key)}`).trim()]);
  return Object.fromEntries(entries) as Palette;
}

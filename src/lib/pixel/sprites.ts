/** Sprites as text rows. See draw.ts `sprite` for the legend mechanism. */

/** The little cat that fishes in the hero. k = ink, f = fur, a = accent. */
export const CAT = [
  "..kk....kk..",
  ".kffk..kffk.",
  ".kffkkkkffk.",
  ".kffffffffk.",
  "kffkffffkffk",
  "kffffffffffk",
  ".kfffkkfffk.",
  "..kkkkkkkk..",
  ".kaaaaaaaak.",
  "kaaaaaaaaaak",
  "kaaaaaaaaaak",
  ".kaaaaaaaak.",
  "..kkkkkkkk..",
] as const;

/** The explorer who walks the world map. */
export const EXPLORER = [
  "..kkkk..",
  ".kffffk.",
  ".kfkkfk.",
  ".kffffk.",
  "..kkkk..",
  ".kaaaak.",
  "kaaaaaak",
  "kaaaaaak",
  ".kkkkkk.",
  ".k....k.",
] as const;

/** Buildings. r = roof, s = roof shade, w = wall, v = wall shade, d = door, k = window. */
export const HOUSE = [
  "....rrrrrr....",
  "..rrrrrrrrrr..",
  ".rrrrrrrrrrrr.",
  "rrsrrrsrrrsrrr",
  "ssssssssssssss",
  ".wwwwwwwwwwww.",
  ".wwwwwddwwwww.",
  ".wvwwwddwwvww.",
  ".vvvvvvvvvvvv.",
] as const;

export const TOWER = [
  "....rr....",
  "...rrrr...",
  "..rrrrrr..",
  ".rrrrrrrr.",
  "rrrrrrrrrr",
  ".wwwwwwww.",
  ".wwkkwwww.",
  ".wwkkwwww.",
  ".wvwwwwvw.",
  ".wwwwwwww.",
  ".wwwddwww.",
  ".wwwddwww.",
  ".vvvvvvvv.",
] as const;

export const HALL = [
  "....rrrrrrrrrrrr....",
  "..rrrrrrrrrrrrrrrr..",
  ".rrrrsrrrrrrrrsrrrr.",
  "rrrrrrrrrrrrrrrrrrrr",
  "ssssssssssssssssssss",
  ".wwwwwwwwwwwwwwwwww.",
  ".wkkwwwwddwwwwkkwww.",
  ".wkkwwwwddwwwwkkwww.",
  ".wvwwwwwddwwwwwwvww.",
  ".vvvvvvvvvvvvvvvvvv.",
] as const;

export const size = (rows: readonly string[]) => ({ w: rows[0]?.length ?? 0, h: rows.length });

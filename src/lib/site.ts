/** General site data. Edit this file to customise the site. */
export const site = {
  title: "Portfolio",
  author: "Wolfgang Welcomez",
  description: "Projects and articles by Wolfgang Welcomez and team.",
  github: "https://github.com/rouderz",
  email: "wolfgangwilfredo@gmail.com",
  url: process.env.SITE_URL ?? "https://rouderz.github.io",
  basePath: process.env.BASE_PATH ?? "",
} as const;

export const nav = [
  { href: "/projects/", label: "Projects" },
  { href: "/blog/", label: "Blog" },
  { href: "/about/", label: "About us" },
] as const;

/** Absolute public URL of an internal path (for canonical, RSS and sitemap). */
export function absoluteUrl(path: string): string {
  return `${site.url}${site.basePath}${path}`;
}

/** Path of a file in /public, including the basePath if any. */
export function asset(path: string): string {
  return `${site.basePath}${path}`;
}

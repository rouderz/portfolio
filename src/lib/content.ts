import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

export type Kind = "projects" | "blog";

export interface Link {
  label: string;
  href: string;
}

export interface Entry {
  kind: Kind;
  slug: string;
  title: string;
  description: string;
  date: Date;
  tags: string[];
  draft: boolean;
  body: string;
  // Solo proyectos
  cover?: string;
  coverAlt: string;
  featured: boolean;
  authors: string[];
  links: Link[];
}

const CONTENT_DIR = path.join(process.cwd(), "content");

function required(value: unknown, field: string, file: string): string {
  if (typeof value !== "string" || value.trim() === "") {
    throw new Error(`Missing field "${field}" in ${file}`);
  }
  return value;
}

function readEntry(kind: Kind, file: string): Entry {
  const { data, content } = matter(fs.readFileSync(path.join(CONTENT_DIR, kind, file), "utf8"));
  const date = new Date(data.date);
  if (Number.isNaN(date.getTime())) throw new Error(`Invalid date in ${kind}/${file}`);

  return {
    kind,
    slug: file.replace(/\.mdx?$/, ""),
    title: required(data.title, "title", file),
    description: required(data.description, "description", file),
    date,
    tags: data.tags ?? [],
    draft: data.draft ?? false,
    body: content,
    cover: data.cover,
    coverAlt: data.coverAlt ?? "",
    featured: data.featured ?? false,
    authors: data.authors ?? [],
    links: data.links ?? [],
  };
}

function readAll(kind: Kind): Entry[] {
  return fs
    .readdirSync(path.join(CONTENT_DIR, kind))
    .filter((file) => /\.mdx?$/.test(file))
    .map((file) => readEntry(kind, file))
    .filter((entry) => !entry.draft)
    .sort((a, b) => b.date.getTime() - a.date.getTime());
}

export const getProjects = () => readAll("projects");
export const getPosts = () => readAll("blog");

export function getAllTags(entries: Entry[]): string[] {
  return [...new Set(entries.flatMap((entry) => entry.tags))].sort((a, b) => a.localeCompare(b));
}

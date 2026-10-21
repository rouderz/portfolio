import type { Entry } from "@/lib/content";
import type { ProjectSummary } from "@/components/ProjectCard/ProjectCard";

/** Minimal data a card needs (without the MDX body). */
export function toSummary(entry: Entry): ProjectSummary {
  return {
    slug: entry.slug,
    title: entry.title,
    description: entry.description,
    tags: entry.tags,
    cover: entry.cover,
    coverAlt: entry.coverAlt,
  };
}

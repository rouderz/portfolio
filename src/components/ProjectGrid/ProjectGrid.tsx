"use client";

import { useState } from "react";
import { ProjectCard, type ProjectSummary } from "@/components/ProjectCard/ProjectCard";
import { TagFilter } from "@/components/TagFilter/TagFilter";
import styles from "./ProjectGrid.module.css";

interface ProjectGridProps {
  projects: ProjectSummary[];
  tags: string[];
}

/** Listado de proyectos con filtro por etiqueta. */
export function ProjectGrid({ projects, tags }: ProjectGridProps) {
  const [selected, setSelected] = useState<string | null>(null);
  const visible = selected ? projects.filter((p) => p.tags.includes(selected)) : projects;

  return (
    <>
      <TagFilter tags={tags} selected={selected} onSelect={setSelected} />
      <p className={styles.status} role="status">
        Showing {visible.length} project(s)
      </p>
      <ul className={styles.grid}>
        {visible.map((project) => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </ul>
    </>
  );
}

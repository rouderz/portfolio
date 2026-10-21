import type { Metadata } from "next";
import { getAllTags, getProjects } from "@/lib/content";
import { toSummary } from "@/lib/summary";
import { ProjectGrid } from "@/components/ProjectGrid/ProjectGrid";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Projects",
  description: "All of the team's projects.",
};

export default function ProjectsPage() {
  const projects = getProjects();

  return (
    <section className={styles.section}>
      <h1>Projects</h1>
      <ProjectGrid projects={projects.map(toSummary)} tags={getAllTags(projects)} />
    </section>
  );
}

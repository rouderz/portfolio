import Link from "next/link";
import { asset } from "@/lib/site";
import styles from "./ProjectCard.module.css";

export interface ProjectSummary {
  slug: string;
  title: string;
  description: string;
  tags: string[];
  cover?: string;
  coverAlt: string;
}

export function ProjectCard({ project }: { project: ProjectSummary }) {
  return (
    <li className={styles.card}>
      {project.cover ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          className={styles.media}
          src={asset(project.cover)}
          alt={project.coverAlt}
          loading="lazy"
        />
      ) : (
        <div className={`${styles.media} ${styles.placeholder}`} aria-hidden="true">
          {project.title.slice(0, 1)}
        </div>
      )}
      <div className={styles.body}>
        <h3 className={styles.title}>
          <Link href={`/projects/${project.slug}/`} className={styles.link}>
            {project.title}
          </Link>
        </h3>
        <p className={styles.description}>{project.description}</p>
        <ul className={styles.tags}>
          {project.tags.map((tag) => (
            <li key={tag} className={styles.tag}>
              {tag}
            </li>
          ))}
        </ul>
      </div>
    </li>
  );
}

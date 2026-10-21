import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProjects } from "@/lib/content";
import { asset } from "@/lib/site";
import { formatDate } from "@/lib/format";
import { Prose } from "@/components/Prose/Prose";
import styles from "./page.module.css";

export const dynamicParams = false;

export function generateStaticParams() {
  return getProjects().map((project) => ({ slug: project.slug }));
}

async function findProject(props: PageProps<"/projects/[slug]">) {
  const { slug } = await props.params;
  const project = getProjects().find((p) => p.slug === slug);
  if (!project) notFound();
  return project;
}

export async function generateMetadata(props: PageProps<"/projects/[slug]">): Promise<Metadata> {
  const project = await findProject(props);
  return { title: project.title, description: project.description, openGraph: { type: "article" } };
}

export default async function ProjectPage(props: PageProps<"/projects/[slug]">) {
  const project = await findProject(props);

  return (
    <article className={styles.article}>
      <p>
        <Link href="/projects/">← All projects</Link>
      </p>
      <h1>{project.title}</h1>
      <p className={styles.meta}>
        <time dateTime={project.date.toISOString()}>{formatDate(project.date)}</time>
        {project.authors.length > 0 && <> · {project.authors.join(", ")}</>}
      </p>
      <ul className={styles.tags}>
        {project.tags.map((tag) => (
          <li key={tag} className={styles.tag}>
            {tag}
          </li>
        ))}
      </ul>
      {project.cover && (
        // eslint-disable-next-line @next/next/no-img-element
        <img className={styles.cover} src={asset(project.cover)} alt={project.coverAlt} />
      )}
      <Prose source={project.body} />
      {project.links.length > 0 && (
        <p className={styles.links}>
          {project.links.map((link) => (
            <a key={link.href} className={styles.button} href={link.href} rel="noopener">
              {link.label} ↗
            </a>
          ))}
        </p>
      )}
    </article>
  );
}

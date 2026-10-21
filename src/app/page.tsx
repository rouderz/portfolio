import Link from "next/link";
import { site } from "@/lib/site";
import { getPosts, getProjects } from "@/lib/content";
import { toSummary } from "@/lib/summary";
import { formatDate } from "@/lib/format";
import { ProjectCard } from "@/components/ProjectCard/ProjectCard";
import styles from "./page.module.css";

export default function HomePage() {
  const featured = getProjects()
    .filter((project) => project.featured)
    .slice(0, 3);
  const posts = getPosts().slice(0, 3);

  return (
    <>
      <section className={styles.hero}>
        <p className={styles.muted}>Hi, we are {site.author} and team 👋</p>
        <h1>Things we build, and what we learn building them.</h1>
        <p className={`${styles.muted} ${styles.lead}`}>{site.description}</p>
        <p className={styles.actions}>
          <Link className={styles.button} href="/projects/">
            View projects
          </Link>
          <Link className={`${styles.button} ${styles.secondary}`} href="/about/">
            About us
          </Link>
        </p>
      </section>

      <section className={styles.section} aria-labelledby="featured">
        <h2 id="featured">Featured projects</h2>
        <ul className={styles.grid}>
          {featured.map((project) => (
            <ProjectCard key={project.slug} project={toSummary(project)} />
          ))}
        </ul>
      </section>

      {posts.length > 0 && (
        <section className={styles.section} aria-labelledby="latest">
          <h2 id="latest">Latest posts</h2>
          <ul className={styles.posts}>
            {posts.map((post) => (
              <li key={post.slug}>
                <Link href={`/blog/${post.slug}/`}>{post.title}</Link>
                <time className={styles.muted} dateTime={post.date.toISOString()}>
                  {formatDate(post.date)}
                </time>
              </li>
            ))}
          </ul>
        </section>
      )}
    </>
  );
}

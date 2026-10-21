import Link from "next/link";
import { site } from "@/lib/site";
import { getAllTags, getPosts, getProjects } from "@/lib/content";
import { formatDate } from "@/lib/format";
import { MAX_PROJECTS_ON_MAP, type PlaceInput } from "@/components/WorldMap/places";
import { PixelScene } from "@/components/PixelScene/PixelScene";
import { WorldMap } from "@/components/WorldMap/WorldMap";
import styles from "./page.module.css";

export default function HomePage() {
  const projects = getProjects();
  const posts = getPosts();

  const places: PlaceInput[] = [
    ...projects.map((project) => ({
      label: project.title,
      href: `/projects/${project.slug}/`,
      kind: "project" as const,
    })),
    { label: "Blog", href: "/blog/", kind: "blog" },
    { label: "About us", href: "/about/", kind: "about" },
  ];
  const hiddenProjects = Math.max(0, projects.length - MAX_PROJECTS_ON_MAP);

  const stats = [
    { value: projects.length, label: "Projects" },
    { value: posts.length, label: "Posts" },
    { value: getAllTags(projects).length, label: "Skills" },
  ];

  return (
    <>
      <section className={styles.hero} aria-labelledby="hero-title">
        <PixelScene />
        <div className={styles.heroContent}>
          <p className={styles.kicker}>Hi, we are {site.author} and team</p>
          <h1 id="hero-title" className={styles.title}>
            Things we build, and what we learn building them.
          </h1>
          <p className={styles.lead}>{site.description}</p>
          <dl className={styles.stats}>
            {stats.map((stat) => (
              <div key={stat.label} className={styles.stat}>
                <dd className={styles.statValue}>{stat.value}</dd>
                <dt className={styles.statLabel}>{stat.label}</dt>
              </div>
            ))}
          </dl>
          <p className={styles.actions}>
            <a className={styles.button} href="#world">
              Explore the world
            </a>
            <Link className={`${styles.button} ${styles.secondary}`} href="/projects/">
              All projects
            </Link>
          </p>
        </div>
      </section>

      <section id="world" className={styles.section} aria-labelledby="world-title">
        <h2 id="world-title">World map</h2>
        <p className={styles.intro}>
          Every building is a project. Walk there, or just click it.
          {hiddenProjects > 0 && (
            <>
              {" "}
              <Link href="/projects/">{hiddenProjects} more project(s) are in the full list.</Link>
            </>
          )}
        </p>
        <WorldMap places={places} />
      </section>

      {posts.length > 0 && (
        <section className={styles.section} aria-labelledby="latest">
          <h2 id="latest">Quest log</h2>
          <ul className={styles.posts}>
            {posts.slice(0, 3).map((post) => (
              <li key={post.slug} className={styles.post}>
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

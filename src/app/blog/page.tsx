import type { Metadata } from "next";
import Link from "next/link";
import { getPosts } from "@/lib/content";
import { formatDate } from "@/lib/format";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Blog",
  description: "Articles and notes from the team.",
};

export default function BlogPage() {
  return (
    <section className={styles.section}>
      <h1>Blog</h1>
      <ul className={styles.list}>
        {getPosts().map((post) => (
          <li key={post.slug}>
            <h2 className={styles.title}>
              <Link href={`/blog/${post.slug}/`}>{post.title}</Link>
            </h2>
            <time className={styles.date} dateTime={post.date.toISOString()}>
              {formatDate(post.date)}
            </time>
            <p className={styles.description}>{post.description}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

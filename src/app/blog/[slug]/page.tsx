import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPosts } from "@/lib/content";
import { formatDate } from "@/lib/format";
import { Prose } from "@/components/Prose/Prose";
import styles from "./page.module.css";

export const dynamicParams = false;

export function generateStaticParams() {
  return getPosts().map((post) => ({ slug: post.slug }));
}

async function findPost(props: PageProps<"/blog/[slug]">) {
  const { slug } = await props.params;
  const post = getPosts().find((p) => p.slug === slug);
  if (!post) notFound();
  return post;
}

export async function generateMetadata(props: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const post = await findPost(props);
  return { title: post.title, description: post.description, openGraph: { type: "article" } };
}

export default async function PostPage(props: PageProps<"/blog/[slug]">) {
  const post = await findPost(props);

  return (
    <article className={styles.article}>
      <p>
        <Link href="/blog/">← Blog</Link>
      </p>
      <h1>{post.title}</h1>
      <p className={styles.meta}>
        <time dateTime={post.date.toISOString()}>{formatDate(post.date)}</time>
        {post.authors.length > 0 && <> · {post.authors.join(", ")}</>}
      </p>
      <Prose source={post.body} />
    </article>
  );
}

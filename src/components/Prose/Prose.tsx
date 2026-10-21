import { MDXRemote } from "next-mdx-remote/rsc";
import { Callout } from "@/components/Callout/Callout";
import styles from "./Prose.module.css";

/** Renders the MDX body of a project or post. */
export function Prose({ source }: { source: string }) {
  return (
    <div className={styles.prose}>
      <MDXRemote source={source} components={{ Callout }} />
    </div>
  );
}

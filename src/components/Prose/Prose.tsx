import { MDXRemote } from "next-mdx-remote/rsc";
import { Callout } from "@/components/Callout/Callout";
import { Screenshots } from "@/components/Screenshots/Screenshots";
import styles from "./Prose.module.css";

/** Renders the MDX body of a project or post. */
export function Prose({ source }: { source: string }) {
  return (
    <div className={styles.prose}>
      {/* blockJS is off so .mdx files can pass arrays to components; the content is ours. */}
      <MDXRemote
        source={source}
        components={{ Callout, Screenshots }}
        options={{ blockJS: false }}
      />
    </div>
  );
}

import type { ReactNode } from "react";
import styles from "./Callout.module.css";

interface CalloutProps {
  title?: string;
  children: ReactNode;
}

/** Highlighted notice, available inside .mdx files. */
export function Callout({ title = "Note", children }: CalloutProps) {
  return (
    <aside className={styles.callout}>
      <strong>{title}</strong>
      {children}
    </aside>
  );
}

import { asset } from "@/lib/site";
import styles from "./Screenshots.module.css";

interface Shot {
  /** File inside public/, e.g. "/images/my-app/home.webp". */
  src: string;
  alt: string;
  caption?: string;
  /** Intrinsic size, to avoid layout shift. Defaults to a phone screenshot. */
  width?: number;
  height?: number;
}

interface ScreenshotsProps {
  title?: string;
  items: Shot[];
  /** "phone" for tall screenshots in a row, "wide" for desktop or notch UI. */
  layout?: "phone" | "wide";
}

/** A row of phone screenshots with captions. Available inside .mdx files. */
export function Screenshots({ title, items, layout = "phone" }: ScreenshotsProps) {
  return (
    <figure className={styles.figure}>
      {title && <figcaption className={styles.title}>{title}</figcaption>}
      <ul className={`${styles.list} ${layout === "wide" ? styles.wide : ""}`}>
        {items.map((item) => (
          <li key={item.src} className={styles.item}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className={styles.image}
              src={asset(item.src)}
              alt={item.alt}
              width={item.width ?? 640}
              height={item.height ?? 1391}
              loading="lazy"
            />
            {item.caption && <span className={styles.caption}>{item.caption}</span>}
          </li>
        ))}
      </ul>
    </figure>
  );
}

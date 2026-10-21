import { site } from "@/lib/site";
import styles from "./Footer.module.css";

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.row}>
        <p>
          © {new Date().getFullYear()} {site.author}
        </p>
        <ul className={styles.list}>
          <li>
            <a href={site.github}>GitHub</a>
          </li>
          <li>
            <a href={`${site.basePath}/rss.xml`}>RSS</a>
          </li>
          <li>
            <a href={`mailto:${site.email}`}>Contact</a>
          </li>
        </ul>
      </div>
    </footer>
  );
}

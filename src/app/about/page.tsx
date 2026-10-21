import type { Metadata } from "next";
import { site } from "@/lib/site";
import { team } from "@/lib/team";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "About us",
  description: "Who we are.",
};

export default function AboutPage() {
  return (
    <section className={styles.section}>
      <h1>About us</h1>
      <p>
        Write an introduction to the team here: what you do, what drives you and how to get in
        touch.
      </p>
      <h2>Team</h2>
      <ul>
        {team.map((member) => (
          <li key={member.name}>
            <a href={member.url}>{member.name}</a> — {member.role}
          </li>
        ))}
      </ul>
      <p>
        Contact: <a href={`mailto:${site.email}`}>{site.email}</a>
      </p>
    </section>
  );
}

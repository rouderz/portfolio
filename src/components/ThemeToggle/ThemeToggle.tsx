"use client";

import styles from "./ThemeToggle.module.css";

export function ThemeToggle() {
  function toggle() {
    const root = document.documentElement;
    const next = root.dataset.theme === "dark" ? "light" : "dark";
    root.dataset.theme = next;
    try {
      localStorage.setItem("theme", next);
    } catch {
      // storage blocked: the change only lasts for this visit
    }
  }

  return (
    <button
      type="button"
      className={styles.button}
      onClick={toggle}
      aria-label="Toggle between light and dark mode"
    >
      <span aria-hidden="true">◐</span>
    </button>
  );
}

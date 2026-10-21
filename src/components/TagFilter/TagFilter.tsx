import styles from "./TagFilter.module.css";

interface TagFilterProps {
  tags: string[];
  selected: string | null;
  onSelect: (tag: string | null) => void;
}

export function TagFilter({ tags, selected, onSelect }: TagFilterProps) {
  return (
    <div className={styles.filter} role="group" aria-label="Filter by tag">
      {[null, ...tags].map((tag) => (
        <button
          key={tag ?? "all"}
          type="button"
          className={styles.button}
          aria-pressed={selected === tag}
          onClick={() => onSelect(tag)}
        >
          {tag ?? "All"}
        </button>
      ))}
    </div>
  );
}

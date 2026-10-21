import { useEffect, useState, type RefObject } from "react";

/** True while the element is on screen, so animations can pause when it is not. */
export function useInView(ref: RefObject<Element | null>): boolean {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const observer = new IntersectionObserver(([entry]) =>
      setVisible(entry?.isIntersecting ?? false),
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [ref]);

  return visible;
}

import { useEffect, useRef, useState } from "react";

export default function useInView(options = {}) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.25, ...options }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [options.threshold, options.root, options.rootMargin]);

  return [ref, inView];
}

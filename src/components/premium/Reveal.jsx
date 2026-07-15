// Fait apparaître son contenu en fondu + léger glissement quand il
// entre à l'écran. Zéro dépendance : on utilise IntersectionObserver
// (natif au navigateur) + une transition CSS.
import { useEffect, useRef, useState } from "react";

export default function Reveal({ children, delay = 0 }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect(); // on n'anime qu'une fois
        }
      },
      { threshold: 0.15, rootMargin: "-40px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`reveal ${visible ? "reveal--visible" : ""}`}
      style={{ transitionDelay: `${delay}s` }}
    >
      {children}
    </div>
  );
}

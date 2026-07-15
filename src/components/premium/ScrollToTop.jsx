// Remet la page tout en haut à chaque changement de page (route)...
// SAUF si l'URL contient une ancre (#a-partager) : dans ce cas,
// c'est la page qui gère le défilement vers la bonne section.
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (!hash) window.scrollTo(0, 0);
  }, [pathname, hash]);
  return null;
}

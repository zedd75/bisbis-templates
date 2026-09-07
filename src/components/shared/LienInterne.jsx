// Lien interne qui conserve l'identité du restaurant dans l'URL.
// Toute la logique est dans utils/lienClient.js, testée à part.
import { Link, useLocation } from "react-router-dom";
import { avecClient } from "../../utils/lienClient.js";

export default function LienInterne({ to, children, ...reste }) {
  const { search } = useLocation();
  return (
    <Link to={avecClient(to, search)} {...reste}>
      {children}
    </Link>
  );
}

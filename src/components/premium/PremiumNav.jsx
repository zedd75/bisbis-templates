// Barre de navigation Premium.
// - transparente par-dessus le hero de l'accueil, opaque ailleurs
//   ou après défilement
// - "La carte" est un menu déroulant (au survol) qui liste les
//   sections de la carte ; un clic amène directement à la section
// - bouton Réserver (externe) + bascule de langue FR / EN
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import slugify from "../../utils/slugify.js";

export default function PremiumNav({ config, t, lang, setLang }) {
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Opaque si on a défilé, OU si on n'est pas sur l'accueil (pas de hero).
  const solide = scrolled || pathname !== "/";

  // Entrées du menu déroulant :
  //  - les catégories du 1er menu (À partager, Currys & grillades...)
  //  - puis les autres menus (Brunch...) en une entrée chacun
  const [principal, ...autresMenus] = t.carte.onglets;
  const entreesCarte = [
    ...principal.categories.map((cat) => ({
      nom: cat.nom,
      ancre: slugify(cat.nom),
    })),
    ...autresMenus.map((menu) => ({ nom: menu.nom, ancre: menu.id })),
  ];

  return (
    <header className={`pnav ${solide ? "pnav--solid" : ""}`}>
      <div className="pnav__inner">
        <Link to="/" className="pnav__brand">
          {config.nom}
        </Link>

        <nav className="pnav__links">
          <Link to="/histoire">{t.nav.histoire}</Link>

          {/* --- Menu déroulant "La carte" --- */}
          <div className="pdrop">
            <Link to="/carte" className="pdrop__trigger">
              {t.nav.carte}
              <span className="pdrop__chevron" aria-hidden="true">
                ▾
              </span>
            </Link>
            <div className="pdrop__menu">
              {entreesCarte.map((entree) => (
                <Link key={entree.ancre} to={`/carte#${entree.ancre}`}>
                  {entree.nom}
                </Link>
              ))}
            </div>
          </div>

          <Link to="/galerie">{t.nav.galerie}</Link>
        </nav>

        <div className="pnav__actions">
          <button
            className="pnav__lang"
            onClick={() => setLang(lang === "fr" ? "en" : "fr")}
            aria-label="Changer de langue"
          >
            {lang === "fr" ? "EN" : "FR"}
          </button>
          <a
            href={config.reservationUrl}
            target="_blank"
            rel="noreferrer"
            className="pbtn pbtn--gold"
          >
            {t.nav.reserver}
          </a>
        </div>
      </div>
    </header>
  );
}
